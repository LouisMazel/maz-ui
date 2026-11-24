import type { TaskScore } from '../score.ts'
import { renderReport, summarize } from '../report.ts'

const PASSED = { typecheck: { passed: true, output: '' }, build: { passed: true, output: '' } }

function score(overrides: Partial<TaskScore>): TaskScore {
  return { task: 'copy-link', condition: 'baseline', run: 1, passed: true, files: ['src/ShareLink.vue'], linesAdded: 20, addedDependencies: [], checks: PASSED, findings: [], missing: [], forbidden: [], costUsd: 0.5, tokens: 100_000, turns: 10, durationMs: 60_000, usage: { toolCalls: 10, mcpTools: [], readAgentDocs: false, reviewed: false, skills: [], subagents: [] }, ...overrides }
}

const SCORES = [
  score({ passed: false, linesAdded: 40, addedDependencies: ['@vueuse/core'], checks: { typecheck: { passed: false, output: 'error TS2322' }, build: { passed: false, output: 'error' } }, findings: ['prefer-ecosystem (src/ShareLink.vue:2)', 'theme-colors (src/ShareLink.vue:5)'], missing: ['/useClipboard/'], forbidden: ['/navigator\\.clipboard/'] }),
  score({ task: 'price', passed: false, error: 'no source file written', files: [], linesAdded: 0, checks: undefined, costUsd: 0.25, tokens: 50_000, turns: 4, durationMs: 30_000, usage: { toolCalls: 5, mcpTools: [], readAgentDocs: true, reviewed: false, skills: [], subagents: [] } }),
  score({ condition: 'plugin', costUsd: 0.75, tokens: 123_456, turns: 14, durationMs: 120_000, usage: { toolCalls: 7, mcpTools: ['search_docs', 'get_component_api', 'review_code'], readAgentDocs: false, reviewed: true, skills: ['maz-ui:maz-ui'], subagents: [] } }),
]

describe('given summarize', () => {
  describe('when runs of several conditions are scored', () => {
    it('then it sums them by condition', () => {
      expect(summarize(SCORES)).toEqual([
        { condition: 'baseline', runs: 2, passed: 0, findingsPerRun: 1, typecheck: 0, build: 0, addedDependencies: 1, linesPerRun: 20, toolCallsPerRun: 7.5, tokensPerRun: 75, costUsd: 0.75, turnsPerRun: 7, minutesPerRun: 0.8, mcpCallsPerRun: 0, readAgentDocs: 1, reviewed: 0 },
        { condition: 'plugin', runs: 1, passed: 1, findingsPerRun: 0, typecheck: 1, build: 1, addedDependencies: 0, linesPerRun: 20, toolCallsPerRun: 7, tokensPerRun: 123, costUsd: 0.75, turnsPerRun: 14, minutesPerRun: 2, mcpCallsPerRun: 3, readAgentDocs: 0, reviewed: 1 },
      ])
    })
  })
})

describe('given renderReport', () => {
  describe('when some runs fail', () => {
    it('then it renders the summary, the tasks by condition and the failures', () => {
      expect(renderReport(SCORES)).toBe(`# maz-ui agent evals

## Quality

| Condition | Pass rate | Review findings / run | Typecheck | Build | Added a dependency | Lines / run |
| --- | --- | --- | --- | --- | --- | --- |
| baseline | 0% (0/2) | 1 | 0% | 0% | 50% | 20 |
| plugin | 100% (1/1) | 0 | 100% | 100% | 0% | 20 |

## Effort

| Condition | Tool calls / run | MCP calls / run | Read agent-docs | Reviewed | Tokens / run | Turns / run | Minutes / run | Cost |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| baseline | 7.5 | 0 | 50% | 0% | 75k | 7 | 0.8 | $0.75 |
| plugin | 7 | 3 | 0% | 100% | 123k | 14 | 2 | $0.75 |

## Tasks

| Task | baseline | plugin |
| --- | --- | --- |
| copy-link | 0/1 | 1/1 |
| price | 0/1 | - |

## Failures

- baseline / copy-link #1: missing /useClipboard/, hand-made /navigator\\.clipboard/, added @vueuse/core, typecheck failed, build failed, prefer-ecosystem (src/ShareLink.vue:2), theme-colors (src/ShareLink.vue:5)
- baseline / price #1: no source file written
`)
    })
  })

  describe('when every run passes', () => {
    it('then it has no failures section', () => {
      expect(renderReport([SCORES[2]])).not.toContain('## Failures')
    })
  })
})
