import type { GitCommit } from 'changelogen'
import type { BumpConfig, PackageInfo, PackageWithCommits } from '../types'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { logger } from '@maz-ui/node'

export interface PackageWithDeps extends PackageInfo {
  dependencies: string[]
}

export interface PackageToBump extends PackageInfo {
  reason: 'commits' | 'dependency'
  dependencyChain?: string[]
  commits: GitCommit[]
}

/**
 * Get workspace dependencies of a package (only dependencies and peerDependencies, not devDependencies)
 */
export function getPackageDependencies(packagePath: string, allPackageNames: Set<string>, dependencyTypes: BumpConfig['dependencyTypes']): string[] {
  const packageJsonPath = join(packagePath, 'package.json')
  if (!existsSync(packageJsonPath)) {
    return []
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  const deps: string[] = []

  // Only check dependencies and peerDependencies (not devDependencies per industry best practices)
  const allDeps = {
    ...(dependencyTypes?.includes('dependencies') ? packageJson.dependencies : {}),
    ...(dependencyTypes?.includes('peerDependencies') ? packageJson.peerDependencies : {}),
    ...(dependencyTypes?.includes('devDependencies') ? packageJson.devDependencies : {}),
  }

  for (const depName of Object.keys(allDeps)) {
    if (allPackageNames.has(depName)) {
      deps.push(depName)
    }
  }

  return deps
}

/**
 * Transform packages array into PackageWithDeps with their workspace dependencies
 */
export function getPackagesWithDependencies(packages: PackageInfo[], dependencyTypes: BumpConfig['dependencyTypes']): PackageWithDeps[] {
  const allPackageNames = new Set(packages.map(p => p.name))

  return packages.map(pkg => ({
    ...pkg,
    dependencies: getPackageDependencies(pkg.path, allPackageNames, dependencyTypes),
  }))
}

/**
 * Get all packages that depend on the given package name
 */
export function getDependentsOf(packageName: string, allPackages: PackageWithDeps[]): PackageWithDeps[] {
  return allPackages.filter(pkg =>
    pkg.dependencies.includes(packageName),
  )
}

/**
 * Recursively expand packages to bump with all their dependents (transitive)
 * Returns packages with reason for bumping and dependency chain for traceability
 */
export function expandPackagesToBumpWithDependents({
  packagesWithCommits,
  allPackages,
  dependencyTypes,
}: {
  packagesWithCommits: PackageWithCommits[]
  allPackages: PackageInfo[]
  dependencyTypes: BumpConfig['dependencyTypes']
}): PackageToBump[] {
  const packagesWithDeps = getPackagesWithDependencies(allPackages, dependencyTypes)
  const result = new Map<string, PackageToBump>()

  logger.debug(`Expanding packages to bump: ${packagesWithCommits.length} packages with commits, ${allPackages.length} total packages`)

  for (const pkg of packagesWithCommits) {
    result.set(pkg.name, {
      ...pkg,
      reason: 'commits',
      commits: pkg.commits,
    })
  }

  const toProcess = [...packagesWithCommits.map(p => p.name)]
  const processed = new Set<string>()

  while (toProcess.length > 0) {
    const currentPkgName = toProcess.shift()

    if (!currentPkgName || processed.has(currentPkgName)) {
      continue
    }

    processed.add(currentPkgName)

    // Find all packages that depend on current package
    const dependents = getDependentsOf(currentPkgName, packagesWithDeps)

    for (const dependent of dependents) {
      if (!result.has(dependent.name)) {
        // Build dependency chain for logging
        const currentChain = result.get(currentPkgName)?.dependencyChain || []
        const chain = [...currentChain, currentPkgName]

        const packageInfo = allPackages.find(p => p.name === dependent.name)
        if (packageInfo) {
          result.set(dependent.name, {
            ...packageInfo,
            reason: 'dependency',
            dependencyChain: chain,
            commits: [],
          })

          toProcess.push(dependent.name)

          logger.debug(`${dependent.name} will be bumped (depends on ${chain.join(' → ')})`)
        }
      }
    }
  }

  return Array.from(result.values())
}

/**
 * Topological sort of packages based on their dependencies
 * Ensures dependencies are processed before dependents
 */
export function topologicalSort(packages: PackageWithDeps[]): PackageWithDeps[] {
  const sorted: PackageWithDeps[] = []
  const visited = new Set<string>()
  const visiting = new Set<string>()

  const packageMap = new Map<string, PackageWithDeps>()
  for (const pkg of packages) {
    packageMap.set(pkg.name, pkg)
  }

  function visit(pkgName: string) {
    if (visited.has(pkgName))
      return

    if (visiting.has(pkgName)) {
      logger.warn(`Circular dependency detected involving ${pkgName}`)
      return
    }

    visiting.add(pkgName)

    const pkg = packageMap.get(pkgName)
    if (!pkg)
      return

    for (const depName of pkg.dependencies) {
      visit(depName)
    }

    visiting.delete(pkgName)
    visited.add(pkgName)
    sorted.push(pkg)
  }

  for (const pkg of packages) {
    visit(pkg.name)
  }

  return sorted
}
