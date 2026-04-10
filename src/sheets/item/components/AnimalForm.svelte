<script>
  import EnchantmentList from "./EnchantmentList.svelte";
  import HoldingList from "./HoldingList.svelte";

  let { item, tick, sheet } = $props();

  let data = $derived.by(() => {
    tick;
    return item.system;
  });

  function update(path, value) {
    const numVal = Number(value);
    item.update({ [path]: isNaN(numVal) ? value : numVal });
  }
</script>

<div class="animal-form space-y-3 text-sm">
  <!-- Common fields -->
  <div class="grid grid-cols-3 gap-2">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Price</span>
      <input type="number" class="form-input" value={data.price}
        onchange={(e) => update("system.price", e.target.value)} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Size</span>
      <input type="number" class="form-input" value={data.size}
        onchange={(e) => update("system.size", e.target.value)} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Durability</span>
      <input type="number" class="form-input" value={data.durability}
        onchange={(e) => update("system.durability", e.target.value)} />
    </label>
  </div>

  <!-- Equip slot, Bonus, Capacity -->
  <div class="grid grid-cols-3 gap-2">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Equip Slot</span>
      <input type="text" class="form-input" value={data.equip}
        onchange={(e) => item.update({ "system.equip": e.target.value })} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Item Bonus</span>
      <input type="number" class="form-input" value={data.itemBonus}
        onchange={(e) => update("system.itemBonus", e.target.value)} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Capacity (canHold)</span>
      <input type="number" class="form-input" value={data.canHold}
        onchange={(e) => update("system.canHold", e.target.value)} />
    </label>
  </div>

  <!-- Given name -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Given Name</span>
    <input type="text" class="form-input" value={data.givenName}
      onchange={(e) => item.update({ "system.givenName": e.target.value })} />
  </label>

  <!-- Terrain checkboxes -->
  <div class="terrain-section">
    <h4 class="text-xs font-bold text-leather uppercase border-b border-parchment pb-1 mb-2">Terrain Bonuses</h4>
    <div class="grid grid-cols-2 gap-1">
      {#each Array.from({length: 16}, (_, i) => i + 1) as idx}
        {@const name = game.settings.get("ryuutama", `terrainName${idx}`)}
        {#if name}
          <label class="flex items-center gap-1 text-xs">
            <input type="checkbox" checked={data[`terrain${idx}`]}
              onchange={() => item.update({ [`system.terrain${idx}`]: !data[`terrain${idx}`] })} />
            <span class="text-leather">{name}</span>
          </label>
        {/if}
      {/each}
    </div>
  </div>

  <!-- Weather checkboxes -->
  <div class="weather-section">
    <h4 class="text-xs font-bold text-leather uppercase border-b border-parchment pb-1 mb-2">Weather Bonuses</h4>
    <div class="grid grid-cols-2 gap-1">
      {#each Array.from({length: 16}, (_, i) => i + 1) as idx}
        {@const name = game.settings.get("ryuutama", `weatherName${idx}`)}
        {#if name}
          <label class="flex items-center gap-1 text-xs">
            <input type="checkbox" checked={data[`weather${idx}`]}
              onchange={() => item.update({ [`system.weather${idx}`]: !data[`weather${idx}`] })} />
            <span class="text-leather">{name}</span>
          </label>
        {/if}
      {/each}
    </div>
  </div>

  <!-- Description -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Description</span>
    <textarea class="form-input resize-y h-20" value={data.description}
      onchange={(e) => item.update({ "system.description": e.target.value })}></textarea>
  </label>

  <HoldingList {item} {tick} />
  <EnchantmentList {item} {tick} />
</div>
