#!/usr/bin/env node
/**
 * PostToolUse, Stop and SubagentStop hook: reviews the file Claude just edited, or the files changed in the task,
 * with `maz-ui-mcp review --hook`.
 * Exit code 2 sends the findings back to Claude, which fixes them.
 * Files outside of a project that installs maz-ui are skipped without spawning anything. maz-ui is looked for from
 * each file: in a pnpm monorepo, the session starts at the root and maz-ui is only installed in the apps.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'

const REVIEWABLE = /\.(?:vue|[cm]?[jt]sx?|css|scss|pcss|postcss)$/
const IGNORED = /[\\/](?:node_modules|dist|\.nuxt|\.output)[\\/]/
const MAZ_UI = 'node_modules/maz-ui/package.json'
const MCP_BIN = 'node_modules/@maz-ui/mcp/bin/maz-ui-mcp.mjs'

function findUp(start, relativePath) {
  let directory = start

  for (;;) {
    const candidate = join(directory, relativePath)

    if (existsSync(candidate))
      return candidate

    const parent = dirname(directory)

    if (parent === directory)
      return undefined

    directory = parent
  }
}

function isReviewable(file) {
  return REVIEWABLE.test(file) && !IGNORED.test(file)
}

/** Files created or modified in the git repository of the session (staged, unstaged and untracked) */
function changedFiles(cwd) {
  try {
    // eslint-disable-next-line sonarjs/no-os-command-from-path -- the git of the user, run in its own project
    const git = args => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    const root = git(['rev-parse', '--show-toplevel']).trim()
    const entries = git(['status', '--porcelain', '-z', '--untracked-files=all']).split('\0')
    const files = []

    for (let index = 0; index < entries.length; index++) {
      const entry = entries[index]
      const status = entry.slice(0, 2)

      // a rename is followed by its former path
      if (status.includes('R') || status.includes('C'))
        index++

      if (entry.length > 3 && !status.includes('D'))
        files.push(join(root, entry.slice(3)))
    }

    return files
  }
  catch {
    return []
  }
}

const input = readFileSync(0, 'utf8')
const { tool_input: toolInput, cwd = process.cwd(), hook_event_name: event, stop_hook_active: stopHookActive } = JSON.parse(input || '{}')
// At the end of a task, the command reviews the files changed in git (written by Edit, or by Bash)
const isStop = event === 'Stop' || event === 'SubagentStop'

if (isStop && stopHookActive)
  process.exit(0)

const files = isStop
  ? changedFiles(cwd)
  : [toolInput?.file_path].filter(Boolean).map(file => resolve(cwd, file))
const mazUi = files.filter(isReviewable).map(file => findUp(dirname(file), MAZ_UI)).find(Boolean)

if (!mazUi)
  process.exit(0)

// The @maz-ui/mcp of the app that uses maz-ui, else of the session folder
const installed = findUp(dirname(dirname(dirname(mazUi))), MCP_BIN) ?? findUp(cwd, MCP_BIN)
const [command, args] = installed
  ? [
      process.execPath,
      [installed, 'review', '--hook'],
    ]
  : [
      'npx',
      [
        '-y',
        '@maz-ui/mcp@latest',
        'review',
        '--hook',
      ],
    ]

const result = spawnSync(command, args, {
  input,
  cwd,
  encoding: 'utf8',
  shell: process.platform === 'win32',
})

if (result.status === 2) {
  process.stderr.write(result.stderr)
  process.exit(2)
}

process.exit(0)
