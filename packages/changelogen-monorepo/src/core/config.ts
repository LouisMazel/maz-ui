import type { LogLevel } from '@maz-ui/node'
import type { DeepPartial } from '@maz-ui/utils'
import type { ResolvedChangelogConfig } from 'changelogen'
import type { BumpConfig, ChangelogConfig, ChangelogMonorepoConfig, MonorepoConfig, PublishConfig, ReleaseConfig, RepoConfig, TemplatesConfig } from '../types'
import { logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'
import { loadChangelogConfig } from 'changelogen'

import { getLastTag } from '../core'

async function getDefaultConfig({
  config,
  logLevel,
}: {
  config: ResolvedChangelogConfig & Partial<ChangelogMonorepoConfig>
  logLevel?: LogLevel
}) {
  return {
    ...config,
    from: await getLastTag({ onlyStable: false, logLevel }),
    monorepo: {
      versionMode: 'selective',
      packages: ['packages/*'],
      ignorePackageNames: [],
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

async function mergeConfig({ config, overrides, logLevel }: {
  config: ResolvedChangelogConfig & Partial<ChangelogMonorepoConfig>
  overrides?: Partial<ChangelogMonorepoConfig>
  logLevel?: LogLevel
}) {
  const defaultConfig = await getDefaultConfig({
    config,
    logLevel,
  })

  const monorepo = {
    ...defaultConfig.monorepo,
    ...config.monorepo,
  } satisfies MonorepoConfig

  const bump = {
    ...defaultConfig.bump,
    ...config.bump,
    ...overrides?.bump,
  } satisfies Omit<BumpConfig, 'preid'> & { preid?: string }

  const changelog = {
    ...defaultConfig.changelog,
    ...config.changelog,
    ...overrides?.changelog,
  } satisfies Omit<ChangelogConfig, 'formatCmd'> & { formatCmd?: string }

  const publish = {
    ...defaultConfig.publish,
    ...config.publish,
    ...overrides?.publish,
  } satisfies Omit<PublishConfig, 'packages'> & { packages?: string[] }

  const release = {
    ...defaultConfig.release,
    ...config.release,
    ...overrides?.release,
  } satisfies ReleaseConfig

  const templates = {
    ...defaultConfig.templates,
    ...config.templates,
  } satisfies TemplatesConfig

  const repo = {
    ...defaultConfig.repo,
    ...config.repo,
  } satisfies RepoConfig

  const tokens = {
    ...config.tokens,
    ...overrides?.tokens,
  }

  return {
    ...config,
    from: overrides?.from || config.from,
    to: overrides?.to || config.to,
    logLevel: overrides?.logLevel || config.logLevel,
    cwd: overrides?.cwd || config.cwd,
    repo,
    tokens,
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
  const config = await loadChangelogConfig(rootDir) as ResolvedChangelogConfig & Partial<ChangelogMonorepoConfig>

  const logLevel = options?.overrides?.logLevel || config.logLevel || 'default'
  const defaultConfig = await getDefaultConfig({
    config,
    logLevel,
  })
  setupLogger(logLevel)

  logger.verbose('config loaded with changelogen:', formatJson(config))

  if (options?.overrides) {
    logger.verbose('overrides:', formatJson(options.overrides))
  }

  logger.verbose('default config:', formatJson(defaultConfig))

  const resolvedConfig = await mergeConfig({
    config,
    overrides: options?.overrides,
    logLevel,
  })

  logger.debug('Resolved config:', formatJson(resolvedConfig))

  return resolvedConfig
}

export type ResolvedChangelogMonorepoConfig = Awaited<ReturnType<typeof loadMonorepoConfig>>
