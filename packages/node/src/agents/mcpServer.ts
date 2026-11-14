import type { PackageManager } from '../project'
import type { AgentsTool, McpServerCommand } from './types'
import { detectPackageManager, readPackageJson } from '../project'
import { MAZ_UI_AGENTS_TOOL } from './tool'
import { escapeRegExp } from './utils'

/** `true` when the `package.json` of the project declares the MCP package of the tool (`@maz-ui/mcp` by default) */
export function installsMcpPackage(rootDir: string, tool: AgentsTool = MAZ_UI_AGENTS_TOOL): boolean {
  const pkg = readPackageJson(rootDir)

  return ['dependencies', 'devDependencies', 'optionalDependencies'].some(field => (pkg?.[field] as Record<string, string> | undefined)?.[tool.mcpPackage] !== undefined)
}

/** Commands starting the MCP server installed in a project, by package manager */
function localMcpCommands(tool: AgentsTool): Record<PackageManager, McpServerCommand> {
  const bin = [
    tool.mcpBin,
    ...(tool.mcpArgs ?? []),
  ]

  return {
    pnpm: {
      command: 'pnpm',
      args: ['exec', ...bin],
    },
    yarn: {
      command: 'yarn',
      args: ['run', ...bin],
    },
    bun: {
      command: 'bun',
      args: ['x', '--no-install', ...bin],
    },
    npm: {
      command: 'npx',
      args: ['--no-install', ...bin],
    },
  }
}

/**
 * Command of the MCP server of a tool (maz-ui by default) for a project. When
 * the project installs its package, the package manager starts the installed
 * version in about a second, at the version of the lockfile. Otherwise
 * `npx -y` downloads it, pinned to `version`: a dist-tag (`latest`) makes npx
 * query the registry at every start, which can exceed the start timeout of the
 * agents behind a slow registry.
 */
export function mcpServerCommand(rootDir: string, version = 'latest', tool: AgentsTool = MAZ_UI_AGENTS_TOOL): McpServerCommand {
  return installsMcpPackage(rootDir, tool)
    ? localMcpCommands(tool)[detectPackageManager(rootDir)]
    : {
        command: 'npx',
        args: [
          '-y',
          `${tool.mcpPackage}@${version}`,
          ...(tool.mcpArgs ?? []),
        ],
      }
}

/** Version pinned in a `npx -y <package>@<version>` command */
export function pinnedMcpVersion(server: McpServerCommand, tool: AgentsTool): string | undefined {
  const pinned = new RegExp(`^${escapeRegExp(tool.mcpPackage)}@(\\d\\S*)$`)

  return server.args.map(arg => pinned.exec(arg)?.[1]).find(Boolean)
}

/**
 * A command `setupAgents` generates: it may be replaced by a better one. A
 * command written by hand (`--docs`, another runner...) is kept.
 */
export function isGeneratedMcpCommand(server: Partial<McpServerCommand>, tool: AgentsTool): server is McpServerCommand {
  const command = [
    server.command,
    ...(Array.isArray(server.args)
      ? server.args
      : []),
  ].join(' ')
  const args = (tool.mcpArgs ?? []).map(arg => ` ${escapeRegExp(arg)}`).join('')

  return new RegExp(`^npx -y ${escapeRegExp(tool.mcpPackage)}(?:@\\S+)?${args}$`).test(command)
    || Object.values(localMcpCommands(tool)).some(local => command === [local.command, ...local.args].join(' '))
}
