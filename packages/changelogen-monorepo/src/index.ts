import type { ExtendedChangelogConfig } from './types'

export { bumpCommand } from './commands/bump'
export { changelogCommand } from './commands/changelog'
export { githubCommand } from './commands/github'
export { releaseCommand } from './commands/release'

export { getPackagePatterns, getRootDir, loadMonorepoConfig } from './config'

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
  ChangelogOptions,
  ExtendedChangelogConfig,
  GithubOptions,
  MonorepoConfig,
  PackageInfo,
  ReleaseOptions,
  ReleaseType,
  VersionMode,
} from './types'

export function defineConfig(config: ExtendedChangelogConfig): ExtendedChangelogConfig {
  return config
}
