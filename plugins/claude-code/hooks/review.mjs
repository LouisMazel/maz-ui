#!/usr/bin/env node
/**
 * PostToolUse hook: reviews the file Claude just edited with `maz-ui-mcp review --hook`.
 * Exit code 2 sends the findings back to Claude, which fixes them.
 * Projects without maz-ui and non reviewable files are skipped without spawning anything.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const REVIEWABLE = /\.(?:vue|[cm]?[jt]sx?|css|scss|pcss|postcss)$/

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

const input = readFileSync(0, 'utf8')
const { tool_input: toolInput, cwd = process.cwd() } = JSON.parse(input || '{}')
const file = toolInput?.file_path

if (!file || !REVIEWABLE.test(file) || /[\\/](?:node_modules|dist|\.nuxt|\.output)[\\/]/.test(file))
  process.exit(0)

if (!findUp(dirname(file), 'node_modules/maz-ui/package.json') && !findUp(cwd, 'node_modules/maz-ui/package.json'))
  process.exit(0)

const localBin = findUp(cwd, 'node_modules/.bin/maz-ui-mcp')
const [command, args] = localBin
  ? [localBin, ['review', '--hook']]
  : ['npx', ['-y', '@maz-ui/mcp@latest', 'review', '--hook']]

const result = spawnSync(command, args, { input, cwd, encoding: 'utf8', shell: process.platform === 'win32' })

if (result.status === 2) {
  process.stderr.write(result.stderr)
  process.exit(2)
}

process.exit(0)
