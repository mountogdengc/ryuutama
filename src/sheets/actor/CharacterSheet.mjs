import { mount, unmount } from "svelte";
import CharacterSheetComponent from "./CharacterSheet.svelte";

export class CharacterSheet extends foundry.applications.sheets.ActorSheetV2 {
  static DEFAULT_OPTIONS = {
    classes: ["ryuutama", "sheet", "actor", "character"],
    position: { width: 620, height: 720 },
    window: { resizable: true },
    dragDrop: [{ dragSelector: ".item-draggable", dropSelector: null }],
  };

  #svelteComponent = null;
  #mounted = false;

  async _renderHTML(context, options) {
    const container = document.createElement("div");
    container.classList.add("ryuutama-character-sheet");
    return container;
  }

  _replaceHTML(result, content, options) {
    if (this.#mounted && this.#svelteComponent) return;

    if (this.#svelteComponent) {
      unmount(this.#svelteComponent);
      this.#svelteComponent = null;
    }

    content.replaceChildren(result);

    this.#svelteComponent = mount(CharacterSheetComponent, {
      target: result,
      props: { actor: this.document, sheet: this },
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
