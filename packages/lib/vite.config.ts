import { rmSync } from 'node:fs'
import { extname, relative, resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import { glob } from 'glob'
import { defineConfig, type UserConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

import { type Target, viteStaticCopy } from 'vite-plugin-static-copy'

import SvgLoader from 'vite-svg-loader'
import rootPkg from '../../package.json' assert { type: 'json' }
import { BuildMazCli } from './build/BuildMazCli'
import { BuildNuxtModule } from './build/BuildNuxtModule'
import { CompileStyles } from './build/CompileStyles'
import { GenerateComponentsEntry } from './build/GenerateComponentsEntry'
import pkg from './package.json' assert { type: 'json' }

rmSync('dist', { recursive: true, force: true })

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
  ...Object.keys(pkg.peerDependencies),
  ...Object.keys(pkg.devDependencies),
  ...Object.keys(rootPkg.devDependencies),
  'dayjs/plugin/customParseFormat',
  'dayjs/plugin/weekday',
  'dayjs/plugin/isBetween',
]

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
    'src/composables/*.ts',
    'src/directives/*.ts',
    'src/filters/*.ts',
    'src/helpers/*.ts',
    'src/resolvers/*.ts',
    'src/plugins/*.ts',
  ], {
    ignore: ['**/*/index.ts'],
  })
    .map(getEntries),
)

const staticAssetsToCopy = [
  { src: resolver('src/tailwindcss'), dest: resolver('dist') },
  { src: resolver('src/icons'), dest: resolver('dist') },
  { src: resolver('bin'), dest: resolver('dist') },
  { src: resolver('../../README.md'), dest: resolver('.') },
] satisfies Target[]

export default defineConfig({
  plugins: [
    GenerateComponentsEntry(),
    Vue(),
    SvgLoader(),
    libInjectCss(),
    dts({
      tsconfigPath: resolver('./tsconfig.json'),
      entryRoot: resolver('src'),
      outDir: resolver('dist/types'),
    }),
    viteStaticCopy({ targets: staticAssetsToCopy }),
    CompileStyles(),
    BuildNuxtModule(),
    BuildMazCli(),
  ],
  resolve: {
    alias: {
      '@components': resolver('src/components'),
      '@composables': resolver('src/composables'),
      '@directives': resolver('src/directives'),
      '@filters': resolver('src/filters'),
      '@helpers': resolver('src/helpers'),
      '@icons': resolver('src/icons'),
      '@plugins': resolver('src/plugins'),
      '@resolvers': resolver('src/resolvers'),
      '@ts-helpers': resolver('src/ts-helpers'),
    },
  },
  build: {
    cssCodeSplit: true,
    emptyOutDir: false,
    minify: true,
    sourcemap: true,
    cssMinify: true,
    terserOptions: {
      compress: true,
    },
    lib: {
      entry: {
        ...componentEntries,
        ...moduleEntries,
        index: resolver('src/index.ts'),
      },
      fileName: (format, name) => format === 'es' ? `${name}.mjs` : `${name}.cjs`,
      cssFileName: '[name].[hash].css',
    },
    rollupOptions: {
      external,
      output: [
        {
          format: 'es',
          chunkFileNames: 'chunks/[name].[hash].mjs',
          assetFileNames: 'assets/[name].[hash][extname]',
          exports: 'named',
          entryFileNames: '[name].mjs',
          preserveModules: false,
        },
        {
          format: 'cjs',
          chunkFileNames: 'chunks/[name].[hash].cjs',
          assetFileNames: 'assets/[name].[hash][extname]',
          exports: 'named',
          entryFileNames: '[name].cjs',
          preserveModules: false,
        },
      ],
      // output: {
      //   // chunkFileNames: 'chunks/[name].[hash].js',
      //   // assetFileNames: 'assets/[name].[hash][extname]',
      //   // entryFileNames: '[name].js',
      // },
    },
  },
} satisfies UserConfig)
