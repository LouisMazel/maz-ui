/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

import { resolve } from 'node:path'

/* eslint-disable unicorn/prefer-module */
const projectRoot = resolve(__dirname)
/* eslint-enable unicorn/prefer-module */

export default defineConfig({
  plugins: [Vue()],
  server: {
    port: 1000,
  },
  test: {
    // setupFiles: ['./vitest.setup.ts'],
    environment: 'jsdom',
    // deps: {
    //   inline: ['vitest-canvas-mock'],
    // },
    // threads: false,
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    globals: true,
    coverage: {
      provider: 'v8',
      all: true,
      excludeNodeModules: true,
      reporter: ['clover', 'html'],
      include: ['package'],
      exclude: [
        'package/components_tmp/**',
        'package/components/index.ts',
        'package/tailwindcss/**/*',
        'package/types/**/*',
        'package/index.ts',
        'package/helpers/index.ts',
        'package/helpers/debounce.ts',
        'package/helpers/user-visibility/index.ts',
        'package/helpers/idle-timeout/index.ts',
        'package/helpers/truthy-filter.ts',
        'package/helpers/is-client.ts',
        'package/helpers/sleep.ts',
        'package/plugins/index.ts',
        'package/filters/index.ts',
        'package/composables/aos.composable.ts',
        'package/directives/index.ts',
        'package/directives/v-zoom-img/index.ts',
        'package/directives/v-zoom-img/style.ts',
        'package/directives/v-zoom-img/svgs.ts',
        'package/directives/v-lazy-img/assets/*',
        'package/directives/v-lazy-img/index.ts',
        'package/**/types.ts',
        'package/components/MazPhoneNumberInput/constantes/locales.ts',
      ],
      extension: ['.js', '.ts', '.vue'],
    },
  },
  resolve: {
    alias: {
      '@package': resolve(projectRoot, 'package'),
      '@components': resolve(projectRoot, 'package/components'),
      '@tests': resolve(projectRoot, 'tests'),
    },
  },
})
