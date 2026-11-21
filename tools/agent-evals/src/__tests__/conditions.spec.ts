import { claudeArgs, CONDITIONS, installsMcp, parseConditions, setupCommand } from '../conditions.ts'

const OPTIONS = { prompt: 'Create a button', repoRoot: '/repo', fixtureDir: '/app' }
const COMMON = ['-p', 'Create a button', '--output-format', 'stream-json', '--verbose', '--permission-mode', 'bypassPermissions', '--setting-sources', 'project', '--no-session-persistence']

describe('given claudeArgs', () => {
  describe('when the condition is the baseline', () => {
    it('then no MCP server nor plugin of the user is loaded', () => {
      expect(claudeArgs('baseline', OPTIONS)).toEqual([...COMMON, '--strict-mcp-config'])
    })
  })

  describe('when the condition is init', () => {
    it('then only the MCP server written by init is loaded', () => {
      expect(claudeArgs('init', OPTIONS)).toEqual([...COMMON, '--strict-mcp-config', '--mcp-config', '/app/.mcp.json'])
    })
  })

  describe('when the condition is the plugin with a model and a budget', () => {
    it('then the plugin of the repository is loaded', () => {
      expect(claudeArgs('plugin', { ...OPTIONS, model: 'sonnet', maxBudgetUsd: 2 })).toEqual([...COMMON, '--plugin-dir', '/repo/plugins/claude-code', '--model', 'sonnet', '--max-budget-usd', '2'])
    })
  })
})

describe('given setupCommand', () => {
  describe('when the condition is init', () => {
    it('then it runs the init of the repository for Claude Code', () => {
      expect(setupCommand('init', '/repo')).toEqual(['/repo/packages/mcp/bin/maz-ui-mcp.mjs', 'init', '--targets', 'claude'])
    })
  })

  describe('when the condition is the baseline or the plugin', () => {
    it('then nothing runs', () => {
      expect(setupCommand('baseline', '/repo')).toBeUndefined()
      expect(setupCommand('plugin', '/repo')).toBeUndefined()
    })
  })
})

describe('given installsMcp', () => {
  describe('when the condition is the baseline', () => {
    it('then the app has no @maz-ui/mcp', () => {
      expect(installsMcp('baseline')).toBe(false)
      expect(installsMcp('init')).toBe(true)
      expect(installsMcp('plugin')).toBe(true)
    })
  })
})

describe('given parseConditions', () => {
  describe('when no value is passed', () => {
    it('then every condition is returned', () => {
      expect(parseConditions(undefined)).toEqual([...CONDITIONS])
    })
  })

  describe('when a list is passed', () => {
    it('then its conditions are returned', () => {
      expect(parseConditions('plugin, baseline,')).toEqual(['plugin', 'baseline'])
    })
  })

  describe('when a condition is unknown', () => {
    it('then it throws with the known ones', () => {
      expect(() => parseConditions('baseline,skill')).toThrow('Unknown condition(s): skill. Use baseline, init, plugin.')
    })
  })
})
