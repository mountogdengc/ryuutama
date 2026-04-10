# Ryuutama

A game system for [Ryuutama - Natural Fantasy RPG](http://kotohi.com/ryuutama/) on [Foundry VTT](https://foundryvtt.com/).

## Requirements

- Foundry VTT v14+

## Features

- Character and Monster actor sheets with full stat tracking
- 11 item types: items, weapons, armor, shields, traveling gear, containers, animals, classes, features, enchantments, and spells
- Journey check system with terrain/weather DCs, specialty bonuses, and concentration
- Dice rolling with critical/fumble detection
- Equipment slot validation (hands, chest, head, etc.)
- Container system with drag-drop item management
- Enchantment system with automatic price/durability calculation
- Level 1-10 progression with stat increases, specialties, immunities, and weapon mastery
- Customizable terrain (16 slots) and weather (16 slots) via world settings
- GM sidebar controls for current terrain, weather, and time of day
- 7 compendium packs (monsters, classes, features, items, spells, enchantments, containers)
- Localization: English, Chinese, Japanese

## Development

### Tech Stack

- [Svelte 5](https://svelte.dev/) - UI components
- [Vite 6](https://vite.dev/) - Build tooling
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling

### Setup

```bash
npm install
```

### Build

```bash
# Production build
npm run build

# Watch mode (rebuilds on file changes)
npm run dev
```

The build outputs `dist/ryuutama.js` and `dist/ryuutama.css`, which are referenced by `system.json`.

### Project Structure

```
src/
  ryuutama.mjs              # Entry point (hooks, registrations)
  config.mjs                # Game constants and defaults
  data-models/
    actor/                   # Character and Monster TypeDataModels
    item/                    # 11 item type TypeDataModels
  documents/
    RyuutamaActor.mjs       # Custom Actor class (derived data, level calc)
    RyuutamaItem.mjs         # Custom Item class (container size calc)
  sheets/
    actor/                   # AppV2 + Svelte actor sheets
    item/                    # AppV2 + Svelte item sheets
  combat/
    rolls.mjs                # Roll logic (journey, combat, concentration)
    chat-cards.mjs           # Chat message crit/fumble styling
  helpers/
    settings.mjs             # World settings registration
    sidebar.mjs              # Chat sidebar terrain/weather controls
    enchantment-calc.mjs     # Enchantment add/remove calculations
    compendium-populator.mjs # Auto-populate packs from JSON
  styles/
    ryuutama.css             # Tailwind config + custom theme
```

## Credits

- Game icons from [game-icons.net](https://game-icons.net/) (Creative Commons 3.0 BY)
- This is fan-made content. Ryuutama licensing info: http://kotohi.com/ryuutama/licensing/

## Contributing

Issues and pull requests welcome at the project repository. Please run `npm run build` before submitting to ensure a clean build.
