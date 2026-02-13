import { extname, relative, resolve } from 'node:path'
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
    ],
    esbuild: {
      drop: option.mode === 'production' ? ['debugger'] : [],
      pure: option.mode === 'production' ? ['console.log', 'console.debug'] : [],
      legalComments: 'none',
      target: 'es2022',
      minifyIdentifiers: false,
      minifySyntax: true,
      minifyWhitespace: true,
      treeShaking: true,
    },
    build: {
      emptyOutDir: true,
      sourcemap: option.mode !== 'production',
      cssMinify: 'lightningcss',
      minify: 'esbuild',
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
  }
})
