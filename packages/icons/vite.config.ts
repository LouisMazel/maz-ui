import { extname, relative, resolve } from 'node:path'
import { codecovVitePlugin } from '@codecov/vite-plugin'
import { getExternalDependencies } from '@maz-ui/vite-config'
import Vue from '@vitejs/plugin-vue'
import { glob } from 'glob'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import SvgLoader from 'vite-svg-loader'

import pkg from './package.json'

import { ViteGenerateIconsComponentsEntry } from './utils/ViteGenerateIconsComponentsEntry'

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
    'src/lazy/*.ts',
    'src/static/*.ts',
    'src/raw/*.ts',
  ], {
    ignore: ['**/*/index.ts'],
  })
    .map(getEntries),
)

export default defineConfig({
  plugins: [
    Vue(),
    SvgLoader(),
    dts({
      tsconfigPath: resolver('./tsconfig.json'),
      entryRoot: resolver('src'),
      outDir: resolver('dist'),
    }),
    ViteGenerateIconsComponentsEntry(),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: 'icons',
      uploadToken: process.env.CODECOV_TOKEN,
      telemetry: false,
    }),
  ],
  build: {
    emptyOutDir: true,
    sourcemap: false,
    target: 'es2022',
    lib: {
      entry: {
        ...moduleEntries,
        'index': resolver('./src/index.ts'),
        'resolvers': resolver('./src/resolvers.ts'),
        'icon-list': resolver('./src/icon-list.ts'),
        'static/index': resolver('./src/static/index.ts'),
        'lazy/index': resolver('./src/lazy/index.ts'),
        'raw/index': resolver('./src/raw/index.ts'),
      },
      formats: ['es'],
      fileName: (_, name) => `${name}.js`,
      name: '@maz-ui/icons',
    },
    rolldownOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
        manualPureFunctions: ['console.log', 'console.debug'],
      },
      external: getExternalDependencies(pkg),
      output: {
        format: 'es',
        comments: { legal: false },
        minify: { compress: { dropDebugger: true, dropConsole: false, joinVars: false }, mangle: false },
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
})
