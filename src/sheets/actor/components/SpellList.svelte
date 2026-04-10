<script>
  import { rollCheck, getRollData } from "../../../combat/rolls.mjs";

  let { actor, tick } = $props();

  const SPELL_LEVELS = ["low", "mid", "high"];

  let data = $derived.by(() => {
    tick;
    const spells = actor.items.filter((i) => i.type === "spell");
    const grouped = {};
    for (const level of SPELL_LEVELS) {
      grouped[level] = spells.filter((s) => s.system.level === level);
    }
    return { grouped };
  });

  async function castSpell(spell) {
    const cost = spell.system.cost || 2;
    const currMp = actor.system.mp.value;
    if (currMp < cost) {
      ui.notifications.error(`Not enough MP to cast ${spell.name} (costs ${cost} MP).`);
      return;
    }

    await actor.update({ "system.mp.value": currMp - cost });

    const rollData = getRollData(actor);
    const intVal = rollData.int;
    const spiVal = rollData.spi;
    const formula = `1d${intVal} + 1d${spiVal}`;
    const flavor = `${actor.name} casts ${spell.name} (cost: ${cost} MP)`;
    await rollCheck(formula, flavor, [], rollData);
  }

  function editItem(item) {
    item.sheet.render(true);
  }

  async function deleteItem(item) {
    await item.delete();
  }

  async function createSpell() {
    await actor.createEmbeddedDocuments("Item", [
      { name: "New Spell", type: "spell" },
    ]);
  }

  let expandedSpells = $state(new Set());

  function toggleExpand(id) {
    const next = new Set(expandedSpells);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    expandedSpells = next;
  }
</script>

<div class="spell-list space-y-4">
  <div class="flex justify-end">
    <button
      class="text-xs text-teal hover:text-teal-dark"
      onclick={createSpell}
      type="button"
    >
      <i class="fas fa-plus"></i> Add Spell
    </button>
  </div>

  {#each SPELL_LEVELS as level}
    <section>
      <h3 class="text-sm font-bold text-leather uppercase border-b border-parchment pb-1 mb-1 capitalize">{level} Level Spells</h3>
      {#if data.grouped[level].length === 0}
        <p class="text-xs text-leather italic">No {level} level spells.</p>
      {:else}
        {#each data.grouped[level] as spell}
          <div class="spell-row border-t border-parchment">
            <div class="flex items-center gap-2 py-1 hover:bg-parchment/40">
              <button
                class="flex-shrink-0 cursor-pointer"
                onclick={() => castSpell(spell)}
                type="button"
                title="Cast spell (rolls 1d@int + 1d@spi, costs {spell.system.cost} MP)"
              >
                <img src={spell.img} alt={spell.name} class="w-6 h-6 object-contain hover:ring-2 ring-teal rounded" />
              </button>
              <button
                class="flex-1 text-xs text-leather-dark font-medium text-left hover:text-rust"
                onclick={() => toggleExpand(spell.id)}
                type="button"
              >
                {spell.name}
              </button>
              <span class="text-xs text-leather">{spell.system.cost} MP</span>
              <span class="text-xs text-leather capitalize">{spell.system.season}</span>
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
            {#if expandedSpells.has(spell.id)}
              <div class="spell-details pl-8 pb-2 text-xs text-leather-dark space-y-1 bg-parchment/30 rounded">
                <div class="flex gap-4 flex-wrap">
                  <span><strong>Cost:</strong> {spell.system.cost} MP</span>
                  {#if spell.system.duration}
                    <span><strong>Duration:</strong> {spell.system.duration}</span>
                  {/if}
                  {#if spell.system.target}
                    <span><strong>Target:</strong> {spell.system.target}</span>
                  {/if}
                  {#if spell.system.range}
                    <span><strong>Range:</strong> {spell.system.range}</span>
                  {/if}
                </div>
                {#if spell.system.description}
                  <p class="text-leather">{@html spell.system.description}</p>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    </section>
  {/each}
</div>
