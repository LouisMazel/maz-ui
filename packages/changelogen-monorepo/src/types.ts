import type { ChangelogConfig } from 'changelogen'

export type VersionMode = 'unified' | 'independent'

export type ReleaseType = 'latest' | 'prerelease'

export interface MonorepoConfig {
  versionMode?: VersionMode
  packages?: string[]
  ignorePackages?: string[]
  filterCommits?: boolean
  rootChangelog?: boolean
}

export interface ExtendedChangelogConfig extends Partial<ChangelogConfig> {
  monorepo?: MonorepoConfig
}

export interface PackageInfo {
  name: string
  path: string
  version?: string
}

export interface BumpOptions {
  type?: 'major' | 'minor' | 'patch' | 'prerelease'
  preid?: string
  dryRun?: boolean
}

export interface ChangelogOptions {
  releaseType?: ReleaseType
  from?: string
  to?: string
  dryRun?: boolean
}

export interface ReleaseOptions extends BumpOptions, ChangelogOptions {
  push?: boolean
  github?: boolean
}

export interface GithubOptions {
  versions?: string[]
  all?: boolean
  token?: string
}
