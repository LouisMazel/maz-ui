import type { FormattingOptions, ParseError } from 'jsonc-parser'

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, posix, relative, sep } from 'node:path'
import { applyEdits, modify, parse } from 'jsonc-parser'

/**
 * AI coding agents supported by `setupAgents`.
 *
 * - `claude`: Claude Code rule (`.claude/rules/<tool>.md`) and MCP server (`.mcp.json`)
 * - `agents-md`: section in `AGENTS.md` (Codex, Cursor, Copilot, Windsurf, Zed, Gemini...)
 * - `cursor`: MCP server in `.cursor/mcp.json` (rules come from `AGENTS.md`)
 * - `vscode`: MCP server in `.vscode/mcp.json` for GitHub Copilot (rules come from `AGENTS.md`)
 */
export type AgentTarget = 'claude' | 'agents-md' | 'cursor' | 'vscode'

export const AGENT_TARGETS: AgentTarget[] = [
  'claude',
  'agents-md',
  'cursor',
  'vscode',
]

export interface SetupAgentsOptions {
  /** Root of the project (where `AGENTS.md`, `.claude/`, `.mcp.json` live) */
  rootDir: string
  /** Agents to configure. Default: the agents detected in the project */
  targets?: AgentTarget[]
  /** Write the rules of the tool (Claude Code rule, `AGENTS.md` section). Default `true` */
  rules?: boolean
  /** Register the MCP server of the tool. Default `true` */
  mcp?: boolean
  /** Compute the changes without writing anything */
  dryRun?: boolean
  /** Remove everything `setupAgents` added */
  remove?: boolean
  /** Folder of the maz-ui agent docs. Default: `docs/` of the maz-ui package installed in `rootDir` */
  docsDir?: string
  /** Command used to start the MCP server. Default: `mcpServerCommand(rootDir, mcpVersion, tool)` */
  mcpServer?: McpServerCommand
  /** Version of the MCP package pinned in the `npx -y` command, when the project does not install it. Default `latest` */
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

export interface SetupAgentsResult {
  targets: AgentTarget[]
  version: string
  changes: SetupAgentsChange[]
  /** Command registered in the MCP config files */
  mcpServer: McpServerCommand
  /** `false` when the server runs through `npx -y` because the project does not install the MCP package */
  localMcpServer: boolean
  /** Globs the Claude Code rule is scoped to (`paths:` frontmatter). `undefined`: the rule is always loaded, or not written */
  claudeRulePaths?: string[]
}

export const MANAGED_MARKER = 'Managed by maz-ui'
export const AGENTS_MD_BEGIN = '<!-- BEGIN:maz-ui -->'
export const AGENTS_MD_END = '<!-- END:maz-ui -->'
export const MCP_SERVER_NAME = 'maz-ui'
export const DEFAULT_MCP_SERVER: McpServerCommand = {
  command: 'npx',
  args: ['-y', '@maz-ui/mcp@latest'],
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
   * Default: `> <name> <version> is installed: these rules match this version.`
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

export const MAZ_UI_AGENTS_TOOL: AgentsTool = {
  name: 'maz-ui',
  mcpPackage: '@maz-ui/mcp',
  mcpBin: 'maz-ui-mcp',
  generatedBy: '`npx @maz-ui/mcp init` (or the `mazUi.agents` Nuxt option)',
  versionNote: version => `> maz-ui ${version} is installed: these rules and the docs in \`node_modules/maz-ui/docs\` match this version.`,
  packages: [
    'maz-ui',
    '@maz-ui/nuxt',
    '@maz-ui/themes',
    '@maz-ui/icons',
    '@maz-ui/utils',
    '@maz-ui/translations',
  ],
  ruleGlobs: ['**/*.{vue,ts,tsx,css,scss}'],
}

export type PackageManager = 'pnpm' | 'yarn' | 'bun' | 'npm'

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Values derived from a tool: markers, files and patterns of its generated content */
interface ToolSetup {
  tool: AgentsTool
  marker: string
  agentsMdBegin: string
  agentsMdEnd: string
  ruleFile: string
  managedHeader: RegExp
  managedVersion: RegExp
}

const toolSetups = new WeakMap<AgentsTool, ToolSetup>()

function resolveTool(tool: AgentsTool): ToolSetup {
  let setup = toolSetups.get(tool)

  if (!setup) {
    const marker = tool.marker ?? `Managed by ${tool.name}`

    setup = {
      tool,
      marker,
      agentsMdBegin: `<!-- BEGIN:${tool.name} -->`,
      agentsMdEnd: `<!-- END:${tool.name} -->`,
      ruleFile: `.claude/rules/${tool.name}.md`,
      managedHeader: new RegExp(`<!-- ${escapeRegExp(marker)}[^\\n]*?-->`),
      managedVersion: new RegExp(`${escapeRegExp(marker)} (\\d[^\\s:]*)`),
    }
    toolSetups.set(tool, setup)
  }

  return setup
}

function readPackageJson(rootDir: string): Record<string, unknown> | undefined {
  try {
    return JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8')) as Record<string, unknown>
  }
  catch {
    return undefined
  }
}

/** `true` when the `package.json` of the project declares the MCP package of the tool (`@maz-ui/mcp` by default) */
export function installsMcpPackage(rootDir: string, tool: AgentsTool = MAZ_UI_AGENTS_TOOL): boolean {
  const pkg = readPackageJson(rootDir)

  return ['dependencies', 'devDependencies', 'optionalDependencies'].some(field => (pkg?.[field] as Record<string, string> | undefined)?.[tool.mcpPackage] !== undefined)
}

/** Package manager of a project: the `packageManager` field, else its lockfile */
export function detectPackageManager(rootDir: string): PackageManager {
  const declared = String(readPackageJson(rootDir)?.packageManager ?? '').split('@')[0]

  if (['pnpm', 'yarn', 'bun', 'npm'].includes(declared))
    return declared as PackageManager

  const lockfiles: [string, PackageManager][] = [
    ['pnpm-lock.yaml', 'pnpm'],
    ['yarn.lock', 'yarn'],
    ['bun.lock', 'bun'],
    ['bun.lockb', 'bun'],
  ]

  return lockfiles.find(([file]) => existsSync(join(rootDir, file)))?.[1] ?? 'npm'
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
function pinnedMcpVersion(server: McpServerCommand, tool: AgentsTool): string | undefined {
  const pinned = new RegExp(`^${escapeRegExp(tool.mcpPackage)}@(\\d\\S*)$`)

  return server.args.map(arg => pinned.exec(arg)?.[1]).find(Boolean)
}

/**
 * A command `setupAgents` generates: it may be replaced by a better one. A
 * command written by hand (`--docs`, another runner...) is kept.
 */
function isGeneratedMcpCommand(server: Partial<McpServerCommand>, tool: AgentsTool): server is McpServerCommand {
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

const CLAUDE_MEMORY_FILES = ['CLAUDE.md', '.claude/CLAUDE.md', 'CLAUDE.local.md']

/** Adds the installed version under the title of a generated rule */
function withVersion(content: string, version: string, tool: AgentsTool): string {
  if (tool.versionNote === false)
    return content

  const note = tool.versionNote?.(version) ?? `> ${tool.name} ${version} is installed: these rules match this version.`

  return content.replace(/^(#{1,2} .+)\n/, (_, title: string) => `${title}\n\n${note}\n`)
}

/** Checksum of generated rules, insensitive to the whitespace a formatter changes (table padding, wrapping, blank lines) */
function checksum(body: string): string {
  return createHash('sha256').update(body.replaceAll(/\s+/g, '')).digest('hex').slice(0, 12)
}

/** Checksum of a frontmatter and a body: the quotes of the frontmatter are left out, a formatter can change them */
function ruleChecksum(frontmatter: string, body: string): string {
  return checksum(frontmatter.replaceAll(/["']/g, '') + body)
}

/**
 * Generated rules: the frontmatter (it must be the first thing of the file), a header with the version of the tool
 * and the checksum of the frontmatter and of the body, then the body
 */
function managedContent(version: string, body: string, setup: ToolSetup, frontmatter = ''): string {
  const recorded = ruleChecksum(frontmatter, body)

  return `${frontmatter}<!-- ${setup.marker} ${version} (sha256:${recorded}): generated by ${setup.tool.generatedBy}. Do not edit: edited rules are no longer updated. Write your own rules elsewhere. -->\n\n${body}`
}

/**
 * `true` when generated rules were edited by hand since they were written:
 * they are kept, a newer version of the rules would overwrite the edits.
 * The checksum covers what follows the managed header, and also what precedes
 * it (the `paths:` frontmatter), so an edit of the frontmatter is kept too. A
 * checksum of the body alone is still accepted: rules written without
 * frontmatter (header on the first line), or before the frontmatter was part
 * of the checksum, are checked against it.
 */
export function isEditedManagedContent(content: string | undefined, tool: AgentsTool = MAZ_UI_AGENTS_TOOL): boolean {
  const header = content === undefined
    ? null
    : resolveTool(tool).managedHeader.exec(content)
  const recorded = header
    ? /\(sha256:([\da-f]+)\)/.exec(header[0])?.[1]
    : undefined

  if (header === null || recorded === undefined)
    return false

  const before = (content as string).slice(0, header.index)
  const after = (content as string).slice(header.index + header[0].length)

  return recorded !== checksum(after) && recorded !== ruleChecksum(before, after)
}

/** Detects the AI agents configured in a project */
export function detectAgentTargets(rootDir: string): AgentTarget[] {
  const has = (path: string): boolean => existsSync(join(rootDir, path))
  const targets = new Set<AgentTarget>()

  if (has('.claude') || CLAUDE_MEMORY_FILES.some(has) || has('.mcp.json'))
    targets.add('claude')

  if (has('.cursor') || has('.cursorrules'))
    targets.add('cursor')

  if (has('.vscode/mcp.json') || has('.github/copilot-instructions.md') || has('.github/instructions'))
    targets.add('vscode')

  if (has('AGENTS.md') || targets.has('cursor') || targets.has('vscode') || has('.codex') || has('.windsurf') || has('.devin') || has('.windsurfrules') || has('GEMINI.md'))
    targets.add('agents-md')

  return AGENT_TARGETS.filter(target => targets.has(target))
}

export interface AgentDocs {
  directory: string
  version: string
  claudeRule: string
  agentsMdSection: string
}

/**
 * Finds `node_modules/<name>` from a directory up to the filesystem root, like
 * the Node resolution but without the global folders (`NODE_PATH`), so only a
 * package installed for the project is found.
 */
export function findInstalledPackage(fromDir: string, name: string): string | undefined {
  let directory = fromDir

  for (;;) {
    const candidate = join(directory, 'node_modules', name)

    if (existsSync(join(candidate, 'package.json')))
      return candidate

    const parent = dirname(directory)

    if (parent === directory)
      return undefined

    directory = parent
  }
}

/** Version of an installed package, read from its `package.json` */
export function readPackageVersion(packageDir: string): string | undefined {
  const file = join(packageDir, 'package.json')

  return existsSync(file)
    ? (JSON.parse(readFileSync(file, 'utf8')) as { version?: string }).version
    : undefined
}

const DEFAULT_WORKSPACES = ['apps/*', 'packages/*']
/** Depth explored below the fixed part of a `**` pattern */
const MAX_GLOBSTAR_DEPTH = 3

/**
 * Workspace patterns of a monorepo: the `packages` of `pnpm-workspace.yaml`,
 * else the `workspaces` of `package.json` (npm, yarn, bun), else `apps/*` and
 * `packages/*`. Negated patterns are ignored.
 */
export function readWorkspacePatterns(rootDir: string): string[] {
  const patterns = readDeclaredWorkspacePatterns(rootDir).filter(pattern => !pattern.startsWith('!'))

  return patterns.length > 0
    ? patterns
    : DEFAULT_WORKSPACES
}

/** Patterns declared by the monorepo, negated ones (`!apps/legacy`) included */
function readDeclaredWorkspacePatterns(rootDir: string): string[] {
  const pnpmWorkspace = join(rootDir, 'pnpm-workspace.yaml')
  const workspaces = readPackageJson(rootDir)?.workspaces as string[] | { packages?: string[] } | undefined
  const declared = existsSync(pnpmWorkspace)
    ? readPnpmWorkspacePackages(readFileSync(pnpmWorkspace, 'utf8'))
    : (Array.isArray(workspaces)
        ? workspaces
        : workspaces?.packages) ?? []

  return declared.map(pattern => pattern.replace(/^(!?)\.\//, '$1').replace(/\/$/, ''))
}

/** Items of the `packages` list of a `pnpm-workspace.yaml` */
function readPnpmWorkspacePackages(content: string): string[] {
  const patterns: string[] = []
  let inPackages = false

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#'))
      continue

    if (line === line.trimStart())
      inPackages = trimmed === 'packages:'
    else if (inPackages && trimmed.startsWith('-'))
      patterns.push(trimmed.slice(1).split('#')[0].trim().replaceAll(/^["']|["']$/g, ''))
  }

  return patterns
}

function globToRegExp(pattern: string): RegExp {
  const source = pattern
    .split('/')
    .map(segment => segment === '**'
      ? '.*'
      : segment.replaceAll(/[.+^${}()|[\]\\]/g, '\\$&').replaceAll('*', '[^/]*').replaceAll('?', '[^/]'))
    .join('/')

  return new RegExp(`^${source.replaceAll('/.*', '(?:/.*)?')}$`)
}

/** Folders of the workspaces of a monorepo, in the order of the patterns. Only the fixed part of each pattern is read (`apps/*` reads `apps`) */
export function findWorkspaceDirs(rootDir: string): string[] {
  const folders = new Set<string>()

  for (const pattern of readWorkspacePatterns(rootDir)) {
    const segments = pattern.split('/')
    const firstGlob = segments.findIndex(segment => /[*?[{]/.test(segment))
    const base = (firstGlob === -1
      ? segments
      : segments.slice(0, firstGlob)).join('/')
    const depth = firstGlob === -1
      ? 0
      : segments.includes('**')
        ? MAX_GLOBSTAR_DEPTH
        : segments.length - firstGlob
    const matcher = globToRegExp(pattern)

    const visit = (folder: string, remaining: number): void => {
      if (!existsSync(join(rootDir, folder)))
        return

      if (folder && folder !== '.' && matcher.test(folder))
        folders.add(join(rootDir, folder))

      if (remaining === 0)
        return

      for (const entry of readdirSync(join(rootDir, folder), { withFileTypes: true })) {
        if (entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
          visit(folder
            ? `${folder}/${entry.name}`
            : entry.name, remaining - 1)
        }
      }
    }

    visit(base, depth)
  }

  return [...folders]
}

/**
 * Finds a package installed in a project: in the `node_modules` of the
 * project root and of its workspaces (monorepos without hoisting), then in
 * the parent folders.
 */
export function findProjectPackage(rootDir: string, name: string): string | undefined {
  return [
    rootDir,
    ...findWorkspaceDirs(rootDir),
  ]
    .map(base => join(base, 'node_modules', name))
    .find(candidate => existsSync(join(candidate, 'package.json')))
    ?? findInstalledPackage(rootDir, name)
}

/** Reads the agent files shipped in `maz-ui/docs/agents` */
export function readAgentDocs(rootDir: string, docsDir?: string): AgentDocs {
  let directory = docsDir

  if (!directory) {
    const packageDir = findProjectPackage(rootDir, 'maz-ui')

    if (!packageDir)
      throw new Error(`maz-ui is not installed in ${rootDir}: install it first (\`npm install maz-ui\`).`)

    directory = join(packageDir, 'docs')
  }

  const manifestFile = join(directory, 'manifest.json')
  const claudeRuleFile = join(directory, 'agents/claude-rule.md')
  const agentsMdFile = join(directory, 'agents/agents-md.md')

  if (!existsSync(manifestFile) || !existsSync(claudeRuleFile) || !existsSync(agentsMdFile)) {
    throw new Error(`The installed maz-ui does not ship the agent docs (${directory}): upgrade maz-ui to the latest version.`)
  }

  // The docs are generated before the release bumps the version: the package.json of maz-ui is the source of truth
  const packageVersion = readPackageVersion(dirname(directory))

  return {
    directory,
    version: packageVersion ?? (JSON.parse(readFileSync(manifestFile, 'utf8')) as { version: string }).version,
    claudeRule: readFileSync(claudeRuleFile, 'utf8').trim(),
    agentsMdSection: readFileSync(agentsMdFile, 'utf8').trim(),
  }
}

/**
 * Writes a temporary file then renames it: a concurrent reader (several Nuxt
 * apps of a monorepo starting together) sees the old or the new file, never a
 * truncated one.
 */
export function writeFileAtomic(path: string, content: string): void {
  const temporary = join(dirname(path), `.${basename(path)}.${process.pid}.${Date.now()}.tmp`)

  mkdirSync(dirname(path), { recursive: true })

  try {
    writeFileSync(temporary, content)
    renameSync(temporary, path)
  }
  catch (error) {
    rmSync(temporary, { force: true })
    throw error
  }
}

function parseVersion(version: string): { core: number[], prerelease: string[] } {
  const [core, ...prerelease] = version.replace(/^v/, '').split('+')[0].split('-')

  return {
    core: core.split('.').map(part => Number.parseInt(part, 10) || 0),
    prerelease: prerelease.join('-').split('.').filter(Boolean),
  }
}

/** Semver order of prerelease identifiers: numeric ones are compared as numbers and come before the others */
function comparePrereleaseIdentifiers(a: string, b: string): number {
  const isNumeric = (value: string): boolean => /^\d+$/.test(value)

  if (isNumeric(a) !== isNumeric(b)) {
    return isNumeric(a)
      ? -1
      : 1
  }

  return isNumeric(a)
    ? Number(a) - Number(b)
    : a.localeCompare(b)
}

/** Compares two semver versions: negative when `a < b`, positive when `a > b`, `0` when equal */
export function compareVersions(a: string, b: string): number {
  const left = parseVersion(a)
  const right = parseVersion(b)

  for (let index = 0; index < 3; index++) {
    const difference = (left.core[index] ?? 0) - (right.core[index] ?? 0)

    if (difference !== 0)
      return difference
  }

  if (left.prerelease.length === 0 || right.prerelease.length === 0)
    return right.prerelease.length - left.prerelease.length

  for (let index = 0; index < Math.min(left.prerelease.length, right.prerelease.length); index++) {
    const difference = comparePrereleaseIdentifiers(left.prerelease[index], right.prerelease[index])

    if (difference !== 0)
      return difference
  }

  return left.prerelease.length - right.prerelease.length
}

/** Version of the tool (maz-ui by default) that generated a managed content, read from its header */
export function readManagedVersion(content: string | undefined, tool: AgentsTool = MAZ_UI_AGENTS_TOOL): string | undefined {
  return content
    ? resolveTool(tool).managedVersion.exec(content)?.[1]
    : undefined
}

/**
 * Rules written by a newer version of the tool are kept: in a monorepo whose
 * apps install different versions, each app would otherwise rewrite them in turn.
 */
function newerManagedVersion(content: string | undefined, version: string, tool: AgentsTool): string | undefined {
  const written = readManagedVersion(content, tool)

  return written && version && compareVersions(written, version) > 0
    ? written
    : undefined
}

function newerVersionReason(written: string, version: string, tool: AgentsTool): string {
  return `written by ${tool.name} ${written}, newer than the installed ${version}: left untouched`
}

class ChangeSet {
  readonly changes: SetupAgentsChange[] = []

  constructor(private readonly rootDir: string, private readonly dryRun: boolean) {}

  private absolute(file: string): string {
    return join(this.rootDir, file)
  }

  read(file: string): string | undefined {
    const path = this.absolute(file)

    return existsSync(path)
      ? readFileSync(path, 'utf8')
      : undefined
  }

  write(file: string, content: string, current: string | undefined, reason?: string): void {
    if (current === content) {
      this.changes.push({ file, action: 'unchanged' })
      return
    }

    this.changes.push({
      file,
      action: current === undefined
        ? 'create'
        : 'update',
      ...(reason
        ? { reason }
        : {}),
    })

    if (!this.dryRun)
      writeFileAtomic(this.absolute(file), content)
  }

  delete(file: string): void {
    this.changes.push({ file, action: 'remove' })

    if (!this.dryRun)
      rmSync(this.absolute(file), { force: true })
  }

  skip(file: string, reason: string): void {
    this.changes.push({ file, action: 'skip', reason })
  }

  unchanged(file: string, reason: string): void {
    this.changes.push({ file, action: 'unchanged', reason })
  }
}

/** A file we generated (or no file): we may overwrite or delete it */
function isOwned(content: string | undefined, setup: ToolSetup): boolean {
  return content === undefined || content.includes(setup.marker)
}

function syncOwnedFile(changes: ChangeSet, file: string, content: string | undefined, version: string, setup: ToolSetup): void {
  const { tool } = setup
  const current = changes.read(file)

  if (!isOwned(current, setup)) {
    changes.skip(file, `file exists and was not generated by ${tool.name}: left untouched`)
    return
  }

  const newer = content === undefined
    ? undefined
    : newerManagedVersion(current, version, tool)

  if (newer) {
    changes.skip(file, newerVersionReason(newer, version, tool))
    return
  }

  if (content !== undefined && isEditedManagedContent(current, tool)) {
    changes.skip(file, `edited since it was generated: left untouched, delete it to get the rules of ${tool.name} ${version}`)
    return
  }

  if (content === undefined) {
    if (current !== undefined)
      changes.delete(file)
    return
  }

  changes.write(file, content, current)
}

function syncAgentsMd(changes: ChangeSet, section: string | undefined, version: string, setup: ToolSetup): void {
  const { tool, agentsMdBegin, agentsMdEnd } = setup
  const file = 'AGENTS.md'
  const current = changes.read(file)
  const begin = current?.indexOf(agentsMdBegin) ?? -1
  const end = current?.indexOf(agentsMdEnd) ?? -1
  const hasBlock = begin !== -1 && end > begin

  if (section === undefined) {
    if (!current || !hasBlock)
      return

    const remaining = `${current.slice(0, begin)}${current.slice(end + agentsMdEnd.length)}`.replace(/\n{3,}/g, '\n\n').trim()

    if (remaining)
      changes.write(file, `${remaining}\n`, current)
    else
      changes.delete(file)
    return
  }

  const block = hasBlock
    ? current?.slice(begin + agentsMdBegin.length, end)
    : undefined
  const newer = newerManagedVersion(block, version, tool)

  if (newer) {
    changes.skip(file, newerVersionReason(newer, version, tool))
    return
  }

  if (isEditedManagedContent(block, tool)) {
    changes.skip(file, `the ${tool.name} section was edited since it was generated: left untouched, delete the section to get the rules of ${tool.name} ${version}`)
    return
  }

  const wrapped = `${agentsMdBegin}\n\n${section}\n\n${agentsMdEnd}`

  if (!current) {
    changes.write(file, `${wrapped}\n`, current)
  }
  else if (hasBlock) {
    changes.write(file, `${current.slice(0, begin)}${wrapped}${current.slice(end + agentsMdEnd.length)}`, current)
  }
  else {
    changes.write(file, `${current.trimEnd()}\n\n${wrapped}\n`, current)
  }
}

interface McpConfigFile {
  file: string
  rootKey: 'mcpServers' | 'servers'
  withType: boolean
}

const MCP_FILES: Record<'claude' | 'cursor' | 'vscode', McpConfigFile> = {
  claude: { file: '.mcp.json', rootKey: 'mcpServers', withType: true },
  cursor: { file: '.cursor/mcp.json', rootKey: 'mcpServers', withType: false },
  vscode: { file: '.vscode/mcp.json', rootKey: 'servers', withType: true },
}

/** An entry that starts the MCP server of the tool, whatever its key and runner */
function referencesToolMcp(server: unknown, tool: AgentsTool): boolean {
  const serialized = JSON.stringify(server)
  const args = isJsonObject(server) && Array.isArray(server.args)
    ? server.args
    : []

  return (serialized.includes(tool.mcpPackage) || serialized.includes(tool.mcpBin))
    && (tool.mcpArgs ?? []).every(arg => args.includes(arg))
}

/** The former package (or bin) of the tool an entry references, from `tool.legacyMcpPackages` */
function findLegacyPackage(server: unknown, tool: AgentsTool): string | undefined {
  const serialized = JSON.stringify(server)

  return tool.legacyMcpPackages?.find(name => serialized.includes(name))
}

function detectFormatting(content: string): FormattingOptions {
  const indent = /^( +|\t)"/m.exec(content)?.[1] ?? '  '

  return {
    insertSpaces: !indent.includes('\t'),
    tabSize: indent.includes('\t')
      ? 1
      : indent.length,
    eol: content.includes('\r\n')
      ? '\r\n'
      : '\n',
  }
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Replaces the command of an existing entry of the MCP server of the tool, its other fields (`env`...) are kept */
function updateMcpCommand(changes: ChangeSet, config: McpConfigFile, [key, entry]: [string, unknown], server: McpServerCommand, tool: AgentsTool): void {
  const current = entry as Partial<McpServerCommand>
  const label = [server.command, ...server.args].join(' ')

  if (current.command === server.command && JSON.stringify(current.args) === JSON.stringify(server.args)) {
    changes.unchanged(config.file, `${tool.name} MCP server already registered as "${key}"`)
    return
  }

  if (!isGeneratedMcpCommand(current, tool)) {
    changes.unchanged(config.file, `"${key}" runs a custom command: left untouched`)
    return
  }

  const pinned = pinnedMcpVersion(current, tool)
  const wanted = pinnedMcpVersion(server, tool)
  const isLocal = !server.args.includes('-y')

  // A pin is only replaced by the installed package or a newer pin: never by `latest`, nor by an older version (monorepos)
  if (pinned && !isLocal && (!wanted || compareVersions(pinned, wanted) >= 0)) {
    changes.unchanged(config.file, `"${key}" runs ${tool.mcpPackage} ${pinned}`)
    return
  }

  const file = changes.read(config.file) as string
  const formatting = detectFormatting(file)
  let content = applyEdits(file, modify(file, [config.rootKey, key, 'command'], server.command, { formattingOptions: formatting }))
  content = applyEdits(content, modify(content, [config.rootKey, key, 'args'], server.args, { formattingOptions: formatting }))

  changes.write(config.file, content, file, `"${key}" now runs ${label}`)
}

function syncMcpConfig(changes: ChangeSet, config: McpConfigFile, server: McpServerCommand, remove: boolean, tool: AgentsTool): void {
  const current = changes.read(config.file)
  const errors: ParseError[] = []
  const parsed: unknown = current === undefined
    ? {}
    : parse(current, errors, { allowTrailingComma: true })

  if (errors.length > 0 || !isJsonObject(parsed) || (parsed[config.rootKey] !== undefined && !isJsonObject(parsed[config.rootKey]))) {
    changes.skip(config.file, 'invalid JSON: left untouched')
    return
  }

  const servers = (parsed[config.rootKey] ?? {}) as Record<string, unknown>
  const existing = Object.entries(servers).find(([, value]) => referencesToolMcp(value, tool))
  const base = current ?? '{}\n'
  const formatting = detectFormatting(base)

  if (remove) {
    if (existing?.[0] === tool.name) {
      const content = applyEdits(base, modify(base, [config.rootKey, tool.name], undefined, { formattingOptions: formatting }))
      const remaining = parse(content) as Record<string, Record<string, unknown>>
      const isEmpty = Object.keys(remaining).length === 1 && Object.keys(remaining[config.rootKey]).length === 0

      if (isEmpty)
        changes.delete(config.file)
      else
        changes.write(config.file, content, current)
    }
    return
  }

  if (existing) {
    updateMcpCommand(changes, config, existing, server, tool)
    return
  }

  const legacy = Object.entries(servers).map(([key, entry]) => [
    key,
    findLegacyPackage(entry, tool),
  ] as const).find(([, name]) => name !== undefined)

  if (legacy) {
    const [key, name] = legacy
    const migrated = applyEdits(base, modify(base, [config.rootKey, key], config.withType
      ? { type: 'stdio', ...server }
      : { ...server }, { formattingOptions: formatting }))

    changes.write(config.file, migrated.endsWith('\n')
      ? migrated
      : `${migrated}\n`, current, `"${key}" migrated from ${name} to ${tool.mcpPackage}`)
    return
  }

  if (servers[tool.name] !== undefined) {
    changes.skip(config.file, `a "${tool.name}" server already exists with another command: left untouched`)
    return
  }

  const value = config.withType
    ? { type: 'stdio', ...server }
    : { ...server }
  const content = applyEdits(base, modify(base, [config.rootKey, tool.name], value, { formattingOptions: formatting }))

  changes.write(config.file, content.endsWith('\n')
    ? content
    : `${content}\n`, current)
}

const DEPENDENCY_FIELDS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
]

/** `true` when the `package.json` of a folder depends on one of the packages */
function dependsOnAny(folder: string, packages: string[]): boolean {
  const pkg = readPackageJson(folder)

  return DEPENDENCY_FIELDS.some(field => packages.some(name => (pkg?.[field] as Record<string, string> | undefined)?.[name] !== undefined))
}

/**
 * Folders (relative to `rootDir`, `''` for the root) whose `package.json` depends on one of the packages: the
 * workspaces of a monorepo, or the root of a single package project. The workspaces excluded by a negated pattern
 * (`!apps/legacy`) are left out, with the folders below them
 */
export function findWorkspacesUsing(rootDir: string, packages: string[]): string[] {
  const excluded = readDeclaredWorkspacePatterns(rootDir)
    .filter(pattern => pattern.startsWith('!'))
    .map(pattern => globToRegExp(`${pattern.slice(1)}/**`))
  const folders = [
    rootDir,
    ...findWorkspaceDirs(rootDir),
  ]
    .map(folder => relative(rootDir, folder).split(sep).join('/'))
    .filter(folder => !excluded.some(matcher => matcher.test(folder)))

  return folders.filter(folder => dependsOnAny(join(rootDir, folder), packages))
}

function isUnscopedGlob(glob: string): boolean {
  return ['**', '**/*', '*', '/**', '/**/*'].includes(glob.trim())
}

/**
 * Globs the Claude Code rule is scoped to, `undefined` when it must always be loaded. The root of the project
 * depending on the tool (single package project), or no dependency found (the tool is used from elsewhere), apply
 * the files of the tool to the whole project, since no folder is more relevant than another.
 */
export function resolveRulePaths(rootDir: string, tool: AgentsTool, option: SetupAgentsOptions['paths'] = 'auto'): string[] | undefined {
  if (option === 'all')
    return undefined

  const explicit = Array.isArray(option)
    ? option.map(glob => glob.trim()).filter(Boolean)
    : []
  const globs = Array.isArray(option)
    ? explicit
    : autoRulePaths(rootDir, tool)

  return globs.length === 0 || globs.some(isUnscopedGlob)
    ? undefined
    : [
        ...new Set(globs),
      ]
}

/** Claude Code expands the braces of `paths` within a budget of 1000 patterns: beyond it the braces match nothing */
const MAX_EXPANDED_PATTERNS = 1000

/** Number of patterns a glob expands to: the alternatives of each `{a,b}` group multiply */
function expandedPatternCount(glob: string): number {
  const groups = glob.replaceAll(/\\./g, '').matchAll(/\{([^{}]*)\}/g)

  return [...groups].reduce((count, [, alternatives]) => count * alternatives.split(',').length, 1)
}

/** Escapes the characters of a folder name that a glob would interpret */
function escapeGlobFolder(folder: string): string {
  return folder.replaceAll(/[[\]{}()*?!]/g, String.raw`\$&`)
}

function autoRulePaths(rootDir: string, tool: AgentsTool): string[] {
  if (!tool.packages || tool.packages.length === 0)
    return []

  const files = tool.ruleGlobs ?? ['**/*']
  const folders = findWorkspacesUsing(rootDir, tool.packages)
  const globsOf = (scopedFolders: string[]): string[] => scopedFolders.flatMap(folder => files.map(glob => posix.join(escapeGlobFolder(folder), glob)))
  const scoped = globsOf(folders.includes('') || folders.length === 0
    ? ['']
    : folders)

  return scoped.reduce((total, glob) => total + expandedPatternCount(glob), 0) > MAX_EXPANDED_PATTERNS
    ? globsOf([''])
    : scoped
}

/** `paths:` frontmatter of a Claude Code rule. It must be the first thing of the file, before the managed header */
function claudeFrontmatter(globs: string[] | undefined): string {
  if (!globs || globs.length === 0)
    return ''

  const items = globs.map(glob => [
    '  -',
    JSON.stringify(glob),
  ].join(' ')).join('\n')

  return `---\npaths:\n${items}\n---\n\n`
}

/** Writes (or removes when `docs` is undefined) the Claude Code rule and the `AGENTS.md` section */
function syncRules(changes: ChangeSet, rootDir: string, targets: AgentTarget[], docs: AgentDocs | undefined, setup: ToolSetup, paths: string[] | undefined): void {
  const version = docs?.version ?? ''
  const hasClaudeMemory = CLAUDE_MEMORY_FILES.some(file => existsSync(join(rootDir, file)))
  // Claude Code reads AGENTS.md only when the project has no CLAUDE.md: the rule would then duplicate the AGENTS.md section
  const claudeReadsAgentsMd = targets.includes('agents-md') && !hasClaudeMemory

  if (targets.includes('claude')) {
    const rule = docs && !claudeReadsAgentsMd
      ? `${managedContent(version, withVersion(docs.claudeRule, version, setup.tool), setup, claudeFrontmatter(paths))}\n`
      : undefined
    syncOwnedFile(changes, setup.ruleFile, rule, version, setup)
  }

  if (targets.includes('agents-md')) {
    syncAgentsMd(changes, docs
      ? managedContent(version, withVersion(docs.agentsMdSection, version, setup.tool), setup)
      : undefined, version, setup)
  }
}

/** Rules of the tool: the given ones, else the maz-ui agent docs */
function resolveAgentDocs(options: SetupAgentsOptions, tool: AgentsTool): AgentDocs {
  if (options.agentDocs)
    return options.agentDocs

  if (tool !== MAZ_UI_AGENTS_TOOL)
    throw new Error(`setupAgents needs the rules of ${tool.name}: pass them with the agentDocs option.`)

  return readAgentDocs(options.rootDir, options.docsDir)
}

/**
 * Configures the AI coding agents of a project to use a tool, maz-ui by
 * default: rules (version matched with the installed tool) and its MCP server.
 * Idempotent and conservative: it only writes files it owns, a delimited
 * section of `AGENTS.md` and its own entry of the MCP config files.
 */
export function setupAgents(options: SetupAgentsOptions): SetupAgentsResult {
  const { rootDir, rules = true, mcp = true, dryRun = false, remove = false, tool = MAZ_UI_AGENTS_TOOL } = options
  const setup = resolveTool(tool)
  const targets = options.targets ?? detectAgentTargets(rootDir)
  const docs = remove || !rules
    ? undefined
    : resolveAgentDocs(options, tool)
  const version = docs?.version ?? ''
  const changes = new ChangeSet(rootDir, dryRun)
  const server = options.mcpServer ?? mcpServerCommand(rootDir, options.mcpVersion, tool)

  const claudeRulePaths = docs && targets.includes('claude')
    ? resolveRulePaths(rootDir, tool, options.paths)
    : undefined

  if (rules || remove)
    syncRules(changes, rootDir, targets, docs, setup, claudeRulePaths)

  if (mcp || remove) {
    for (const target of ['claude', 'cursor', 'vscode'] as const) {
      if (targets.includes(target))
        syncMcpConfig(changes, MCP_FILES[target], server, remove, tool)
    }
  }

  return {
    targets,
    version,
    changes: changes.changes,
    mcpServer: server,
    localMcpServer: !server.args.includes('-y'),
    claudeRulePaths,
  }
}
