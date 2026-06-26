# Tree Ascension

> A 2D incremental idle tower defense game inspired by Cookie Clicker and Plants vs. Zombies.

Built with React 19, TypeScript, Vite 6, TailwindCSS v4, and HTML5 Canvas.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Production build
- `npm run type-check` — TypeScript strict validation
- `npm run biome:check` — Lint + format check (Biome)
- `npm run eslint` — ESLint check (React hooks + security + a11y)
- `npm run lint` — Full lint pipeline (type-check + biome + eslint)
- `npm test` — Run unit tests (Vitest)
- `npm run test:coverage` — Unit tests with coverage report
- `npm run test:e2e` — Run E2E tests (Playwright)
- `npm run knip` — Detect dead code and unused dependencies
- `npm run preview` — Preview production build

## Tech Stack

- **React 19** + **TypeScript 5.8** (strict mode)
- **Vite 6** build tool
- **TailwindCSS v4** for styling
- **HTML5 Canvas** game engine
- **Biome 2.x** + **ESLint 9** for code quality
- **Vitest 3** + **Playwright** for testing
- **Husky** + **lint-staged** for pre-commit hooks
- **SonarQube Community** for static analysis

## Quality Assurance

This project follows a comprehensive QA pipeline derived from enterprise-grade practices:

- **Pre-commit:** Biome format/lint + ESLint fix on staged files
- **Commit convention:** Gitmoji format enforced
- **CI:** Secret scan → Security audit → Type-check → Biome → ESLint → Build → SonarQube
- **Testing:** Unit tests (Vitest) + E2E (Playwright)
- **Release:** Tag-triggered GitHub Releases with auto-generated notes

See [QA Manual](docs/QUALITY_ASSURANCE_MANUAL.md) for full documentation.

## License

MIT
