import type { GitCommit } from 'changelogen'
import type { ReleaseType } from 'semver'
import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { BumpOptions, PackageInfo } from '../types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'
import { determineSemverChange } from 'changelogen'
import * as semver from 'semver'
import { getPackageCommits } from './monorepo'

export function determineReleaseType({
  commits,
  config,
  force,
  graduating,
}: {
  commits?: GitCommit[]
  config: ResolvedChangelogMonorepoConfig
  force: boolean
  graduating?: boolean
}): BumpOptions['type'] | null {
  if (graduating) {
    return config.bump.type
  }

  if (!commits?.length && !force) {
    return undefined
  }

  if (config.bump.type && config.bump.type !== 'release') {
    return config.bump.type
  }

  if (config.bump.type === 'release' && isPrerelease(config.from)) {
    return 'release'
  }

  if (commits) {
    return determineSemverChange(commits, config)
  }

  return force ? config.bump.type : undefined
}

export function writeVersion(pkgPath: string, version: string, dryRun = false): void {
  const packageJsonPath = join(pkgPath, 'package.json')

  try {
    const content = readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(content)

    const oldVersion = packageJson.version
    packageJson.version = version

    if (dryRun) {
      logger.info(`[dry-run] Update ${packageJson.name}: ${oldVersion} → ${version}`)
      return
    }

    writeFileSync(packageJsonPath, `${formatJson(packageJson)}\n`, 'utf8')
    logger.info(`Updated ${packageJson.name}: ${oldVersion} → ${version}`)
  }
  catch (error) {
    throw new Error(`Unable to write version to ${packageJsonPath}: ${error}`)
  }
}

export function bumpPackageVersion(
  currentVersion: string,
  release: ReleaseType,
  preid?: string,
): string {
  const newVersion = semver.inc(currentVersion, release, preid as string)

  if (!newVersion) {
    throw new Error(`Unable to bump version "${currentVersion}" with release type "${release}"`)
  }

  return newVersion
}

export function updateLernaVersion(
  rootDir: string,
  version: string,
  dryRun = false,
): void {
  const lernaJsonPath = join(rootDir, 'lerna.json')

  if (!existsSync(lernaJsonPath)) {
    return
  }

  try {
    const content = readFileSync(lernaJsonPath, 'utf8')
    const lernaJson = JSON.parse(content)

    const oldVersion = lernaJson.version
    lernaJson.version = version

    if (dryRun) {
      logger.info(`[dry-run] update lerna.json: ${oldVersion} → ${version}`)
      return
    }

    writeFileSync(lernaJsonPath, `${formatJson(lernaJson)}\n`, 'utf8')
    logger.success(`Updated lerna.json: ${oldVersion} → ${version}`)
  }
  catch (error) {
    logger.warn(`Unable to update lerna.json: ${error}`)
  }
}

export function isPrerelease(version?: string): boolean {
  if (!version)
    return false
  const parsed = semver.parse(version)
  return parsed ? parsed.prerelease.length > 0 : false
}

export function extractVersionFromPackageTag(tag: string): string | null {
  const atIndex = tag.lastIndexOf('@')
  if (atIndex === -1) {
    return null
  }
  return tag.slice(atIndex + 1)
}

export function isGraduating(currentVersion: string, releaseType: ReleaseType): boolean {
  return isPrerelease(currentVersion) && isStableReleaseType(releaseType)
}

export async function bumpPackageIndependently({
  pkg,
  config,
  forcedBumpType,
  fromTag,
  dryRun,
  force,
}: {
  pkg: PackageInfo
  config: ResolvedChangelogMonorepoConfig
  forcedBumpType?: BumpOptions['type']
  fromTag?: string
  dryRun: boolean
  force: boolean
}): Promise<{ bumped: true, newVersion: string, oldVersion: string } | { bumped: false }> {
  logger.debug(`Analyzing ${pkg.name}`)

  const commits = await getPackageCommits({
    pkg,
    config: {
      ...config,
      from: fromTag || config.from,
    },
  })

  let releaseType: BumpOptions['type'] | null = null

  if (forcedBumpType) {
    releaseType = forcedBumpType
    logger.debug(`Using forced bump type (dependency updated): ${releaseType}`)
  }
  else if (commits.length === 0) {
    logger.debug(`No commits found for ${pkg.name}, skipping bump`)
    return { bumped: false }
  }
  else {
    logger.debug(`Found ${commits.length} commits for ${pkg.name}`)
    releaseType = determineReleaseType({ commits, config, force })

    if (!releaseType) {
      logger.debug(`No version bump required for ${pkg.name}`)
      return { bumped: false }
    }

    if (config.bump.type) {
      logger.debug(`Using specified release type: ${releaseType}`)
    }
    else {
      logger.debug(`Detected release type: ${releaseType}`)
    }
  }

  const currentVersion = pkg.version || '0.0.0'
  const newVersion = bumpPackageVersion(currentVersion, releaseType, config.bump.preid)

  logger.info(`Bumping ${pkg.name} from ${currentVersion} to ${newVersion}`)

  writeVersion(pkg.path, newVersion, dryRun)
  return { bumped: true, newVersion, oldVersion: currentVersion }
}

export function isStableReleaseType(releaseType: ReleaseType): boolean {
  const stableTypes = ['release', 'major', 'minor', 'patch']
  return stableTypes.includes(releaseType)
}
