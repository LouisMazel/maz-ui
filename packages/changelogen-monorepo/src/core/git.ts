import type { LogLevel } from '@maz-ui/node'
import type { ReleaseType } from 'semver'

import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { GitProvider, PackageInfo } from '../types'
import { execSync } from 'node:child_process'
import { execPromise, logger } from '@maz-ui/node'
import { extractVersionFromPackageTag, isGraduating, isPrerelease } from '../core'

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
  noVerify,
  bumpedPackages,
  dryRun,
  logLevel,
}: {
  newVersion?: string
  config: ResolvedChangelogMonorepoConfig
  noVerify?: boolean
  bumpedPackages?: PackageInfo[]
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
  else if (newVersion) {
    const tagName = `v${newVersion}`
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

export async function getLastTag(options?: {
  sort?: 'refname' | 'creatordate'
  version?: string
  onlyStable?: boolean
  logLevel?: LogLevel
}): Promise<string> {
  const sort = options?.sort === 'creatordate' ? '-creatordate' : '-v:refname'

  if (options?.onlyStable || (options?.version && !isPrerelease(options.version) && !options?.onlyStable)) {
    const { stdout } = await execPromise(
      `git tag --sort=${sort} | grep -E \'^v[0-9]+\\.[0-9]+\\.[0-9]+$\' | head -n 1`,
      {
        logLevel: options?.logLevel,
        noStderr: true,
        noStdout: true,
        noSuccess: true,
      },
    )

    logger.debug('Last stable tag:', stdout.trim())

    return stdout.trim()
  }

  const { stdout } = await execPromise(`git tag --sort=${sort} | head -n 1`, {
    logLevel: options?.logLevel,
    noStderr: true,
    noStdout: true,
    noSuccess: true,
  })

  logger.debug('Last tag:', stdout.trim())

  return stdout.trim()
}

export async function getLastPackageTag({
  packageName,
  onlyStable,
  logLevel,
}: {
  packageName: string
  onlyStable?: boolean
  logLevel?: LogLevel
}): Promise<string | null> {
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
      `git tag --sort=-creatordate | grep -E '${grepPattern}' | sed -n '1p'`,
      {
        logLevel,
        noStderr: true,
        noStdout: true,
        noSuccess: true,
      },
    )

    const tag = stdout.trim()
    return tag || null
  }
  catch {
    return null
  }
}

export async function determinePackageFromTag({
  packageName,
  globalFrom,
  releaseType,
  logLevel,
}: {
  packageName: string
  globalFrom: string
  releaseType: ReleaseType
  logLevel?: LogLevel
}): Promise<string> {
  const lastPackageTag = await getLastPackageTag({
    packageName,
    logLevel,
  })

  if (!lastPackageTag) {
    logger.debug(`No previous tag found for ${packageName}, using global from: ${globalFrom}`)
    return globalFrom
  }

  const tagVersion = extractVersionFromPackageTag(lastPackageTag)
  if (!tagVersion) {
    logger.warn(`Could not extract version from tag ${lastPackageTag}, using global from: ${globalFrom}`)
    return globalFrom
  }

  const graduating = isGraduating(tagVersion, releaseType)

  if (graduating) {
    logger.info(`Graduating ${packageName} from prerelease ${tagVersion} to stable`)
    const stablePackageTag = await getLastPackageTag({
      packageName,
      onlyStable: true,
      logLevel,
    })
    if (stablePackageTag) {
      logger.debug(`Using last stable tag: ${stablePackageTag}`)
      return stablePackageTag
    }
  }

  logger.debug(`Using last package tag: ${lastPackageTag}`)
  return lastPackageTag
}

export async function pushCommitAndTags({ dryRun, logLevel }: { dryRun: boolean, logLevel?: LogLevel }) {
  logger.start('Start push changes and tags')

  if (dryRun) {
    logger.info('[dry-run] git push --follow-tags')
  }
  else {
    logger.debug('Executing: git push --follow-tags')

    await execPromise('git push --follow-tags', { noStderr: true, noStdout: true, logLevel })
  }

  logger.success('End push changes and tags')
}
