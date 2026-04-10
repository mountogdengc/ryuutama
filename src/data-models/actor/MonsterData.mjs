const { NumberField, StringField, BooleanField, SchemaField } = foundry.data.fields;

export class MonsterData extends foundry.abstract.TypeDataModel {
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
      }),
      habitat: new StringField({ required: true, initial: "" }),
      season: new StringField({ required: true, initial: "" }),
      ref: new NumberField({ required: true, min: 0, initial: 0 }),
      accuracy: new StringField({ required: true, initial: "" }),
      damage: new StringField({ required: true, initial: "" }),
      armor: new NumberField({ required: true, min: 0, initial: 0 }),
      ability: new SchemaField({
        description: new StringField({ required: true, initial: "" }),
        accuracy: new StringField({ required: true, initial: "" }),
        damage: new StringField({ required: true, initial: "" }),
      }),
    };
  }
}
