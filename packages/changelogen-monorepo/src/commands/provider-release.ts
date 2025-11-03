import type { LogLevel } from '@maz-ui/node'
import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { BumpResult, GitProvider, PostedRelease } from '../types'
import { logger } from '@maz-ui/node'
import { detectGitProvider, github, gitlab, loadMonorepoConfig } from '../core'

export async function providerRelease(options: {
  token?: string
  from?: string
  to?: string
  provider?: GitProvider
  config?: ResolvedChangelogMonorepoConfig
  bumpResult?: BumpResult
  logLevel?: LogLevel
  dryRun?: boolean
}): Promise<{ detectedProvider: GitProvider, postedReleases: PostedRelease[] }> {
  const dryRun = options.dryRun ?? false
  logger.debug(`Dry run: ${dryRun}`)

  const config = await loadMonorepoConfig({
    baseConfig: options.config,
    overrides: {
      from: options.from,
      to: options.to,
      tokens: {
        github: options.token,
        gitlab: options.token,
      },
      logLevel: options.logLevel,
    },
  })

  const detectedProvider = options.provider || detectGitProvider()

  if (!detectedProvider) {
    logger.warn('Unable to detect Git provider. Skipping release publication.')
    throw new Error('Unable to detect Git provider')
  }
  else {
    logger.info(
      options.provider ? `Using Git provider: ${options.provider}` : `Detected Git provider: ${detectedProvider}`,
    )
  }

  let postedReleases: PostedRelease[] = []

  const payload = {
    from: config.from,
    dryRun,
    config,
    logLevel: config.logLevel,
    bumpResult: options.bumpResult,
  }

  if (detectedProvider === 'github') {
    postedReleases = await github(payload)
  }
  else if (detectedProvider === 'gitlab') {
    postedReleases = await gitlab(payload)
  }
  else {
    logger.warn(`Unsupported Git provider: ${detectedProvider}`)
  }

  return {
    detectedProvider,
    postedReleases,
  }
}
