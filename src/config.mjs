export const RYUU = {};

// Dice
RYUU.DICE_MIN = 4;
RYUU.DICE_MAX = 12;
RYUU.DICE_STEP = 2;

// Level
RYUU.LEVEL_MIN = 1;
RYUU.LEVEL_MAX = 10;

// Experience
RYUU.EXP_MIN = 0;
RYUU.EXP_MAX = 10000;
RYUU.CHARACTER_EXP_LEVELS = [0, 100, 600, 1200, 2000, 3000, 4200, 5800, 7500, 10000, Infinity];

// HP/MP point distribution per level
RYUU.POINT_MAX = 3;

// Equipment slots
RYUU.MAX_HAND = 2;
RYUU.MAX_CHEST = 1;
RYUU.MAX_HEAD = 1;
RYUU.MAX_FACE = 1;
RYUU.MAX_BACK = 1;
RYUU.MAX_STAFF = 1;
RYUU.MAX_ACCESSORY = 2;
RYUU.MAX_FEET = 1;
RYUU.MAX_TRAVEL = 4;

// Item type categories
RYUU.NO_ENCHANTS = ["class", "container", "feature"];
RYUU.NO_STORE = ["animal", "class", "feature"];
RYUU.STORAGE = ["animal", "container"];
RYUU.EQUIPPABLE = ["armor", "shield", "traveling", "weapon"];

// Default terrain settings
RYUU.DEFAULT_TERRAINS = [
  { name: "Grassland", dc: 6 },
  { name: "Wasteland", dc: 6 },
  { name: "Woods", dc: 8 },
  { name: "Highlands", dc: 8 },
  { name: "Rocky Terrain", dc: 8 },
  { name: "Deep Forest", dc: 10 },
  { name: "Swamp", dc: 10 },
  { name: "Mountain", dc: 10 },
  { name: "Desert", dc: 12 },
  { name: "Jungle", dc: 12 },
  { name: "Alpine", dc: 14 },
  { name: "", dc: 0 },
  { name: "", dc: 0 },
  { name: "", dc: 0 },
  { name: "", dc: 0 },
  { name: "", dc: 0 },
];

// Default weather settings
RYUU.DEFAULT_WEATHERS = [
  { name: "Rain", dc: 1 },
  { name: "Strong Wind", dc: 1 },
  { name: "Fog", dc: 1 },
  { name: "Hot", dc: 1 },
  { name: "Cold", dc: 1 },
  { name: "Hard Rain", dc: 3 },
  { name: "Snow", dc: 3 },
  { name: "Deep Fog", dc: 3 },
  { name: "Dark", dc: 3 },
  { name: "Hurricane", dc: 5 },
  { name: "Blizzard", dc: 5 },
  { name: "", dc: 0 },
  { name: "", dc: 0 },
  { name: "", dc: 0 },
  { name: "", dc: 0 },
  { name: "", dc: 0 },
];
