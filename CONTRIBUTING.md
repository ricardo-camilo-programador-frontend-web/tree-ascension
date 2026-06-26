# Contributing to Tree Ascension

## Commit Convention

All commits must use gitmoji format:

```
:emoji_type:(scope): description
```

| Type | Emoji Code | Use Case |
|------|------------|----------|
| feat | `:sparkles:` | New feature |
| fix | `:bug:` | Bug fix |
| docs | `:memo:` | Documentation |
| refactor | `:recycle:` | Code refactoring |
| perf | `:zap:` | Performance improvement |
| test | `:white_check_mark:` | Test additions |
| chore | `:wrench:` | Tooling, config |
| ci | `:construction_worker:` | CI changes |

Examples:
```
:sparkles: feat: add plague evolution mechanic
:bug: fix(save): resolve baseDamage persistence on reload
:recycle: refactor(game): extract rendering to separate modules
```

## PR Process

1. Branch from `develop`: `git checkout -b feat/issue-number-description`
2. Make changes, commit with gitmoji format
3. Ensure all checks pass locally:
   ```bash
   npm run lint && npm test && npm run build
   ```
4. Open PR targeting `develop`
5. Wait for CI to pass
6. Request review

## Code Style

- TypeScript strict mode — no `any` types
- Biome for formatting (2-space indent, single quotes, no semicolons)
- Extract game logic into testable pure functions
- Keep components small and focused

## Testing

- Unit tests for all utility functions (`src/utils/`, `src/saveSystem.ts`)
- E2E tests for critical user flows (game start, save/load, upgrade purchase)
- Coverage target: 40%+ (game engine code is hard to unit test)

## Branching Strategy

- `main` — Production releases (tags only)
- `develop` — Integration branch (PRs target this)
- `feat/*` — Feature branches
- `fix/*` — Bug fix branches
