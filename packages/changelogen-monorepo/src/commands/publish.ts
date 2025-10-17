import type { PublishOptions } from '../types'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import * as semver from 'semver'
import { getPackagePatterns, loadMonorepoConfig } from '../config'
import { getPackages, getRootPackage } from '../core/monorepo'

function isPrerelease(version?: string): boolean {
  if (!version)
    return false
  const parsed = semver.parse(version)
  return parsed ? parsed.prerelease.length > 0 : false
}

function determinePublishTag(version: string | undefined, options: PublishOptions): string {
  if (options.tag) {
    return options.tag
  }

  if (isPrerelease(version)) {
    return 'next'
  }

  return 'latest'
}

interface PackageWithDeps {
  name: string
  path: string
  version?: string
  dependencies: string[]
}

function getPackageDependencies(packagePath: string, allPackageNames: Set<string>): string[] {
  const packageJsonPath = join(packagePath, 'package.json')
  if (!existsSync(packageJsonPath)) {
    return []
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  const deps: string[] = []

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  }

  for (const depName of Object.keys(allDeps)) {
    if (allPackageNames.has(depName)) {
      deps.push(depName)
    }
  }

  return deps
}

function topologicalSort(packages: PackageWithDeps[]): PackageWithDeps[] {
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

function getPackagesToPublishInSelectiveMode(
  sortedPackages: PackageWithDeps[],
  rootVersion: string | undefined,
): string[] {
  const packagesToBump: string[] = []

  for (const pkg of sortedPackages) {
    const pkgJsonPath = join(pkg.path, 'package.json')
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'))

    if (pkgJson.version !== rootVersion) {
      packagesToBump.push(pkg.name)
    }
  }

  return packagesToBump
}

async function publishPackage(
  packagePath: string,
  packageName: string,
  version: string | undefined,
  options: PublishOptions,
): Promise<void> {
  const tag = determinePublishTag(version, options)
  const args = ['publish', '--tag', tag]

  if (options.registry) {
    args.push('--registry', options.registry)
  }

  if (options.access) {
    args.push('--access', options.access)
  }

  if (options.otp) {
    args.push('--otp', options.otp)
  }

  const command = `npm ${args.join(' ')}`

  consola.info(`Publishing ${packageName}@${version} with tag '${tag}'`)

  if (options.dryRun) {
    consola.info(`[DRY RUN] Would run: ${command} in ${packagePath}`)
    return
  }

  const currentDir = process.cwd()
  try {
    process.chdir(packagePath)

    const { stdout } = await execPromise(command, {
      noSuccess: true,
    })

    consola.success(`Published ${packageName}@${version}`)
    if (stdout) {
      consola.info(stdout)
    }
  }
  catch (error) {
    consola.error(`Failed to publish ${packageName}:`, (error as Error).message)
    throw error
  }
  finally {
    process.chdir(currentDir)
  }
}

export async function publishCommand(options: PublishOptions = {}): Promise<void> {
  try {
    consola.start('Publishing packages...')

    const rootDir = process.cwd()
    const config = await loadMonorepoConfig(rootDir)
    const patterns = options.packages ?? getPackagePatterns(config.monorepo)
    const packages = getPackages(rootDir, patterns, config)
    const rootPackage = getRootPackage(rootDir)

    consola.info(`Found ${packages.length} packages`)

    const allPackageNames = new Set(packages.map(p => p.name))

    const packagesWithDeps: PackageWithDeps[] = packages.map(pkg => ({
      ...pkg,
      dependencies: getPackageDependencies(pkg.path, allPackageNames),
    }))

    const sortedPackages = topologicalSort(packagesWithDeps)

    consola.info('Publish order (based on dependency graph):')
    for (const pkg of sortedPackages) {
      consola.info(`  - ${pkg.name}`)
    }

    if (config.monorepo.versionMode === 'selective') {
      const packagesToBump = getPackagesToPublishInSelectiveMode(sortedPackages, rootPackage.version)

      if (packagesToBump.length === 0) {
        consola.warn('No packages need to be published (all versions match root)')
        return
      }

      consola.info(`Publishing only packages that were bumped: ${packagesToBump.join(', ')}`)

      for (const pkg of sortedPackages) {
        if (packagesToBump.includes(pkg.name)) {
          await publishPackage(pkg.path, pkg.name, pkg.version, options)
        }
        else {
          consola.info(`Skipping ${pkg.name} (version unchanged)`)
        }
      }
    }
    else {
      for (const pkg of sortedPackages) {
        await publishPackage(pkg.path, pkg.name, pkg.version, options)
      }
    }

    consola.success('Publishing completed!')

    if (!options.dryRun) {
      consola.box('Packages have been published to npm registry')
    }
  }
  catch (error) {
    consola.error('Error publishing packages:', (error as Error).message)
    throw error
  }
}
