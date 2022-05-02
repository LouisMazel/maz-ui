// rollup.config.js
import { readFileSync } from 'fs'
import { resolve } from 'path'

import vue from 'rollup-plugin-vue'
import alias from '@rollup/plugin-alias'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import babel from '@rollup/plugin-babel'
import url from '@rollup/plugin-url'

import PostCSS from 'rollup-plugin-postcss'
import nested from 'postcss-nested'
import simpleVars from 'postcss-simple-vars'
import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'
import autoprefixer from 'autoprefixer'

import { terser } from 'rollup-plugin-terser'
import ttypescript from 'ttypescript'
import typescript from 'rollup-plugin-typescript2'
import minimist from 'minimist'
import commonjs from '@rollup/plugin-commonjs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

const { componentsList } = require('./get-component-list')

const INPUT_ENTRY = resolve(__dirname, './../package/index.ts')

// Get browserslist config and remove ie from es build targets
const esbrowserslist = readFileSync('./.browserslistrc')
  .toString()
  .split('\n')
  .filter((entry) => entry && entry.substring(0, 2) !== 'ie')

// Extract babel preset-env config, to combine with esbrowserslist
const babelPresetEnvConfig = require('../babel.config').presets.filter(
  (entry) => entry[0] === '@babel/preset-env',
)[0][1]

const argv = minimist(process.argv.slice(2))

const projectRoot = resolve(__dirname, '..')

const postcssConfigList = [
  postcssImport({
    resolve(id, basedir) {
      // resolve node_modules, @import '~normalize.css/normalize.css'
      // similar to how css-loader's handling of node_modules
      if (id.startsWith('~')) {
        return resolve('./node_modules', id.slice(1))
      }
      // resolve relative path, @import './components/style.css'
      return resolve(basedir, id)
    },
  }),
  nested,
  simpleVars,
  postcssUrl({ url: 'inline' }),
  autoprefixer({
    overrideBrowserslist: '> 1%, IE 6, Explorer >= 10, Safari >= 7',
  }),
]

const baseConfig = {
  plugins: {
    preVue: [
      alias({
        entries: [
          {
            find: '@package',
            replacement: resolve(projectRoot, 'package'),
          },
          {
            find: '@components',
            replacement: resolve(projectRoot, 'package/components'),
          },
        ],
      }),
    ],
    replace: {
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    vue: {
      target: 'browser',
      preprocessStyles: true,
      postcssPlugins: [...postcssConfigList],
    },
    postVue: [
      nodeResolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      }),
      // Process only `<style module>` blocks.
      PostCSS({
        modules: {
          generateScopedName: '[local]___[hash:base64:5]',
        },
        include: /&module=.*\.css$/,
        plugins: postcssConfigList,
      }),
      // Process all `<style>` blocks except `<style module>`.
      PostCSS({ include: /(?<!&module=.*)\.css$/ }),
      commonjs(),
      url({
        include: ['**/*.svg', '**/*.png', '**/*.gif', '**/*.jpg', '**/*.jpeg'],
      }),
    ],
    babel: {
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      babelHelpers: 'runtime',
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
}

// Customize configs for individual targets
/** @type {import('rollup').RollupOptions[]} */
const buildFormats = []

if (!argv.package || argv.package === 'modules') {
  /** @type {import('rollup').RollupOptions} */
  const esConfig = {
    ...baseConfig,
    input: INPUT_ENTRY,
    output: {
      dir: 'modules',
      format: 'esm',
      exports: 'named',
      compact: true,
      // sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      // Only use typescript for declarations - babel will do actual js transformations
      typescript({
        typescript: ttypescript,
        useTsconfigDeclarationDir: true,
        emitDeclarationOnly: true,
      }),
      ...baseConfig.plugins.postVue,
      babel({
        ...baseConfig.plugins.babel,
        presets: [
          [
            '@babel/preset-env',
            {
              ...babelPresetEnvConfig,
              targets: esbrowserslist,
            },
          ],
        ],
      }),
      terser({ output: { ecma: 5 } }),
    ],
  }
  buildFormats.push(esConfig)
}

// if (!argv.package || argv.package === 'cjs') {
//   /** @type {import('rollup').RollupOptions} */
//   const cjsConfig = {
//     ...baseConfig,
//     input: INPUT_ENTRY,
//     output: {
// compact: true,
//       dir: 'lib/cjs/modules',
//       exports: 'named',
//       format: 'cjs',
// sourcemap: true,
//     },
//     plugins: [
//       peerDepsExternal(),
//       replace(baseConfig.plugins.replace),
//       ...baseConfig.plugins.preVue,
//       vue(baseConfig.plugins.vue),
//       ...baseConfig.plugins.postVue,
//       babel(baseConfig.plugins.babel),
//       terser({ output: { ecma: 5 } }),
//     ],
//   }
//   buildFormats.push(cjsConfig)
// }

if (!argv.package || argv.package === 'components') {
  /** @type {import('rollup').RollupOptions[]} */
  const componentsEsmConfig = []
  for (const component of componentsList) {
    componentsEsmConfig.push({
      ...baseConfig,
      input: component.path,
      output: {
        // compact: true,
        dir: 'components',
        exports: 'named',
        format: 'esm',
        compact: true,
        // sourcemap: true,
      },
      plugins: [
        peerDepsExternal(),
        replace(baseConfig.plugins.replace),
        ...baseConfig.plugins.preVue,
        vue(baseConfig.plugins.vue),
        typescript({
          typescript: ttypescript,
          useTsconfigDeclarationDir: true,
          emitDeclarationOnly: true,
        }),
        ...baseConfig.plugins.postVue,
        babel(baseConfig.plugins.babel),
        terser({ output: { ecma: 5 } }),
      ],
    })
  }
  buildFormats.push(...componentsEsmConfig)
  // if (!package.package || package.package === 'cjs') {
  //   const componentsCjsConfig = componentsList.map((component) => {
  //     /** @type {import('rollup').RollupOptions} */
  //     return {
  //       ...baseConfig,
  //       input: component.path,
  //       output: {
  // compact: true,
  //         dir: 'lib/cjs/components',
  //         exports: 'named',
  //         format: 'cjs',
  // sourcemap: true,
  //       },
  //       plugins: [
  //         peerDepsExternal(),
  //         replace(baseConfig.plugins.replace),
  //         ...baseConfig.plugins.preVue,
  //         vue(baseConfig.plugins.vue),
  //         ...baseConfig.plugins.postVue,
  //         babel(baseConfig.plugins.babel),
  //         terser({ output: { ecma: 5 } }),
  //       ],
  //     }
  //   })
  //   buildFormats.push(...componentsCjsConfig)
  // }
}

// Export config
export default buildFormats
