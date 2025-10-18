import type { ChangelogMonorepoConfig } from './types'

export { bump } from './commands/bump'
export { changelog } from './commands/changelog'
export { github } from './commands/github'
export { gitlab } from './commands/gitlab'
export { publish } from './commands/publish'
export { release } from './commands/release'

export { getPackagePatterns, loadMonorepoConfig } from './config'

export { generateChangelog, writeChangelogToFile } from './core/changelog'
export {
  expandPackagesToBumpWithDependents,
  getDependentsOf,
  getPackageDependencies,
  getPackagesWithDependencies,
  topologicalSort,
} from './core/dependencies'
export type * from './core/dependencies'
export { getPackageCommits, getPackages, getRootPackage } from './core/monorepo'

export {
  bumpPackageVersion,
  readVersion,
  updateLernaVersion,
  writeVersion,
} from './core/version'

export type * from './types'

export { detectGitProvider, parseGitRemoteUrl } from './utils/git'
export { createGitlabRelease, getGitlabReleaseByTag, listGitlabReleases } from './utils/gitlab'

export function defineConfig(config: Partial<ChangelogMonorepoConfig>): Partial<ChangelogMonorepoConfig> {
  return config
}
