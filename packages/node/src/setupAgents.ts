import type { FormattingOptions, ParseError } from 'jsonc-parser'

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { applyEdits, modify, parse } from 'jsonc-parser'

/**
 * AI coding agents supported by `setupAgents`.
 *
 * - `claude`: Claude Code rule (`.claude/rules/maz-ui.md`) and MCP server (`.mcp.json`)
 * - `agents-md`: section in `AGENTS.md` (Codex, Cursor, Copilot, Windsurf, Zed, Gemini...)
 * - `cursor`: MCP server in `.cursor/mcp.json` (rules come from `AGENTS.md`)
 * - `vscode`: MCP server in `.vscode/mcp.json` for GitHub Copilot (rules come from `AGENTS.md`)
 */
export type AgentTarget = 'claude' | 'agents-md' | 'cursor' | 'vscode'

export const AGENT_TARGETS: AgentTarget[] = ['claude', 'agents-md', 'cursor', 'vscode']

export interface SetupAgentsOptions {
  /** Root of the project (where `AGENTS.md`, `.claude/`, `.mcp.json` live) */
  rootDir: string
  /** Agents to configure. Default: the agents detected in the project */
  targets?: AgentTarget[]
  /** Write the maz-ui rules (Claude Code rule, `AGENTS.md` section). Default `true` */
  rules?: boolean
  /** Register the maz-ui MCP server. Default `true` */
  mcp?: boolean
  /** Compute the changes without writing anything */
  dryRun?: boolean
  /** Remove everything `setupAgents` added */
  remove?: boolean
  /** Folder of the maz-ui agent docs. Default: `docs/` of the maz-ui package installed in `rootDir` */
  docsDir?: string
  /** Command used to start the MCP server. Default: `mcpServerCommand(rootDir, mcpVersion)` */
  mcpServer?: McpServerCommand
  /** Version of `@maz-ui/mcp` pinned in the `npx -y` command, when the project does not install it. Default `latest` */
  mcpVersion?: string
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
  /** `false` when the server runs through `npx -y` because the project does not install `@maz-ui/mcp` */
  localMcpServer: boolean
}

export const MANAGED_MARKER = 'Managed by maz-ui'
export const AGENTS_MD_BEGIN = '<!-- BEGIN:maz-ui -->'
export const AGENTS_MD_END = '<!-- END:maz-ui -->'
export const MCP_SERVER_NAME = 'maz-ui'
export const DEFAULT_MCP_SERVER: McpServerCommand = { command: 'npx', args: ['-y', '@maz-ui/mcp@latest'] }

const MCP_PACKAGE = '@maz-ui/mcp'
const MCP_BIN = 'maz-ui-mcp'

type PackageManager = 'pnpm' | 'yarn' | 'bun' | 'npm'

function readPackageJson(rootDir: string): Record<string, unknown> | undefined {
  try {
    return JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8')) as Record<string, unknown>
  }
  catch {
    return undefined
  }
}

/** `true` when the `package.json` of the project declares `@maz-ui/mcp` */
export function installsMcpPackage(rootDir: string): boolean {
  const pkg = readPackageJson(rootDir)

  return ['dependencies', 'devDependencies', 'optionalDependencies'].some(field => (pkg?.[field] as Record<string, string> | undefined)?.[MCP_PACKAGE] !== undefined)
}

/** Package manager of a project: the `packageManager` field, else its lockfile */
export function detectPackageManager(rootDir: string): PackageManager {
  const declared = String(readPackageJson(rootDir)?.packageManager ?? '').split('@')[0]

  if (['pnpm', 'yarn', 'bun', 'npm'].includes(declared))
    return declared as PackageManager

  const lockfiles: [string, PackageManager][] = [['pnpm-lock.yaml', 'pnpm'], ['yarn.lock', 'yarn'], ['bun.lock', 'bun'], ['bun.lockb', 'bun']]

  return lockfiles.find(([file]) => existsSync(join(rootDir, file)))?.[1] ?? 'npm'
}

const LOCAL_MCP_COMMANDS: Record<PackageManager, McpServerCommand> = {
  pnpm: { command: 'pnpm', args: ['exec', MCP_BIN] },
  yarn: { command: 'yarn', args: ['run', MCP_BIN] },
  bun: { command: 'bun', args: ['x', '--no-install', MCP_BIN] },
  npm: { command: 'npx', args: ['--no-install', MCP_BIN] },
}

/**
 * Command of the maz-ui MCP server for a project. When the project installs
 * `@maz-ui/mcp`, its package manager starts the installed version in about a
 * second, at the version of the lockfile. Otherwise `npx -y` downloads it,
 * pinned to `version`: a dist-tag (`latest`) makes npx query the registry at
 * every start, which can exceed the start timeout of the agents behind a slow
 * registry.
 */
export function mcpServerCommand(rootDir: string, version = 'latest'): McpServerCommand {
  return installsMcpPackage(rootDir)
    ? LOCAL_MCP_COMMANDS[detectPackageManager(rootDir)]
    : { command: 'npx', args: ['-y', `${MCP_PACKAGE}@${version}`] }
}

/** Version pinned in a `npx -y @maz-ui/mcp@<version>` command */
function pinnedMcpVersion(server: McpServerCommand): string | undefined {
  return server.args.map(arg => /^@maz-ui\/mcp@(\d\S*)$/.exec(arg)?.[1]).find(Boolean)
}

/**
 * A command `setupAgents` generates: it may be replaced by a better one. A
 * command written by hand (`--docs`, another runner...) is kept.
 */
function isGeneratedMcpCommand(server: Partial<McpServerCommand>): server is McpServerCommand {
  const command = [server.command, ...(Array.isArray(server.args) ? server.args : [])].join(' ')

  return /^npx -y @maz-ui\/mcp(?:@\S+)?$/.test(command)
    || Object.values(LOCAL_MCP_COMMANDS).some(local => command === [local.command, ...local.args].join(' '))
}

const CLAUDE_RULE_FILE = '.claude/rules/maz-ui.md'
const CLAUDE_MEMORY_FILES = ['CLAUDE.md', '.claude/CLAUDE.md', 'CLAUDE.local.md']

/** Adds the installed version under the title of a generated rule */
function withVersion(content: string, version: string): string {
  return content.replace(/^(#{1,2} .+)\n/, `$1\n\n> maz-ui ${version} is installed: these rules and the docs in \`node_modules/maz-ui/docs\` match this version.\n`)
}

/** Checksum of generated rules, insensitive to the whitespace a formatter changes (table padding, wrapping, blank lines) */
function checksum(body: string): string {
  return createHash('sha256').update(body.replaceAll(/\s+/g, '')).digest('hex').slice(0, 12)
}

/** Generated rules: a header with the maz-ui version and the checksum of the body, then the body */
function managedContent(version: string, body: string): string {
  return `<!-- ${MANAGED_MARKER} ${version} (sha256:${checksum(body)}): generated by \`npx @maz-ui/mcp init\` (or the \`mazUi.agents\` Nuxt option). Do not edit: edited rules are no longer updated. Write your own rules elsewhere. -->\n\n${body}`
}

const MANAGED_HEADER = new RegExp(`<!-- ${MANAGED_MARKER}[^\\n]*?-->`)

/**
 * `true` when generated rules were edited by hand since they were written:
 * they are kept, a newer version of the rules would overwrite the edits.
 */
export function isEditedManagedContent(content: string | undefined): boolean {
  const header = content === undefined ? null : MANAGED_HEADER.exec(content)
  const recorded = header ? /\(sha256:([\da-f]+)\)/.exec(header[0])?.[1] : undefined

  return header !== null && recorded !== undefined && checksum((content as string).slice(header.index + header[0].length)) !== recorded
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

/** Reads the agent files shipped in `maz-ui/docs/agents` */
/** Version of an installed package, read from its `package.json` */
export function readPackageVersion(packageDir: string): string | undefined {
  const file = join(packageDir, 'package.json')

  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as { version?: string }).version : undefined
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
  const pnpmWorkspace = join(rootDir, 'pnpm-workspace.yaml')
  const workspaces = readPackageJson(rootDir)?.workspaces as string[] | { packages?: string[] } | undefined
  const declared = existsSync(pnpmWorkspace)
    ? readPnpmWorkspacePackages(readFileSync(pnpmWorkspace, 'utf8'))
    : (Array.isArray(workspaces) ? workspaces : workspaces?.packages) ?? []
  const patterns = declared.filter(pattern => !pattern.startsWith('!')).map(pattern => pattern.replace(/^\.\//, '').replace(/\/$/, ''))

  return patterns.length > 0 ? patterns : DEFAULT_WORKSPACES
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
    .map(segment => segment === '**' ? '.*' : segment.replaceAll(/[.+^${}()|[\]\\]/g, '\\$&').replaceAll('*', '[^/]*').replaceAll('?', '[^/]'))
    .join('/')

  return new RegExp(`^${source.replaceAll('/.*', '(?:/.*)?')}$`)
}

/** Folders of the workspaces of a monorepo, in the order of the patterns. Only the fixed part of each pattern is read (`apps/*` reads `apps`) */
export function findWorkspaceDirs(rootDir: string): string[] {
  const folders = new Set<string>()

  for (const pattern of readWorkspacePatterns(rootDir)) {
    const segments = pattern.split('/')
    const firstGlob = segments.findIndex(segment => /[*?[{]/.test(segment))
    const base = (firstGlob === -1 ? segments : segments.slice(0, firstGlob)).join('/')
    const depth = firstGlob === -1 ? 0 : segments.includes('**') ? MAX_GLOBSTAR_DEPTH : segments.length - firstGlob
    const matcher = globToRegExp(pattern)

    const visit = (folder: string, remaining: number): void => {
      if (!existsSync(join(rootDir, folder)))
        return

      if (folder && folder !== '.' && matcher.test(folder))
        folders.add(join(rootDir, folder))

      if (remaining === 0)
        return

      for (const entry of readdirSync(join(rootDir, folder), { withFileTypes: true })) {
        if (entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.'))
          visit(folder ? `${folder}/${entry.name}` : entry.name, remaining - 1)
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
  return [rootDir, ...findWorkspaceDirs(rootDir)]
    .map(base => join(base, 'node_modules', name))
    .find(candidate => existsSync(join(candidate, 'package.json')))
    ?? findInstalledPackage(rootDir, name)
}

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

  if (isNumeric(a) !== isNumeric(b))
    return isNumeric(a) ? -1 : 1

  return isNumeric(a) ? Number(a) - Number(b) : a.localeCompare(b)
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

const MANAGED_VERSION = new RegExp(`${MANAGED_MARKER} (\\d[^\\s:]*)`)

/** Version of maz-ui that generated a managed content, read from its header */
export function readManagedVersion(content: string | undefined): string | undefined {
  return content ? MANAGED_VERSION.exec(content)?.[1] : undefined
}

/**
 * Rules written by a newer maz-ui are kept: in a monorepo whose apps install
 * different versions, each app would otherwise rewrite them in turn.
 */
function newerManagedVersion(content: string | undefined, version: string): string | undefined {
  const written = readManagedVersion(content)

  return written && version && compareVersions(written, version) > 0 ? written : undefined
}

function newerVersionReason(written: string, version: string): string {
  return `written by maz-ui ${written}, newer than the installed ${version}: left untouched`
}

class ChangeSet {
  readonly changes: SetupAgentsChange[] = []

  constructor(private readonly rootDir: string, private readonly dryRun: boolean) {}

  private absolute(file: string): string {
    return join(this.rootDir, file)
  }

  read(file: string): string | undefined {
    const path = this.absolute(file)

    return existsSync(path) ? readFileSync(path, 'utf8') : undefined
  }

  write(file: string, content: string, current: string | undefined, reason?: string): void {
    if (current === content) {
      this.changes.push({ file, action: 'unchanged' })
      return
    }

    this.changes.push({ file, action: current === undefined ? 'create' : 'update', ...(reason ? { reason } : {}) })

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
function isOwned(content: string | undefined): boolean {
  return content === undefined || content.includes(MANAGED_MARKER)
}

function syncOwnedFile(changes: ChangeSet, file: string, content: string | undefined, version: string): void {
  const current = changes.read(file)

  if (!isOwned(current)) {
    changes.skip(file, 'file exists and was not generated by maz-ui: left untouched')
    return
  }

  const newer = content === undefined ? undefined : newerManagedVersion(current, version)

  if (newer) {
    changes.skip(file, newerVersionReason(newer, version))
    return
  }

  if (content !== undefined && isEditedManagedContent(current)) {
    changes.skip(file, `edited since it was generated: left untouched, delete it to get the rules of maz-ui ${version}`)
    return
  }

  if (content === undefined) {
    if (current !== undefined)
      changes.delete(file)
    return
  }

  changes.write(file, content, current)
}

function syncAgentsMd(changes: ChangeSet, section: string | undefined, version: string): void {
  const file = 'AGENTS.md'
  const current = changes.read(file)
  const begin = current?.indexOf(AGENTS_MD_BEGIN) ?? -1
  const end = current?.indexOf(AGENTS_MD_END) ?? -1
  const hasBlock = begin !== -1 && end > begin

  if (section === undefined) {
    if (!current || !hasBlock)
      return

    const remaining = `${current.slice(0, begin)}${current.slice(end + AGENTS_MD_END.length)}`.replace(/\n{3,}/g, '\n\n').trim()

    if (remaining)
      changes.write(file, `${remaining}\n`, current)
    else
      changes.delete(file)
    return
  }

  const block = hasBlock ? current?.slice(begin + AGENTS_MD_BEGIN.length, end) : undefined
  const newer = newerManagedVersion(block, version)

  if (newer) {
    changes.skip(file, newerVersionReason(newer, version))
    return
  }

  if (isEditedManagedContent(block)) {
    changes.skip(file, `the maz-ui section was edited since it was generated: left untouched, delete the section to get the rules of maz-ui ${version}`)
    return
  }

  const wrapped = `${AGENTS_MD_BEGIN}\n\n${section}\n\n${AGENTS_MD_END}`

  if (!current) {
    changes.write(file, `${wrapped}\n`, current)
  }
  else if (hasBlock) {
    changes.write(file, `${current.slice(0, begin)}${wrapped}${current.slice(end + AGENTS_MD_END.length)}`, current)
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

function referencesMazUiMcp(server: unknown): boolean {
  const serialized = JSON.stringify(server)

  return serialized.includes('@maz-ui/mcp') || serialized.includes('maz-ui-mcp')
}

function detectFormatting(content: string): FormattingOptions {
  const indent = /^( +|\t)"/m.exec(content)?.[1] ?? '  '

  return { insertSpaces: !indent.includes('\t'), tabSize: indent.includes('\t') ? 1 : indent.length, eol: content.includes('\r\n') ? '\r\n' : '\n' }
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Replaces the command of an existing entry of the maz-ui MCP server, its other fields (`env`...) are kept */
function updateMcpCommand(changes: ChangeSet, config: McpConfigFile, [key, entry]: [string, unknown], server: McpServerCommand): void {
  const current = entry as Partial<McpServerCommand>
  const label = [server.command, ...server.args].join(' ')

  if (current.command === server.command && JSON.stringify(current.args) === JSON.stringify(server.args)) {
    changes.unchanged(config.file, `maz-ui MCP server already registered as "${key}"`)
    return
  }

  if (!isGeneratedMcpCommand(current)) {
    changes.unchanged(config.file, `"${key}" runs a custom command: left untouched`)
    return
  }

  const pinned = pinnedMcpVersion(current)
  const wanted = pinnedMcpVersion(server)
  const isLocal = !server.args.includes('-y')

  // A pin is only replaced by the installed package or a newer pin: never by `latest`, nor by an older version (monorepos)
  if (pinned && !isLocal && (!wanted || compareVersions(pinned, wanted) >= 0)) {
    changes.unchanged(config.file, `"${key}" runs @maz-ui/mcp ${pinned}`)
    return
  }

  const file = changes.read(config.file) as string
  const formatting = detectFormatting(file)
  let content = applyEdits(file, modify(file, [config.rootKey, key, 'command'], server.command, { formattingOptions: formatting }))
  content = applyEdits(content, modify(content, [config.rootKey, key, 'args'], server.args, { formattingOptions: formatting }))

  changes.write(config.file, content, file, `"${key}" now runs ${label}`)
}

function syncMcpConfig(changes: ChangeSet, config: McpConfigFile, server: McpServerCommand, remove: boolean): void {
  const current = changes.read(config.file)
  const errors: ParseError[] = []
  const parsed: unknown = current === undefined ? {} : parse(current, errors, { allowTrailingComma: true })

  if (errors.length > 0 || !isJsonObject(parsed) || (parsed[config.rootKey] !== undefined && !isJsonObject(parsed[config.rootKey]))) {
    changes.skip(config.file, 'invalid JSON: left untouched')
    return
  }

  const servers = (parsed[config.rootKey] ?? {}) as Record<string, unknown>
  const existing = Object.entries(servers).find(([, value]) => referencesMazUiMcp(value))
  const base = current ?? '{}\n'
  const formatting = detectFormatting(base)

  if (remove) {
    if (existing?.[0] === MCP_SERVER_NAME) {
      const content = applyEdits(base, modify(base, [config.rootKey, MCP_SERVER_NAME], undefined, { formattingOptions: formatting }))
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
    updateMcpCommand(changes, config, existing, server)
    return
  }

  if (servers[MCP_SERVER_NAME] !== undefined) {
    changes.skip(config.file, `a "${MCP_SERVER_NAME}" server already exists with another command: left untouched`)
    return
  }

  const value = config.withType ? { type: 'stdio', ...server } : { ...server }
  const content = applyEdits(base, modify(base, [config.rootKey, MCP_SERVER_NAME], value, { formattingOptions: formatting }))

  changes.write(config.file, content.endsWith('\n') ? content : `${content}\n`, current)
}

/** Writes (or removes when `docs` is undefined) the Claude Code rule and the `AGENTS.md` section */
function syncRules(changes: ChangeSet, rootDir: string, targets: AgentTarget[], docs: AgentDocs | undefined): void {
  const version = docs?.version ?? ''
  const hasClaudeMemory = CLAUDE_MEMORY_FILES.some(file => existsSync(join(rootDir, file)))
  // Claude Code reads AGENTS.md only when the project has no CLAUDE.md: the rule would then duplicate the AGENTS.md section
  const claudeReadsAgentsMd = targets.includes('agents-md') && !hasClaudeMemory

  if (targets.includes('claude')) {
    const rule = docs && !claudeReadsAgentsMd ? `${managedContent(version, withVersion(docs.claudeRule, version))}\n` : undefined
    syncOwnedFile(changes, CLAUDE_RULE_FILE, rule, version)
  }

  if (targets.includes('agents-md'))
    syncAgentsMd(changes, docs ? managedContent(version, withVersion(docs.agentsMdSection, version)) : undefined, version)
}

/**
 * Configures the AI coding agents of a project to use maz-ui: rules (version
 * matched with the installed maz-ui) and the maz-ui MCP server. Idempotent and
 * conservative: it only writes files it owns, a delimited section of
 * `AGENTS.md` and its own entry of the MCP config files.
 */
export function setupAgents(options: SetupAgentsOptions): SetupAgentsResult {
  const { rootDir, rules = true, mcp = true, dryRun = false, remove = false } = options
  const targets = options.targets ?? detectAgentTargets(rootDir)
  const docs = remove || !rules ? undefined : readAgentDocs(rootDir, options.docsDir)
  const version = docs?.version ?? ''
  const changes = new ChangeSet(rootDir, dryRun)
  const server = options.mcpServer ?? mcpServerCommand(rootDir, options.mcpVersion)

  if (rules || remove)
    syncRules(changes, rootDir, targets, docs)

  if (mcp || remove) {
    for (const target of ['claude', 'cursor', 'vscode'] as const) {
      if (targets.includes(target))
        syncMcpConfig(changes, MCP_FILES[target], server, remove)
    }
  }

  return { targets, version, changes: changes.changes, mcpServer: server, localMcpServer: !server.args.includes('-y') }
}
