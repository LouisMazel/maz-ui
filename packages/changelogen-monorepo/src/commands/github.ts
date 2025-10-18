import type { GitProviderOptions } from '../types'
import { createGithubRelease } from 'changelogen'
import { consola } from 'consola'
import { loadMonorepoConfig } from '../config'
import { generateChangelog } from '../core/changelog'
import { getPackageCommits, getRootPackage } from '../core/monorepo'
import { getLastTag, isPrerelease } from '../core/version'

export async function github(options: GitProviderOptions = {}): Promise<void> {
  try {
    consola.start('Publishing GitHub release...')

    const rootPackage = getRootPackage(process.cwd())
    const config = await loadMonorepoConfig({
      overrides: {
        from: options.from || await getLastTag(rootPackage.version),
        to: options.to,
      },
    })

    const opts = {
      from: config.from,
      to: config.to,
      token: options.token || config.tokens.github || process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
      dryRun: options.dryRun ?? false,
    } satisfies Required<Omit<GitProviderOptions, 'token'>> & { token: string | undefined }

    consola.info(`Creating release for tag: ${opts.to} (from ${opts.from})`)

    if (!opts.token && !opts.dryRun) {
      throw new Error('No GitHub token specified. Set GITHUB_TOKEN or GH_TOKEN environment variable.')
    }

    const commits = await getPackageCommits({
      pkg: rootPackage,
      config,
      from: opts.from,
      to: opts.to,
    })
    const to = rootPackage.version || opts.to
    const changelog = await generateChangelog({
      pkg: rootPackage,
      commits,
      config,
      from: opts.from,
      to,
    })

    if (!changelog) {
      consola.error('No changelog found for latest version')
      return
    }

    const releaseBody = changelog.split('\n').slice(2).join('\n')

    const tagName = config.templates.tagBody?.replaceAll('{{newVersion}}', to) ?? to

    const release = {
      tag_name: tagName,
      name: tagName,
      body: releaseBody,
      prerelease: isPrerelease(to),
    }

    consola.info('Release details:', JSON.stringify({
      tag_name: release.tag_name,
      name: release.name,
      prerelease: release.prerelease,
    }, null, 2))

    if (options.dryRun) {
      consola.info('Release content', release.body)
      return
    }

    await createGithubRelease(config, release)

    consola.success(`Release ${tagName} published to GitHub!`)
  }
  catch (error) {
    consola.error('Error publishing GitHub release:', (error as Error).message)
    throw error
  }
}
