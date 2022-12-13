/* eslint-disable @typescript-eslint/ban-ts-comment */
import minimist from 'minimist'
import { resolve } from 'node:path'
import { build, type InlineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

const modulesEntry = resolve(__dirname, './../package/index.ts')

import { componentsList } from './get-component-list'
import { logger } from './logger'

const argv = minimist(process.argv.slice(2))

const getBuildConfig = ({
  path,
  name,
  outDir,
}: {
  path: string
  name: string
  outDir: string
}): InlineConfig => ({
  build: {
    emptyOutDir: false,
    outDir,
    minify: 'terser',
    cssCodeSplit: false,
    // ssrManifest: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path,
      name,
      fileName: name,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'libphonenumber-js', '/^dayjs:.*/', 'chart.js'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          'libphonenumber-js': 'libphonenumber-js',
          dayjs: 'dayjs',
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
    Vue(),
    cssInjectedByJsPlugin(),
  ],
  resolve: {
    alias: {
      '@package': resolve(__dirname, '../package'),
      '@components': resolve(__dirname, '../package/components'),
      '@tests': resolve(__dirname, '../tests'),
    },
  },
})

const run = async () => {
  try {
    if ((!argv.package || argv.package === 'modules') && !argv.component) {
      await build(
        getBuildConfig({
          path: modulesEntry,
          name: 'maz-ui',
          outDir: resolve(__dirname, '../dist/modules'),
        }),
      )
    }

    if (!argv.package || argv.package === 'components' || argv.component) {
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
    }

    logger.success('[vite.config.js](run) 💚 library builded with success')
  } catch (error) {
    logger.error('[vite.config.js](run) 🔴 Error while building library', error)
  }
}

run()

/* eslint-enable @typescript-eslint/ban-ts-comment */
