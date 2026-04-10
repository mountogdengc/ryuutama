/**
 * Execute a roll check with crit/fumble detection.
 * @param {string} formula - Roll formula (e.g. "1d8 + 1d6")
 * @param {string} flavor - Chat message flavor text
 * @param {number[]} modifiers - Array of numeric modifiers to add to formula
 * @param {object} rollData - Roll data object with str, dex, int, spi
 * @param {number} [journeyDC] - Optional journey DC to check against
 * @returns {Promise<{roll: number, crit: boolean, fumble: boolean}>}
 */
export async function rollCheck(formula, flavor, modifiers, rollData, journeyDC) {
  if (modifiers && modifiers.length > 0) {
    modifiers.forEach((mod) => {
      formula += ` + ${mod}`;
    });
  }

  const r = new Roll(formula, rollData);
  const roll = await r.evaluate();
  const dice = roll.dice;
  const smallDice = dice.filter((r) => r.faces < 6);
  const maxRolls = dice.filter((r) => r.results[0].result === r.faces);
  const largeCrits = dice.filter(
    (r) => r.results[0].result === r.faces || r.results[0].result === 6
  );
  const fumbleRolls = dice.filter((r) => r.results[0].result === 1);
  let crit = false;
  let fumble = false;

  if (
    dice.length > 1 &&
    ((smallDice.length > 0 && maxRolls.length === dice.length) ||
      largeCrits.length === dice.length)
  ) {
    crit = true;
    flavor += game.i18n.localize("RYUU.rollcrit");
  }

  if (dice.length > 1 && fumbleRolls.length === dice.length) {
    fumble = true;
    flavor += game.i18n.localize("RYUU.rollfumble");
    // All PC actors get +1 fumble
    const players = game.actors.filter((a) => a.isPC);
    players.forEach((player) => {
      const pcFumble = player.system.attributes.fumble || 0;
      player.update({ "system.attributes.fumble": pcFumble + 1 });
    });
  }

  if (journeyDC !== undefined && roll.total >= journeyDC && !fumble) {
    flavor += game.i18n.localize("RYUU.journeypass") + journeyDC;
  } else if ((journeyDC !== undefined && roll.total < journeyDC) || fumble) {
    flavor += game.i18n.localize("RYUU.journeyfail") + journeyDC;
  }

  roll.toMessage({ flavor });

  return { roll: roll.total, crit, fumble };
}

/**
 * Replace stat placeholders in a formula string.
 * Converts [STR], STR, [DEX], DEX, etc. to 1d@str, 1d@dex, etc.
 * @param {string} formula
 * @returns {string}
 */
export function replaceStatPlaceholders(formula) {
  return formula
    .replace(/(\[|)STR(\]|)/g, "1d@str")
    .replace(/(\[|)DEX(\]|)/g, "1d@dex")
    .replace(/(\[|)INT(\]|)/g, "1d@int")
    .replace(/(\[|)SPI(\]|)/g, "1d@spi");
}

/**
 * Get the roll data object for an actor (stat values for formula substitution).
 * @param {Actor} actor
 * @returns {{str: number, dex: number, int: number, spi: number}}
 */
export function getRollData(actor) {
  const attr = actor.system.attributes;
  return {
    str: Number(attr.str.value),
    dex: Number(attr.dex.value),
    int: Number(attr.int.value),
    spi: Number(attr.spi.value),
  };
}

/**
 * Gather all modifiers for a character's roll.
 * @param {Actor} actor
 * @returns {{modifiers: number[], journeyDC: number, terrainBonus: number, weatherBonus: number, journeyBonus: number, armorPenalty: number, conditionPenalty: number, currentModifiers: string}}
 */
export function gatherModifiers(actor) {
  const attr = actor.system.attributes;
  const items = actor.items;
  const typeMap = actor.system.typeMap;
  const modifiers = [];

  // Cursed item condition penalty
  const cursedItems = items.filter(
    (i) =>
      i.system.enchantments?.find((e) => e.data.conditionPenalty !== 0) &&
      i.system.equipped
  );
  let conditionPenalty = 0;
  cursedItems.forEach((cursed) => {
    cursed.system.enchantments.forEach((e) => {
      conditionPenalty += e.data.conditionPenalty;
    });
  });

  // Armor penalty
  const armors = items.filter(
    (i) =>
      i.system.isArmor === true &&
      i.system.equipped === true &&
      i.system.penalty !== undefined &&
      i.system.penalty !== 0
  );
  let armorPenalty = 0;
  armors.forEach((armor) => {
    armorPenalty -= armor.system.penalty;
  });

  // Weight penalty
  if (actor.type === "character") {
    const maxCapacity = attr.capacity.max;
    const currentCarried = attr.capacity.value;
    const weightPenalty =
      currentCarried > maxCapacity ? maxCapacity - currentCarried : 0;
    if (weightPenalty !== 0) modifiers.push(weightPenalty);
  }

  // Journey DC and terrain/weather bonuses
  let journeyDC = 0;
  let terrainBonus = 0;
  let weatherBonus = 0;
  let journeyBonus = 0;

  if (actor.type === "character") {
    const currentTerrain = game.settings.get("ryuutama", "terrain");
    const currentWeather = game.settings.get("ryuutama", "weather");
    const night = game.settings.get("ryuutama", "night");

    if (currentTerrain && typeMap) {
      journeyDC += game.settings.get("ryuutama", currentTerrain);
      const type = typeMap.find((t) => t.type + t.number === currentTerrain);
      if (type) {
        terrainBonus =
          actor.system.traveling[type.type][type.index].types[type.type + type.number]
            .bonus;
        if (
          actor.system.traveling[type.type][type.index].types[type.type + type.number]
            .specialty
        ) {
          journeyBonus += 2;
        }
      }
    }

    if (currentWeather && typeMap) {
      journeyDC += game.settings.get("ryuutama", currentWeather);
      const type = typeMap.find((t) => t.type + t.number === currentWeather);
      if (type) {
        weatherBonus =
          actor.system.traveling[type.type][type.index].types[type.type + type.number]
            .bonus;
        if (
          actor.system.traveling[type.type][type.index].types[type.type + type.number]
            .specialty
        ) {
          journeyBonus += 2;
        }
      }
    }

    if (night) journeyDC++;

    // Feature bonuses
    const classes = items.filter((i) => i.type === "class");
    classes.forEach((c) => {
      c.system.features.forEach((feature) => {
        conditionPenalty += feature.data.condition;
        journeyBonus += feature.data.journey;
      });
    });
  }

  // Build modifier text
  let currentModifiers = "";
  if (modifiers.length > 0) {
    currentModifiers = `<br />${actor.name} ${game.i18n.localize("RYUU.checkmodifiers")}:`;
    modifiers.forEach((element) => {
      currentModifiers += ` ${element},`;
    });
    currentModifiers = currentModifiers.replace(/,\s*$/, "");
  }

  return {
    modifiers,
    journeyDC,
    terrainBonus,
    weatherBonus,
    journeyBonus,
    armorPenalty,
    conditionPenalty,
    currentModifiers,
  };
}
