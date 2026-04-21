/// <reference types="vitest" />

import { fileURLToPath } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import SvgLoader from 'vite-svg-loader'

import { coverageConfigDefaults, defaultExclude, defineConfig } from 'vitest/config'
import { ViteBuildIcons, ViteBuildThemes } from './build'

export default defineConfig({
  plugins: [Vue({ template: { compilerOptions: { comments: false } } }), SvgLoader(), ViteBuildIcons({ testing: true }), ViteBuildThemes({ testing: true })],
  server: {
    port: 1111,
  },
  test: {
    setupFiles: ['./tests/vitest-global.setup.ts'],
    environment: 'jsdom',
    clearMocks: true,

    environmentOptions: {
      jsdom: {
        resources: 'usable',
        html: 'jsdom',
        // Disable network requests to prevent AggregateError
        url: 'http://localhost',
      },
    },
    env: {
      TZ: 'UTC',
    },
    globals: true,
    coverage: {
      ...coverageConfigDefaults,
      provider: 'v8',
      reporter: ['clover', 'html', 'lcov', 'text', 'text-summary'],
      include: ['src/**/*.{js,ts,vue}'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/tailwindcss/**/*',
        'src/types/**/*',
        'src/index.ts',
        'src/**/*/index.ts',
        'src/composables/useUserVisibility.ts',
        'src/composables/useAos.ts',
        'src/composables/useToast.ts',
        'src/composables/useDialog.ts',
        'src/composables/useWait.ts',
        'src/**/types.ts',
      ],
      thresholds: {
        lines: 88.81,
        functions: 87.75,
        branches: 82.94,
        statements: 88.93,
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
  resolve: {
    alias: {
      '#': fileURLToPath(new URL('.', import.meta.url)),
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@components': fileURLToPath(new URL('src/components', import.meta.url)),
      '@composables': fileURLToPath(new URL('src/composables', import.meta.url)),
      '@directives': fileURLToPath(new URL('src/directives', import.meta.url)),
      '@icons': fileURLToPath(new URL('src/icons', import.meta.url)),
      '@plugins': fileURLToPath(new URL('src/plugins', import.meta.url)),
      '@resolvers': fileURLToPath(new URL('src/resolvers', import.meta.url)),
      '@tests': fileURLToPath(new URL('tests', import.meta.url)),
    },
  },
})
