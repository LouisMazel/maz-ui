import { rmSync } from 'node:fs'
import { extname, relative, resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import { glob } from 'glob'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

// import { viteStaticCopy } from 'vite-plugin-static-copy'
import SvgLoader from 'vite-svg-loader'
import rootPkg from '../../package.json'

import { ViteBuildIcons, ViteBuildMazCli, ViteBuildNuxtModule, ViteBuildThemes, ViteCompileStyles } from './build'

import pkg from './package.json'

rmSync(resolver('dist'), { recursive: true, force: true })

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

const moduleEntries = Object.fromEntries(
  glob.sync([
    'src/components/*.vue',
    'src/composables/*.ts',
    'src/directives/*.ts',
    'src/resolvers/*.ts',
    'src/formatters/*.ts',
    'src/helpers/*.ts',
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
      // include: [
      //   'src/components/*.vue',
      //   'src/composables/*.ts',
      //   'src/directives/*.ts',
      //   'src/resolvers/*.ts',
      //   'src/formatters/*.ts',
      //   'src/helpers/*.ts',
      //   'src/plugins/*.ts',
      //   'src/components/types.ts',
      //   'src/components/index.ts',
      //   'src/composables/index.ts',
      //   'src/plugins/index.ts',
      //   'src/directives/index.ts',
      //   'src/resolvers/index.ts',
      //   'src/helpers/index.ts',
      //   'src/formatters/index.ts',
      //   'src/index.ts',
      //   'src/types/*.d.ts',
      // ],
    }),
    ViteBuildIcons(),
    ViteCompileStyles(),
    ViteBuildNuxtModule(),
    ViteBuildMazCli(),
    ViteBuildThemes(),
  ],
  build: {
    cssCodeSplit: true,
    emptyOutDir: false,
    sourcemap: false,
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
      module: true,
      toplevel: true,
      format: {
        comments: false,
      },
    },
    lib: {
      entry: {
        ...moduleEntries,
        'components/index': resolver('src/components/index.ts'),
        'composables/index': resolver('src/composables/index.ts'),
        'plugins/index': resolver('src/plugins/index.ts'),
        'directives/index': resolver('src/directives/index.ts'),
        'resolvers/index': resolver('src/resolvers/index.ts'),
        'helpers/index': resolver('src/helpers/index.ts'),
        'formatters/index': resolver('src/formatters/index.ts'),
        'tailwindcss/index': resolver('src/tailwindcss/index.ts'),
        'index': resolver('src/index.ts'),
      },
      fileName: (format, name) => format === 'es' ? `${name}.mjs` : `${name}.cjs`,
      cssFileName: '[name].[hash].css',
    },
    rollupOptions: {
      external,
      treeshake: {
        moduleSideEffects: (id, _external) => {
          return id.includes('.css') || id.includes('.vue?vue&type=style')
        },
        preset: 'recommended',
      },
      output: [
        {
          format: 'es',
          chunkFileNames: 'chunks/[name].[hash].mjs',
          assetFileNames: 'assets/[name].[hash][extname]',
          exports: 'named',
          entryFileNames: '[name].mjs',
          preserveModules: true,
          interop: 'auto',
          generatedCode: 'es2015',
        },
      ],
    },
  },
})
