import type { GitCommit, ResolvedChangelogConfig } from 'changelogen'
import type { ResolvedChangelogMonorepoConfig } from '../core'
import type { PackageInfo } from '../types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execPromise, logger } from '@maz-ui/node'
import { generateMarkDown } from 'changelogen'

export async function generateChangelog(
  {
    pkg,
    commits,
    config,
    newTag,
  }: {
    pkg: PackageInfo
    commits: GitCommit[]
    config: ResolvedChangelogMonorepoConfig
    newTag: string
  },
) {
  try {
    logger.debug(`Generating changelog for ${pkg.name} - from ${config.from} to ${config.to}`)

    let changelog = await generateMarkDown(commits, config as ResolvedChangelogConfig)

    logger.verbose(`Output changelog for ${pkg.name}:\n${changelog}`)

    if (!config.to.startsWith('v')) {
      changelog = changelog.replaceAll(config.to, newTag)
    }

    if (commits.length === 0) {
      changelog = `${changelog}\n\n${config.templates.emptyChangelogContent}`
    }

    logger.debug(`Changelog generated for ${pkg.name} (${commits.length} commits)`)

    logger.debug(`Final changelog for ${pkg.name}:\n\n${changelog}\n\n`)

    return changelog
  }
  catch (error) {
    throw new Error(`Error generating changelog for ${pkg.name}: ${error}`)
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
    logger.debug(`Running format command: ${config.changelog.formatCmd}`)
    try {
      if (!dryRun) {
        await execPromise(config.changelog.formatCmd, {
          noStderr: true,
          noStdout: true,
          logLevel: config.logLevel,
        })
      }
      else {
        logger.log('[dry-run] running format command: ', config.changelog.formatCmd)
      }
      logger.debug('Format completed')
    }
    catch (error) {
      logger.warn('Format command failed:', error)
      logger.debug('Continuing anyway...')
    }
  }
  else {
    logger.debug('No format command specified')
  }
}
