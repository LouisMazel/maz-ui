import type { Plugin } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { MazIconsResolver } from '@maz-ui/icons/resolvers'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { MazComponentsResolver, MazDirectivesResolver, MazModulesResolver } from 'maz-ui/resolvers'
import postcss from 'postcss'
import postcssNested from 'postcss-nested'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueSvgLoader from 'vite-svg-loader'

// Flatten postcss-nested `&-child` concatenation BEFORE @tailwindcss/vite
// sees the CSS — its internal lightningcss engine only speaks native CSS
// nesting, and leaves `&-sm`/`&-loader-container`/etc. as garbled selectors.
function PreNestedCss(): Plugin {
  const processor = postcss([postcssNested()])
  return {
    name: 'maz-ui:pre-nested-css',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\.vue\?.*type=style/.test(id) && !id.endsWith('.css'))
        return
      if (!code.includes('&'))
        return
      const { css } = await processor.process(code, { from: id, to: id })
      return { code: css, map: null }
    },
  }
}

export default defineConfig({
  plugins: [
    PreNestedCss(),
    vue(),
    tailwindcss(),
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
    rolldownOptions: {
      output: {
        format: 'es',

        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        exports: 'named',
        minifyInternalExports: true,
      },
    },
  },
})
