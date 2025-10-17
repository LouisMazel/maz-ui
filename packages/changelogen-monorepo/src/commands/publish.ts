import type { PackageWithDeps } from '../core/dependencies'
import type { ChangelogMonorepoConfig, PublishOptions } from '../types'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import * as semver from 'semver'
import { getPackagePatterns, loadMonorepoConfig } from '../config'
import { getPackagesWithDependencies, topologicalSort } from '../core/dependencies'
import { getPackages, getRootPackage } from '../core/monorepo'

function isPrerelease(version?: string): boolean {
  if (!version)
    return false
  const parsed = semver.parse(version)
  return parsed ? parsed.prerelease.length > 0 : false
}

function determinePublishTag(version: string | undefined, options: PublishOptions, config: ChangelogMonorepoConfig): string {
  if (options.tag) {
    return options.tag
  }

  if (config.publish.tag) {
    return config.publish.tag
  }

  if (isPrerelease(version)) {
    return 'next'
  }

  return 'latest'
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
  config: ChangelogMonorepoConfig,
): Promise<void> {
  const tag = determinePublishTag(version, options, config)
  const args = ['publish', '--tag', tag]

  const registry = options.registry || config.publish.registry
  if (registry) {
    args.push('--registry', registry)
  }

  const access = options.access || config.publish.access
  if (access) {
    args.push('--access', access)
  }

  const otp = options.otp || config.publish.otp
  if (otp) {
    args.push('--otp', otp)
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

    const packagesWithDeps = getPackagesWithDependencies(packages)
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
          await publishPackage(pkg.path, pkg.name, pkg.version, options, config)
        }
        else {
          consola.info(`Skipping ${pkg.name} (version unchanged)`)
        }
      }
    }
    else {
      for (const pkg of sortedPackages) {
        await publishPackage(pkg.path, pkg.name, pkg.version, options, config)
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
