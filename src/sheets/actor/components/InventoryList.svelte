<script>
  import { RYUU } from "../../../config.mjs";

  let { actor, tick } = $props();

  let data = $derived.by(() => {
    tick;
    const items = actor.items.contents;
    const containers = items.filter((i) => i.type === "container");
    const animals = items.filter((i) => i.type === "animal");
    const gear = items.filter(
      (i) => i.type === "item" && !i.system.container
    );
    const equipment = items.filter(
      (i) =>
        RYUU.EQUIPPABLE.includes(i.type) && !i.system.container
    );

    return { gear, equipment, containers, animals };
  });

  async function createItem(type) {
    await actor.createEmbeddedDocuments("Item", [
      { name: `New ${type}`, type },
    ]);
  }

  function editItem(item) {
    item.sheet.render(true);
  }

  async function deleteItem(item) {
    await item.delete();
  }

  async function toggleEquip(item) {
    await item.update({ "system.equipped": !item.system.equipped });
  }

  async function removeFromContainer(item) {
    const containerId = item.system.container;
    if (!containerId) return;
    const container = actor.items.get(containerId);
    if (container) {
      const holding = container.system.holding.filter((h) => h.id !== item.id);
      await container.update({ "system.holding": holding });
    }
    await item.update({ "system.container": "" });
  }

  function getContainerContents(container) {
    const holding = container.system.holding || [];
    return holding
      .map((h) => actor.items.get(h.id))
      .filter(Boolean);
  }

  function onDragStart(event, item) {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ type: "Item", uuid: item.uuid, id: item.id })
    );
  }

  async function onDropContainer(event, container) {
    event.preventDefault();
    let data;
    try {
      data = JSON.parse(event.dataTransfer.getData("text/plain"));
    } catch {
      return;
    }
    const itemId = data.id;
    if (!itemId) return;
    const item = actor.items.get(itemId);
    if (!item) return;
    if (RYUU.NO_STORE.includes(item.type)) {
      ui.notifications.warn("That item cannot be stored in a container.");
      return;
    }

    // Check container capacity
    const newSize = (container.system.holdingSize || 0) + item.system.size;
    if (newSize > container.system.canHold) {
      ui.notifications.error("Container is full.");
      return;
    }

    // Remove from previous container
    if (item.system.container) {
      const oldContainer = actor.items.get(item.system.container);
      if (oldContainer) {
        const oldHolding = oldContainer.system.holding.filter((h) => h.id !== item.id);
        await oldContainer.update({ "system.holding": oldHolding });
      }
    }

    const holding = [...(container.system.holding || []), { id: item.id, name: item.name }];
    await container.update({
      "system.holding": holding,
      "system.holdingSize": newSize,
    });
    await item.update({ "system.container": container.id });
  }
</script>

<div class="inventory-list space-y-4">
  <!-- Gear section -->
  <section>
    <div class="flex items-center justify-between mb-1">
      <h3 class="text-sm font-bold text-leather uppercase">Gear</h3>
      <button
        class="text-xs text-teal hover:text-teal-dark"
        onclick={() => createItem("item")}
        type="button"
        title="Add Item"
      >
        <i class="fas fa-plus"></i> Add
      </button>
    </div>
    {#if data.gear.length === 0}
      <p class="text-xs text-leather italic">No gear in inventory.</p>
    {:else}
      {#each data.gear as item}
        <div
          class="flex items-center gap-2 py-1 border-t border-parchment hover:bg-parchment/40 item-draggable"
          draggable="true"
          ondragstart={(e) => onDragStart(e, item)}
          data-item-id={item.id}
          role="listitem"
        >
          <img src={item.img} alt={item.name} class="w-6 h-6 object-contain flex-shrink-0" />
          <span class="flex-1 text-xs text-leather-dark font-medium">{item.name}</span>
          <span class="text-xs text-leather">Size: {item.system.size}</span>
          <button class="text-leather hover:text-rust text-xs mr-1" onclick={() => editItem(item)} type="button" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="text-leather hover:text-rust text-xs" onclick={() => deleteItem(item)} type="button" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      {/each}
    {/if}
  </section>

  <!-- Equipment section -->
  <section>
    <div class="flex items-center justify-between mb-1">
      <h3 class="text-sm font-bold text-leather uppercase">Equipment</h3>
      <div class="flex gap-1">
        {#each ["weapon","armor","shield","traveling"] as type}
          <button
            class="text-xs text-teal hover:text-teal-dark px-1"
            onclick={() => createItem(type)}
            type="button"
            title={`Add ${type}`}
          >+{type.charAt(0).toUpperCase()}</button>
        {/each}
      </div>
    </div>
    {#if data.equipment.length === 0}
      <p class="text-xs text-leather italic">No equipment items.</p>
    {:else}
      {#each data.equipment as item}
        <div
          class="flex items-center gap-2 py-1 border-t border-parchment hover:bg-parchment/40 item-draggable"
          draggable="true"
          ondragstart={(e) => onDragStart(e, item)}
          data-item-id={item.id}
          role="listitem"
        >
          <img src={item.img} alt={item.name} class="w-6 h-6 object-contain flex-shrink-0" />
          <span class="flex-1 text-xs text-leather-dark font-medium">{item.name}</span>
          <span class="text-xs text-leather capitalize">{item.type}</span>
          <span class="text-xs text-leather">Size: {item.system.size}</span>
          <button
            class="text-xs mr-1 {item.system.equipped ? 'text-teal' : 'text-leather'} hover:text-teal-dark"
            onclick={() => toggleEquip(item)}
            type="button"
            title={item.system.equipped ? "Unequip" : "Equip"}
          >
            <i class="fas fa-shield-alt"></i>
          </button>
          <button class="text-leather hover:text-rust text-xs mr-1" onclick={() => editItem(item)} type="button" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="text-leather hover:text-rust text-xs" onclick={() => deleteItem(item)} type="button" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      {/each}
    {/if}
  </section>

  <!-- Containers section -->
  <section>
    <div class="flex items-center justify-between mb-1">
      <h3 class="text-sm font-bold text-leather uppercase">Containers</h3>
      <button
        class="text-xs text-teal hover:text-teal-dark"
        onclick={() => createItem("container")}
        type="button"
        title="Add Container"
      >
        <i class="fas fa-plus"></i> Add
      </button>
    </div>
    {#if data.containers.length === 0}
      <p class="text-xs text-leather italic">No containers.</p>
    {:else}
      {#each data.containers as container}
        <div class="container-block mb-2 border border-parchment rounded p-2 bg-parchment/20">
          <div class="flex items-center gap-2 mb-1">
            <img src={container.img} alt={container.name} class="w-6 h-6 object-contain flex-shrink-0" />
            <span class="flex-1 text-xs font-bold text-leather-dark">{container.name}</span>
            <span class="text-xs text-leather">{container.system.holdingSize}/{container.system.canHold} capacity</span>
            <button class="text-leather hover:text-rust text-xs mr-1" onclick={() => editItem(container)} type="button" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="text-leather hover:text-rust text-xs" onclick={() => deleteItem(container)} type="button" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
          <!-- Drop zone and contents -->
          <div
            class="container-contents pl-4 min-h-6 border-l-2 border-parchment"
            role="list"
            ondragover={(e) => e.preventDefault()}
            ondrop={(e) => onDropContainer(e, container)}
          >
            {#each getContainerContents(container) as item}
              <div class="flex items-center gap-2 py-0.5 item-draggable" draggable="true" ondragstart={(e) => onDragStart(e, item)} data-item-id={item.id} role="listitem">
                <img src={item.img} alt={item.name} class="w-5 h-5 object-contain flex-shrink-0" />
                <span class="flex-1 text-xs text-leather-dark">{item.name}</span>
                <span class="text-xs text-leather">Size: {item.system.size}</span>
                <button
                  class="text-leather hover:text-rust text-xs mr-1"
                  onclick={() => removeFromContainer(item)}
                  type="button"
                  title="Remove from container"
                >
                  <i class="fas fa-times"></i>
                </button>
                <button class="text-leather hover:text-rust text-xs" onclick={() => editItem(item)} type="button" title="Edit"><i class="fas fa-edit"></i></button>
              </div>
            {:else}
              <p class="text-xs text-leather italic">Drop items here</p>
            {/each}
          </div>
        </div>
      {/each}
    {/if}
  </section>

  <!-- Animals section -->
  <section>
    <div class="flex items-center justify-between mb-1">
      <h3 class="text-sm font-bold text-leather uppercase">Animals</h3>
      <button
        class="text-xs text-teal hover:text-teal-dark"
        onclick={() => createItem("animal")}
        type="button"
        title="Add Animal"
      >
        <i class="fas fa-plus"></i> Add
      </button>
    </div>
    {#if data.animals.length === 0}
      <p class="text-xs text-leather italic">No animals.</p>
    {:else}
      {#each data.animals as animal}
        <div class="container-block mb-2 border border-parchment rounded p-2 bg-parchment/20">
          <div class="flex items-center gap-2 mb-1">
            <img src={animal.img} alt={animal.name} class="w-6 h-6 object-contain flex-shrink-0" />
            <span class="flex-1 text-xs font-bold text-leather-dark">{animal.name}</span>
            <span class="text-xs text-leather">{animal.system.holdingSize}/{animal.system.canHold} capacity</span>
            <button class="text-leather hover:text-rust text-xs mr-1" onclick={() => editItem(animal)} type="button" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="text-leather hover:text-rust text-xs" onclick={() => deleteItem(animal)} type="button" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
          <div
            class="container-contents pl-4 min-h-6 border-l-2 border-parchment"
            role="list"
            ondragover={(e) => e.preventDefault()}
            ondrop={(e) => onDropContainer(e, animal)}
          >
            {#each getContainerContents(animal) as item}
              <div class="flex items-center gap-2 py-0.5 item-draggable" draggable="true" ondragstart={(e) => onDragStart(e, item)} data-item-id={item.id} role="listitem">
                <img src={item.img} alt={item.name} class="w-5 h-5 object-contain flex-shrink-0" />
                <span class="flex-1 text-xs text-leather-dark">{item.name}</span>
                <span class="text-xs text-leather">Size: {item.system.size}</span>
                <button
                  class="text-leather hover:text-rust text-xs mr-1"
                  onclick={() => removeFromContainer(item)}
                  type="button"
                  title="Remove from animal storage"
                >
                  <i class="fas fa-times"></i>
                </button>
                <button class="text-leather hover:text-rust text-xs" onclick={() => editItem(item)} type="button" title="Edit"><i class="fas fa-edit"></i></button>
              </div>
            {:else}
              <p class="text-xs text-leather italic">Drop items here</p>
            {/each}
          </div>
        </div>
      {/each}
    {/if}
  </section>
</div>
