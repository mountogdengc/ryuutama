const { NumberField, StringField, BooleanField, SchemaField, ObjectField } = foundry.data.fields;

export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      biography: new StringField({ required: true, initial: "" }),
      hp: new SchemaField({
        value: new NumberField({ required: true, min: 0, initial: 8 }),
        min: new NumberField({ required: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, min: 0, initial: 8 }),
      }),
      mp: new SchemaField({
        value: new NumberField({ required: true, min: 0, initial: 8 }),
        min: new NumberField({ required: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, min: 0, initial: 8 }),
      }),
      attributes: new SchemaField({
        str: new SchemaField({
          base: new NumberField({ required: true, min: 4, max: 12, initial: 4 }),
          value: new NumberField({ required: true, min: 4, max: 12, initial: 4 }),
          bonus: new BooleanField({ required: true, initial: false }),
        }),
        dex: new SchemaField({
          base: new NumberField({ required: true, min: 4, max: 12, initial: 4 }),
          value: new NumberField({ required: true, min: 4, max: 12, initial: 4 }),
          bonus: new BooleanField({ required: true, initial: false }),
        }),
        int: new SchemaField({
          base: new NumberField({ required: true, min: 4, max: 12, initial: 4 }),
          value: new NumberField({ required: true, min: 4, max: 12, initial: 4 }),
          bonus: new BooleanField({ required: true, initial: false }),
        }),
        spi: new SchemaField({
          base: new NumberField({ required: true, min: 4, max: 12, initial: 4 }),
          value: new NumberField({ required: true, min: 4, max: 12, initial: 4 }),
          bonus: new BooleanField({ required: true, initial: false }),
        }),
        condition: new SchemaField({
          value: new NumberField({ required: true, min: 2, max: 20, initial: 2 }),
          min: new NumberField({ required: true, initial: 2 }),
          max: new NumberField({ required: true, initial: 20 }),
        }),
        initiative: new NumberField({ required: true, initial: 0 }),
        level: new NumberField({ required: true, min: 1, max: 10, initial: 1 }),
        experience: new NumberField({ required: true, min: 0, initial: 0 }),
        fumble: new NumberField({ required: true, min: 0, initial: 0 }),
        capacity: new SchemaField({
          max: new NumberField({ required: true, min: 0, initial: 0 }),
          value: new NumberField({ required: true, min: 0, initial: 0 }),
          equipped: new NumberField({ required: true, min: 0, initial: 0 }),
        }),
      }),
      gender: new StringField({ required: true, initial: "" }),
      age: new NumberField({ required: true, min: 0, initial: 20 }),
      gold: new NumberField({ required: true, min: 0, initial: 1000 }),
      specialty: new ObjectField({ required: true, initial: {} }),
      traveling: new SchemaField({
        terrain: new ObjectField({ required: true, initial: {} }),
        weather: new ObjectField({ required: true, initial: {} }),
      }),
      effects: new SchemaField({
        injury: new NumberField({ required: true, min: 0, initial: 0 }),
        poison: new NumberField({ required: true, min: 0, initial: 0 }),
        sickness: new NumberField({ required: true, min: 0, initial: 0 }),
        exhaustion: new NumberField({ required: true, min: 0, initial: 0 }),
        muddled: new NumberField({ required: true, min: 0, initial: 0 }),
        shock: new NumberField({ required: true, min: 0, initial: 0 }),
      }),
      immunity: new SchemaField({
        injury: new BooleanField({ required: true, initial: false }),
        poison: new BooleanField({ required: true, initial: false }),
        sickness: new BooleanField({ required: true, initial: false }),
        exhaustion: new BooleanField({ required: true, initial: false }),
        muddled: new BooleanField({ required: true, initial: false }),
        shock: new BooleanField({ required: true, initial: false }),
      }),
      current: new SchemaField({
        terrain: new StringField({ required: true, initial: "" }),
        weather: new StringField({ required: true, initial: "" }),
      }),
      levels: new ObjectField({ required: true, initial: {} }),
    };
  }
}
