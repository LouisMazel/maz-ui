import { extname, relative, resolve } from 'node:path'
import { codecovVitePlugin } from '@codecov/vite-plugin'
import { getExternalDependencies } from '@maz-ui/vite-config'
import svgLoader from '@maz-ui/vite-svg-loader'
import Vue from '@vitejs/plugin-vue'
import { glob } from 'glob'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import pkg from './package.json' with { type: 'json' }

import { generateIcons } from './utils/generateIcons.ts'
import { writeIconTypes } from './utils/writeIconTypes.ts'

// Before the entries are listed: the variants of the icons are generated, not versioned
generateIcons({ root: import.meta.dirname })

function resolver(path: string) {
  return resolve(import.meta.dirname, path)
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
    {
      // A string literal export is copied by Rolldown (inlineConst) into each `??`, `||` or ternary of the consumers
      name: 'maz-icons-raw-not-inlinable',
      generateBundle(_, bundle) {
        for (const chunk of Object.values(bundle)) {
          if (chunk.type === 'chunk' && chunk.fileName.startsWith('raw/') && chunk.fileName !== 'raw/index.js') {
            chunk.code = chunk.code.replace(/^var (\w+) = (".*");$/m, 'var $1 = /* @__PURE__ */ String($2);')
          }
        }
      },
    },
    {
      // One file of types per variant, instead of one per icon
      name: 'maz-icons-types',
      writeBundle() {
        writeIconTypes(resolver('dist'), Object.keys(moduleEntries).flatMap(entry => entry.startsWith('static/')
          ? [
              entry.slice('static/'.length),
            ]
          : []))
      },
    },
    Vue(),
    svgLoader(),
    dts({
      tsconfigPath: resolver('./tsconfig.json'),
      entryRoot: resolver('src'),
      outDirs: resolver('dist'),
      // The build utilities of utils/ are typechecked, not published. The types of the icons are written by `maz-icons-types`,
      // the ones of the Vite plugin by unbuild
      include: ['src'],
      exclude: [
        'src/**/__tests__/**/*',
        'src/vite/**',
        'src/index.ts',
        'src/static/**',
        'src/lazy/**',
        'src/raw/**',
      ],
    }),
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
        'registry': resolver('./src/registry.ts'),
        'vue': resolver('./src/vue/index.ts'),
        'static/index': resolver('./src/static/index.ts'),
        'lazy/index': resolver('./src/lazy/index.ts'),
        'raw/index': resolver('./src/raw/index.ts'),
      },
      formats: ['es'],
      fileName: (_, name) => `${name}.js`,
      name: '@maz-ui/icons',
    },
    rolldownOptions: {
      preserveEntrySignatures: 'allow-extension',
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
        minify: {
          compress: { dropDebugger: true, dropConsole: false, joinVars: false },
          mangle: false,
        },
        exports: 'named',
        // Each icon is an entry: its SVG is inlined in it, instead of a module of its own (two files less per icon)
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
})
