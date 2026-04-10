import { RYUU } from "../config.mjs";

export function registerSettings() {
  // Current state settings (not shown in config UI)
  game.settings.register("ryuutama", "terrain", {
    name: "Current Terrain",
    scope: "world",
    type: String,
    default: "",
    config: false,
  });

  game.settings.register("ryuutama", "weather", {
    name: "Current Weather",
    scope: "world",
    type: String,
    default: "",
    config: false,
  });

  game.settings.register("ryuutama", "night", {
    name: "Current Time",
    scope: "world",
    type: Boolean,
    default: false,
    config: false,
  });

  // Register 16 terrain slots and 16 weather slots
  for (let i = 0; i < 16; i++) {
    const t = RYUU.DEFAULT_TERRAINS[i];
    game.settings.register("ryuutama", `terrainName${i + 1}`, {
      name: `Terrain ${i + 1} Name`,
      hint: "",
      scope: "world",
      type: String,
      default: t.name,
      config: true,
    });
    game.settings.register("ryuutama", `terrain${i + 1}`, {
      name: `Terrain ${i + 1} DC`,
      hint: "",
      scope: "world",
      type: Number,
      default: t.dc,
      config: true,
    });
  }

  for (let i = 0; i < 16; i++) {
    const w = RYUU.DEFAULT_WEATHERS[i];
    game.settings.register("ryuutama", `weatherName${i + 1}`, {
      name: `Weather ${i + 1} Name`,
      hint: "",
      scope: "world",
      type: String,
      default: w.name,
      config: true,
    });
    game.settings.register("ryuutama", `weather${i + 1}`, {
      name: `Weather ${i + 1} DC`,
      hint: "",
      scope: "world",
      type: Number,
      default: w.dc,
      config: true,
    });
  }
}
