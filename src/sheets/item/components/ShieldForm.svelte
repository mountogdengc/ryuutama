<script>
  import EnchantmentList from "./EnchantmentList.svelte";

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

<div class="shield-form space-y-3 text-sm">
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

  <!-- Equip slot (always 1hand for shields) -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Equip Slot</span>
    <select class="form-input" value={data.equip}
      onchange={(e) => item.update({ "system.equip": e.target.value })}>
      <option value="1hand">1-Hand</option>
    </select>
  </label>

  <!-- Defense, Penalty, Dodge -->
  <div class="grid grid-cols-3 gap-2">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Defense</span>
      <input type="number" class="form-input" value={data.defense}
        onchange={(e) => update("system.defense", e.target.value)} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Penalty</span>
      <input type="number" class="form-input" value={data.penalty}
        onchange={(e) => update("system.penalty", e.target.value)} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Dodge</span>
      <input type="number" class="form-input" value={data.dodge}
        onchange={(e) => update("system.dodge", e.target.value)} />
    </label>
  </div>

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

  <EnchantmentList {item} {tick} />
</div>
