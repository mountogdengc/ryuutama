<script>
  let { item, tick, sheet } = $props();

  let data = $derived.by(() => {
    tick;
    return item.system;
  });

  async function removeFeature(index) {
    const features = [...(item.system.features || [])];
    features.splice(index, 1);
    await item.update({ "system.features": features });
  }
</script>

<div class="class-form space-y-3 text-sm">
  <!-- Type -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Class Type</span>
    <select class="form-input" value={data.type}
      onchange={(e) => item.update({ "system.type": e.target.value })}>
      <option value="attack">Attack</option>
      <option value="technical">Technical</option>
      <option value="magic">Magic</option>
    </select>
  </label>

  <!-- Features list -->
  <div class="features-section">
    <h4 class="text-xs font-bold text-leather uppercase border-b border-parchment pb-1 mb-2">Features</h4>
    {#if !data.features || data.features.length === 0}
      <p class="text-xs text-leather italic">No features.</p>
    {:else}
      <ul class="space-y-2">
        {#each data.features as feature, i}
          <li class="bg-parchment rounded p-2 text-xs">
            <div class="flex items-center justify-between mb-1">
              <span class="font-semibold text-leather-dark">{feature.name || "(unnamed feature)"}</span>
              <button
                class="text-leather hover:text-rust"
                onclick={() => removeFeature(i)}
                title="Remove feature"
                type="button"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            {#if feature.description}
              <p class="text-leather">{feature.description}</p>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  <!-- Description -->
  <label class="flex flex-col">
    <span class="text-xs text-leather font-semibold">Description</span>
    <textarea class="form-input resize-y h-20" value={data.description}
      onchange={(e) => item.update({ "system.description": e.target.value })}></textarea>
  </label>
</div>
