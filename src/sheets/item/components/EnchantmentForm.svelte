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

  function updateBool(path, value) {
    item.update({ [path]: value });
  }
</script>

<div class="enchantment-form space-y-3 text-sm">
  <!-- Cost mod and type -->
  <div class="grid grid-cols-2 gap-2">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Cost Modifier</span>
      <input type="number" class="form-input" value={data.costMod}
        onchange={(e) => update("system.costMod", e.target.value)} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Modifier Type</span>
      <select class="form-input" value={String(data.modType)}
        onchange={(e) => item.update({ "system.modType": Number(e.target.value) })}>
        <option value="0">Multiplicative</option>
        <option value="1">Additive</option>
      </select>
    </label>
  </div>

  <!-- Numeric mods -->
  <div class="grid grid-cols-3 gap-2">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Durability Multiplier</span>
      <input type="number" class="form-input" value={data.durabilityMultiplier}
        onchange={(e) => update("system.durabilityMultiplier", e.target.value)} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Condition Penalty</span>
      <input type="number" class="form-input" value={data.conditionPenalty}
        onchange={(e) => update("system.conditionPenalty", e.target.value)} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Armor Penalty Mod</span>
      <input type="number" class="form-input" value={data.armorPenaltyMod}
        onchange={(e) => update("system.armorPenaltyMod", e.target.value)} />
    </label>
  </div>

  <div class="grid grid-cols-3 gap-2">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Size Modifier</span>
      <input type="number" class="form-input" value={data.sizeMod}
        onchange={(e) => update("system.sizeMod", e.target.value)} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">MP Modifier</span>
      <input type="number" class="form-input" value={data.mpMod}
        onchange={(e) => update("system.mpMod", e.target.value)} />
    </label>
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">HP Modifier</span>
      <input type="number" class="form-input" value={data.hpMod}
        onchange={(e) => update("system.hpMod", e.target.value)} />
    </label>
  </div>

  <!-- Durability value / setDurability -->
  <div class="grid grid-cols-2 gap-2 items-end">
    <label class="flex flex-col">
      <span class="text-xs text-leather font-semibold">Durability Value</span>
      <input type="number" class="form-input" value={data.durabilityValue}
        onchange={(e) => update("system.durabilityValue", e.target.value)} />
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" checked={data.setDurability}
        onchange={(e) => updateBool("system.setDurability", e.target.checked)} />
      <span class="text-xs text-leather font-semibold">Set Durability</span>
    </label>
  </div>

  <!-- Boolean flags -->
  <div class="grid grid-cols-2 gap-2">
    <label class="flex items-center gap-2">
      <input type="checkbox" checked={data.unusable}
        onchange={(e) => updateBool("system.unusable", e.target.checked)} />
      <span class="text-xs text-leather font-semibold">Unusable</span>
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" checked={data.unbreakable}
        onchange={(e) => updateBool("system.unbreakable", e.target.checked)} />
      <span class="text-xs text-leather font-semibold">Unbreakable</span>
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" checked={data.weightless}
        onchange={(e) => updateBool("system.weightless", e.target.checked)} />
      <span class="text-xs text-leather font-semibold">Weightless</span>
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" checked={data.emitsLight}
        onchange={(e) => updateBool("system.emitsLight", e.target.checked)} />
      <span class="text-xs text-leather font-semibold">Emits Light</span>
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" checked={data.plusOne}
        onchange={(e) => updateBool("system.plusOne", e.target.checked)} />
      <span class="text-xs text-leather font-semibold">+1 (accuracy/defense/bonus)</span>
    </label>
  </div>

  <!-- Description -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Description</span>
    <textarea class="form-input resize-y h-20" value={data.description}
      onchange={(e) => item.update({ "system.description": e.target.value })}></textarea>
  </label>
</div>
