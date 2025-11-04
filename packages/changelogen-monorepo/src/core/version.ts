import type { GitCommit } from 'changelogen'
import type { ReleaseType } from 'semver'
import type { PackageToBump, ResolvedChangelogMonorepoConfig } from '../core'
import type { BumpOptions, PackageInfo, PackageWithCommits, VersionMode } from '../types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { confirm } from '@inquirer/prompts'
import { logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'
import { determineSemverChange } from 'changelogen'
import * as semver from 'semver'
import { expandPackagesToBumpWithDependents, resolveTags } from '../core'
import { getPackageCommits, hasLernaJson } from './monorepo'

export function determineReleaseType({
  currentVersion,
  from,
  to,
  commits,
  config,
  force,
  graduating,
}: {
  currentVersion: string
  from: string
  to: string
  commits?: GitCommit[]
  config: ResolvedChangelogMonorepoConfig
  force: boolean
  graduating?: boolean
}): BumpOptions['type'] | null {
  const configWithRange = {
    ...config,
    from,
    to,
  }

  let releaseType: BumpOptions['type'] | null = configWithRange.bump.type

  if (graduating) {
    logger.debug(`Graduating to stable release type: ${releaseType}`)
  }
  else if (isGraduatingBetweenPreleases(currentVersion, configWithRange.bump.preid)) {
    const currentPreid = getPreid(currentVersion)
    logger.debug(`Graduating from ${currentPreid} to ${configWithRange.bump.preid} prerelease`)
    releaseType = 'prerelease'
  }
  else if (!commits?.length && !force) {
    logger.debug(`No commits found, skipping bump`)
    releaseType = null
  }
  else if (releaseType && releaseType !== 'release') {
    logger.debug(`Using specified release type: ${releaseType}`)
  }
  else if (commits && commits.length > 0) {
    const serverChange = determineSemverChange(commits, configWithRange) as 'major' | 'minor' | 'patch' | null
    const type = (releaseType.includes('pre') && serverChange ? `pre${serverChange}` : serverChange) as BumpOptions['type'] | null
    logger.debug(`Using detected release type: ${type}`)
    releaseType = type
  }

  if (force) {
    releaseType = configWithRange.bump.type
  }

  return releaseType
}

export function writeVersion(pkgPath: string, version: string, dryRun = false): void {
  const packageJsonPath = join(pkgPath, 'package.json')

  try {
    logger.debug(`Writing ${version} to ${pkgPath}`)

    const content = readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(content)

    const oldVersion = packageJson.version
    packageJson.version = version

    if (dryRun) {
      logger.info(`[dry-run] Updated ${packageJson.name}: ${oldVersion} → ${version}`)
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
  releaseType: ReleaseType,
  preid?: string,
): string {
  const newVersion = semver.inc(currentVersion, releaseType, preid as string)

  if (!newVersion) {
    throw new Error(`Unable to bump version "${currentVersion}" with release type "${releaseType}"`)
  }

  if (isGraduating(currentVersion, releaseType)) {
    logger.info(`Graduating from prerelease ${currentVersion} to stable ${newVersion}`)
  }

  return newVersion
}

export function updateLernaVersion({
  rootDir,
  versionMode,
  version,
  dryRun = false,
}: {
  rootDir: string
  versionMode: VersionMode
  version: string
  dryRun?: boolean
}): void {
  const lernaJsonExists = hasLernaJson(rootDir)

  if (!lernaJsonExists) {
    return
  }

  const lernaJsonPath = join(rootDir, 'lerna.json')

  if (!existsSync(lernaJsonPath)) {
    return
  }

  try {
    logger.debug('Updating lerna.json version')

    const content = readFileSync(lernaJsonPath, 'utf8')
    const lernaJson = JSON.parse(content)

    const oldVersion = lernaJson.version

    if (lernaJson.version === 'independent' || versionMode === 'independent') {
      logger.debug('Lerna version is independent or version mode is independent, skipping update')
      return
    }

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

export function extractVersionFromPackageTag(tag: string): string | null {
  const atIndex = tag.lastIndexOf('@')
  if (atIndex === -1) {
    return null
  }
  return tag.slice(atIndex + 1)
}

export function isPrerelease(version?: string): boolean {
  if (!version)
    return false
  const parsed = semver.parse(version)
  return parsed ? parsed.prerelease.length > 0 : false
}

export function isStableReleaseType(releaseType: ReleaseType): boolean {
  const stableTypes = ['release', 'major', 'minor', 'patch']
  return stableTypes.includes(releaseType)
}

export function isGraduating(currentVersion: string, releaseType: ReleaseType): boolean {
  return isPrerelease(currentVersion) && isStableReleaseType(releaseType)
}

export function getPreid(version: string): string | null {
  if (!version)
    return null
  const parsed = semver.parse(version)
  if (!parsed || parsed.prerelease.length === 0) {
    return null
  }
  return parsed.prerelease[0] as string
}

export function isGraduatingBetweenPreleases(
  currentVersion: string,
  targetPreid?: string,
): boolean {
  if (!targetPreid || !isPrerelease(currentVersion)) {
    return false
  }

  const currentPreid = getPreid(currentVersion)

  if (!currentPreid) {
    return false
  }

  return currentPreid !== targetPreid
}

export function bumpPackageIndependently({
  pkg,
  dryRun,
}: {
  pkg: PackageToBump & PackageInfo
  dryRun: boolean
}): { bumped: true, newVersion: string, oldVersion: string } | { bumped: false } {
  logger.debug(`Analyzing ${pkg.name}`)

  const currentVersion = pkg.version || '0.0.0'
  const newVersion = pkg.version

  logger.debug(`Bumping ${pkg.name} from ${currentVersion} to ${newVersion}`)

  writeVersion(pkg.path, newVersion, dryRun)
  return { bumped: true, newVersion, oldVersion: currentVersion }
}

function displayRootAndLernaUpdates({
  versionMode,
  currentVersion,
  newVersion,
  dryRun,
  lernaJsonExists,
}: {
  versionMode: VersionMode
  currentVersion?: string
  newVersion?: string
  dryRun: boolean
  lernaJsonExists: boolean
}) {
  if (versionMode !== 'independent' && currentVersion && newVersion) {
    logger.log(`${dryRun ? '[dry-run] ' : ''}Root package.json: ${currentVersion} → ${newVersion}`)
    logger.log('')

    if (lernaJsonExists) {
      logger.log(`${dryRun ? '[dry-run] ' : ''}lerna.json: ${currentVersion} → ${newVersion}`)
      logger.log('')
    }
  }
}

function displayUnifiedModePackages({
  packages,
  newVersion,
  force,
}: {
  packages: PackageInfo[]
  newVersion: string
  force: boolean
}) {
  logger.log(`${packages.length} package(s)${force ? ' (force)' : ''}:`)
  packages.forEach((pkg) => {
    logger.log(`  • ${pkg.name}: ${pkg.version} → ${newVersion}`)
  })
  logger.log('')
}

function displaySelectiveModePackages({
  packages,
  newVersion,
  force,
}: {
  packages: PackageInfo[]
  newVersion: string
  force: boolean
}) {
  if (force) {
    logger.log(`${packages.length} package(s) (force):`)
    packages.forEach((pkg) => {
      logger.log(`  • ${pkg.name}: ${pkg.version} → ${newVersion}`)
    })
    logger.log('')
  }
  else {
    const packagesWithCommits = packages.filter(p => 'reason' in p && p.reason === 'commits')
    const packagesAsDependents = packages.filter(p => 'reason' in p && p.reason === 'dependency')

    if (packagesWithCommits.length > 0) {
      logger.log(`${packagesWithCommits.length} package(s) with commits:`)
      packagesWithCommits.forEach((pkg) => {
        logger.log(`  • ${pkg.name}: ${pkg.version} → ${newVersion}`)
      })
      logger.log('')
    }

    if (packagesAsDependents.length > 0) {
      logger.log(`${packagesAsDependents.length} dependent package(s):`)
      packagesAsDependents.forEach((pkg) => {
        logger.log(`  • ${pkg.name}: ${pkg.version} → ${newVersion}`)
      })
      logger.log('')
    }
  }
}

function displayIndependentModePackages({
  packages,
  force,
  dryRun,
}: {
  packages: PackageInfo[]
  force: boolean
  dryRun: boolean
}) {
  if (force) {
    logger.log(`${dryRun ? '[dry-run] ' : ''}${packages.length} package(s) (force):`)
    packages.forEach((pkg) => {
      logger.log(`  • ${pkg.name}: ${pkg.currentVersion} → ${pkg.version}`)
    })
    logger.log('')
  }
  else {
    const packagesWithCommits = packages.filter(p => 'reason' in p && p.reason === 'commits')
    const packagesAsDependents = packages.filter(p => 'reason' in p && p.reason === 'dependency')

    if (packagesWithCommits.length > 0) {
      logger.log(`${dryRun ? '[dry-run] ' : ''}${packagesWithCommits.length} package(s) with commits:`)
      packagesWithCommits.forEach((pkg) => {
        logger.log(`  • ${pkg.name}: ${pkg.currentVersion} → ${pkg.version}`)
      })
      logger.log('')
    }

    if (packagesAsDependents.length > 0) {
      logger.log(`${dryRun ? '[dry-run] ' : ''}${packagesAsDependents.length} dependent package(s):`)
      packagesAsDependents.forEach((pkg) => {
        logger.log(`  • ${pkg.name}: ${pkg.currentVersion} → ${pkg.version}`)
      })
      logger.log('')
    }
  }
}

export async function confirmBump({
  versionMode,
  config,
  packages,
  force,
  currentVersion,
  newVersion,
  dryRun,
}: {
  versionMode: VersionMode
  config: ResolvedChangelogMonorepoConfig
  packages: PackageInfo[]
  force: boolean
  currentVersion?: string
  newVersion?: string
  dryRun: boolean
}) {
  const lernaJsonExists = hasLernaJson(config.cwd)

  logger.log('')
  logger.info(`${dryRun ? '[dry-run] ' : ''}The following packages will be updated:\n`)

  displayRootAndLernaUpdates({
    versionMode,
    currentVersion,
    newVersion,
    lernaJsonExists,
    dryRun,
  })

  if (versionMode === 'unified' && newVersion) {
    displayUnifiedModePackages({ packages, newVersion, force })
  }
  else if (versionMode === 'selective' && newVersion) {
    displaySelectiveModePackages({ packages, newVersion, force })
  }
  else if (versionMode === 'independent') {
    displayIndependentModePackages({ packages, force, dryRun })
  }

  try {
    const confirmed = await confirm({
      message: `${dryRun ? '[dry-run] ' : ''}Do you want to proceed with these version updates?`,
      default: true,
    })

    if (!confirmed) {
      logger.warn('Bump cancelled by user')
      process.exit(0)
    }
  }
  catch {
    logger.error('Error while confirming bump')
    process.exit(1)
  }

  logger.log('')
}

async function findPackagesWithCommits({
  packages,
  config,
  force,
}: {
  packages: PackageInfo[]
  config: ResolvedChangelogMonorepoConfig
  force: boolean
}): Promise<PackageWithCommits[]> {
  const packagesWithCommits: PackageWithCommits[] = []

  logger.debug(`Checking for commits in ${packages.length} package(s)`)

  for (const pkg of packages) {
    const { from, to, graduating } = await resolveTags<'independent', 'bump'>({
      config,
      versionMode: 'independent',
      step: 'bump',
      currentVersion: pkg.version,
      newVersion: undefined,
      pkg,
      logLevel: config.logLevel,
    })

    const commits = await getPackageCommits({
      pkg,
      from,
      to,
      config,
      changelog: false,
    })

    if (commits.length <= 0 && !force) {
      logger.debug(`${pkg.name}: No commits found, skipping`)
      continue
    }

    packagesWithCommits.push({ ...pkg, commits, graduating })
    logger.debug(`${pkg.name}: ${commits.length} commit(s)`)
  }

  return packagesWithCommits
}

async function calculatePackageNewVersion({
  pkg,
  config,
  force,
}: {
  pkg: PackageToBump
  config: ResolvedChangelogMonorepoConfig
  force: boolean
}): Promise<(PackageInfo & PackageToBump) | null> {
  const releaseType = config.bump.type

  const { from, to, graduating } = await resolveTags<'independent', 'bump'>({
    config,
    versionMode: 'independent',
    step: 'bump',
    currentVersion: pkg.version,
    newVersion: undefined,
    pkg,
    logLevel: config.logLevel,
  })

  const forcedBump = pkg.reason === 'dependency'

  let forcedBumpType: BumpOptions['type'] | undefined
  if (forcedBump) {
    if (isStableReleaseType(releaseType)) {
      forcedBumpType = 'patch'
    }
    else {
      forcedBumpType = isPrerelease(pkg.version) ? 'prerelease' : 'prepatch'
    }
  }

  const commits = pkg.commits?.length > 0
    ? pkg.commits
    : await getPackageCommits({
        pkg,
        from,
        to,
        config,
        changelog: false,
      })

  let calculatedReleaseType: BumpOptions['type'] | null = null

  if (forcedBumpType) {
    calculatedReleaseType = forcedBumpType
  }
  else if (commits.length === 0 && !force) {
    return null
  }
  else {
    calculatedReleaseType = determineReleaseType({ from, to, commits, config, force, currentVersion: pkg.version, graduating })
    if (!calculatedReleaseType) {
      return null
    }
  }

  const currentVersion = pkg.version || '0.0.0'
  const newVersion = bumpPackageVersion(currentVersion, calculatedReleaseType, config.bump.preid)

  return {
    name: pkg.name,
    path: pkg.path,
    currentVersion,
    version: newVersion,
    fromTag: from,
    reason: pkg.reason,
    commits,
    dependencyChain: pkg.dependencyChain,
  }
}

async function calculateNewVersionsForPackages({
  allPackagesToBump,
  config,
  force,
}: {
  allPackagesToBump: PackageToBump[]
  config: ResolvedChangelogMonorepoConfig
  force: boolean
}): Promise<(PackageInfo & PackageToBump)[]> {
  const packagesWithNewVersions: (PackageInfo & PackageToBump)[] = []

  for (const pkgToBump of allPackagesToBump) {
    const packageWithNewVersion = await calculatePackageNewVersion({
      pkg: pkgToBump,
      config,
      force,
    })

    if (packageWithNewVersion) {
      packagesWithNewVersions.push(packageWithNewVersion)
    }
  }

  return packagesWithNewVersions
}

export async function findPackagesWithCommitsAndCalculateVersions({
  packages,
  config,
  force,
}: {
  packages: PackageInfo[]
  config: ResolvedChangelogMonorepoConfig
  force: boolean
}): Promise<(PackageInfo & PackageToBump)[]> {
  const packagesWithCommits = await findPackagesWithCommits({
    packages,
    config,
    force,
  })

  if (packagesWithCommits.length === 0) {
    return []
  }

  const allPackagesToBump = expandPackagesToBumpWithDependents({
    allPackages: packages,
    packagesWithCommits,
    dependencyTypes: config.bump.dependencyTypes,
  })

  logger.debug(`Total packages to bump (including dependents): ${allPackagesToBump.length}`)

  const packagesWithNewVersions = await calculateNewVersionsForPackages({
    allPackagesToBump,
    config,
    force,
  })

  logger.debug(`Found ${packagesWithNewVersions.length} package(s) to bump`)

  return packagesWithNewVersions
}

export function bumpIndependentPackages({
  packages,
  dryRun,
}: {
  packages: (PackageToBump & PackageInfo)[]
  dryRun: boolean
}) {
  const bumpedPackages: PackageInfo[] = []

  for (const pkgToBump of packages) {
    logger.debug(`Bumping ${pkgToBump.name} from ${pkgToBump.currentVersion} to ${pkgToBump.version} (reason: ${pkgToBump.reason})`)

    const result = bumpPackageIndependently({
      pkg: pkgToBump,
      dryRun,
    })

    if (result.bumped) {
      bumpedPackages.push({
        ...pkgToBump,
        version: result.newVersion,
      })
    }
  }

  return bumpedPackages
}
