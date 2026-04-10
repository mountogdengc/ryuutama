const { NumberField, StringField, BooleanField, ArrayField } = foundry.data.fields;

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

export class TravelingData extends foundry.abstract.TypeDataModel {
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
      isTraveling: new BooleanField({ required: true, initial: true }),
      itemBonus: new NumberField({ required: true, initial: 1 }),
      ...terrainWeatherFields(),
    };
  }
}
