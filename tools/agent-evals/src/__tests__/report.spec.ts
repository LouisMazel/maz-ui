import type { TaskScore } from '../score.ts'
import { renderReport, summarize } from '../report.ts'

function score(overrides: Partial<TaskScore>): TaskScore {
  return { task: 'copy-link', condition: 'baseline', run: 1, passed: true, files: ['src/ShareLink.vue'], findings: [], missing: [], forbidden: [], costUsd: 0.5, turns: 10, durationMs: 60_000, usage: { mcpTools: [], readAgentDocs: false, reviewed: false, skills: [], subagents: [] }, ...overrides }
}

const SCORES = [
  score({ passed: false, findings: ['prefer-ecosystem (src/ShareLink.vue:2)', 'theme-colors (src/ShareLink.vue:5)'], missing: ['/useClipboard/'], forbidden: ['/navigator\\.clipboard/'] }),
  score({ task: 'price', passed: false, error: 'no source file written', costUsd: 0.25, turns: 4, durationMs: 30_000, usage: { mcpTools: [], readAgentDocs: true, reviewed: false, skills: [], subagents: [] } }),
  score({ condition: 'plugin', costUsd: 0.75, turns: 14, durationMs: 120_000, usage: { mcpTools: ['search_docs', 'get_component_api', 'review_code'], readAgentDocs: false, reviewed: true, skills: ['maz-ui:maz-ui'], subagents: [] } }),
]

describe('given summarize', () => {
  describe('when runs of several conditions are scored', () => {
    it('then it sums them by condition', () => {
      expect(summarize(SCORES)).toEqual([
        { condition: 'baseline', runs: 2, passed: 0, findingsPerRun: 1, costUsd: 0.75, turnsPerRun: 7, minutesPerRun: 0.8, mcpCallsPerRun: 0, readAgentDocs: 1, reviewed: 0 },
        { condition: 'plugin', runs: 1, passed: 1, findingsPerRun: 0, costUsd: 0.75, turnsPerRun: 14, minutesPerRun: 2, mcpCallsPerRun: 3, readAgentDocs: 0, reviewed: 1 },
      ])
    })
  })
})

describe('given renderReport', () => {
  describe('when some runs fail', () => {
    it('then it renders the summary, the tasks by condition and the failures', () => {
      expect(renderReport(SCORES)).toBe(`# maz-ui agent evals

| Condition | Pass rate | Review findings / run | MCP calls / run | Read agent-docs | Reviewed | Turns / run | Minutes / run | Cost |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| baseline | 0% (0/2) | 1 | 0 | 50% | 0% | 7 | 0.8 | $0.75 |
| plugin | 100% (1/1) | 0 | 3 | 0% | 100% | 14 | 2 | $0.75 |

| Task | baseline | plugin |
| --- | --- | --- |
| copy-link | 0/1 | 1/1 |
| price | 0/1 | - |

## Failures

- baseline / copy-link #1: missing /useClipboard/, hand-made /navigator\\.clipboard/, prefer-ecosystem (src/ShareLink.vue:2), theme-colors (src/ShareLink.vue:5)
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
