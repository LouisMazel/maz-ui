import type { GitProvider, ReleaseOptions } from '../types'

import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import { loadMonorepoConfig } from '../config'
import { getRootPackage } from '../core/monorepo'
import { getLastTag } from '../core/version'
import { commitAndTag, detectGitProvider } from '../utils/git'
import { bump } from './bump'
import { changelog } from './changelog'
import { github } from './github'
import { gitlab } from './gitlab'
import { publish } from './publish'

async function publishToGitProvider(versions: {
  from: string
  to: string
}): Promise<GitProvider | 'none' | 'unknown'> {
  const provider = detectGitProvider()

  if (!provider) {
    consola.warn('Unable to detect Git provider. Skipping release publication.')
    return 'unknown'
  }

  if (provider === 'github') {
    consola.info('Publishing GitHub release...')
    await github(versions)
  }
  else if (provider === 'gitlab') {
    consola.info('Publishing GitLab release...')
    await gitlab(versions)
  }

  return provider
}

// eslint-disable-next-line complexity
export async function release(options: Partial<ReleaseOptions> = {}): Promise<void> {
  try {
    consola.box('Starting release workflow...')

    const config = await loadMonorepoConfig({
      overrides: {
        from: options.from,
        to: options.to,
      },
    })

    const opts = {
      from: config.from,
      to: config.to,
      type: options.type || config.bump.type,
      noVerify: options.noVerify || config.release.noVerify,
      access: options.access || config.release.access,
      formatCmd: options.formatCmd || config.changelog.formatCmd,
      otp: options.otp || config.release.otp,
      packages: config.monorepo.packages,
      preid: options.preid || config.bump.preid,
      push: options.push || config.release.push,
      publish: options.publish || config.release.publish,
      registry: options.registry || config.publish.registry,
      release: options.release || config.release.release,
      tag: options.tag || config.publish.tag,
      token: options.token || config.publish.tag,
      dryRun: options.dryRun || false,
      rootChangelog: options.rootChangelog || config.changelog.rootChangelog,
    } satisfies ReleaseOptions

    consola.info('Step 1/6: Bump versions')
    consola.log('')
    const bumpResult = await bump({
      type: opts.type,
      preid: opts.preid,
      dryRun: opts.dryRun,
    })

    const rootPackage = getRootPackage(config.cwd)
    const currentVersion = bumpResult.newVersion || rootPackage.version
    const lastTag = options.from || await getLastTag(currentVersion)

    consola.log('')
    consola.info('Step 2/6: Generate changelogs')
    consola.log('')
    await changelog({
      from: lastTag,
      to: opts.to,
      dryRun: opts.dryRun,
      formatCmd: opts.formatCmd,
      rootChangelog: opts.rootChangelog,
    })

    if (!currentVersion) {
      throw new Error('Unable to determine new version')
    }

    consola.log('')
    consola.info('Step 3/6: Commit changes and create tag')
    consola.log('')
    const createdTags = await commitAndTag({
      newVersion: currentVersion,
      config,
      noVerify: opts.noVerify,
      bumpedPackages: bumpResult.bumpedPackages,
      dryRun: opts.dryRun,
    })

    consola.log('')
    if (opts.push && !opts.dryRun) {
      consola.info('Step 4/6: Push changes and tags')
      consola.log('')
      await execPromise('git push --follow-tags', { noSuccess: true })
      consola.success('Pushed changes and tags to remote')
    }
    else {
      if (opts.dryRun) {
        consola.info('Step 4/6: Skipped push (--dry-run)')
      }
      else {
        consola.info('Step 4/6: Skipped push (remove --no-push to enable)')
      }
      consola.log('')
    }

    consola.info('Step 5/6: Publish packages to npm')
    consola.log('')
    const publishResponse = await publish({
      registry: opts.registry,
      tag: opts.tag,
      access: opts.access,
      otp: opts.otp,
      dryRun: opts.dryRun,
    })
    consola.log('')

    let provider: GitProvider | 'none' | 'unknown'

    if (opts.dryRun) {
      consola.info('Step 6/6: Skipped publish git release')
      consola.log('')
      provider = detectGitProvider() ?? 'github'
    }
    else {
      consola.info('Step 6/6: Publish Git release')
      consola.log('')
      if (options.release === false) {
        consola.info('Skipping release publication (--no-release)')
        provider = 'none'
      }
      else {
        provider = await publishToGitProvider({
          from: lastTag,
          to: opts.to,
        })
      }
    }
    consola.log('')

    const publishedPackageCount = publishResponse?.packagesToPublish.length ?? 0

    consola.box('Release workflow completed!\n\n'
      + `Version: ${currentVersion}\n`
      + `Tag(s): ${createdTags.join(', ')}\n`
      + `Published packages: ${publishedPackageCount}\n`
      + `Pushed: ${opts.push ? 'Yes' : 'No'}\n`
      + `Published: ${opts.publish !== false ? 'Yes' : 'No'}\n`
      + `Provider: ${provider}`)
  }
  catch (error) {
    consola.error('Error during release workflow:', (error as Error).message)
    throw error
  }
}
