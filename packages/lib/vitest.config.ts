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
      provider: 'v8',
      all: true,
      reporter: ['clover', 'html', 'lcov', 'text', 'text-summary'],
      include: ['src/**/*'],
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
      extension: ['.js', '.ts', '.vue'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
        autoUpdate: true,
      },
    },
    exclude: defaultExclude,
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
