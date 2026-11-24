import type { AppChecks } from './checks.ts'
import type { ConditionId } from './conditions.ts'
import type { EvalTask } from './tasks.ts'

/** `maz-ui-mcp review --format json` */
export interface ReviewOutput {
  totals: { error: number, warning: number, info: number }
  files: Array<{ file: string, findings: Array<{ rule: string, severity: string, message: string, line: number }> }>
}

/** What the agent used to find maz-ui, read from the tool calls of its transcript */
export interface AgentUsage {
  /** Every tool call of the agent */
  toolCalls: number
  /** Tools of the maz-ui MCP server, in the order of the calls (`search_docs`, `get_component_api`...) */
  mcpTools: string[]
  /** It read the docs of `node_modules/maz-ui/agent-docs` (or of another package) */
  readAgentDocs: boolean
  /** It reviewed its code: `review_code`, or `maz-ui-mcp review` in a shell */
  reviewed: boolean
  /** Skills it invoked */
  skills: string[]
  /** Subagents it started */
  subagents: string[]
}

/** Tokens of every model of the run (subagents included), cached ones included */
export interface TokenUsage {
  input: number
  output: number
  cacheRead: number
  cacheCreation: number
}

/** `claude -p --output-format stream-json --verbose` */
export interface ClaudeResult {
  costUsd: number
  tokens: TokenUsage
  turns: number
  durationMs: number
  isError: boolean
  /** Last message of the agent */
  result: string
  usage: AgentUsage
}

export interface TaskScore {
  task: string
  condition: ConditionId
  run: number
  /**
   * The agent wrote code, the review finds no error nor warning, every expected tool is used, no hand-made version, no
   * dependency added, the app typechecks and builds
   */
  passed: boolean
  files: string[]
  /** Lines the agent added to its files */
  linesAdded: number
  /** Dependencies the agent added to the `package.json` of the app */
  addedDependencies: string[]
  /** `vue-tsc` and `vite build` of the app, without them when the agent wrote no file */
  checks?: AppChecks
  /** Errors and warnings of the review, `rule (file:line)` */
  findings: string[]
  /** The expected patterns the code does not match */
  missing: string[]
  /** The forbidden patterns the code matches */
  forbidden: string[]
  costUsd: number
  /** Every token of the run, cached ones included */
  tokens: number
  turns: number
  durationMs: number
  usage: AgentUsage
  error?: string
  /** The app of the run, kept with `--keep` */
  app?: string
}

const MCP_TOOL = /^mcp__(?:plugin_maz-ui_)?maz-ui__(\w+)$/

function emptyUsage(): AgentUsage {
  return { toolCalls: 0, mcpTools: [], readAgentDocs: false, reviewed: false, skills: [], subagents: [] }
}

function parseLines(stdout: string): Array<Record<string, unknown>> {
  return stdout.split('\n').flatMap((line) => {
    try {
      const value: unknown = JSON.parse(line)

      return value && typeof value === 'object' ? [value as Record<string, unknown>] : []
    }
    catch {
      return []
    }
  })
}

function addToolUse(usage: AgentUsage, name: string, input: Record<string, unknown>): void {
  const mcpTool = MCP_TOOL.exec(name)?.[1]
  const text = JSON.stringify(input)

  usage.toolCalls++

  if (mcpTool)
    usage.mcpTools.push(mcpTool)

  if (mcpTool === 'review_code' || (name === 'Bash' && /maz-ui-mcp[^|;&]* review\b/.test(text)))
    usage.reviewed = true

  if (!mcpTool && text.includes('agent-docs'))
    usage.readAgentDocs = true

  if (name === 'Skill' && typeof input.skill === 'string')
    usage.skills.push(input.skill)

  if ((name === 'Agent' || name === 'Task') && typeof input.subagent_type === 'string')
    usage.subagents.push(input.subagent_type)
}

/** The tool calls of the assistant messages */
function readUsage(lines: Array<Record<string, unknown>>): AgentUsage {
  const usage = emptyUsage()

  for (const line of lines.filter(entry => entry.type === 'assistant')) {
    const content = (line.message as { content?: unknown } | undefined)?.content

    for (const block of Array.isArray(content) ? content as Array<Record<string, unknown>> : []) {
      if (block.type === 'tool_use' && typeof block.name === 'string')
        addToolUse(usage, block.name, (block.input ?? {}) as Record<string, unknown>)
    }
  }

  return usage
}

const NO_TOKENS: TokenUsage = { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 }

type ModelUsage = Partial<Record<'inputTokens' | 'outputTokens' | 'cacheReadInputTokens' | 'cacheCreationInputTokens', number>>
type ApiUsage = Partial<Record<'input_tokens' | 'output_tokens' | 'cache_read_input_tokens' | 'cache_creation_input_tokens', number>>

/** `modelUsage` counts every model of the run, `usage` only the main one (older Claude Code) */
function readTokens(output: Record<string, unknown>): TokenUsage {
  const models = Object.values((output.modelUsage ?? {}) as Record<string, ModelUsage>)

  if (models.length > 0) {
    return models.reduce<TokenUsage>((sum, model) => ({
      input: sum.input + (model.inputTokens ?? 0),
      output: sum.output + (model.outputTokens ?? 0),
      cacheRead: sum.cacheRead + (model.cacheReadInputTokens ?? 0),
      cacheCreation: sum.cacheCreation + (model.cacheCreationInputTokens ?? 0),
    }), NO_TOKENS)
  }

  const usage = (output.usage ?? {}) as ApiUsage

  return {
    input: usage.input_tokens ?? 0,
    output: usage.output_tokens ?? 0,
    cacheRead: usage.cache_read_input_tokens ?? 0,
    cacheCreation: usage.cache_creation_input_tokens ?? 0,
  }
}

export function totalTokens(tokens: TokenUsage): number {
  return tokens.input + tokens.output + tokens.cacheRead + tokens.cacheCreation
}

export function parseClaudeResult(stdout: string): ClaudeResult {
  const lines = parseLines(stdout)
  const output = lines.findLast(line => line.type === 'result')

  if (!output)
    return { costUsd: 0, tokens: NO_TOKENS, turns: 0, durationMs: 0, isError: true, result: stdout.trim().slice(0, 500) || 'no output', usage: readUsage(lines) }

  return {
    costUsd: Number(output.total_cost_usd ?? 0),
    tokens: readTokens(output),
    turns: Number(output.num_turns ?? 0),
    durationMs: Number(output.duration_ms ?? 0),
    isError: output.is_error === true || (typeof output.subtype === 'string' && output.subtype !== 'success'),
    result: typeof output.result === 'string' ? output.result : '',
    usage: readUsage(lines),
  }
}

export interface ScoreInput {
  task: EvalTask
  condition: ConditionId
  run: number
  /** The files written by the agent and their content */
  sources: Record<string, string>
  review: ReviewOutput | undefined
  claude: ClaudeResult
  /** `vue-tsc` and `vite build` of the app, `undefined` when the agent wrote no file */
  checks?: AppChecks
  addedDependencies?: string[]
  linesAdded?: number
}

export function scoreTask({ task, condition, run, sources, review, claude, checks, addedDependencies = [], linesAdded = 0 }: ScoreInput): TaskScore {
  const code = Object.values(sources).join('\n')
  const files = Object.keys(sources)
  const findings = (review?.files ?? []).flatMap(file => file.findings
    .filter(finding => finding.severity === 'error' || finding.severity === 'warning')
    .map(finding => `${finding.rule} (${file.file}:${finding.line})`))
  const missing = task.expects.filter(pattern => !pattern.test(code)).map(String)
  const forbidden = task.forbids.filter(pattern => pattern.test(code)).map(String)
  const error = claude.isError
    ? claude.result || 'the agent failed'
    : files.length === 0
      ? 'no source file written'
      : undefined

  return {
    task: task.id,
    condition,
    run,
    passed: !error && findings.length === 0 && missing.length === 0 && forbidden.length === 0 && addedDependencies.length === 0 && checks?.typecheck.passed !== false && checks?.build.passed !== false,
    files,
    linesAdded,
    addedDependencies,
    ...(checks ? { checks } : {}),
    findings,
    missing,
    forbidden,
    costUsd: claude.costUsd,
    tokens: totalTokens(claude.tokens),
    turns: claude.turns,
    durationMs: claude.durationMs,
    usage: claude.usage,
    ...(error ? { error } : {}),
  }
}
