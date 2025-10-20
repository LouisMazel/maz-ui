import type { GitCommit } from 'changelogen'
import type { ReleaseType } from 'semver'
import type { BumpOptions, ChangelogMonorepoConfig, PackageInfo } from '../types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise } from '@maz-ui/node'
import { determineSemverChange } from 'changelogen'
import { consola } from 'consola'
import * as semver from 'semver'
import { getPackageCommits } from './monorepo'

export function determineReleaseType(
  commits: GitCommit[],
  config: ChangelogMonorepoConfig,
  options: Required<BumpOptions>,
): BumpOptions['type'] | null {
  if (options.type) {
    return options.type
  }

  return determineSemverChange(commits, config)
}

export function readVersion(pkgPath: string): string {
  const packageJsonPath = join(pkgPath, 'package.json')

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    return packageJson.version || '0.0.0'
  }
  catch (error) {
    throw new Error(`Unable to read version from ${packageJsonPath}: ${(error as Error).message}`)
  }
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
    throw new Error(`Unable to bump version ${currentVersion} with release type ${release}`)
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

export function isGraduating(currentVersion: string, newVersion: string): boolean {
  return isPrerelease(currentVersion) && !isPrerelease(newVersion)
}

export async function bumpPackageIndependently({
  pkg,
  config,
  options,
  forcedBumpType,
}: {
  pkg: PackageInfo
  config: ChangelogMonorepoConfig
  options: Required<BumpOptions>
  forcedBumpType?: BumpOptions['type']
}): Promise<{ bumped: boolean, newVersion?: string }> {
  consola.info(`Analyzing ${pkg.name}`)

  const commits = await getPackageCommits({
    pkg,
    config,
    from: config.from,
    to: config.to,
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
    releaseType = determineReleaseType(commits, config, options)

    if (!releaseType) {
      consola.info(`  No version bump required for ${pkg.name}`)
      return { bumped: false }
    }

    if (options.type) {
      consola.info(`  Using specified release type: ${releaseType}`)
    }
    else {
      consola.info(`  Detected release type: ${releaseType}`)
    }
  }

  const currentVersion = pkg.version || '0.0.0'
  const newVersion = bumpPackageVersion(currentVersion, releaseType, options.preid)

  consola.info(`  Bumping ${pkg.name} from ${currentVersion} to ${newVersion}`)

  writeVersion(pkg.path, newVersion, options.dryRun)
  return { bumped: true, newVersion }
}
