const { NumberField, StringField, BooleanField, ArrayField } = foundry.data.fields;

export class SpellData extends foundry.abstract.TypeDataModel {
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
      level: new StringField({ required: true, initial: "low" }),
      cost: new NumberField({ required: true, initial: 2 }),
      season: new StringField({ required: true, initial: "none" }),
      ritual: new BooleanField({ required: true, initial: false }),
      duration: new StringField({ required: true, initial: "" }),
      target: new StringField({ required: true, initial: "" }),
      range: new StringField({ required: true, initial: "" }),
    };
  }
}
