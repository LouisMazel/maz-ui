import type { GitProviderOptions } from '../types'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import { loadMonorepoConfig } from '../config'
import { generateChangelog } from '../core/changelog'
import { getPackageCommits, getRootPackage } from '../core/monorepo'
import { getLastTag } from '../core/version'
import { createGitlabRelease } from '../utils/gitlab'

export async function gitlab(options: GitProviderOptions = {}): Promise<void> {
  try {
    consola.start('Publishing GitLab release...')

    const dryRun = options.dryRun ?? false

    const rootPackage = getRootPackage(process.cwd())
    const config = await loadMonorepoConfig({
      overrides: {
        from: options.from || await getLastTag(rootPackage.version),
        to: options.to,
        tokens: {
          gitlab: options.token || process.env.CHANGELOGEN_TOKENS_GITLAB || process.env.GITLAB_TOKEN || process.env.GITLAB_API_TOKEN,
        },
      },
    })

    consola.info(`Creating release for tag: ${config.to} (from ${config.from})`)

    if (!config.tokens.gitlab && !dryRun) {
      throw new Error('No GitLab token specified. Set GITLAB_TOKEN or CI_JOB_TOKEN environment variable.')
    }

    const commits = await getPackageCommits({
      pkg: rootPackage,
      config,
    })
    const changelog = await generateChangelog({
      pkg: rootPackage,
      commits,
      config,
    })

    if (!changelog) {
      consola.warn('No changelog found for latest version')
      return
    }

    const releaseBody = changelog.split('\n').slice(2).join('\n')

    const to = rootPackage.version || config.to
    const tagName = config.templates.tagBody?.replaceAll('{{newVersion}}', to) ?? to

    const { stdout: currentBranch } = await execPromise('git rev-parse --abbrev-ref HEAD', {
      noSuccess: true,
      noStdout: true,
    })

    const release = {
      tag_name: tagName,
      name: tagName,
      description: releaseBody,
      ref: currentBranch.trim(),
    }

    consola.info('Release details:', JSON.stringify({
      tag_name: release.tag_name,
      name: release.name,
      ref: release.ref,
    }, null, 2))

    if (dryRun) {
      consola.info('Release content', release.description)
      return
    }

    await createGitlabRelease(config, release)

    consola.success(`Release ${tagName} published to GitLab!`)
  }
  catch (error) {
    consola.error('Error publishing GitLab release:', (error as Error).message)
    throw error
  }
}
