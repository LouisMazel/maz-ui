import type { GitlabOptions } from '../types'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import { loadMonorepoConfig } from '../config'
import { generateChangelog } from '../core/changelog'
import { getPackageCommits, getRootPackage } from '../core/monorepo'
import { createGitlabRelease } from '../utils/gitlab'

export async function gitlabCommand(options: GitlabOptions = {}): Promise<void> {
  try {
    consola.start('Publishing GitLab release...')

    const rootDir = process.cwd()

    const { stdout: penultimateTag } = await execPromise('git tag --sort=-creatordate | sed -n \'2p\'')
    const { stdout: lastTag } = await execPromise('git tag --sort=-creatordate | sed -n \'1p\'', {
      noSuccess: true,
      noStdout: true,
    })

    const lastTagTrimmed = lastTag.trim()
    const penultimateTagTrimmed = penultimateTag.trim()

    consola.info(`Creating release for tag: ${lastTagTrimmed} (from ${penultimateTagTrimmed})`)

    const config = await loadMonorepoConfig(rootDir, {
      from: penultimateTagTrimmed,
      to: lastTagTrimmed,
      tokens: {
        gitlab: options.token || process.env.CHANGELOGEN_TOKENS_GITLAB || process.env.GITLAB_TOKEN || process.env.CI_JOB_TOKEN,
      },
    })

    if (!config.tokens.gitlab && !options.dryRun) {
      throw new Error('No GitLab token specified. Set GITLAB_TOKEN or CI_JOB_TOKEN environment variable.')
    }

    const rootPackage = getRootPackage(rootDir)

    const commits = await getPackageCommits(rootPackage, config, rootDir)
    const changelog = await generateChangelog(rootPackage, commits, config)

    if (!changelog) {
      consola.error('No changelog found for latest version')
      return
    }

    const releaseBody = changelog.split('\n').slice(2).join('\n')

    const tagName = lastTagTrimmed.startsWith('v') ? lastTagTrimmed : `v${lastTagTrimmed}`

    const { stdout: currentBranch } = await execPromise('git rev-parse --abbrev-ref HEAD', {
      noSuccess: true,
      noStdout: true,
    })

    const release = {
      tag_name: tagName,
      name: tagName,
      description: releaseBody,
      ref: currentBranch.trim() || 'main',
    }

    consola.info('Release details:', JSON.stringify({
      tag_name: release.tag_name,
      name: release.name,
      ref: release.ref,
    }, null, 2))

    if (options.dryRun) {
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
