import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { ChangelogOptions, PackageInfo } from '../types'
import { execPromise, logger } from '@maz-ui/node'
import { generateChangelog, getLastTag, getPackageCommits, getPackages, getRootPackage, loadMonorepoConfig, writeChangelogToFile } from '../core'

function getPackagesToGenerateChangelogFor({
  config,
  packages,
}: {
  config: ResolvedChangelogMonorepoConfig
  packages?: PackageInfo[]
}) {
  if (packages && packages.length > 0) {
    return packages
  }

  const patterns = config.monorepo.packages
  return getPackages({
    cwd: config.cwd,
    ignorePackageNames: config.monorepo.ignorePackageNames,
    patterns,
  })
}

async function formatChangelog({
  config,
  dryRun,
}: {
  config: ResolvedChangelogMonorepoConfig
  dryRun: boolean
}) {
  if (config.changelog?.formatCmd) {
    logger.debug(`Running format command: ${config.changelog.formatCmd}`)
    try {
      if (!dryRun) {
        await execPromise(config.changelog.formatCmd, {
          noStderr: true,
          noStdout: true,
          logLevel: config.logLevel,
        })
      }
      else {
        logger.log('[dry-run] running format command: ', config.changelog.formatCmd)
      }
      logger.debug('Format completed')
    }
    catch (error) {
      logger.warn('Format command failed:', error)
      logger.debug('Continuing anyway...')
    }
  }
  else {
    logger.debug('No format command specified')
  }
}

export async function changelog(options: ChangelogOptions): Promise<void> {
  try {
    logger.start('Start generating changelogs')

    const dryRun = options.dryRun ?? false
    logger.debug(`Dry run: ${dryRun}`)

    const config = options.config || await loadMonorepoConfig({
      overrides: {
        from: options.from,
        to: options.to,
        logLevel: options.logLevel,
        changelog: {
          rootChangelog: options.rootChangelog,
          formatCmd: options.formatCmd,
        },
      },
    })

    logger.debug(`Commit range: ${config.from}...${config.to}`)

    if (config.changelog?.rootChangelog) {
      const rootPackage = getRootPackage(config.cwd)

      const fromTag = options.from || await getLastTag({ version: rootPackage.version, logLevel: config.logLevel })
      const toTag = config.to

      logger.debug(`Generating root changelog (${fromTag}...${toTag})`)
      logger.debug(`Root package: ${rootPackage.name} at ${rootPackage.path}`)

      const rootCommits = await getPackageCommits({
        pkg: rootPackage,
        config,
        changelog: true,
      })
      logger.debug(`Found ${rootCommits.length} commit(s) for root package`)

      const rootChangelog = await generateChangelog({
        pkg: rootPackage,
        commits: rootCommits,
        config,
      })

      if (rootChangelog) {
        writeChangelogToFile({
          changelog: rootChangelog,
          pkg: rootPackage,
          dryRun,
        })
        logger.debug('Root changelog written')
      }
      else {
        logger.debug('No changelog to generate for root package')
      }
    }

    if (config.monorepo.filterCommits) {
      logger.debug('Generating package changelogs...')

      const packages = getPackagesToGenerateChangelogFor({
        config,
        packages: options.packages,
      })

      logger.debug(`Processing ${packages.length} package(s)`)

      let generatedCount = 0
      for await (const pkg of packages) {
        const lastTag = options.from || await getLastTag({ version: pkg.version })
        logger.debug(`Processing ${pkg.name} (${lastTag}...${config.to})`)

        const commits = await getPackageCommits({
          pkg,
          config,
          changelog: true,
        })

        logger.debug(`${pkg.name}: ${commits.length} commit(s)`)

        const toTag = config.to

        const changelog = await generateChangelog({
          pkg,
          commits,
          config: {
            ...config,
            from: lastTag,
            to: toTag,
          },
        })

        if (changelog) {
          writeChangelogToFile({
            pkg,
            changelog,
            dryRun,
          })
          generatedCount++
          logger.debug(`${pkg.name}: changelog written`)
        }
      }

      logger.debug(`Generated ${generatedCount} package changelog(s)`)
    }

    await formatChangelog({
      config,
      dryRun,
    })

    logger.success('Changelog generation completed!')
  }
  catch (error) {
    logger.error('Error generating changelogs:', error)
    throw error
  }
}
