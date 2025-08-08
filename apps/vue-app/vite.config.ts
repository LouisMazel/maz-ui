import type { PluginOption } from 'vite'

import { fileURLToPath, URL } from 'node:url'
import { MazIconsResolver } from '@maz-ui/icons/resolvers'
import vue from '@vitejs/plugin-vue'
import { MazComponentsResolver } from 'maz-ui/resolvers/MazComponentsResolver'
import { MazDirectivesResolver } from 'maz-ui/resolvers/MazDirectivesResolver'
import { MazModulesResolver } from 'maz-ui/resolvers/MazModulesResolver'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueSvgLoader from 'vite-svg-loader'

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
        MazIconsResolver(),
        MazComponentsResolver({ devMode: true }),
        MazDirectivesResolver({ devMode: true }),
      ],
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [MazModulesResolver({ devMode: true })],
      dts: true,
    }),
    visualizer(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: 'es',
        compact: true,
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        exports: 'named',
        minifyInternalExports: true,
        preserveModules: false,
        interop: 'auto',
        generatedCode: 'es2015',
      },
    },
  },
})
