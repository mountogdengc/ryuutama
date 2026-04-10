const { NumberField, StringField, BooleanField, ArrayField } = foundry.data.fields;

export class WeaponData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      givenName: new StringField({ required: true, initial: "" }),
      description: new StringField({ required: true, initial: "" }),
      price: new NumberField({ required: true, min: 0, initial: 0 }),
      size: new NumberField({ required: true, min: 1, initial: 1 }),
      durability: new NumberField({ required: true, min: 1, initial: 1 }),
      enchantments: new ArrayField(new StringField(), { required: true, initial: [] }),
      container: new StringField({ required: true, initial: "" }),
      owner: new StringField({ required: true, initial: "" }),
      equip: new StringField({ required: true, initial: "" }),
      equipped: new BooleanField({ required: true, initial: false }),
      isWeapon: new BooleanField({ required: true, initial: true }),
      accuracy: new StringField({ required: true, initial: "" }),
      accuracyBonus: new NumberField({ required: true, initial: 0 }),
      damage: new StringField({ required: true, initial: "" }),
      damageBonus: new NumberField({ required: true, initial: 0 }),
      class: new StringField({ required: true, initial: "lightblade" }),
      masteredBonus: new NumberField({ required: true, initial: 0 }),
    };
  }
}
