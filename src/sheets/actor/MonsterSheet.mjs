import { mount, unmount } from "svelte";
import MonsterSheetComponent from "./MonsterSheet.svelte";

export class MonsterSheet extends foundry.applications.sheets.ActorSheetV2 {
  static DEFAULT_OPTIONS = {
    classes: ["ryuutama", "sheet", "actor", "monster"],
    position: { width: 600, height: 500 },
    window: { resizable: true },
  };

  #svelteComponent = null;
  #mounted = false;

  async _renderHTML(context, options) {
    const container = document.createElement("div");
    container.classList.add("ryuutama-monster-sheet");
    return container;
  }

  _replaceHTML(result, content, options) {
    if (this.#mounted && this.#svelteComponent) return;
    if (this.#svelteComponent) {
      unmount(this.#svelteComponent);
      this.#svelteComponent = null;
    }
    content.replaceChildren(result);
    this.#svelteComponent = mount(MonsterSheetComponent, {
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
