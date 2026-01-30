import { resolve } from 'node:path'
import { getExternalDependencies } from '@maz-ui/vite-config'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import SvgLoader from 'vite-svg-loader'

import pkg from './package.json'

import { ViteGenerateIconsComponentsEntry } from './utils/ViteGenerateIconsComponentsEntry'

function resolver(path: string) {
  return resolve(__dirname, path)
}

export default defineConfig({
  plugins: [
    Vue(),
    SvgLoader(),
    dts({
      tsconfigPath: resolver('./tsconfig.json'),
      entryRoot: resolver('src'),
      outDir: resolver('dist/types'),
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
        'index': resolver('./src/index.ts'),
        'resolvers': resolver('./src/resolvers.ts'),
        'icon-list': resolver('./src/icon-list.ts'),
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
