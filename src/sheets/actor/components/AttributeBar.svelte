<script>
  /**
   * AttributeBar — displays a single stat (str/dex/int/spi) with a rollable button.
   * Props:
   *   label    — display label (e.g. "STR")
   *   statKey  — data key (e.g. "str")
   *   value    — die size (e.g. 8)
   *   bonus    — boolean bonus die flag
   *   onRoll   — async function(event, statKey)
   *   onBonus  — async function(checked)
   */
  let { label, statKey, value, bonus = false, onRoll, onBonus } = $props();
</script>

<button
  class="stat-block flex flex-col items-center bg-ivory border border-leather rounded px-3 py-1 cursor-pointer hover:border-rust hover:text-rust rollable"
  title="Click: 2d{value}, Alt+Click: 1d{value}, Ctrl+Click: concentration"
  onclick={(e) => onRoll?.(e, statKey)}
  type="button"
>
  <span class="text-xs font-bold text-leather uppercase">{label}</span>
  <span class="text-base font-semibold text-leather-dark">d{value}</span>
  <input
    class="w-3 h-3 mt-0.5"
    type="checkbox"
    title="Bonus die"
    checked={bonus}
    onclick={(e) => e.stopPropagation()}
    onchange={(e) => onBonus?.(e.target.checked)}
  />
</button>
