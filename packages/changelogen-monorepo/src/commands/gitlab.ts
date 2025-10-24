import type { GitProviderOptions } from '../types'
import { execPromise, logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'
import { createGitlabRelease, generateChangelog, getLastTag, getPackageCommits, getRootPackage, loadMonorepoConfig } from '../core'

export async function gitlab(options: Partial<GitProviderOptions> = {}): Promise<void> {
  try {
    logger.start('Start publishing GitLab release')

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
          gitlab: options.token || process.env.CHANGELOGEN_TOKENS_GITLAB || process.env.GITLAB_TOKEN || process.env.GITLAB_API_TOKEN || process.env.CI_JOB_TOKEN,
        },
      },
    })

    logger.debug(`Commit range: ${config.from}...${config.to}`)
    logger.debug(`GitLab token: ${config.tokens.gitlab ? '✓ provided' : '✗ missing'}`)

    logger.debug('Fetching commits for changelog...')
    const commits = await getPackageCommits({
      pkg: rootPackage,
      config,
      changelog: true,
    })
    logger.debug(`Found ${commits.length} commit(s)`)

    const changelog = await generateChangelog({
      pkg: rootPackage,
      commits,
      config,
    })

    if (!changelog) {
      logger.warn('No changelog found for latest version')
      return
    }

    const releaseBody = changelog.split('\n').slice(2).join('\n')

    const to = rootPackage.version || config.to
    const tagName = config.templates.tagBody?.replaceAll('{{newVersion}}', to) ?? to

    logger.debug('Getting current branch...')
    const { stdout: currentBranch } = await execPromise('git rev-parse --abbrev-ref HEAD', {
      noSuccess: true,
      noStdout: true,
      logLevel: config.logLevel,
    })

    const release = {
      tag_name: tagName,
      name: tagName,
      description: releaseBody,
      ref: currentBranch.trim(),
    }

    logger.info(`Creating release for ${tagName} (ref: ${release.ref})`)
    logger.debug('Release details:', formatJson({
      tag_name: release.tag_name,
      name: release.name,
      ref: release.ref,
    }))

    if (dryRun) {
      logger.debug('Release content:', release.description)
    }
    else {
      logger.debug('Publishing release to GitLab...')
      await createGitlabRelease({
        config,
        release,
        dryRun,
      })
    }

    logger.success(`Release ${tagName} published to GitLab!`)
  }
  catch (error) {
    logger.error('Error publishing GitLab release:', error)
    throw error
  }
}
