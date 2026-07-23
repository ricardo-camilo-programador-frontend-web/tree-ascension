# Changelog

All notable changes to Tree Ascension are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-26

### Added
- 10 priority improvements for production quality (game mechanics, i18n, rendering extraction)
- Comprehensive QA infrastructure (Biome, ESLint, Husky, Vitest, Playwright)
- Quality Assurance Manual documenting all validation pipelines
- SonarQube Community integration for static analysis
- Lighthouse CI for accessibility auditing
- Secret scanning with TruffleHog and Gitleaks
- Dead code detection with Knip
- Dependabot for automated dependency updates
- CODEOWNERS, CONTRIBUTING.md, SECURITY.md, PR templates
- Unit tests for formatNumber and saveSystem
- TypeScript strict mode enforcement

### Fixed
- baseDamage persistence across page reloads (C1)
- enemiesKilled stat never incremented (C2)
- wavesCompleted stat never incremented (C3)
- Wave completion toast off-by-one display (C4)
- Legacy save migration bypassing validation (C5)
- Last `any` type in validateSaveData eliminated (H1)
- Unused imported constants in game.ts (H2)
- Dead syncNextId code removed, isPageHidden wired up (H3)
- Evolution speed formula sync between UI and game logic (H4)
- localStorage probe optimized, backup ordering fixed (M1/M2)
- Energy double-count on zombie kills (M3)
- NaN bypassing validation (MOA-W1)
- String.fromCharCode stack overflow on large saves (MOA-W4)
- Prestige baseDamage compounding on reload (MOA-B2)
