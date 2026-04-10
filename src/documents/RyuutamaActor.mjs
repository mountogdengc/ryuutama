import { RYUU } from "../config.mjs";

export class RyuutamaActor extends Actor {
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type === "character") this._prepareCharacterData();
    if (this.type === "monster") this._prepareMonsterData();
  }

  _prepareCharacterData() {
    const data = this.system;
    const items = this.items.filter(
      (i) => i.type !== "enchantment" && i.type !== "class" && i.type !== "feature"
    );
    const weapons = this.items.filter((i) => i.type === "weapon");
    const classes = this.items.filter((i) => i.type === "class");

    // Auto-delete orphan enchantments/features (should live on items, not actors)
    const toDelete = this.items
      .filter((i) => i.type === "enchantment" || i.type === "feature")
      .map((i) => i.id);
    if (toDelete.length > 0) {
      this.deleteEmbeddedDocuments("Item", toDelete);
    }

    let str = Number(data.attributes.str.base);
    let dex = Number(data.attributes.dex.base);
    let int = Number(data.attributes.int.base);
    let spi = Number(data.attributes.spi.base);
    let addHp = 0;
    let addMp = 0;
    let addCarry = 0;

    // Build traveling object from world settings
    const traveling = { terrain: {}, weather: {} };
    const terrainDC = [0];
    const weatherDC = [0];
    const terrain = [];
    const weather = [];
    const typeMap = [];

    for (let index = 1; index <= 16; index++) {
      const tName = game.settings.get("ryuutama", `terrainName${index}`);
      const tDC = game.settings.get("ryuutama", `terrain${index}`);
      if (tName !== "") {
        terrainDC.push(tDC);
        terrain.push({ name: tName, dc: tDC });
      }
      const wName = game.settings.get("ryuutama", `weatherName${index}`);
      const wDC = game.settings.get("ryuutama", `weather${index}`);
      if (wName !== "") {
        weatherDC.push(wDC);
        weather.push({ name: wName, dc: wDC });
      }
    }

    // Deduplicate DC values
    const uniqueTerrainDC = [...new Set(terrainDC)];
    const uniqueWeatherDC = [...new Set(weatherDC)];

    // Build terrain traveling structure grouped by DC
    for (let index = 1; index < uniqueTerrainDC.length; index++) {
      traveling.terrain[index] = { dc: uniqueTerrainDC[index], types: {} };
      terrain.forEach((element, index1) => {
        if (element.dc === uniqueTerrainDC[index]) {
          traveling.terrain[index].types[`terrain${index1 + 1}`] = {
            name: element.name,
            specialty: false,
            bonus: 0,
          };
          typeMap.push({ type: "terrain", number: index1 + 1, index });
        }
      });
    }

    // Build weather traveling structure grouped by DC
    for (let index = 1; index < uniqueWeatherDC.length; index++) {
      traveling.weather[index] = { dc: uniqueWeatherDC[index], types: {} };
      weather.forEach((element, index1) => {
        if (element.dc === uniqueWeatherDC[index]) {
          traveling.weather[index].types[`weather${index1 + 1}`] = {
            name: element.name,
            specialty: false,
            bonus: 0,
          };
          typeMap.push({ type: "weather", number: index1 + 1, index });
        }
      });
    }

    // Class bonuses
    classes.forEach((c) => {
      switch (c.system.type) {
        case "attack":
          addHp += 4;
          break;
        case "technical":
          addCarry += 3;
          break;
        case "magic":
          addMp += 4;
          break;
      }
      c.system.features.forEach((feature) => {
        addCarry += feature.system.capacity;
      });
    });

    // Level from experience
    data.attributes.level = RYUU.CHARACTER_EXP_LEVELS.findIndex(
      (i) => i > Number(data.attributes.experience)
    );

    // Level choices
    const specialties = [];
    const immunities = [];
    const mastered = [];

    for (const key in data.levels) {
      if (!Object.prototype.hasOwnProperty.call(data.levels, key)) continue;
      if (data.attributes.level < key) continue;

      const levelData = data.levels[key];

      // HP/MP point distribution
      if (levelData.points) {
        levelData.points.hp = Math.clamp(levelData.points.hp, 0, RYUU.POINT_MAX);
        levelData.points.mp = Math.clamp(
          levelData.points.mp,
          0,
          RYUU.POINT_MAX - levelData.points.hp
        );
        addHp += levelData.points.hp;
        addMp += levelData.points.mp;
      }

      // Stat increases
      if (levelData.stat === "str") str += RYUU.DICE_STEP;
      if (levelData.stat === "dex") dex += RYUU.DICE_STEP;
      if (levelData.stat === "int") int += RYUU.DICE_STEP;
      if (levelData.stat === "spi") spi += RYUU.DICE_STEP;

      // Specialties
      if (levelData.specialty && levelData.specialty !== "none") {
        specialties.push(levelData.specialty);
      }

      // Immunities
      if (levelData.immunity && levelData.immunity !== "none") {
        immunities.push(levelData.immunity);
      }

      // Mastery
      if (levelData.mastered && levelData.mastered !== "none") {
        const master = classes.find((i) =>
          i.system.features.find((f) => f.system.mastered === levelData.mastered)
        );
        if (master) mastered.push(levelData.mastered);
      }
      if (levelData.attackMastered && levelData.attackMastered !== "none") {
        const master = classes.find((i) =>
          i.system.features.find((f) => f.system.mastered === levelData.attackMastered)
        );
        if (master) mastered.push(levelData.attackMastered);
      }
    }

    // Update weapon mastered bonuses
    const weaponUpdates = [];
    weapons.forEach((weapon) => {
      const newBonus = mastered.includes(weapon.system.class)
        ? weapon.system.accuracyBonus + 1
        : weapon.system.accuracyBonus;
      weaponUpdates.push({ _id: weapon.id, "system.masteredBonus": newBonus });
    });
    if (weaponUpdates.length > 0) {
      this.updateEmbeddedDocuments("Item", weaponUpdates);
    }

    // Reset and apply specialties
    for (const key in data.specialty) {
      if (Object.prototype.hasOwnProperty.call(data.specialty, key)) {
        data.specialty[key] = false;
      }
    }
    specialties.forEach((specialty) => {
      const type = typeMap.find((t) => t.type + t.number === specialty);
      if (type) {
        traveling[type.type][type.index].types[type.type + type.number].specialty = true;
      }
    });

    // Reset and apply immunities
    for (const key in data.immunity) {
      if (Object.prototype.hasOwnProperty.call(data.immunity, key)) {
        data.immunity[key] = false;
      }
    }
    immunities.forEach((immunity) => {
      data.immunity[immunity] = true;
    });

    // Clear immune effects
    for (const name in data.effects) {
      if (
        Object.prototype.hasOwnProperty.call(data.effects, name) &&
        data.immunity[name]
      ) {
        data.effects[name] = 0;
      }
    }

    // Attribute bonuses
    if (data.attributes.str.bonus) str += RYUU.DICE_STEP;
    if (data.attributes.dex.bonus) dex += RYUU.DICE_STEP;
    if (data.attributes.int.bonus) int += RYUU.DICE_STEP;
    if (data.attributes.spi.bonus) spi += RYUU.DICE_STEP;

    // Status effect penalties
    if (data.effects.injury > data.attributes.condition.value) dex -= RYUU.DICE_STEP;
    if (data.effects.poison > data.attributes.condition.value) str -= RYUU.DICE_STEP;
    if (data.effects.sickness > data.attributes.condition.value) {
      dex -= RYUU.DICE_STEP;
      str -= RYUU.DICE_STEP;
      spi -= RYUU.DICE_STEP;
      int -= RYUU.DICE_STEP;
    }
    if (data.effects.exhaustion > data.attributes.condition.value) spi -= RYUU.DICE_STEP;
    if (data.effects.muddled > data.attributes.condition.value) int -= RYUU.DICE_STEP;
    if (data.effects.shock > data.attributes.condition.value) {
      dex -= RYUU.DICE_STEP;
      str -= RYUU.DICE_STEP;
      spi -= RYUU.DICE_STEP;
      int -= RYUU.DICE_STEP;
    }

    // HP max: str.base * 2 + class/level bonuses + enchantment mods from equipped items
    data.hp.max = data.attributes.str.base * 2 + addHp;
    const hpItems = items.filter(
      (i) =>
        i.system.enchantments.find((e) => e.data.hpMod !== 0) && i.system.equipped
    );
    hpItems.forEach((item) => {
      item.system.enchantments
        .filter((e) => e.data.hpMod !== 0)
        .forEach((e) => {
          data.hp.max += e.data.hpMod;
        });
    });

    // MP max: spi.base * 2 + class/level bonuses + enchantment mods from equipped items
    data.mp.max = data.attributes.spi.base * 2 + addMp;
    const mpItems = items.filter(
      (i) =>
        i.system.enchantments.find((e) => e.data.mpMod !== 0) && i.system.equipped
    );
    mpItems.forEach((item) => {
      item.system.enchantments
        .filter((e) => e.data.mpMod !== 0)
        .forEach((e) => {
          data.mp.max += e.data.mpMod;
        });
    });

    // Clamp values
    data.hp.value = Math.clamp(data.hp.value, 0, data.hp.max);
    data.mp.value = Math.clamp(data.mp.value, 0, data.mp.max);
    data.attributes.experience = Math.clamp(
      Number(data.attributes.experience),
      RYUU.EXP_MIN,
      RYUU.EXP_MAX
    );
    data.attributes.condition.value = Math.clamp(
      data.attributes.condition.value,
      0,
      data.attributes.condition.max
    );
    data.attributes.str.value = Math.clamp(str, RYUU.DICE_MIN, RYUU.DICE_MAX);
    data.attributes.dex.value = Math.clamp(dex, RYUU.DICE_MIN, RYUU.DICE_MAX);
    data.attributes.int.value = Math.clamp(int, RYUU.DICE_MIN, RYUU.DICE_MAX);
    data.attributes.spi.value = Math.clamp(spi, RYUU.DICE_MIN, RYUU.DICE_MAX);
    data.attributes.fumble = Math.clamp(data.attributes.fumble, 0, 999);

    // Carrying capacity
    data.attributes.capacity.max =
      data.attributes.str.value + 2 + data.attributes.level + addCarry;

    const carried = items.filter(
      (i) => !i.system.equipped && i.system.size && i.type !== "animal"
    );
    const equipped = items.filter((i) => i.system.equipped === true && i.system.size);
    const containers = items.filter(
      (i) => i.type === "container" || i.type === "animal"
    );

    let carriedWeight = 0;
    carried.forEach((item) => {
      const weightless = item.system.enchantments.find((e) => e.data.weightless);
      if (!weightless) {
        let inContainer = false;
        containers.forEach((container) => {
          if (container.system.holding.find((i) => i.id === item.id)) {
            inContainer = true;
          }
        });
        if (!inContainer) {
          carriedWeight += Number(item.system.size);
        }
      }
    });
    data.attributes.capacity.value = carriedWeight;

    let equippedWeight = 0;
    equipped.forEach((item) => {
      equippedWeight += Number(item.system.size);
    });
    data.attributes.capacity.equipped = equippedWeight;

    // Terrain/weather bonuses from equipped traveling gear
    typeMap.forEach((type) => {
      traveling[type.type][type.index].types[type.type + type.number].bonus = 0;
      const mods = items.filter(
        (i) => i.system[type.type + type.number] && i.system.equipped
      );
      mods.forEach((item) => {
        traveling[type.type][type.index].types[type.type + type.number].bonus +=
          item.system.itemBonus;
      });
    });

    data.traveling = traveling;
    data.typeMap = typeMap;
  }

  _prepareMonsterData() {
    const data = this.system;

    // Auto-delete orphan types
    const toDelete = this.items
      .filter((i) => i.type === "enchantment" || i.type === "class" || i.type === "feature")
      .map((i) => i.id);
    if (toDelete.length > 0) {
      this.deleteEmbeddedDocuments("Item", toDelete);
    }

    data.hp.value = Math.clamp(data.hp.value, 0, data.hp.max);
    data.mp.value = Math.clamp(data.mp.value, 0, data.mp.max);
    data.attributes.str.value = Number(data.attributes.str.base);
    data.attributes.dex.value = Number(data.attributes.dex.base);
    data.attributes.int.value = Number(data.attributes.int.base);
    data.attributes.spi.value = Number(data.attributes.spi.base);
  }

  static async create(data, options = {}) {
    data.prototypeToken = data.prototypeToken || {};
    const tokenDefaults = {
      displayBars: 40,
      bar1: { attribute: "hp" },
      bar2: { attribute: "mp" },
    };

    if (data.type === "character") {
      foundry.utils.mergeObject(
        data.prototypeToken,
        { actorLink: true, disposition: 1, ...tokenDefaults },
        { overwrite: false }
      );
    }
    if (data.type === "monster") {
      foundry.utils.mergeObject(
        data.prototypeToken,
        { actorLink: false, disposition: -1, ...tokenDefaults },
        { overwrite: false }
      );
    }
    return super.create(data, options);
  }
}
