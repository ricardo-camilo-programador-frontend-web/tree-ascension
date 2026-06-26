# Tree Ascension — Quality Assurance Manual

> **Derived from:** SGS_WEB (Consir-Sistemas-e-Sites) enterprise-grade QA infrastructure
> **Adapted for:** Tree Ascension — React 19 + TypeScript + Vite 6 + TailwindCSS v4
> **Status:** Implementation Guide — All sections actionable

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Biome — Primary Linter & Formatter](#2-biome--primary-linter--formatter)
3. [ESLint — React/Security Gap Coverage](#3-eslint--reactsecurity-gap-coverage)
4. [TypeScript Strict Mode](#4-typescript-strict-mode)
5. [Husky Git Hooks](#5-husky-git-hooks)
6. [GitHub Actions CI Pipeline](#6-github-actions-ci-pipeline)
7. [SonarQube Community Integration](#7-sonarqube-community-integration)
8. [Secret Scanning](#8-secret-scanning)
9. [Lighthouse CI](#9-lighthouse-ci)
10. [Testing Strategy](#10-testing-strategy)
11. [Release & Versioning](#11-release--versioning)
12. [Documentation Standards](#12-documentation-standards)
13. [Implementation Checklist](#13-implementation-checklist)
14. [Maintenance & Continuous Improvement](#14-maintenance--continuous-improvement)

---

## 1. Architecture Overview

### SGS_WEB Quality Stack (Reference)

SGS_WEB employs a defense-in-depth quality strategy with 12+ tools across 5 layers:

```
┌──────────────────────────────────────────────────────────────┐
│                     PRE-COMMIT (Husky)                        │
│  Biome check  →  ESLint fix  →  Security scan  →  Commit lint │
├──────────────────────────────────────────────────────────────┤
│                     CI PIPELINE (GitHub Actions)               │
│  Secret scan  →  Security audit  →  Type-check  →  Biome      │
│  →  Build  →  Chunk validation  →  Knip  →  SonarQube         │
│  →  Lighthouse  →  Netlify preview                            │
├──────────────────────────────────────────────────────────────┤
│                     TESTING                                   │
│  Vitest (unit)  →  Playwright (E2E + a11y)                    │
├──────────────────────────────────────────────────────────────┤
│                     POST-DEPLOY                              │
│  Lighthouse audit  →  SonarQube dashboard  →  Sentry          │
├──────────────────────────────────────────────────────────────┤
│                     GOVERNANCE                                │
│  Gitmoji commits  →  PR templates  →  Branch protection       │
│  →  CodeRabbit review  →  Risk labels                         │
└──────────────────────────────────────────────────────────────┘
```

### Tree Ascension Target Stack

Adapted for React 19 + Vite 6 (no Vue, no Turborepo, no pnpm workspace):

```
┌──────────────────────────────────────────────────────────────┐
│                     PRE-COMMIT (Husky)                        │
│  Biome check  →  ESLint fix  →  Commit lint (gitmoji)         │
├──────────────────────────────────────────────────────────────┤
│                     CI PIPELINE (GitHub Actions)               │
│  Secret scan  →  Security audit  →  Type-check  →  Biome      │
│  →  ESLint  →  Build  →  SonarQube                            │
├──────────────────────────────────────────────────────────────┤
│                     TESTING                                   │
│  Vitest (unit)  →  Playwright (E2E)                           │
├──────────────────────────────────────────────────────────────┤
│                     RELEASE                                   │
│  Tag-triggered GitHub Release with auto-generated notes       │
├──────────────────────────────────────────────────────────────┤
│                     GOVERNANCE                                │
│  Gitmoji commits  →  PR templates  →  Branch protection       │
│  →  CODEOWNERS  →  Risk labels                                │
└──────────────────────────────────────────────────────────────┘
```

### Tool Selection Rationale

| Tool | Why | SGS_WEB Equivalent |
|------|-----|---------------------|
| **Biome 2.x** | Single tool for lint + format, 50× faster than ESLint+Prettier, native TypeScript | Same (Biome is framework-agnostic) |
| **ESLint 9** | React-specific rules (hooks, exhaustive-deps), `eslint-plugin-security` | Same concept (SGS_WEB uses it for Vue gaps) |
| **Husky 9** | Git hooks for pre-commit enforcement | Same |
| **Vitest 3** | Vite-native, zero-config, fast | Same (SGS_WEB uses Vitest) |
| **Playwright** | E2E for canvas game interactions | Same (SGS_WEB uses for E2E) |
| **GitHub Actions** | Already in use, self-hosted runners available | Same |
| **SonarQube Community** | Already configured, self-hosted instance available | Same |

---

## 2. Biome — Primary Linter & Formatter

### 2.1 Installation

```bash
npm install --save-dev @biomejs/biome
```

### 2.2 Configuration

Create `biome.json` in project root:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": true,
    "includes": [
      "**/*.ts",
      "**/*.tsx",
      "**/*.js",
      "**/*.jsx",
      "**/*.json",
      "**/*.css"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "all",
      "arrowParentheses": "asNeeded",
      "operatorLinebreak": "before"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "correctness": {
        "noUnusedImports": "error",
        "noUnusedVariables": "error",
        "useParseIntRadix": "error",
        "useExhaustiveDependencies": "warn"
      },
      "style": {
        "useConst": "error",
        "useTemplate": "warn",
        "useImportType": "warn",
        "useNamingConvention": "off"
      },
      "suspicious": {
        "noExplicitAny": "error",
        "noImplicitAnyLet": "error",
        "noArrayIndexKey": "warn",
        "noConsole": {
          "level": "warn",
          "options": {
            "allow": ["warn", "error"]
          }
        }
      },
      "nursery": {
        "noFloatingPromises": "error",
        "noMisusedPromises": "error"
      }
    }
  }
}
```

### 2.3 Key Rules Explained

| Rule | Level | Rationale |
|------|-------|-----------|
| `noUnusedImports` | error | Dead imports inflate bundle size |
| `noUnusedVariables` | error | Dead code = maintenance burden |
| `noExplicitAny` | error | TypeScript safety — forces proper typing |
| `noFloatingPromises" ` | error | Unhandled promise rejections crash silently |
| `noMisusedPromises" ` | error | Async function passed where non-async expected |
| `useExhaustiveDependencies` | warn | React hooks dependency array completeness |
| `noConsole` | warn | Console.log left in production code |
| `useConst` | error | Prevents accidental reassignment |
| `noArrayIndexKey` | warn | React list rendering key pitfall |

### 2.4 npm Scripts

```json
{
  "scripts": {
    "biome:check": "biome check src/",
    "biome:fix": "biome check --write src/",
    "biome:format": "biome format --write src/"
  }
}
```

### 2.5 Success Criteria

- `npm run biome:check` exits 0 on clean code
- `biome check --write` auto-fixes all auto-fixable issues
- Pre-commit hook runs `biome check` on staged files only

---

## 3. ESLint — React/Security Gap Coverage

### 3.1 Why ESLint Alongside Biome

Biome does not cover React-specific rules (hooks rules, exhaustive deps) or security-focused rules. ESLint fills these gaps — the same pattern SGS_WEB uses (Biome for general, ESLint for Vue gaps).

### 3.2 Installation

```bash
npm install --save-dev eslint @eslint/js typescript-eslint \
  eslint-plugin-react-hooks eslint-plugin-security \
  eslint-plugin-jsx-a11y globals
```

### 3.3 Configuration

Create `eslint.config.js` in project root (flat config format):

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import security from 'eslint-plugin-security';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  // Base ignores
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.config.*'],
  },

  // Base JS + TS recommendations
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React Hooks rules
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
    },
  },

  // Accessibility rules
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      // Incremental adoption — warn for existing code
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/no-static-element-interactions': 'off',
    },
  },

  // Security rules
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      security,
    },
    rules: {
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-non-literal-fs-filename': 'off',
    },
  },

  // Project-specific overrides
  {
    files: ['src/game.ts', 'src/saveSystem.ts'],
    rules: {
      // Game logic uses Math.random extensively — safe, not regex-based
      'security/detect-object-injection': 'off',
    },
  },
);
```

### 3.4 npm Scripts

```json
{
  "scripts": {
    "eslint": "eslint src/",
    "eslint:fix": "eslint --fix src/"
  }
}
```

### 3.5 Success Criteria

- `npm run eslint` exits 0 on clean code
- No React hooks violations (rules-of-hooks, exhaustive-deps)
- No `eval()` or `Function()` constructor usage detected
- a11y warnings tracked for incremental fix

---

## 4. TypeScript Strict Mode

### 4.1 Configuration

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": false,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["src"]
}
```

### 4.2 Key Additions vs Current

| Setting | Current | Target | Why |
|---------|---------|--------|-----|
| `strict` | not set | `true` | Enables all strict type checks |
| `noUnusedLocals` | not set | `true` | Dead variable prevention |
| `noUnusedParameters` | not set | `true` | Dead parameter prevention |
| `noFallthroughCasesInSwitch` | not set | `true` | Prevents switch-case bugs |
| `noImplicitOverride` | not set | `true` | Requires `override` keyword |
| `allowJs` | `true` | removed | Force TypeScript-only |

### 4.3 Type-Check Script

```json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

### 4.4 Success Criteria

- `npm run type-check` exits 0
- No `any` types in source code (Biome enforces)
- No implicit `any` from missing type annotations

---

## 5. Husky Git Hooks

### 5.1 Installation

```bash
npm install --save-dev husky lint-staged
npx husky init
```

### 5.2 Pre-Commit Hook

Create `.husky/pre-commit`:

```sh
#!/usr/bin/env sh
set -e

# Run lint-staged (Biome + ESLint on staged files only)
npx lint-staged

# Validate commit message format (gitmoji)
```

### 5.3 Commit-Message Hook

Create `.husky/commit-msg`:

```sh
#!/usr/bin/env sh
set -e

# Skip merge, revert, fixup, squash commits
if [ -f .git/MERGE_MSG ]; then exit 0; fi
if [ -f .git/SQUASH_MSG ]; then exit 0; fi

commit_regex='^:[a-z_]+:\s[a-z]+(\([a-zA-Z0-9/_.-]+\))?: .+'
error_msg="Abnormal commit message format!

Expected format: :emoji_type:(scope): description
Examples:
  :sparkles: feat: add new game mechanic
  :bug: fix(player): resolve damage calculation bug
  :memo: docs: update README
  :recycle: refactor(save): restructure save system

Run 'git commit --amend' to fix the message."

if ! grep -iqE "$commit_regex" "$1"; then
  echo "$error_msg" >&2
  exit 1
fi
```

### 5.4 lint-staged Configuration

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["biome check --write", "eslint --fix"],
    "*.{json,css,md}": ["biome check --write"]
  }
}
```

### 5.5 Success Criteria

- Commit with non-gitmoji format is rejected
- Staged files are auto-formatted on commit
- Pre-commit hook completes in <5 seconds (Biome is fast)

---

## 6. GitHub Actions CI Pipeline

### 6.1 Current State

Tree-ascension already has `.github/workflows/ci.yml` with:
- Lint job (`tsc --noEmit`)
- Build job
- Security audit job
- SonarQube job

### 6.2 Upgrades Required

1. **Add `develop` branch** to triggers (currently only `main`)
2. **Replace `tsc --noEmit` lint** with Biome + ESLint + type-check
3. **Add secret scanning** (TruffleHog or Gitleaks)
4. **Add commit message validation** in CI (not just Husky)
5. **Add branch protection** for PRs to `main` (must come from `develop`)

### 6.3 Target CI Configuration

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  secret-scan:
    name: Secret Scanning
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: TruffleHog OSS
        uses: trufflesecurity/trufflehog@main
        with:
          path: .
          extra: --regex --results=verified,unknown --entropy=False

  security:
    name: Security Audit
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - name: npm audit
        run: npm audit --audit-level moderate
        continue-on-error: true

  validate:
    name: Type Check + Lint + Build
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: [secret-scan, security]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - name: Type Check
        run: npm run type-check
      - name: Biome Check
        run: npm run biome:check
      - name: ESLint
        run: npm run eslint
      - name: Build
        run: npm run build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-dist
          path: dist/
          retention-days: 7

  sonar:
    name: SonarQube Analysis
    runs-on: self-hosted
    needs: [secret-scan, security]
    continue-on-error: true
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Run SonarScanner
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        run: /opt/sonar-scanner/bin/sonar-scanner

  validate-pr-base:
    name: Validate PR Base Branch
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - name: Check base branch
        run: |
          if [ "${{ github.base_ref }}" != "develop" ] && [ "${{ github.base_ref }}" != "main" ]; then
            echo "::error::PRs must target 'develop' or 'main'"
            exit 1
          fi
```

### 6.4 Success Criteria

- CI runs on every push and PR to `main` and `develop`
- Secret scan catches leaked API keys before merge
- Type-check + Biome + ESLint all pass before build
- Build artifact uploaded for deployment
- SonarQube analysis runs (non-blocking)
- PRs from non-develop branches to main are rejected

---

## 7. SonarQube Community Integration

### 7.1 Current State

Tree-ascension already has `sonar-project.properties`. SGS_WEB pattern improvements:

### 7.2 Configuration

Update `sonar-project.properties`:

```properties
sonar.projectKey=tree-ascension
sonar.projectName=Tree Ascension
sonar.projectVersion=1.0.0
sonar.sources=src
sonar.host.url=http://localhost:9000
sonar.sourceEncoding=UTF-8

# Exclusions
sonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/**,**/*.spec.ts,**/*.test.ts,**/tests/**,*.tsbuildinfo,**/*.d.ts

# Coverage
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Duplication thresholds
sonar.cpd.exclusions=**/node_modules/**

# Issue suppressions (each with documented justification)
# S1135: TODO tracking — game has intentional TODOs for future features
sonar.issue.ignore.multicriteria=e1
sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S1135
sonar.issue.ignore.multicriteria.e1.resourceKey=**/*.ts
```

### 7.3 Local SonarQube via Docker

Create `docker-compose.sonar.yml`:

```yaml
version: "3.8"
services:
  sonarqube:
    image: sonarqube:community
    ports:
      - "9000:9000"
    environment:
      - sonar.jdbc.url=jdbc:postgresql://db:5432/sonar
      - sonar.jdbc.username=sonar
      - sonar.jdbc.password=sonar
    volumes:
      - sonarqube_conf:/opt/sonarqube/conf
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_logs:/opt/sonarqube/logs
      - sonarqube_extensions:/opt/sonarqube/extensions
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=sonar
      - POSTGRES_PASSWORD=sonar
      - POSTGRES_DB=sonar
    volumes:
      - postgresql:/var/lib/postgresql
      - postgresql_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sonar"]
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  sonarqube_conf:
  sonarqube_data:
  sonarqube_logs:
  sonarqube_extensions:
  postgresql:
  postgresql_data:
```

### 7.4 Success Criteria

- `docker compose -f docker-compose.sonar.yml up -d` starts SonarQube
- `sonar-scanner` uploads analysis to localhost:9000
- Quality gate passes (or reports issues for tracking)
- Issue suppressions have documented justifications

---

## 8. Secret Scanning

### 8.1 Gitleaks Configuration

Create `.gitleaks.toml`:

```toml
title = "Tree Ascension Secret Scanning"

[allowlist]
description = "Allowed false positives"
regexes = [
  # VITE_ env vars in .env.example are placeholders, not secrets
  '''VITE_ADSTERRA_PUBLISHER_ID=\d+''',
]

[[rules]]
id = "adsterra-publisher-id"
description = "Adsterra Publisher ID in source"
regex = '''VITE_ADSTERRA_PUBLISHER_ID\s*=\s*[0-9]+'''
tags = ["adapter", "config"]
```

### 8.2 CI Integration

Secret scanning runs in CI via TruffleHog (section 6.3). Gitleaks runs locally:

```bash
# Install
npm install --save-dev gitleaks

# Run locally
gitleaks detect --source . --config .gitleaks.toml
```

### 8.3 Success Criteria

- No real secrets (API keys, tokens, passwords) in git history
- `.env.example` placeholder values are allowlisted
- Pre-commit hook catches accidental secret commits

---

## 9. Lighthouse CI

### 9.1 Configuration

Create `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 1,
      "settings": {
        "preset": "desktop"
      }
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.85 }],
        "categories:best-practices": ["warn", { "minScore": 0.85 }],
        "categories:performance": ["warn", { "minScore": 0.5 }],
        "categories:seo": ["warn", { "minScore": 0.8 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### 9.2 CI Workflow

Create `.github/workflows/lighthouse-ci.yml`:

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main, develop]
    paths:
      - 'index.html'
      - 'src/**'
      - 'public/**'

jobs:
  lighthouse:
    name: Lighthouse Audit
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v12
        with:
          configPath: ./lighthouserc.json
          uploadArtifacts: true
```

### 9.3 Success Criteria

- Accessibility score ≥ 0.85 (error gate)
- Best practices score ≥ 0.85 (warning)
- Performance score ≥ 0.5 (warning — canvas game is render-heavy)
- SEO score ≥ 0.8 (warning)

---

## 10. Testing Strategy

### 10.1 Vitest — Unit Tests

#### Installation

```bash
npm install --save-dev vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom
```

#### Configuration

Create `vitest.config.ts`:

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'lcov'],
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.d.ts', 'src/rendering/**'],
        thresholds: {
          lines: 60,
          functions: 60,
          branches: 50,
          statements: 60,
        },
      },
    },
  }),
);
```

#### Setup File

Create `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';

// Canvas mock for game tests
HTMLCanvasElement.prototype.getContext = () => ({
  fillRect: () => {},
  clearRect: () => {},
  getImageData: (x: number, y: number, w: number, h: number) => ({
    data: new Uint8ClampedArray(w * h * 4),
  }),
  // ... minimal canvas mock
}) as unknown as CanvasRenderingContext2D;
```

#### Example Unit Test

Create `src/utils/number.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { formatNumber } from './number';

describe('formatNumber', () => {
  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('formats thousands', () => {
    expect(formatNumber(1500)).toBe('1.50K');
  });

  it('formats negative numbers', () => {
    expect(formatNumber(-5000)).toBe('-5.00K');
  });

  it('handles very large numbers', () => {
    expect(formatNumber(1e15)).toBe('1.00P'); // Peta — suffix cap
  });
});
```

### 10.2 Playwright — E2E Tests

#### Installation

```bash
npm install --save-dev @playwright/test
```

#### Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 10.3 npm Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:ui": "playwright test --ui"
  }
}
```

### 10.4 Success Criteria

- `npm test` runs all unit tests, exits 0
- Coverage ≥ 60% for game logic (saveSystem, number utils, game state)
- E2E test verifies game loads, canvas renders, click works
- Coverage report at `coverage/lcov.info` for SonarQube

---

## 11. Release & Versioning

### 11.1 Versioning Strategy

Follow **Semantic Versioning** (SemVer):

- `MAJOR` (X.0.0): Breaking changes (game engine rewrite, save format incompatibility)
- `MINOR` (1.X.0): New features (new plant type, new zombie type, new game mechanic)
- `PATCH` (1.0.X): Bug fixes (save system fix, UI glitch, balance tweak)

### 11.2 Commit Convention — Gitmoji

All commits must follow this format:

```
:emoji_type:(scope): description
```

| Type | Emoji Code | Use Case |
|------|------------|----------|
| feat | `:sparkles:` | New feature |
| fix | `:bug:` | Bug fix |
| docs | `:memo:` | Documentation |
| style | `:lipstick:` | UI/CSS changes |
| refactor | `:recycle:` | Code refactoring |
| perf | `:zap:` | Performance improvement |
| test | `:white_check_mark:` | Test additions |
| chore | `:wrench:` | Tooling, config |
| ci | `:construction_worker:` | CI changes |
| release | `:tag:` | Release commits |

Examples:
```
:sparkles: feat: add plague evolution mechanic
:bug: fix(save): resolve baseDamage persistence on reload
:recycle: refactor(game): extract rendering to separate modules
:test_tube: test(utils): add formatNumber edge case tests
```

### 11.3 Release Workflow

The existing `.github/workflows/release.yml` already handles tag-triggered releases. Enhancements:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: |
            dist/**/*.js
            dist/**/*.css
            dist/index.html
          generate_release_notes: true
          draft: false
          prerelease: ${{ contains(github.ref, '-') }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 11.4 CHANGELOG

Create `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/):

```markdown
# Changelog

All notable changes to Tree Ascension are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-26

### Added
- 10 priority improvements for production quality (game mechanics, i18n, rendering)
- MOA code review pipeline with 3-reviewer consensus
- Quality assurance infrastructure (Biome, ESLint, Husky, Vitest)

### Fixed
- baseDamage persistence across page reloads
- Wave completion toast off-by-one display
- Evolution speed formula sync between UI and game logic
- Save system double-count of totalEnergyGenerated
- Prestige baseDamage compounding on reload
```

### 11.5 Success Criteria

- Every release has a git tag matching `v*.*.*`
- GitHub Release auto-generates release notes from commits
- CHANGELOG.md updated for each release
- Pre-release versions (e.g., `v1.1.0-beta`) marked as prerelease

---

## 12. Documentation Standards

### 12.1 README.md

Create a comprehensive README:

```markdown
# Tree Ascension

> A 2D incremental idle tower defense game inspired by Cookie Clicker and Plants vs. Zombies.

Built with React 19, TypeScript, Vite 6, and HTML5 Canvas.

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Start dev server |
| npm run build | Production build |
| npm run type-check | TypeScript validation |
| npm run biome:check | Lint + format check |
| npm run eslint | ESLint check |
| npm test | Run unit tests |
| npm run test:e2e | Run E2E tests |
| npm run preview | Preview production build |

## Tech Stack

- React 19 + TypeScript 5.8
- Vite 6 build tool
- TailwindCSS v4
- HTML5 Canvas game engine
- Biome + ESLint for code quality
- Vitest + Playwright for testing

## License

MIT
```

### 12.2 CONTRIBUTING.md

```markdown
# Contributing to Tree Ascension

## Commit Convention

All commits must use gitmoji format:

\`\`\`
:emoji_type:(scope): description
\`\`\`

See [QA Manual](docs/QUALITY_ASSURANCE_MANUAL.md) for full convention.

## PR Process

1. Branch from `develop`: `git checkout -b feat/issue-number-description`
2. Make changes, commit with gitmoji format
3. Ensure all checks pass locally:
   \`\`\`bash
   npm run type-check && npm run biome:check && npm run eslint && npm test
   \`\`\`
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
```

### 12.3 SECURITY.md

```markdown
# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Tree Ascension:

1. **Do not** open a public issue
2. Email: [security contact]
3. Include a description and steps to reproduce

## Security Measures

- Save data integrity check (DJB2 hash with salt)
- No server-side storage — all data is client-side (localStorage)
- npm audit in CI for dependency vulnerabilities
- TruffleHog secret scanning in CI
- No `eval()`, `Function()`, or `innerHTML` usage (enforced by ESLint)

## Scope

Tree Ascension is a client-side only game. The threat model is:
- Save tampering (detected, not prevented — single-player game)
- XSS via injected content (prevented by React's JSX escaping)
- Dependency vulnerabilities (monitored via npm audit)
```

### 12.4 CODEOWNERS

Create `.github/CODEOWNERS`:

```
# Default owner
* @ricardo-camilo-programador-frontend-web

# Game logic
/src/game.ts @ricardo-camilo-programador-frontend-web

# Save system
/src/saveSystem.ts @ricardo-camilo-programador-frontend-web

# CI/CD
/.github/ @ricardo-camilo-programador-frontend-web
```

### 12.5 PR Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description

Brief description of changes.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation
- [ ] Performance
- [ ] Test

## Checklist

- [ ] Commits follow gitmoji convention
- [ ] `npm run type-check` passes
- [ ] `npm run biome:check` passes
- [ ] `npm run eslint` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes

## Related Issue

Closes #
```

### 12.6 Success Criteria

- README has Quick Start, scripts, tech stack
- CONTRIBUTING has commit convention, PR process, testing guidelines
- SECURITY.md has reporting process and security measures
- CODEOWNERS enforces review on critical paths
- PR template has checklist for all quality gates

---

## 13. Implementation Checklist

### Phase 1: Linting & Formatting (Day 1)

- [ ] Install Biome (`npm i -D @biomejs/biome`)
- [ ] Create `biome.json`
- [ ] Run `biome check --write src/` to auto-fix existing code
- [ ] Install ESLint + plugins (`eslint-plugin-react-hooks`, `eslint-plugin-security`, `eslint-plugin-jsx-a11y`)
- [ ] Create `eslint.config.js`
- [ ] Run `eslint --fix src/`
- [ ] Add npm scripts: `biome:check`, `biome:fix`, `eslint`, `eslint:fix`
- [ ] Update `tsconfig.json` to strict mode
- [ ] Run `tsc --noEmit` — fix all type errors
- [ ] **Gate:** `type-check && biome:check && eslint` all pass

### Phase 2: Git Hooks (Day 1)

- [ ] Install Husky + lint-staged (`npm i -D husky lint-staged`)
- [ ] Run `npx husky init`
- [ ] Create `.husky/pre-commit` (lint-staged)
- [ ] Create `.husky/commit-msg` (gitmoji validation)
- [ ] Add `lint-staged` config to `package.json`
- [ ] **Gate:** Bad commit format rejected, staged files auto-formatted

### Phase 3: Testing (Day 2)

- [ ] Install Vitest + coverage + testing-library
- [ ] Create `vitest.config.ts` + `tests/setup.ts`
- [ ] Write unit tests for: `formatNumber`, `saveSystem`, `game` state functions
- [ ] Install Playwright
- [ ] Create `playwright.config.ts`
- [ ] Write E2E test: game loads, canvas renders
- [ ] Add npm scripts: `test`, `test:coverage`, `test:e2e`
- [ ] **Gate:** `npm test` passes, coverage report generated

### Phase 4: CI Pipeline (Day 2)

- [ ] Update `.github/workflows/ci.yml` with Biome + ESLint + type-check
- [ ] Add secret scanning job (TruffleHog)
- [ ] Add branch validation job
- [ ] Add `develop` branch to triggers
- [ ] Create `.github/workflows/lighthouse-ci.yml`
- [ ] Update `sonar-project.properties`
- [ ] Create `docker-compose.sonar.yml`
- [ ] **Gate:** CI passes on push and PR

### Phase 5: Documentation (Day 3)

- [ ] Write `README.md`
- [ ] Write `CONTRIBUTING.md`
- `markdown
- [ ] Write `SECURITY.md`
- [ ] Create `.github/CODEOWNERS`
- [ ] Create `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] Create `.gitleaks.toml`
- [ ] Write `CHANGELOG.md`
- [ ] **Gate:** All docs present and accurate

### Phase 6: Release Process (Day 3)

- [ ] Update `.github/workflows/release.yml` to v2 API
- [ ] Test release with `v1.0.0` tag
- [ ] Verify GitHub Release created with auto-notes
- [ ] **Gate:** Release workflow creates GitHub Release

---

## 14. Maintenance & Continuous Improvement

### 14.1 Weekly

- Review SonarQube dashboard for new issues
- Check npm audit for new vulnerabilities
- Review test coverage trends

### 14.2 Monthly

- Update Biome/ESLint to latest versions
- Review and resolve ESLint warnings (a11y, security)
- Review Lighthouse scores — address regressions
- Prune dead code with `knip`

### 14.3 Per Release

- Update `CHANGELOG.md`
- Bump `sonar.projectVersion` in `sonar-project.properties`
- Run full QA suite: `type-check && biome:check && eslint && test && build`
- Create git tag matching release version

### 14.4 Knip — Dead Code Detection

```bash
npm install --save-dev knip
```

Create `knip.json`:

```json
{
  "ignore": ["src/audio.ts"],
  "ignoreDependencies": ["autoprefixer"]
}
```

```json
{
  "scripts": {
    "knip": "knip"
  }
}
```

### 14.5 Dependency Updates

Set up Dependabot in `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
    commit-message:
      prefix: ":arrow_up:"
```

### 14.6 Success Criteria for Maintenance

- Zero unresolved SonarQube critical issues
- npm audit reports 0 moderate+ vulnerabilities
- Test coverage ≥ 60% and trending up
- Lighthouse a11y score ≥ 0.85
- No dead code detected by knip
- Dependencies updated within 30 days of upstream release

---

## Appendix A: SGS_WEB → Tree Ascension Feature Mapping

| SGS_WEB Feature | Tree Ascension Adaptation | Priority |
|-----------------|---------------------------|----------|
| Biome 2.x with Vue domain | Biome 2.x without Vue domain | P0 |
| ESLint with Vue lifecycle rules | ESLint with React hooks rules | P0 |
| Prettier for .vue files | Not needed (Biome handles .tsx) | — |
| Husky pre-commit (4-stage) | Husky pre-commit (2-stage: lint-staged + commit-lint) | P0 |
| Turborepo remote cache | Not needed (single project) | — |
| Netlify preview deploy | Optional future addition | P2 |
| Creedengo green-code plugin | Not applicable (no DOM-heavy Vue app) | — |
| Custom security scripts (steganography) | ESLint security plugin covers main risks | P1 |
| TruffleHog in CI | TruffleHog in CI (same) | P0 |
| Gitleaks with custom rules | Gitleaks with Adsterra allowlist | P1 |
| Lighthouse CI with a11y report | Lighthouse CI (same pattern) | P1 |
| Playwright 3 configs (API/frontend/a11y) | Playwright 1 config (game E2E) | P1 |
| CodeRabbit auto-review | Future addition | P2 |
| PR triage auto-labels | GitHub labeler + risk assessment | P2 |
| Vitest with coverage for SonarQube | Vitest with coverage for SonarQube (same) | P0 |
| SemVer + tag releases | SemVer + tag releases (already exists) | P0 |
| docker-compose for SonarQube | docker-compose for SonarQube (same) | P1 |
| PR templates + CODEOWNERS | PR templates + CODEOWNERS (same) | P0 |
| `validate-package-scripts.ts` | Covered by npm audit + ESLint security | — |
| Chunk isolation validation | Vendor chunk splitting in vite.config | P2 |
| Custom shell linters | Not needed for current scope | — |
| knip dead-dep detection | knip (same) | P1 |
| Dependabot | Dependabot (same) | P1 |

---

## Appendix B: Package.json Target State

```json
{
  "name": "tree-ascension",
  "private": true,
  "version": "1.0.0",
  "description": "A 2D incremental idle tower defense game",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist coverage",
    "type-check": "tsc --noEmit",
    "lint": "npm run type-check && npm run biome:check && npm run eslint",
    "biome:check": "biome check src/",
    "biome:fix": "biome check --write src/",
    "eslint": "eslint src/",
    "eslint:fix": "eslint --fix src/",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "knip": "knip"
  },
  "dependencies": {
    "lucide-react": "^0.546.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.2.4",
    "@eslint/js": "^9.0.0",
    "@playwright/test": "^1.50.0",
    "@tailwindcss/vite": "^4.1.14",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.4",
    "@vitest/coverage-v8": "^3.0.0",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.0.0",
    "eslint-plugin-jsx-a11y": "^6.0.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-security": "^3.0.0",
    "husky": "^9.0.0",
    "jsdom": "^25.0.0",
    "knip": "^5.0.0",
    "lint-staged": "^15.0.0",
    "tailwindcss": "^4.1.14",
    "typescript": "~5.8.2",
    "typescript-eslint": "^8.0.0",
    "vite": "^6.2.0",
    "vitest": "^3.0.0"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["biome check --write", "eslint --fix"],
    "*.{json,css,md}": ["biome check --write"]
  }
}
```

---

*This manual is a living document. Update it when tools are added, rules change, or lessons are learned during implementation.*
