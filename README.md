[![CI](https://github.com/ricardo-camilo-programador-frontend-web/tree-ascension/actions/workflows/ci.yml/badge.svg)](https://github.com/ricardo-camilo-programador-frontend-web/tree-ascension/actions)

# Tree Ascension

A 2D incremental idle tower defense game inspired by Cookie Clicker and Plants vs. Zombies. Watch your plant evolve from a tiny sprout into a mystical tree while defending against waves of zombies!

## Features

- **Idle Combat** — Your plant shoots automatically. Click to deal extra damage!
- **6 Enemy Types** — Basic, Fast, Tank, Shield, Mutant, and Boss (every 5 waves)
- **Plant Evolution** — Level up through visual stages (sprout → flower → tree → higher forms)
- **6 Upgrades** — Damage, Attack Speed, Click Damage, Energy Multiplier, Evolution Speed, Sharp Grass
- **4 Active Abilities** — Sun Burst, Root Entangle, Poison Cloud, Sol Generator
- **Skill Evolution** — Every 10 levels, choose between 3 evolution paths
- **Prestige System** — Reset for bonus energy and permanent upgrades (available at wave 50+)
- **20 Languages** — Full i18n support including English, Portuguese, Spanish, Chinese, Hindi, French, Arabic, and more
- **Cross-Platform** — Play on desktop or mobile with touch support
- **PWA Ready** — Install as a standalone app on any device

## Tech Stack

- **React 19** + **TypeScript** — UI framework
- **Vite 6** — Build tool
- **Tailwind CSS 4** — Styling
- **HTML5 Canvas 2D** — Game rendering (no external engine)
- **Web Audio API** — Procedural audio synthesis
- **localStorage** — Save system with integrity hashing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ricardo-camilo-programador-frontend-web/tree-ascension.git
cd tree-ascension

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── game.ts              # Game engine (loop, combat, rendering)
├── App.tsx              # React UI (shop, settings, abilities)
├── audio.ts             # Procedural audio system
├── i18n.ts              # Internationalization (20 languages)
├── saveSystem.ts        # Save/load/export/import with integrity
├── main.tsx             # Entry point
├── components/
│   ├── MoringaInfo.tsx   # Educational section about Moringa Oleifera
│   └── AdsterraAd.tsx    # Ad integration
├── utils/
│   ├── number.ts         # Number formatting (K, M, B, T)
│   └── performance.ts    # FPS counter and throttle
└── index.css             # Global styles + Tailwind
```

## How to Play

1. Your plant auto-attacks approaching zombies
2. Click on zombies for extra damage
3. Collect suns that appear periodically for bonus energy
4. Spend energy on upgrades in the shop
5. Unlock abilities as you level up
6. Choose skill evolutions every 10 upgrade levels
7. Prestige at wave 50+ for permanent bonuses

## Contributing

1. Fork the repository
2. Create a feature branch from `develop`
3. Make your changes
4. Run `npm run lint` to check for errors
5. Submit a pull request

## License

This project is private and proprietary.
