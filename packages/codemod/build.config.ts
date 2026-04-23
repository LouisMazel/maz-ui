import { defineBuildConfig } from 'unbuild'

import { dependencies, devDependencies } from './package.json'

export default defineBuildConfig({
  entries: [
    'src/index',
    { input: 'src/cli', name: 'cli' },
  ],
  declaration: true,
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: false,
  },
  externals: [...Object.keys(dependencies), ...Object.keys(devDependencies), 'node:fs', 'node:path', 'node:process', 'node:url'],
})
