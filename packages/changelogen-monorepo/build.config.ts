import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/cli',
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: false,
    esbuild: {
      target: 'node20',
    },
  },
})
