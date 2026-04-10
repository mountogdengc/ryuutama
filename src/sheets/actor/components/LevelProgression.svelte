<script>
  import { RYUU } from "../../../config.mjs";

  let { actor, tick } = $props();

  let data = $derived.by(() => {
    tick;
    return {
      system: actor.system,
      level: actor.system.attributes.level,
      levels: actor.system.levels || {},
    };
  });

  const DICE_OPTIONS = [4, 6, 8, 10, 12];
  const EFFECT_KEYS = ["injury", "poison", "sickness", "exhaustion", "muddled", "shock"];

  async function updateLevelField(levelKey, field, value) {
    const numVal = Number(value);
    await actor.update({
      [`system.levels.${levelKey}.${field}`]: isNaN(numVal) ? value : numVal,
    });
  }

  async function updateStatBase(stat, value) {
    await actor.update({ [`system.attributes.${stat}.base`]: Number(value) });
  }

  let levelTotals = $derived.by(() => {
    tick;
    const levels = actor.system.levels || {};
    let hp = 0;
    let mp = 0;
    for (const key of Object.keys(levels)) {
      const lvl = levels[key];
      if (lvl?.points) {
        hp += Number(lvl.points.hp || 0);
        mp += Number(lvl.points.mp || 0);
      }
    }
    return { hp, mp };
  });
</script>

<div class="level-progression space-y-2 text-xs">
  <!-- Stat bases (always editable) -->
  <section class="mb-3">
    <h3 class="text-sm font-bold text-leather uppercase border-b border-parchment pb-1 mb-2">Base Attributes</h3>
    <div class="flex gap-3 flex-wrap">
      {#each [["str","STR"],["dex","DEX"],["int","INT"],["spi","SPI"]] as [key, label]}
        {@const selectId = `stat-base-${key}`}
        <div class="flex flex-col items-center">
          <label class="font-semibold text-leather mb-1" for={selectId}>{label}</label>
          <select
            id={selectId}
            class="border border-parchment rounded bg-ivory text-leather-dark px-1 py-0.5"
            value={data.system.attributes[key].base}
            onchange={(e) => updateStatBase(key, e.target.value)}
          >
            {#each DICE_OPTIONS as d}
              <option value={d}>d{d}</option>
            {/each}
          </select>
        </div>
      {/each}
    </div>
  </section>

  <!-- Level-by-level breakdown -->
  <section>
    <h3 class="text-sm font-bold text-leather uppercase border-b border-parchment pb-1 mb-2">Level Progression</h3>
    <div class="space-y-3">
      {#each Array.from({length: RYUU.LEVEL_MAX}, (_, i) => i + 1) as lvl}
        {@const isUnlocked = lvl <= data.level}
        {@const levelData = data.levels[lvl] || {}}
        <div class="level-row border border-parchment rounded p-2 {isUnlocked ? 'bg-ivory' : 'bg-parchment/20 opacity-60'}">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-bold text-leather-dark">Level {lvl}</span>
            {#if !isUnlocked}
              <span class="text-leather italic">(locked)</span>
            {/if}
          </div>

          {#if isUnlocked}
            <!-- HP/MP point distribution -->
            <div class="flex gap-3 flex-wrap">
              <label class="flex items-center gap-1">
                <span class="text-leather">HP points:</span>
                <input
                  type="number"
                  class="w-12 border border-parchment rounded bg-ivory text-leather-dark text-center px-1"
                  min="0"
                  max={RYUU.POINT_MAX}
                  value={levelData.points?.hp ?? 0}
                  onchange={(e) => updateLevelField(lvl, "points.hp", e.target.value)}
                />
              </label>
              <label class="flex items-center gap-1">
                <span class="text-leather">MP points:</span>
                <input
                  type="number"
                  class="w-12 border border-parchment rounded bg-ivory text-leather-dark text-center px-1"
                  min="0"
                  max={RYUU.POINT_MAX}
                  value={levelData.points?.mp ?? 0}
                  onchange={(e) => updateLevelField(lvl, "points.mp", e.target.value)}
                />
              </label>
              {#if levelData.specialty}
                <span class="text-leather">Specialty: <strong>{levelData.specialty}</strong></span>
              {/if}
              {#if levelData.immunity}
                <span class="text-leather">Immunity: <strong>{levelData.immunity}</strong></span>
              {/if}
              {#if levelData.mastery}
                <span class="text-leather">Mastery: <strong>{levelData.mastery}</strong></span>
              {/if}
            </div>

            <!-- Specialty selection for certain levels -->
            {#if lvl === 2 || lvl === 5 || lvl === 8}
              {@const specId = `specialty-${lvl}`}
              <div class="mt-1 flex items-center gap-1">
                <label class="text-leather" for={specId}>Specialty terrain/weather:</label>
                <input
                  id={specId}
                  type="text"
                  class="border border-parchment rounded bg-ivory text-leather-dark px-1 py-0.5 w-32"
                  value={levelData.specialty || ""}
                  onchange={(e) => updateLevelField(lvl, "specialty", e.target.value)}
                  placeholder="e.g. terrain1"
                />
              </div>
            {/if}

            <!-- Immunity selection for certain levels -->
            {#if lvl === 3 || lvl === 7}
              {@const immId = `immunity-${lvl}`}
              <div class="mt-1 flex items-center gap-1">
                <label class="text-leather" for={immId}>Immunity:</label>
                <select
                  id={immId}
                  class="border border-parchment rounded bg-ivory text-leather-dark px-1 py-0.5"
                  value={levelData.immunity || ""}
                  onchange={(e) => updateLevelField(lvl, "immunity", e.target.value)}
                >
                  <option value="">— None —</option>
                  {#each EFFECT_KEYS as eff}
                    <option value={eff}>{eff.charAt(0).toUpperCase() + eff.slice(1)}</option>
                  {/each}
                </select>
              </div>
            {/if}

            <!-- Mastery for level 4+ -->
            {#if lvl >= 4 && lvl % 2 === 0}
              {@const mastId = `mastery-${lvl}`}
              <div class="mt-1 flex items-center gap-1">
                <label class="text-leather" for={mastId}>Mastery:</label>
                <input
                  id={mastId}
                  type="text"
                  class="border border-parchment rounded bg-ivory text-leather-dark px-1 py-0.5 w-32"
                  value={levelData.mastery || ""}
                  onchange={(e) => updateLevelField(lvl, "mastery", e.target.value)}
                  placeholder="Class mastery"
                />
              </div>
            {/if}
          {:else}
            <p class="text-leather italic text-xs">Reach level {lvl} to unlock.</p>
          {/if}
        </div>
      {/each}
    </div>
  </section>

  <!-- Summary -->
  <section class="mt-3 p-2 bg-parchment/30 rounded border border-parchment">
    <h3 class="text-sm font-bold text-leather uppercase mb-1">Summary</h3>
    <div class="flex gap-4 text-xs">
      <span><strong>HP:</strong> {data.system.hp.max} (base {data.system.attributes.str.base * 2} + {levelTotals.hp} from levels)</span>
      <span><strong>MP:</strong> {data.system.mp.max} (base {data.system.attributes.spi.base * 2} + {levelTotals.mp} from levels)</span>
    </div>
  </section>
</div>
