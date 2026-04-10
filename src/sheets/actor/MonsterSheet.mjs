export class MonsterSheet extends foundry.applications.sheets.ActorSheetV2 {
  static DEFAULT_OPTIONS = {
    classes: ["ryuutama", "sheet", "actor", "monster"],
    position: { width: 600, height: 500 },
    window: { resizable: true },
  };

  async _renderHTML() {
    const el = document.createElement("div");
    el.textContent = "Monster Sheet (WIP)";
    return el;
  }

  _replaceHTML(result, content) {
    content.replaceChildren(result);
  }
}
