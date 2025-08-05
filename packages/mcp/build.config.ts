import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/mcp.ts'],
  declaration: true,
  clean: true,
  failOnWarn: false, // Temporarily disable to ignore async arrow warnings
})
