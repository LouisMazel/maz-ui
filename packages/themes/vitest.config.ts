/// <reference types="vitest" />

import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  logLevel: process.env.CI ? 'error' : 'info',
  plugins: [],
  test: {
    silent: !!process.env.CI,
    hideSkippedTests: !!process.env.CI,
    reporters: process.env.CI ? ['dot'] : ['tree'],
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
      reporter: ['clover', 'html', 'lcov', 'text', 'text-summary'],
      include: ['src/**/*.{js,ts,vue}'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/presets/**/*',
        'src/types/**/*',
        'src/index.ts',
        'src/**/*/index.ts',
      ],
      thresholds: {
        lines: 99.01,
        functions: 97.27,
        branches: 94.65,
        statements: 99.04,
        autoUpdate: !process.env.CI,
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
