import type { ChangelogMonorepoConfig, ReleaseOptions } from '../types'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import { loadMonorepoConfig } from '../config'
import { getRootPackage } from '../core/monorepo'
import { detectGitProvider } from '../utils/git'
import { bumpCommand } from './bump'
import { changelogCommand } from './changelog'
import { githubCommand } from './github'
import { gitlabCommand } from './gitlab'
import { publishCommand } from './publish'

async function commitAndTag(newVersion: string, config: ChangelogMonorepoConfig): Promise<string> {
  const filesToAdd = ['package.json', 'lerna.json', '**/CHANGELOG.md', '**/package.json']
  await execPromise(`git add ${filesToAdd.join(' ')}`, { noSuccess: true })

  const commitMessage = config.templates.commitMessage
    ?.replaceAll('{{newVersion}}', newVersion)
    || `chore(release): bump version to v${newVersion}`

  await execPromise(`git commit -m "${commitMessage}"`, { noSuccess: true })
  consola.success(`Committed: ${commitMessage}`)

  const tagName = `v${newVersion}`
  const tagMessage = config.templates.tagMessage
    ?.replaceAll('{{newVersion}}', newVersion)
    || tagName

  const signTags = config.signTags ? '-s' : ''
  await execPromise(`git tag ${signTags} -a ${tagName} -m "${tagMessage}"`, { noSuccess: true })
  consola.success(`Created tag: ${tagName}`)

  return tagName
}

async function publishToGitProvider(rootDir: string, options: ReleaseOptions): Promise<string> {
  if (options.release === false) {
    consola.info('Skipping release publication (--no-release)')
    return 'none'
  }

  const provider = detectGitProvider(rootDir)

  if (!provider) {
    consola.warn('Unable to detect Git provider. Skipping release publication.')
    return 'unknown'
  }

  if (provider === 'github') {
    consola.info('Publishing GitHub release...')
    await githubCommand()
  }
  else if (provider === 'gitlab') {
    consola.info('Publishing GitLab release...')
    await gitlabCommand()
  }

  return provider
}

export async function releaseCommand(options: ReleaseOptions = {}): Promise<void> {
  try {
    consola.box('Starting release workflow...')

    consola.info('Step 1/6: Bump versions')
    await bumpCommand({
      type: options.type,
      preid: options.preid,
      dryRun: options.dryRun,
    })

    consola.info('Step 2/6: Generate changelogs')
    await changelogCommand({
      from: options.from,
      to: options.to,
      dryRun: options.dryRun,
    })

    if (options.dryRun) {
      consola.info('[DRY RUN] Skipping commit, tag, push, publish, and release')
      consola.success('Release workflow completed (dry run)!')
      return
    }

    const rootDir = process.cwd()
    const rootPackage = getRootPackage(rootDir)
    const newVersion = rootPackage.version

    if (!newVersion) {
      throw new Error('Unable to determine new version')
    }

    const config = await loadMonorepoConfig(rootDir)

    consola.info('Step 3/6: Commit changes and create tag')
    const tagName = await commitAndTag(newVersion, config)

    if (options.push) {
      consola.info('Step 4/6: Push changes and tags')
      await execPromise('git push --follow-tags', { noSuccess: true })
      consola.success('Pushed changes and tags to remote')
    }
    else {
      consola.info('Step 4/6: Skipped push (use --push to enable)')
    }

    if (options.publish !== false) {
      consola.info('Step 5/6: Publish packages to npm')
      await publishCommand({
        registry: options.registry,
        tag: options.tag || options.preid,
        access: options.access,
        otp: options.otp,
        dryRun: false,
      })
    }
    else {
      consola.info('Step 5/6: Skipped npm publish (--no-publish)')
    }

    consola.info('Step 6/6: Publish Git release')
    const provider = await publishToGitProvider(rootDir, options)

    consola.box('Release workflow completed!\n\n'
      + `Version: ${newVersion}\n`
      + `Tag: ${tagName}\n`
      + `Pushed: ${options.push ? 'Yes' : 'No'}\n`
      + `Published: ${options.publish !== false ? 'Yes' : 'No'}\n`
      + `Provider: ${provider}`)
  }
  catch (error) {
    consola.error('Error during release workflow:', (error as Error).message)
    throw error
  }
}
