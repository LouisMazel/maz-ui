import type { PackageWithDeps } from '../core/dependencies'
import type { ChangelogMonorepoConfig, PublishOptions } from '../types'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import { getPackagePatterns, loadMonorepoConfig } from '../config'
import { getPackagesWithDependencies, topologicalSort } from '../core/dependencies'
import { getPackageCommits, getPackages, getRootPackage } from '../core/monorepo'
import { getLastTag, isPrerelease } from '../core/version'

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
  const packagesToPublish: string[] = []

  for (const pkg of sortedPackages) {
    const pkgJsonPath = join(pkg.path, 'package.json')
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'))

    if (pkgJson.version === rootVersion) {
      packagesToPublish.push(pkg.name)
    }
  }

  return packagesToPublish
}

async function getPackagesToPublishInIndependentMode(
  sortedPackages: PackageWithDeps[],
  config: ChangelogMonorepoConfig,
): Promise<string[]> {
  const packagesToPublish: string[] = []
  const rootPackage = getRootPackage(config.cwd)
  const lastTag = await getLastTag(rootPackage.version)

  for (const pkg of sortedPackages) {
    const commits = await getPackageCommits({
      pkg,
      config,
      from: lastTag,
      to: 'HEAD',
    })

    if (commits.length > 0) {
      packagesToPublish.push(pkg.name)
    }
  }

  return packagesToPublish
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
    process.chdir(config.cwd)
  }
}

export async function publish(options: PublishOptions = {}) {
  try {
    consola.start('Publishing packages...')

    const config = await loadMonorepoConfig()

    const patterns = options.packages ?? config.publish.packages ?? getPackagePatterns(config.monorepo)

    const packages = getPackages({
      cwd: config.cwd,
      patterns,
      ignorePackages: config.monorepo.ignorePackages,
    })
    const rootPackage = getRootPackage(config.cwd)

    consola.info(`Found ${packages.length} packages`)

    const packagesWithDeps = getPackagesWithDependencies(packages)
    const sortedPackages = topologicalSort(packagesWithDeps)

    let packagesToPublish: string[] = []

    if (config.monorepo.versionMode === 'independent') {
      packagesToPublish = await getPackagesToPublishInIndependentMode(sortedPackages, config)
      consola.info(`Publishing packages that were bumped (independent mode): ${packagesToPublish.join(', ')}`)
    }
    else if (config.monorepo.versionMode === 'selective') {
      packagesToPublish = getPackagesToPublishInSelectiveMode(sortedPackages, rootPackage.version)
      consola.info(`Publishing packages that match root version (selective mode): ${packagesToPublish.join(', ')}`)
    }
    else {
      packagesToPublish = sortedPackages.map(pkg => pkg.name)
      consola.info('Publishing all packages (unified mode)')
    }

    if (packagesToPublish.length === 0) {
      consola.warn('No packages need to be published')
      return
    }

    for (const pkg of sortedPackages) {
      if (packagesToPublish.includes(pkg.name)) {
        await publishPackage(pkg.path, pkg.name, pkg.version, options, config)
      }
    }

    if (!options.dryRun) {
      consola.box('Packages have been published to npm registry')
    }

    consola.success('Publishing completed!')

    return {
      packagesToPublish,
    }
  }
  catch (error) {
    consola.error('Error publishing packages:', (error as Error).message)
    throw error
  }
}
