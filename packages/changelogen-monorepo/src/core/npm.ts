import type { ChangelogMonorepoConfig, PublishOptions } from '../types'
import type { PackageWithDeps } from './dependencies'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import { getPackageCommits, getRootPackage } from './monorepo'
import { getLastTag, isPrerelease } from './version'

export function determinePublishTag(version: string | undefined, options: PublishOptions, config: ChangelogMonorepoConfig): string {
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

export async function publishPackage({
  packagePath,
  packageName,
  version,
  options,
  config,
}: {
  packagePath: string
  packageName: string
  version: string | undefined
  options: PublishOptions
  config: ChangelogMonorepoConfig
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
