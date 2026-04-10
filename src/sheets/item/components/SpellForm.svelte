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

<div class="spell-form space-y-3 text-sm">
  <!-- Level and Cost -->
  <div class="grid grid-cols-2 gap-2">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Level</span>
      <select class="form-input" value={data.level}
        onchange={(e) => item.update({ "system.level": e.target.value })}>
        <option value="low">Low</option>
        <option value="mid">Mid</option>
        <option value="high">High</option>
      </select>
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">MP Cost</span>
      <input type="number" class="form-input" value={data.cost}
        onchange={(e) => update("system.cost", e.target.value)} />
    </label>
  </div>

  <!-- Season -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Season</span>
    <select class="form-input" value={data.season}
      onchange={(e) => item.update({ "system.season": e.target.value })}>
      <option value="none">None (Any Season)</option>
      <option value="spring">Spring</option>
      <option value="summer">Summer</option>
      <option value="fall">Fall</option>
      <option value="winter">Winter</option>
    </select>
  </label>

  <!-- Ritual -->
  <label class="flex items-center gap-2">
    <input type="checkbox" checked={data.ritual}
      onchange={(e) => item.update({ "system.ritual": e.target.checked })} />
    <span class="text-xs text-leather font-semibold">Ritual</span>
  </label>

  <!-- Duration, Target, Range -->
  <div class="grid grid-cols-3 gap-2">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Duration</span>
      <input type="text" class="form-input" value={data.duration}
        onchange={(e) => item.update({ "system.duration": e.target.value })} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Target</span>
      <input type="text" class="form-input" value={data.target}
        onchange={(e) => item.update({ "system.target": e.target.value })} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Range</span>
      <input type="text" class="form-input" value={data.range}
        onchange={(e) => item.update({ "system.range": e.target.value })} />
    </label>
  </div>

  <!-- Description -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Description</span>
    <textarea class="form-input resize-y h-24" value={data.description}
      onchange={(e) => item.update({ "system.description": e.target.value })}></textarea>
  </label>
</div>
