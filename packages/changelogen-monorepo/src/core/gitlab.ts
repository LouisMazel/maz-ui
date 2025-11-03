import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { BumpResult, GitProviderOptions, PackageInfo, PostedRelease } from '../types'
import { execPromise, logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'
import { generateChangelog, getPackageCommits, getPackages, getRootPackage, isPrerelease, loadMonorepoConfig } from '../core'

export interface GitlabRelease {
  tag_name: string
  name?: string
  description?: string
  ref?: string
  milestones?: string[]
  assets?: {
    links?: Array<{
      name: string
      url: string
    }>
  }
  released_at?: string
}

export interface GitlabReleaseResponse {
  tag_name: string
  name: string
  description: string
  created_at: string
  released_at: string
  _links: {
    self: string
  }
}

export async function createGitlabRelease({
  config,
  release,
  dryRun,
}: {
  config: ResolvedChangelogMonorepoConfig
  release: GitlabRelease
  dryRun?: boolean
}): Promise<GitlabReleaseResponse> {
  const token = config.tokens.gitlab || process.env.GITLAB_TOKEN || process.env.CI_JOB_TOKEN

  if (!token && !dryRun) {
    throw new Error(
      'No GitLab token found. Set GITLAB_TOKEN or CI_JOB_TOKEN environment variable or configure tokens.gitlab',
    )
  }

  const repoConfig = config.repo?.repo

  if (!repoConfig) {
    throw new Error('No repository URL found in config')
  }

  logger.debug(`Parsed repository URL: ${repoConfig}`)

  const projectPath = encodeURIComponent(repoConfig)

  const gitlabDomain = config.repo?.domain || 'gitlab.com'
  const apiUrl = `https://${gitlabDomain}/api/v4/projects/${projectPath}/releases`

  logger.info(`Creating GitLab release at: ${apiUrl}`)

  const payload = {
    tag_name: release.tag_name,
    name: release.name || release.tag_name,
    description: release.description || '',
    ref: release.ref || 'main',
  }

  try {
    if (dryRun) {
      logger.info('[dry-run] GitLab release:', formatJson(payload))
      return {
        tag_name: release.tag_name,
        name: release.name || release.tag_name,
        description: release.description || '',
        created_at: new Date().toISOString(),
        released_at: new Date().toISOString(),
        _links: {
          self: `${apiUrl}/${encodeURIComponent(release.tag_name)}`,
        },
      }
    }

    logger.debug(`POST GitLab release to ${apiUrl} with payload: ${formatJson(payload)}`)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': token || '',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GitLab API error (${response.status}): ${errorText}`)
    }

    const result = (await response.json()) as GitlabReleaseResponse

    logger.debug(`Created GitLab release: ${result._links.self}`)

    return result
  }
  catch (error) {
    logger.error('Failed to create GitLab release:', error)
    throw error
  }
}

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
    const to = `${pkg.name}@${pkg.version}`
    const from = pkg.fromTag

    if (!from) {
      logger.warn(`No fromTag found for ${pkg.name}, skipping release`)
      continue
    }

    logger.debug(`Processing ${pkg.name}: ${from} → ${to}`)

    const commits = await getPackageCommits({
      pkg,
      config,
      from,
      to,
      changelog: true,
    })

    const changelog = await generateChangelog({
      pkg,
      commits,
      config,
      from,
      dryRun,
    })

    if (!changelog) {
      logger.warn(`No changelog found for ${pkg.name}`)
      continue
    }

    const releaseBody = changelog.split('\n').slice(2).join('\n')

    const release = {
      tag_name: to,
      name: to,
      description: releaseBody,
      ref: currentBranch.trim(),
    }

    logger.debug(`Creating release for ${to} (ref: ${release.ref})`)

    if (dryRun) {
      logger.info(`[dry-run] Publish GitLab release for ${to}`)
    }
    else {
      logger.debug(`Publishing release ${to} to GitLab...`)
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

async function gitlabUnified({
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
  logger.debug(`GitLab token: ${config.tokens.gitlab ? '✓ provided' : '✗ missing'}`)

  const to = config.templates.tagBody.replace('{{newVersion}}', rootPackage.version)
  const from = fromTag

  if (!from) {
    logger.warn('No fromTag found for root package, skipping release')
    return []
  }

  const commits = await getPackageCommits({
    pkg: rootPackage,
    config,
    from,
    to,
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

  logger.debug('Getting current branch...')
  const { stdout: currentBranch } = await execPromise('git rev-parse --abbrev-ref HEAD', {
    noSuccess: true,
    noStdout: true,
    logLevel: config.logLevel,
  })

  const release = {
    tag_name: to,
    name: to,
    description: releaseBody,
    ref: currentBranch.trim(),
  }

  logger.info(`Creating release for ${to} (ref: ${release.ref})`)
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

  logger.success(`Release ${to} published to GitLab!`)

  return [{
    name: to,
    tag: to,
    version: to,
    prerelease: isPrerelease(rootPackage.version),
  }] satisfies PostedRelease[]
}

export async function gitlab(options: Partial<GitProviderOptions> & { bumpResult?: BumpResult } = {}): Promise<PostedRelease[]> {
  try {
    logger.start('Start publishing GitLab release')

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
          gitlab: options.token || process.env.CHANGELOGEN_TOKENS_GITLAB || process.env.GITLAB_TOKEN || process.env.GITLAB_API_TOKEN || process.env.CI_JOB_TOKEN,
        },
      },
    })

    if (!options.bumpResult?.bumped) {
      logger.warn('No bump result found, skipping release')
      return []
    }

    if (config.monorepo.versionMode === 'independent') {
      return await gitlabIndependentMode({
        config,
        dryRun,
        bumpedPackages: options.bumpResult.bumpedPackages,
      })
    }

    const rootPackage = getRootPackage(process.cwd())
    logger.debug(`Root package: ${rootPackage.name}@${rootPackage.version}`)

    return await gitlabUnified({
      config,
      dryRun,
      rootPackage,
      fromTag: options.bumpResult.fromTag,
    })
  }
  catch (error) {
    logger.error('Error publishing GitLab release:', error)
    throw error
  }
}
