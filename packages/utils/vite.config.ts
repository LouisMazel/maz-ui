import { extname, relative, resolve } from 'node:path'
import { codecovVitePlugin } from '@codecov/vite-plugin'
import { getExternalDependencies } from '@maz-ui/vite-config'
import vue from '@vitejs/plugin-vue'

import { glob } from 'glob'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
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

const testPaths = ['**/__tests__/**/*', '**/__fixtures__/**/*', '**/__mocks__/**/*', '**/*.spec.ts', 'src/**/*.test.ts']

const entries = Object.fromEntries(
  glob.sync('src/**/*.ts', {
    ignore: ['**/ts-helpers/**/*', ...testPaths],
  })
    .map(getEntries),
)

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  return {
    plugins: [
      vue(),
      dts({
        tsconfigPath: resolver('./tsconfig.json'),
        entryRoot: resolver('src'),
        outDir: resolver('dist'),
        include: ['src/**/*.ts'],
        exclude: testPaths,
      }),
      codecovVitePlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: 'utils',
        uploadToken: process.env.CODECOV_TOKEN,
        telemetry: false,
      }),
    ],

    resolve: {
      conditions: ['node'],
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    },

    build: {
      emptyOutDir: true,
      sourcemap: isProduction ? false : 'inline',
      target: 'node22',
      lib: {
        entry: {
          ...entries,
          'index': 'src/index.ts',
          'helpers/index': 'src/helpers/index.ts',
        },
        formats: ['es'],
        fileName: (_, name) => `${name}.js`,
      },
      rolldownOptions: {
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
          manualPureFunctions: isProduction ? ['console.log', 'console.debug'] : [],
        },
        external: getExternalDependencies(pkg),
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
