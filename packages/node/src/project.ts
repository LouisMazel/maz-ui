import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'

export type PackageManager = 'pnpm' | 'yarn' | 'bun' | 'npm'

export function readPackageJson(rootDir: string): Record<string, unknown> | undefined {
  try {
    return JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8')) as Record<string, unknown>
  }
  catch {
    return undefined
  }
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
