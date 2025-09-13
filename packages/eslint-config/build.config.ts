import { defineBuildConfig } from 'unbuild'

import { dependencies, devDependencies } from './package.json'

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
  externals: [...Object.keys(dependencies), ...Object.keys(devDependencies)],
})
