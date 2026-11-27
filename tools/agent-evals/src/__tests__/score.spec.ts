import type { AgentUsage, ClaudeResult, ReviewOutput } from '../score.ts'
import type { EvalTask } from '../tasks.ts'
import { parseClaudeResult, scoreTask } from '../score.ts'

const TASK: EvalTask = { id: 'copy-link', prompt: 'Copy a link', expects: [/useClipboard/, /<MazBtn/], forbids: [/navigator\.clipboard/] }
const NO_USAGE: AgentUsage = { toolCalls: 0, mcpTools: [], readAgentDocs: false, reviewed: false, skills: [], subagents: [] }
const NO_TOKENS = { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 }
const CLAUDE: ClaudeResult = { costUsd: 0.4, tokens: NO_TOKENS, turns: 12, durationMs: 90_000, isError: false, result: 'Done', usage: NO_USAGE }
const CLEAN_REVIEW: ReviewOutput = { totals: { error: 0, warning: 0, info: 0 }, files: [{ file: 'src/ShareLink.vue', findings: [] }] }
const PASSED_CHECKS = { typecheck: { passed: true, output: '' }, build: { passed: true, output: '' } }
const GOOD_SOURCE = { 'src/ShareLink.vue': '<script setup>\nconst { copy } = useClipboard()\n</script>\n<template><MazBtn /></template>\n' }

function toolUse(...tools: Array<[string, Record<string, unknown>]>): string {
  return JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: 'Looking' }, ...tools.map(([name, input]) => ({ type: 'tool_use', name, input }))] } })
}

function transcript(...lines: string[]): string {
  return lines.join('\n')
}

const RESULT = JSON.stringify({ type: 'result', subtype: 'success', is_error: false, total_cost_usd: 0.4, num_turns: 12, duration_ms: 90_000, result: 'Done' })

describe('given parseClaudeResult', () => {
  describe('when claude succeeds without a tool of maz-ui', () => {
    it('then it reads the cost, the turns, the duration, the tool calls and the last message', () => {
      expect(parseClaudeResult(transcript(JSON.stringify({ type: 'system', subtype: 'init' }), toolUse(['Read', { file_path: 'src/App.vue' }]), RESULT))).toEqual({ ...CLAUDE, usage: { ...NO_USAGE, toolCalls: 1 } })
    })
  })

  describe('when the result has the usage of every model', () => {
    it('then it sums the tokens of the models', () => {
      const result = JSON.stringify({
        type: 'result',
        subtype: 'success',
        usage: { input_tokens: 1, output_tokens: 1 },
        modelUsage: {
          'claude-sonnet': { inputTokens: 100, outputTokens: 50, cacheReadInputTokens: 1000, cacheCreationInputTokens: 200 },
          'claude-haiku': { inputTokens: 10, outputTokens: 5 },
          'claude-opus': {},
        },
      })

      expect(parseClaudeResult(result).tokens).toEqual({ input: 110, output: 55, cacheRead: 1000, cacheCreation: 200 })
    })
  })

  describe('when the result only has the usage of the main model', () => {
    it('then it reads its tokens', () => {
      const result = JSON.stringify({ type: 'result', subtype: 'success', usage: { input_tokens: 3, output_tokens: 4, cache_read_input_tokens: 5, cache_creation_input_tokens: 6 } })

      expect(parseClaudeResult(result).tokens).toEqual({ input: 3, output: 4, cacheRead: 5, cacheCreation: 6 })
    })
  })

  describe('when the agent uses the tools of maz-ui', () => {
    it('then it records the MCP tools, the agent docs, the review, the skills and the subagents', () => {
      const stdout = transcript(
        toolUse(['Skill', { skill: 'maz-ui:maz-ui' }], ['mcp__plugin_maz-ui_maz-ui__search_docs', { query: 'copy' }]),
        toolUse(['Read', { file_path: 'node_modules/maz-ui/agent-docs/README.md' }], ['mcp__maz-ui__get_component_api', { components: ['MazBtn'] }]),
        toolUse(['Agent', { subagent_type: 'maz-ui:maz-ui-editor', prompt: 'Build' }], ['Bash', { command: 'npx maz-ui-mcp review src --format json' }]),
        toolUse(['mcp__context7__query-docs', {}], ['Skill', {}], ['Task', {}]),
        'not json',
        RESULT,
      )

      expect(parseClaudeResult(stdout).usage).toEqual({
        toolCalls: 9,
        mcpTools: ['search_docs', 'get_component_api'],
        readAgentDocs: true,
        reviewed: true,
        skills: ['maz-ui:maz-ui'],
        subagents: ['maz-ui:maz-ui-editor'],
      })
    })

    it('then review_code counts as a review', () => {
      expect(parseClaudeResult(transcript(toolUse(['mcp__maz-ui__review_code', { paths: ['src'] }]), RESULT)).usage).toMatchObject({ mcpTools: ['review_code'], reviewed: true, readAgentDocs: false })
    })
  })

  describe('when claude stops on its budget', () => {
    it('then it is an error', () => {
      expect(parseClaudeResult(JSON.stringify({ type: 'result', subtype: 'error_max_budget_usd', total_cost_usd: 2 }))).toEqual({ costUsd: 2, tokens: NO_TOKENS, turns: 0, durationMs: 0, isError: true, result: '', usage: NO_USAGE })
    })
  })

  describe('when the result has no cost', () => {
    it('then the cost is 0', () => {
      expect(parseClaudeResult('{"type":"result","subtype":"success"}')).toMatchObject({ costUsd: 0, isError: false })
    })
  })

  describe('when the output has no result', () => {
    it('then it keeps the output as the error', () => {
      expect(parseClaudeResult('Invalid API key\n')).toMatchObject({ isError: true, result: 'Invalid API key' })
      expect(parseClaudeResult('')).toMatchObject({ isError: true, result: 'no output' })
      expect(parseClaudeResult('null\n{"type":"assistant"}\n{"type":"assistant","message":{"content":[{"type":"tool_use","name":"Read"}]}}')).toMatchObject({ isError: true, tokens: NO_TOKENS, usage: { ...NO_USAGE, toolCalls: 1 } })
    })
  })
})

describe('given scoreTask', () => {
  describe('when the agent reuses the expected tools and the review is clean', () => {
    it('then the run passes', () => {
      const claude = { ...CLAUDE, tokens: { input: 10, output: 20, cacheRead: 300, cacheCreation: 40 } }

      expect(scoreTask({ task: TASK, condition: 'plugin', run: 1, sources: GOOD_SOURCE, review: CLEAN_REVIEW, claude, checks: PASSED_CHECKS, linesAdded: 4 })).toEqual({
        task: 'copy-link',
        condition: 'plugin',
        run: 1,
        passed: true,
        files: ['src/ShareLink.vue'],
        linesAdded: 4,
        addedDependencies: [],
        checks: PASSED_CHECKS,
        findings: [],
        missing: [],
        forbidden: [],
        costUsd: 0.4,
        tokens: 370,
        turns: 12,
        durationMs: 90_000,
        usage: NO_USAGE,
      })
    })
  })

  describe('when the agent writes the clipboard by hand', () => {
    it('then the run fails with the review findings, the missing tools and the hand-made code', () => {
      const review: ReviewOutput = {
        totals: { error: 0, warning: 1, info: 1 },
        files: [{ file: 'src/ShareLink.vue', findings: [
          { rule: 'prefer-ecosystem', severity: 'warning', message: 'useClipboard', line: 2 },
          { rule: 'icon-import', severity: 'info', message: 'icons', line: 4 },
        ] }],
      }

      expect(scoreTask({ task: TASK, condition: 'baseline', run: 2, sources: { 'src/ShareLink.vue': 'navigator.clipboard.writeText(url)\n<MazBtn />' }, review, claude: CLAUDE })).toMatchObject({
        passed: false,
        findings: ['prefer-ecosystem (src/ShareLink.vue:2)'],
        missing: ['/useClipboard/'],
        forbidden: ['/navigator\\.clipboard/'],
      })
    })
  })

  describe('when the agent adds a dependency', () => {
    it('then the run fails', () => {
      expect(scoreTask({ task: TASK, condition: 'baseline', run: 1, sources: GOOD_SOURCE, review: CLEAN_REVIEW, claude: CLAUDE, checks: PASSED_CHECKS, addedDependencies: ['@vueuse/core'] })).toMatchObject({ passed: false, addedDependencies: ['@vueuse/core'] })
    })
  })

  describe('when the app does not typecheck or build', () => {
    it('then the run fails', () => {
      const failed = { passed: false, output: 'error TS2322' }

      expect(scoreTask({ task: TASK, condition: 'init', run: 1, sources: GOOD_SOURCE, review: CLEAN_REVIEW, claude: CLAUDE, checks: { ...PASSED_CHECKS, typecheck: failed } })).toMatchObject({ passed: false })
      expect(scoreTask({ task: TASK, condition: 'init', run: 1, sources: GOOD_SOURCE, review: CLEAN_REVIEW, claude: CLAUDE, checks: { ...PASSED_CHECKS, build: failed } })).toMatchObject({ passed: false })
    })
  })

  describe('when the agent writes no file', () => {
    it('then the run fails', () => {
      expect(scoreTask({ task: TASK, condition: 'init', run: 1, sources: {}, review: undefined, claude: CLAUDE })).toMatchObject({ passed: false, error: 'no source file written' })
    })
  })

  describe('when the agent fails', () => {
    it('then the run fails with its message', () => {
      expect(scoreTask({ task: TASK, condition: 'init', run: 1, sources: GOOD_SOURCE, review: CLEAN_REVIEW, claude: { ...CLAUDE, isError: true, result: 'Overloaded' } })).toMatchObject({ passed: false, error: 'Overloaded' })
      expect(scoreTask({ task: TASK, condition: 'init', run: 1, sources: GOOD_SOURCE, review: CLEAN_REVIEW, claude: { ...CLAUDE, isError: true, result: '' } })).toMatchObject({ error: 'the agent failed' })
    })
  })
})
