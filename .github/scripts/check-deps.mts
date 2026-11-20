import { globSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { logger } from '@maz-ui/node'
import { minVersion, satisfies, validRange } from 'semver'
import { parse } from 'yaml'

/**
 * Dependencies of the workspace (see "Declaring dependencies" in CLAUDE.md):
 * - a dependency declared in several package.json (root included) uses `catalog:`, its version lives in the catalog of
 *   pnpm-workspace.yaml: relizy links a catalog update to the packages that reference the entry;
 * - a catalog entry is referenced by at least two package.json, and every `catalog:` reference has its entry;
 * - a peer dependency keeps its range in its package, and is also declared in its devDependencies, with a version
 *   inside this range.
 */

const FIELDS = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
] as const

type Field = typeof FIELDS[number]

type PackageJson = Partial<Record<Field, Record<string, string>>>

const errors: string[] = []

const root = process.cwd()

const workspace: { packages: string[], catalog?: Record<string, string>, catalogs?: Record<string, Record<string, string>> } = parse(readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf-8'))

const catalogs: Record<string, Record<string, string>> = { default: workspace.catalog ?? {}, ...workspace.catalogs }

const packages = new Map<string, PackageJson>(globSync(workspace.packages.map(pattern => join(pattern, 'package.json')), { cwd: root })
  .map(file => [
    file,
    JSON.parse(readFileSync(join(root, file), 'utf-8')),
  ]))

/**
 * Name of the catalog referenced by a specifier (`catalog:` is the default catalog), or `null`
 */
function getCatalogName(specifier: string): string | null {
  return specifier.startsWith('catalog:')
    ? specifier.slice('catalog:'.length) || 'default'
    : null
}

/**
 * Range of a specifier, read from the catalog it references
 */
function resolveRange(dep: string, specifier: string): string | undefined {
  const name = getCatalogName(specifier)

  return name
    ? catalogs[name]?.[dep]
    : specifier
}

function addTo(map: Map<string, Set<string>>, key: string, file: string) {
  map.set(key, (map.get(key) ?? new Set()).add(file))
}

/**
 * The package.json declaring each dependency, and the package.json referencing each catalog entry
 */
const declaredBy = new Map<string, Set<string>>()
const catalogUsage = new Map<string, Set<string>>()

for (const [file, pkg] of packages) {
  for (const field of FIELDS) {
    for (const [dep, specifier] of Object.entries(pkg[field] ?? {})) {
      if (specifier.startsWith('workspace:'))
        continue

      addTo(declaredBy, dep, file)

      const name = getCatalogName(specifier)

      if (!name)
        continue

      if (catalogs[name]?.[dep] === undefined)
        errors.push(`${file}: ${dep} uses "${specifier}" but this catalog has no ${dep}`)
      else
        addTo(catalogUsage, `${name}:${dep}`, file)
    }
  }
}

/**
 * A shared dependency uses the catalog, a peer dependency keeps its range
 */
function checkSpecifier({ file, field, dep, specifier }: { file: string, field: Field, dep: string, specifier: string }): string | undefined {
  if (specifier.startsWith('workspace:'))
    return undefined

  if (field === 'peerDependencies') {
    return getCatalogName(specifier)
      ? `${file}: the peer dependency ${dep} uses "${specifier}", declare its range instead`
      : undefined
  }

  const users = declaredBy.get(dep) ?? new Set()

  return users.size > 1 && !getCatalogName(specifier)
    ? `${file}: ${dep} is also declared by ${[...users].filter(user => user !== file).join(', ')}, use "catalog:" instead of "${specifier}" in ${field}`
    : undefined
}

for (const [file, pkg] of packages) {
  for (const field of FIELDS) {
    for (const [dep, specifier] of Object.entries(pkg[field] ?? {})) {
      const error = checkSpecifier({ file, field, dep, specifier })

      if (error)
        errors.push(error)
    }
  }
}

// The catalog entries are shared
for (const [name, entries] of Object.entries(catalogs)) {
  for (const dep of Object.keys(entries)) {
    const users = catalogUsage.get(`${name}:${dep}`)
    const label = name === 'default'
      ? `catalog.${dep}`
      : `catalogs.${name}.${dep}`

    if (!users)
      errors.push(`pnpm-workspace.yaml: ${label} is not used, remove it`)
    else if (name === 'default' && users.size === 1)
      errors.push(`pnpm-workspace.yaml: ${label} is only used by ${[...users][0]}, declare its version there`)
  }
}

// The peer dependencies are declared in the devDependencies, inside their range
for (const [file, pkg] of packages) {
  for (const [dep, peerRange] of Object.entries(pkg.peerDependencies ?? {})) {
    // A `catalog:` peer dependency is already reported
    if (peerRange.startsWith('workspace:') || getCatalogName(peerRange))
      continue

    const specifier = pkg.devDependencies?.[dep]

    if (!specifier) {
      errors.push(`${file}: ${dep} is a peer dependency, declare it in devDependencies too`)
      continue
    }

    const devRange = resolveRange(dep, specifier)

    // A missing catalog entry is already reported
    if (!devRange)
      continue

    const lowest = validRange(devRange)
      ? minVersion(devRange)
      : null

    if (!lowest)
      errors.push(`${file}: ${dep} has an unreadable version in devDependencies ("${devRange}")`)
    else if (!satisfies(lowest, peerRange))
      errors.push(`${file}: ${dep}@${devRange} (devDependencies) is outside the peer range "${peerRange}"`)
  }
}

if (errors.length > 0) {
  logger.error('Dependencies out of sync with the pnpm catalog and the peer ranges')
  for (const error of errors)
    logger.error(error)
  process.exit(1)
}

logger.success('The shared dependencies use the catalog, the peer dependencies are declared in the devDependencies, inside their range')
