import type { ConditionId } from './conditions.ts'
import type { ReviewOutput, TaskScore } from './score.ts'
import type { EvalTask } from './tasks.ts'
import { execFileSync, spawn, spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { addedDependencies, addedLines, runChecks } from './checks.ts'
import { claudeArgs, installsMcp, setupCommand } from './conditions.ts'
import { changedFiles, commitAll, createFixture, readSources } from './fixture.ts'
import { parseClaudeResult, scoreTask } from './score.ts'

/** Runs `claude` with these arguments in the app, resolves with its stdout */
export type ClaudeRunner = (args: string[], cwd: string) => Promise<string>

export interface RunTaskOptions {
  repoRoot: string
  templateDir: string
  task: EvalTask
  condition: ConditionId
  run: number
  /** Folder of the results: the score, the files written by the agent and its last message */
  outDir: string
  model?: string
  maxBudgetUsd?: number
  /** Keep the app of the run instead of removing it */
  keep?: boolean
  runClaude?: ClaudeRunner
}

const TIMEOUT_MS = 20 * 60_000

export const runClaude: ClaudeRunner = (args, cwd) => new Promise((resolve) => {
  // eslint-disable-next-line sonarjs/no-os-command-from-path -- the claude of the machine, with its auth
  const child = spawn('claude', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], timeout: TIMEOUT_MS })
  let stdout = ''
  let stderr = ''

  child.stdout.setEncoding('utf8').on('data', (chunk: string) => {
    stdout += chunk
  })
  child.stderr.setEncoding('utf8').on('data', (chunk: string) => {
    stderr += chunk
  })
  child.on('error', error => resolve(error.message))
  child.on('close', () => resolve(stdout || stderr))
})

/** `maz-ui-mcp review` of the repository on the files of the agent: errors and warnings only */
export function review(repoRoot: string, directory: string, files: string[]): ReviewOutput | undefined {
  if (files.length === 0)
    return undefined

  const { stdout } = spawnSync(process.execPath, [join(repoRoot, 'packages/mcp/bin/maz-ui-mcp.mjs'), 'review', ...files, '--format', 'json', '--min-severity', 'warning'], { cwd: directory, encoding: 'utf8' })

  try {
    return JSON.parse(stdout) as ReviewOutput
  }
  catch {
    return undefined
  }
}

function save(directory: string, file: string, content: string): void {
  mkdirSync(dirname(join(directory, file)), { recursive: true })
  writeFileSync(join(directory, file), content)
}

/** One run of a task: a new app, the setup of the condition, the agent, then the review of what it wrote */
export async function runTask(options: RunTaskOptions): Promise<TaskScore> {
  const { repoRoot, task, condition, run } = options
  const fixtureDir = createFixture(repoRoot, options.templateDir, { mcp: installsMcp(condition) })

  try {
    const setup = setupCommand(condition, repoRoot)

    if (setup) {
      // A Claude config of its own: the plugin installed by the user would change what init writes
      execFileSync(process.execPath, setup, { cwd: fixtureDir, stdio: 'ignore', env: { ...process.env, CLAUDE_CONFIG_DIR: join(fixtureDir, '.git/claude-config') } })
      commitAll(fixtureDir, condition)
    }

    const args = claudeArgs(condition, { prompt: task.prompt, repoRoot, fixtureDir, model: options.model, maxBudgetUsd: options.maxBudgetUsd })
    const stdout = await (options.runClaude ?? runClaude)(args, fixtureDir)
    const claude = parseClaudeResult(stdout)
    const files = changedFiles(fixtureDir)
    const sources = readSources(fixtureDir, files)
    const checks = files.length > 0 ? runChecks(fixtureDir) : undefined
    const score: TaskScore = {
      ...scoreTask({ task, condition, run, sources, review: review(repoRoot, fixtureDir, files), claude, checks, addedDependencies: addedDependencies(fixtureDir), linesAdded: addedLines(fixtureDir, files) }),
      ...(options.keep ? { app: fixtureDir } : {}),
    }
    const resultDir = join(options.outDir, `${condition}-${task.id}-${run}`)

    save(resultDir, 'score.json', `${JSON.stringify(score, null, 2)}\n`)
    save(resultDir, 'result.md', `${claude.result}\n`)
    save(resultDir, 'transcript.jsonl', stdout)

    for (const [name, result] of Object.entries(checks ?? {})) {
      if (!result.passed)
        save(resultDir, `${name}.log`, `${result.output}\n`)
    }

    for (const [file, content] of Object.entries(sources)) save(resultDir, join('files', file), content)

    return score
  }
  finally {
    if (!options.keep)
      rmSync(fixtureDir, { recursive: true, force: true })
  }
}
