import type { ReleaseType } from 'semver'
import type { ResolvedChangelogMonorepoConfig } from '../config'
import type { BumpOptions, BumpResult, PackageInfo, PackageWithCommits } from '../types'
import { getGitDiff, parseCommits } from 'changelogen'
import { consola } from 'consola'
import { getPackagePatterns, loadMonorepoConfig } from '../config'
import { expandPackagesToBumpWithDependents } from '../core/dependencies'
import { getPackageCommits, getPackages, getPackageToBump, getRootPackage } from '../core/monorepo'
import { bumpPackageIndependently, bumpPackageVersion, determineReleaseType, extractVersionFromPackageTag, isGraduating, isPrerelease, updateLernaVersion, writeVersion } from '../core/version'
import { getLastPackageTag, getLastTag } from '../utils/git'

function isStableReleaseType(releaseType: ReleaseType): boolean {
  const stableTypes = ['release', 'major', 'minor', 'patch']
  return stableTypes.includes(releaseType)
}

async function determinePackageFromTag({
  packageName,
  globalFrom,
  releaseType,
}: {
  packageName: string
  globalFrom: string
  releaseType: ReleaseType
}): Promise<string> {
  const lastPackageTag = await getLastPackageTag(packageName)

  if (!lastPackageTag) {
    consola.info(`  No previous tag found for ${packageName}, using global from: ${globalFrom}`)
    return globalFrom
  }

  const tagVersion = extractVersionFromPackageTag(lastPackageTag)
  if (!tagVersion) {
    consola.warn(`  Could not extract version from tag ${lastPackageTag}, using global from: ${globalFrom}`)
    return globalFrom
  }

  const graduating = isPrerelease(tagVersion) && isStableReleaseType(releaseType)

  if (graduating) {
    consola.info(`  Graduating ${packageName} from prerelease ${tagVersion} to stable`)
    const stablePackageTag = await getLastPackageTag(packageName, true)
    if (stablePackageTag) {
      consola.info(`  Using last stable tag: ${stablePackageTag}`)
      return stablePackageTag
    }
  }

  consola.info(`  Using last package tag: ${lastPackageTag}`)
  return lastPackageTag
}

async function bumpUnifiedMode({
  config,
  packages,
  dryRun,
}: {
  config: ResolvedChangelogMonorepoConfig
  packages: PackageInfo[]
  dryRun: boolean
}): Promise<BumpResult> {
  consola.start('Bumping versions in unified mode...')

  const rootPackage = getRootPackage(config.cwd)
  const currentVersion = rootPackage.version

  const fromTag = config.from
  const rawCommits = await getGitDiff(fromTag, config.to, config.cwd)
  const commits = parseCommits(rawCommits, config)

  consola.info(`Found ${commits.length} commits since ${fromTag}`)

  const releaseType = determineReleaseType(commits, config)

  if (!releaseType) {
    consola.warn('No commits require a version bump')
    return { bumpedPackages: [] }
  }

  if (config.bump.type) {
    consola.info(`Using specified release type: ${releaseType}`)
  }
  else {
    consola.info(`Detected release type from commits: ${releaseType}`)
  }

  const newVersion = bumpPackageVersion(currentVersion, releaseType, config.bump.preid)

  consola.info(`Bumping all packages from ${currentVersion} to ${newVersion}`)

  const allPackages = [rootPackage, ...packages]

  for (const pkg of allPackages) {
    writeVersion(pkg.path, newVersion, dryRun)
  }

  if (newVersion) {
    updateLernaVersion(config.cwd, newVersion, dryRun)
  }

  if (!dryRun) {
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
  dryRun,
}: {
  config: ResolvedChangelogMonorepoConfig
  packages: PackageInfo[]
  dryRun: boolean
}): Promise<BumpResult> {
  consola.info('Bumping versions in independent mode')

  const releaseType = config.bump.type
  const packagesWithCommits: PackageWithCommits[] = []

  consola.info('Checking for commits in each package...')

  for (const pkg of packages) {
    const fromTag = await determinePackageFromTag({
      packageName: pkg.name,
      globalFrom: config.from,
      releaseType,
    })

    const commits = await getPackageCommits({
      pkg,
      config: {
        ...config,
        from: fromTag,
      },
    })

    if (commits.length > 0) {
      packagesWithCommits.push({ ...pkg, commits })
      consola.info(`  ${pkg.name}: ${commits.length} commits since ${fromTag}`)
    }
  }

  if (packagesWithCommits.length === 0) {
    consola.warn('No packages have commits')
    return { bumpedPackages: [] }
  }

  consola.info(`Found ${packagesWithCommits.length} package(s) with commits`)

  const allPackagesToBump = expandPackagesToBumpWithDependents(packagesWithCommits, packages)

  consola.info(`Total packages to bump (including dependents): ${allPackagesToBump.length}`)

  const bumpedPackages: PackageInfo[] = []

  for (const pkgToBump of allPackagesToBump) {
    const fromTag = await determinePackageFromTag({
      packageName: pkgToBump.name,
      globalFrom: config.from,
      releaseType,
    })

    const forcedBumpType = pkgToBump.reason === 'dependency' ? 'patch' : undefined

    const result = await bumpPackageIndependently({
      pkg: pkgToBump,
      config,
      forcedBumpType,
      fromTag,
      dryRun,
    })

    if (result.bumped) {
      bumpedPackages.push({
        name: pkgToBump.name,
        path: pkgToBump.path,
        version: result.newVersion,
      })
    }
  }

  const bumpedByCommits = bumpedPackages.filter(p =>
    allPackagesToBump.find(pkg => pkg.name === p.name)?.reason === 'commits',
  ).length
  const bumpedByDependency = bumpedPackages.length - bumpedByCommits

  if (bumpedPackages.length === 0) {
    consola.warn('No packages were bumped')
  }
  else {
    consola.success(
      `${bumpedPackages.length} package(s) bumped independently `
      + `(${bumpedByCommits} from commits, ${bumpedByDependency} from dependencies)`,
    )
  }

  return { bumpedPackages }
}

async function bumpSelectiveMode({
  config,
  packages,
  dryRun,
}: {
  config: ResolvedChangelogMonorepoConfig
  packages: PackageInfo[]
  dryRun: boolean
}): Promise<BumpResult> {
  consola.info('Bumping versions in selective mode')

  const rootPackage = getRootPackage(config.cwd)
  const currentVersion = rootPackage.version

  let fromTag = config.from
  let rawCommits = await getGitDiff(fromTag, config.to, config.cwd)
  let commits = parseCommits(rawCommits, config)

  consola.info(`Found ${commits.length} commits since ${fromTag}`)

  const releaseType = determineReleaseType(commits, config)

  if (!releaseType) {
    consola.warn('No commits require a version bump')
    return { bumpedPackages: [] }
  }

  if (config.bump.type) {
    consola.info(`Using specified release type: ${config.bump.type}`)
  }
  else {
    consola.info(`Detected release type from commits: ${releaseType}`)
  }

  const newVersion = bumpPackageVersion(currentVersion, releaseType, config.bump.preid)
  const graduating = isGraduating(currentVersion, newVersion)

  if (graduating) {
    consola.info(`Graduating from prerelease ${currentVersion} to stable ${newVersion}`)
    consola.info('Recalculating commits since last stable release...')

    fromTag = await getLastTag(currentVersion, true)
    rawCommits = await getGitDiff(fromTag, config.to, config.cwd)
    commits = parseCommits(rawCommits, config)

    consola.info(`Found ${commits.length} commits since last stable tag ${fromTag}`)
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
    writeVersion(pkg.path, newVersion, dryRun)
  }

  writeVersion(rootPackage.path, newVersion, dryRun)
  updateLernaVersion(config.cwd, newVersion, dryRun)

  if (!dryRun) {
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

    const dryRun = options.dryRun ?? false

    const config = await loadMonorepoConfig({
      overrides: {
        bump: options,
      },
    })

    const patterns = getPackagePatterns(config.monorepo)
    const packages = getPackages({
      cwd: config.cwd,
      patterns,
      ignorePackageNames: config.monorepo.ignorePackageNames,
    })

    consola.info(`Found ${packages.length} packages matching patterns: ${patterns.join(', ')}`)

    let result: BumpResult

    if (config.monorepo.versionMode === 'unified') {
      result = await bumpUnifiedMode({
        config,
        packages,
        dryRun,
      })
    }
    else if (config.monorepo.versionMode === 'selective') {
      result = await bumpSelectiveMode({
        config,
        packages,
        dryRun,
      })
    }
    else {
      result = await bumpIndependentMode({
        config,
        packages,
        dryRun,
      })
    }

    if (result.bumpedPackages.length) {
      consola.success('Version bump completed!')
    }

    return result
  }
  catch (error) {
    consola.error('Error bumping versions:', (error as Error).message)
    throw error
  }
}
