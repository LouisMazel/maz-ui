import type { ResolvedChangelogMonorepoConfig } from '../config'
import { consola } from 'consola'

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

  const repo = config.repo.repo

  if (!repo) {
    throw new Error('No repository URL found in config')
  }

  consola.debug(`Parsed repository URL: ${repo}`)

  const projectPath = encodeURIComponent(repo)

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
    if (dryRun) {
      consola.info('Would create GitLab release:', JSON.stringify(payload, null, 2))
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

    consola.success(`Created GitLab release: ${result._links.self}`)

    return result
  }
  catch (error) {
    consola.error('Failed to create GitLab release:', (error as Error).message)
    throw error
  }
}
