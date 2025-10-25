import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { GitProviderOptions, PackageInfo, PostedRelease } from '../types'
import { logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'
import { createGithubRelease, getCurrentGitBranch } from 'changelogen'
import { generateChangelog, getLastPackageTag, getPackageCommits, getPackages, getRootPackage, isPrerelease, loadMonorepoConfig } from '../core'

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
    const lastTag = pkg.fromTag || await getLastPackageTag({ packageName: pkg.name, logLevel: config.logLevel }) || config.from
    const newTag = `${pkg.name}@${pkg.version}`

    logger.debug(`Processing ${pkg.name}: ${lastTag || 'initial'} → ${newTag}`)

    const to = dryRun ? getCurrentGitBranch() : newTag

    const commits = await getPackageCommits({
      pkg,
      config: {
        ...config,
        to,
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
        to,
      },
      newTag,
    })

    const releaseBody = changelog.split('\n').slice(2).join('\n')

    const release = {
      tag_name: newTag,
      name: newTag,
      body: releaseBody,
      prerelease: isPrerelease(pkg.version),
    }

    logger.debug(`Creating release for ${newTag}${release.prerelease ? ' (prerelease)' : ''}`)

    if (dryRun) {
      logger.info(`[dry-run] Publish GitHub release for ${newTag}`)
      postedReleases.push({
        name: pkg.name,
        tag: release.tag_name,
        version: pkg.version,
        prerelease: release.prerelease,
      })
    }
    else {
      logger.debug(`Publishing release ${newTag} to GitHub...`)
      await createGithubRelease({
        ...config,
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

async function githubSimple({
  config,
  dryRun,
  rootPackage,
}: {
  config: ResolvedChangelogMonorepoConfig
  dryRun: boolean
  rootPackage: PackageInfo
}) {
  const repoConfig = config.repo

  if (!repoConfig) {
    throw new Error('No repository configuration found. Please check your changelog config.')
  }

  logger.debug(`Commit range: ${config.from}...${config.to}`)
  logger.debug(`GitHub token: ${config.tokens.github ? '✓ provided' : '✗ missing'}`)

  if (!config.tokens.github) {
    throw new Error('No GitHub token specified. Set GITHUB_TOKEN or GH_TOKEN environment variable.')
  }

  const commits = await getPackageCommits({
    pkg: rootPackage,
    config,
    changelog: true,
  })
  logger.debug(`Found ${commits.length} commit(s)`)

  const changelog = await generateChangelog({
    pkg: rootPackage,
    commits,
    config,
    newTag: config.to,
  })

  const releaseBody = changelog.split('\n').slice(2).join('\n')

  const to = rootPackage.version
  const tagName = config.templates.tagBody?.replaceAll('{{newVersion}}', to) ?? to

  const release = {
    tag_name: tagName,
    name: tagName,
    body: releaseBody,
    prerelease: isPrerelease(to),
  }

  logger.debug(`Creating release for ${tagName}${release.prerelease ? ' (prerelease)' : ''}`)
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
      repo: repoConfig,
    }, release)
  }

  logger.success(`Release ${tagName} published to GitHub!`)

  return [{
    name: tagName,
    tag: tagName,
    version: to,
    prerelease: release.prerelease,
  }] satisfies PostedRelease[]
}

export async function github(options: Partial<GitProviderOptions> & { bumpedPackages?: PackageInfo[] } = {}) {
  try {
    logger.start('Start publishing GitHub release')

    const dryRun = options.dryRun ?? false
    logger.debug(`Dry run: ${dryRun}`)

    const config = options.config || await loadMonorepoConfig({
      overrides: {
        from: options.from,
        to: options.to,
        logLevel: options.logLevel,
        tokens: {
          github: options.token || process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
        },
      },
    })

    if (config.monorepo.versionMode === 'independent') {
      return await githubIndependentMode({ config, dryRun, bumpedPackages: options.bumpedPackages })
    }

    const rootPackage = getRootPackage(config.cwd)
    logger.debug(`Root package: ${rootPackage.name}@${rootPackage.version}`)

    return await githubSimple({
      config,
      dryRun,
      rootPackage,
    })
  }
  catch (error) {
    logger.error('Error publishing GitHub release:', error)
    throw error
  }
}
