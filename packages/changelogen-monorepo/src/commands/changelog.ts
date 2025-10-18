import type { ChangelogOptions } from '../types'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import { getPackagePatterns, loadMonorepoConfig } from '../config'
import { generateChangelog, writeChangelogToFile } from '../core/changelog'
import { getPackageCommits, getPackages, getRootPackage } from '../core/monorepo'
import { getLastTag } from '../core/version'

// eslint-disable-next-line complexity
export async function changelog(options: ChangelogOptions = {}): Promise<void> {
  try {
    consola.start('Generating changelogs...')

    const config = await loadMonorepoConfig({
      overrides: {
        from: options.from,
        to: options.to,
      },
    })

    const opts = {
      to: config.to,
      dryRun: options.dryRun ?? false,
      formatCmd: options.formatCmd || config.changelog.formatCmd || '',
      rootChangelog: options.rootChangelog || config.changelog.rootChangelog,
    } satisfies ChangelogOptions

    if (opts.rootChangelog) {
      const rootPackage = getRootPackage(config.cwd)

      const lastTag = options.from || await getLastTag(rootPackage.version)

      consola.info(`Generating root changelog - Commit range: ${lastTag}...${rootPackage.version || opts.to}`)

      const rootCommits = await getPackageCommits({
        pkg: rootPackage,
        from: lastTag,
        to: opts.to,
        config,
      })
      const rootChangelog = await generateChangelog({
        pkg: rootPackage,
        commits: rootCommits,
        config,
        from: lastTag,
        to: rootPackage.version || opts.to,
      })

      if (!rootChangelog) {
        return
      }

      writeChangelogToFile({
        changelog: rootChangelog,
        pkg: rootPackage,
        dryRun: opts.dryRun,
      })
    }

    if (config.monorepo.filterCommits) {
      consola.start('Generating package changelogs...')

      const patterns = getPackagePatterns(config.monorepo)
      const packages = getPackages({
        cwd: config.cwd,
        ignorePackages: config.monorepo.ignorePackages,
        patterns,
      })

      consola.info(`Found ${packages.length} packages`)

      for await (const pkg of packages) {
        const lastTag = options.from || await getLastTag(pkg.version)
        const commits = await getPackageCommits({
          pkg,
          config,
          from: lastTag,
          to: opts.to,
        })
        const changelog = await generateChangelog({
          pkg,
          commits,
          config,
          from: lastTag,
          to: pkg.version || opts.to,
        })

        if (!changelog) {
          continue
        }

        writeChangelogToFile({
          pkg,
          changelog,
          dryRun: opts.dryRun,
        })
      }
    }

    if (config.changelog?.formatCmd && !opts.dryRun) {
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
