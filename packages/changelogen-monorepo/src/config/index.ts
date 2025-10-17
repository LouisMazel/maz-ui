import type { ResolvedChangelogConfig } from 'changelogen'
import type { ChangelogMonorepoConfig, IChangelogConfig, MonorepoConfig, PublishConfig } from '../types'
import { loadChangelogConfig } from 'changelogen'

const defaultMonorepoConfig: Required<MonorepoConfig> = {
  versionMode: 'selective',
  packages: ['packages/*'],
  ignorePackages: [],
  filterCommits: true,
  rootChangelog: true,
}

export async function loadMonorepoConfig(
  cwd: string,
  overrides?: Partial<ChangelogMonorepoConfig>,
) {
  const changelogConfig = await loadChangelogConfig(cwd, overrides) as ResolvedChangelogConfig & {
    monorepo?: MonorepoConfig
    publish?: PublishConfig
    changelog?: IChangelogConfig
  }

  const monorepo: Required<MonorepoConfig> = {
    ...defaultMonorepoConfig,
    ...overrides?.monorepo,
    ...changelogConfig.monorepo,
  }

  return {
    ...changelogConfig,
    monorepo,
  } satisfies ChangelogMonorepoConfig
}

export function getPackagePatterns(monorepoConfig: MonorepoConfig): string[] {
  return monorepoConfig.packages || ['packages/*']
}
