import type { ChangelogMonorepoConfig, GitProvider, PackageInfo } from '../types'
import { execSync } from 'node:child_process'

import { execPromise } from '@maz-ui/node/execPromise.js'
import consola from 'consola'

export function detectGitProvider(cwd: string = process.cwd()): GitProvider | null {
  try {
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    const remoteUrl = execSync('git remote get-url origin', {
      cwd,
      encoding: 'utf8',
    }).trim()

    if (remoteUrl.includes('github.com')) {
      return 'github'
    }

    if (remoteUrl.includes('gitlab.com') || remoteUrl.includes('gitlab')) {
      return 'gitlab'
    }

    return null
  }
  catch {
    return null
  }
}

export function parseGitRemoteUrl(remoteUrl: string): { owner: string, repo: string } | null {
  const sshRegex = /git@[\w.-]+:([\w.-]+)\/([\w.-]+?)(?:\.git)?$/
  const httpsRegex = /https?:\/\/[\w.-]+\/([\w.-]+)\/([\w.-]+?)(?:\.git)?$/

  const sshMatch = remoteUrl.match(sshRegex)
  if (sshMatch) {
    return {
      owner: sshMatch[1]!,
      repo: sshMatch[2]!,
    }
  }

  const httpsMatch = remoteUrl.match(httpsRegex)
  if (httpsMatch) {
    return {
      owner: httpsMatch[1]!,
      repo: httpsMatch[2]!,
    }
  }

  return null
}

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
export async function commitAndTag({
  newVersion,
  config,
  noVerify,
  bumpedPackages,
  dryRun,
}: {
  newVersion?: string
  config: ChangelogMonorepoConfig
  noVerify?: boolean
  bumpedPackages?: PackageInfo[]
  dryRun: boolean
}): Promise<string[]> {
  const filesToAdd = ['package.json', 'lerna.json', 'CHANGELOG.md', '**/CHANGELOG.md', '**/package.json']
  await execPromise(`git add ${filesToAdd.join(' ')}`, { noSuccess: true })

  const versionForMessage = newVersion || (bumpedPackages?.[0]?.version) || 'unknown'
  const commitMessage = config.templates.commitMessage
    ?.replaceAll('{{newVersion}}', versionForMessage)
    || `chore(release): bump version to v${versionForMessage}`

  const noVerifyFlag = (noVerify) ? '--no-verify ' : ''

  if (dryRun) {
    consola.info(`Would exec: git commit ${noVerifyFlag}-m "${commitMessage}"`)
  }
  else {
    await execPromise(`git commit ${noVerifyFlag}-m "${commitMessage}"`, { noSuccess: true })
    consola.success(`Committed: ${commitMessage}${noVerify ? ' (--no-verify)' : ''}`)
  }

  const signTags = config.signTags ? '-s' : ''
  const createdTags: string[] = []

  if (config.monorepo.versionMode === 'independent' && bumpedPackages && bumpedPackages.length > 0) {
    for (const pkg of bumpedPackages) {
      const tagName = `${pkg.name}@${pkg.version}`
      const tagMessage = config.templates.tagMessage
        ?.replaceAll('{{newVersion}}', pkg.version || '')
        || tagName

      if (dryRun) {
        consola.info(`Would exec: git tag ${signTags} -a ${tagName} -m "${tagMessage}"`)
      }
      else {
        await execPromise(`git tag ${signTags} -a ${tagName} -m "${tagMessage}"`, { noSuccess: true })
      }
      createdTags.push(tagName)
    }

    consola.success(`Created ${createdTags.length} tags for independent packages`)
    for (const tag of createdTags) {
      consola.info(`  - ${tag}`)
    }
  }
  else if (newVersion) {
    const tagName = `v${newVersion}`
    const tagMessage = config.templates.tagMessage
      ?.replaceAll('{{newVersion}}', newVersion)
      || tagName

    if (dryRun) {
      consola.info(`Would exec: git tag ${signTags} -a ${tagName} -m "${tagMessage}"`)
    }
    else {
      await execPromise(`git tag ${signTags} -a ${tagName} -m "${tagMessage}"`, { noSuccess: true })
    }
    createdTags.push(tagName)
    consola.success(`Created tag: ${tagName}`)
  }

  if (dryRun) {
    consola.info('Created Tags:', createdTags)
  }

  return createdTags
}
