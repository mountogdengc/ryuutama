const { NumberField, StringField, BooleanField, ArrayField, SchemaField } = foundry.data.fields;

function terrainWeatherFields() {
  const fields = {};
  for (let i = 1; i <= 16; i++) {
    fields[`terrain${i}`] = new BooleanField({ required: true, initial: false });
  }
  for (let i = 1; i <= 16; i++) {
    fields[`weather${i}`] = new BooleanField({ required: true, initial: false });
  }
  return fields;
}

export class AnimalData extends foundry.abstract.TypeDataModel {
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
      equip: new StringField({ required: true, initial: "" }),
      equipped: new BooleanField({ required: true, initial: false }),
      isTraveling: new BooleanField({ required: true, initial: true }),
      itemBonus: new NumberField({ required: true, initial: 1 }),
      ...terrainWeatherFields(),
    };
  }
}
