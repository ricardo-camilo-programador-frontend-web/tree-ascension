import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

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
        exclude: ['src/**/*.d.ts', 'src/rendering/**', 'src/audio.ts', 'src/ads/**'],
        thresholds: {
          lines: 40,
          functions: 40,
          branches: 30,
          statements: 40,
        },
      },
    },
  }),
)
