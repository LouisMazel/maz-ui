import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { ChangelogOptions, PackageInfo } from '../types'
import { logger } from '@maz-ui/node'
import { getCurrentGitBranch } from 'changelogen'
import { executeFormatCmd, generateChangelog, getLastPackageTag, getLastTag, getPackageCommits, getPackages, getRootPackage, loadMonorepoConfig, writeChangelogToFile } from '../core'

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

async function generateAggregatedRootChangelog({
  packages,
  config,
  dryRun,
}: {
  packages: PackageInfo[]
  config: ResolvedChangelogMonorepoConfig
  dryRun: boolean
}) {
  logger.debug('Generating aggregated root changelog for independent mode')

  const rootPackage = getRootPackage(config.cwd)
  const packageChangelogs: string[] = []

  for (const pkg of packages) {
    const lastTag = pkg.fromTag || await getLastPackageTag({ packageName: pkg.name, logLevel: config.logLevel }) || config.from
    const toTag = `${pkg.name}@${pkg.version}`

    logger.debug(`Generating changelog for ${pkg.name} (${lastTag}...${toTag})`)

    const commits = await getPackageCommits({
      pkg,
      config: {
        ...config,
        from: lastTag,
      },
      changelog: true,
    })

    const changelog = await generateChangelog({
      pkg,
      commits,
      config: {
        ...config,
        from: lastTag,
        to: toTag,
      },
      newTag: toTag,
    })

    if (changelog) {
      const cleanedChangelog = changelog.split('\n').slice(2).join('\n')
      packageChangelogs.push(`## ${pkg.name}@${pkg.version}\n\n${cleanedChangelog}`)
    }
  }

  if (packageChangelogs.length === 0) {
    logger.debug('No changelogs to aggregate')
    return
  }

  const date = new Date().toISOString().split('T')[0]
  const aggregatedChangelog = `**Multiple Packages Updated** - ${date}\n\n${packageChangelogs.join('\n\n')}`

  logger.debug(`Aggregated root changelog: ${aggregatedChangelog}`)

  writeChangelogToFile({
    pkg: rootPackage,
    changelog: aggregatedChangelog,
    dryRun,
  })

  logger.debug('Aggregated root changelog written')
}

async function generateSimpleRootChangelog({
  config,
  dryRun,
  newTag,
}: {
  config: ResolvedChangelogMonorepoConfig
  dryRun: boolean
  newTag: string
}) {
  logger.debug('Generating simple root changelog')

  const rootPackage = getRootPackage(config.cwd)

  const toTag = config.to
  const configWithTags = {
    ...config,
    to: toTag,
  }

  logger.debug(`Generating root changelog (${config.from}...${toTag})`)
  logger.debug(`Root package: ${rootPackage.name} at ${rootPackage.path}`)

  const rootCommits = await getPackageCommits({
    pkg: rootPackage,
    config: configWithTags,
    changelog: true,
  })

  const rootChangelog = await generateChangelog({
    pkg: rootPackage,
    commits: rootCommits,
    config: configWithTags,
    newTag: newTag ?? config.to,
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

// eslint-disable-next-line sonarjs/cognitive-complexity
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
      if (config.monorepo.versionMode === 'independent') {
        const packagesToAggregate = getPackagesToGenerateChangelogFor({
          config,
          packages: options.packages,
        })

        await generateAggregatedRootChangelog({
          packages: packagesToAggregate,
          config,
          dryRun,
        })
      }
      else {
        await generateSimpleRootChangelog({
          config,
          dryRun,
          newTag: options.newTag || config.to,
        })
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
        const lastTag = options.from || (
          config.monorepo.versionMode === 'independent'
            ? (pkg.fromTag || (await getLastPackageTag({ packageName: pkg.name, logLevel: config.logLevel }) || config.from))
            : await getLastTag({ version: pkg.version })
        )

        const toTag = config.monorepo.versionMode === 'independent'
          ? `${pkg.name}@${pkg.version}`
          : options.newTag || config.to

        const finalToTag = getCurrentGitBranch()

        logger.debug(`Processing ${pkg.name} (${lastTag}...${toTag})`)

        const commits = await getPackageCommits({
          pkg,
          config: {
            ...config,
            from: lastTag,
            to: finalToTag,
          },
          changelog: true,
        })

        logger.debug(`${pkg.name}: ${commits.length} commit(s)`)

        const changelog = await generateChangelog({
          pkg,
          commits,
          config: {
            ...config,
            from: lastTag,
            to: finalToTag,
          },
          newTag: toTag,
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

    await executeFormatCmd({
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
