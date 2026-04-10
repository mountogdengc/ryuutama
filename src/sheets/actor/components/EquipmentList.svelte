<script>
  import { RYUU } from "../../../config.mjs";

  let { actor, tick } = $props();

  let data = $derived.by(() => {
    tick;
    const items = actor.items;
    const equipped = items.filter((i) => i.system.equipped === true);
    return {
      weapons: equipped.filter((i) => i.system.isWeapon === true),
      armors: equipped.filter((i) => i.system.isArmor === true && !i.system.isShield),
      shields: equipped.filter((i) => i.system.isShield === true),
      traveling: equipped.filter((i) => i.system.isTraveling === true),
    };
  });

  function canEquip(item) {
    const items = actor.items;
    const equipped = items.filter((i) => i.system.equipped === true && i.id !== item.id);

    const slot = (item.system.equip || "").toLowerCase();

    if (item.system.isWeapon) {
      const handCount = equipped
        .filter((i) => i.system.isWeapon)
        .reduce((sum, i) => sum + (i.system.size >= 2 ? 2 : 1), 0);
      const thisHands = item.system.size >= 2 ? 2 : 1;
      if (handCount + thisHands > RYUU.MAX_HAND) {
        ui.notifications.error(game.i18n.localize("RYUU.slotfull") || "Hand slots full (max 2).");
        return false;
      }
    } else if (item.system.isArmor && !item.system.isShield) {
      const armorCount = equipped.filter((i) => i.system.isArmor && !i.system.isShield).length;
      if (armorCount >= RYUU.MAX_CHEST) {
        ui.notifications.error(game.i18n.localize("RYUU.slotfull") || "Chest slot full.");
        return false;
      }
    } else if (item.system.isShield) {
      // Shield goes in a hand
      const handCount = equipped
        .filter((i) => i.system.isWeapon || i.system.isShield)
        .reduce((sum, i) => sum + (i.system.isWeapon && i.system.size >= 2 ? 2 : 1), 0);
      if (handCount + 1 > RYUU.MAX_HAND) {
        ui.notifications.error(game.i18n.localize("RYUU.slotfull") || "Hand slots full.");
        return false;
      }
    } else if (item.system.isTraveling) {
      const travelCount = equipped.filter((i) => i.system.isTraveling).length;
      if (travelCount >= RYUU.MAX_TRAVEL) {
        ui.notifications.error(game.i18n.localize("RYUU.slotfull") || "Travel slots full (max 4).");
        return false;
      }
    }

    return true;
  }

  async function toggleEquip(item) {
    if (!item.system.equipped) {
      if (!canEquip(item)) return;
    }
    await item.update({ "system.equipped": !item.system.equipped });
  }

  function editItem(item) {
    item.sheet.render(true);
  }

  async function deleteItem(item) {
    await item.delete();
  }
</script>

<div class="equipment-list space-y-3">
  <!-- Weapons -->
  <section>
    <h3 class="text-sm font-bold text-leather uppercase border-b border-parchment pb-1 mb-1">Weapons</h3>
    {#if data.weapons.length === 0}
      <p class="text-xs text-leather italic">No weapons equipped.</p>
    {:else}
      <table class="w-full text-xs">
        <thead>
          <tr class="text-leather font-semibold">
            <th class="text-left w-8"></th>
            <th class="text-left">Name</th>
            <th class="text-center">Accuracy</th>
            <th class="text-center">Damage</th>
            <th class="text-center">Size</th>
            <th class="text-right w-16"></th>
          </tr>
        </thead>
        <tbody>
          {#each data.weapons as item}
            <tr class="border-t border-parchment hover:bg-parchment/40 item-draggable" draggable="true" data-item-id={item.id}>
              <td>
                <img src={item.img} alt={item.name} class="w-6 h-6 object-contain" />
              </td>
              <td class="font-medium text-leather-dark">{item.name}</td>
              <td class="text-center">{item.system.accuracy}{item.system.accuracyBonus ? ` +${item.system.accuracyBonus}` : ""}</td>
              <td class="text-center">{item.system.damage}{item.system.damageBonus ? ` +${item.system.damageBonus}` : ""}</td>
              <td class="text-center">{item.system.size}</td>
              <td class="text-right">
                <button
                  class="text-teal hover:text-teal-dark mr-1"
                  onclick={() => toggleEquip(item)}
                  title="Unequip"
                  type="button"
                >
                  <i class="fas fa-shield-alt"></i>
                </button>
                <button
                  class="text-leather hover:text-rust mr-1"
                  onclick={() => editItem(item)}
                  title="Edit"
                  type="button"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="text-leather hover:text-rust"
                  onclick={() => deleteItem(item)}
                  title="Delete"
                  type="button"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>

  <!-- Armor & Shields -->
  <section>
    <h3 class="text-sm font-bold text-leather uppercase border-b border-parchment pb-1 mb-1">Armor &amp; Shields</h3>
    {#if data.armors.length === 0 && data.shields.length === 0}
      <p class="text-xs text-leather italic">No armor or shields equipped.</p>
    {:else}
      <table class="w-full text-xs">
        <thead>
          <tr class="text-leather font-semibold">
            <th class="text-left w-8"></th>
            <th class="text-left">Name</th>
            <th class="text-center">Defense</th>
            <th class="text-center">Penalty</th>
            <th class="text-center">Dodge</th>
            <th class="text-center">Size</th>
            <th class="text-right w-16"></th>
          </tr>
        </thead>
        <tbody>
          {#each [...data.armors, ...data.shields] as item}
            <tr class="border-t border-parchment hover:bg-parchment/40 item-draggable" draggable="true" data-item-id={item.id}>
              <td>
                <img src={item.img} alt={item.name} class="w-6 h-6 object-contain" />
              </td>
              <td class="font-medium text-leather-dark">{item.name}</td>
              <td class="text-center">{item.system.defense}</td>
              <td class="text-center">{item.system.penalty}</td>
              <td class="text-center">{item.system.dodge ?? "—"}</td>
              <td class="text-center">{item.system.size}</td>
              <td class="text-right">
                <button
                  class="text-teal hover:text-teal-dark mr-1"
                  onclick={() => toggleEquip(item)}
                  title="Unequip"
                  type="button"
                >
                  <i class="fas fa-shield-alt"></i>
                </button>
                <button
                  class="text-leather hover:text-rust mr-1"
                  onclick={() => editItem(item)}
                  title="Edit"
                  type="button"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="text-leather hover:text-rust"
                  onclick={() => deleteItem(item)}
                  title="Delete"
                  type="button"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>

  <!-- Traveling gear -->
  <section>
    <h3 class="text-sm font-bold text-leather uppercase border-b border-parchment pb-1 mb-1">Traveling Gear ({data.traveling.length}/{RYUU.MAX_TRAVEL})</h3>
    {#if data.traveling.length === 0}
      <p class="text-xs text-leather italic">No traveling gear equipped.</p>
    {:else}
      <table class="w-full text-xs">
        <thead>
          <tr class="text-leather font-semibold">
            <th class="text-left w-8"></th>
            <th class="text-left">Name</th>
            <th class="text-center">Bonus</th>
            <th class="text-center">Size</th>
            <th class="text-right w-16"></th>
          </tr>
        </thead>
        <tbody>
          {#each data.traveling as item}
            <tr class="border-t border-parchment hover:bg-parchment/40 item-draggable" draggable="true" data-item-id={item.id}>
              <td>
                <img src={item.img} alt={item.name} class="w-6 h-6 object-contain" />
              </td>
              <td class="font-medium text-leather-dark">{item.name}</td>
              <td class="text-center">+{item.system.itemBonus}</td>
              <td class="text-center">{item.system.size}</td>
              <td class="text-right">
                <button
                  class="text-teal hover:text-teal-dark mr-1"
                  onclick={() => toggleEquip(item)}
                  title="Unequip"
                  type="button"
                >
                  <i class="fas fa-shield-alt"></i>
                </button>
                <button
                  class="text-leather hover:text-rust mr-1"
                  onclick={() => editItem(item)}
                  title="Edit"
                  type="button"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="text-leather hover:text-rust"
                  onclick={() => deleteItem(item)}
                  title="Delete"
                  type="button"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>
</div>
