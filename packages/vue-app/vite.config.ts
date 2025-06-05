import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueSvgLoader from 'vite-svg-loader'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { MazDirectivesResolver, MazModulesResolver, MazComponentsResolver } from './../lib/src/resolvers/index.js'
import { MazIconsResolver } from '@maz-ui/icons/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VueSvgLoader(),
    Components({
      dts: true,
      resolvers: [
        MazComponentsResolver(),
        MazDirectivesResolver(),
        MazIconsResolver(),
      ],
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [
        MazModulesResolver(),
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
