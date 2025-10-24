import type { ResolvedChangelogMonorepoConfig } from '../core'
import { logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'

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
