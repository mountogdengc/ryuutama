const { NumberField, StringField, ArrayField, SchemaField } = foundry.data.fields;

export class ContainerData extends foundry.abstract.TypeDataModel {
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
      canHold: new NumberField({ required: true, initial: 0 }),
      holding: new ArrayField(
        new SchemaField({
          id: new StringField({ required: true }),
          name: new StringField({ required: true }),
        }),
        { required: true, initial: [] }
      ),
      holdingSize: new NumberField({ required: true, initial: 0 }),
    };
  }
}
