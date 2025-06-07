import { fileURLToPath, URL } from 'node:url'

import { MazIconsResolver } from '@maz-ui/icons/resolvers'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueSvgLoader from 'vite-svg-loader'
import { MazComponentsResolver, MazDirectivesResolver, MazModulesResolver } from './../../packages/lib/src/resolvers/index.js'

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
