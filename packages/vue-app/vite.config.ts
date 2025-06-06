import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueSvgLoader from 'vite-svg-loader'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { MazDirectivesResolver, MazModulesResolver, MazComponentsResolver } from './../lib/src/resolvers/index.js'
import { MazIconsResolver } from '@maz-ui/icons/resolvers'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VueSvgLoader(),
    dts({
      compilerOptions: {
        noEmit: true,
      },
      include: ['lib/src/**/*.vue', 'lib/src/**/*.ts'],
      exclude: ['node_modules', 'dist'],
      insertTypesEntry: true,
      logLevel: 'error',
    }),
    Components({
      dts: true,
      resolvers: [
        MazComponentsResolver({ devMode: true }),
        MazDirectivesResolver({ devMode: true }),
        MazIconsResolver({ devMode: true }),
      ],
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [
        MazModulesResolver({ devMode: true }),
      ],
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
