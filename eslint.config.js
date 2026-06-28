import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import security from 'eslint-plugin-security'
import globals from 'globals'
import tseslint from 'typescript-eslint'

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
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
    },
  },

  // Accessibility rules (incremental adoption — warn for existing code)
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
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

  // Project-specific overrides — game logic uses dynamic patterns safely
  {
    files: ['src/game.ts', 'src/saveSystem.ts'],
    rules: {
      'security/detect-object-injection': 'off',
    },
  },
)
