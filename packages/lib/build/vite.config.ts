/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import { resolve } from 'node:path'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import { componentsList } from './get-component-list'

const run = async () => {
  try {
    for await (const component of componentsList) {
      await build({
        build: {
          emptyOutDir: false,
          outDir: resolve(__dirname, '../dist/components'),
          minify: 'terser',
          cssCodeSplit: false,
          // ssrManifest: true,
          lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: component.path,
            name: component.name,
            fileName: component.name,
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
                'dayjs/plugin/customParseFormat':
                  'dayjs/plugin/customParseFormat',
                'dayjs/plugin/weekday': 'dayjs/plugin/weekday',
                'dayjs/plugin/isBetween': 'dayjs/plugin/isBetween',
              },
            },
          },
        },
        // @ts-ignore
        plugins: [peerDepsExternal(), vue(), cssInjectedByJsPlugin()],
        resolve: {
          alias: {
            '@package': resolve(__dirname, '../package'),
            '@components': resolve(__dirname, '../package/components'),
            '@tests': resolve(__dirname, '../tests'),
          },
        },
      })
    }

    console.log('💚')
  } catch (error) {
    console.log('🔴', error)
  }
}

run()

/* eslint-enable @typescript-eslint/ban-ts-comment */
