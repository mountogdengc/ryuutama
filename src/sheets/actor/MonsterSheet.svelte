<script>
  import { onMount, onDestroy } from "svelte";
  import { rollCheck, replaceStatPlaceholders, getRollData } from "../../combat/rolls.mjs";

  let { actor, sheet } = $props();
  let activeTab = $state("items");
  let tick = $state(0);

  const SPELL_LEVELS = ["low", "mid", "high"];

  const tabs = [
    { id: "items", label: "Items" },
    { id: "description", label: "Description" },
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
    const items = actor.items.contents ?? [];
    const gear = items.filter((i) => i.type !== "spell");
    const spells = items.filter((i) => i.type === "spell");
    const spellsByLevel = {};
    for (const level of SPELL_LEVELS) {
      spellsByLevel[level] = spells.filter((s) => s.system.level === level);
    }
    return {
      name: actor.name,
      img: actor.img,
      system: actor.system,
      gear,
      spellsByLevel,
    };
  });

  // --- Header actions ---

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

  async function restoreHP() {
    await actor.update({ "system.hp.value": actor.system.hp.max });
  }

  async function restoreMP() {
    await actor.update({ "system.mp.value": actor.system.mp.max });
  }

  // --- Roll helpers ---

  async function rollAccuracy() {
    const formula = data.system.accuracy;
    if (!formula) return;
    const converted = replaceStatPlaceholders(formula);
    const rollData = getRollData(actor);
    const flavor = `${actor.name} — Accuracy`;
    await rollCheck(converted, flavor, [], rollData);
  }

  async function rollDamage() {
    const formula = data.system.damage;
    if (!formula) return;
    const converted = replaceStatPlaceholders(formula);
    const rollData = getRollData(actor);
    const flavor = `${actor.name} — Damage`;
    await rollCheck(converted, flavor, [], rollData);
  }

  async function rollAbilityAccuracy() {
    const formula = data.system.ability.accuracy;
    if (!formula) return;
    const converted = replaceStatPlaceholders(formula);
    const rollData = getRollData(actor);
    const flavor = `${actor.name} — Ability Accuracy`;
    await rollCheck(converted, flavor, [], rollData);
  }

  async function rollAbilityDamage() {
    const formula = data.system.ability.damage;
    if (!formula) return;
    const converted = replaceStatPlaceholders(formula);
    const rollData = getRollData(actor);
    const flavor = `${actor.name} — Ability Damage`;
    await rollCheck(converted, flavor, [], rollData);
  }

  // --- Item actions ---

  function editItem(item) {
    item.sheet.render(true);
  }

  async function deleteItem(item) {
    await item.delete();
  }

  async function createItem() {
    await Item.create({ name: "New Item", type: "item" }, { parent: actor });
  }

  async function createSpell() {
    await actor.createEmbeddedDocuments("Item", [
      { name: "New Spell", type: "spell" },
    ]);
  }
</script>

<div class="ryuutama-monster-sheet flex flex-col h-full overflow-hidden">
  <!-- HEADER -->
  <header class="monster-header bg-parchment border-b-2 border-leather p-2">
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

      <!-- Name + meta fields -->
      <div class="flex flex-col gap-1 flex-1 min-w-0">
        <input
          class="charname-input text-xl font-bold bg-transparent border-b border-leather-dark w-full text-leather-dark"
          type="text"
          value={data.name}
          onchange={(e) => updateName(e.target.value)}
          placeholder="Monster Name"
        />
        <div class="flex gap-2 flex-wrap text-sm text-leather mt-1">
          <label class="flex items-center gap-1">
            <span class="font-semibold text-xs">Lvl</span>
            <input
              class="w-10 text-center bg-transparent border-b border-parchment text-leather-dark"
              type="number"
              value={data.system.attributes.level}
              onchange={(e) => updateField("system.attributes.level", e.target.value)}
            />
          </label>
          <label class="flex items-center gap-1">
            <span class="font-semibold text-xs">#</span>
            <input
              class="w-10 text-center bg-transparent border-b border-parchment text-leather-dark"
              type="number"
              value={data.system.ref}
              onchange={(e) => updateField("system.ref", e.target.value)}
            />
          </label>
          <label class="flex items-center gap-1">
            <span class="font-semibold text-xs">Armor</span>
            <input
              class="w-12 text-center bg-transparent border-b border-parchment text-leather-dark"
              type="number"
              value={data.system.armor}
              onchange={(e) => updateField("system.armor", e.target.value)}
            />
          </label>
          <label class="flex items-center gap-1">
            <span class="font-semibold text-xs">Init</span>
            <input
              class="w-10 text-center bg-transparent border-b border-parchment text-leather-dark"
              type="number"
              value={data.system.attributes.initiative}
              onchange={(e) => updateField("system.attributes.initiative", e.target.value)}
            />
          </label>
          <label class="flex items-center gap-1">
            <span class="font-semibold text-xs">Cond</span>
            <input
              class="w-10 text-center bg-transparent border-b border-parchment text-leather-dark"
              type="number"
              value={data.system.attributes.condition.value}
              onchange={(e) => updateField("system.attributes.condition.value", e.target.value)}
            />
          </label>
          <label class="flex items-center gap-1">
            <span class="font-semibold text-xs">Season</span>
            <input
              class="w-20 bg-transparent border-b border-parchment text-leather-dark"
              type="text"
              value={data.system.season}
              onchange={(e) => updateField("system.season", e.target.value)}
            />
          </label>
          <label class="flex items-center gap-1">
            <span class="font-semibold text-xs">Habitat</span>
            <input
              class="w-20 bg-transparent border-b border-parchment text-leather-dark"
              type="text"
              value={data.system.habitat}
              onchange={(e) => updateField("system.habitat", e.target.value)}
            />
          </label>
        </div>
      </div>
    </div>

    <!-- Stats row -->
    <div class="stats-row flex gap-2 mt-2 flex-wrap">
      {#each [["str","STR"],["dex","DEX"],["int","INT"],["spi","SPI"]] as [key, label]}
        <div class="stat-block flex flex-col items-center bg-ivory border border-leather rounded px-2 py-1">
          <span class="text-xs font-bold text-leather uppercase">{label}</span>
          <select
            class="text-sm text-leather-dark bg-transparent text-center cursor-pointer"
            value={data.system.attributes[key].value}
            onchange={(e) => updateField(`system.attributes.${key}.value`, e.target.value)}
          >
            {#each [4, 6, 8, 10, 12] as face}
              <option value={face}>d{face}</option>
            {/each}
          </select>
        </div>
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
          <input
            class="w-10 text-center bg-transparent border-b border-parchment text-leather-dark text-sm"
            type="number"
            value={data.system.hp.max}
            onchange={(e) => updateField("system.hp.max", e.target.value)}
          />
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
          <input
            class="w-10 text-center bg-transparent border-b border-parchment text-leather-dark text-sm"
            type="number"
            value={data.system.mp.max}
            onchange={(e) => updateField("system.mp.max", e.target.value)}
          />
        </div>
      </div>
    </div>

    <!-- Combat rolls row -->
    <div class="combat-row flex gap-2 mt-2 flex-wrap items-end">
      <!-- Accuracy -->
      <div class="flex flex-col gap-0.5">
        <label class="text-xs font-semibold text-leather" for="monster-accuracy">Accuracy</label>
        <div class="flex items-center gap-1">
          <button
            class="text-leather hover:text-rust disabled:opacity-40"
            onclick={rollAccuracy}
            type="button"
            title="Roll Accuracy"
            disabled={!data.system.accuracy}
          >
            <i class="fas fa-dice"></i>
          </button>
          <input
            id="monster-accuracy"
            class="w-28 text-xs bg-transparent border-b border-parchment text-leather-dark"
            type="text"
            value={data.system.accuracy}
            onchange={(e) => updateField("system.accuracy", e.target.value)}
            placeholder="e.g. [STR]+[DEX]"
          />
        </div>
      </div>

      <!-- Damage -->
      <div class="flex flex-col gap-0.5">
        <label class="text-xs font-semibold text-leather" for="monster-damage">Damage</label>
        <div class="flex items-center gap-1">
          <button
            class="text-leather hover:text-rust disabled:opacity-40"
            onclick={rollDamage}
            type="button"
            title="Roll Damage"
            disabled={!data.system.damage}
          >
            <i class="fas fa-dice"></i>
          </button>
          <input
            id="monster-damage"
            class="w-28 text-xs bg-transparent border-b border-parchment text-leather-dark"
            type="text"
            value={data.system.damage}
            onchange={(e) => updateField("system.damage", e.target.value)}
            placeholder="e.g. [STR]"
          />
        </div>
      </div>

      <div class="border-l border-leather h-8 mx-1"></div>

      <!-- Ability Accuracy -->
      <div class="flex flex-col gap-0.5">
        <label class="text-xs font-semibold text-leather" for="monster-ability-accuracy">Ability Accuracy</label>
        <div class="flex items-center gap-1">
          <button
            class="text-leather hover:text-rust disabled:opacity-40"
            onclick={rollAbilityAccuracy}
            type="button"
            title="Roll Ability Accuracy"
            disabled={!data.system.ability.accuracy}
          >
            <i class="fas fa-dice"></i>
          </button>
          <input
            id="monster-ability-accuracy"
            class="w-28 text-xs bg-transparent border-b border-parchment text-leather-dark"
            type="text"
            value={data.system.ability.accuracy}
            onchange={(e) => updateField("system.ability.accuracy", e.target.value)}
            placeholder="e.g. [INT]"
          />
        </div>
      </div>

      <!-- Ability Damage -->
      <div class="flex flex-col gap-0.5">
        <label class="text-xs font-semibold text-leather" for="monster-ability-damage">Ability Damage</label>
        <div class="flex items-center gap-1">
          <button
            class="text-leather hover:text-rust disabled:opacity-40"
            onclick={rollAbilityDamage}
            type="button"
            title="Roll Ability Damage"
            disabled={!data.system.ability.damage}
          >
            <i class="fas fa-dice"></i>
          </button>
          <input
            id="monster-ability-damage"
            class="w-28 text-xs bg-transparent border-b border-parchment text-leather-dark"
            type="text"
            value={data.system.ability.damage}
            onchange={(e) => updateField("system.ability.damage", e.target.value)}
            placeholder="e.g. [STR]"
          />
        </div>
      </div>
    </div>

    <!-- Ability description -->
    <div class="mt-2">
      <label class="text-xs font-semibold text-leather block mb-0.5" for="monster-ability-description">Ability Description</label>
      <textarea
        id="monster-ability-description"
        class="w-full p-1 bg-parchment border border-leather rounded text-leather-dark text-xs resize-y"
        rows="2"
        value={data.system.ability.description}
        onchange={(e) => updateField("system.ability.description", e.target.value)}
        placeholder="Describe the monster's special ability..."
      ></textarea>
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
    {#if activeTab === "items"}
      <div class="items-tab space-y-4">
        <!-- Gear section -->
        <section>
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-sm font-bold text-leather uppercase">Gear</h3>
            <button
              class="text-xs text-teal hover:text-teal-dark"
              onclick={createItem}
              type="button"
              title="Add Item"
            >
              <i class="fas fa-plus"></i> Add
            </button>
          </div>
          {#if data.gear.length === 0}
            <p class="text-xs text-leather italic">No gear.</p>
          {:else}
            {#each data.gear as item}
              <div class="flex items-center gap-2 py-1 border-t border-parchment hover:bg-parchment/40">
                <img src={item.img} alt={item.name} class="w-6 h-6 object-contain flex-shrink-0" />
                <span class="flex-1 text-xs text-leather-dark font-medium">{item.name}</span>
                <span class="text-xs text-leather capitalize">{item.type}</span>
                <button
                  class="text-leather hover:text-rust text-xs mr-1"
                  onclick={() => editItem(item)}
                  type="button"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="text-leather hover:text-rust text-xs"
                  onclick={() => deleteItem(item)}
                  type="button"
                  title="Delete"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            {/each}
          {/if}
        </section>

        <!-- Spells by level -->
        {#each SPELL_LEVELS as level}
          <section>
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-sm font-bold text-leather uppercase border-b border-parchment pb-1 capitalize">{level} Level Spells</h3>
              {#if level === "low"}
                <button
                  class="text-xs text-teal hover:text-teal-dark"
                  onclick={createSpell}
                  type="button"
                  title="Add Spell"
                >
                  <i class="fas fa-plus"></i> Add Spell
                </button>
              {/if}
            </div>
            {#if data.spellsByLevel[level].length === 0}
              <p class="text-xs text-leather italic">No {level} level spells.</p>
            {:else}
              {#each data.spellsByLevel[level] as spell}
                <div class="flex items-center gap-2 py-1 border-t border-parchment hover:bg-parchment/40">
                  <img src={spell.img} alt={spell.name} class="w-6 h-6 object-contain flex-shrink-0" />
                  <span class="flex-1 text-xs text-leather-dark font-medium">{spell.name}</span>
                  {#if spell.system.cost}
                    <span class="text-xs text-leather">{spell.system.cost} MP</span>
                  {/if}
                  <button
                    class="text-leather hover:text-rust text-xs mr-1"
                    onclick={() => editItem(spell)}
                    type="button"
                    title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="text-leather hover:text-rust text-xs"
                    onclick={() => deleteItem(spell)}
                    type="button"
                    title="Delete"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              {/each}
            {/if}
          </section>
        {/each}
      </div>

    {:else if activeTab === "description"}
      <div class="description-tab p-2">
        <label class="text-sm font-semibold text-leather block mb-1" for="monster-biography-textarea">Biography / Notes</label>
        <textarea
          id="monster-biography-textarea"
          class="w-full h-64 p-2 bg-parchment border border-leather rounded text-leather-dark text-sm resize-y"
          value={data.system.biography}
          onchange={(e) => updateBiography(e.target.value)}
          placeholder="Enter monster description and notes..."
        ></textarea>
      </div>
    {/if}
  </div>
</div>
