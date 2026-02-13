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
        'src/locales/**/*',
        'src/index.ts',
        'src/**/*/index.ts',
      ],
      extension: ['.js', '.ts', '.vue'],
      thresholds: {
        lines: 95.38,
        functions: 82.75,
        branches: 95.78,
        statements: 95.38,
        autoUpdate: true,
      },
    },
    exclude: defaultExclude,
  },
})
