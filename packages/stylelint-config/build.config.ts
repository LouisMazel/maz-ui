import { defineBuildConfig } from 'unbuild'

import packageJson from './package.json' with { type: 'json' }

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  declaration: true,
  clean: true,
  failOnWarn: true,
  rollup: {
    emitCJS: false,
  },
  externals: [
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.devDependencies),
    'node:fs',
    'node:path',
    'node:module',
  ],
})
