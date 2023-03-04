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
import { copyAndTransformComponentsTypesFiles } from './copy-components-types'
import { generateComponentsEntryFile } from './generate-components-entry'
import { generateLibComponentsEntryFile } from './generate-lib-entry'
import { compileScss } from './compile-scss'

const argv = minimist(process.argv.slice(2))

const staticAssetsToCopy: Target[] = [
  {
    src: resolve(__dirname, '../package/tailwindcss'),
    dest: resolve(__dirname, '../dist'),
  },
  {
    src: resolve(__dirname, '../package.json'),
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
      // formats: ['es'],
      name,
      fileName: name,
    },
    rollupOptions: {
      external: ['vue', 'libphonenumber-js', '/^dayjs:.*/', 'chart.js/auto/auto.mjs', 'dropzone'],
      output: {
        exports: 'named',
        chunkFileNames: 'assets/[name]-[hash].mjs',
        // preserveModules: true,
        globals: {
          vue: 'Vue',
          'libphonenumber-js': 'libphonenumber-js',
          dayjs: 'dayjs',
          dropzone: 'dropzone',
          'chart.js/auto/auto.mjs': 'chart.js/auto/auto.mjs',
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
    svgLoader({ defaultImport: 'url' }),
    // @ts-ignore
    Vue(),
    cssInjectedByJsPlugin(), // ...(isModuleBuild ? [] : [cssInjectedByJsPlugin()]),
    ...(isModuleBuild ? [viteStaticCopy({ targets: staticAssetsToCopy })] : []),
  ],
  resolve: {
    alias: {
      '@package': resolve(__dirname, '../package'),
      '@components': resolve(__dirname, '../package/components'),
      '@tests': resolve(__dirname, '../tests'),
      '@assets': resolve(__dirname, '../package/components/assets'),
      '@icons': resolve(__dirname, '../package/components/assets/icons'),
      '@logos': resolve(__dirname, '../package/components/assets/logos'),
    },
  },
})

const run = async () => {
  try {
    await execPromise('rimraf dist')

    await generateComponentsEntryFile()

    if ((!argv.package || argv.package === 'modules') && !argv.component) {
      await build(
        getBuildConfig({
          path: resolve(__dirname, './../package/index.ts'),
          name: 'maz-ui',
          outDir: resolve(__dirname, '../dist/modules'),
          isModuleBuild: true,
        }),
      )
    }

    const componentsList = await getComponentList()

    const componentToBuild = componentsList.filter(({ name }) =>
      argv.component ? name === argv.component : true,
    )

    for await (const component of componentToBuild) {
      await build(
        getBuildConfig({
          path: component.path,
          name: component.name,
          outDir: resolve(__dirname, '../dist/components'),
        }),
      )
    }

    // Emit types from all packages
    await execPromise('vue-tsc --declaration --emitDeclarationOnly')

    copyAndTransformComponentsTypesFiles()

    // Build and compile main declaration file (maz-ui.d.ts)
    await execPromise(
      'rollup --config build/rollup.types.config.ts --configPlugin @rollup/plugin-typescript',
    )

    await generateLibComponentsEntryFile()

    // Build main.css file with tailwind
    await execPromise(
      'tailwindcss -i package/tailwindcss/tailwind.css -o dist/css/main.css --config tailwind.config.js --postcss --minify',
    )

    compileScss()

    await execPromise('rimraf generated-types')

    logger.success('[vite.config.js](run) 💚 library builded with success 💚')
  } catch (error) {
    logger.error('[vite.config.js](run) 🔴 Error while building library', error)
  }
}

run()

/* eslint-enable @typescript-eslint/ban-ts-comment */
