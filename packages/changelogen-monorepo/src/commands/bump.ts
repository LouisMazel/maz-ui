import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { BumpOptions, BumpResult, PackageInfo, PackageWithCommits } from '../types'
import { logger } from '@maz-ui/node'
import { getGitDiff, parseCommits } from 'changelogen'
import { bumpPackageIndependently, bumpPackageVersion, determinePackageFromTag, determineReleaseType, expandPackagesToBumpWithDependents, getLastTag, getPackageCommits, getPackages, getPackageToBump, getRootPackage, isGraduating, loadMonorepoConfig, updateLernaVersion, writeVersion } from '../core'

interface BumpStrategyInput {
  config: ResolvedChangelogMonorepoConfig
  packages: PackageInfo[]
  dryRun: boolean
  force: boolean
}

async function bumpUnifiedMode({
  config,
  packages,
  dryRun,
  force,
}: BumpStrategyInput): Promise<BumpResult> {
  logger.debug('Starting bump in unified mode')

  const rootPackage = getRootPackage(config.cwd)
  const currentVersion = rootPackage.version

  const fromTag = config.from
  logger.debug(`Fetching commits from ${fromTag} to ${config.to}`)
  const rawCommits = await getGitDiff(fromTag, config.to, config.cwd)
  const commits = parseCommits(rawCommits, config)

  logger.debug(`Found ${commits.length} commits since ${fromTag}`)

  const releaseType = determineReleaseType({
    commits,
    config,
    force,
    graduating: isGraduating(currentVersion, config.bump.type),
  })

  if (!releaseType) {
    logger.debug('No commits require a version bump')
    return { bumped: false }
  }

  if (config.bump.type && force) {
    logger.debug(`Using specified release type: ${releaseType}`)
  }
  else {
    logger.debug(`Detected release type from commits: ${releaseType}`)
  }

  const newVersion = bumpPackageVersion(currentVersion, releaseType, config.bump.preid)

  logger.info(`${currentVersion} → ${newVersion} (unified mode)`)

  const allPackages = [rootPackage, ...packages]

  logger.debug(`Writing version to ${allPackages.length} package(s)`)
  for (const pkg of allPackages) {
    writeVersion(pkg.path, newVersion, dryRun)
  }

  if (newVersion) {
    logger.debug('Updating lerna.json version')
    updateLernaVersion(config.cwd, newVersion, dryRun)
  }

  if (!dryRun) {
    logger.info(`All ${allPackages.length} package(s) bumped to ${newVersion}`)
  }

  return {
    bumped: true,
    oldVersion: currentVersion,
    newVersion,
    bumpedPackages: packages.map(pkg => ({
      ...pkg,
      version: newVersion,
    })),
  }
}

async function bumpIndependentMode({
  config,
  packages,
  dryRun,
  force,
}: BumpStrategyInput): Promise<BumpResult> {
  logger.debug('Starting bump in independent mode')

  const releaseType = config.bump.type
  const packagesWithCommits: PackageWithCommits[] = []

  logger.debug(`Checking for commits in ${packages.length} package(s)`)

  for (const pkg of packages) {
    const fromTag = await determinePackageFromTag({
      packageName: pkg.name,
      globalFrom: config.from,
      releaseType,
      logLevel: config.logLevel,
    })

    logger.debug(`Checking commits for ${pkg.name} since ${fromTag}`)
    const commits = await getPackageCommits({
      pkg,
      config: {
        ...config,
        from: fromTag,
      },
    })

    if (commits.length > 0 || force) {
      packagesWithCommits.push({ ...pkg, commits })
      logger.debug(`${pkg.name}: ${commits.length} commit(s)`)
    }
  }

  if (packagesWithCommits.length === 0) {
    logger.debug('No packages have commits')
    return { bumped: false }
  }

  logger.debug(`Found ${packagesWithCommits.length} package(s) to bump`)

  const allPackagesToBump = expandPackagesToBumpWithDependents(packagesWithCommits, packages)

  logger.debug(`Total packages to bump (including dependents): ${allPackagesToBump.length}`)

  const bumpedPackages: PackageInfo[] = []

  for (const pkgToBump of allPackagesToBump) {
    const fromTag = await determinePackageFromTag({
      packageName: pkgToBump.name,
      globalFrom: config.from,
      releaseType,
      logLevel: config.logLevel,
    })

    const forcedBumpType = pkgToBump.reason === 'dependency' ? 'patch' : undefined
    logger.debug(`Bumping ${pkgToBump.name} (reason: ${pkgToBump.reason})`)

    const result = await bumpPackageIndependently({
      pkg: pkgToBump,
      config,
      forcedBumpType,
      fromTag,
      dryRun,
      force,
    })

    if (result.bumped) {
      bumpedPackages.push({
        name: pkgToBump.name,
        path: pkgToBump.path,
        version: result.newVersion,
      })
      logger.info(`${pkgToBump.name}: ${result.oldVersion} → ${result.newVersion}`)
    }
  }

  const bumpedByCommits = bumpedPackages.filter(p =>
    allPackagesToBump.find(pkg => pkg.name === p.name)?.reason === 'commits',
  ).length
  const bumpedByDependency = bumpedPackages.length - bumpedByCommits

  if (bumpedPackages.length === 0) {
    logger.debug('No packages were bumped')
  }
  else {
    logger.info(
      `${bumpedPackages.length} package(s) bumped independently `
      + `(${bumpedByCommits} from commits, ${bumpedByDependency} from dependencies)`,
    )
  }

  return {
    bumped: bumpedPackages.length > 0,
    bumpedPackages,
  }
}

async function bumpSelectiveMode({
  config,
  packages,
  dryRun,
  force,
}: BumpStrategyInput): Promise<BumpResult> {
  logger.debug('Starting bump in selective mode')

  const rootPackage = getRootPackage(config.cwd)
  const currentVersion = rootPackage.version

  let fromTag = config.from
  logger.debug(`Fetching commits from ${fromTag} to ${config.to}`)
  let rawCommits = await getGitDiff(fromTag, config.to, config.cwd)
  let commits = parseCommits(rawCommits, config)

  logger.debug(`Found ${commits.length} commits since ${fromTag}`)

  const graduating = isGraduating(currentVersion, config.bump.type)
  const releaseType = determineReleaseType({ commits, config, force, graduating })

  if (!releaseType) {
    logger.warn('No commits require a version bump')
    return { bumped: false }
  }

  if (config.bump.type) {
    logger.debug(`Using specified release type: ${config.bump.type}`)
  }
  else {
    logger.debug(`Detected release type from commits: ${releaseType}`)
  }

  const newVersion = bumpPackageVersion(currentVersion, releaseType, config.bump.preid)

  if (graduating) {
    logger.info(`Graduating from prerelease ${currentVersion} to stable ${newVersion}`)
    logger.debug('Recalculating commits since last stable release...')

    fromTag = await getLastTag({ version: currentVersion, onlyStable: true, logLevel: config.logLevel })
    rawCommits = await getGitDiff(fromTag, config.to, config.cwd)
    commits = parseCommits(rawCommits, config)

    logger.debug(`Found ${commits.length} commits since last stable tag ${fromTag}`)
  }

  logger.debug('Determining packages to bump...')
  const packagesToBump = force
    ? packages
    : await getPackageToBump({
        packages,
        config: {
          ...config,
          from: fromTag,
        },
      })

  if (packagesToBump.length === 0) {
    logger.debug('No packages have commits, skipping bump')
    return { bumped: false }
  }

  if (force) {
    logger.info(`${packagesToBump.length} package(s) bumped to ${newVersion} (force)`)
  }
  else {
    const bumpedByCommits = packagesToBump.filter(p => 'reason' in p && p.reason === 'commits').length
    const bumpedByDependency = packagesToBump.filter(p => 'reason' in p && p.reason === 'dependency').length

    logger.info(
      `${currentVersion} → ${newVersion} (selective mode: ${bumpedByCommits} with commits, ${bumpedByDependency} as dependents)`,
    )
  }

  logger.debug(`Writing version to ${packagesToBump.length} package(s)`)
  for (const pkg of packagesToBump) {
    logger.debug(`Writing ${newVersion} to ${pkg.name}`)
    writeVersion(pkg.path, newVersion, dryRun)
  }

  logger.debug('Updating root package version')
  writeVersion(rootPackage.path, newVersion, dryRun)
  logger.debug('Updating lerna.json version')
  updateLernaVersion(config.cwd, newVersion, dryRun)

  if (!dryRun) {
    logger.info(
      `${packagesToBump.length} package(s) bumped to ${newVersion} (${packages.length - packagesToBump.length} skipped)`,
    )
  }

  return {
    bumped: true,
    oldVersion: currentVersion,
    newVersion,
    bumpedPackages: packagesToBump.map(pkg => ({
      ...pkg,
      version: newVersion,
    })),
  }
}

export async function bump(options: BumpOptions): Promise<BumpResult> {
  try {
    logger.start('Start bumping versions')

    const dryRun = options.dryRun ?? false
    logger.debug(`Dry run: ${dryRun}`)

    const force = options.force ?? false

    const config = options.config || await loadMonorepoConfig({
      overrides: {
        bump: options,
        logLevel: options.logLevel,
      },
    })

    logger.debug(`Version mode: ${config.monorepo.versionMode}`)

    const patterns = config.monorepo.packages
    logger.debug(`Package patterns: ${patterns.join(', ')}`)
    const packages = getPackages({
      cwd: config.cwd,
      patterns,
      ignorePackageNames: config.monorepo.ignorePackageNames,
    })

    logger.debug(`Found ${packages.length} package(s)`)

    let result: BumpResult

    if (config.monorepo.versionMode === 'unified') {
      result = await bumpUnifiedMode({
        config,
        packages,
        dryRun,
        force,
      })
    }
    else if (config.monorepo.versionMode === 'selective') {
      result = await bumpSelectiveMode({
        config,
        packages,
        dryRun,
        force,
      })
    }
    else {
      result = await bumpIndependentMode({
        config,
        packages,
        dryRun,
        force,
      })
    }

    if (result.bumped) {
      logger.success(`Version bump completed (${result.bumpedPackages.length} package(s) bumped)`)
    }
    else {
      logger.fail('No packages to bump, no commits found')
    }

    return result
  }
  catch (error) {
    logger.error('Error bumping versions:', error)
    throw error
  }
}
