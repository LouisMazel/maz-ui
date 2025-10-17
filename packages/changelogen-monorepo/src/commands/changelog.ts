import type { ChangelogOptions } from '../types'
import { execPromise } from '@maz-ui/node'
import consola from 'consola'
import { getPackagePatterns, getRootDir, loadMonorepoConfig } from '../config'
import { generateChangelog, writeChangelogToFile } from '../core/changelog'
import { getPackageCommits, getPackages, getRootPackage } from '../core/monorepo'

async function getLastTag(releaseType: 'latest' | 'prerelease'): Promise<string> {
  if (releaseType === 'latest') {
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

export async function changelogCommand(options: ChangelogOptions = {}): Promise<void> {
  try {
    consola.start('Generating changelogs...')

    const cwd = process.cwd()
    const releaseType = options.releaseType || 'prerelease'

    consola.info(`Release type: ${releaseType}`)

    const lastTag = options.from || await getLastTag(releaseType)
    const to = options.to || 'HEAD'

    consola.info(`Commit range: ${lastTag}...${to}`)

    const { changelogConfig, monorepoConfig } = await loadMonorepoConfig(cwd, {
      from: lastTag,
      to,
    })

    const rootDir = getRootDir(cwd)
    const rootPackage = getRootPackage(rootDir)

    if (monorepoConfig.rootChangelog) {
      consola.start('Generating root changelog...')

      const rootCommits = await getPackageCommits(rootPackage, changelogConfig, rootDir)
      const rootChangelog = await generateChangelog(
        rootPackage,
        rootCommits,
        changelogConfig,
        rootPackage.version,
      )

      writeChangelogToFile(rootPackage, rootChangelog, options.dryRun)
    }

    if (monorepoConfig.filterCommits) {
      consola.start('Generating package changelogs...')

      const patterns = getPackagePatterns(monorepoConfig)
      const packages = getPackages(cwd, patterns, monorepoConfig)

      consola.info(`Found ${packages.length} packages`)

      for await (const pkg of packages) {
        const commits = await getPackageCommits(pkg, changelogConfig, rootDir)
        const changelog = await generateChangelog(pkg, commits, changelogConfig, pkg.version)
        writeChangelogToFile(pkg, changelog, options.dryRun)
      }
    }

    consola.success('Changelog generation completed!')

    if (!options.dryRun) {
      consola.box('Next steps:\n\n'
        + '1. Review the generated changelogs\n'
        + '2. Run `clm github` to publish the release to GitHub')
    }
  }
  catch (error) {
    consola.error('Error generating changelogs:', (error as Error).message)
    throw error
  }
}
