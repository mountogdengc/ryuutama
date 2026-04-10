<script>
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

<div class="container-form space-y-3 text-sm">
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

  <!-- Capacity -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Capacity (canHold)</span>
    <input type="number" class="form-input" value={data.canHold}
      onchange={(e) => update("system.canHold", e.target.value)} />
  </label>

  <!-- Given name -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Given Name</span>
    <input type="text" class="form-input" value={data.givenName}
      onchange={(e) => item.update({ "system.givenName": e.target.value })} />
  </label>

  <!-- Description -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Description</span>
    <textarea class="form-input resize-y h-20" value={data.description}
      onchange={(e) => item.update({ "system.description": e.target.value })}></textarea>
  </label>

  <HoldingList {item} {tick} />
</div>
