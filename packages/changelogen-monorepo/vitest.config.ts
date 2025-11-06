/// <reference types="vitest" />

import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      all: true,
      reporter: ['clover', 'html', 'lcov'],
      include: ['src/core/version.ts'],
      exclude: [
        ...coverageConfigDefaults.exclude,
      ],
      extension: ['.ts'],
    },
    exclude: defaultExclude,
  },
})
