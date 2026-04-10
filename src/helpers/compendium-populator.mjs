const PACK_SOURCES = [
  { pack: "ryuutama.monsters", source: "systems/ryuutama/packs/_source/monsters.json", cls: "Actor" },
  { pack: "ryuutama.classes", source: "systems/ryuutama/packs/_source/classes.json", cls: "Item" },
  { pack: "ryuutama.class-features", source: "systems/ryuutama/packs/_source/class-features.json", cls: "Item" },
  { pack: "ryuutama.items", source: "systems/ryuutama/packs/_source/items.json", cls: "Item" },
  { pack: "ryuutama.spells", source: "systems/ryuutama/packs/_source/spells.json", cls: "Item" },
  { pack: "ryuutama.enchantments", source: "systems/ryuutama/packs/_source/enchantments.json", cls: "Item" },
  { pack: "ryuutama.containers", source: "systems/ryuutama/packs/_source/containers.json", cls: "Item" },
];

export async function populateCompendiums() {
  if (!game.user.isGM) return;

  for (const { pack: packId, source, cls } of PACK_SOURCES) {
    const pack = game.packs.get(packId);
    if (!pack) {
      console.warn(`Ryuutama | Compendium pack "${packId}" not found, skipping.`);
      continue;
    }

    const index = await pack.getIndex();
    if (index.size > 0) continue;

    try {
      const response = await fetch(source);
      if (!response.ok) {
        console.warn(`Ryuutama | Could not fetch source file "${source}": ${response.status}`);
        continue;
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) continue;

      const wasLocked = pack.locked;
      if (wasLocked) await pack.configure({ locked: false });

      const DocumentClass = cls === "Actor" ? Actor : Item;
      const created = await DocumentClass.createDocuments(data, { pack: packId });
      console.log(`Ryuutama | Populated "${packId}" with ${created.length} entries from source data.`);

      if (wasLocked) await pack.configure({ locked: true });
    } catch (err) {
      console.error(`Ryuutama | Error populating "${packId}":`, err);
    }
  }
}
