/// <reference types="vitest" />

import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  test: {
    environment: 'node',
    env: {
      TZ: 'UTC',
    },
    globals: true,
    coverage: {
      provider: 'v8',
      all: true,
      reporter: ['clover', 'html', 'lcov', 'text', 'text-summary'],
      include: ['src/**/*'],
      exclude: [
        ...coverageConfigDefaults.exclude,
      ],
      extension: ['.ts'],
      thresholds: {
        lines: 73,
        functions: 96,
        branches: 67,
        statements: 73,
        autoUpdate: false,
      },
    },
    exclude: defaultExclude,
  },
})
