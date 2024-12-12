/// <reference types="vitest" />

import { fileURLToPath } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

import { defineConfig } from 'vitest/config'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [Vue(), svgLoader()],
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
        'components/index.ts',
        'components/constantes.ts',
        'components/MazPhoneNumberInput/constantes/locales.ts',
        'tailwindcss/**/*',
        'modules/types/**/*',
        'modules/index.ts',
        'modules/helpers/index.ts',
        'modules/helpers/debounce.ts',
        'modules/helpers/user-visibility/index.ts',
        'modules/helpers/idle-timeout/index.ts',
        'modules/helpers/truthy-filter.ts',
        'modules/helpers/isClient.ts',
        'modules/helpers/sleep.ts',
        'modules/plugins/index.ts',
        'modules/plugins/dialog/index.ts',
        'modules/plugins/wait/index.ts',
        'modules/plugins/toaster/index.ts',
        'modules/plugins/aos.ts',
        'modules/filters/index.ts',
        'modules/composables/useUserVisibilty.ts',
        'modules/composables/useAos.ts',
        'modules/composables/useToast.ts',
        'modules/composables/useDialog.ts',
        'modules/composables/useWait.ts',
        'modules/directives/index.ts',
        'modules/directives/v-zoom-img/index.ts',
        'modules/directives/v-zoom-img/style.ts',
        'modules/directives/v-zoom-img/zoom-img.directive.ts',
        'modules/directives/v-zoom-img/svgs.ts',
        'modules/directives/v-lazy-img/assets/*',
        'modules/directives/v-lazy-img/index.ts',
        'modules/directives/v-fullscreen-img/index.ts',
        'modules/**/types.ts',
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
    },
  },
})
