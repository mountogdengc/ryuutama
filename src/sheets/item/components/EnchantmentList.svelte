<script>
  import { addRemoveEnchantment } from "../../../helpers/enchantment-calc.mjs";

  let { item, tick } = $props();

  let enchantments = $derived.by(() => {
    tick;
    return item.system.enchantments || [];
  });

  function removeEnchantment(enchantmentName) {
    addRemoveEnchantment(item, { remove: true, enchantmentName });
  }
</script>

<div class="enchantment-list mt-3">
  <h4 class="text-xs font-bold text-leather uppercase border-b border-parchment pb-1 mb-1">Enchantments</h4>
  {#if enchantments.length === 0}
    <p class="text-xs text-leather italic">No enchantments.</p>
  {:else}
    <ul class="space-y-1">
      {#each enchantments as enchant}
        <li class="flex items-center justify-between text-xs bg-parchment rounded px-2 py-1">
          <span class="text-leather-dark font-medium">{enchant.name ?? enchant}</span>
          <button
            class="text-leather hover:text-rust ml-2"
            onclick={() => removeEnchantment(enchant.name ?? enchant)}
            title="Remove Enchantment"
            type="button"
          >
            <i class="fas fa-times"></i>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
