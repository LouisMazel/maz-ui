/// <reference types="vitest" />

import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  logLevel: process.env.CI ? 'error' : 'info',
  test: {
    silent: !!process.env.CI,
    hideSkippedTests: !!process.env.CI,
    reporters: process.env.CI
      ? ['dot']
      : ['tree'],
    environment: 'node',
    globals: true,
    testTimeout: 60_000,
    coverage: {
      provider: 'v8',
      reporter: [
        'clover',
        'html',
        'lcov',
        'text',
        'text-summary',
      ],
      include: ['src/**/*.ts'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/cli.ts',
      ],
      thresholds: {
        statements: 100,
        branches: 97,
        functions: 100,
        lines: 100,
      },
    },
    exclude: [
      ...defaultExclude,
      '**/node_modules/**',
      '**/dist/**',
      'fixture/**',
    ],
  },
})
