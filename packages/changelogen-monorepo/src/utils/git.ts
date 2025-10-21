import type { ChangelogMonorepoConfig, GitProvider, PackageInfo } from '../types'
import { execSync } from 'node:child_process'

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise } from '@maz-ui/node'
import { consola } from 'consola'
import { isPrerelease } from '../core/version'

export function detectGitProvider(cwd: string = process.cwd()): GitProvider | null {
  try {
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
  verify,
  bumpedPackages,
  dryRun,
}: {
  newVersion?: string
  config: ChangelogMonorepoConfig
  verify?: boolean
  bumpedPackages?: PackageInfo[]
  dryRun: boolean
}): Promise<string[]> {
  const lernaJsonPath = join(config.cwd, 'lerna.json')
  const hasLerna = existsSync(lernaJsonPath)

  const potentialFilesToAdd = ['package.json', ...(hasLerna ? ['lerna.json'] : []), 'CHANGELOG.md', '**/CHANGELOG.md', '**/package.json']

  const gitStatus = execSync('git status --porcelain', {
    cwd: config.cwd,
    encoding: 'utf8',
  }).trim()

  const modifiedFiles = gitStatus.split('\n').map(line => line.slice(3).trim()).filter(Boolean)

  const filesToAdd = potentialFilesToAdd.filter((pattern) => {
    if (pattern.includes('*')) {
      return modifiedFiles.some(file => file.includes('CHANGELOG.md') || file.includes('package.json'))
    }
    return modifiedFiles.includes(pattern)
  })

  if (filesToAdd.length > 0) {
    await execPromise(`git add ${filesToAdd.join(' ')}`, { noSuccess: true })
  }

  const versionForMessage = newVersion || (bumpedPackages?.[0]?.version) || 'unknown'

  const commitMessage = config.templates.commitMessage
    ?.replaceAll('{{newVersion}}', versionForMessage)
    || `chore(release): bump version to v${versionForMessage}`

  const noVerifyFlag = (verify) ? '' : '--no-verify '

  if (dryRun) {
    consola.info(`Would exec: git commit ${noVerifyFlag}-m "${commitMessage}"`)
  }
  else {
    await execPromise(`git commit ${noVerifyFlag}-m "${commitMessage}"`, { noSuccess: true })
    consola.success(`Committed: ${commitMessage}${verify ? '' : ' (--no-verify)'}`)
  }

  const signTags = config.signTags ? '-s' : ''
  const createdTags: string[] = []

  if (config.monorepo.versionMode === 'independent' && bumpedPackages && bumpedPackages.length > 0) {
    for (const pkg of bumpedPackages) {
      const tagName = `${pkg.name}@${pkg.version}`
      const tagMessage = config.templates?.tagMessage
        ?.replaceAll('{{newVersion}}', pkg.version || '')
        || tagName

      if (dryRun) {
        consola.info(`Would exec: git tag ${signTags} -a ${tagName} -m "${tagMessage}"`)
      }
      else {
        const cmd = `git tag ${signTags} -a ${tagName} -m "${tagMessage}"`
        consola.info(`Executing: ${cmd}`)
        try {
          await execPromise(cmd, { noSuccess: true, noStdout: true })
          consola.success(`Tag created: ${tagName}`)
        }
        catch (error) {
          consola.error(`Failed to create tag ${tagName}:`, (error as Error).message)
          throw error
        }
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
    const tagMessage = config.templates?.tagMessage
      ?.replaceAll('{{newVersion}}', newVersion)
      || tagName

    if (dryRun) {
      consola.info(`Would exec: git tag ${signTags} -a ${tagName} -m "${tagMessage}"`)
    }
    else {
      const cmd = `git tag ${signTags} -a ${tagName} -m "${tagMessage}"`
      consola.info(`Executing: ${cmd}`)
      try {
        await execPromise(cmd, { noSuccess: true, noStdout: true })
        consola.success(`Tag created: ${tagName}`)
      }
      catch (error) {
        consola.error(`Failed to create tag ${tagName}:`, (error as Error).message)
        throw error
      }
    }
    createdTags.push(tagName)
    consola.success(`Created tag: ${tagName}`)
  }

  if (dryRun) {
    consola.info('Created Tags:', createdTags)
  }

  return createdTags
}

export async function getLastTag(version?: string, onlyStable?: boolean): Promise<string> {
  if (onlyStable || (!isPrerelease(version) && !onlyStable)) {
    const { stdout } = await execPromise(
      'git tag --sort=-v:refname | grep -E \'^v[0-9]+\\.[0-9]+\\.[0-9]+$\' | sed -n \'1p\'',
      {
        noSuccess: true,
        noStdout: true,
      },
    )
    return stdout.trim()
  }

  const { stdout } = await execPromise('git tag --sort=-v:refname | sed -n \'1p\'', {
    noSuccess: true,
    noStdout: true,
  })
  return stdout.trim()
}

export async function getLastPackageTag(packageName: string, onlyStable?: boolean): Promise<string | null> {
  try {
    const escapedPackageName = packageName.replace(/[@/]/g, '\\$&')

    let grepPattern: string
    if (onlyStable) {
      grepPattern = `^${escapedPackageName}@[0-9]+\\.[0-9]+\\.[0-9]+$`
    }
    else {
      grepPattern = `^${escapedPackageName}@`
    }

    const { stdout } = await execPromise(
      `git tag --sort=-v:refname | grep -E '${grepPattern}' | sed -n '1p'`,
      {
        noSuccess: true,
        noStdout: true,
      },
    )

    const tag = stdout.trim()
    return tag || null
  }
  catch {
    return null
  }
}
