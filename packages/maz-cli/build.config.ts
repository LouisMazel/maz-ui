import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  failOnWarn: true,
  clean: true,
  rollup: {
    inlineDependencies: true,
    resolve: {
      exportConditions: ['production', 'node'],
    },
  },
  entries: ['src/cli'],
})
