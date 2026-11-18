/// <reference types="vitest" />

import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  logLevel: process.env.CI ? 'error' : 'info',
  plugins: [],
  test: {
    silent: !!process.env.CI,
    hideSkippedTests: !!process.env.CI,
    reporters: process.env.CI
      ? ['dot']
      : ['tree'],
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: [
        'clover',
        'html',
        'lcov',
        'text',
        'text-summary',
      ],
      include: ['src/**/*.{js,ts}'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/index.ts',
      ],
      thresholds: {
        lines: 62.01,
        functions: 84.69,
        branches: 59.52,
        statements: 62.99,
        autoUpdate: !process.env.CI,
      },
    },
    exclude: [
      ...defaultExclude,
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
    ],
  },
})
