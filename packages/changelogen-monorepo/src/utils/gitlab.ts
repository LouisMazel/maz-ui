import type { ResolvedChangelogConfig } from 'changelogen'
import { consola } from 'consola'
import { parseGitRemoteUrl } from './git'

interface GitlabRelease {
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

interface GitlabReleaseResponse {
  tag_name: string
  name: string
  description: string
  created_at: string
  released_at: string
  _links: {
    self: string
  }
}

export async function createGitlabRelease(
  config: ResolvedChangelogConfig,
  release: GitlabRelease,
): Promise<GitlabReleaseResponse> {
  const token = config.tokens.gitlab || process.env.GITLAB_TOKEN || process.env.CI_JOB_TOKEN

  if (!token) {
    throw new Error(
      'No GitLab token found. Set GITLAB_TOKEN environment variable or configure tokens.gitlab',
    )
  }

  const remoteUrl = config.repo.repo

  if (!remoteUrl) {
    throw new Error('No repository URL found in config')
  }

  const parsed = parseGitRemoteUrl(remoteUrl)

  if (!parsed) {
    throw new Error(`Unable to parse repository URL: ${remoteUrl}`)
  }

  const { owner, repo } = parsed
  const projectPath = encodeURIComponent(`${owner}/${repo}`)

  const gitlabDomain = config.repo.domain || 'gitlab.com'
  const apiUrl = `https://${gitlabDomain}/api/v4/projects/${projectPath}/releases`

  consola.info(`Creating GitLab release at: ${apiUrl}`)

  const payload = {
    tag_name: release.tag_name,
    name: release.name || release.tag_name,
    description: release.description || '',
    ref: release.ref || 'main',
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': token,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GitLab API error (${response.status}): ${errorText}`)
    }

    const result = (await response.json()) as GitlabReleaseResponse

    consola.success(`Created GitLab release: ${result._links.self}`)

    return result
  }
  catch (error) {
    consola.error('Failed to create GitLab release:', (error as Error).message)
    throw error
  }
}

export async function listGitlabReleases(
  config: ResolvedChangelogConfig,
): Promise<GitlabReleaseResponse[]> {
  const token = config.tokens.gitlab || process.env.GITLAB_TOKEN || process.env.CI_JOB_TOKEN

  if (!token) {
    throw new Error(
      'No GitLab token found. Set GITLAB_TOKEN environment variable or configure tokens.gitlab',
    )
  }

  const remoteUrl = config.repo.repo

  if (!remoteUrl) {
    throw new Error('No repository URL found in config')
  }

  const parsed = parseGitRemoteUrl(remoteUrl)

  if (!parsed) {
    throw new Error(`Unable to parse repository URL: ${remoteUrl}`)
  }

  const { owner, repo } = parsed
  const projectPath = encodeURIComponent(`${owner}/${repo}`)

  const gitlabDomain = config.repo.domain || 'gitlab.com'
  const apiUrl = `https://${gitlabDomain}/api/v4/projects/${projectPath}/releases`

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GitLab API error (${response.status}): ${errorText}`)
    }

    return (await response.json()) as GitlabReleaseResponse[]
  }
  catch (error) {
    consola.error('Failed to list GitLab releases:', (error as Error).message)
    throw error
  }
}

export async function getGitlabReleaseByTag(
  config: ResolvedChangelogConfig,
  tag: string,
): Promise<GitlabReleaseResponse | null> {
  const token = config.tokens.gitlab || process.env.GITLAB_TOKEN || process.env.CI_JOB_TOKEN

  if (!token) {
    throw new Error(
      'No GitLab token found. Set GITLAB_TOKEN environment variable or configure tokens.gitlab',
    )
  }

  const remoteUrl = config.repo.repo

  if (!remoteUrl) {
    throw new Error('No repository URL found in config')
  }

  const parsed = parseGitRemoteUrl(remoteUrl)

  if (!parsed) {
    throw new Error(`Unable to parse repository URL: ${remoteUrl}`)
  }

  const { owner, repo } = parsed
  const projectPath = encodeURIComponent(`${owner}/${repo}`)

  const gitlabDomain = config.repo.domain || 'gitlab.com'
  const apiUrl = `https://${gitlabDomain}/api/v4/projects/${projectPath}/releases/${encodeURIComponent(tag)}`

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'PRIVATE-TOKEN': token,
      },
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GitLab API error (${response.status}): ${errorText}`)
    }

    return (await response.json()) as GitlabReleaseResponse
  }
  catch (error) {
    consola.error('Failed to get GitLab release:', (error as Error).message)
    throw error
  }
}
