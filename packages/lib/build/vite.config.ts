import minimist from 'minimist'
import { resolve } from 'node:path'
import { build, type InlineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { viteStaticCopy, type Target } from 'vite-plugin-static-copy'

import { getComponentList } from './get-component-list'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { logger } from './utils/logger'
import { execPromise } from './utils/exec-promise'
import { generateComponentsEntryFile } from './generate-components-entry'
import { generateLibComponentsEntryFile } from './generate-lib-entry'
import { compileScss } from './compile-scss'
import { copyAndTransformComponentsTypesFiles } from './copy-components-types'
import { readdir, rename } from 'node:fs/promises'
import { replaceInFile } from 'replace-in-file'

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
    src: resolve(__dirname, '../bin'),
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
}): InlineConfig => {
  return {
    build: {
      emptyOutDir: false,
      outDir,
      minify: 'terser',
      cssCodeSplit: true,
      cssMinify: true,
      lib: {
        // Can be an array of multiple entry points
        entry: path,
        formats: ['es'],
        fileName: name,
        name,
      },
      rollupOptions: {
        treeshake: true,
        external: [
          'vue',
          'libphonenumber-js',
          '/^dayjs:.*/',
          'chart.js',
          'dropzone',
          'vue-chartjs',
          'vue-scrollto',
        ],
        output: {
          exports: 'named',
          chunkFileNames: 'assets/[name]-[hash].mjs',
          assetFileNames: '[name].[ext]',
          entryFileNames: '[name].mjs',
          preserveModules: false,
          compact: true,
          globals: {
            vue: 'Vue',
            'libphonenumber-js': 'libphonenumber-js',
            dayjs: 'dayjs',
            dropzone: 'dropzone',
            'vue-chartjs': 'vue-chartjs',
            'chart.js': 'chart.js',
            'vue-scrollto': 'vue-scrollto',
            'dayjs/plugin/customParseFormat': 'dayjs/plugin/customParseFormat',
            'dayjs/plugin/weekday': 'dayjs/plugin/weekday',
            'dayjs/plugin/isBetween': 'dayjs/plugin/isBetween',
          },
        },
      },
    },
    plugins: [
      // @ts-ignore
      svgLoader({}),
      Vue(),
      cssInjectedByJsPlugin(),
      ...(isModuleBuild ? [viteStaticCopy({ targets: staticAssetsToCopy })] : []),
    ],
  }
}

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

    await execPromise('pnpm -F nuxt-module build')
    await execPromise('pnpm -F @mazui/cli build')

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

    await replaceInFile({
      files: [
        resolve(__dirname, '../dist/nuxt/types.d.mts'),
        resolve(__dirname, '../dist/nuxt/types.d.ts'),
        resolve(__dirname, '../dist/nuxt/index.cjs'),
      ],
      from: new RegExp('./module', 'g'),
      to: './index',
    })
    await replaceInFile({
      files: resolve(__dirname, '../dist/package.json'),
      from: new RegExp('./modules/index.ts', 'g'),
      to: './modules/index.mjs',
    })
    await replaceInFile({
      files: resolve(__dirname, '../dist/package.json'),
      from: new RegExp('./components/index.ts', 'g'),
      to: './components/index.mjs',
    })
    // eslint-disable ntunicorn/no-abusive-eslint-disable
    await replaceInFile({
      files: resolve(__dirname, '../dist/package.json'),
      from: /"workspace:\*"/g,
      to: `"latest"`,
    })

    logger.success('[vite.config.js](run) 💚 library builded with success 💚')
  } catch (error) {
    logger.error('[vite.config.js](run) 🔴 Error while building library', error)

    throw new Error(`[vite.config.js](run) 🔴 Error while building library - ${error}`)
  }
}

run()

/* eslint-enable @typescript-eslint/ban-ts-comment */
