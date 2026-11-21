import type { ConditionId } from './conditions.ts'
import type { EvalTask } from './tasks.ts'
import { parseArgs } from 'node:util'
import { parseConditions } from './conditions.ts'
import { TASKS } from './tasks.ts'

export const HELP = `agent-evals: does Claude Code reuse maz-ui, alone, with \`init\` and with the plugin?

Usage: pnpm -F agent-evals eval [options]

Each run creates a new Vue app that uses maz-ui, gives a task to \`claude -p\`, then scores what it wrote:
no review error nor warning, the expected maz-ui tools used, no hand-made version.
It calls the real Claude Code with your auth: each run costs tokens. Never run it in CI.

Options:
  --conditions <list>    Comma separated: baseline, init, plugin (default: all)
  --tasks <list>         Comma separated ids of the tasks (default: all)
  --runs <n>             Runs of each task in each condition (default 1)
  --concurrency <n>      Runs at once (default 3)
  --model <model>        Model of the agent (default: the one of Claude Code)
  --max-budget-usd <n>   Budget of each run
  --out <dir>            Folder of the results (default: results/<date>)
  --keep                 Keep the apps of the runs (their path is in the results)
  --dry-run              Print the runs and the claude commands without running them
  --list                 List the tasks
  -h, --help
`

export interface EvalOptions {
  conditions: ConditionId[]
  tasks: EvalTask[]
  runs: number
  concurrency: number
  model?: string
  maxBudgetUsd?: number
  out?: string
  keep: boolean
  dryRun: boolean
  list: boolean
  help: boolean
}

function positiveNumber(value: string | undefined, name: string, fallback: number): number {
  if (value === undefined)
    return fallback

  const number = Number(value)

  if (Number.isNaN(number) || number <= 0)
    throw new Error(`--${name} needs a positive number, got "${value}".`)

  return number
}

function parseTasks(value: string | undefined): EvalTask[] {
  if (!value)
    return TASKS

  const ids = value.split(',').map(id => id.trim()).filter(Boolean)
  const unknown = ids.filter(id => !TASKS.some(task => task.id === id))

  if (unknown.length > 0)
    throw new Error(`Unknown task(s): ${unknown.join(', ')}. Use ${TASKS.map(task => task.id).join(', ')}.`)

  return TASKS.filter(task => ids.includes(task.id))
}

export function parseOptions(argv: string[]): EvalOptions {
  const { values } = parseArgs({
    args: argv,
    options: {
      'conditions': { type: 'string' },
      'tasks': { type: 'string' },
      'runs': { type: 'string' },
      'concurrency': { type: 'string' },
      'model': { type: 'string' },
      'max-budget-usd': { type: 'string' },
      'out': { type: 'string' },
      'keep': { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
      'list': { type: 'boolean', default: false },
      'help': { type: 'boolean', short: 'h', default: false },
    },
  })

  return {
    conditions: parseConditions(values.conditions),
    tasks: parseTasks(values.tasks),
    runs: Math.floor(positiveNumber(values.runs, 'runs', 1)),
    concurrency: Math.floor(positiveNumber(values.concurrency, 'concurrency', 3)),
    model: values.model,
    maxBudgetUsd: values['max-budget-usd'] === undefined
      ? undefined
      : positiveNumber(values['max-budget-usd'], 'max-budget-usd', 0),
    out: values.out,
    keep: values.keep,
    dryRun: values['dry-run'],
    list: values.list,
    help: values.help,
  }
}

/** Runs `worker` on each item, `concurrency` at once, in the order of the items */
export async function pool<T, R>(items: T[], concurrency: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = Array.from({ length: items.length })
  let next = 0

  async function lane(): Promise<void> {
    while (next < items.length) {
      const index = next++

      results[index] = await worker(items[index])
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, lane))

  return results
}
