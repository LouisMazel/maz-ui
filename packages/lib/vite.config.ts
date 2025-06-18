import { extname, relative, resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import { glob } from 'glob'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

import SvgLoader from 'vite-svg-loader'
import rootPkg from '../../package.json'

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

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
  ...Object.keys(pkg.devDependencies),
  ...Object.keys(rootPkg.devDependencies),
  'dayjs/plugin/customParseFormat',
  'dayjs/plugin/weekday',
  'dayjs/plugin/isBetween',
]

const moduleEntries = Object.fromEntries(
  glob.sync([
    'src/components/*.vue',
    'src/composables/*.ts',
    'src/directives/*.ts',
    'src/resolvers/*.ts',
    'src/utils/*.ts',
    'src/plugins/*.ts',
    'src/tailwindcss/**/*.ts',
  ], {
    ignore: ['**/*/index.ts'],
  })
    .map(getEntries),
)

export default defineConfig({
  plugins: [
    Vue(),
    SvgLoader(),
    libInjectCss(),
    dts({
      tsconfigPath: resolver('./tsconfig.json'),
      entryRoot: resolver('src'),
      outDir: resolver('dist/types'),
    }),
    ViteCompileStyles(),
  ],
  esbuild: {
    drop: ['debugger'],
    pure: ['console.log', 'console.debug'],
    legalComments: 'none',
    target: 'es2022',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
  },
  build: {
    cssCodeSplit: true,
    emptyOutDir: true,
    sourcemap: false,
    cssMinify: 'lightningcss',
    minify: 'esbuild',
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
    rollupOptions: {
      external,
      treeshake: {
        moduleSideEffects: false,
        preset: 'smallest',
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
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
