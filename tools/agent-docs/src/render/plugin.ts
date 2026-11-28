import type { OutputFile } from '../types.ts'

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/** The launcher of the MCP server, the source of the command of `.mcp.json` */
export const PLUGIN_LAUNCHER = 'scripts/start-server.mjs'

/**
 * `.mcp.json` of the plugin: the launcher runs inline (`node -e`), Codex does not expand `${CLAUDE_PLUGIN_ROOT}`
 * in the MCP config of a plugin. Claude Code and Codex start the server in the folder of the project.
 */
export function renderPluginMcpConfig(launcher: string): string {
  // Claude Code would replace it with the value of the variable
  if (launcher.includes('${'))
    throw new Error(`${PLUGIN_LAUNCHER} must not contain \`\${\``)

  return `${JSON.stringify({
    mcpServers: {
      'maz-ui': {
        type: 'stdio',
        command: 'node',
        args: ['--input-type=module', '-e', launcher],
      },
    },
  }, null, 2)}\n`
}

/** The generated files of the plugin, other than the skill */
export function renderPluginFiles(pluginDir: string): OutputFile[] {
  return [
    {
      path: '.mcp.json',
      content: renderPluginMcpConfig(readFileSync(join(pluginDir, PLUGIN_LAUNCHER), 'utf8')),
    },
  ]
}
