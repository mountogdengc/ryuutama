/**
 * Add or remove an enchantment from an item, recalculating all derived properties.
 * @param {Item} item - The item document to modify
 * @param {object} options
 * @param {boolean} options.remove - True to remove an enchantment
 * @param {string} options.enchantmentName - Name of the enchantment
 * @param {object} options.enchantmentData - System data of the enchantment (for adding)
 * @param {string} options.givenName - Override givenName (optional)
 */
export function addRemoveEnchantment(item, { remove = false, enchantmentName, enchantmentData, givenName }) {
  let accuracyBonus = Number(item.system.accuracyBonus) || 0;
  let defense = Number(item.system.defense) || 0;
  let itemBonus = Number(item.system.itemBonus) || 0;
  let penalty = Number(item.system.penalty) || 0;
  let price = Number(item.system.price);
  let size = Number(item.system.size);

  let enchantments = (item.system.enchantments || []).slice();

  // --- Reverse all current enchantment effects ---
  const additive = enchantments.filter((e) => e.data.modType === "1");
  const multiplicative = enchantments.filter((e) => e.data.modType === "0");

  // Reverse price: subtract additive, then divide multiplicative
  let priceFormula = `${price}`;
  additive.forEach((e) => { priceFormula += `-${e.data.costMod}`; });
  price = eval(priceFormula);
  priceFormula = `${price}`;
  multiplicative.forEach((e) => { priceFormula += `/${e.data.costMod}`; });
  price = eval(priceFormula);

  // Reverse size, penalty, plusOne effects
  enchantments.forEach((e) => {
    size -= e.data.sizeMod;
    if (item.system.isArmor) {
      penalty -= e.data.armorPenaltyMod;
      if (e.data.plusOne) defense -= 1;
    } else if (item.system.isWeapon) {
      if (e.data.plusOne) accuracyBonus -= 1;
    } else if (item.system.isTraveling) {
      if (e.data.plusOne) itemBonus -= 1;
    }
  });

  // Base durability = size
  let newDurability = size;

  // --- Update enchantment list ---
  if (remove && enchantmentName) {
    enchantments = enchantments.filter((e) => e.name !== enchantmentName);
  } else if (enchantmentData) {
    if (enchantments.find((e) => e.name === enchantmentName)) return; // no duplicates
    enchantments.push({ name: enchantmentName, data: enchantmentData });
  }

  // --- Apply all enchantment effects ---
  // Build name
  let name = "";
  enchantments.forEach((e) => { name += `${e.name} `; });
  name += givenName || item.system.givenName;

  // Apply price: multiply multiplicative, then add additive
  const newMult = enchantments.filter((e) => e.data.modType === "0");
  const newAdd = enchantments.filter((e) => e.data.modType === "1");
  priceFormula = `${price}`;
  newMult.forEach((e) => { priceFormula += `*${e.data.costMod}`; });
  price = eval(priceFormula);
  priceFormula = `${price}`;
  newAdd.forEach((e) => { priceFormula += `+${e.data.costMod}`; });
  price = eval(priceFormula);

  // Durability override from setDurability enchantments
  const durabilityOverrides = enchantments.filter((e) => e.data.setDurability === true);
  if (durabilityOverrides.length > 0) {
    newDurability = Math.max(...durabilityOverrides.map((e) => e.data.durabilityValue));
  }

  // Apply size, durability multiplier, type-specific mods
  enchantments.forEach((e) => {
    size += e.data.sizeMod;
    if (e.data.durabilityMultiplier !== 0) {
      newDurability *= e.data.durabilityMultiplier;
    }
    if (item.system.isArmor) {
      penalty += e.data.armorPenaltyMod;
      if (e.data.plusOne) defense += 1;
    } else if (item.system.isWeapon) {
      if (e.data.plusOne) accuracyBonus += 1;
    } else if (item.system.isTraveling) {
      if (e.data.plusOne) itemBonus += 1;
    }
  });

  // Special flags
  if (enchantments.find((e) => e.data.unbreakable === true)) newDurability = 9999;
  if (enchantments.find((e) => e.data.unusable === true)) newDurability = 0;

  // Build update
  const updateData = {
    name,
    "system.enchantments": enchantments,
    "system.price": price,
    "system.size": size,
    "system.durability": newDurability,
  };

  if (item.system.isArmor) {
    updateData["system.penalty"] = penalty;
    updateData["system.defense"] = defense;
  } else if (item.system.isWeapon) {
    updateData["system.accuracyBonus"] = accuracyBonus;
  } else if (item.system.isTraveling) {
    updateData["system.itemBonus"] = itemBonus;
  }

  item.update(updateData);
}
