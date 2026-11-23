import { renderPluginMcpConfig } from '../plugin.ts'

describe('given the MCP config of the plugin', () => {
  describe('when it is rendered from the launcher', () => {
    it('then the launcher runs inline as an ES module', () => {
      const config = JSON.parse(renderPluginMcpConfig('console.log(1)\n'))

      expect(config).toEqual({ mcpServers: { 'maz-ui': { type: 'stdio', command: 'node', args: ['--input-type=module', '-e', 'console.log(1)\n'] } } })
    })
  })

  describe('when the launcher holds a variable that Claude Code would expand', () => {
    it('then it throws', () => {
      const launcher = ['const root = "$', '{CLAUDE_PLUGIN_ROOT}"'].join('')

      expect(() => renderPluginMcpConfig(launcher)).toThrow('must not contain')
    })
  })
})
