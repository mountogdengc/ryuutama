import { mount, unmount } from "svelte";
import ItemSheetComponent from "./ItemSheet.svelte";

export class ItemSheet extends foundry.applications.sheets.ItemSheetV2 {
  static DEFAULT_OPTIONS = {
    classes: ["ryuutama", "sheet", "item"],
    position: { width: 520, height: 480 },
    window: { resizable: true },
    dragDrop: [{ dropSelector: null }],
  };

  #svelteComponent = null;
  #mounted = false;

  async _renderHTML(context, options) {
    const container = document.createElement("div");
    container.classList.add("ryuutama-item-sheet");
    return container;
  }

  _replaceHTML(result, content, options) {
    if (this.#mounted && this.#svelteComponent) return;
    if (this.#svelteComponent) {
      unmount(this.#svelteComponent);
      this.#svelteComponent = null;
    }
    content.replaceChildren(result);
    this.#svelteComponent = mount(ItemSheetComponent, {
      target: result,
      props: { item: this.document, sheet: this },
    });
    this.#mounted = true;
  }

  async close(options = {}) {
    if (this.#svelteComponent) {
      unmount(this.#svelteComponent);
      this.#svelteComponent = null;
      this.#mounted = false;
    }
    return super.close(options);
  }

  get title() {
    return this.document.name;
  }
}
