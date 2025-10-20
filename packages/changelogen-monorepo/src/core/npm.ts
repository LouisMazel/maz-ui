import type { ResolvedChangelogMonorepoConfig } from '../config'
import type { PublishOptions } from '../types'
import type { PackageWithDeps } from './dependencies'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import { getPackageCommits } from './monorepo'
import { getLastPackageTag, isPrerelease } from './version'

type PackageManager = 'npm' | 'yarn' | 'pnpm'

export function detectPackageManager(cwd: string): PackageManager {
  try {
    // Check for lock files in order of preference
    const lockFiles = [
      { file: 'pnpm-lock.yaml', manager: 'pnpm' as const },
      { file: 'yarn.lock', manager: 'yarn' as const },
      { file: 'package-lock.json', manager: 'npm' as const },
    ]

    for (const { file, manager } of lockFiles) {
      if (existsSync(join(cwd, file))) {
        consola.info(`Detected package manager: ${manager}`)
        return manager
      }
    }

    // Check npm/yarn/pnpm in package.json packageManager field
    const packageJsonPath = join(cwd, 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    if (packageJson.packageManager) {
      const pmName = packageJson.packageManager.split('@')[0]
      if (['npm', 'yarn', 'pnpm'].includes(pmName)) {
        consola.info(`Detected package manager from package.json: ${pmName}`)
        return pmName as PackageManager
      }
    }

    // Default to npm
    consola.info('No package manager detected, using npm as default')
    return 'npm'
  }
  catch (error) {
    consola.warn(`Error detecting package manager: ${(error as Error).message}, defaulting to npm`)
    return 'npm'
  }
}

export function determinePublishTag(version: string | undefined, options: PublishOptions, config: ResolvedChangelogMonorepoConfig): string {
  let tag: string = 'latest'

  if (options.tag) {
    tag = options.tag
  }
  else if (config.publish.tag) {
    tag = config.publish.tag
  }

  if (isPrerelease(version) && !options.tag) {
    consola.warn('To avoid mistake, the tag is set to "next" for this prerelease')
    tag = 'next'
  }

  if (isPrerelease(version) && options.tag === 'latest') {
    consola.warn('Please note, you are about to publish a "prerelease" version with the "latest" tag.')
  }

  return tag
}

export function getPackagesToPublishInSelectiveMode(
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

export async function getPackagesToPublishInIndependentMode(
  sortedPackages: PackageWithDeps[],
  config: ResolvedChangelogMonorepoConfig,
): Promise<string[]> {
  const packagesToPublish: string[] = []

  for (const pkg of sortedPackages) {
    const pkgLastTag = await getLastPackageTag(pkg.name)
    const fromTag = pkgLastTag || config.from

    const commits = await getPackageCommits({
      pkg,
      config: {
        ...config,
        from: fromTag,
      },
    })

    if (commits.length > 0) {
      packagesToPublish.push(pkg.name)
      consola.info(`  ${pkg.name}: ${commits.length} commits since ${fromTag}`)
    }
  }

  return packagesToPublish
}

export async function publishPackage({
  packagePath,
  packageName,
  version,
  options,
  config,
  packageManager,
}: {
  packagePath: string
  packageName: string
  version: string | undefined
  options: PublishOptions
  config: ResolvedChangelogMonorepoConfig
  packageManager: PackageManager
}): Promise<void> {
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

  const command = `${packageManager} ${args.join(' ')}`

  consola.info(`Publishing ${packageName}@${version} with tag '${tag}' using ${packageManager}`)

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
