#!/usr/bin/env node
/**
 * Starts the maz-ui MCP server: the @maz-ui/mcp installed in the project (no download, the version of its lockfile),
 * else `npx -y @maz-ui/mcp@latest`.
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

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

const installed = findUp(process.cwd(), 'node_modules/@maz-ui/mcp/bin/maz-ui-mcp.mjs')

if (installed) {
  await import(pathToFileURL(installed).href)
}
else {
  // eslint-disable-next-line sonarjs/no-os-command-from-path -- the npx of the user, like the command of any MCP config
  const child = spawn('npx', ['-y', '@maz-ui/mcp@latest'], { stdio: 'inherit', shell: process.platform === 'win32' })

  child.on('exit', code => process.exit(code ?? 0))

  for (const signal of ['SIGINT', 'SIGTERM'])
    process.on(signal, () => child.kill(signal))
}
