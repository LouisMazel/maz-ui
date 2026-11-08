import type { AgentTarget, SetupAgentsChange } from '@maz-ui/node'
import type { Framework, Severity } from './review'

import { Buffer } from 'node:buffer'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { AGENT_TARGETS, detectAgentTargets, detectPackageManager, findProjectPackage, setupAgents } from '@maz-ui/node'
import { getErrorMessage } from '@maz-ui/utils/helpers/getErrorMessage'
import { createContext } from './context'
import { startStdioServer } from './server'
import { searchDocs } from './tools/search-docs'
import { readOwnVersion } from './version'

export const HELP = `maz-ui-mcp: maz-ui knowledge for AI coding agents

Usage:
  maz-ui-mcp [serve] [--docs <dir>]   Start the MCP server (stdio)
  maz-ui-mcp init [options]           Configure the AI agents of this project for maz-ui
  maz-ui-mcp review <paths...>        Review files against maz-ui (CI friendly)
  maz-ui-mcp search <query>           Search the maz-ui docs from the terminal

init options:
  --targets <list>    Comma separated: ${AGENT_TARGETS.join(', ')} (default: detected, else claude,agents-md)
  --paths <globs>     Comma separated globs the Claude Code rule is scoped to, or all (default: the workspaces that use maz-ui)
  --no-rules          Only register the MCP server (no rule file, no AGENTS.md section)
  --no-mcp            Do not register the MCP server
  --dry-run           Show the changes without writing them
  --remove            Remove what init added

review options:
  --min-severity <s>  error | warning | info (default info)
  --framework <f>     vue | nuxt (default: detected)
  --format <f>        text | json (default text)
  --max-warnings <n>  Exit with an error above this number of warnings
  --hook              Claude Code PostToolUse hook mode (reads the edited file from stdin)

Common options:
  --docs <dir>        Use this docs folder (bundle with index.json, or the agent-docs of a package) instead of the installed packages
  --cwd <dir>         Project root (default: current directory)
  -v, --version
  -h, --help
`

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = []

  for await (const chunk of process.stdin) chunks.push(chunk as Buffer)

  return Buffer.concat(chunks).toString('utf8')
}

function printChanges(changes: SetupAgentsChange[], dryRun: boolean): void {
  const labels: Record<SetupAgentsChange['action'], string> = {
    create: dryRun ? 'would create' : 'created',
    update: dryRun ? 'would update' : 'updated',
    remove: dryRun ? 'would remove' : 'removed',
    unchanged: 'up to date',
    skip: 'skipped',
  }

  for (const change of changes) {
    console.log(`  ${labels[change.action].padEnd(13)} ${change.file}${change.reason
      ? ` (${change.reason})`
      : ''}`)
  }
}

const INSTALL_DEV_COMMANDS = {
  pnpm: 'pnpm add -D',
  yarn: 'yarn add -D',
  bun: 'bun add -d',
  npm: 'npm install -D',
}

/** Targets of `init`: the requested ones, else the detected ones, else Claude Code and AGENTS.md. `undefined` when a requested target is unknown */
function resolveInitTargets(values: Record<string, unknown>, cwd: string): AgentTarget[] | undefined {
  const requested = typeof values.targets === 'string'
    ? values.targets.split(',').map(target => target.trim()).filter(Boolean)
    : undefined
  const invalid = requested?.filter(target => !AGENT_TARGETS.includes(target as AgentTarget)) ?? []

  if (invalid.length > 0) {
    console.error(`Unknown target(s): ${invalid.join(', ')}. Available: ${AGENT_TARGETS.join(', ')}.`)
    return undefined
  }

  const detected = detectAgentTargets(cwd)

  return (requested as AgentTarget[] | undefined) ?? (detected.length > 0
    ? detected
    : ['claude', 'agents-md'])
}

/** Scope of the Claude Code rule: the `--paths` globs, `all`, or `undefined` for the automatic scope */
function resolveInitPaths(values: Record<string, unknown>): 'all' | string[] | undefined {
  const globs = typeof values.paths === 'string'
    ? values.paths.split(',').map(glob => glob.trim()).filter(Boolean)
    : undefined

  return globs?.length === 1 && globs[0] === 'all'
    ? 'all'
    : globs
}

/** The rules are the ones of maz-ui: in a bundle folder (`index.json`), its `maz-ui` fragment */
function setupDocsDir(docsDir: string): string {
  return existsSync(join(docsDir, 'index.json'))
    ? join(docsDir, 'maz-ui')
    : docsDir
}

export function runInit(values: Record<string, unknown>, cwd: string): number {
  const targets = resolveInitTargets(values, cwd)

  if (!targets)
    return 1

  const dryRun = values['dry-run'] === true
  const remove = values.remove === true
  const mcp = values['no-mcp'] !== true
  const docsDir = typeof values.docs === 'string'
    ? setupDocsDir(resolve(values.docs))
    : undefined
  // The rules document the maz-ui components: a project without maz-ui (@maz-ui/utils only...) only gets the MCP server
  const withoutMazUi = !remove && mcp && values['no-rules'] !== true && !docsDir && !findProjectPackage(cwd, 'maz-ui')
  const rules = values['no-rules'] !== true && !withoutMazUi
  const result = setupAgents({
    rootDir: cwd,
    targets,
    rules,
    mcp,
    dryRun,
    remove,
    docsDir,
    paths: resolveInitPaths(values),
    mcpVersion: readOwnVersion(),
  })
  const serverCommand = [result.mcpServer.command, ...result.mcpServer.args].join(' ')

  console.log(`maz-ui ${result.version
    ? `${result.version} `
    : ''}agents setup (${targets.join(', ')})${dryRun ? ' - dry run' : ''}`)
  printChanges(result.changes, dryRun)

  if (!remove && rules && result.claudeRulePaths)
    console.log(`\nThe Claude Code rule is only loaded for: ${result.claudeRulePaths.join(', ')} (change it with --paths, or --paths all to always load it).`)

  if (withoutMazUi)
    console.log(`\nmaz-ui is not installed in this project: only the MCP server is registered, with the docs bundled in @maz-ui/mcp. Install maz-ui and run init again to add the rules.`)

  if (!remove && mcp && !result.localMcpServer)
    console.log(`\nThe MCP server runs through \`${serverCommand}\`: install @maz-ui/mcp as a devDependency of the project (\`${INSTALL_DEV_COMMANDS[detectPackageManager(cwd)]} @maz-ui/mcp\`) and run init again to start it in about a second, at the version of your lockfile.`)

  if (!remove && rules && targets.includes('agents-md'))
    console.log(`\nCodex and Windsurf read AGENTS.md. To give them the MCP server too, add \`${serverCommand}\` to their global MCP config.`)

  return 0
}

export async function runReview(values: Record<string, unknown>, positionals: string[], cwd: string): Promise<number> {
  const context = createContext({
    cwd,
    docsDir: typeof values.docs === 'string'
      ? resolve(values.docs)
      : undefined,
  })
  const framework = values.framework as Framework | undefined
  const [{ countBySeverity, formatFindings }, { REVIEWABLE_EXTENSIONS, reviewFiles }] = await Promise.all([import('./review'), import('./review/files')])

  if (values.hook) {
    const input = JSON.parse(await readStdin() || '{}') as { tool_input?: { file_path?: string }, cwd?: string }
    const file = input.tool_input?.file_path

    if (!file || !REVIEWABLE_EXTENSIONS.includes(file.split('.').pop() ?? '') || /[\\/](?:node_modules|dist|\.nuxt|\.output)[\\/]/.test(file))
      return 0

    const { reviews } = await reviewFiles([file], {
      knowledge: context.knowledge,
      cwd: input.cwd ?? cwd,
      framework,
      minSeverity: 'warning',
    })
    const findings = reviews.flatMap(review => review.findings)

    if (findings.length === 0)
      return 0

    console.error(`${formatFindings(findings, reviews[0].file)}\n\nFix these maz-ui issues (see the maz-ui MCP tools), or add a \`maz-ui-review-ignore <rule> -- <reason>\` comment above the line when it is intended.`)
    return 2
  }

  if (positionals.length === 0) {
    console.error('Pass the files, folders or globs to review: maz-ui-mcp review "src/**/*.vue"')
    return 1
  }

  const { reviews, truncated } = await reviewFiles(positionals, {
    knowledge: context.knowledge,
    cwd,
    framework,
    minSeverity: (values['min-severity'] as Severity | undefined) ?? 'info',
  })
  const totals = countBySeverity(reviews.flatMap(review => review.findings))

  if (values.format === 'json') {
    console.log(JSON.stringify({
      version: context.knowledge.version,
      totals,
      truncated,
      files: reviews,
    }, null, 2))
  }
  else {
    for (const review of reviews.filter(entry => entry.findings.length > 0)) console.log(`${formatFindings(review.findings, review.file)}\n`)

    console.log(`${reviews.length} file(s) reviewed against maz-ui ${context.knowledge.version}: ${totals.error} error(s), ${totals.warning} warning(s), ${totals.info} info.`)
  }

  const maxWarnings = values['max-warnings'] === undefined
    ? Number.POSITIVE_INFINITY
    : Number(values['max-warnings'])

  return totals.error > 0 || totals.warning > maxWarnings
    ? 1
    : 0
}

export async function runCli(argv: string[] = process.argv.slice(2)): Promise<number> {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: true,
    options: {
      'docs': { type: 'string' },
      'cwd': { type: 'string' },
      'targets': { type: 'string' },
      'paths': { type: 'string' },
      'no-rules': { type: 'boolean' },
      'no-mcp': { type: 'boolean' },
      'dry-run': { type: 'boolean' },
      'remove': { type: 'boolean' },
      'min-severity': { type: 'string' },
      'framework': { type: 'string' },
      'format': { type: 'string' },
      'max-warnings': { type: 'string' },
      'hook': { type: 'boolean' },
      'version': { type: 'boolean', short: 'v' },
      'help': { type: 'boolean', short: 'h' },
    },
  })
  const [command = 'serve', ...rest] = positionals
  const cwd = resolve(values.cwd ?? process.cwd())

  if (values.help) {
    console.log(HELP)
    return 0
  }

  if (values.version) {
    console.log(readOwnVersion())
    return 0
  }

  switch (command) {
    case 'serve':
      await startStdioServer({
        cwd,
        docsDir: values.docs
          ? resolve(values.docs)
          : undefined,
      })
      return -1
    case 'init':
      return runInit(values, cwd)
    case 'review':
      return runReview(values, rest, cwd)
    case 'search': {
      const context = createContext({
        cwd,
        docsDir: values.docs
          ? resolve(values.docs)
          : undefined,
      })
      console.log(searchDocs(context, { query: rest.join(' ') || 'button' }))
      return 0
    }
    default:
      console.error(`Unknown command "${command}".\n\n${HELP}`)
      return 1
  }
}

export async function main(): Promise<void> {
  try {
    const code = await runCli()

    if (code >= 0)
      process.exitCode = code
  }
  catch (error) {
    console.error(getErrorMessage(error))
    process.exitCode = 1
  }
}
