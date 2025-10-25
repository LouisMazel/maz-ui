import type { LogLevel } from '@maz-ui/node'
import type { GitProvider, PackageInfo, PostedRelease } from '../types'
import type { ResolvedChangelogMonorepoConfig } from './config'
import { logger } from '@maz-ui/node'
import { getCurrentGitBranch } from 'changelogen'
import { github } from '../commands/github'
import { gitlab } from '../commands/gitlab'
import { detectGitProvider } from '../core'

export async function publishToGitProvider({ provider, from, dryRun, config, logLevel, bumpedPackages }: {
  provider?: GitProvider
  from: string
  config: ResolvedChangelogMonorepoConfig
  bumpedPackages: PackageInfo[]
  logLevel?: LogLevel
  dryRun?: boolean
}): Promise<{ detectedProvider: GitProvider, postedReleases: PostedRelease[] }> {
  const detectedProvider = provider || detectGitProvider()

  if (!detectedProvider) {
    logger.warn('Unable to detect Git provider. Skipping release publication.')
    throw new Error('Unable to detect Git provider')
  }
  else {
    logger.info(`Detected Git provider: ${detectedProvider}`)
  }

  let postedReleases: PostedRelease[] = []

  const configWithTags = {
    ...config,
    to: dryRun ? getCurrentGitBranch() : config.to,
  }

  if (detectedProvider === 'github') {
    postedReleases = await github({
      from,
      dryRun,
      config: configWithTags,
      logLevel,
      bumpedPackages,
    })
  }
  else if (detectedProvider === 'gitlab') {
    postedReleases = await gitlab({
      from,
      dryRun,
      config: configWithTags,
      logLevel,
      bumpedPackages,
    })
  }
  else {
    logger.warn(`Unsupported Git provider: ${detectedProvider}`)
  }

  return {
    detectedProvider,
    postedReleases,
  }
}
