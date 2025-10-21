import type { GitProvider } from '../types'
import consola from 'consola'
import { github } from '../commands/github'
import { gitlab } from '../commands/gitlab'
import { detectGitProvider } from '../utils/git'

export async function publishToGitProvider({ provider, from, to }: {
  provider?: GitProvider
  from: string
  to: string
}): Promise<GitProvider | 'none' | 'unknown'> {
  const detectedProvider = provider || detectGitProvider()

  if (!detectedProvider) {
    consola.warn('Unable to detect Git provider. Skipping release publication.')
    return 'unknown'
  }

  if (detectedProvider === 'github') {
    await github({
      from,
      to,
    })
  }
  else if (detectedProvider === 'gitlab') {
    await gitlab({
      from,
      to,
    })
  }

  return detectedProvider
}
