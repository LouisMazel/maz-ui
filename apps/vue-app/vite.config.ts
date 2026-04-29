import { fileURLToPath, URL } from 'node:url'
import { MazIconsResolver } from '@maz-ui/icons/resolvers'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { MazComponentsResolver, MazDirectivesResolver, MazModulesResolver } from 'maz-ui/resolvers'
import postcssNested from 'postcss-nested'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueSvgLoader from 'vite-svg-loader'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    plugins: [
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
          MazComponentsResolver(),
          MazDirectivesResolver(),
        ],
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        resolvers: [MazModulesResolver()],
        dts: true,
      }),
      visualizer(),
    ],
    // Resolve `monorepo:dev` first when developing so we consume maz-ui's
    // raw src/ (with HMR), and fall back to the published dist for prod
    // builds. Same trick as accor-core-library.
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      conditions: isDev
        ? ['monorepo:dev', 'import', 'browser', 'module', 'default']
        : ['import', 'browser', 'module', 'default'],
    },
    css: {
      postcss: {
        // In dev only: flatten postcss-nested `&-child` syntax that ships in
        // raw maz-ui SFCs loaded via the `monorepo:dev` resolve condition.
        plugins: isDev ? [postcssNested()] : [],
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
  }
})
