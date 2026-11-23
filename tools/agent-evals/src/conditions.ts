import { join } from 'node:path'

/**
 * - `baseline`: Claude Code alone, without the settings, MCP servers and plugins of the user
 * - `init`: what `npx @maz-ui/mcp init` writes in the project (rules, MCP server, review hooks)
 * - `plugin`: the maz-ui Claude Code plugin of this repository, without init
 */
export const CONDITIONS = ['baseline', 'init', 'plugin'] as const

export type ConditionId = typeof CONDITIONS[number]

export interface ClaudeArgsOptions {
  prompt: string
  /** Root of the maz-ui repository */
  repoRoot: string
  /** The app the agent works in */
  fixtureDir: string
  model?: string
  maxBudgetUsd?: number
}

/** The baseline has no tool for the agents: the app does not install `@maz-ui/mcp` */
export function installsMcp(condition: ConditionId): boolean {
  return condition !== 'baseline'
}

/** The command `init` runs in the fixture before the agent, `undefined` when the condition needs none */
export function setupCommand(condition: ConditionId, repoRoot: string): string[] | undefined {
  return condition === 'init'
    ? [join(repoRoot, 'packages/mcp/bin/maz-ui-mcp.mjs'), 'init', '--targets', 'claude']
    : undefined
}

function conditionArgs(condition: ConditionId, { repoRoot, fixtureDir }: ClaudeArgsOptions): string[] {
  switch (condition) {
    case 'baseline':
      return ['--strict-mcp-config']
    case 'init':
      return ['--strict-mcp-config', '--mcp-config', join(fixtureDir, '.mcp.json')]
    case 'plugin':
      return ['--plugin-dir', join(repoRoot, 'plugins/maz-ui')]
  }
}

/** Arguments of `claude` for a task: headless, no permission prompt, only the project settings */
export function claudeArgs(condition: ConditionId, options: ClaudeArgsOptions): string[] {
  return [
    '-p',
    options.prompt,
    '--output-format',
    'stream-json',
    '--verbose',
    '--permission-mode',
    'bypassPermissions',
    '--setting-sources',
    'project',
    '--no-session-persistence',
    ...conditionArgs(condition, options),
    ...(options.model ? ['--model', options.model] : []),
    ...(options.maxBudgetUsd ? ['--max-budget-usd', String(options.maxBudgetUsd)] : []),
  ]
}

export function parseConditions(value: string | undefined): ConditionId[] {
  if (!value)
    return [...CONDITIONS]

  const names = value.split(',').map(name => name.trim()).filter(Boolean)
  const unknown = names.filter(name => !(CONDITIONS as readonly string[]).includes(name))

  if (unknown.length > 0)
    throw new Error(`Unknown condition(s): ${unknown.join(', ')}. Use ${CONDITIONS.join(', ')}.`)

  return names as ConditionId[]
}
