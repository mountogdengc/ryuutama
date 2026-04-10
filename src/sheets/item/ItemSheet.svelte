<script>
  import { onMount, onDestroy } from "svelte";
  import WeaponForm from "./components/WeaponForm.svelte";
  import ArmorForm from "./components/ArmorForm.svelte";
  import ShieldForm from "./components/ShieldForm.svelte";
  import SpellForm from "./components/SpellForm.svelte";
  import ClassForm from "./components/ClassForm.svelte";
  import ContainerForm from "./components/ContainerForm.svelte";
  import AnimalForm from "./components/AnimalForm.svelte";
  import TravelingForm from "./components/TravelingForm.svelte";
  import EnchantmentForm from "./components/EnchantmentForm.svelte";
  import FeatureForm from "./components/FeatureForm.svelte";

  let { item, sheet } = $props();
  let tick = $state(0);

  function onItemUpdate(doc) {
    if (doc.id === item.id) tick++;
  }

  onMount(() => {
    Hooks.on("updateItem", onItemUpdate);
  });

  onDestroy(() => {
    Hooks.off("updateItem", onItemUpdate);
  });

  let data = $derived.by(() => {
    tick;
    return {
      name: item.name,
      img: item.img,
      type: item.type,
      system: item.system,
    };
  });

  async function changeImage() {
    const fp = new FilePicker({
      type: "image",
      current: item.img,
      callback: (path) => item.update({ img: path }),
    });
    fp.browse();
  }
</script>

<div class="item-sheet-container flex flex-col h-full overflow-hidden bg-ivory">
  <!-- Header: image + name -->
  <header class="item-header flex items-center gap-3 p-3 bg-parchment border-b-2 border-leather">
    <button
      class="item-image-btn border-2 border-leather rounded overflow-hidden flex-shrink-0 cursor-pointer hover:border-rust"
      onclick={changeImage}
      title="Change Image"
      type="button"
    >
      <img src={data.img} alt={data.name} class="w-12 h-12 object-cover block" />
    </button>
    <div class="flex flex-col flex-1 min-w-0">
      <input
        class="item-name-input text-lg font-bold bg-transparent border-b border-leather-dark w-full text-leather-dark"
        type="text"
        value={data.name}
        onchange={(e) => item.update({ name: e.target.value })}
        placeholder="Item Name"
      />
      <span class="text-xs text-leather capitalize">{data.type}</span>
    </div>
  </header>

  <!-- Type-specific form -->
  <div class="item-body flex-1 overflow-y-auto p-3">
    {#if data.type === "weapon"}
      <WeaponForm {item} {tick} {sheet} />
    {:else if data.type === "armor"}
      <ArmorForm {item} {tick} {sheet} />
    {:else if data.type === "shield"}
      <ShieldForm {item} {tick} {sheet} />
    {:else if data.type === "spell"}
      <SpellForm {item} {tick} {sheet} />
    {:else if data.type === "class"}
      <ClassForm {item} {tick} {sheet} />
    {:else if data.type === "container"}
      <ContainerForm {item} {tick} {sheet} />
    {:else if data.type === "animal"}
      <AnimalForm {item} {tick} {sheet} />
    {:else if data.type === "traveling"}
      <TravelingForm {item} {tick} {sheet} />
    {:else if data.type === "enchantment"}
      <EnchantmentForm {item} {tick} {sheet} />
    {:else if data.type === "feature"}
      <FeatureForm {item} {tick} {sheet} />
    {:else}
      <p class="text-leather italic text-sm">Unknown item type: {data.type}</p>
    {/if}
  </div>
</div>
