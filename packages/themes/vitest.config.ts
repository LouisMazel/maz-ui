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
      provider: 'istanbul',
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
        lines: 96.92,
        functions: 93.97,
        branches: 89.59,
        statements: 97.03,
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
