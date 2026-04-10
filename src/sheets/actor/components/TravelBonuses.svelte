<script>
  let { actor, tick } = $props();

  let data = $derived.by(() => {
    tick;
    return {
      traveling: actor.system.traveling || { terrain: {}, weather: {} },
      typeMap: actor.system.typeMap || [],
    };
  });
</script>

<div class="travel-bonuses text-xs">
  <h3 class="text-sm font-bold text-leather uppercase border-b border-parchment pb-1 mb-2">Travel Bonuses</h3>

  {#if data.typeMap.length === 0}
    <p class="text-leather italic">No terrain/weather types configured. Check system settings.</p>
  {:else}
    <div class="space-y-2">
      {#each data.typeMap as typeEntry}
        {@const key = typeEntry.type + typeEntry.number}
        {@const travelSection = data.traveling[typeEntry.type]?.[typeEntry.index]?.types?.[key]}
        <div class="flex items-center gap-3 border-t border-parchment py-1">
          <span class="w-24 capitalize text-leather font-medium">{typeEntry.type}{typeEntry.number}</span>
          <span class="text-leather-dark">
            Bonus: <strong>{travelSection?.bonus ?? 0}</strong>
          </span>
          {#if travelSection?.specialty}
            <span class="text-teal font-semibold">★ Specialty</span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
