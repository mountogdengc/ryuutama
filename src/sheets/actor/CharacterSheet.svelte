<script>
  import { onMount, onDestroy } from "svelte";
  import { rollCheck, getRollData, gatherModifiers } from "../../combat/rolls.mjs";
  import EquipmentList from "./components/EquipmentList.svelte";
  import InventoryList from "./components/InventoryList.svelte";
  import SpellList from "./components/SpellList.svelte";
  import LevelProgression from "./components/LevelProgression.svelte";
  import TravelBonuses from "./components/TravelBonuses.svelte";

  let { actor, sheet } = $props();
  let activeTab = $state("equipped");
  let tick = $state(0);

  const tabs = [
    { id: "equipped", label: "Equipment" },
    { id: "items", label: "Items" },
    { id: "spells", label: "Spells" },
    { id: "description", label: "Description" },
    { id: "level", label: "Level" },
  ];

  function onActorUpdate(doc) {
    if (doc.id === actor.id) tick++;
  }

  function onItemChange(item) {
    if (item.parent?.id === actor.id) tick++;
  }

  onMount(() => {
    Hooks.on("updateActor", onActorUpdate);
    Hooks.on("createItem", onItemChange);
    Hooks.on("updateItem", onItemChange);
    Hooks.on("deleteItem", onItemChange);
  });

  onDestroy(() => {
    Hooks.off("updateActor", onActorUpdate);
    Hooks.off("createItem", onItemChange);
    Hooks.off("updateItem", onItemChange);
    Hooks.off("deleteItem", onItemChange);
  });

  let data = $derived.by(() => {
    tick;
    return {
      name: actor.name,
      img: actor.img,
      system: actor.system,
      items: actor.items,
    };
  });

  // --- Header actions ---

  async function rollStat(event, statKey) {
    const sys = actor.system;
    const rollData = getRollData(actor);
    const statVal = rollData[statKey];
    const alt = event.altKey;
    const formula = alt ? `1d${statVal}` : `2d${statVal}`;
    const flavor = `${actor.name} — ${statKey.toUpperCase()} roll`;

    if (event.ctrlKey) {
      // Concentration: show dialog
      await showConcentrationDialog(formula, flavor, rollData);
    } else {
      await rollCheck(formula, flavor, [], rollData);
    }
  }

  async function showConcentrationDialog(formula, flavor, rollData) {
    const result = await foundry.applications.api.DialogV2.wait({
      window: { title: "Concentration" },
      content: "<p>Choose concentration option:</p>",
      buttons: [
        { action: "mp", label: "Use MP", default: false },
        { action: "fumble", label: "Use Fumble", default: false },
        { action: "both", label: "Use Both", default: false },
        { action: "normal", label: "Normal Roll", default: true },
      ],
    });

    let concentrationBonus = 0;
    if (result === "mp" || result === "both") {
      const currMp = actor.system.mp.value;
      if (currMp > 0) {
        await actor.update({ "system.mp.value": currMp - Math.ceil(currMp / 2) });
        concentrationBonus += 1;
      } else {
        ui.notifications.warn("Not enough MP for concentration.");
      }
    }
    if (result === "fumble" || result === "both") {
      const currFumble = actor.system.attributes.fumble;
      if (currFumble > 0) {
        await actor.update({ "system.attributes.fumble": currFumble - 1 });
        concentrationBonus += 1;
      } else {
        ui.notifications.warn("No fumble points to spend.");
      }
    }

    const modifiers = concentrationBonus > 0 ? [concentrationBonus] : [];
    const concFlavor = concentrationBonus > 0 ? `${flavor}<br /><strong>CONCENTRATING</strong>` : flavor;
    await rollCheck(formula, concFlavor, modifiers, rollData);
  }

  async function rollJourneyCheck(formula, label) {
    const rollData = getRollData(actor);
    const mods = gatherModifiers(actor);
    const modifiers = [...mods.modifiers];
    if (mods.terrainBonus) modifiers.push(mods.terrainBonus);
    if (mods.weatherBonus) modifiers.push(mods.weatherBonus);
    if (mods.journeyBonus) modifiers.push(mods.journeyBonus);
    if (mods.armorPenalty) modifiers.push(mods.armorPenalty);
    if (mods.conditionPenalty) modifiers.push(mods.conditionPenalty);
    const flavor = `${actor.name} — ${label}`;
    await rollCheck(formula, flavor, modifiers, rollData, mods.journeyDC || undefined);
  }

  async function restoreHP() {
    await actor.update({ "system.hp.value": actor.system.hp.max });
  }

  async function restoreMP() {
    await actor.update({ "system.mp.value": actor.system.mp.max });
  }

  async function updateField(path, value) {
    const numVal = Number(value);
    await actor.update({ [path]: isNaN(numVal) ? value : numVal });
  }

  async function updateName(value) {
    await actor.update({ name: value });
  }

  async function updateBiography(value) {
    await actor.update({ "system.biography": value });
  }

  async function changePortrait() {
    const fp = new FilePicker({
      type: "image",
      current: actor.img,
      callback: (path) => actor.update({ img: path }),
    });
    fp.browse();
  }
</script>

<div class="ryuutama-character-sheet flex flex-col h-full overflow-hidden">
  <!-- HEADER -->
  <header class="character-header bg-parchment border-b-2 border-leather p-2">
    <div class="header-top flex gap-3 items-start">
      <!-- Portrait -->
      <button
        class="portrait-btn border-2 border-leather rounded overflow-hidden flex-shrink-0 cursor-pointer hover:border-rust"
        onclick={changePortrait}
        title="Change Portrait"
        type="button"
      >
        <img src={data.img} alt={data.name} class="w-20 h-20 object-cover block" />
      </button>

      <!-- Name + Level/XP -->
      <div class="flex flex-col gap-1 flex-1 min-w-0">
        <input
          class="charname-input text-xl font-bold bg-transparent border-b border-leather-dark w-full text-leather-dark"
          type="text"
          value={data.name}
          onchange={(e) => updateName(e.target.value)}
          placeholder="Character Name"
        />
        <div class="flex gap-2 text-sm text-leather flex-wrap">
          <span class="flex items-center gap-1">
            <span class="font-semibold">Level</span>
            <span class="text-leather-dark">{data.system.attributes.level}</span>
          </span>
          <span class="flex items-center gap-1">
            <span class="font-semibold">XP</span>
            <input
              class="text-center bg-transparent border-b border-parchment text-leather-dark"
              style="width: 4rem;"
              type="number"
              value={data.system.attributes.experience}
              onchange={(e) => updateField("system.attributes.experience", e.target.value)}
            />
          </span>
          <span class="flex items-center gap-1">
            <span class="font-semibold">Gold</span>
            <input
              class="text-center bg-transparent border-b border-parchment text-leather-dark"
              style="width: 4rem;"
              type="number"
              value={data.system.gold}
              onchange={(e) => updateField("system.gold", e.target.value)}
            />
          </span>
          <span class="flex items-center gap-1">
            <span class="font-semibold">Cond</span>
            <input
              class="text-center bg-transparent border-b border-parchment text-leather-dark"
              style="width: 2.5rem;"
              type="number"
              value={data.system.attributes.condition.value}
              onchange={(e) => updateField("system.attributes.condition.value", e.target.value)}
            />
          </span>
          <span class="flex items-center gap-1">
            <span class="font-semibold">Fumble</span>
            <input
              class="text-center bg-transparent border-b border-parchment text-leather-dark"
              style="width: 2.5rem;"
              type="number"
              value={data.system.attributes.fumble}
              onchange={(e) => updateField("system.attributes.fumble", e.target.value)}
            />
          </span>
        </div>
      </div>
    </div>

    <!-- Stats row -->
    <div class="stats-row flex gap-1 mt-2 flex-wrap items-end">
      {#each [["str","STR"],["dex","DEX"],["int","INT"],["spi","SPI"]] as [key, label]}
        <button
          class="stat-block flex flex-col items-center bg-ivory border border-leather rounded px-2 py-1 cursor-pointer hover:border-rust hover:text-rust rollable"
          title="Click: 2d{data.system.attributes[key].value}, Alt+Click: 1d"
          onclick={(e) => rollStat(e, key)}
          type="button"
        >
          <span class="text-xs font-bold text-leather uppercase">{label}</span>
          <span class="text-base font-semibold text-leather-dark">d{data.system.attributes[key].value}</span>
          <input
            class="attribute-bonus-cb"
            type="checkbox"
            title="Bonus die"
            checked={data.system.attributes[key].bonus}
            onclick={(e) => e.stopPropagation()}
            onchange={(e) => updateField(`system.attributes.${key}.bonus`, e.target.checked)}
          />
        </button>
      {/each}

      <!-- HP bar -->
      <div class="resource-bar flex flex-col items-center bg-ivory border border-leather rounded px-2 py-1">
        <button class="text-xs font-bold text-leather uppercase hover:text-rust" onclick={restoreHP} type="button" title="Restore HP">HP</button>
        <div class="flex items-center gap-1">
          <input
            class="w-10 text-center bg-transparent border-b border-parchment text-leather-dark text-sm"
            type="number"
            value={data.system.hp.value}
            onchange={(e) => updateField("system.hp.value", e.target.value)}
          />
          <span class="text-leather text-sm">/</span>
          <span class="text-leather-dark text-sm font-semibold">{data.system.hp.max}</span>
        </div>
      </div>

      <!-- MP bar -->
      <div class="resource-bar flex flex-col items-center bg-ivory border border-leather rounded px-2 py-1">
        <button class="text-xs font-bold text-leather uppercase hover:text-rust" onclick={restoreMP} type="button" title="Restore MP">MP</button>
        <div class="flex items-center gap-1">
          <input
            class="w-10 text-center bg-transparent border-b border-parchment text-leather-dark text-sm"
            type="number"
            value={data.system.mp.value}
            onchange={(e) => updateField("system.mp.value", e.target.value)}
          />
          <span class="text-leather text-sm">/</span>
          <span class="text-leather-dark text-sm font-semibold">{data.system.mp.max}</span>
        </div>
      </div>

      <!-- Carry -->
      <div class="resource-bar flex flex-col items-center bg-ivory border border-leather rounded px-2 py-1">
        <span class="text-xs font-bold text-leather uppercase">Carry</span>
        <span class="text-sm text-leather-dark">{data.system.attributes.capacity.value}/{data.system.attributes.capacity.max}</span>
      </div>
    </div>

    <!-- Journey check buttons -->
    <div class="journey-row flex gap-1 mt-2 flex-wrap">
      <button
        class="journey-btn text-xs bg-teal text-ivory border border-teal-dark rounded px-2 py-1 hover:bg-teal-dark"
        onclick={() => rollJourneyCheck("1d@str + 1d@dex", "Travel Check")}
        type="button"
      >Travel [STR+DEX]</button>
      <button
        class="journey-btn text-xs bg-teal text-ivory border border-teal-dark rounded px-2 py-1 hover:bg-teal-dark"
        onclick={() => rollJourneyCheck("1d@int + 1d@int", "Direction Check")}
        type="button"
      >Direction [INT+INT]</button>
      <button
        class="journey-btn text-xs bg-teal text-ivory border border-teal-dark rounded px-2 py-1 hover:bg-teal-dark"
        onclick={() => rollJourneyCheck("1d@dex + 1d@int", "Camp Check")}
        type="button"
      >Camp [DEX+INT]</button>
      <button
        class="journey-btn text-xs bg-leather text-ivory border border-leather-dark rounded px-2 py-1 hover:bg-leather-dark"
        onclick={() => rollCheck("1d@str + 1d@spi", `${actor.name} — Condition Check`, [], getRollData(actor))}
        type="button"
      >Condition [STR+SPI]</button>
      <button
        class="journey-btn text-xs bg-leather text-ivory border border-leather-dark rounded px-2 py-1 hover:bg-leather-dark"
        onclick={() => rollCheck("1d@dex + 1d@int", `${actor.name} — Initiative`, [], getRollData(actor))}
        type="button"
      >Initiative [DEX+INT]</button>
    </div>
  </header>

  <!-- TAB BAR -->
  <nav class="tab-bar flex border-b-2 border-parchment bg-ivory">
    {#each tabs as tab}
      <button
        class="tab-button px-3 py-2 text-sm border-b-2 border-transparent"
        class:active={activeTab === tab.id}
        onclick={() => activeTab = tab.id}
        type="button"
      >
        {tab.label}
      </button>
    {/each}
  </nav>

  <!-- TAB CONTENT -->
  <div class="tab-content flex-1 overflow-y-auto p-2 bg-ivory">
    {#if activeTab === "equipped"}
      <EquipmentList {actor} {tick} />
    {:else if activeTab === "items"}
      <InventoryList {actor} {tick} />
    {:else if activeTab === "spells"}
      <SpellList {actor} {tick} />
    {:else if activeTab === "description"}
      <div class="description-tab p-2">
        <label class="text-sm font-semibold text-leather block mb-1" for="biography-textarea">Biography</label>
        <textarea id="biography-textarea"
          class="w-full h-64 p-2 bg-parchment border border-leather rounded text-leather-dark text-sm resize-y"
          value={data.system.biography}
          onchange={(e) => updateBiography(e.target.value)}
          placeholder="Enter character biography..."
        ></textarea>
      </div>
    {:else if activeTab === "level"}
      <LevelProgression {actor} {tick} />
    {/if}
  </div>
</div>
