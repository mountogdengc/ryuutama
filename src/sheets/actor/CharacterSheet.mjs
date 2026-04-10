export class CharacterSheet extends foundry.applications.sheets.ActorSheetV2 {
  static DEFAULT_OPTIONS = {
    classes: ["ryuutama", "sheet", "actor", "character"],
    position: { width: 600, height: 700 },
    window: { resizable: true },
  };

  async _renderHTML() {
    const el = document.createElement("div");
    el.textContent = "Character Sheet (WIP)";
    return el;
  }

  _replaceHTML(result, content) {
    content.replaceChildren(result);
  }
}
