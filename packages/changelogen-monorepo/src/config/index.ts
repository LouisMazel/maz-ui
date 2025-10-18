import type { ChangelogConfig as IChangelogConfig, ResolvedChangelogConfig } from 'changelogen'
import type { BumpConfig, ChangelogConfig, ChangelogMonorepoConfig, MonorepoConfig, PublishConfig, ReleaseConfig } from '../types'
import { loadChangelogConfig } from 'changelogen'

const defaultConfig = {
  monorepo: {
    versionMode: 'selective',
    packages: ['packages/*'],
    ignorePackages: [],
    filterCommits: true,
  },
  bump: {
    type: 'release',
  },
  changelog: {
    rootChangelog: true,
  },
  publish: {
    packages: ['packages/*'],
  },
  release: {
    publish: true,
    push: true,
    release: true,
    noVerify: false,
  },
} satisfies Required<Pick<ChangelogMonorepoConfig, 'monorepo' | 'bump' | 'changelog' | 'release' | 'publish'>>

export async function loadMonorepoConfig(options?: {
  overrides?: Partial<Pick<IChangelogConfig, 'cwd' | 'from' | 'to'>>
}) {
  const rootDir = options?.overrides?.cwd ?? process.cwd()
  const config = await loadChangelogConfig(rootDir) as ResolvedChangelogConfig & Partial<ChangelogMonorepoConfig>

  const monorepo = {
    ...defaultConfig.monorepo,
    ...config.monorepo,
  } satisfies Required<MonorepoConfig>

  const changelog = {
    ...defaultConfig.changelog,
    ...config.changelog,
  } satisfies ChangelogConfig

  const publish = {
    ...defaultConfig.publish,
    ...config.publish,
  } satisfies PublishConfig

  const bump = {
    ...defaultConfig.bump,
    ...config.bump,
  } satisfies BumpConfig

  const release = {
    ...defaultConfig.release,
    ...config.release,
  } satisfies ReleaseConfig

  return {
    ...config,
    bump,
    changelog,
    monorepo,
    publish,
    release,
    to: options?.overrides?.to || config.to,
    from: options?.overrides?.from || config.from,
  } satisfies ChangelogMonorepoConfig
}

export function getPackagePatterns(monorepoConfig: MonorepoConfig): string[] {
  return monorepoConfig.packages || ['packages/*']
}
