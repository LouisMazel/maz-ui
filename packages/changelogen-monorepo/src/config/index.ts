import type { ResolvedChangelogConfig } from 'changelogen'
import type { BumpConfig, ChangelogConfig, ChangelogMonorepoConfig, MonorepoConfig, PublishConfig, ReleaseConfig } from '../types'
import { loadChangelogConfig } from 'changelogen'

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
  publish: {
    packages: ['packages/*'],
  },
  release: {
    publish: true,
    push: true,
    release: true,
    verify: true,
  },
} satisfies Required<Pick<ChangelogMonorepoConfig, 'monorepo' | 'bump' | 'changelog' | 'release' | 'publish'>>

export async function loadMonorepoConfig(options?: {
  overrides?: Partial<ChangelogMonorepoConfig>
}) {
  const rootDir = options?.overrides?.cwd ?? process.cwd()
  const config = await loadChangelogConfig(rootDir) as ResolvedChangelogConfig & Partial<ChangelogMonorepoConfig>

  const monorepo = {
    ...defaultConfig.monorepo,
    ...config.monorepo,
  } satisfies Required<MonorepoConfig>

  const bump = {
    ...defaultConfig.bump,
    ...config.bump,
    ...options?.overrides?.bump,
  } satisfies Required<Omit<BumpConfig, 'preid'>> & { preid?: string }

  const changelog = {
    ...defaultConfig.changelog,
    ...config.changelog,
    ...options?.overrides?.changelog,
  } satisfies Required<Omit<ChangelogConfig, 'formatCmd'>> & { formatCmd?: string }

  const publish = {
    ...defaultConfig.publish,
    ...config.publish,
    ...options?.overrides?.publish,
  } satisfies PublishConfig

  const release = {
    ...defaultConfig.release,
    ...config.release,
    ...options?.overrides?.release,
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

export type ResolvedChangelogMonorepoConfig = Awaited<ReturnType<typeof loadMonorepoConfig>>

export function getPackagePatterns(monorepoConfig: MonorepoConfig): string[] {
  return monorepoConfig.packages || ['packages/*']
}
