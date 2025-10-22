import type { ResolvedChangelogConfig } from 'changelogen'
import type { BumpConfig, ChangelogConfig, ChangelogMonorepoConfig, MonorepoConfig, PublishConfig, ReleaseConfig, TemplatesConfig } from '../types'
import { logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'
import { loadChangelogConfig } from 'changelogen'
import { getLastTag } from '../core'

const defaultConfig = {
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
  publish: {},
  release: {
    publish: true,
    push: true,
    release: true,
    verify: true,
  },
  templates: {
    emptyChangelogContent: 'No relevant changes for this release',
  },
} satisfies Required<Pick<ChangelogMonorepoConfig, 'monorepo' | 'bump' | 'changelog' | 'release' | 'publish' | 'templates'>>

async function mergeConfig(config: ResolvedChangelogConfig & Partial<ChangelogMonorepoConfig>, overrides?: Partial<ChangelogMonorepoConfig>) {
  const monorepo = {
    ...defaultConfig.monorepo,
    ...config.monorepo,
  } satisfies Required<MonorepoConfig>

  const bump = {
    ...defaultConfig.bump,
    ...config.bump,
    ...overrides?.bump,
  } satisfies Required<Omit<BumpConfig, 'preid'>> & { preid?: string }

  const changelog = {
    ...defaultConfig.changelog,
    ...config.changelog,
    ...overrides?.changelog,
  } satisfies Required<Omit<ChangelogConfig, 'formatCmd'>> & { formatCmd?: string }

  const publish = {
    ...defaultConfig.publish,
    ...config.publish,
    ...overrides?.publish,
  } satisfies PublishConfig

  const release = {
    ...defaultConfig.release,
    ...config.release,
    ...overrides?.release,
  } satisfies ReleaseConfig

  const templates = {
    ...defaultConfig.templates,
    ...config.templates,
  } satisfies TemplatesConfig

  return {
    ...config,
    bump,
    changelog,
    monorepo,
    publish,
    release,
    templates,
    to: overrides?.to || config.to,
    from: overrides?.from || await getLastTag({ onlyStable: false }) || config.from,
  } satisfies ChangelogMonorepoConfig
}

export async function loadMonorepoConfig(options?: {
  overrides?: Partial<ChangelogMonorepoConfig>
}) {
  logger.debug('Loading monorepo configuration')

  const rootDir = options?.overrides?.cwd ?? process.cwd()
  const config = await loadChangelogConfig(rootDir) as ResolvedChangelogConfig & Partial<ChangelogMonorepoConfig>

  logger.verbose('config loaded with changelogen:', formatJson(config))
  logger.verbose('overrides:', options?.overrides ? formatJson(options?.overrides) : 'none')

  const resolvedConfig = await mergeConfig(config, options?.overrides)

  logger.verbose('Resolved config:', formatJson(resolvedConfig))

  logger.debug('Monorepo configuration loaded')

  return resolvedConfig
}

export type ResolvedChangelogMonorepoConfig = Awaited<ReturnType<typeof loadMonorepoConfig>>

export function getPackagePatterns(monorepoConfig: MonorepoConfig): string[] {
  return monorepoConfig.packages || ['packages/*']
}
