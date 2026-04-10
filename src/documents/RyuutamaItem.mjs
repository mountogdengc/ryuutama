export class RyuutamaItem extends Item {
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type === "container" || this.type === "animal") {
      this._prepareStorageData();
    }
  }

  _prepareStorageData() {
    const holding = this.system.holding || [];
    if (!this.parent) {
      this.system.holdingSize = 0;
      return;
    }
    let totalSize = 0;
    for (const held of holding) {
      const heldItem = this.parent.items.get(held.id);
      if (heldItem) {
        totalSize += Number(heldItem.system.size) || 0;
      }
    }
    this.system.holdingSize = totalSize;
  }
}
