import type { UserConfig } from 'vite'
import type { Target } from 'vite-plugin-static-copy'
import { rmSync } from 'node:fs'
import { extname, relative, resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import { glob } from 'glob'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import SvgLoader from 'vite-svg-loader'
import rootPkg from '../../package.json'
import { BuildMazCli } from './build/BuildMazCli'
import { BuildNuxtModule } from './build/BuildNuxtModule'
import { CompileStyles } from './build/CompileStyles'
// import { CopyComponentTypes } from './build/CopyComponentTypes'
import { GenerateComponentsEntry } from './build/GenerateComponentsEntry'
import pkg from './package.json'

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
    // CopyComponentTypes(),
  ],
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
