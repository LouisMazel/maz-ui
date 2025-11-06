import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { BumpConfig, BumpOptions, BumpResult, PackageInfo } from '../types'
import { logger } from '@maz-ui/node'

import { bumpIndependentPackages, bumpPackageVersion, checkGitStatusIfDirty, confirmBump, determineReleaseType, fetchGitTags, findPackagesWithCommitsAndCalculateVersions, getPackageCommits, getPackages, getPackageToBump, getRootPackage, loadMonorepoConfig, resolveTags, updateLernaVersion, writeVersion } from '../core'

interface BumpStrategyInput {
  config: ResolvedChangelogMonorepoConfig
  packages: PackageInfo[]
  dryRun: boolean
  force: boolean
  suffix: string | undefined
}

async function bumpUnifiedMode({
  config,
  packages,
  dryRun,
  force,
  suffix,
}: BumpStrategyInput): Promise<BumpResult> {
  logger.debug('Starting bump in unified mode')

  const rootPackage = getRootPackage(config.cwd)
  const currentVersion = rootPackage.version

  const { from, to } = await resolveTags<'unified', 'bump'>({
    config,
    versionMode: 'unified',
    step: 'bump',
    newVersion: undefined,
    pkg: undefined,
    currentVersion,
    logLevel: config.logLevel,
  })

  logger.debug(`Bump from ${from} to ${to}`)

  const commits = await getPackageCommits({
    pkg: rootPackage,
    from,
    to,
    config,
    changelog: false,
  })

  logger.debug(`Found ${commits.length} commits since ${from}`)

  const releaseType = determineReleaseType({
    from,
    to,
    currentVersion,
    commits,
    config,
    force,
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

  const newVersion = bumpPackageVersion({
    currentVersion,
    releaseType,
    preid: config.bump.preid,
    suffix,
  })

  logger.debug(`${currentVersion} → ${newVersion} (unified mode)`)

  const allPackages = [rootPackage, ...packages]

  if (!config.bump.yes) {
    await confirmBump({
      versionMode: 'unified',
      config,
      packages,
      force,
      currentVersion,
      newVersion,
      dryRun,
    })
  }
  else {
    logger.info(`${allPackages.length} package(s) bumped from ${currentVersion} to ${newVersion} (unified mode)`)
  }

  for (const pkg of allPackages) {
    writeVersion(pkg.path, newVersion, dryRun)
  }

  if (newVersion) {
    updateLernaVersion({
      rootDir: config.cwd,
      versionMode: config.monorepo.versionMode,
      version: newVersion,
      dryRun,
    })
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
      currentVersion: pkg.version,
      version: newVersion,
      fromTag: from,
    })),
  }
}

async function bumpIndependentMode({
  config,
  packages,
  dryRun,
  force,
  suffix,
}: BumpStrategyInput): Promise<BumpResult> {
  logger.debug('Starting bump in independent mode')

  const packagesWithNewVersions = await findPackagesWithCommitsAndCalculateVersions({
    packages,
    config,
    force,
    suffix,
  })

  if (packagesWithNewVersions.length === 0) {
    logger.debug('No packages have commits')
    return { bumped: false }
  }

  if (!config.bump.yes) {
    await confirmBump({
      versionMode: 'independent',
      config,
      packages: packagesWithNewVersions,
      force,
      dryRun,
    })
  }
  else {
    const bumpedByCommits = packagesWithNewVersions.filter(p => p.reason === 'commits').length
    const bumpedByDependency = packagesWithNewVersions.length - bumpedByCommits

    logger.info(
      `${bumpedByCommits + bumpedByDependency} package(s) will be bumped independently (${bumpedByCommits} from commits, ${bumpedByDependency} from dependencies)`,
    )
  }

  const bumpedPackages = bumpIndependentPackages({
    packages: packagesWithNewVersions,
    dryRun,
  })

  const bumpedByCommits = bumpedPackages.filter(p =>
    packagesWithNewVersions.find(pkg => pkg.name === p.name)?.reason === 'commits',
  ).length
  const bumpedByDependency = bumpedPackages.length - bumpedByCommits

  if (bumpedPackages.length === 0) {
    logger.debug('No packages were bumped')
  }
  else {
    logger.info(
      `${dryRun ? '[dry-run] ' : ''}${bumpedPackages.length} package(s) bumped independently (${bumpedByCommits} from commits, ${bumpedByDependency} from dependencies)`,
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
  suffix,
}: BumpStrategyInput): Promise<BumpResult> {
  logger.debug('Starting bump in selective mode')

  const rootPackage = getRootPackage(config.cwd)
  const currentVersion = rootPackage.version

  const { from, to } = await resolveTags<'selective', 'bump'>({
    config,
    versionMode: 'selective',
    step: 'bump',
    currentVersion,
    newVersion: undefined,
    pkg: undefined,
    logLevel: config.logLevel,
  })

  logger.debug(`Bump from ${from} to ${to}`)

  const commits = await getPackageCommits({
    pkg: rootPackage,
    from,
    to,
    config,
    changelog: false,
  })

  const releaseType = determineReleaseType({ from, to, commits, config, force, currentVersion })

  if (!releaseType) {
    logger.debug('No commits require a version bump')
    return { bumped: false }
  }

  const newVersion = bumpPackageVersion({
    currentVersion,
    releaseType,
    preid: config.bump.preid,
    suffix,
  })

  logger.debug('Determining packages to bump...')
  const packagesToBump = force
    ? packages
    : await getPackageToBump({
        packages,
        from,
        to,
        config,
      })

  if (packagesToBump.length === 0) {
    logger.debug('No packages have commits, skipping bump')
    return { bumped: false }
  }

  if (!config.bump.yes) {
    await confirmBump({
      versionMode: 'selective',
      config,
      packages: packagesToBump,
      force,
      currentVersion,
      newVersion,
      dryRun,
    })
  }
  else {
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
  }

  logger.debug(`Writing version to ${packagesToBump.length} package(s)`)

  writeVersion(rootPackage.path, newVersion, dryRun)

  for (const pkg of packagesToBump) {
    writeVersion(pkg.path, newVersion, dryRun)
  }

  updateLernaVersion({
    rootDir: config.cwd,
    versionMode: config.monorepo.versionMode,
    version: newVersion,
    dryRun,
  })

  if (!dryRun) {
    logger.info(
      `${packagesToBump.length} package(s) bumped to ${newVersion} (${packages.length - packagesToBump.length} skipped)`,
    )
  }

  return {
    bumped: true,
    oldVersion: currentVersion,
    fromTag: from,
    newVersion,
    bumpedPackages: packagesToBump.map(pkg => ({
      ...pkg,
      currentVersion: pkg.version,
      version: newVersion,
      fromTag: from,
    })),
  }
}

export async function bump(options: Partial<BumpOptions> = {}): Promise<BumpResult> {
  try {
    logger.start('Start bumping versions')

    const dryRun = options.dryRun ?? false
    logger.debug(`Dry run: ${dryRun}`)

    const force = options.force ?? false
    logger.debug(`Bump forced: ${force}`)

    const config = await loadMonorepoConfig({
      configName: options.configName,
      baseConfig: options.config,
      overrides: {
        bump: {
          yes: options.yes,
          type: options.type,
          clean: options.clean,
          preid: options.preid,
        } satisfies BumpConfig,
        logLevel: options.logLevel,
      },
    })

    if (config.bump.clean && config.release.clean) {
      try {
        checkGitStatusIfDirty()
      }
      catch {
        logger.error('Git status is dirty, please commit or stash your changes before bumping or use --no-clean flag')
        process.exit(1)
      }
    }

    await fetchGitTags(config.cwd)

    logger.info(`Version mode: ${config.monorepo.versionMode}`)

    const packages = getPackages({
      cwd: config.cwd,
      patterns: config.monorepo.packages,
      ignorePackageNames: config.monorepo.ignorePackageNames,
    })

    logger.debug(`Found ${packages.length} package(s)`)

    let result: BumpResult

    const payload = {
      config,
      packages,
      dryRun,
      force,
      suffix: options.suffix,
    }

    if (config.monorepo.versionMode === 'unified') {
      result = await bumpUnifiedMode(payload)
    }
    else if (config.monorepo.versionMode === 'selective') {
      result = await bumpSelectiveMode(payload)
    }
    else {
      result = await bumpIndependentMode(payload)
    }

    if (result.bumped) {
      logger.success(`${dryRun ? '[dry-run] ' : ''}Version bump completed (${result.bumpedPackages.length} package(s) bumped)`)
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
