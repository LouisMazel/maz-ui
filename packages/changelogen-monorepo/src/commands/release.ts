import type { PostedRelease, PublishResponse, ReleaseOptions } from '../types'
import { logger } from '@maz-ui/node'
import { commitAndTag, getLastTag, getRootPackage, loadMonorepoConfig, publishToGitProvider, pushCommitAndTags } from '../core'
import { bump } from './bump'
import { changelog } from './changelog'
import { publish } from './publish'

function getReleaseConfig(options: Partial<ReleaseOptions>) {
  return loadMonorepoConfig({
    overrides: {
      logLevel: options.logLevel,
      from: options.from,
      to: options.to,
      tokens: {
        github: options.token,
        gitlab: options.token,
      },
      bump: {
        type: options.type,
        preid: options.preid,
        clean: options.clean,
      },
      changelog: {
        formatCmd: options.formatCmd,
        rootChangelog: options.rootChangelog,
      },
      publish: {
        access: options.access,
        otp: options.otp,
        registry: options.registry,
        tag: options.tag,
      },
      release: {
        commit: options.commit,
        changelog: options.changelog,
        push: options.push,
        publish: options.publish,
        noVerify: options.noVerify,
        release: options.release,
        clean: options.clean,
      },
    },
  })
}

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
export async function release(options: ReleaseOptions): Promise<void> {
  try {
    const dryRun = options.dryRun ?? false
    logger.debug(`Dry run: ${dryRun}`)

    const force = options.force ?? false
    logger.debug(`Force bump: ${force}`)

    const config = await getReleaseConfig(options)

    logger.debug(`Version mode: ${config.monorepo.versionMode}`)
    logger.debug(`Push: ${config.release.push}, Publish: ${config.release.publish}, Release: ${config.release.release}`)

    logger.debug(`Commit range: ${config.from}...${config.to}`)

    logger.box('Step 1/6: Bump versions')

    const bumpResult = await bump({
      type: config.bump.type,
      preid: config.bump.preid,
      dryRun,
      config,
      force,
      shouldCheckGitStatus: config.release.clean,
    })

    if (!bumpResult.bumped) {
      logger.debug('No packages bumped')
      return
    }

    const rootPackage = getRootPackage(config.cwd)

    const newVersion = config.monorepo.versionMode === 'independent' ? undefined : bumpResult.newVersion || rootPackage.version

    config.to = newVersion ? `v${newVersion}` : config.to

    const lastTag = config.monorepo.versionMode === 'independent'
      ? config.from
      : (options.from || await getLastTag({ version: newVersion }))

    logger.debug(`Current version: ${newVersion || 'independent'}, Last tag: ${lastTag}`)

    if (!newVersion && config.monorepo.versionMode !== 'independent') {
      throw new Error('Unable to determine new version')
    }

    logger.box('Step 2/6: Generate changelogs')
    if (config.release.changelog) {
      await changelog({
        from: config.monorepo.versionMode === 'independent' ? undefined : lastTag,
        to: config.to,
        dryRun,
        formatCmd: config.changelog.formatCmd,
        rootChangelog: config.changelog.rootChangelog,
        packages: bumpResult.bumpedPackages,
        config,
        logLevel: config.logLevel,
      })
    }
    else {
      logger.info('Skipping changelog generation (--no-changelog)')
    }

    logger.box('Step 3/6: Commit changes and create tag')

    let createdTags: string[] = []
    if (config.release.commit) {
      createdTags = await commitAndTag({
        newVersion,
        config,
        noVerify: config.release.noVerify,
        bumpedPackages: bumpResult.bumpedPackages,
        dryRun,
        logLevel: config.logLevel,
      })
    }
    else {
      logger.info('Skipping commit and tag (--no-commit)')
    }

    logger.box('Step 4/6: Push changes and tags')
    if (config.release.push && config.release.commit) {
      await pushCommitAndTags({ dryRun })
    }
    else {
      logger.info('Skipping push (--no-push or --no-commit)')
    }

    logger.box('Step 5/6: Publish packages to registry')
    let publishResponse: PublishResponse | undefined

    if (config.release.publish) {
      publishResponse = await publish({
        registry: config.publish.registry,
        tag: config.publish.tag,
        access: config.publish.access,
        otp: config.publish.otp,
        bumpedPackages: bumpResult.bumpedPackages,
        dryRun,
        config,
      })
    }
    else {
      logger.info('Skipping publish (--no-publish)')
    }

    let provider = config.repo?.provider
    let postedReleases: PostedRelease[] = []

    logger.box('Step 6/6: Publish Git release')
    if (config.release.release) {
      logger.debug(`Provider from config: ${provider}`)

      try {
        const response = await publishToGitProvider({
          provider,
          from: lastTag,
          dryRun,
          config,
          logLevel: config.logLevel,
          bumpedPackages: bumpResult.bumpedPackages,
        })
        provider = response.detectedProvider
        postedReleases = response.postedReleases
      }
      catch (error) {
        logger.error('Error during release publication:', error)
      }
    }
    else {
      logger.info('Skipping release (--no-release)')
    }

    const publishedPackageCount = publishResponse?.publishedPackages.length ?? 0
    const versionDisplay = config.monorepo.versionMode === 'independent'
      ? `${bumpResult.bumpedPackages.length} packages bumped independently`
      : newVersion

    logger.box('Release workflow completed!\n\n'
      + `Version: ${versionDisplay}\n`
      + `Tag(s): ${createdTags.length ? createdTags.join(', ') : 'No'}\n`
      + `Pushed: ${config.release.push ? 'Yes' : 'Disabled'}\n`
      + `Published packages: ${config.release.publish ? publishedPackageCount : 'Disabled'}\n`
      + `Published release: ${config.release.release ? postedReleases.length : 'Disabled'}\n`
      + `Git provider: ${provider}`)
  }
  catch (error) {
    logger.error('Error during release workflow:', error)
    throw error
  }
}
