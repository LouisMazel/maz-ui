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
        'src/ts-helpers/**/*',
        'src/**/*/index.ts',
      ],
      extension: ['.js', '.ts', '.vue'],
      thresholds: {
        lines: 65.91,
        functions: 87.69,
        branches: 84.84,
        statements: 65.91,
        autoUpdate: true,
      },
    },
    exclude: defaultExclude,
  },
})
