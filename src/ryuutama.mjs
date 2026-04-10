import "./styles/ryuutama.css";
import { RYUU } from "./config.mjs";
import { CharacterData } from "./data-models/actor/CharacterData.mjs";
import { MonsterData } from "./data-models/actor/MonsterData.mjs";
import { ItemData } from "./data-models/item/ItemData.mjs";
import { WeaponData } from "./data-models/item/WeaponData.mjs";
import { ArmorData } from "./data-models/item/ArmorData.mjs";
import { ShieldData } from "./data-models/item/ShieldData.mjs";
import { ClassData } from "./data-models/item/ClassData.mjs";
import { FeatureData } from "./data-models/item/FeatureData.mjs";
import { EnchantmentData } from "./data-models/item/EnchantmentData.mjs";
import { ContainerData } from "./data-models/item/ContainerData.mjs";
import { TravelingData } from "./data-models/item/TravelingData.mjs";
import { SpellData } from "./data-models/item/SpellData.mjs";
import { AnimalData } from "./data-models/item/AnimalData.mjs";
import { RyuutamaActor } from "./documents/RyuutamaActor.mjs";
import { RyuutamaItem } from "./documents/RyuutamaItem.mjs";
import { CharacterSheet } from "./sheets/actor/CharacterSheet.mjs";
import { MonsterSheet } from "./sheets/actor/MonsterSheet.mjs";
import { ItemSheet } from "./sheets/item/ItemSheet.mjs";
import { registerSettings } from "./helpers/settings.mjs";
import { populateCompendiums } from "./helpers/compendium-populator.mjs";
import { registerChatHooks } from "./combat/chat-cards.mjs";

Hooks.once("init", () => {
  console.log("Ryuutama | Initializing Ryuutama system");

  game.ryuutama = { version: "1.0.0" };

  // Initiative formula
  CONFIG.Combat.initiative = { formula: "1d@dex + 1d@int", decimals: 0 };

  // Store config on game object
  CONFIG.RYUU = RYUU;

  // Register data models
  CONFIG.Actor.dataModels.character = CharacterData;
  CONFIG.Actor.dataModels.monster = MonsterData;
  CONFIG.Item.dataModels.item = ItemData;
  CONFIG.Item.dataModels.weapon = WeaponData;
  CONFIG.Item.dataModels.armor = ArmorData;
  CONFIG.Item.dataModels.shield = ShieldData;
  CONFIG.Item.dataModels.class = ClassData;
  CONFIG.Item.dataModels.feature = FeatureData;
  CONFIG.Item.dataModels.enchantment = EnchantmentData;
  CONFIG.Item.dataModels.container = ContainerData;
  CONFIG.Item.dataModels.traveling = TravelingData;
  CONFIG.Item.dataModels.spell = SpellData;
  CONFIG.Item.dataModels.animal = AnimalData;

  // Register document classes
  CONFIG.Actor.documentClass = RyuutamaActor;
  CONFIG.Item.documentClass = RyuutamaItem;

  // Unregister core sheets
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);

  // Register custom sheets
  foundry.documents.collections.Actors.registerSheet("ryuutama", CharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "RYUU.SheetCharacter",
  });
  foundry.documents.collections.Actors.registerSheet("ryuutama", MonsterSheet, {
    types: ["monster"],
    makeDefault: true,
    label: "RYUU.SheetMonster",
  });
  foundry.documents.collections.Items.registerSheet("ryuutama", ItemSheet, {
    types: ["item", "weapon", "armor", "shield", "class", "feature", "enchantment", "container", "traveling", "spell", "animal"],
    makeDefault: true,
    label: "RYUU.SheetItem",
  });

  // Register settings
  registerSettings();

  // Register chat hooks
  registerChatHooks();
});

Hooks.once("ready", async () => {
  console.log("Ryuutama | System ready");
  await populateCompendiums();

  // Sync givenName on item creation
  Hooks.on("preCreateItem", (item) => {
    if (item.parent) {
      item.updateSource({ "system.givenName": item.name });
    }
  });

  // Container management on item creation
  Hooks.on("createItem", async (item) => {
    if (!item.parent) return;
    const actor = item.parent;

    if (item.system.container) {
      const container = actor.items.get(item.system.container);
      if (container) {
        const holding = container.system.holding.slice();
        holding.push({
          id: item.id,
          name: item.name,
        });
        await container.update({ "system.holding": holding });
      }
    }

    if (item.system.owner === "") {
      await item.update({ "system.owner": actor.id });
    }
  });
});
