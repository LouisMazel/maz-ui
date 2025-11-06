import type { LogLevel } from '@maz-ui/node'
import type { PackageInfo, VersionMode } from '../types'
import type { ResolvedChangelogMonorepoConfig } from './config'
import { execPromise, logger } from '@maz-ui/node'
import { getCurrentGitRef, getFirstCommit } from './git'
import { isGraduating } from './version'

export async function getLastRepoTag(options?: {
  onlyStable?: boolean
  logLevel?: LogLevel
  cwd?: string
}): Promise<string | null> {
  let lastTag: string | null = null

  if (options?.onlyStable) {
    const { stdout } = await execPromise(
      `git tag --sort=-creatordate | grep -E '^[^0-9]*[0-9]+\\.[0-9]+\\.[0-9]+$' | head -n 1`,
      {
        logLevel: options?.logLevel,
        noStderr: true,
        noStdout: true,
        noSuccess: true,
        cwd: options?.cwd,
      },
    )

    lastTag = stdout.trim()

    logger.debug('Last stable tag:', lastTag || 'No stable tags found')

    return lastTag
  }

  const { stdout } = await execPromise(`git tag --sort=-creatordate | head -n 1`, {
    logLevel: options?.logLevel,
    noStderr: true,
    noStdout: true,
    noSuccess: true,
    cwd: options?.cwd,
  })

  lastTag = stdout.trim()

  logger.debug('Last tag:', lastTag || 'No tags found')

  return lastTag
}

export async function getLastPackageTag({
  packageName,
  onlyStable,
  logLevel,
  cwd,
}: {
  packageName: string
  onlyStable?: boolean
  logLevel?: LogLevel
  cwd?: string
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
        cwd,
      },
    )

    const tag = stdout.trim()
    return tag || null
  }
  catch {
    return null
  }
}

type Step = 'bump' | 'changelog' | 'publish' | 'provider-release'

interface ResolvedTags {
  from: string
  to: string
}

async function resolveTagsIndependent({
  cwd,
  pkg,
  graduating,
  newVersion,
  step,
  logLevel,
}: {
  cwd: string
  pkg: PackageInfo
  graduating: boolean
  newVersion?: string
  step: Step
  logLevel?: LogLevel
}): Promise<{ from: string, to: string }> {
  let to: string

  if (step === 'bump') {
    to = getCurrentGitRef(cwd)
  }
  else {
    to = newVersion
      ? `${pkg.name}@${newVersion}`
      : getCurrentGitRef(cwd)
  }

  const lastPackageTag = await getLastPackageTag({
    packageName: pkg.name,
    onlyStable: graduating,
    logLevel,
  })

  if (!lastPackageTag) {
    const from = await getLastRepoTag({ logLevel }) || getFirstCommit(cwd)

    return { from, to }
  }

  return { from: lastPackageTag, to }
}

async function resolveTagsUnified({
  config,
  newVersion,
  graduating,
  step,
  logLevel,
}: {
  config: ResolvedChangelogMonorepoConfig
  newVersion?: string
  graduating: boolean
  step: Step
  logLevel?: LogLevel
}): Promise<{ from: string, to: string }> {
  let to: string

  if (step === 'bump') {
    to = getCurrentGitRef(config.cwd)
  }
  else {
    to = newVersion ? config.templates.tagBody.replace('{{newVersion}}', newVersion) : getCurrentGitRef(config.cwd)
  }

  const from = await getLastRepoTag({ onlyStable: graduating, logLevel }) || getFirstCommit(config.cwd)

  return { from, to }
}

interface ResolveTagsOptions<
  VM extends VersionMode,
  S extends Step,
  Package = VM extends 'independent' ? PackageInfo : undefined,
  NewVersion = S extends 'bump' | 'changelog' ? undefined : string,
  CurrentVersion = S extends 'bump' | 'changelog' ? string : undefined,
> {
  config: ResolvedChangelogMonorepoConfig
  versionMode: VM
  step: S
  pkg: Package
  currentVersion: CurrentVersion
  newVersion: NewVersion
  logLevel: LogLevel
}

export async function resolveTags<T extends VersionMode, S extends Step>({
  config,
  versionMode,
  step,
  pkg,
  currentVersion,
  newVersion,
  logLevel,
}: ResolveTagsOptions<T, S>): Promise<ResolvedTags> {
  logger.debug(`[${versionMode}](${step}) Resolving tags`)

  const graduating = (currentVersion && isGraduating(currentVersion, config.bump.type)) || false

  const newTags = (newVersion && config.templates.tagBody.replace('{{newVersion}}', newVersion)) || null

  if (config.from) {
    const tags = {
      from: config.from,
      to: config.to || newTags || getCurrentGitRef(config.cwd),
    }

    logger.debug(`[${versionMode}](${step}) Using specified tags: ${tags.from} → ${tags.to}`)

    return tags
  }

  if (versionMode === 'independent') {
    const tags = await resolveTagsIndependent({
      cwd: config.cwd,
      pkg: pkg!,
      graduating,
      newVersion,
      step,
      logLevel,
    })

    logger.debug(`[${versionMode}](${step}) Using tags: ${tags.from} → ${tags.to}`)

    return tags
  }

  const tags = await resolveTagsUnified({
    config,
    newVersion,
    graduating,
    step,
    logLevel,
  })

  logger.debug(`[${versionMode}](${step}) Using tags: ${tags.from} → ${tags.to}`)

  return tags
}
