/// <reference types="vitest" />

import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  logLevel: process.env.CI ? 'error' : 'info',
  test: {
    silent: !!process.env.CI,
    hideSkippedTests: !!process.env.CI,
    reporters: process.env.CI ? ['dot'] : ['tree'],
    environment: 'node',
    env: {
      TZ: 'UTC',
    },
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['clover', 'html', 'lcov', 'text', 'text-summary'],
      include: ['src/**/*.ts'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/**/index.ts',
        'src/types.ts',
        'tests/**',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
        autoUpdate: !process.env.CI,
      },
    },
    exclude: [
      ...defaultExclude,
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
    ],
  },
})
