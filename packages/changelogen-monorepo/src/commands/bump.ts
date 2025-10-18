import type { BumpOptions, BumpResult, ChangelogMonorepoConfig, PackageInfo } from '../types'
import { getGitDiff, parseCommits } from 'changelogen'
import { consola } from 'consola'
import { getPackagePatterns, loadMonorepoConfig } from '../config'
import { expandPackagesToBumpWithDependents } from '../core/dependencies'
import { getPackageCommits, getPackages, getPackageToBump, getRootPackage } from '../core/monorepo'
import { bumpPackageIndependently, bumpPackageVersion, determineReleaseType, getLastTag, isGraduating, isPrerelease, updateLernaVersion, writeVersion } from '../core/version'

function isStableReleaseType(releaseType: string): boolean {
  const stableTypes = ['release', 'major', 'minor', 'patch']
  return stableTypes.includes(releaseType)
}

async function determineFromTagForGraduating(
  currentVersion: string,
  configFrom: string,
  releaseType: string,
): Promise<string> {
  const graduating = isPrerelease(currentVersion) && isStableReleaseType(releaseType)

  if (graduating) {
    consola.info(`Graduating from prerelease ${currentVersion} to stable release`)
    consola.info('Recalculating commits since last stable release...')

    const stableTag = await getLastTag(currentVersion, true)
    consola.info(`Using last stable tag: ${stableTag}`)
    return stableTag
  }

  return configFrom
}

async function bumpUnifiedMode({
  config,
  packages,
  options,
}: {
  config: ChangelogMonorepoConfig
  packages: PackageInfo[]
  options: Required<BumpOptions>
}): Promise<BumpResult> {
  consola.start('Bumping versions in unified mode...')

  const rootPackage = getRootPackage(config.cwd)
  const currentVersion = rootPackage.version || '0.0.0'

  const fromTag = config.from
  const rawCommits = await getGitDiff(fromTag, config.to, config.cwd)
  const commits = parseCommits(rawCommits, config)

  consola.info(`Found ${commits.length} commits since ${fromTag}`)

  const releaseType = determineReleaseType(commits, config, options)

  if (!releaseType) {
    consola.warn('No commits require a version bump')
    return { bumpedPackages: [] }
  }

  if (options.type) {
    consola.info(`Using specified release type: ${releaseType}`)
  }
  else {
    consola.info(`Detected release type from commits: ${releaseType}`)
  }

  const newVersion = bumpPackageVersion(currentVersion, releaseType, options.preid)

  consola.info(`Bumping all packages from ${currentVersion} to ${newVersion}`)

  const allPackages = [rootPackage, ...packages]

  for (const pkg of allPackages) {
    writeVersion(pkg.path, newVersion, options.dryRun)
  }

  if (newVersion) {
    updateLernaVersion(config.cwd, newVersion, options.dryRun)
  }

  if (!options.dryRun) {
    consola.success(`All ${allPackages.length} package(s) bumped to ${newVersion}`)
  }

  return {
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
  options,
}: {
  config: ChangelogMonorepoConfig
  packages: PackageInfo[]
  options: Required<BumpOptions>
}): Promise<BumpResult> {
  consola.info('Bumping versions in independent mode')

  const rootPackage = getRootPackage(config.cwd)
  const currentVersion = rootPackage.version || '0.0.0'

  const fromTag = await determineFromTagForGraduating(currentVersion, config.from, options.type || 'patch')

  // First, identify packages with commits
  const packagesWithCommits: PackageInfo[] = []
  for (const pkg of packages) {
    const commits = await getPackageCommits({
      pkg,
      config: {
        ...config,
        from: fromTag,
      },
      from: fromTag,
      to: config.to,
    })
    if (commits.length > 0) {
      packagesWithCommits.push(pkg)
    }
  }

  consola.info(`Found ${packagesWithCommits.length} package(s) with commits since ${fromTag}`)

  // Expand with dependent packages
  const allPackagesToBump = expandPackagesToBumpWithDependents(packagesWithCommits, packages)

  consola.info(`Total packages to bump (including dependents): ${allPackagesToBump.length}`)

  let bumpedByCommits = 0
  let bumpedByDependency = 0
  const bumpedPackages: PackageInfo[] = []

  for (const pkgToBump of allPackagesToBump) {
    const forcedBumpType = pkgToBump.reason === 'dependency' ? 'patch' : undefined
    const result = await bumpPackageIndependently({
      pkg: pkgToBump,
      config: {
        ...config,
        from: fromTag,
      },
      options,
      forcedBumpType,
    })

    if (result.bumped) {
      if (pkgToBump.reason === 'commits') {
        bumpedByCommits++
      }
      else {
        bumpedByDependency++
      }

      bumpedPackages.push({
        name: pkgToBump.name,
        path: pkgToBump.path,
        version: result.newVersion,
      })
    }
  }

  const { newVersion } = await bumpPackageIndependently({
    pkg: rootPackage,
    config: {
      ...config,
      from: fromTag,
    },
    options,
  })

  if (bumpedByCommits === 0 && bumpedByDependency === 0) {
    consola.warn('No packages were bumped')
  }
  else {
    consola.success(
      `${bumpedByCommits + bumpedByDependency} package(s) bumped independently `
      + `(${bumpedByCommits} from commits, ${bumpedByDependency} from dependencies)`,
    )
  }

  return { newVersion, bumpedPackages }
}

async function bumpSelectiveMode({
  config,
  packages,
  options,
}: {
  config: ChangelogMonorepoConfig
  packages: PackageInfo[]
  options: Required<BumpOptions>
}): Promise<BumpResult> {
  consola.info('Bumping versions in selective mode')

  const rootPackage = getRootPackage(config.cwd)
  const currentVersion = rootPackage.version || '0.0.0'

  let fromTag = config.from
  let rawCommits = await getGitDiff(fromTag, config.to, config.cwd)
  let allCommits = parseCommits(rawCommits, config)

  consola.info(`Found ${allCommits.length} commits since ${fromTag}`)

  const releaseType = determineReleaseType(allCommits, config, options)

  if (!releaseType) {
    consola.warn('No commits require a version bump')
    return { bumpedPackages: [] }
  }

  if (options.type) {
    consola.info(`Using specified release type: ${releaseType}`)
  }
  else {
    consola.info(`Detected release type from commits: ${releaseType}`)
  }

  const newVersion = bumpPackageVersion(currentVersion, releaseType, options.preid)
  const graduating = isGraduating(currentVersion, newVersion)

  if (graduating) {
    consola.info(`Graduating from prerelease ${currentVersion} to stable ${newVersion}`)
    consola.info('Recalculating commits since last stable release...')

    fromTag = await getLastTag(currentVersion, true)
    rawCommits = await getGitDiff(fromTag, config.to, config.cwd)
    allCommits = parseCommits(rawCommits, config)

    consola.info(`Found ${allCommits.length} commits since last stable tag ${fromTag}`)
  }

  const packagesToBump = await getPackageToBump({
    packages,
    config: {
      ...config,
      from: fromTag,
    },
  })

  if (packagesToBump.length === 0) {
    consola.warn('No packages have commits, skipping bump')
    return { bumpedPackages: [] }
  }

  const bumpedByCommits = packagesToBump.filter(p => p.reason === 'commits').length
  const bumpedByDependency = packagesToBump.filter(p => p.reason === 'dependency').length

  consola.info(
    `Bumping ${packagesToBump.length} package(s) from ${currentVersion} to ${newVersion} (${bumpedByCommits} from commits, ${bumpedByDependency} from dependencies)`,
  )

  for (const pkg of packagesToBump) {
    writeVersion(pkg.path, newVersion, options.dryRun)
  }

  writeVersion(rootPackage.path, newVersion, options.dryRun)
  updateLernaVersion(config.cwd, newVersion, options.dryRun)

  if (!options.dryRun) {
    consola.success(
      `${packagesToBump.length} package(s) bumped to ${newVersion} (${packages.length - packagesToBump.length} skipped)`,
    )
  }

  return {
    newVersion,
    bumpedPackages: packagesToBump.map(pkg => ({
      ...pkg,
      version: newVersion,
    })),
  }
}

export async function bump(options: BumpOptions = {}): Promise<BumpResult> {
  try {
    consola.start('Bumping versions...')

    const config = await loadMonorepoConfig()

    const opts = {
      type: options.type || config.bump.type,
      preid: options.preid || config.bump.preid || '',
      dryRun: options.dryRun ?? false,
    } satisfies Required<BumpOptions>

    const patterns = getPackagePatterns(config.monorepo)
    const packages = getPackages({
      cwd: config.cwd,
      patterns,
      ignorePackages: config.monorepo.ignorePackages,
    })

    consola.info(`Found ${packages.length} packages matching patterns: ${patterns.join(', ')}`)

    let result: BumpResult

    if (config.monorepo.versionMode === 'unified') {
      result = await bumpUnifiedMode({
        config,
        packages,
        options: opts,
      })
    }
    else if (config.monorepo.versionMode === 'selective') {
      result = await bumpSelectiveMode({
        config,
        packages,
        options: opts,
      })
    }
    else {
      result = await bumpIndependentMode({
        config,
        packages,
        options: opts,
      })
    }

    consola.success('Version bump completed!')

    return result
  }
  catch (error) {
    consola.error('Error bumping versions:', (error as Error).message)
    throw error
  }
}
