#!/usr/bin/env node
/**
 * SessionStart and SubagentStart hook: adds the maz-ui rules and the ecosystem by need to the context, read from the
 * installed maz-ui (version matched). A skill is only loaded when the agent invokes it: this context is always there,
 * also after a `/clear` or a compaction, and in the subagents that write code.
 * Nothing is added outside of a project that installs maz-ui, nor when the project already loads the rules at each
 * session (an unscoped `.claude/rules/maz-ui.md`, or the maz-ui section of `AGENTS.md` imported by `CLAUDE.md`).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'

const MAZ_UI = 'node_modules/maz-ui'
/** Hooks inject 10,000 characters at most, the header included */
const MAX_CONTEXT = 9800
/** Read-only agents do not write code, the maz-ui editor of the plugin preloads the skill */
const SKIPPED_AGENTS = new Set(['Explore', 'Plan', 'claude-code-guide', 'statusline-setup', 'maz-ui-editor', 'maz-ui:maz-ui-editor'])
const SKIPPED_FOLDERS = new Set(['node_modules', 'dist', 'build', 'coverage'])

function findUp(start, relativePath) {
  for (let directory = start; ; directory = dirname(directory)) {
    if (existsSync(join(directory, relativePath, 'package.json')))
      return directory

    if (dirname(directory) === directory)
      return undefined
  }
}

function subfolders(directory) {
  try {
    return readdirSync(directory, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.') && !SKIPPED_FOLDERS.has(entry.name))
      .map(entry => join(directory, entry.name))
  }
  catch {
    return []
  }
}

/** The root of a monorepo: pnpm, npm, yarn or bun workspaces, Nx, Turborepo, Lerna or Rush */
function isWorkspaceRoot(cwd) {
  if (['pnpm-workspace.yaml', 'nx.json', 'turbo.json', 'lerna.json', 'rush.json'].some(file => existsSync(join(cwd, file))))
    return true

  try {
    return JSON.parse(read(join(cwd, 'package.json')) ?? '{}').workspaces !== undefined
  }
  catch {
    return false
  }
}

/** The projects that install maz-ui: the folder of the session, else the apps of a monorepo (two levels down: `apps/web`) */
function mazUiProjects(cwd) {
  const project = findUp(cwd, MAZ_UI)

  if (project)
    return [project]

  if (!isWorkspaceRoot(cwd))
    return []

  const first = subfolders(cwd)

  return [...first, ...first.flatMap(subfolders)].filter(directory => existsSync(join(directory, MAZ_UI, 'package.json')))
}

function read(file) {
  try {
    return readFileSync(file, 'utf8')
  }
  catch {
    return undefined
  }
}

/** The project already loads the rules at each session */
function loadsRules(cwd) {
  const rule = read(join(cwd, '.claude/rules/maz-ui.md'))

  if (rule !== undefined && !/^---\n[\s\S]*?^paths:/m.test(rule))
    return true

  const claudeMd = read(join(cwd, 'CLAUDE.md')) ?? ''

  return claudeMd.includes('<!-- BEGIN:maz-ui -->')
    || (/^@AGENTS\.md\s*$/m.test(claudeMd) && (read(join(cwd, 'AGENTS.md')) ?? '').includes('<!-- BEGIN:maz-ui -->'))
}

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
const cwd = input.cwd ?? process.cwd()
const event = input.hook_event_name ?? 'SessionStart'

if (SKIPPED_AGENTS.has(input.agent_type) || loadsRules(cwd))
  process.exit(0)

const projects = mazUiProjects(cwd)

if (projects.length === 0)
  process.exit(0)

const docs = join(projects[0], MAZ_UI)
const { version } = JSON.parse(read(join(docs, 'package.json')) ?? '{}')
const where = projects.map(project => `\`${relative(cwd, project) || '.'}\``).join(', ')
const header = `maz-ui ${version ?? ''} is installed in ${where}. Its rules, from its docs (maz-ui Claude Code plugin):\n\n`
const rules = [read(join(docs, 'agent-docs/agents/session-context.md')), read(join(docs, 'agent-docs/agents/claude-rule.md'))]
  .find(content => content && header.length + content.length <= MAX_CONTEXT)
  ?? 'This project uses maz-ui: reuse its components, composables, directives and helpers instead of writing them by hand. Invoke the `maz-ui` skill and search the need with the `search_docs` tool of the maz-ui MCP server before writing UI code, then run `review_code` on the changed files.\n'

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: event,
    additionalContext: `${header}${rules}`,
  },
}))
