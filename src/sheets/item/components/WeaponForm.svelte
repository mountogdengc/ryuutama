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

<div class="weapon-form space-y-3 text-sm">
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

  <!-- Equip slot -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Equip Slot</span>
    <select class="form-input" value={data.equip}
      onchange={(e) => item.update({ "system.equip": e.target.value })}>
      <option value="1hand">1-Hand</option>
      <option value="2hand">2-Hand</option>
    </select>
  </label>

  <!-- Weapon class -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Weapon Class</span>
    <select class="form-input" value={data.class}
      onchange={(e) => item.update({ "system.class": e.target.value })}>
      <option value="lightblade">Light Blade</option>
      <option value="blade">Blade</option>
      <option value="polearm">Polearm</option>
      <option value="axe">Axe</option>
      <option value="bow">Bow</option>
      <option value="unarmed">Unarmed</option>
    </select>
  </label>

  <!-- Accuracy -->
  <div class="grid grid-cols-2 gap-2">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Accuracy Formula</span>
      <input type="text" class="form-input" value={data.accuracy}
        onchange={(e) => item.update({ "system.accuracy": e.target.value })} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Accuracy Bonus</span>
      <input type="number" class="form-input" value={data.accuracyBonus}
        onchange={(e) => update("system.accuracyBonus", e.target.value)} />
    </label>
  </div>

  <!-- Damage -->
  <div class="grid grid-cols-2 gap-2">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Damage Formula</span>
      <input type="text" class="form-input" value={data.damage}
        onchange={(e) => item.update({ "system.damage": e.target.value })} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Damage Bonus</span>
      <input type="number" class="form-input" value={data.damageBonus}
        onchange={(e) => update("system.damageBonus", e.target.value)} />
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
