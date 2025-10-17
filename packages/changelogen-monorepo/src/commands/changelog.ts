import type { ChangelogOptions } from '../types'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import * as semver from 'semver'
import { getPackagePatterns, loadMonorepoConfig } from '../config'
import { generateChangelog, writeChangelogToFile } from '../core/changelog'
import { getPackageCommits, getPackages, getRootPackage } from '../core/monorepo'

function isPrerelease(version?: string): boolean {
  if (!version)
    return false
  const parsed = semver.parse(version)
  return parsed ? parsed.prerelease.length > 0 : false
}

async function getLastTag(currentVersion?: string): Promise<string> {
  if (isPrerelease(currentVersion)) {
    const { stdout } = await execPromise('git tag --sort=-v:refname | sed -n \'1p\'', {
      noSuccess: true,
      noStdout: true,
    })
    return stdout.trim()
  }

  const { stdout } = await execPromise(
    'git tag --sort=-v:refname | grep -E \'^v[0-9]+\\.[0-9]+\\.[0-9]+$\' | sed -n \'1p\'',
    {
      noSuccess: true,
      noStdout: true,
    },
  )
  return stdout.trim()
}

export async function changelogCommand(options: ChangelogOptions = {}): Promise<void> {
  try {
    consola.start('Generating changelogs...')

    const rootDir = process.cwd()
    const rootPackage = getRootPackage(rootDir)

    const lastTag = options.from || await getLastTag(rootPackage.version)
    const to = options.to || 'HEAD'

    consola.info(`Commit range: ${lastTag}...${to}`)

    const config = await loadMonorepoConfig(rootDir, {
      from: lastTag,
      to,
    })

    if (config.monorepo.rootChangelog) {
      consola.start('Generating root changelog...')

      const rootCommits = await getPackageCommits(rootPackage, config, rootDir)
      const rootChangelog = await generateChangelog(
        rootPackage,
        rootCommits,
        config,
        rootPackage.version,
      )

      if (!rootChangelog) {
        return
      }

      writeChangelogToFile(rootPackage, rootChangelog, options.dryRun)
    }

    if (config.monorepo.filterCommits) {
      consola.start('Generating package changelogs...')

      const patterns = getPackagePatterns(config.monorepo)
      const packages = getPackages(rootDir, patterns, config)

      consola.info(`Found ${packages.length} packages`)

      for await (const pkg of packages) {
        const commits = await getPackageCommits(pkg, config, rootDir)
        const changelog = await generateChangelog(pkg, commits, config, pkg.version)

        if (!changelog) {
          continue
        }

        writeChangelogToFile(pkg, changelog, options.dryRun)
      }
    }

    if (config.changelog?.formatCmd) {
      consola.info('Format command is running...')
      await execPromise(config.changelog.formatCmd, {
        noStderr: true,
        noSuccess: true,
      })
      consola.info('Format completed')
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
