import type { PackageInfo, VersionMode } from '../types'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import consola from 'consola'
import * as semver from 'semver'

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
  release: semver.ReleaseType,
  preid?: string,
): string {
  const newVersion = semver.inc(currentVersion, release, preid)

  if (!newVersion) {
    throw new Error(`Unable to bump version ${currentVersion} with release type ${release}`)
  }

  return newVersion
}

export function bumpPackagesVersions(
  packages: PackageInfo[],
  versionMode: VersionMode,
  release: semver.ReleaseType,
  preid?: string,
  dryRun = false,
): Map<string, string> {
  const versionMap = new Map<string, string>()

  if (versionMode === 'unified') {
    const currentVersion = packages[0]?.version || '0.0.0'
    const newVersion = bumpPackageVersion(currentVersion, release, preid)

    for (const pkg of packages) {
      writeVersion(pkg.path, newVersion, dryRun)
      versionMap.set(pkg.name, newVersion)
    }

    consola.success(`Bumped all packages to ${newVersion}`)
  }
  else {
    for (const pkg of packages) {
      const currentVersion = pkg.version || '0.0.0'
      const newVersion = bumpPackageVersion(currentVersion, release, preid)

      writeVersion(pkg.path, newVersion, dryRun)
      versionMap.set(pkg.name, newVersion)
    }

    consola.success(`Bumped ${packages.length} packages independently`)
  }

  return versionMap
}

export function updateLernaVersion(
  rootDir: string,
  version: string,
  dryRun = false,
): void {
  const lernaJsonPath = join(rootDir, 'lerna.json')

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
