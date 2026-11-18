import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/optimize'],
  declaration: true,
  clean: true,
  failOnWarn: true,
  rollup: {
    emitCJS: false,
  },
})
