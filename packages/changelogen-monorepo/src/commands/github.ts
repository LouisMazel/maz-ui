import type { GitProviderOptions } from '../types'
import { logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'
import { createGithubRelease } from 'changelogen'
import { generateChangelog, getLastTag, getPackageCommits, getRootPackage, isPrerelease, loadMonorepoConfig } from '../core'

export async function github(options: Partial<GitProviderOptions> = {}): Promise<void> {
  try {
    logger.start('Start publishing GitHub release')

    const dryRun = options.dryRun ?? false
    logger.debug(`Dry run: ${dryRun}`)

    const rootPackage = getRootPackage(process.cwd())
    logger.debug(`Root package: ${rootPackage.name}@${rootPackage.version}`)

    const config = options.config || await loadMonorepoConfig({
      overrides: {
        from: options.from || await getLastTag({ version: rootPackage.version, logLevel: options.logLevel }),
        to: options.to,
        logLevel: options.logLevel,
        tokens: {
          github: options.token || process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
        },
      },
    })

    logger.debug(`Commit range: ${config.from}...${config.to}`)
    logger.debug(`GitHub token: ${config.tokens.github ? '✓ provided' : '✗ missing'}`)

    if (!config.tokens.github && !dryRun) {
      throw new Error('No GitHub token specified. Set GITHUB_TOKEN or GH_TOKEN environment variable.')
    }

    const commits = await getPackageCommits({
      pkg: rootPackage,
      config,
    })
    logger.debug(`Found ${commits.length} commit(s)`)

    const changelog = await generateChangelog({
      pkg: rootPackage,
      commits,
      config,
    })

    const releaseBody = changelog.split('\n').slice(2).join('\n')

    const to = rootPackage.version || config.to
    const tagName = config.templates.tagBody?.replaceAll('{{newVersion}}', to) ?? to

    const release = {
      tag_name: tagName,
      name: tagName,
      body: releaseBody,
      prerelease: isPrerelease(to),
    }

    logger.debug(`Creating release for ${tagName}${release.prerelease ? ' (prerelease)' : ''}`)
    logger.debug('Release details:', formatJson({
      tag_name: release.tag_name,
      name: release.name,
      prerelease: release.prerelease,
    }))

    if (options.dryRun) {
      logger.debug('Release content:', release.body)
    }
    else {
      logger.debug('Publishing release to GitHub...')
      await createGithubRelease(config, release)
    }

    logger.success(`Release ${tagName} published to GitHub!`)
  }
  catch (error) {
    logger.error('Error publishing GitHub release:', error)
    throw error
  }
}
