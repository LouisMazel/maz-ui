import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { PackageInfo, PackageManager } from '../types'
import type { PackageWithDeps } from './dependencies'
import { existsSync, readFileSync } from 'node:fs'
import path, { join } from 'node:path'
import { execPromise, logger } from '@maz-ui/node'
import { getLastPackageTag, getPackageCommits, isPrerelease } from '../core'

export function detectPackageManager(cwd: string = process.cwd()): PackageManager {
  try {
    const packageJsonPath = join(cwd, 'package.json')
    if (existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
        const pmField = packageJson.packageManager
        if (typeof pmField === 'string') {
          const pmName = pmField.split('@')[0]
          // eslint-disable-next-line max-depth
          if (['npm', 'pnpm', 'yarn', 'bun'].includes(pmName as string)) {
            logger.debug(`Detected package manager from package.json: ${pmName}`)
            return pmName as PackageManager
          }
        }
      }
      catch (e) {
        logger.warn(`Failed to parse package.json: ${(e as Error).message}`)
      }
    }

    const lockFiles: Record<PackageManager, string> = {
      pnpm: 'pnpm-lock.yaml',
      yarn: 'yarn.lock',
      npm: 'package-lock.json',
      bun: 'bun.lockb',
    }

    for (const [manager, file] of Object.entries(lockFiles)) {
      if (existsSync(join(cwd, file))) {
        logger.debug(`Detected package manager from lockfile: ${manager}`)
        return manager as PackageManager
      }
    }

    const ua = process.env.npm_config_user_agent
    if (ua) {
      const match = /(pnpm|yarn|npm|bun)/.exec(ua)
      if (match) {
        logger.debug(`Detected package manager from user agent: ${match[1]}`)
        return match[1] as PackageManager
      }
    }

    logger.debug('No package manager detected, defaulting to npm')
    return 'npm'
  }
  catch (error) {
    logger.warn(`Error detecting package manager: ${error}, defaulting to npm`)
    return 'npm'
  }
}

export function determinePublishTag(version: string | undefined, config: ResolvedChangelogMonorepoConfig): string {
  let tag: string = 'latest'

  if (config.publish.tag) {
    tag = config.publish.tag
  }

  if (isPrerelease(version) && !config.publish.tag) {
    logger.warn('You are about to publish a "prerelease" version with the "latest" tag. To avoid mistake, the tag is set to "next"')
    tag = 'next'
  }

  if (isPrerelease(version) && config.publish.tag === 'latest') {
    logger.warn('Please note, you are about to publish a "prerelease" version with the "latest" tag.')
  }

  return tag
}

export function getPackagesToPublishInSelectiveMode(
  sortedPackages: PackageWithDeps[],
  rootVersion: string | undefined,
): PackageInfo[] {
  const packagesToPublish: PackageInfo[] = []

  for (const pkg of sortedPackages) {
    const pkgJsonPath = join(pkg.path, 'package.json')
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'))

    if (pkgJson.version === rootVersion) {
      packagesToPublish.push(pkg)
    }
  }

  return packagesToPublish
}

export async function getPackagesToPublishInIndependentMode(
  sortedPackages: PackageWithDeps[],
  config: ResolvedChangelogMonorepoConfig,
): Promise<PackageInfo[]> {
  const packagesToPublish: PackageInfo[] = []

  for (const pkg of sortedPackages) {
    const pkgLastTag = await getLastPackageTag({
      packageName: pkg.name,
      logLevel: config.logLevel,
    })
    const fromTag = pkgLastTag || config.from

    logger.debug(`Checking ${pkg.name} for commits since ${fromTag}`)
    const commits = await getPackageCommits({
      pkg,
      config: {
        ...config,
        from: fromTag,
      },
    })

    if (commits.length > 0) {
      packagesToPublish.push(pkg)
      logger.debug(`${pkg.name}: ${commits.length} commit(s) since ${fromTag}`)
    }
  }

  return packagesToPublish
}

function isYarnBerry() {
  return existsSync(path.join(process.cwd(), '.yarnrc.yml'))
}

function getCommandArgs({
  packageManager,
  tag,
  config,
}: {
  packageManager: PackageManager
  tag: string
  config: ResolvedChangelogMonorepoConfig
}) {
  const args = ['publish', '--tag', tag]

  // Adjust for package managers
  if (packageManager === 'pnpm') {
    args.push('--no-git-checks')
  }
  else if (packageManager === 'yarn') {
    args.push('--non-interactive')
    // Yarn Berry only
    if (isYarnBerry())
      args.push('--no-git-checks')
  }
  else if (packageManager === 'npm') {
    args.push('--yes')
  }

  const registry = config.publish.registry
  if (registry) {
    args.push('--registry', registry)
  }

  const access = config.publish.access
  if (access) {
    args.push('--access', access)
  }

  const otp = config.publish.otp
  if (otp) {
    args.push('--otp', otp)
  }

  return args
}

export async function publishPackage({
  pkg,
  config,
  packageManager,
  dryRun,
}: {
  pkg: PackageInfo
  config: ResolvedChangelogMonorepoConfig
  packageManager: PackageManager
  dryRun: boolean
}): Promise<void> {
  const tag = determinePublishTag(pkg.version, config)

  logger.debug(`Building publish command for ${pkg.name}`)

  const args = getCommandArgs({
    packageManager,
    tag,
    config,
  })

  const baseCommand = packageManager === 'yarn' && isYarnBerry() ? 'yarn npm' : packageManager
  const command = `${baseCommand} ${args.join(' ')}`

  const packageNameAndVersion = `${pkg.name}@${pkg.version}`

  logger.debug(`Publishing ${packageNameAndVersion} with tag '${tag}' with command: ${command}`)

  try {
    process.chdir(pkg.path)

    logger.debug(`Executing publish command (${command}) in ${pkg.path}`)

    if (dryRun) {
      logger.info(`[dry-run] ${packageNameAndVersion}: Run ${command}`)
    }
    else {
      const { stdout } = await execPromise(command, {
        noStderr: true,
        noStdout: true,
        logLevel: config.logLevel,
      })
      if (stdout) {
        logger.debug(stdout)
      }
    }

    if (!dryRun) {
      logger.info(`Published ${packageNameAndVersion}`)
    }
  }
  catch (error) {
    logger.error(`Failed to publish ${packageNameAndVersion}:`, error)
    throw error
  }
  finally {
    process.chdir(config.cwd)
  }
}
