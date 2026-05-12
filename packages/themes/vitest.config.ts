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
        lines: 100,
        functions: 100,
        // Remaining uncovered branches in css-generator.ts are genuinely
        // defensive and unreachable in practice:
        // - emitComponents `bg.light ?? bg.dark ?? ''` final `?? ''` —
        //   guarded by the parent `(bg.light || bg.dark)` check.
        // - injectCSS `if (lastElement)` after `at(-1)` on an array known to
        //   have length >= 2.
        // - emitScales `else if (key !== 'md')` false-branch — `md` is
        //   required by the type, so `key === 'md' && !value` is unreachable.
        branches: 98.92,
        statements: 100,
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
