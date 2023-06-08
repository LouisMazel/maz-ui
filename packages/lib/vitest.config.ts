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
      include: ['modules', 'components'],
      exclude: [
        'components/index.ts',
        'components/MazPhoneNumberInput/constantes/locales.ts',
        'tailwindcss/**/*',
        'modules/types/**/*',
        'modules/index.ts',
        'modules/helpers/index.ts',
        'modules/helpers/debounce.ts',
        'modules/helpers/user-visibility/index.ts',
        'modules/helpers/idle-timeout/index.ts',
        'modules/helpers/truthy-filter.ts',
        'modules/helpers/is-client.ts',
        'modules/helpers/sleep.ts',
        'modules/plugins/index.ts',
        'modules/filters/index.ts',
        'modules/composables/aos.ts',
        'modules/directives/index.ts',
        'modules/directives/v-zoom-img/index.ts',
        'modules/directives/v-zoom-img/style.ts',
        'modules/directives/v-zoom-img/svgs.ts',
        'modules/directives/v-lazy-img/assets/*',
        'modules/directives/v-lazy-img/index.ts',
        'modules/**/types.ts',
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
