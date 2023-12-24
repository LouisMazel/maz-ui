import minimist from 'minimist'
import { resolve } from 'node:path'
import { build, type InlineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { viteStaticCopy, type Target } from 'vite-plugin-static-copy'
import { logger } from './utils/logger'
import { execPromise } from './utils/exec-promise'
import { generateComponentsEntryFile } from './generate-components-entry'
import { generateLibComponentsEntryFile } from './generate-lib-entry'
import { compileScss } from './compile-scss'
import { copyAndTransformComponentsTypesFiles } from './copy-components-types'
import { readdir, rename } from 'node:fs/promises'
import replace from 'replace-in-file'
import { getComponentList } from './get-component-list'

import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { copyFileSync } from 'node:fs'

import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

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
  format,
  // hash,
  isModuleBuild,
}: {
  format: 'es' | 'cjs'
  name: string
  outDir: string
  path: string
  hash?: string
  isModuleBuild?: boolean
}): InlineConfig => ({
  build: {
    emptyOutDir: false,
    outDir,
    minify: true,
    cssCodeSplit: true,
    cssMinify: true,
    lib: {
      // Can be an array of multiple entry points
      entry: path,
      formats: [format],
      fileName: name,
      name,
    },
    rollupOptions: {
      treeshake: true,
      external: ['vue', 'libphonenumber-js', '/^dayjs:.*/', 'chart.js', 'dropzone', 'vue-chartjs'],
      output: {
        exports: 'named',
        chunkFileNames: `chunks/[name]-[hash].${format === 'es' ? 'mjs' : 'cjs'}`,
        assetFileNames: `assets/[name].[ext]`,
        entryFileNames: `[name].${format === 'es' ? 'mjs' : 'cjs'}`,
        preserveModules: false,
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
    Vue(),
    svgLoader(),
    libInjectCss(),
    ...(isModuleBuild ? [viteStaticCopy({ targets: staticAssetsToCopy })] : []),
  ],
})

const run = async () => {
  try {
    // const hash = generateRandomHash()
    await execPromise('rimraf dist')

    await generateComponentsEntryFile()

    if ((!argv.package || argv.package === 'modules') && !argv.component) {
      await build(
        getBuildConfig({
          path: resolve(__dirname, './../modules/index.ts'),
          name: 'index',
          outDir: resolve(__dirname, '../dist/modules'),
          isModuleBuild: true,
          format: 'es',
        }),
      )
      await build(
        getBuildConfig({
          path: resolve(__dirname, './../modules/index.ts'),
          name: 'index',
          outDir: resolve(__dirname, '../dist/modules'),
          isModuleBuild: true,
          format: 'cjs',
        }),
      )
    }

    await build(
      getBuildConfig({
        path: resolve(__dirname, './../resolvers/index.ts'),
        name: 'index',
        outDir: resolve(__dirname, '../dist/resolvers'),
        isModuleBuild: true,
        format: 'cjs',
      }),
    )
    await build(
      getBuildConfig({
        path: resolve(__dirname, './../resolvers/index.ts'),
        name: 'index',
        outDir: resolve(__dirname, '../dist/resolvers'),
        isModuleBuild: true,
        format: 'es',
      }),
    )

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
          format: 'es',
        }),
      )
    }

    // Emit types from all packages
    await execPromise('pnpm -F maz-ui gen:declaration-files')

    copyAndTransformComponentsTypesFiles()
    copyFileSync(
      resolve('./dist/types/resolvers/index.d.ts'),
      resolve('./dist/resolvers/index.d.ts'),
    )
    copyFileSync(
      resolve('./dist/types/resolvers/unplugin-vue-components-resolver.d.ts'),
      resolve('./dist/resolvers/unplugin-vue-components-resolver.d.ts'),
    )

    await generateLibComponentsEntryFile()

    // Build main.css file with tailwind
    await execPromise(
      'tailwindcss -i tailwindcss/tailwind.css -o dist/css/main.css --config tailwind.config.ts --postcss --minify',
    )

    await compileScss()

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

    await replace({
      files: [
        resolve(__dirname, '../dist/nuxt/types.d.mts'),
        resolve(__dirname, '../dist/nuxt/types.d.ts'),
        resolve(__dirname, '../dist/nuxt/index.cjs'),
      ],
      from: new RegExp('./module', 'g'),
      to: './index',
    })

    await replace({
      files: resolve(__dirname, '../dist/package.json'),
      from: [
        new RegExp('"main": "./modules/index.ts"', 'g'),
        new RegExp('"module": "./modules/index.ts"', 'g'),
        new RegExp('"import": "./modules/index.ts"', 'g'),
        new RegExp('"require": "./modules/index.ts"', 'g'),
        new RegExp('"import": "./resolvers/index.ts"', 'g'),
        new RegExp('"require": "./resolvers/index.ts"', 'g'),
        new RegExp('./components/index.ts', 'g'),
        /"workspace:\*"/g,
      ],
      to: [
        '"main": "./modules/index.cjs"',
        '"module": "./modules/index.mjs"',
        '"import": "./modules/index.mjs"',
        '"require": "./modules/index.cjs"',
        '"import": "./resolvers/index.mjs"',
        '"require": "./resolvers/index.cjs"',
        './components/index.mjs',
        `"latest"`,
      ],
    })

    logger.success('[vite.config.js](run) 💚 library builded with success 💚')
  } catch (error) {
    logger.error('[vite.config.js](run) 🔴 Error while building library', error)

    throw new Error(`[vite.config.js](run) 🔴 Error while building library - ${error}`)
  }
}

run()

/* eslint-enable @typescript-eslint/ban-ts-comment */
