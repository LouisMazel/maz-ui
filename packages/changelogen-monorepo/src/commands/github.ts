import type { GithubOptions } from '../types'
import { execPromise } from '@maz-ui/node'
import { createGithubRelease } from 'changelogen'
import consola from 'consola'
import { getRootDir, loadMonorepoConfig } from '../config'
import { generateChangelog } from '../core/changelog'
import { getPackageCommits, getRootPackage } from '../core/monorepo'

export async function githubCommand(options: GithubOptions = {}): Promise<void> {
  try {
    consola.start('Publishing GitHub release...')

    const cwd = process.cwd()

    const { stdout: penultimateTag } = await execPromise('git tag --sort=-creatordate | sed -n \'2p\'')
    const { stdout: lastTag } = await execPromise('git tag --sort=-creatordate | sed -n \'1p\'', {
      noSuccess: true,
      noStdout: true,
    })

    const lastTagTrimmed = lastTag.trim()
    const penultimateTagTrimmed = penultimateTag.trim()

    consola.info(`Creating release for tag: ${lastTagTrimmed} (from ${penultimateTagTrimmed})`)

    const { changelogConfig } = await loadMonorepoConfig(cwd, {
      from: penultimateTagTrimmed,
      to: lastTagTrimmed,
      tokens: {
        github: options.token || process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
      },
    })

    if (!changelogConfig.tokens.github) {
      throw new Error('No GitHub token specified. Set GITHUB_TOKEN or GH_TOKEN environment variable.')
    }

    const rootDir = getRootDir(cwd)
    const rootPackage = getRootPackage(rootDir)

    const commits = await getPackageCommits(rootPackage, changelogConfig, rootDir)
    const changelog = await generateChangelog(rootPackage, commits, changelogConfig)

    if (!changelog) {
      consola.error('No changelog found for latest version')
      return
    }

    const releaseBody = changelog.split('\n').slice(2).join('\n')

    const tagName = lastTagTrimmed.startsWith('v') ? lastTagTrimmed : `v${lastTagTrimmed}`
    const isPrerelease = /-(?:alpha|beta|rc|dev|next)/.test(lastTagTrimmed)

    const release = {
      tag_name: tagName,
      name: tagName,
      body: releaseBody,
      prerelease: isPrerelease,
    }

    consola.info('Release details:', {
      tag_name: release.tag_name,
      name: release.name,
      prerelease: release.prerelease,
    })

    await createGithubRelease(changelogConfig, release)

    consola.success(`Release ${tagName} published to GitHub!`)
  }
  catch (error) {
    consola.error('Error publishing GitHub release:', (error as Error).message)
    throw error
  }
}
