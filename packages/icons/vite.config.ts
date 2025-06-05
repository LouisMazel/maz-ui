import Vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
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
    lib: {
      entry: {
        'index': resolver('./src/index.ts'),
      },
      fileName: (format, name) => format === 'es' ? `${name}.mjs` : `${name}.cjs`,
      name: 'MazIcons',
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
        {
          format: 'cjs',
          chunkFileNames: 'chunks/[name].[hash].cjs',
          assetFileNames: 'assets/[name].[hash][extname]',
          exports: 'named',
          entryFileNames: '[name].cjs',
          preserveModules: true,
          interop: 'auto',
          minifyInternalExports: true,
        },
      ],
    },
    emptyOutDir: true,
    sourcemap: true,
    minify: true,
    terserOptions: {
      compress: true,
    },
  },
})
