import type { AgentsDiagnosis, AgentTarget, SetupAgentsChange } from '@maz-ui/node'
import type { ColorScaleStep } from '@maz-ui/themes/utils/resolve-preset'
import type { ServerContext } from './context.ts'
import type { Framework, Severity } from './review/index.ts'

import { Buffer } from 'node:buffer'
import { existsSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { AGENT_TARGETS, detectAgentTargets, detectPackageManager, diagnoseAgents, findProjectPackage, isClaudePluginEnabled, isCodexPluginEnabled, readPackageVersion, setupAgents } from '@maz-ui/node'
import { getErrorMessage } from '@maz-ui/utils/helpers/getErrorMessage'
import { createContext } from './context.ts'
import { startStdioServer } from './server.ts'
import { searchDocs } from './tools/search-docs.ts'
import { readOwnVersion } from './version.ts'

export const HELP = `maz-ui-mcp: maz-ui knowledge for AI coding agents

Usage:
  maz-ui-mcp [serve] [--docs <dir>]   Start the MCP server (stdio)
  maz-ui-mcp init [options]           Configure the AI agents of this project for maz-ui
  maz-ui-mcp doctor                   Check how Claude Code gets maz-ui here: MCP servers of each scope, duplicates, versions
  maz-ui-mcp review <paths...>        Review files against maz-ui (CI friendly)
  maz-ui-mcp search <query>           Search the maz-ui docs from the terminal
  maz-ui-mcp colors [preset]          Effective colors of the project presets (or of a bundled preset), with their contrasts

init options:
  --targets <list>    Comma separated: ${AGENT_TARGETS.join(', ')} (default: detected, else claude,agents-md)
  --paths <globs>     Comma separated globs the Claude Code rule is scoped to, or all (default: the workspaces that use maz-ui)
  --no-rules          Only register the MCP server (no rule file, no AGENTS.md section)
  --no-mcp            Do not register the MCP server
  --no-hooks          Do not register the review of each edited file (Claude Code hook, OpenCode plugin)
  --dry-run           Show the changes without writing them
  --remove            Remove what init added

colors options:
  --colors <list>     Comma separated colors to detail (oklch and contrasts of every step), e.g. accent,primary
  --steps <list>      Comma separated steps, e.g. 100,500,900

review options:
  --min-severity <s>  error | warning | info (default info)
  --framework <f>     vue | nuxt (default: detected)
  --format <f>        text | json (default text)
  --max-warnings <n>  Exit with an error above this number of warnings
  --hook              Claude Code hook mode: reviews the edited file (PostToolUse), or the files changed in git (Stop, SubagentStop)

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

export const CLAUDE_PLUGIN_INSTALL = 'claude plugin install maz-ui --marketplace LouisMazel/maz-ui'
export const CODEX_PLUGIN_INSTALL = 'codex plugin marketplace add LouisMazel/maz-ui && codex plugin add maz-ui@maz-ui'

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

interface InitFlags {
  dryRun: boolean
  remove: boolean
  mcp: boolean
  rules: boolean
  hooks: boolean
  docsDir?: string
  /** maz-ui is not installed: only the MCP server is registered */
  withoutMazUi: boolean
}

function resolveInitFlags(values: Record<string, unknown>, cwd: string): InitFlags {
  const remove = values.remove === true
  const mcp = values['no-mcp'] !== true
  const docsDir = typeof values.docs === 'string'
    ? setupDocsDir(resolve(values.docs))
    : undefined
  // The rules and the review hook are about the maz-ui components: a project without maz-ui (@maz-ui/utils only...) only gets the MCP server
  const withoutMazUi = !remove && mcp && values['no-rules'] !== true && !docsDir && !findProjectPackage(cwd, 'maz-ui')

  return {
    dryRun: values['dry-run'] === true,
    remove,
    mcp,
    rules: values['no-rules'] !== true && !withoutMazUi,
    hooks: values['no-hooks'] !== true && !withoutMazUi,
    docsDir,
    withoutMazUi,
  }
}

export function runInit(values: Record<string, unknown>, cwd: string): number {
  const targets = resolveInitTargets(values, cwd)

  if (!targets)
    return 1

  const { dryRun, remove, mcp, rules, hooks, docsDir, withoutMazUi } = resolveInitFlags(values, cwd)
  const result = setupAgents({
    rootDir: cwd,
    targets,
    rules,
    mcp,
    hooks,
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

  if (!remove && targets.includes('claude') && !isClaudePluginEnabled(cwd))
    console.log(`\nClaude Code: install the maz-ui plugin for your user, it brings the maz-ui skill, the MCP server and the review hook to all your projects, even without init: \`${CLAUDE_PLUGIN_INSTALL}\` (or \`/plugin marketplace add LouisMazel/maz-ui\` then \`/plugin install maz-ui@maz-ui\` in Claude Code).`)

  if (!remove && targets.includes('codex') && !isCodexPluginEnabled())
    console.log(`\nCodex: install the maz-ui plugin for your user, it brings the maz-ui skill, the MCP server and the review hooks to all your projects: \`${CODEX_PLUGIN_INSTALL}\`. Codex reads .codex/config.toml in the trusted projects only.`)

  if (!remove && rules && targets.includes('agents-md'))
    console.log(`\nCline and Zed read AGENTS.md but have no MCP config in the project. To give them the MCP server too, add \`${serverCommand}\` to their global MCP config.`)

  return 0
}

function serverState(server: AgentsDiagnosis['servers'][number]): string {
  if (server.active)
    return 'runs'

  return server.disabled
    ? 'disabled for you (disabledMcpjsonServers)'
    : 'not used: another server of the same name wins'
}

/** `maz-ui-mcp doctor`: exit code 1 when a problem is found */
export function runDoctor(cwd: string): number {
  const mazUi = findProjectPackage(cwd, 'maz-ui')
  const version = mazUi && readPackageVersion(mazUi)
  const mcp = findProjectPackage(cwd, '@maz-ui/mcp')
  const diagnosis = diagnoseAgents({ rootDir: cwd, version })
  const problems = [...diagnosis.problems]

  if (mazUi && !existsSync(join(mazUi, 'agent-docs'))) {
    problems.push({
      message: `maz-ui ${version} ships no docs for the agents: the MCP server and the plugin use the docs bundled in @maz-ui/mcp, of another version.`,
      fix: 'upgrade maz-ui',
    })
  }

  console.log(`maz-ui doctor (${cwd})\n`)
  console.log(`  maz-ui           ${mazUi
    ? `${version} (${relative(cwd, mazUi)})`
    : 'not installed: the docs bundled in @maz-ui/mcp are used'}`)
  console.log(`  @maz-ui/mcp      ${mcp
    ? `${readPackageVersion(mcp)} (${relative(cwd, mcp)})`
    : 'not installed: the servers download it with npx'}`)
  console.log(`  Claude plugin    ${diagnosis.plugin
    ? 'enabled'
    : `not enabled (\`${CLAUDE_PLUGIN_INSTALL}\`)`}`)
  console.log('\n  MCP servers of Claude Code:')

  for (const server of diagnosis.servers) {
    console.log(`    ${server.scope.padEnd(8)} ${server.name}${server.command
      ? `: ${server.command}`
      : ''} (${serverState(server)})`)
  }

  if (diagnosis.servers.length === 0)
    console.log('    none')

  if (problems.length === 0) {
    console.log('\nNo problem found.')
    return 0
  }

  console.log(`\n${problems.length} problem${problems.length > 1 ? 's' : ''}:`)

  for (const problem of problems)
    console.log(`  - ${problem.message}\n    fix: ${problem.fix}`)

  return 1
}

/** Claude Code and Codex hook: exit code 2 sends the findings back to the agent */
async function runReviewHook(context: ServerContext, cwd: string, framework: Framework | undefined, docsDir: string | undefined): Promise<number> {
  const { knowledgeByProject, reviewHook } = await import('./review/hook.ts')
  // `--docs` forces the docs of every file
  const knowledgeFor = docsDir
    ? undefined
    : knowledgeByProject()
  const message = await reviewHook(JSON.parse(await readStdin() || '{}'), { knowledge: context.knowledge, knowledgeFor, cwd, framework })

  if (!message)
    return 0

  console.error(message)
  return 2
}

export async function runReview(values: Record<string, unknown>, positionals: string[], cwd: string): Promise<number> {
  const docsDir = typeof values.docs === 'string'
    ? resolve(values.docs)
    : undefined
  const context = createContext({ cwd, docsDir })
  const framework = values.framework as Framework | undefined
  const [{ countBySeverity, formatFindings }, { reviewFiles }] = await Promise.all([import('./review/index.ts'), import('./review/files.ts')])
  const { MAX_REVIEWED_FILES } = await import('./review/files.ts')

  if (values.hook)
    return runReviewHook(context, cwd, framework, docsDir)

  if (positionals.length === 0) {
    console.error('Pass the files, folders or globs to review: maz-ui-mcp review "src/**/*.vue"')
    return 1
  }

  const { reviews, truncated, skipped } = await reviewFiles(positionals, {
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
      skipped,
      files: reviews,
    }, null, 2))
  }
  else {
    for (const review of reviews.filter(entry => entry.findings.length > 0)) console.log(`${formatFindings(review.findings, review.file)}\n`)

    console.log(`${reviews.length} file(s) reviewed against maz-ui ${context.knowledge.version}: ${totals.error} error(s), ${totals.warning} warning(s), ${totals.info} info.`)

    if (truncated)
      console.error(`Warning: ${skipped} more file(s) were NOT reviewed (limit of ${MAX_REVIEWED_FILES} files per run). Review them by batches: pass narrower paths (a sub-folder or a glob per run, e.g. "src/components" then "src/pages").`)
  }

  const maxWarnings = values['max-warnings'] === undefined
    ? Number.POSITIVE_INFINITY
    : Number(values['max-warnings'])

  return totals.error > 0 || totals.warning > maxWarnings
    ? 1
    : 0
}

async function runColors(values: { colors?: string, steps?: string }, [preset]: string[], cwd: string): Promise<number> {
  const [{ readProjectTheme }, { BUNDLED_PRESETS, renderEffectiveColors }] = await Promise.all([import('./project/theme.ts'), import('./project/resolved-theme.ts')])
  const list = (value?: string): string[] | undefined => value?.split(',').map(item => item.trim()).filter(Boolean)

  if (preset && !Object.hasOwn(BUNDLED_PRESETS, preset)) {
    console.error(`Unknown preset "${preset}": ${Object.keys(BUNDLED_PRESETS).join(', ')}.`)
    return 1
  }

  const theme = preset
    ? undefined
    : readProjectTheme(cwd)

  console.log(renderEffectiveColors(theme?.presets ?? [], {
    preset: preset as keyof typeof BUNDLED_PRESETS | undefined,
    usage: theme?.usage,
    colors: list(values.colors),
    steps: list(values.steps) as ColorScaleStep[] | undefined,
  }))
  return 0
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
      'no-hooks': { type: 'boolean' },
      'dry-run': { type: 'boolean' },
      'remove': { type: 'boolean' },
      'min-severity': { type: 'string' },
      'framework': { type: 'string' },
      'format': { type: 'string' },
      'max-warnings': { type: 'string' },
      'hook': { type: 'boolean' },
      'colors': { type: 'string' },
      'steps': { type: 'string' },
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
    case 'doctor':
      return runDoctor(cwd)
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
    case 'colors':
      return runColors(values, rest, cwd)
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
