/// <reference types="vitest" />

import { fileURLToPath } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import SvgLoader from 'vite-svg-loader'

import { defineConfig } from 'vitest/config'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [Vue(), SvgLoader()],
  server: {
    port: 1111,
  },
  test: {
    globalSetup: './vitest-global.setup.ts',
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    env: {
      TZ: 'UTC',
    },
    globals: true,
    coverage: {
      provider: 'v8',
      all: true,
      reporter: ['clover', 'html', 'lcov'],
      include: ['modules', 'components'],
      exclude: [
        'src/components/index.ts',
        'src/components/constantes.ts',
        'src/components/MazPhoneNumberInput/constantes/locales.ts',
        'tailwindcss/**/*',
        'src/types/**/*',
        'src/index.ts',
        'src/helpers/index.ts',
        'src/helpers/debounce.ts',
        'src/helpers/user-visibility/index.ts',
        'src/helpers/idle-timeout/index.ts',
        'src/helpers/truthy-filter.ts',
        'src/helpers/isClient.ts',
        'src/helpers/sleep.ts',
        'src/plugins/index.ts',
        'src/plugins/dialog/index.ts',
        'src/plugins/wait/index.ts',
        'src/plugins/toaster/index.ts',
        'src/plugins/aos.ts',
        'src/filters/index.ts',
        'src/composables/useUserVisibilty.ts',
        'src/composables/useAos.ts',
        'src/composables/useToast.ts',
        'src/composables/useDialog.ts',
        'src/composables/useWait.ts',
        'src/directives/index.ts',
        'src/directives/v-zoom-img/index.ts',
        'src/directives/v-zoom-img/style.ts',
        'src/directives/v-zoom-img/zoom-img.directive.ts',
        'src/directives/v-zoom-img/svgs.ts',
        'src/directives/v-lazy-img/assets/*',
        'src/directives/v-lazy-img/index.ts',
        'src/directives/v-fullscreen-img/index.ts',
        'src/**/types.ts',
      ],
      extension: ['.js', '.ts', '.vue'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@components': fileURLToPath(new URL('src/components', import.meta.url)),
      '@composables': fileURLToPath(new URL('src/composables', import.meta.url)),
      '@directives': fileURLToPath(new URL('src/directives', import.meta.url)),
      '@filters': fileURLToPath(new URL('src/filters', import.meta.url)),
      '@helpers': fileURLToPath(new URL('src/helpers', import.meta.url)),
      '@icons': fileURLToPath(new URL('src/icons', import.meta.url)),
      '@plugins': fileURLToPath(new URL('src/plugins', import.meta.url)),
      '@resolvers': fileURLToPath(new URL('src/resolvers', import.meta.url)),
      '@tests': fileURLToPath(new URL('tests', import.meta.url)),
      '@ts-helpers': fileURLToPath(new URL('src/ts-helpers', import.meta.url)),
    },
  },
})
