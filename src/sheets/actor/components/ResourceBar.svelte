<script>
  /**
   * ResourceBar — displays a current/max resource (HP or MP).
   * Props:
   *   label     — display label (e.g. "HP")
   *   current   — current value
   *   max       — maximum value
   *   onRestore — async function() to restore to max
   *   onChange  — async function(value) when current changes
   */
  let { label, current, max, onRestore, onChange } = $props();

  let pct = $derived(max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0);
  let barColor = $derived(pct > 50 ? "bg-teal" : pct > 25 ? "bg-rust" : "bg-fumble");
</script>

<div class="resource-bar flex flex-col items-center bg-ivory border border-leather rounded px-2 py-1 min-w-16">
  <button
    class="text-xs font-bold text-leather uppercase hover:text-rust"
    onclick={onRestore}
    type="button"
    title="Click to restore {label} to max"
  >
    {label}
  </button>
  <div class="flex items-center gap-1 mt-0.5">
    <input
      class="w-10 text-center bg-transparent border-b border-parchment text-leather-dark text-sm"
      type="number"
      value={current}
      min="0"
      max={max}
      onchange={(e) => onChange?.(Number(e.target.value))}
    />
    <span class="text-leather text-sm">/</span>
    <span class="text-leather-dark text-sm font-semibold">{max}</span>
  </div>
  <!-- Visual bar -->
  <div class="w-full h-1 bg-parchment rounded mt-1 overflow-hidden">
    <div class="h-full {barColor} rounded transition-all" style="width: {pct}%"></div>
  </div>
</div>
