const { NumberField, StringField, BooleanField, ArrayField } = foundry.data.fields;

export class FeatureData extends foundry.abstract.TypeDataModel {
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
      class: new StringField({ required: true, initial: "" }),
      journey: new NumberField({ required: true, initial: 0 }),
      condition: new NumberField({ required: true, initial: 0 }),
      capacity: new NumberField({ required: true, initial: 0 }),
      stat: new StringField({ required: true, initial: "" }),
      mastered: new StringField({ required: true, initial: "none" }),
      farmer: new BooleanField({ required: true, initial: false }),
    };
  }
}
