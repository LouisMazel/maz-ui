import type { GitProvider } from '../types'
import { execSync } from 'node:child_process'

export function detectGitProvider(cwd: string = process.cwd()): GitProvider | null {
  try {
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    const remoteUrl = execSync('git remote get-url origin', {
      cwd,
      encoding: 'utf8',
    }).trim()

    if (remoteUrl.includes('github.com')) {
      return 'github'
    }

    if (remoteUrl.includes('gitlab.com') || remoteUrl.includes('gitlab')) {
      return 'gitlab'
    }

    return null
  }
  catch {
    return null
  }
}

export function parseGitRemoteUrl(remoteUrl: string): { owner: string, repo: string } | null {
  const sshRegex = /git@[\w.-]+:([\w.-]+)\/([\w.-]+?)(?:\.git)?$/
  const httpsRegex = /https?:\/\/[\w.-]+\/([\w.-]+)\/([\w.-]+?)(?:\.git)?$/

  const sshMatch = remoteUrl.match(sshRegex)
  if (sshMatch) {
    return {
      owner: sshMatch[1]!,
      repo: sshMatch[2]!,
    }
  }

  const httpsMatch = remoteUrl.match(httpsRegex)
  if (httpsMatch) {
    return {
      owner: httpsMatch[1]!,
      repo: httpsMatch[2]!,
    }
  }

  return null
}
