<script>
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

<div class="feature-form space-y-3 text-sm">
  <!-- Class -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Class</span>
    <input type="text" class="form-input" value={data.class}
      onchange={(e) => item.update({ "system.class": e.target.value })} />
  </label>

  <!-- Bonuses -->
  <div class="grid grid-cols-3 gap-2">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Journey Bonus</span>
      <input type="number" class="form-input" value={data.journey}
        onchange={(e) => update("system.journey", e.target.value)} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Condition Bonus</span>
      <input type="number" class="form-input" value={data.condition}
        onchange={(e) => update("system.condition", e.target.value)} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Capacity Bonus</span>
      <input type="number" class="form-input" value={data.capacity}
        onchange={(e) => update("system.capacity", e.target.value)} />
    </label>
  </div>

  <!-- Stat and Mastered -->
  <div class="grid grid-cols-2 gap-2">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Stat</span>
      <select class="form-input" value={data.stat}
        onchange={(e) => item.update({ "system.stat": e.target.value })}>
        <option value="">None</option>
        <option value="str">STR</option>
        <option value="dex">DEX</option>
        <option value="int">INT</option>
        <option value="spi">SPI</option>
      </select>
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Mastered Weapon</span>
      <select class="form-input" value={data.mastered}
        onchange={(e) => item.update({ "system.mastered": e.target.value })}>
        <option value="none">None</option>
        <option value="lightblade">Light Blade</option>
        <option value="blade">Blade</option>
        <option value="polearm">Polearm</option>
        <option value="axe">Axe</option>
        <option value="bow">Bow</option>
        <option value="unarmed">Unarmed</option>
      </select>
    </label>
  </div>

  <!-- Farmer checkbox -->
  <label class="flex items-center gap-2">
    <input type="checkbox" checked={data.farmer}
      onchange={(e) => item.update({ "system.farmer": e.target.checked })} />
    <span class="text-xs text-leather font-semibold">Farmer</span>
  </label>

  <!-- Description -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Description</span>
    <textarea class="form-input resize-y h-24" value={data.description}
      onchange={(e) => item.update({ "system.description": e.target.value })}></textarea>
  </label>
</div>
