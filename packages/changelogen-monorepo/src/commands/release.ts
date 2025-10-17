import type { ReleaseOptions } from '../types'
import { execPromise } from '@maz-ui/node'
import consola from 'consola'
import { getRootDir, loadMonorepoConfig } from '../config'
import { getRootPackage } from '../core/monorepo'
import { bumpCommand } from './bump'
import { changelogCommand } from './changelog'
import { githubCommand } from './github'

export async function releaseCommand(options: ReleaseOptions = {}): Promise<void> {
  try {
    consola.box('Starting release workflow...')

    consola.info('Step 1/5: Bump versions')
    await bumpCommand({
      type: options.type,
      preid: options.preid,
      dryRun: options.dryRun,
    })

    consola.info('Step 2/5: Generate changelogs')
    await changelogCommand({
      releaseType: options.releaseType,
      from: options.from,
      to: options.to,
      dryRun: options.dryRun,
    })

    if (options.dryRun) {
      consola.info('[DRY RUN] Skipping commit, tag, push, and GitHub release')
      consola.success('Release workflow completed (dry run)!')
      return
    }

    const cwd = process.cwd()
    const rootDir = getRootDir(cwd)
    const rootPackage = getRootPackage(rootDir)
    const newVersion = rootPackage.version

    if (!newVersion) {
      throw new Error('Unable to determine new version')
    }

    const { changelogConfig } = await loadMonorepoConfig(cwd, {})

    consola.info('Step 3/5: Commit changes')

    const filesToAdd = ['package.json', 'lerna.json', '**/CHANGELOG.md', '**/package.json']
    await execPromise(`git add ${filesToAdd.join(' ')}`, { noSuccess: true })

    const commitMessage = changelogConfig.templates.commitMessage
      ?.replaceAll('{{newVersion}}', newVersion)
      || `chore(release): bump version to v${newVersion}`

    await execPromise(`git commit -m "${commitMessage}"`, { noSuccess: true })
    consola.success(`Committed: ${commitMessage}`)

    consola.info('Step 4/5: Create git tag')

    const tagName = `v${newVersion}`
    const tagMessage = changelogConfig.templates.tagMessage
      ?.replaceAll('{{newVersion}}', newVersion)
      || tagName

    const signTags = changelogConfig.signTags ? '-s' : ''
    await execPromise(`git tag ${signTags} -a ${tagName} -m "${tagMessage}"`, { noSuccess: true })
    consola.success(`Created tag: ${tagName}`)

    if (options.push) {
      consola.info('Step 5/5: Push changes and tags')
      await execPromise('git push --follow-tags', { noSuccess: true })
      consola.success('Pushed changes and tags to remote')
    }
    else {
      consola.info('Step 5/5: Skipped push (use --push to enable)')
    }

    if (options.github !== false) {
      consola.info('Publishing GitHub release...')
      await githubCommand()
    }

    consola.box('Release workflow completed!\n\n'
      + `Version: ${newVersion}\n`
      + `Tag: ${tagName}\n`
      + `Pushed: ${options.push ? 'Yes' : 'No'}`)
  }
  catch (error) {
    consola.error('Error during release workflow:', (error as Error).message)
    throw error
  }
}
