import type { GitCommit } from 'changelogen'
import type { ReleaseType } from 'semver'
import type { BumpOptions, ChangelogMonorepoConfig, PackageInfo } from '../types'
import { determineSemverChange, getGitDiff, parseCommits } from 'changelogen'
import { consola } from 'consola'
import { getPackagePatterns, loadMonorepoConfig } from '../config'
import { expandPackagesToBumpWithDependents } from '../core/dependencies'
import { getPackageCommits, getPackages, getRootPackage } from '../core/monorepo'
import { bumpPackageVersion, updateLernaVersion, writeVersion } from '../core/version'

function determineReleaseType(
  commits: GitCommit[],
  config: ChangelogMonorepoConfig,
  options: BumpOptions,
): ReleaseType | null {
  if (options.type) {
    return options.type as ReleaseType
  }

  const semverChange = determineSemverChange(commits, config)
  return semverChange || null
}

async function bumpUnifiedMode(
  rootDir: string,
  config: ChangelogMonorepoConfig,
  packages: PackageInfo[],
  options: BumpOptions,
): Promise<void> {
  consola.start('Bumping versions in unified mode...')

  const rootPackage = getRootPackage(rootDir)

  const rawCommits = await getGitDiff(config.from, config.to, rootDir)
  const commits = parseCommits(rawCommits, config)

  consola.info(`Found ${commits.length} commits since ${config.from}`)

  const releaseType = determineReleaseType(commits, config, options)

  if (!releaseType) {
    consola.warn('No commits require a version bump')
    return
  }

  if (options.type) {
    consola.info(`Using specified release type: ${releaseType}`)
  }
  else {
    consola.info(`Detected release type from commits: ${releaseType}`)
  }

  const currentVersion = rootPackage.version || '0.0.0'
  const newVersion = bumpPackageVersion(currentVersion, releaseType, options.preid)

  consola.info(`Bumping all packages from ${currentVersion} to ${newVersion}`)

  const allPackages = [rootPackage, ...packages]

  for (const pkg of allPackages) {
    writeVersion(pkg.path, newVersion, options.dryRun)
  }

  if (newVersion) {
    updateLernaVersion(rootDir, newVersion, options.dryRun)
  }

  consola.success(`All ${allPackages.length} packages bumped to ${newVersion}`)
}

async function bumpPackageIndependently(
  pkg: PackageInfo,
  config: ChangelogMonorepoConfig,
  rootDir: string,
  options: BumpOptions,
  forcedBumpType?: ReleaseType,
): Promise<{ bumped: boolean, newVersion?: string }> {
  consola.info(`Analyzing ${pkg.name}...`)

  const commits = await getPackageCommits(pkg, config, rootDir)

  let releaseType: ReleaseType | null = null

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

async function bumpIndependentMode(
  rootDir: string,
  config: ChangelogMonorepoConfig,
  packages: PackageInfo[],
  options: BumpOptions,
): Promise<void> {
  consola.start('Bumping versions in independent mode...')

  const rootPackage = getRootPackage(rootDir)

  // First, identify packages with commits
  const packagesWithCommits: PackageInfo[] = []
  for (const pkg of packages) {
    const commits = await getPackageCommits(pkg, config, rootDir)
    if (commits.length > 0) {
      packagesWithCommits.push(pkg)
    }
  }

  consola.info(`Found ${packagesWithCommits.length} package(s) with commits`)

  // Expand with dependent packages
  const allPackagesToBump = expandPackagesToBumpWithDependents(packagesWithCommits, packages)

  consola.info(`Total packages to bump (including dependents): ${allPackagesToBump.length}`)

  let bumpedByCommits = 0
  let bumpedByDependency = 0

  for (const pkgToBump of allPackagesToBump) {
    const forcedBumpType = pkgToBump.reason === 'dependency' ? 'patch' : undefined
    const result = await bumpPackageIndependently(pkgToBump, config, rootDir, options, forcedBumpType)

    if (result.bumped) {
      if (pkgToBump.reason === 'commits') {
        bumpedByCommits++
      }
      else {
        bumpedByDependency++
      }
    }
  }

  writeVersion(rootPackage.path, rootPackage.version || '0.0.0', options.dryRun)

  if (bumpedByCommits === 0 && bumpedByDependency === 0) {
    consola.warn('No packages were bumped')
  }
  else {
    consola.success(
      `${bumpedByCommits + bumpedByDependency} package(s) bumped independently `
      + `(${bumpedByCommits} from commits, ${bumpedByDependency} from dependencies)`,
    )
  }
}
async function getPackageToBump({
  packages,
  config,
  rootDir,
}: {
  packages: PackageInfo[]
  config: ChangelogMonorepoConfig
  rootDir: string
}) {
  // First, identify packages with commits
  const packagesWithCommits: PackageInfo[] = []
  for (const pkg of packages) {
    const commits = await getPackageCommits(pkg, config, rootDir)
    if (commits.length > 0) {
      packagesWithCommits.push(pkg)
      consola.info(`  ${pkg.name}: ${commits.length} commit(s) found`)
    }
    else {
      consola.info(`  ${pkg.name}: no commits`)
    }
  }

  // Expand with dependent packages (transitive)
  const allPackagesToBump = expandPackagesToBumpWithDependents(packagesWithCommits, packages)

  return allPackagesToBump
}

async function bumpSelectiveMode(
  rootDir: string,
  config: ChangelogMonorepoConfig,
  packages: PackageInfo[],
  options: BumpOptions,
): Promise<void> {
  consola.start('Bumping versions in selective mode...')

  const rootPackage = getRootPackage(rootDir)

  const rawCommits = await getGitDiff(config.from, config.to, rootDir)
  const allCommits = parseCommits(rawCommits, config)

  consola.info(`Found ${allCommits.length} commits since ${config.from}`)

  const releaseType = determineReleaseType(allCommits, config, options)

  if (!releaseType) {
    consola.warn('No commits require a version bump')
    return
  }

  if (options.type) {
    consola.info(`Using specified release type: ${releaseType}`)
  }
  else {
    consola.info(`Detected release type from commits: ${releaseType}`)
  }

  const packagesToBump = await getPackageToBump({
    packages,
    config,
    rootDir,
  })

  if (packagesToBump.length === 0) {
    consola.warn('No packages have commits, skipping bump')
    return
  }

  const currentVersion = rootPackage.version || '0.0.0'
  const newVersion = bumpPackageVersion(currentVersion, releaseType, options.preid)

  const bumpedByCommits = packagesToBump.filter(p => p.reason === 'commits').length
  const bumpedByDependency = packagesToBump.filter(p => p.reason === 'dependency').length

  consola.info(
    `Bumping ${packagesToBump.length} package(s) from ${currentVersion} to ${newVersion} `
    + `(${bumpedByCommits} from commits, ${bumpedByDependency} from dependencies)`,
  )

  for (const pkg of packagesToBump) {
    writeVersion(pkg.path, newVersion, options.dryRun)
  }

  writeVersion(rootPackage.path, newVersion, options.dryRun)

  if (newVersion) {
    updateLernaVersion(rootDir, newVersion, options.dryRun)
  }

  consola.success(
    `${packagesToBump.length} package(s) bumped to ${newVersion} (${packages.length - packagesToBump.length} skipped)`,
  )
}

export async function bumpCommand(options: BumpOptions = {}): Promise<void> {
  try {
    consola.start('Bumping versions...')

    const rootDir = process.cwd()
    const config = await loadMonorepoConfig(rootDir)
    const patterns = getPackagePatterns(config.monorepo)
    const packages = getPackages(rootDir, patterns, config)

    consola.info(`Found ${packages.length} packages matching patterns: ${patterns.join(', ')}`)

    if (config.monorepo.versionMode === 'unified') {
      await bumpUnifiedMode(rootDir, config, packages, options)
    }
    else if (config.monorepo.versionMode === 'selective') {
      await bumpSelectiveMode(rootDir, config, packages, options)
    }
    else {
      await bumpIndependentMode(rootDir, config, packages, options)
    }

    if (options.dryRun) {
      consola.info('[DRY RUN] No files were modified')
    }

    consola.success('Version bump completed!')
  }
  catch (error) {
    consola.error('Error bumping versions:', (error as Error).message)
    throw error
  }
}
