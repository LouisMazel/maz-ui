import { cpSync } from 'node:fs'
import { readdir, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import minimist from 'minimist'
import { replaceInFile } from 'replace-in-file'
import { build, type InlineConfig } from 'vite'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { type Target, viteStaticCopy } from 'vite-plugin-static-copy'
import svgLoader from 'vite-svg-loader'
import { compileScss } from './compile-scss'
import { copyAndTransformComponentsTypesFiles } from './copy-components-types'
import { generateComponentsEntryFile } from './generate-components-entry'
import { generateLibComponentsEntryFile } from './generate-lib-entry'
import { getComponentList } from './get-component-list'
import { execPromise } from './utils/exec-promise'
import { logger } from './utils/logger'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

const argv = minimist(process.argv.slice(2))

const staticAssetsToCopy: Target[] = [
  {
    src: resolve(_dirname, '../tailwindcss'),
    dest: resolve(_dirname, '../dist'),
  },
  {
    src: resolve(_dirname, '../package.json'),
    dest: resolve(_dirname, '../dist'),
  },
  {
    src: resolve(_dirname, '../icons'),
    dest: resolve(_dirname, '../dist'),
  },
  {
    src: resolve(_dirname, '../bin'),
    dest: resolve(_dirname, '../dist'),
  },
  {
    src: resolve(_dirname, '../../../README.md'),
    dest: resolve(_dirname, '../dist'),
  },
]

function getBuildConfig({
  path,
  name,
  outDir,
  format,
  isModuleBuild,
}: {
  format: 'es' | 'cjs'
  name: string
  outDir: string
  path: string
  isModuleBuild?: boolean
}) {
  return {
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
        cssFileName: '[name].[hash].css',
      },
      rollupOptions: {
        treeshake: true,
        external: ['vue', 'libphonenumber-js', '/^dayjs:.*/', 'chart.js', 'dropzone', 'vue-chartjs'],
        output: {
          exports: 'named',
          chunkFileNames: `chunks/[name].[hash].${format === 'es' ? 'mjs' : 'cjs'}`,
          assetFileNames: 'assets/[name].[hash].[ext]',
          entryFileNames: `[name].${format === 'es' ? 'mjs' : 'cjs'}`,
          preserveModules: false,
          globals: {
            'vue': 'Vue',
            'libphonenumber-js': 'libphonenumber-js',
            'dayjs': 'dayjs',
            'dropzone': 'dropzone',
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
      Vue({
        template: {
          compilerOptions: {
            comments: false,
          },
        },
      }),
      svgLoader(),
      libInjectCss(),
      ...(isModuleBuild ? [viteStaticCopy({ targets: staticAssetsToCopy })] : []),
    ],
  } satisfies InlineConfig
}

async function run() {
  try {
    // const hash = generateRandomHash()
    await execPromise('rimraf dist')

    await generateComponentsEntryFile()

    if ((!argv.package || argv.package === 'modules') && !argv.component) {
      await build(
        getBuildConfig({
          path: resolve(_dirname, './../modules/index.ts'),
          name: 'index',
          outDir: resolve(_dirname, '../dist/modules'),
          isModuleBuild: true,
          format: 'es',
        }),
      )
      await build(
        getBuildConfig({
          path: resolve(_dirname, './../modules/index.ts'),
          name: 'index',
          outDir: resolve(_dirname, '../dist/modules'),
          isModuleBuild: true,
          format: 'cjs',
        }),
      )
    }

    await build(
      getBuildConfig({
        path: resolve(_dirname, './../resolvers/index.ts'),
        name: 'index',
        outDir: resolve(_dirname, '../dist/resolvers'),
        isModuleBuild: true,
        format: 'cjs',
      }),
    )
    await build(
      getBuildConfig({
        path: resolve(_dirname, './../resolvers/index.ts'),
        name: 'index',
        outDir: resolve(_dirname, '../dist/resolvers'),
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
          outDir: resolve(_dirname, '../dist/components'),
          format: 'es',
        }),
      )
    }

    // Emit types from all packages
    await execPromise('pnpm -F maz-ui gen:declaration-files')

    copyAndTransformComponentsTypesFiles()
    cpSync(resolve('./dist/types/resolvers'), resolve('./dist/resolvers'), { recursive: true })

    await generateLibComponentsEntryFile()

    // Build main.css file with tailwind
    await execPromise(
      'tailwindcss -i tailwindcss/tailwind.css -o dist/css/main.css --config tailwind.config.ts --postcss --minify',
    )

    await compileScss()

    await execPromise('pnpm -F nuxt-module build')
    await execPromise('pnpm -F @mazui/cli build')

    // Nuxt Module: rename all module.* to index.*
    const fileList = await readdir(resolve(_dirname, './../dist/nuxt'), {
      withFileTypes: true,
    })

    const fileListToRename = fileList.filter(
      dirent => dirent.isFile() && dirent.name.startsWith('module'),
    )

    for await (const { path: filePath, name } of fileListToRename) {
      const extenstion = name.slice(Math.max(0, name.indexOf('.')))
      await rename(resolve(filePath, name), resolve(filePath, `index${extenstion}`))
    }

    await replaceInFile({
      files: [
        resolve(_dirname, '../dist/nuxt/types.d.mts'),
        resolve(_dirname, '../dist/nuxt/types.d.ts'),
        resolve(_dirname, '../dist/nuxt/index.cjs'),
      ],
      from: new RegExp('./module', 'g'),
      to: './index',
    })

    await replaceInFile({
      files: resolve(_dirname, '../dist/package.json'),
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
  }
  catch (error) {
    logger.error('[vite.config.js](run) 🔴 Error while building library', error)

    throw new Error(`[vite.config.js](run) 🔴 Error while building library - ${error}`)
  }
}

run()
