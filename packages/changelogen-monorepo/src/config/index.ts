import type { ResolvedChangelogConfig } from 'changelogen'
import type { ExtendedChangelogConfig, MonorepoConfig } from '../types'
import { loadChangelogConfig } from 'changelogen'

const defaultMonorepoConfig: Required<MonorepoConfig> = {
  versionMode: 'unified',
  packages: ['packages/*'],
  ignorePackages: [],
  filterCommits: true,
  rootChangelog: true,
}

export async function loadMonorepoConfig(
  cwd: string,
  overrides?: Partial<ExtendedChangelogConfig>,
): Promise<{
  changelogConfig: ResolvedChangelogConfig
  monorepoConfig: Required<MonorepoConfig>
}> {
  const changelogConfig = await loadChangelogConfig(cwd, overrides)

  const monorepoConfig: Required<MonorepoConfig> = {
    ...defaultMonorepoConfig,
    ...overrides?.monorepo,
  }

  return {
    changelogConfig,
    monorepoConfig,
  }
}

export function getPackagePatterns(monorepoConfig: MonorepoConfig): string[] {
  return monorepoConfig.packages || ['packages/*']
}

export function getRootDir(cwd: string): string {
  return cwd
}
