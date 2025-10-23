import type { LogLevel } from '@maz-ui/node'
import type { DeepPartial } from '@maz-ui/utils'
import type { ResolvedChangelogConfig } from 'changelogen'
import type { BumpConfig, ChangelogConfig, ChangelogMonorepoConfig, MonorepoConfig, PublishConfig, ReleaseConfig, RepoConfig, TemplatesConfig } from '../types'
import { logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'
import { loadChangelogConfig } from 'changelogen'
import { defu } from 'defu'

import { getLastTag } from '../core'

async function getDefaultConfig({
  userConfig,
  logLevel,
}: {
  userConfig: ResolvedChangelogConfig & Partial<ChangelogMonorepoConfig>
  logLevel?: LogLevel
}) {
  return {
    ...userConfig,
    from: await getLastTag({ onlyStable: false, logLevel }),
    monorepo: {
      versionMode: 'selective',
      packages: ['packages/*'],
      filterCommits: true,
    },
    bump: {
      type: 'release',
    },
    changelog: {
      rootChangelog: true,
    },
    release: {
      publish: true,
      push: true,
      release: true,
      verify: true,
    },
    templates: {
      emptyChangelogContent: 'No relevant changes for this release',
    },
    logLevel: logLevel || 'default',
  } satisfies DeepPartial<ChangelogMonorepoConfig>
}

function setupLogger(logLevel?: LogLevel) {
  if (logLevel) {
    logger.setLevel(logLevel)
    logger.debug(`Log level set to: ${logLevel}`)
  }
}

async function mergeConfig({ userConfig, overrides, logLevel }: {
  userConfig: ResolvedChangelogConfig & Partial<ChangelogMonorepoConfig>
  overrides?: Partial<ChangelogMonorepoConfig>
  logLevel?: LogLevel
}) {
  const defaultConfig = await getDefaultConfig({
    userConfig,
    logLevel,
  })

  logger.verbose('default config:', formatJson(defaultConfig))

  const monorepo = defu(
    userConfig.monorepo,
    defaultConfig.monorepo,
  ) satisfies MonorepoConfig

  const bump = defu(
    overrides?.bump,
    userConfig.bump,
    defaultConfig.bump,
  ) satisfies BumpConfig

  const changelog = defu(
    overrides?.changelog,
    userConfig.changelog,
    defaultConfig.changelog,
  ) satisfies ChangelogConfig

  const publish = defu(
    overrides?.publish,
    userConfig.publish,
    defaultConfig.publish,
  ) satisfies PublishConfig

  const release = defu(
    overrides?.release,
    userConfig.release,
    defaultConfig.release,
  ) satisfies ReleaseConfig

  const templates = defu(
    userConfig.templates,
    defaultConfig.templates,
  ) satisfies TemplatesConfig

  const repo = defu(
    userConfig.repo,
    defaultConfig.repo,
  ) satisfies RepoConfig

  return {
    ...userConfig,
    from: overrides?.from ?? userConfig.from,
    to: overrides?.to ?? userConfig.to,
    logLevel: overrides?.logLevel ?? userConfig.logLevel,
    cwd: overrides?.cwd ?? userConfig.cwd,
    repo,
    monorepo,
    bump,
    changelog,
    publish,
    release,
    templates,
  }
}

export async function loadMonorepoConfig(options?: {
  overrides?: Partial<ChangelogMonorepoConfig>
}) {
  const rootDir = options?.overrides?.cwd ?? process.cwd()
  const userConfig = await loadChangelogConfig(rootDir) as ResolvedChangelogConfig & Partial<ChangelogMonorepoConfig>

  const logLevel = options?.overrides?.logLevel || userConfig.logLevel || 'default'
  setupLogger(logLevel)

  logger.verbose('User config loaded:', formatJson(userConfig))

  if (options?.overrides) {
    logger.verbose('overrides:', formatJson(options.overrides))
  }

  const resolvedConfig = await mergeConfig({
    userConfig,
    overrides: options?.overrides,
    logLevel,
  })

  logger.debug('Resolved config:', formatJson(resolvedConfig))

  return resolvedConfig
}

export type ResolvedChangelogMonorepoConfig = Awaited<ReturnType<typeof loadMonorepoConfig>>
