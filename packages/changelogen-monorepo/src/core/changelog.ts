import type { GitCommit } from 'changelogen'
import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { PackageInfo } from '../types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise, logger } from '@maz-ui/node'
import { getFirstCommit } from '../core'
import { generateMarkDown } from './markdown'

function fromTagIsFirstCommit(fromTag: string, cwd: string) {
  return fromTag === getFirstCommit(cwd)
}

export async function generateChangelog(
  {
    pkg,
    commits,
    config,
    from,
    dryRun,
  }: {
    pkg: PackageInfo
    commits: GitCommit[]
    config: ResolvedChangelogMonorepoConfig
    from: string
    dryRun: boolean
  },
) {
  let fromTag = config.from || from

  const isFirstCommit = fromTagIsFirstCommit(fromTag, config.cwd)

  if (isFirstCommit) {
    fromTag = config.monorepo.versionMode === 'independent' ? `${pkg.name}@0.0.0` : config.templates.tagBody.replace('{{newVersion}}', '0.0.0')
  }

  const toTag
    = config.to
      || (config.monorepo.versionMode === 'independent' ? `${pkg.name}@${pkg.version}` : config.templates.tagBody.replace('{{newVersion}}', pkg.version))

  try {
    logger.debug(`Generating changelog for ${pkg.name} - from ${fromTag} to ${toTag}`)

    config = {
      ...config,
      from: fromTag,
      to: toTag,
    }

    let changelog = await generateMarkDown(commits, config)

    logger.verbose(`Output changelog for ${pkg.name}:\n${changelog}`)

    if (commits.length === 0) {
      changelog = `${changelog}\n\n${config.templates.emptyChangelogContent}`
    }

    logger.debug(`Changelog generated for ${pkg.name} (${commits.length} commits)`)

    logger.verbose(`Final changelog for ${pkg.name}:\n\n${changelog}\n\n`)

    if (dryRun) {
      logger.info(`[dry-run] ${pkg.name} - Generate changelog ${fromTag}...${toTag}`)
    }

    return changelog
  }
  catch (error) {
    throw new Error(`Error generating changelog for ${pkg.name} (${fromTag}...${toTag}): ${error}`)
  }
}

export function writeChangelogToFile({
  pkg,
  changelog,
  dryRun = false,
}: {
  pkg: PackageInfo
  changelog: string
  dryRun: boolean
}) {
  const changelogPath = join(pkg.path, 'CHANGELOG.md')

  let existingChangelog = ''
  if (existsSync(changelogPath)) {
    existingChangelog = readFileSync(changelogPath, 'utf8')
  }

  const lines = existingChangelog.split('\n')
  const titleIndex = lines.findIndex(line => line.startsWith('# '))

  let updatedChangelog: string
  if (titleIndex !== -1) {
    const beforeTitle = lines.slice(0, titleIndex + 1)
    const afterTitle = lines.slice(titleIndex + 1)
    updatedChangelog = [...beforeTitle, '', changelog, '', ...afterTitle].join('\n')
  }
  else {
    const title = '# Changelog\n'
    updatedChangelog = `${title}\n${changelog}\n${existingChangelog}`
  }

  if (dryRun) {
    logger.info(`[dry-run] ${pkg.name} - Write changelog to ${changelogPath}`)
  }
  else {
    logger.debug(`Writing changelog to ${changelogPath}`)
    writeFileSync(changelogPath, updatedChangelog, 'utf8')
    logger.info(`Changelog updated for ${pkg.name}`)
  }
}

export async function executeFormatCmd({
  config,
  dryRun,
}: {
  config: ResolvedChangelogMonorepoConfig
  dryRun: boolean
}) {
  if (config.changelog?.formatCmd) {
    logger.info('Running format command')

    logger.debug(`Running format command: ${config.changelog.formatCmd}`)
    try {
      if (!dryRun) {
        await execPromise(config.changelog.formatCmd, {
          noStderr: true,
          noStdout: true,
          logLevel: config.logLevel,
        })
        logger.info('Format completed')
      }
      else {
        logger.log('[dry-run] exec format command: ', config.changelog.formatCmd)
      }
    }
    catch (error) {
      logger.warn('Format command failed:', error)
      logger.info('Continuing anyway...')
    }
  }
  else {
    logger.debug('No format command specified')
  }
}

export async function executeBuildCmd({
  config,
  dryRun,
}: {
  config: ResolvedChangelogMonorepoConfig
  dryRun: boolean
}) {
  if (config.publish?.buildCmd) {
    logger.info('Running build command')

    logger.debug(`Running build command: ${config.publish.buildCmd}`)
    if (!dryRun) {
      await execPromise(config.publish.buildCmd, {
        noStderr: true,
        noStdout: true,
        logLevel: config.logLevel,
      })
      logger.info('Build completed')
    }
    else {
      logger.log('[dry-run] exec build command: ', config.publish.buildCmd)
    }
  }
  else {
    logger.debug('No build command specified')
  }
}
