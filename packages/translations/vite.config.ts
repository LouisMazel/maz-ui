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

const entries = Object.fromEntries(
  glob.sync('src/**/*.ts', {
    ignore: ['**/*/index.ts', '**/*/types.ts', '**/*/__tests__/**/*', '**/*/*.spec.ts', '**/*/*.test.ts'],
  })
    .map(getEntries),
)

export default defineConfig((option) => {
  const isProduction = option.mode === 'production'
  return {
    plugins: [
      vue(),
      dts({
        tsconfigPath: resolver('./tsconfig.json'),
        entryRoot: resolver('src'),
        outDir: resolver('dist'),
        exclude: ['src/**/__tests__/**/*', 'src/**/*.spec.ts', 'src/**/*.test.ts'],
        include: ['src/**/*.ts'],
      }),
      codecovVitePlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: 'translations',
        uploadToken: process.env.CODECOV_TOKEN,
        telemetry: false,
      }),
    ],
    build: {
      emptyOutDir: true,
      sourcemap: !isProduction,
      target: 'es2022',
      lib: {
        entry: {
          ...entries,
          'index': 'src/index.ts',
          'locales/index': 'src/locales/index.ts',
          'utils/index': 'src/utils/index.ts',
          'composables/index': 'src/composables/useTranslations.ts',
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
