import type { DeepPartial } from '@maz-ui/utils'
import type { ChangelogMonorepoConfig } from './types'

export { bumpCommand } from './commands/bump'
export { changelogCommand } from './commands/changelog'
export { githubCommand } from './commands/github'
export { gitlabCommand } from './commands/gitlab'
export { publishCommand } from './commands/publish'
export { releaseCommand } from './commands/release'

export { getPackagePatterns, loadMonorepoConfig } from './config'

export { generateChangelog, writeChangelogToFile } from './core/changelog'
export { getPackageCommits, getPackages, getRootPackage } from './core/monorepo'
export {
  bumpPackagesVersions,
  bumpPackageVersion,
  readVersion,
  updateLernaVersion,
  writeVersion,
} from './core/version'

export type {
  BumpOptions,
  ChangelogMonorepoConfig,
  ChangelogOptions,
  GithubOptions,
  GitlabOptions,
  GitProvider,
  MonorepoConfig,
  PackageInfo,
  PublishOptions,
  ReleaseOptions,
  VersionMode,
} from './types'

export { detectGitProvider, parseGitRemoteUrl } from './utils/git'
export { createGitlabRelease, getGitlabReleaseByTag, listGitlabReleases } from './utils/gitlab'

export function defineConfig(config: DeepPartial<ChangelogMonorepoConfig>): DeepPartial<ChangelogMonorepoConfig> {
  return config
}
