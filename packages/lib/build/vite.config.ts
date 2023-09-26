/* eslint-disable @typescript-eslint/ban-ts-comment */
import minimist from 'minimist'
import { resolve } from 'node:path'
import { build, type InlineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import svgLoader from 'vite-svg-loader'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { viteStaticCopy, type Target } from 'vite-plugin-static-copy'

import { getComponentList } from './get-component-list'
import { logger } from './utils/logger'
import { execPromise } from './utils/exec-promise'
import { generateComponentsEntryFile } from './generate-components-entry'
import { generateLibComponentsEntryFile } from './generate-lib-entry'
import { compileScss } from './compile-scss'
import { replaceStringInFile } from './replace-string-in-file'
import { copyAndTransformComponentsTypesFiles } from './copy-components-types'
import { readdir, rename } from 'node:fs/promises'

const argv = minimist(process.argv.slice(2))

const staticAssetsToCopy: Target[] = [
  {
    src: resolve(__dirname, '../tailwindcss'),
    dest: resolve(__dirname, '../dist'),
  },
  {
    src: resolve(__dirname, '../package.json'),
    dest: resolve(__dirname, '../dist'),
  },
  {
    src: resolve(__dirname, '../icons'),
    dest: resolve(__dirname, '../dist'),
  },
  {
    src: resolve(__dirname, '../../../README.md'),
    dest: resolve(__dirname, '../dist'),
  },
]

const getBuildConfig = ({
  path,
  name,
  outDir,
  isModuleBuild,
}: {
  path: string
  name: string
  outDir: string
  isModuleBuild?: boolean
}): InlineConfig => ({
  build: {
    emptyOutDir: false,
    outDir,
    minify: 'terser',
    cssCodeSplit: false,
    lib: {
      // Can be an array of multiple entry points
      entry: path,
      formats: ['es'],
      name,
      fileName: name,
    },
    rollupOptions: {
      external: ['vue', 'libphonenumber-js', '/^dayjs:.*/', 'chart.js', 'dropzone', 'vue-chartjs'],
      output: {
        exports: 'named',
        chunkFileNames: 'assets/[name]-[hash].mjs',
        // preserveModules: true,
        globals: {
          vue: 'Vue',
          'libphonenumber-js': 'libphonenumber-js',
          dayjs: 'dayjs',
          dropzone: 'dropzone',
          'vue-chartjs': 'vue-chartjs',
          'chart.js': 'chart.js',
          'dayjs/plugin/customParseFormat': 'dayjs/plugin/customParseFormat',
          'dayjs/plugin/weekday': 'dayjs/plugin/weekday',
          'dayjs/plugin/isBetween': 'dayjs/plugin/isBetween',
        },
      },
    },
  },
  plugins: [
    // @ts-ignore
    peerDepsExternal({
      packageJsonPath: resolve(__dirname, '../package.json'),
      includeDependencies: false,
    }),
    svgLoader({}),
    // @ts-ignore
    Vue(),
    cssInjectedByJsPlugin(), // ...(isModuleBuild ? [] : [cssInjectedByJsPlugin()]),
    ...(isModuleBuild ? [viteStaticCopy({ targets: staticAssetsToCopy })] : []),
  ],
})

const run = async () => {
  try {
    await execPromise('rimraf dist')

    await generateComponentsEntryFile()

    if ((!argv.package || argv.package === 'modules') && !argv.component) {
      await build(
        getBuildConfig({
          path: resolve(__dirname, './../modules/index.ts'),
          name: 'index',
          outDir: resolve(__dirname, '../dist/modules'),
          isModuleBuild: true,
        }),
      )
    }

    await replaceStringInFile({
      filePath: resolve(__dirname, '../dist/package.json'),
      search: './modules/index.ts',
      replaceBy: './modules/index.mjs',
    })
    await replaceStringInFile({
      filePath: resolve(__dirname, '../dist/package.json'),
      search: './components/index.ts',
      replaceBy: './components/index.mjs',
    })

    const componentsList = await getComponentList()

    // to build specific component
    const componentToBuild = componentsList.filter(({ name }) =>
      argv.component ? name === argv.component : true,
    )

    for await (const { path, name } of componentToBuild) {
      await build(
        getBuildConfig({
          path,
          name,
          outDir: resolve(__dirname, '../dist/components'),
        }),
      )
    }

    // Emit types from all packages
    await execPromise('vue-tsc --declaration --emitDeclarationOnly')

    copyAndTransformComponentsTypesFiles()

    await generateLibComponentsEntryFile()

    // Build main.css file with tailwind
    await execPromise(
      'tailwindcss -i tailwindcss/tailwind.css -o dist/css/main.css --config tailwind.config.ts --postcss --minify',
    )

    await compileScss()

    await execPromise('rimraf generated-types')

    await execPromise('pnpm -F nuxt-module prepare')
    await execPromise('pnpm -F nuxt-module build')

    // Nuxt Module: rename all module.* to index.*
    const fileList = await readdir(resolve(__dirname, './../dist/nuxt'), {
      withFileTypes: true,
    })

    const fileListToRename = fileList.filter(
      (dirent) => dirent.isFile() && dirent.name.startsWith('module'),
    )

    for await (const { path, name } of fileListToRename) {
      const extenstion = name.slice(Math.max(0, name.indexOf('.')))
      await rename(resolve(path, name), resolve(path, `index${extenstion}`))
    }

    await replaceStringInFile({
      filePath: resolve(__dirname, '../dist/nuxt/types.d.mts'),
      search: './module',
      replaceBy: './index',
    })
    await replaceStringInFile({
      filePath: resolve(__dirname, '../dist/nuxt/types.d.ts'),
      search: './module',
      replaceBy: './index',
    })

    logger.success('[vite.config.js](run) 💚 library builded with success 💚')
  } catch (error) {
    logger.error('[vite.config.js](run) 🔴 Error while building library', error)

    throw new Error(`[vite.config.js](run) 🔴 Error while building library - ${error}`)
  }
}

run()

/* eslint-enable @typescript-eslint/ban-ts-comment */
