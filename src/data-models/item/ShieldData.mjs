const { NumberField, StringField, BooleanField, ArrayField } = foundry.data.fields;

export class ShieldData extends foundry.abstract.TypeDataModel {
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
      isArmor: new BooleanField({ required: true, initial: true }),
      defense: new NumberField({ required: true, initial: 0 }),
      penalty: new NumberField({ required: true, initial: 0 }),
      isShield: new BooleanField({ required: true, initial: true }),
      dodge: new NumberField({ required: true, initial: 7 }),
    };
  }
}
