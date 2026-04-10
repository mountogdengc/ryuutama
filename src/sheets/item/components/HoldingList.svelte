<script>
  let { item, tick } = $props();

  let holding = $derived.by(() => {
    tick;
    return item.system.holding || [];
  });

  async function removeHeld(heldId) {
    const updated = (item.system.holding || []).filter((h) => h.id !== heldId);
    await item.update({ "system.holding": updated });
  }
</script>

<div class="holding-list mt-3">
  <h4 class="text-xs font-bold text-leather uppercase border-b border-parchment pb-1 mb-1">
    Held Items ({holding.length} / {item.system.canHold})
  </h4>
  {#if holding.length === 0}
    <p class="text-xs text-leather italic">Nothing held.</p>
  {:else}
    <ul class="space-y-1">
      {#each holding as held}
        <li class="flex items-center justify-between text-xs bg-parchment rounded px-2 py-1">
          <span class="text-leather-dark font-medium">{held.name}</span>
          <button
            class="text-leather hover:text-rust ml-2"
            onclick={() => removeHeld(held.id)}
            title="Remove from container"
            type="button"
          >
            <i class="fas fa-times"></i>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
