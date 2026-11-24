import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/agents'],
  declaration: true,
  clean: true,
  failOnWarn: true,
  rollup: {
    emitCJS: false,
    // Its UMD build (the main field) requires its own files at runtime, which breaks the bundlers of the consumers (Nitro v3): its ESM build is inlined instead
    inlineDependencies: ['jsonc-parser'],
  },
})
