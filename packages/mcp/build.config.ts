import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/mcp.ts'],
  declaration: true,
  clean: true,
  failOnWarn: true,
})
