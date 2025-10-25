import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { GitProviderOptions, PackageInfo, PostedRelease } from '../types'
import { execPromise, logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'
import { createGitlabRelease, generateChangelog, getLastPackageTag, getLastTag, getPackageCommits, getPackages, getRootPackage, isPrerelease, loadMonorepoConfig } from '../core'

async function gitlabIndependentMode({
  config,
  dryRun,
  bumpedPackages,
}: {
  config: ResolvedChangelogMonorepoConfig
  dryRun: boolean
  bumpedPackages?: PackageInfo[]
}): Promise<PostedRelease[]> {
  logger.debug(`GitLab token: ${config.tokens.gitlab ? '✓ provided' : '✗ missing'}`)

  const packages = bumpedPackages || getPackages({
    cwd: config.cwd,
    patterns: config.monorepo.packages,
    ignorePackageNames: config.monorepo.ignorePackageNames,
  })

  logger.info(`Creating ${packages.length} GitLab release(s) for independent packages`)

  logger.debug('Getting current branch...')
  const { stdout: currentBranch } = await execPromise('git rev-parse --abbrev-ref HEAD', {
    noSuccess: true,
    noStdout: true,
    logLevel: config.logLevel,
  })

  const postedReleases: PostedRelease[] = []

  for (const pkg of packages) {
    const lastTag = pkg.fromTag || await getLastPackageTag({ packageName: pkg.name, logLevel: config.logLevel })
    const currentTag = `${pkg.name}@${pkg.version}`

    logger.debug(`Processing ${pkg.name}: ${lastTag || 'initial'} → ${currentTag}`)

    const commits = await getPackageCommits({
      pkg,
      config: {
        ...config,
        from: lastTag || config.from,
      },
      changelog: true,
    })

    const changelog = await generateChangelog({
      pkg,
      commits,
      config: {
        ...config,
        from: lastTag || config.from,
        to: currentTag,
      },
      newTag: currentTag,
    })

    if (!changelog) {
      logger.warn(`No changelog found for ${pkg.name}`)
      continue
    }

    const releaseBody = changelog.split('\n').slice(2).join('\n')

    const release = {
      tag_name: currentTag,
      name: currentTag,
      description: releaseBody,
      ref: currentBranch.trim(),
    }

    logger.debug(`Creating release for ${currentTag} (ref: ${release.ref})`)

    if (dryRun) {
      logger.info(`[dry-run] Publish GitLab release for ${currentTag}`)
    }
    else {
      logger.debug(`Publishing release ${currentTag} to GitLab...`)
      await createGitlabRelease({
        config,
        release,
        dryRun,
      })
      postedReleases.push({
        name: pkg.name,
        tag: release.tag_name,
        version: pkg.version,
        prerelease: isPrerelease(pkg.version),
      })
    }
  }

  if (postedReleases.length === 0) {
    logger.warn('No releases created')
  }
  else {
    logger.success(`Releases ${postedReleases.map(r => r.tag).join(', ')} published to GitLab!`)
  }

  return postedReleases
}

async function gitlabSimple({
  config,
  dryRun,
  rootPackage,
}: {
  config: ResolvedChangelogMonorepoConfig
  dryRun: boolean
  rootPackage: PackageInfo
}) {
  logger.debug(`Commit range: ${config.from}...${config.to}`)
  logger.debug(`GitLab token: ${config.tokens.gitlab ? '✓ provided' : '✗ missing'}`)

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

  const to = rootPackage.version || config.to
  const tagName = config.templates.tagBody?.replaceAll('{{newVersion}}', to) ?? to

  logger.debug('Getting current branch...')
  const { stdout: currentBranch } = await execPromise('git rev-parse --abbrev-ref HEAD', {
    noSuccess: true,
    noStdout: true,
    logLevel: config.logLevel,
  })

  const release = {
    tag_name: tagName,
    name: tagName,
    description: releaseBody,
    ref: currentBranch.trim(),
  }

  logger.info(`Creating release for ${tagName} (ref: ${release.ref})`)
  logger.debug('Release details:', formatJson({
    tag_name: release.tag_name,
    name: release.name,
    ref: release.ref,
  }))

  if (dryRun) {
    logger.info('[dry-run] Publish GitLab release for', release.tag_name)
  }
  else {
    logger.debug('Publishing release to GitLab...')
    await createGitlabRelease({
      config,
      release,
      dryRun,
    })
  }

  logger.success(`Release ${tagName} published to GitLab!`)

  return [{
    name: tagName,
    tag: tagName,
    version: to,
    prerelease: isPrerelease(rootPackage.version),
  }] satisfies PostedRelease[]
}

export async function gitlab(options: Partial<GitProviderOptions> & { bumpedPackages?: PackageInfo[] } = {}): Promise<PostedRelease[]> {
  try {
    logger.start('Start publishing GitLab release')

    const dryRun = options.dryRun ?? false
    logger.debug(`Dry run: ${dryRun}`)

    const config = options.config || await loadMonorepoConfig({
      overrides: {
        from: options.from,
        to: options.to,
        logLevel: options.logLevel,
        tokens: {
          gitlab: options.token || process.env.CHANGELOGEN_TOKENS_GITLAB || process.env.GITLAB_TOKEN || process.env.GITLAB_API_TOKEN || process.env.CI_JOB_TOKEN,
        },
      },
    })

    if (config.monorepo.versionMode === 'independent') {
      return await gitlabIndependentMode({
        config,
        dryRun,
        bumpedPackages: options.bumpedPackages,
      })
    }

    const rootPackage = getRootPackage(process.cwd())
    logger.debug(`Root package: ${rootPackage.name}@${rootPackage.version}`)

    return await gitlabSimple({
      config: {
        ...config,
        from: options.from || await getLastTag({ version: rootPackage.version, logLevel: options.logLevel }),
      },
      dryRun,
      rootPackage,
    })
  }
  catch (error) {
    logger.error('Error publishing GitLab release:', error)
    throw error
  }
}
