import { extname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { glob } from 'glob'
import { defineConfig, type UserConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

import svgLoader from 'vite-svg-loader'
// import { generateComponentsEntryFile } from './build/generate-components-entry'

import { GenerateComponentsEntry } from './build/GenerateComponentsEntry'
// import { getComponentList } from './build/get-component-list'
import pkg from './package.json'

function getEntries(pattern: string) {
  return [
    relative('src', pattern.slice(0, pattern.length - extname(pattern).length)),
    fileURLToPath(new URL(pattern, import.meta.url)),
  ]
}

const componentEntries = Object.fromEntries(
  glob.sync([
    'src/components/*.vue',
  ], {
    ignore: ['**/*/index.ts'],
  })
    .map(getEntries),
)

const moduleEntries = Object.fromEntries(
  glob.sync([
    'src/composables/use*.ts',
    'src/directives/v*.ts',
    'src/filters/*.ts',
    'src/helpers/*.ts',
    'src/resolvers/*.ts',
    'src/plugins/*.ts',
  ], {
    ignore: ['**/*/index.ts'],
  })
    .map(getEntries),
)

export default defineConfig({
  plugins: [
    GenerateComponentsEntry(),
    vue(),
    libInjectCss(),
    svgLoader(),
    dts({
      tsconfigPath: './tsconfig.json',
      entryRoot: 'src',
      outDir: 'dist/types',
    }),
  ],
  resolve: {
    alias: {
      // '@': fileURLToPath(new URL('src', import.meta.url)),
      '@components': fileURLToPath(new URL('src/components', import.meta.url)),
      '@composables': fileURLToPath(new URL('src/composables', import.meta.url)),
      '@directives': fileURLToPath(new URL('src/directives', import.meta.url)),
      '@filters': fileURLToPath(new URL('src/filters', import.meta.url)),
      '@helpers': fileURLToPath(new URL('src/helpers', import.meta.url)),
      '@icons': fileURLToPath(new URL('src/icons', import.meta.url)),
      '@plugins': fileURLToPath(new URL('src/plugins', import.meta.url)),
      '@resolvers': fileURLToPath(new URL('src/resolvers', import.meta.url)),
      '@ts-helpers': fileURLToPath(new URL('src/ts-helpers', import.meta.url)),
    },
  },
  build: {
    cssCodeSplit: true,
    emptyOutDir: true,
    minify: true,
    cssMinify: true,
    terserOptions: {
      compress: true,
    },
    lib: {
      entry: {
        ...moduleEntries,
        'maz-ui': fileURLToPath(new URL('src/index.ts', import.meta.url)),
        ...componentEntries,
        'components': fileURLToPath(new URL('src/components/index.ts', import.meta.url)),
      },
      // formats: ['es', 'cjs'],
      fileName: (format, name) => format === 'es' ? `${name}.js` : `${name}.cjs`,
      // cssFileName: '[name].[hash].css',
    },
    rollupOptions: {
      external: [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.devDependencies), /\.css$/],
      output: [
        {
          format: 'es',
          chunkFileNames: 'chunks/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
          exports: 'named',
          // preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
        },
        // {
        //   format: 'cjs',
        //   chunkFileNames: 'chunks/[name].[hash].cjs',
        //   assetFileNames: 'assets/[name].[hash][extname]',
        //   exports: 'named',
        // },
      ],
      // output: {
      //   // chunkFileNames: 'chunks/[name].[hash].js',
      //   // assetFileNames: 'assets/[name].[hash][extname]',
      //   // entryFileNames: '[name].js',
      // },
    },
  },
} satisfies UserConfig)
