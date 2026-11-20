import { existsSync, globSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { builtinModules } from 'node:module'
import { join, relative } from 'node:path'
import process from 'node:process'
import { logger } from '@maz-ui/node'
import ts from 'typescript'
import { parse } from 'yaml'

/**
 * Every package imported by the published files of a package (`files` of its package.json) is installed by its
 * consumers: it is declared in `dependencies` or `peerDependencies`. The declarations (`.d.ts`) count too, an undeclared
 * package leaves the types of the consumer unresolved. The Vite builds also externalize the `devDependencies`
 * (`getExternalDependencies` of `tools/vite-config`): an undeclared import builds fine here and fails in the consumer app.
 * Run it after the build: the packages without `dist` are skipped.
 */

interface PackageJson {
  name: string
  private?: boolean
  files?: string[]
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}

const root = process.cwd()

const workspace: { packages: string[] } = parse(readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf-8'))

/**
 * Packages that a published package imports without declaring them, by package. @maz-ui/mcp bundles zod and the MCP SDK
 * (`npx` downloads a single package): only the types of its programmatic API import them. Declared as optional peers,
 * npm would refuse to install it in a project that has another major of zod.
 */
const ALLOWED_UNDECLARED: Record<string, string[]> = {
  '@maz-ui/mcp': [
    '@modelcontextprotocol/sdk',
    'zod',
  ],
}

/**
 * Specifiers of the static imports, re-exports, dynamic imports and `require` calls of a script, read by the
 * TypeScript scanner: the import-like text of strings and template literals (code examples) is ignored
 */
function getImportedSpecifiers(content: string): string[] {
  return ts.preProcessFile(content, true, true).importedFiles.map(file => file.fileName)
}

/**
 * Package name of a bare specifier, `null` for relative paths, URLs (`node:`, `data:`...), subpath imports (`#...`)
 * and Node.js builtins
 */
function getPackageName(specifier: string): string | null {
  if (/^[./#]/.test(specifier) || specifier.includes(':'))
    return null

  const name = specifier.startsWith('@')
    ? specifier.split('/').slice(0, 2).join('/')
    : specifier.split('/')[0]

  return builtinModules.includes(name)
    ? null
    : name
}

/**
 * Scripts of a published file or directory
 */
function findScripts(path: string): string[] {
  if (!existsSync(path))
    return []

  if (!statSync(path).isDirectory()) {
    return /\.[cm]?[jt]s$/.test(path)
      ? [path]
      : []
  }

  return readdirSync(path).flatMap(entry => entry === 'node_modules'
    ? []
    : findScripts(join(path, entry)))
}

/**
 * Errors of a project, from its package.json
 */
function checkPackage(file: string): string[] {
  const dir = join(root, file, '..')
  const pkg: PackageJson = JSON.parse(readFileSync(join(root, file), 'utf-8'))

  if (pkg.private || !existsSync(join(dir, 'dist')))
    return []

  const declared = new Set([
    pkg.name,
    ...ALLOWED_UNDECLARED[pkg.name] ?? [],
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
  ])

  const undeclared = new Map<string, Set<string>>()

  for (const script of (pkg.files ?? ['dist']).flatMap(entry => findScripts(join(dir, entry)))) {
    for (const specifier of getImportedSpecifiers(readFileSync(script, 'utf-8'))) {
      const name = getPackageName(specifier)

      if (name && !declared.has(name))
        undeclared.set(name, (undeclared.get(name) ?? new Set()).add(relative(root, script)))
    }
  }

  return [...undeclared].map(([name, scripts]) => {
    const others = scripts.size > 3
      ? ` (+${scripts.size - 3})`
      : ''

    return `${pkg.name}: ${name} is not declared in dependencies or peerDependencies, imported by ${[...scripts].slice(0, 3).join(', ')}${others}`
  })
}

const errors = globSync(workspace.packages.map(pattern => join(pattern, 'package.json')), { cwd: root })
  .flatMap(checkPackage)

if (errors.length > 0) {
  logger.error('The published files import packages that the consumers do not install')
  for (const error of errors)
    logger.error(error)
  process.exit(1)
}

logger.success('Every package imported by the published files is declared in dependencies or peerDependencies')
