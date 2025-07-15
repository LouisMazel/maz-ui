import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
  failOnWarn: true,
  rollup: {
    emitCJS: false,
    output: {
      preserveModules: true,
    },
  },
})
