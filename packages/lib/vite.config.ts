import { extname, relative, resolve } from 'node:path'
import { codecovVitePlugin } from '@codecov/vite-plugin'
import { getExternalDependencies } from '@maz-ui/vite-config'
import Vue from '@vitejs/plugin-vue'
import { glob } from 'glob'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import { libInjectCss } from 'vite-plugin-lib-inject-css'
import SvgLoader from 'vite-svg-loader'

import {
  ViteCompileStyles,
} from './build'

import pkg from './package.json'

function resolver(path: string) {
  return resolve(__dirname, path)
}

function getEntries(pattern: string) {
  return [
    relative('src', pattern.slice(0, pattern.length - extname(pattern).length)),
    resolver(pattern),
  ]
}

const moduleEntries = Object.fromEntries(
  glob.sync([
    'src/components/**/*.vue',
    'src/composables/*.ts',
    'src/directives/*.ts',
    'src/resolvers/*.ts',
    'src/plugins/*.ts',
    'src/tailwindcss/**/*.ts',
  ], {
    ignore: ['**/*/index.ts'],
  })
    .map(getEntries),
)

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  return {
    plugins: [
      Vue(),
      SvgLoader(),
      libInjectCss(),
      dts({
        tsconfigPath: resolver('./tsconfig.json'),
        entryRoot: resolver('src'),
        outDir: [resolver('dist')],
      }),
      ViteCompileStyles(),
      codecovVitePlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: 'lib',
        uploadToken: process.env.CODECOV_TOKEN,
        telemetry: false,
      }),
    ],
    build: {
      cssCodeSplit: true,
      emptyOutDir: true,
      sourcemap: false,
      target: 'es2022',
      lib: {
        entry: {
          ...moduleEntries,
          'components/index': resolver('src/components/index.ts'),
          'composables/index': resolver('src/composables/index.ts'),
          'plugins/index': resolver('src/plugins/index.ts'),
          'directives/index': resolver('src/directives/index.ts'),
          'resolvers/index': resolver('src/resolvers/index.ts'),
          'tailwindcss/index': resolver('src/tailwindcss/index.ts'),
          'index': resolver('src/index.ts'),
        },
        formats: ['es'],
        fileName: (_, name) => `${name}.js`,
        cssFileName: '[name].[hash].css',
      },
      rolldownOptions: {
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
          manualPureFunctions: isProduction ? ['console.log', 'console.debug'] : [],
        },
        external: (id) => {
          // Bundle dayjs plugins to avoid CJS interop issues
          if (id.startsWith('dayjs/plugin/'))
            return false
          return getExternalDependencies(pkg)(id)
        },
        output: {
          format: 'es',
          comments: { legal: false },
          minify: isProduction
            ? { compress: { dropDebugger: true, dropConsole: false, joinVars: false }, mangle: false }
            : false,
          chunkFileNames: 'chunks/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
          exports: 'named',
          minifyInternalExports: true,
        },
      },
    },
  }
})
