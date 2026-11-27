import type { ConditionId } from './conditions.ts'
import type { TaskScore } from './score.ts'

export interface ConditionSummary {
  condition: ConditionId
  runs: number
  passed: number
  /** Errors and warnings of the review, by run */
  findingsPerRun: number
  /** Runs whose app typechecks and builds */
  typecheck: number
  build: number
  /** Runs that added a dependency to the app */
  addedDependencies: number
  linesPerRun: number
  toolCallsPerRun: number
  /** Thousands of tokens, by run */
  tokensPerRun: number
  costUsd: number
  turnsPerRun: number
  minutesPerRun: number
  /** Calls of the tools of the maz-ui MCP server, by run */
  mcpCallsPerRun: number
  /** Runs that read the agent docs of the packages */
  readAgentDocs: number
  /** Runs that reviewed their code */
  reviewed: number
}

function round(value: number, digits = 2): number {
  return Math.round(value * 10 ** digits) / 10 ** digits
}

export function summarize(scores: TaskScore[]): ConditionSummary[] {
  const conditions = [...new Set(scores.map(score => score.condition))]

  return conditions.map((condition) => {
    const runs = scores.filter(score => score.condition === condition)
    const total = (pick: (score: TaskScore) => number) => runs.reduce((sum, score) => sum + pick(score), 0)

    return {
      condition,
      runs: runs.length,
      passed: runs.filter(score => score.passed).length,
      findingsPerRun: round(total(score => score.findings.length) / runs.length),
      typecheck: runs.filter(score => score.checks?.typecheck.passed).length,
      build: runs.filter(score => score.checks?.build.passed).length,
      addedDependencies: runs.filter(score => score.addedDependencies.length > 0).length,
      linesPerRun: round(total(score => score.linesAdded) / runs.length, 0),
      toolCallsPerRun: round(total(score => score.usage.toolCalls) / runs.length, 1),
      tokensPerRun: round(total(score => score.tokens) / runs.length / 1000, 0),
      costUsd: round(total(score => score.costUsd)),
      turnsPerRun: round(total(score => score.turns) / runs.length, 1),
      minutesPerRun: round(total(score => score.durationMs) / runs.length / 60_000, 1),
      mcpCallsPerRun: round(total(score => score.usage.mcpTools.length) / runs.length, 1),
      readAgentDocs: runs.filter(score => score.usage.readAgentDocs).length,
      reviewed: runs.filter(score => score.usage.reviewed).length,
    }
  })
}

function percent(passed: number, runs: number): string {
  return `${Math.round(passed / runs * 100)}%`
}

function failure(score: TaskScore): string {
  return [
    score.error,
    ...score.missing.map(pattern => `missing ${pattern}`),
    ...score.forbidden.map(pattern => `hand-made ${pattern}`),
    ...score.addedDependencies.map(name => `added ${name}`),
    score.checks?.typecheck.passed === false ? 'typecheck failed' : '',
    score.checks?.build.passed === false ? 'build failed' : '',
    ...score.findings,
  ].filter(Boolean).join(', ')
}

export function renderReport(scores: TaskScore[]): string {
  const summaries = summarize(scores)
  const conditions = summaries.map(summary => summary.condition)
  const tasks = [...new Set(scores.map(score => score.task))]
  const lines = [
    '# maz-ui agent evals',
    '',
    '## Quality',
    '',
    '| Condition | Pass rate | Review findings / run | Typecheck | Build | Added a dependency | Lines / run |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...summaries.map(summary => `| ${summary.condition} | ${percent(summary.passed, summary.runs)} (${summary.passed}/${summary.runs}) | ${summary.findingsPerRun} | ${percent(summary.typecheck, summary.runs)} | ${percent(summary.build, summary.runs)} | ${percent(summary.addedDependencies, summary.runs)} | ${summary.linesPerRun} |`),
    '',
    '## Effort',
    '',
    '| Condition | Tool calls / run | MCP calls / run | Read agent-docs | Reviewed | Tokens / run | Turns / run | Minutes / run | Cost |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...summaries.map(summary => `| ${summary.condition} | ${summary.toolCallsPerRun} | ${summary.mcpCallsPerRun} | ${percent(summary.readAgentDocs, summary.runs)} | ${percent(summary.reviewed, summary.runs)} | ${summary.tokensPerRun}k | ${summary.turnsPerRun} | ${summary.minutesPerRun} | $${summary.costUsd.toFixed(2)} |`),
    '',
    '## Tasks',
    '',
    `| Task | ${conditions.join(' | ')} |`,
    `| --- |${conditions.map(() => ' --- |').join('')}`,
    ...tasks.map((task) => {
      const cells = conditions.map((condition) => {
        const runs = scores.filter(score => score.task === task && score.condition === condition)

        return runs.length > 0
          ? `${runs.filter(score => score.passed).length}/${runs.length}`
          : '-'
      })

      return `| ${task} | ${cells.join(' | ')} |`
    }),
  ]
  const failures = scores.filter(score => !score.passed)

  if (failures.length > 0)
    lines.push('', '## Failures', '', ...failures.map(score => `- ${score.condition} / ${score.task} #${score.run}: ${failure(score)}`))

  return `${lines.join('\n')}\n`
}
