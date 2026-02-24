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
      provider: 'istanbul',
      reporter: ['clover', 'html', 'lcov', 'text', 'text-summary'],
      include: ['src/**/*.{ts,js}'],
      exclude: coverageConfigDefaults.exclude,
      thresholds: {
        lines: 96.3,
        functions: 98.66,
        branches: 90.14,
        statements: 96.42,
        autoUpdate: true,
      },
    },
    exclude: [
      ...defaultExclude,
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
    ],
  },
})
