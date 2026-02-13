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
        'src/types.ts',
        'src/states.ts',
        'src/index.ts',
        'src/**/*/index.ts',
      ],
      extension: ['.js', '.ts', '.vue'],
      thresholds: {
        lines: 73.31,
        functions: 73.68,
        branches: 83.09,
        statements: 73.31,
        autoUpdate: true,
      },
    },
    exclude: defaultExclude,
  },
})
