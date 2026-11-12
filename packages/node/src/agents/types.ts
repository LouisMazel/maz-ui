/**
 * AI coding agents supported by `setupAgents`.
 *
 * - `claude`: Claude Code rule (`.claude/rules/<tool>.md`) and MCP server (`.mcp.json`)
 * - `agents-md`: section in `AGENTS.md` (Codex, Cursor, Copilot, Windsurf, Zed, Gemini...)
 * - `cursor`: MCP server in `.cursor/mcp.json` (rules come from `AGENTS.md`)
 * - `vscode`: MCP server in `.vscode/mcp.json` for GitHub Copilot (rules come from `AGENTS.md`)
 * - `gemini`: MCP server in `.gemini/settings.json` for Gemini CLI (rules come from `AGENTS.md`, added to its
 *   `context.fileName` with `agents-md`: Gemini CLI only reads `GEMINI.md` by default)
 * - `opencode`: MCP server in `opencode.json`, or the `opencode.jsonc` of the project (rules come from `AGENTS.md`)
 * - `junie`: MCP server in `.junie/mcp/mcp.json` for JetBrains Junie (rules come from `AGENTS.md`)
 * - `windsurf`: MCP server in `.devin/mcp_config.json` for Windsurf and Devin (rules come from `AGENTS.md`)
 * - `warp`: MCP server in `.warp/.mcp.json`, not written with `claude` since Warp also reads `.mcp.json` (rules come from `AGENTS.md`)
 * - `kiro`: MCP server in `.kiro/settings/mcp.json` (rules come from `AGENTS.md`)
 * - `roo`: MCP server in `.roo/mcp.json` for Roo Code (rules come from `AGENTS.md`)
 */

/** The first targets of `setupAgents` */
export const AGENT_TARGETS = [
  'claude',
  'agents-md',
  'cursor',
  'vscode',
  'gemini',
  'opencode',
  'junie',
  'windsurf',
  'warp',
  'kiro',
  'roo',
] as const

export type AgentTarget = typeof AGENT_TARGETS[number]

export interface SetupAgentsOptions<T extends AgentTarget = AgentTarget> {
  /** Root of the project (where `AGENTS.md`, `.claude/`, `.mcp.json` live) */
  rootDir: string
  /** Agents to configure. Default: the agents detected in the project (`detectAgentTargets`) */
  targets?: T[]
  /** Write the rules of the tool (Claude Code rule, `AGENTS.md` section). Default `true` */
  rules?: boolean
  /** Register the MCP server of the tool. Default `true` */
  mcp?: boolean
  /** Compute the changes without writing anything */
  dryRun?: boolean
  /** Remove everything `setupAgents` added */
  remove?: boolean
  /** Folder of the maz-ui agent docs. Default: `agent-docs/` (`docs/` for older versions) of the maz-ui package installed in `rootDir` */
  docsDir?: string
  /**
   * Folder of the app that installs the tool (`maz-ui`) and its MCP package, when it is not `rootDir`: a Nuxt app of
   * a monorepo whose agents are configured at the workspace root. Default `rootDir`
   */
  appDir?: string
  /** Command used to start the MCP server. Default: `mcpServerCommand(rootDir, mcpVersion, tool)` */
  mcpServer?: McpServerCommand
  /** Version of the MCP package pinned in the `npx -y` command, when the project does not install it. Default: the version installed from `appDir`, else `latest` */
  mcpVersion?: string
  /** Tool whose agents are configured. Default: maz-ui (`MAZ_UI_AGENTS_TOOL`) */
  tool?: AgentsTool
  /** Rules of the tool, required with another `tool` than maz-ui. Default: the maz-ui agent docs of `docsDir` */
  agentDocs?: AgentDocs
  /**
   * Scope of the Claude Code rule, written as a `paths:` frontmatter so that Claude Code only loads it
   * when it reads or edits a matching file, instead of at every session:
   * - `'auto'` (default): the files of the workspaces whose `package.json` depends on one of `tool.packages`
   *   (e.g. `apps/pwa/**\/*.vue`), else the files of the project. No scope when the tool declares no `packages`
   * - `'all'`: no scope, the rule is always loaded
   * - globs, relative to `rootDir`: used as is
   */
  paths?: 'auto' | 'all' | string[]
}

export interface McpServerCommand {
  command: string
  args: string[]
}

export type SetupAgentsAction = 'create' | 'update' | 'remove' | 'unchanged' | 'skip'

export interface SetupAgentsChange {
  /** Path relative to `rootDir` */
  file: string
  action: SetupAgentsAction
  reason?: string
}

export interface SetupAgentsResult<T extends AgentTarget = AgentTarget> {
  targets: T[]
  version: string
  changes: SetupAgentsChange[]
  /** Command registered in the MCP config files */
  mcpServer: McpServerCommand
  /** `false` when the server runs through `npx -y` because the project does not install the MCP package */
  localMcpServer: boolean
  /** Globs the Claude Code rule is scoped to (`paths:` frontmatter). `undefined`: the rule is always loaded, or not written */
  claudeRulePaths?: string[]
}

/**
 * A tool whose AI agents are configured by `setupAgents`: maz-ui by default,
 * or another package that ships its own MCP server and rules.
 */
export interface AgentsTool {
  /** Name of the tool: key of its MCP server, `.claude/rules/<name>.md` and markers of the generated content */
  name: string
  /** Package that ships the MCP server */
  mcpPackage: string
  /** Bin of `mcpPackage` that starts the MCP server */
  mcpBin: string
  /** Arguments of `mcpBin` that start the MCP server (e.g. `['mcp']`). Default `[]` */
  mcpArgs?: string[]
  /** What generates the rules, written in their header (markdown, e.g. `` `npx relizy mcp init` ``) */
  generatedBy: string
  /** Marker of the generated content, written in its header and used to recognize the files the tool owns. Default `Managed by <name>` */
  marker?: string
  /**
   * Line written under the title of the rules, `false` to write none.
   * Default: `> These rules match the installed <name>.`
   * Keep the version out of the note: a managed file is only rewritten when its content changes, a note that
   * contains the version would rewrite it at every release of the tool.
   */
  versionNote?: ((version: string) => string) | false
  /**
   * Packages (or bins) of former MCP servers of the tool: an entry of the MCP config files that references one of
   * them, when the tool has no entry yet, is replaced by the entry of the tool. Default: none
   */
  legacyMcpPackages?: string[]
  /**
   * Packages whose presence in the `dependencies`, `devDependencies`, `peerDependencies` or `optionalDependencies`
   * of a `package.json` ties the files of its project to the tool (e.g. `['maz-ui', '@maz-ui/themes']`). Used by
   * the `'auto'` scope of the Claude Code rule. Default: none, the rule is always loaded
   */
  packages?: string[]
  /**
   * Files of a project the rule applies to, relative to its folder. Default `['**\/*']` (the whole project).
   * With `packages`, applied to each workspace that depends on one of them
   */
  ruleGlobs?: string[]
}

export interface AgentDocs {
  directory: string
  /** Installed version of the tool: written in the header of the rules only when they change, so it is the version that last changed them */
  version: string
  claudeRule: string
  agentsMdSection: string
}
