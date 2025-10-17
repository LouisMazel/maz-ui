import type { ChangelogConfig } from 'changelogen'

export type VersionMode = 'unified' | 'independent' | 'selective'

export type GitProvider = 'github' | 'gitlab'

export interface MonorepoConfig {
  versionMode?: VersionMode
  packages?: string[]
  ignorePackages?: string[]
  filterCommits?: boolean
  rootChangelog?: boolean
}

export interface IChangelogConfig {
  formatCmd?: string
  from?: string
  to?: string
}

export interface ChangelogMonorepoConfig extends ChangelogConfig {
  monorepo: MonorepoConfig
  publish: PublishConfig
  changelog?: IChangelogConfig
  noVerify?: boolean
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

export interface ChangelogOptions extends IChangelogConfig {
  dryRun?: boolean
}

export interface ReleaseOptions extends BumpOptions, ChangelogOptions {
  push?: boolean
  release?: boolean
  publish?: boolean
  registry?: string
  tag?: string
  access?: 'public' | 'restricted'
  otp?: string
  noVerify?: boolean
}

export interface GithubOptions {
  versions?: string[]
  all?: boolean
  token?: string
  dryRun?: boolean
}

export interface GitlabOptions {
  versions?: string[]
  all?: boolean
  token?: string
  dryRun?: boolean
}

export interface PublishConfig {
  registry?: string
  tag?: string
  access?: 'public' | 'restricted'
  otp?: string
  packages?: string[]
}

export interface PublishOptions extends PublishConfig {
  dryRun?: boolean
}
