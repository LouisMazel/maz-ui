/// <reference types="vitest" />

import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        html: 'jsdom',
      },
    },
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
        'src/types/**/*',
        'src/index.ts',
        'src/**/*/index.ts',
      ],
      extension: ['.js', '.ts', '.vue'],
      thresholds: {
        lines: 74.5,
        functions: 73.68,
        branches: 83.09,
        statements: 74.5,
        autoUpdate: true,
      },
    },
    exclude: defaultExclude,
  },
})
