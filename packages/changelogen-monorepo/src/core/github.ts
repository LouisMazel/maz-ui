import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { BumpResult, GitProviderOptions, PackageInfo, PostedRelease } from '../types'
import { logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'
import { createGithubRelease } from 'changelogen'
import { generateChangelog, getPackageCommits, getPackages, getRootPackage, isPrerelease, loadMonorepoConfig } from '../core'

async function githubIndependentMode({
  config,
  dryRun,
  bumpedPackages,
}: {
  config: ResolvedChangelogMonorepoConfig
  dryRun: boolean
  bumpedPackages?: PackageInfo[]
}): Promise<PostedRelease[]> {
  const repoConfig = config.repo

  if (!repoConfig) {
    throw new Error('No repository configuration found. Please check your changelog config.')
  }

  logger.debug(`GitHub token: ${config.tokens.github ? '✓ provided' : '✗ missing'}`)

  if (!config.tokens.github) {
    throw new Error('No GitHub token specified. Set GITHUB_TOKEN or GH_TOKEN environment variable.')
  }

  const packages = bumpedPackages || getPackages({
    cwd: config.cwd,
    patterns: config.monorepo.packages,
    ignorePackageNames: config.monorepo.ignorePackageNames,
  })

  logger.info(`Creating ${packages.length} GitHub release(s)`)

  const postedReleases: PostedRelease[] = []

  for (const pkg of packages) {
    const to = `${pkg.name}@${pkg.version}`
    const from = pkg.fromTag

    if (!from) {
      logger.warn(`No fromTag found for ${pkg.name}, skipping release`)
      continue
    }

    const toTag = dryRun ? 'HEAD' : to

    logger.debug(`Processing ${pkg.name}: ${from} → ${toTag}`)

    const commits = await getPackageCommits({
      pkg,
      to: toTag,
      from,
      config,
      changelog: true,
    })

    const changelog = await generateChangelog({
      pkg,
      commits,
      config,
      from,
      dryRun,
    })

    const releaseBody = changelog.split('\n').slice(2).join('\n')

    const release = {
      tag_name: to,
      name: to,
      body: releaseBody,
      prerelease: isPrerelease(pkg.version),
    }

    logger.debug(`Creating release for ${to}${release.prerelease ? ' (prerelease)' : ''}`)

    if (dryRun) {
      logger.info(`[dry-run] Publish GitHub release for ${to}`)
      postedReleases.push({
        name: pkg.name,
        tag: release.tag_name,
        version: pkg.version,
        prerelease: release.prerelease,
      })
    }
    else {
      logger.debug(`Publishing release ${to} to GitHub...`)

      await createGithubRelease({
        ...config,
        from,
        to,
        repo: repoConfig,
      }, release)

      postedReleases.push({
        name: pkg.name,
        tag: release.tag_name,
        version: pkg.version,
        prerelease: release.prerelease,
      })
    }
  }

  if (postedReleases.length === 0) {
    logger.warn('No releases created')
  }
  else {
    logger.success(`Releases ${postedReleases.map(r => r.tag).join(', ')} published to GitHub!`)
  }

  return postedReleases
}

async function githubUnified({
  config,
  dryRun,
  rootPackage,
  fromTag,
}: {
  config: ResolvedChangelogMonorepoConfig
  dryRun: boolean
  rootPackage: PackageInfo
  fromTag?: string
}) {
  const repoConfig = config.repo

  if (!repoConfig) {
    throw new Error('No repository configuration found. Please check your changelog config.')
  }

  logger.debug(`GitHub token: ${config.tokens.github ? '✓ provided' : '✗ missing'}`)

  if (!config.tokens.github) {
    throw new Error('No GitHub token specified. Set GITHUB_TOKEN or GH_TOKEN environment variable.')
  }

  const to = config.templates.tagBody.replace('{{newVersion}}', rootPackage.version)
  const from = fromTag

  if (!from) {
    logger.warn('No fromTag found for root package, skipping release')
    return []
  }

  const toTag = dryRun ? 'HEAD' : to

  const commits = await getPackageCommits({
    pkg: rootPackage,
    config,
    from,
    to: toTag,
    changelog: true,
  })
  logger.debug(`Found ${commits.length} commit(s)`)

  const changelog = await generateChangelog({
    pkg: rootPackage,
    commits,
    config,
    from,
    dryRun,
  })

  const releaseBody = changelog.split('\n').slice(2).join('\n')

  const release = {
    tag_name: to,
    name: to,
    body: releaseBody,
    prerelease: isPrerelease(to),
  }

  logger.debug(`Creating release for ${to}${release.prerelease ? ' (prerelease)' : ''}`)
  logger.debug('Release details:', formatJson({
    tag_name: release.tag_name,
    name: release.name,
    prerelease: release.prerelease,
  }))

  if (dryRun) {
    logger.info('[dry-run] Publish GitHub release for', release.tag_name)
  }
  else {
    logger.debug('Publishing release to GitHub...')
    await createGithubRelease({
      ...config,
      from,
      to,
      repo: repoConfig,
    }, release)
  }

  logger.success(`Release ${to} published to GitHub!`)

  return [{
    name: to,
    tag: to,
    version: to,
    prerelease: release.prerelease,
  }] satisfies PostedRelease[]
}

export async function github(options: Partial<GitProviderOptions> & { bumpResult?: BumpResult } = {}) {
  try {
    logger.start('Start publishing GitHub release')

    const dryRun = options.dryRun ?? false
    logger.debug(`Dry run: ${dryRun}`)

    const config = await loadMonorepoConfig({
      configName: options.configName,
      baseConfig: options.config,
      overrides: {
        from: options.from,
        to: options.to,
        logLevel: options.logLevel,
        tokens: {
          github: options.token || process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
        },
      },
    })

    if (!options.bumpResult?.bumped) {
      logger.warn('No bump result found, skipping release')
      return []
    }

    if (config.monorepo.versionMode === 'independent') {
      return await githubIndependentMode({ config, dryRun, bumpedPackages: options.bumpResult.bumpedPackages })
    }

    const rootPackage = getRootPackage(config.cwd)

    return await githubUnified({
      config,
      dryRun,
      rootPackage,
      fromTag: options.bumpResult.fromTag,
    })
  }
  catch (error) {
    logger.error('Error publishing GitHub release:', error)
    throw error
  }
}
