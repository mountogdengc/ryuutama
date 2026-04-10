const { NumberField, StringField, BooleanField } = foundry.data.fields;

export class EnchantmentData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new StringField({ required: true, initial: "" }),
      costMod: new NumberField({ required: true, initial: 0 }),
      modType: new NumberField({ required: true, initial: 0 }),
      durabilityMultiplier: new NumberField({ required: true, initial: 0 }),
      conditionPenalty: new NumberField({ required: true, initial: 0 }),
      unusable: new BooleanField({ required: true, initial: false }),
      unbreakable: new BooleanField({ required: true, initial: false }),
      armorPenaltyMod: new NumberField({ required: true, initial: 0 }),
      sizeMod: new NumberField({ required: true, initial: 0 }),
      mpMod: new NumberField({ required: true, initial: 0 }),
      hpMod: new NumberField({ required: true, initial: 0 }),
      durabilityValue: new NumberField({ required: true, initial: 0 }),
      setDurability: new BooleanField({ required: true, initial: false }),
      weightless: new BooleanField({ required: true, initial: false }),
      emitsLight: new BooleanField({ required: true, initial: false }),
      plusOne: new BooleanField({ required: true, initial: false }),
    };
  }
}
