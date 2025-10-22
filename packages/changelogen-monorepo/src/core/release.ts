import type { GitProvider } from '../types'
import type { ResolvedChangelogMonorepoConfig } from './config'
import { logger } from '@maz-ui/node'
import { github } from '../commands/github'
import { gitlab } from '../commands/gitlab'
import { detectGitProvider } from '../core'

export async function publishToGitProvider({ provider, from, to, dryRun, config }: {
  provider?: GitProvider
  from: string
  to: string
  dryRun?: boolean
  config?: ResolvedChangelogMonorepoConfig
}): Promise<GitProvider> {
  const detectedProvider = provider || detectGitProvider()

  if (!detectedProvider) {
    logger.warn('Unable to detect Git provider. Skipping release publication.')
    throw new Error('Unable to detect Git provider')
  }
  else {
    logger.info(`Detected Git provider: ${detectedProvider}`)
  }

  if (detectedProvider === 'github') {
    await github({
      from,
      to,
      dryRun,
      config,
    })
  }
  else if (detectedProvider === 'gitlab') {
    await gitlab({
      from,
      to,
      dryRun,
      config,
    })
  }

  return detectedProvider
}
