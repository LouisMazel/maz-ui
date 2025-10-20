import type { GitCommit } from 'changelogen'
import type { ReleaseType } from 'semver'
import type { ResolvedChangelogMonorepoConfig } from '../config'
import type { BumpOptions, PackageInfo } from '../types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise } from '@maz-ui/node'
import { determineSemverChange } from 'changelogen'
import { consola } from 'consola'
import * as semver from 'semver'
import { getPackageCommits } from './monorepo'

export function determineReleaseType(
  commits: GitCommit[],
  config: ResolvedChangelogMonorepoConfig,
): BumpOptions['type'] | null {
  if (config.bump.type && config.bump.type !== 'release') {
    return config.bump.type
  }

  return determineSemverChange(commits, config)
}

export function writeVersion(pkgPath: string, version: string, dryRun = false): void {
  const packageJsonPath = join(pkgPath, 'package.json')

  try {
    const content = readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(content)

    const oldVersion = packageJson.version
    packageJson.version = version

    if (dryRun) {
      consola.info(`[DRY RUN] Would update ${packageJsonPath}: ${oldVersion} → ${version}`)
      return
    }

    writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8')
    consola.success(`Updated ${packageJsonPath}: ${oldVersion} → ${version}`)
  }
  catch (error) {
    throw new Error(`Unable to write version to ${packageJsonPath}: ${(error as Error).message}`)
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
      consola.info(`[DRY RUN] Would update ${lernaJsonPath}: ${oldVersion} → ${version}`)
      return
    }

    writeFileSync(lernaJsonPath, `${JSON.stringify(lernaJson, null, 2)}\n`, 'utf8')
    consola.success(`Updated lerna.json: ${oldVersion} → ${version}`)
  }
  catch (error) {
    consola.warn(`Unable to update lerna.json: ${(error as Error).message}`)
  }
}

export function isPrerelease(version?: string): boolean {
  if (!version)
    return false
  const parsed = semver.parse(version)
  return parsed ? parsed.prerelease.length > 0 : false
}

export async function getLastTag(version?: string, onlyStable?: boolean): Promise<string> {
  if (onlyStable || (!isPrerelease(version) && !onlyStable)) {
    const { stdout } = await execPromise(
      'git tag --sort=-v:refname | grep -E \'^v[0-9]+\\.[0-9]+\\.[0-9]+$\' | sed -n \'1p\'',
      {
        noSuccess: true,
        noStdout: true,
      },
    )
    return stdout.trim()
  }

  const { stdout } = await execPromise('git tag --sort=-v:refname | sed -n \'1p\'', {
    noSuccess: true,
    noStdout: true,
  })
  return stdout.trim()
}

export async function getLastPackageTag(packageName: string, onlyStable?: boolean): Promise<string | null> {
  try {
    const escapedPackageName = packageName.replace(/[@/]/g, '\\$&')

    let grepPattern: string
    if (onlyStable) {
      grepPattern = `^${escapedPackageName}@[0-9]+\\.[0-9]+\\.[0-9]+$`
    }
    else {
      grepPattern = `^${escapedPackageName}@`
    }

    const { stdout } = await execPromise(
      `git tag --sort=-v:refname | grep -E '${grepPattern}' | sed -n '1p'`,
      {
        noSuccess: true,
        noStdout: true,
      },
    )

    const tag = stdout.trim()
    return tag || null
  }
  catch {
    return null
  }
}

export function extractVersionFromPackageTag(tag: string): string | null {
  const atIndex = tag.lastIndexOf('@')
  if (atIndex === -1) {
    return null
  }
  return tag.slice(atIndex + 1)
}

export function isGraduating(currentVersion: string, newVersion: string): boolean {
  return isPrerelease(currentVersion) && !isPrerelease(newVersion)
}

export async function bumpPackageIndependently({
  pkg,
  config,
  forcedBumpType,
  fromTag,
  dryRun,
}: {
  pkg: PackageInfo
  config: ResolvedChangelogMonorepoConfig
  forcedBumpType?: BumpOptions['type']
  fromTag?: string
  dryRun: boolean
}): Promise<{ bumped: true, newVersion: string } | { bumped: false }> {
  consola.info(`Analyzing ${pkg.name}`)

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
    consola.info(`  Using forced bump type (dependency updated): ${releaseType}`)
  }
  else if (commits.length === 0) {
    consola.info(`  No commits found for ${pkg.name}, skipping bump`)
    return { bumped: false }
  }
  else {
    consola.info(`  Found ${commits.length} commits for ${pkg.name}`)
    releaseType = determineReleaseType(commits, config)

    if (!releaseType) {
      consola.info(`  No version bump required for ${pkg.name}`)
      return { bumped: false }
    }

    if (config.bump.type) {
      consola.info(`  Using specified release type: ${releaseType}`)
    }
    else {
      consola.info(`  Detected release type: ${releaseType}`)
    }
  }

  const currentVersion = pkg.version || '0.0.0'
  const newVersion = bumpPackageVersion(currentVersion, releaseType, config.bump.preid)

  consola.info(`  Bumping ${pkg.name} from ${currentVersion} to ${newVersion}`)

  writeVersion(pkg.path, newVersion, dryRun)
  return { bumped: true, newVersion }
}
