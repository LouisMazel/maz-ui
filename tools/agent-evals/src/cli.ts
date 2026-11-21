import type { TaskScore } from './score.ts'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { claudeArgs, setupCommand } from './conditions.ts'
import { checkBuilt } from './fixture.ts'
import { HELP, parseOptions, pool } from './options.ts'
import { renderReport } from './report.ts'
import { runTask } from './run.ts'

const PACKAGE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REPO_ROOT = resolve(PACKAGE_DIR, '../..')
const TEMPLATE_DIR = join(PACKAGE_DIR, 'fixture')

async function main(): Promise<number> {
  const options = parseOptions(process.argv.slice(2))

  if (options.help) {
    console.log(HELP)
    return 0
  }

  if (options.list) {
    for (const task of options.tasks) console.log(`${task.id}: ${task.prompt}`)
    return 0
  }

  const runs = options.conditions.flatMap(condition => options.tasks.flatMap(task => Array.from({ length: options.runs }, (_, index) => ({ condition, task, run: index + 1 }))))

  if (options.dryRun) {
    for (const { condition, task, run } of runs) {
      const setup = setupCommand(condition, REPO_ROOT)
      const args = claudeArgs(condition, { prompt: task.prompt, repoRoot: REPO_ROOT, fixtureDir: '<app>', model: options.model, maxBudgetUsd: options.maxBudgetUsd })

      console.log(`${condition} / ${task.id} #${run}${setup ? `\n  node ${setup.join(' ')}` : ''}\n  claude ${args.map(arg => JSON.stringify(arg)).join(' ')}`)
    }

    console.log(`\n${runs.length} run(s).`)
    return 0
  }

  const missing = checkBuilt(REPO_ROOT)

  if (missing.length > 0) {
    console.error(`Build the packages first (pnpm build:packages): ${missing.join(', ')}`)
    return 1
  }

  const outDir = resolve(options.out ?? join(PACKAGE_DIR, 'results', new Date().toISOString().replaceAll(':', '-').slice(0, 19)))
  let done = 0

  console.log(`${runs.length} run(s), ${options.concurrency} at once. Results: ${outDir}`)

  const scores: TaskScore[] = await pool(runs, options.concurrency, async ({ condition, task, run }) => {
    const score = await runTask({ repoRoot: REPO_ROOT, templateDir: TEMPLATE_DIR, task, condition, run, outDir, model: options.model, maxBudgetUsd: options.maxBudgetUsd, keep: options.keep })

    console.log(`[${++done}/${runs.length}] ${condition} / ${task.id} #${run}: ${score.passed ? 'pass' : 'fail'} ($${score.costUsd.toFixed(2)})`)

    return score
  })
  const report = renderReport(scores)

  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'scores.json'), `${JSON.stringify(scores, null, 2)}\n`)
  writeFileSync(join(outDir, 'report.md'), report)
  console.log(`\n${report}`)

  return 0
}

main().then(code => process.exit(code), (error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
