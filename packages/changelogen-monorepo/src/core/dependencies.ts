import type { PackageInfo } from '../types'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { consola } from 'consola'

export interface PackageWithDeps extends PackageInfo {
  dependencies: string[]
}

export interface PackageToBump extends PackageInfo {
  reason: 'commits' | 'dependency'
  dependencyChain?: string[]
}

/**
 * Get workspace dependencies of a package (only dependencies and peerDependencies, not devDependencies)
 */
export function getPackageDependencies(packagePath: string, allPackageNames: Set<string>): string[] {
  const packageJsonPath = join(packagePath, 'package.json')
  if (!existsSync(packageJsonPath)) {
    return []
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  const deps: string[] = []

  // Only check dependencies and peerDependencies (not devDependencies per industry best practices)
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
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
export function getPackagesWithDependencies(packages: PackageInfo[]): PackageWithDeps[] {
  const allPackageNames = new Set(packages.map(p => p.name))

  return packages.map(pkg => ({
    ...pkg,
    dependencies: getPackageDependencies(pkg.path, allPackageNames),
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
export function expandPackagesToBumpWithDependents(
  packagesToBump: PackageInfo[],
  allPackages: PackageInfo[],
): PackageToBump[] {
  const packagesWithDeps = getPackagesWithDependencies(allPackages)
  const result = new Map<string, PackageToBump>()

  // Add initial packages (those with commits)
  for (const pkg of packagesToBump) {
    result.set(pkg.name, {
      ...pkg,
      reason: 'commits',
    })
  }

  // Track packages to process for finding dependents
  const toProcess = [...packagesToBump.map(p => p.name)]
  const processed = new Set<string>()

  while (toProcess.length > 0) {
    const currentPkgName = toProcess.shift()!

    if (processed.has(currentPkgName)) {
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
          })

          // Add to processing queue to find transitive dependents
          toProcess.push(dependent.name)

          consola.info(`  ${dependent.name} will be bumped (depends on ${chain.join(' → ')})`)
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
      consola.warn(`Circular dependency detected involving ${pkgName}`)
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
