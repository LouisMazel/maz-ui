import { extname, relative, resolve } from 'node:path'
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
  ],
  esbuild: {
    drop: ['debugger'],
    pure: ['console.log', 'console.debug'],
    legalComments: 'none',
    target: 'es2022',
    minifyIdentifiers: false,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
  },
  build: {
    emptyOutDir: true,
    sourcemap: false,
    cssMinify: 'lightningcss',
    minify: 'esbuild',
    target: 'es2022',
    lib: {
      entry: {
        ...moduleEntries,
        'index': resolver('./src/index.ts'),
        'resolvers': resolver('./src/resolvers.ts'),
        'icon-list': resolver('./src/icon-list.ts'),
        'static/index': resolver('./src/static/index.ts'),
        'lazy/index': resolver('./src/lazy/index.ts'),
      },
      formats: ['es'],
      fileName: (_, name) => `${name}.js`,
      name: '@maz-ui/icons',
    },
    rollupOptions: {
      external: getExternalDependencies(pkg),
      treeshake: {
        moduleSideEffects: false,
        preset: 'smallest',
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
      output: {
        format: 'es',
        compact: true,
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        interop: 'auto',
        generatedCode: 'es2015',
      },
    },
  },
})
