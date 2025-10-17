import type { ReleaseType } from 'semver'
import type { BumpOptions } from '../types'
import { bumpVersion, getGitDiff, parseCommits } from 'changelogen'
import consola from 'consola'
import { getPackagePatterns, getRootDir, loadMonorepoConfig } from '../config'
import { getPackages, getRootPackage } from '../core/monorepo'
import { bumpPackagesVersions, updateLernaVersion, writeVersion } from '../core/version'

export async function bumpCommand(options: BumpOptions = {}): Promise<void> {
  try {
    consola.start('Bumping versions...')

    const cwd = process.cwd()

    const { changelogConfig, monorepoConfig } = await loadMonorepoConfig(cwd, {})

    const rawCommits = await getGitDiff(changelogConfig.from, changelogConfig.to, cwd)
    const commits = parseCommits(rawCommits, changelogConfig)

    consola.info(`Found ${commits.length} commits`)

    let releaseType: ReleaseType

    if (options.type) {
      releaseType = options.type as ReleaseType
    }
    else {
      const newVersion = await bumpVersion(commits, changelogConfig, {
        preid: options.preid,
      })

      if (!newVersion) {
        consola.error('Unable to determine version bump from commits')
        return
      }

      consola.info(`Detected version: ${newVersion}`)
      releaseType = 'patch'
    }

    consola.info(`Release type: ${releaseType}`)

    if (monorepoConfig.versionMode === 'unified') {
      consola.start('Bumping versions in unified mode...')

      const rootDir = getRootDir(cwd)
      const rootPackage = getRootPackage(rootDir)

      const patterns = getPackagePatterns(monorepoConfig)
      const packages = getPackages(cwd, patterns, monorepoConfig)

      const allPackages = [rootPackage, ...packages]

      const versionMap = bumpPackagesVersions(
        allPackages,
        'unified',
        releaseType,
        options.preid,
        options.dryRun,
      )

      const newVersion = versionMap.get(rootPackage.name)

      if (newVersion) {
        updateLernaVersion(rootDir, newVersion, options.dryRun)
      }

      consola.success(`All packages bumped to ${newVersion}`)
    }
    else {
      consola.start('Bumping versions in independent mode...')

      const patterns = getPackagePatterns(monorepoConfig)
      const packages = getPackages(cwd, patterns, monorepoConfig)

      const rootDir = getRootDir(cwd)
      const rootPackage = getRootPackage(rootDir)

      writeVersion(rootPackage.path, rootPackage.version || '0.0.0', options.dryRun)

      bumpPackagesVersions(
        packages,
        'independent',
        releaseType,
        options.preid,
        options.dryRun,
      )

      consola.success(`${packages.length} packages bumped independently`)
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
