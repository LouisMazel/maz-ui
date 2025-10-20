import type { ChangelogOptions } from '../types'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import { getPackagePatterns, loadMonorepoConfig } from '../config'
import { generateChangelog, writeChangelogToFile } from '../core/changelog'
import { getPackageCommits, getPackages, getRootPackage } from '../core/monorepo'
import { getLastTag } from '../core/version'

export async function changelog(options: ChangelogOptions = {}): Promise<void> {
  try {
    consola.start('Generating changelogs...')

    const dryRun = options.dryRun ?? false

    const config = await loadMonorepoConfig({
      overrides: {
        from: options.from,
        to: options.to,
        changelog: {
          rootChangelog: options.rootChangelog,
          formatCmd: options.formatCmd,
        },
      },
    })

    if (config.changelog?.rootChangelog) {
      const rootPackage = getRootPackage(config.cwd)

      const fromTag = options.from || await getLastTag(rootPackage.version)
      const toTag = config.to

      consola.info(`Generating root changelog - Commit range: ${fromTag}...${toTag}`)

      const rootCommits = await getPackageCommits({
        pkg: rootPackage,
        config,
      })
      const rootChangelog = await generateChangelog({
        pkg: rootPackage,
        commits: rootCommits,
        config,
      })

      if (!rootChangelog) {
        return
      }

      writeChangelogToFile({
        changelog: rootChangelog,
        pkg: rootPackage,
        dryRun,
      })
    }

    if (config.monorepo.filterCommits) {
      consola.start('Generating package changelogs...')

      const patterns = getPackagePatterns(config.monorepo)
      const packages = getPackages({
        cwd: config.cwd,
        ignorePackageNames: config.monorepo.ignorePackageNames,
        patterns,
      })

      consola.info(`Found ${packages.length} packages`)

      for await (const pkg of packages) {
        const lastTag = options.from || await getLastTag(pkg.version)
        const commits = await getPackageCommits({
          pkg,
          config,
        })
        const changelog = await generateChangelog({
          pkg,
          commits,
          config: {
            ...config,
            from: lastTag,
            to: pkg.version || config.to,
          },
        })

        if (!changelog) {
          continue
        }

        writeChangelogToFile({
          pkg,
          changelog,
          dryRun,
        })
      }
    }

    if (config.changelog?.formatCmd && !dryRun) {
      consola.info('Running format command...')
      try {
        await execPromise(config.changelog.formatCmd, {
          noStderr: true,
          noSuccess: true,
        })
        consola.success('Format completed')
      }
      catch (error) {
        consola.warn('Format command failed:', (error as Error).message)
        consola.info('Continuing anyway...')
      }
    }

    consola.success('Changelog generation completed!')
  }
  catch (error) {
    consola.error('Error generating changelogs:', (error as Error).message)
    throw error
  }
}
