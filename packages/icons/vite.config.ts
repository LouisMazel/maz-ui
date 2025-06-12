import { resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
// import { viteStaticCopy } from 'vite-plugin-static-copy'
import SvgLoader from 'vite-svg-loader'

import rootPkg from '../../package.json'
import pkg from './package.json'

import { ViteGenerateIconsComponentsEntry } from './utils/ViteGenerateIconsComponentsEntry'

function resolver(path: string) {
  return resolve(__dirname, path)
}

const external = [
  ...Object.keys(pkg.peerDependencies),
  ...Object.keys(pkg.devDependencies),
  ...Object.keys(rootPkg.devDependencies),
]

export default defineConfig({
  plugins: [
    Vue(),
    SvgLoader(),
    dts({
      tsconfigPath: resolver('./tsconfig.json'),
      entryRoot: resolver('src'),
      outDir: resolver('dist/types'),
    }),
    // viteStaticCopy({ targets: staticAssetsToCopy }),
    ViteGenerateIconsComponentsEntry(),
  ],
  build: {
    emptyOutDir: false,
    sourcemap: false,
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
        'index': resolver('./src/index.ts'),
        'resolvers': resolver('./src/resolvers.ts'),
        'icon-list': resolver('./src/icon-list.ts'),
      },
      fileName: (format, name) => format === 'es' ? `${name}.mjs` : `${name}.cjs`,
      name: '@maz-ui/icons',
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
          preserveModules: true,
          interop: 'auto',
          generatedCode: 'es2015',
          minifyInternalExports: true,
        },
      ],
    },
  },
})
