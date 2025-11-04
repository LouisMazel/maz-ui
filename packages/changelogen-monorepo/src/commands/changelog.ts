import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { ChangelogConfig, ChangelogOptions, PackageInfo } from '../types'
import { logger } from '@maz-ui/node'
import { executeFormatCmd, generateChangelog, getPackageCommits, getPackages, getRootPackage, loadMonorepoConfig, resolveTags, writeChangelogToFile } from '../core'

function getPackagesToGenerateChangelogFor({
  config,
  bumpedPackages,
}: {
  config: ResolvedChangelogMonorepoConfig
  bumpedPackages: PackageInfo[] | undefined
}) {
  if (bumpedPackages && bumpedPackages.length > 0) {
    return bumpedPackages
  }

  return getPackages({
    cwd: config.cwd,
    ignorePackageNames: config.monorepo.ignorePackageNames,
    patterns: config.monorepo.packages,
  })
}

async function generateIndependentRootChangelog({
  packages,
  config,
  dryRun,
}: {
  packages: PackageInfo[]
  config: ResolvedChangelogMonorepoConfig
  dryRun: boolean
}) {
  if (!config.changelog?.rootChangelog) {
    logger.debug('Skipping root changelog generation')
    return
  }

  logger.debug('Generating aggregated root changelog for independent mode')

  const rootPackage = getRootPackage(config.cwd)
  const packageChangelogs: string[] = []

  for (const pkg of packages) {
    const { from, to } = await resolveTags<'independent', 'changelog'>({
      config,
      versionMode: 'independent',
      step: 'changelog',
      currentVersion: pkg.version,
      newVersion: undefined,
      pkg,
      logLevel: config.logLevel,
    })

    const lastTag = from

    logger.debug(`Generating changelog for ${pkg.name} (${lastTag}...${to})`)

    const commits = await getPackageCommits({
      pkg,
      from: lastTag,
      to,
      config,
      changelog: true,
    })

    const changelog = await generateChangelog({
      config,
      pkg,
      commits,
      from: lastTag,
      dryRun,
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

  logger.verbose(`Aggregated root changelog: ${aggregatedChangelog}`)

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
}: {
  config: ResolvedChangelogMonorepoConfig
  dryRun: boolean
}) {
  if (!config.changelog?.rootChangelog) {
    logger.debug('Skipping root changelog generation')
    return
  }

  logger.debug('Generating simple root changelog')

  const rootPackage = getRootPackage(config.cwd)

  const { from, to } = await resolveTags<'unified' | 'selective', 'changelog'>({
    config,
    versionMode: config.monorepo.versionMode as 'unified' | 'selective',
    step: 'changelog',
    currentVersion: rootPackage.version,
    newVersion: undefined,
    pkg: undefined,
    logLevel: config.logLevel,
  })

  logger.debug(`Generating root changelog (${from}...${to})`)
  logger.debug(`Root package: ${rootPackage.name} at ${rootPackage.path}`)

  const rootCommits = await getPackageCommits({
    pkg: rootPackage,
    from,
    to,
    config,
    changelog: true,
  })

  const rootChangelog = await generateChangelog({
    pkg: rootPackage,
    commits: rootCommits,
    config,
    from,
    dryRun,
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

export async function changelog(options: Partial<ChangelogOptions> = {}): Promise<void> {
  try {
    logger.start('Start generating changelogs')

    const dryRun = options.dryRun ?? false
    logger.debug(`Dry run: ${dryRun}`)

    const config = await loadMonorepoConfig({
      configName: options.configName,
      baseConfig: options.config,
      overrides: {
        from: options.from,
        to: options.to,
        logLevel: options.logLevel,
        changelog: {
          rootChangelog: options.rootChangelog,
          formatCmd: options.formatCmd,
        } satisfies ChangelogConfig,
      },
    })

    const packages = getPackagesToGenerateChangelogFor({
      config,
      bumpedPackages: options.bumpedPackages,
    })

    if (config.changelog?.rootChangelog) {
      if (config.monorepo.versionMode === 'independent') {
        await generateIndependentRootChangelog({
          packages,
          config,
          dryRun,
        })
      }
      else {
        await generateSimpleRootChangelog({
          config,
          dryRun,
        })
      }
    }
    else {
      logger.debug('Skipping root changelog generation')
    }

    logger.debug('Generating package changelogs...')

    logger.debug(`Processing ${packages.length} package(s)`)

    let generatedCount = 0

    for await (const pkg of packages) {
      const { from, to } = await resolveTags<'independent' | 'selective' | 'unified', 'changelog'>({
        config,
        versionMode: config.monorepo.versionMode,
        step: 'changelog',
        currentVersion: pkg.version,
        newVersion: undefined,
        pkg,
        logLevel: config.logLevel,
      })

      logger.debug(`Processing ${pkg.name} (${from}...${to})`)

      const commits = await getPackageCommits({
        pkg,
        from,
        to,
        config,
        changelog: true,
      })

      logger.debug(`${pkg.name}: ${commits.length} commit(s)`)

      const changelog = await generateChangelog({
        pkg,
        commits,
        config,
        from,
        dryRun,
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

    await executeFormatCmd({
      config,
      dryRun,
    })

    logger.success(`${dryRun ? '[dry run] ' : ''}Changelog generation completed!`)
  }
  catch (error) {
    logger.error('Error generating changelogs:', error)
    throw error
  }
}
