import type { PublishResponse, ReleaseOptions } from '../types'
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
        push: options.push,
        publish: options.publish,
        verify: options.verify,
        release: options.release,
      },
    },
  })
}

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
    })

    if (!bumpResult.bumped) {
      return
    }

    const rootPackage = getRootPackage(config.cwd)
    const currentVersion = bumpResult.newVersion || rootPackage.version
    const lastTag = options.from || await getLastTag({ version: currentVersion })
    logger.debug(`Current version: ${currentVersion}, Last tag: ${lastTag}`)

    if (!currentVersion) {
      throw new Error('Unable to determine new version')
    }

    logger.box('Step 2/6: Generate changelogs')
    await changelog({
      from: lastTag,
      to: config.to,
      dryRun,
      formatCmd: config.changelog.formatCmd,
      rootChangelog: config.changelog.rootChangelog,
      packages: bumpResult.bumpedPackages,
      config,
      logLevel: config.logLevel,
    })

    logger.box('Step 3/6: Commit changes and create tag')
    logger.debug(`Verify hooks: ${config.release.verify}`)
    const createdTags = await commitAndTag({
      newVersion: currentVersion,
      config,
      verify: config.release.verify,
      bumpedPackages: bumpResult.bumpedPackages,
      dryRun,
      logLevel: config.logLevel,
    })

    logger.box('Step 4/6: Push changes and tags')
    if (config.release.push) {
      await pushCommitAndTags({ dryRun })
    }
    else {
      logger.info('Skipping push (--no-push)')
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

    let provider = config.repo.provider

    logger.box('Step 6/6: Publish Git release')
    if (config.release.release) {
      logger.debug(`Provider from config: ${provider}`)

      try {
        provider = await publishToGitProvider({
          provider,
          from: lastTag,
          to: config.to,
          dryRun,
          config,
          logLevel: config.logLevel,
        })
      }
      catch (error) {
        logger.error('Error during release publication:', error)
      }
    }
    else {
      logger.info('Skipping release (--no-release)')
    }

    const publishedPackageCount = publishResponse?.publishedPackages.length ?? 0

    logger.box('Release workflow completed!\n\n'
      + `Version: ${currentVersion}\n`
      + `Tag(s): ${createdTags.join(', ')}\n`
      + `Pushed: ${config.release.push ? 'Yes' : 'No'}\n`
      + `Published packages: ${config.release.publish ? publishedPackageCount : 'No'}\n`
      + `Published release: ${config.release.release !== false ? 'Yes' : 'No'}\n`
      + `Provider: ${provider}`)
  }
  catch (error) {
    logger.error('Error during release workflow:', error)
    throw error
  }
}
