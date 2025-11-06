import type { LogLevel } from '@maz-ui/node'

import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { GitProvider, PackageInfo } from '../types'
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise, logger } from '@maz-ui/node'
import { getRootPackage, hasLernaJson } from '../core'

export function getGitStatus(cwd?: string) {
  return execSync('git status --porcelain', {
    cwd,
    encoding: 'utf8',
  }).trim()
}

export function checkGitStatusIfDirty() {
  logger.debug('Checking git status')
  const dirty = getGitStatus()
  if (dirty) {
    logger.debug('git status:', `\n${dirty.trim().split('\n').map(line => line.trim()).join('\n')}`)
    throw new Error('Working directory is not clean')
  }
}

export async function fetchGitTags(cwd?: string): Promise<void> {
  logger.debug('Fetching git tags from remote')
  try {
    await execPromise('git fetch --tags', { cwd, noStderr: true, noStdout: true, noSuccess: true })
    logger.debug('Git tags fetched successfully')
  }
  catch (error) {
    logger.warn('Failed to fetch some git tags from remote (tags might already exist locally)', error)
    logger.info('Continuing with local tags')
  }
}

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
export async function createCommitAndTags({
  config,
  noVerify,
  bumpedPackages,
  newVersion,
  dryRun,
  logLevel,
}: {
  config: ResolvedChangelogMonorepoConfig
  noVerify?: boolean
  bumpedPackages?: PackageInfo[]
  newVersion?: string
  dryRun: boolean
  logLevel?: LogLevel
}): Promise<string[]> {
  const filePatternsToAdd = [
    'package.json',
    'lerna.json',
    'CHANGELOG.md',
    '**/CHANGELOG.md',
    '**/package.json',
  ]

  logger.start('Start commit and tag')

  logger.debug('Adding files to git staging area...')
  for (const pattern of filePatternsToAdd) {
    if (pattern === 'lerna.json' && !hasLernaJson(config.cwd)) {
      logger.verbose(`Skipping lerna.json as it doesn't exist`)
      continue
    }

    if ((pattern === 'lerna.json' || pattern === 'CHANGELOG.md') && !existsSync(join(config.cwd, pattern))) {
      logger.verbose(`Skipping ${pattern} as it doesn't exist`)
      continue
    }

    if (dryRun) {
      logger.info(`[dry-run] git add ${pattern}`)
      continue
    }

    try {
      logger.debug(`git add ${pattern}`)
      execSync(`git add ${pattern}`)
    }
    catch {
      // Ignore errors if pattern doesn't match any files
    }
  }

  const rootPackage = getRootPackage(config.cwd)
  newVersion = newVersion || rootPackage.version

  const versionForMessage = config.monorepo.versionMode === 'independent' ? bumpedPackages?.map(pkg => `${pkg.name}@${pkg.version}`).join(', ') || 'unknown' : newVersion || 'unknown'

  const commitMessage = config.templates.commitMessage
    ?.replaceAll('{{newVersion}}', versionForMessage)
    || `chore(release): bump version to ${versionForMessage}`

  const noVerifyFlag = (noVerify) ? '--no-verify ' : ''
  logger.debug(`No verify: ${noVerify}`)

  if (dryRun) {
    logger.info(`[dry-run] git commit ${noVerifyFlag}-m "${commitMessage}"`)
  }
  else {
    logger.debug(`Executing: git commit ${noVerifyFlag}-m "${commitMessage}"`)
    await execPromise(`git commit ${noVerifyFlag}-m "${commitMessage}"`, {
      logLevel,
      noStderr: true,
      noStdout: true,
      cwd: config.cwd,
    })
    logger.success(`Committed: ${commitMessage}${noVerify ? ' (--no-verify)' : ''}`)
  }

  const signTags = config.signTags ? '-s' : ''
  logger.debug(`Sign tags: ${config.signTags}`)
  const createdTags: string[] = []

  if (config.monorepo.versionMode === 'independent' && bumpedPackages && bumpedPackages.length > 0) {
    logger.debug(`Creating ${bumpedPackages.length} independent package tags`)
    for (const pkg of bumpedPackages) {
      const tagName = `${pkg.name}@${pkg.version}`
      const tagMessage = config.templates?.tagMessage
        ?.replaceAll('{{newVersion}}', pkg.version || '')
        || tagName

      if (dryRun) {
        logger.info(`[dry-run] git tag ${signTags} -a ${tagName} -m "${tagMessage}"`)
      }
      else {
        const cmd = `git tag ${signTags} -a ${tagName} -m "${tagMessage}"`
        logger.debug(`Executing: ${cmd}`)
        try {
          await execPromise(cmd, {
            logLevel,
            noStderr: true,
            noStdout: true,
            cwd: config.cwd,
          })
          logger.debug(`Tag created: ${tagName}`)
        }
        catch (error) {
          logger.error(`Failed to create tag ${tagName}:`, error)
          throw error
        }
      }
      createdTags.push(tagName)
    }

    logger.success(`Created ${createdTags.length} tags for independent packages, ${createdTags.join(', ')}`)
  }
  else {
    const tagName = config.templates.tagBody
      ?.replaceAll('{{newVersion}}', newVersion)

    const tagMessage = config.templates?.tagMessage
      ?.replaceAll('{{newVersion}}', newVersion)
      || tagName

    if (dryRun) {
      logger.info(`[dry-run] git tag ${signTags} -a ${tagName} -m "${tagMessage}"`)
    }
    else {
      const cmd = `git tag ${signTags} -a ${tagName} -m "${tagMessage}"`
      logger.debug(`Executing: ${cmd}`)
      try {
        await execPromise(cmd, {
          logLevel,
          noStderr: true,
          noStdout: true,
          cwd: config.cwd,
        })
        logger.debug(`Tag created: ${tagName}`)
      }
      catch (error) {
        logger.error(`Failed to create tag ${tagName}:`, error)
        throw error
      }
    }

    createdTags.push(tagName)
  }

  logger.debug('Created Tags:', createdTags.join(', '))

  logger.success('Commit and tag completed!')

  return createdTags
}

export async function pushCommitAndTags({ dryRun, logLevel, cwd }: { dryRun: boolean, logLevel?: LogLevel, cwd: string }) {
  logger.start('Start push changes and tags')

  if (dryRun) {
    logger.info('[dry-run] git push --follow-tags')
  }
  else {
    logger.debug('Executing: git push --follow-tags')

    await execPromise('git push --follow-tags', { noStderr: true, noStdout: true, logLevel, cwd })
  }

  logger.success('End push changes and tags')
}

export function getFirstCommit(cwd: string): string {
  const result = execSync(
    'git rev-list --max-parents=0 HEAD',
    {
      cwd,
      encoding: 'utf8',
    },
  )
  return result.trim()
}

export function getCurrentGitBranch(cwd: string): string {
  const result = execSync('git rev-parse --abbrev-ref HEAD', {
    cwd,
    encoding: 'utf8',
  })

  return result.trim()
}

export function getCurrentGitRef(cwd: string): string {
  const branch = getCurrentGitBranch(cwd)
  return branch || 'HEAD'
}
