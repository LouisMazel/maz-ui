import type { ResolvedChangelogMonorepoConfig } from '../config'
import type { PublishOptions } from '../types'
import type { PackageWithDeps } from './dependencies'
import { existsSync, readFileSync } from 'node:fs'
import path, { join } from 'node:path'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import { getPackageCommits } from './monorepo'
import { getLastPackageTag, isPrerelease } from './version'

type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

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
            consola.success(`Detected package manager from package.json: ${pmName}`)
            return pmName as PackageManager
          }
        }
      }
      catch (e) {
        consola.warn(`Failed to parse package.json: ${(e as Error).message}`)
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
        consola.success(`Detected package manager from lockfile: ${manager}`)
        return manager as PackageManager
      }
    }

    const ua = process.env.npm_config_user_agent
    if (ua) {
      const match = /(pnpm|yarn|npm|bun)/.exec(ua)
      if (match) {
        consola.success(`Detected package manager from user agent: ${match[1]}`)
        return match[1] as PackageManager
      }
    }

    consola.info('No package manager detected, defaulting to npm')
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

function isYarnBerry() {
  return existsSync(path.join(process.cwd(), '.yarnrc.yml'))
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

  const baseCommand = packageManager === 'yarn' && isYarnBerry() ? 'yarn npm' : packageManager
  const command = `${baseCommand} ${args.join(' ')}`

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
