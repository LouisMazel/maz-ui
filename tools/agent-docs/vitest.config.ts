/// <reference types="vitest" />

import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  logLevel: process.env.CI ? 'error' : 'info',
  test: {
    silent: !!process.env.CI,
    hideSkippedTests: !!process.env.CI,
    reporters: process.env.CI ? ['dot'] : ['tree'],
    environment: 'node',
    globals: true,
    testTimeout: 60_000,
    coverage: {
      provider: 'v8',
      reporter: ['clover', 'html', 'lcov', 'text', 'text-summary'],
      include: ['src/**/*.ts'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/cli.ts',
        'src/index.ts',
        'src/types.ts',
      ],
      thresholds: {
        statements: 99.75,
        branches: 98.37,
        functions: 100,
        lines: 99.73,
        autoUpdate: !process.env.CI,
      },
    },
    exclude: [
      ...defaultExclude,
      '**/node_modules/**',
      '**/dist/**',
    ],
  },
})
