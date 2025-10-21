import type { GitProvider, ReleaseOptions } from '../types'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import { loadMonorepoConfig } from '../config'
import { getRootPackage } from '../core/monorepo'
import { publishToGitProvider } from '../core/release'
import { getLastTag } from '../core/version'
import { commitAndTag } from '../utils/git'
import { bump } from './bump'
import { changelog } from './changelog'
import { publish } from './publish'

function getReleaseConfig(options: Partial<ReleaseOptions>) {
  return loadMonorepoConfig({
    overrides: {
      from: options.from,
      to: options.to,
      bump: {
        type: options.type,
        preid: options.preid,
      },
      publish: {
        access: options.access,
        otp: options.otp,
        registry: options.registry,
        tag: options.tag,
      },
      changelog: {
        formatCmd: options.formatCmd,
        rootChangelog: options.rootChangelog,
      },
      release: {
        push: options.push,
        publish: options.publish,
        verify: options.verify,
        release: options.release,
      },
      tokens: {
        github: options.token,
        gitlab: options.token,
      },
    },
  })
}

export async function release(options: Partial<ReleaseOptions> = {}): Promise<void> {
  try {
    consola.box('Starting release workflow...')

    const dryRun = options.dryRun ?? false

    const config = await getReleaseConfig(options)

    consola.info('Step 1/6: Bump versions')
    consola.log('')
    const bumpResult = await bump({
      type: config.bump.type,
      preid: config.bump.preid,
      dryRun,
    })

    if (bumpResult.bumpedPackages.length === 0) {
      consola.warn('No packages to bump. Skipping release workflow.')
      return
    }

    const rootPackage = getRootPackage(config.cwd)
    const currentVersion = bumpResult.newVersion || rootPackage.version
    const lastTag = options.from || await getLastTag(currentVersion)

    if (!currentVersion) {
      throw new Error('Unable to determine new version')
    }

    consola.log('')
    consola.info('Step 2/6: Generate changelogs')
    consola.log('')
    await changelog({
      from: lastTag,
      to: config.to,
      dryRun,
      formatCmd: config.changelog.formatCmd,
      rootChangelog: config.changelog.rootChangelog,
    })

    consola.log('')

    consola.info('Step 3/6: Commit changes and create tag')
    consola.log('')
    const createdTags = await commitAndTag({
      newVersion: currentVersion,
      config,
      verify: config.release.verify,
      bumpedPackages: bumpResult.bumpedPackages,
      dryRun,
    })

    if (config.release.push) {
      if (dryRun) {
        consola.info('Step 4/6: Skipped push (--dry-run) - Would exec: git push --follow-tags')
      }
      else {
        consola.info('Step 4/6: Push changes and tags')
        consola.log('')
        await execPromise('git push --follow-tags', { noSuccess: true })
        consola.success('Pushed changes and tags to remote')
      }
    }
    else {
      consola.info('Step 4/6: Skipped push (remove --no-push to enable)')
    }

    consola.log('')

    consola.info('Step 5/6: Publish packages to npm')
    consola.log('')
    const publishResponse = await publish({
      registry: config.publish.registry,
      tag: config.publish.tag,
      access: config.publish.access,
      otp: config.publish.otp,
      dryRun,
    })

    consola.log('')

    let provider: GitProvider | 'none' | 'unknown' | undefined = config.repo.provider

    if (config.release.release) {
      consola.info('Step 6/6: Publish Git release')
      consola.log('')

      if (!dryRun) {
        provider = await publishToGitProvider({
          provider,
          from: lastTag,
          to: config.to,
        })
      }
      else {
        consola.info('Step 6/6: Skipping release publication (--dry-run)')
      }
    }
    else {
      consola.info('Step 6/6: Skipping release publication (--no-release)')
      provider = 'none'
    }
    consola.log('')

    const publishedPackageCount = publishResponse?.packagesToPublish.length ?? 0

    consola.box('Release workflow completed!\n\n'
      + `Version: ${currentVersion}\n`
      + `Tag(s): ${createdTags.join(', ')}\n`
      + `Published packages: ${publishedPackageCount}\n`
      + `Pushed: ${config.release.push ? 'Yes' : 'No'}\n`
      + `Published: ${config.release.publish !== false ? 'Yes' : 'No'}\n`
      + `Provider: ${provider}`)
  }
  catch (error) {
    consola.error('Error during release workflow:', (error as Error).message)
    throw error
  }
}
