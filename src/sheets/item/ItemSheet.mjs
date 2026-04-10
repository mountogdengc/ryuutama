export class ItemSheet extends foundry.applications.sheets.ItemSheetV2 {
  static DEFAULT_OPTIONS = {
    classes: ["ryuutama", "sheet", "item"],
    position: { width: 520, height: 480 },
    window: { resizable: true },
  };

  async _renderHTML() {
    const el = document.createElement("div");
    el.textContent = "Item Sheet (WIP)";
    return el;
  }

  _replaceHTML(result, content) {
    content.replaceChildren(result);
  }
}
