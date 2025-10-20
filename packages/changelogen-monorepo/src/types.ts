import type { ChangelogConfig as IChangelogConfig } from 'changelogen'
import type { ReleaseType } from 'semver'

export type VersionMode = 'unified' | 'independent' | 'selective'

export type GitProvider = 'github' | 'gitlab'
export interface PackageInfo {
  name: string
  path: string
  version?: string
}

export interface BumpResult {
  newVersion?: string
  bumpedPackages: PackageInfo[]
}

export interface MonorepoConfig {
  versionMode?: VersionMode
  packages?: string[]
  ignorePackages?: string[]
  filterCommits?: boolean
}

export interface ChangelogConfig {
  formatCmd?: string
  rootChangelog?: boolean
}
export interface ChangelogOptions extends ChangelogConfig {
  from?: string
  to?: string
  dryRun?: boolean
}

export interface BumpConfig {
  type?: ReleaseType
  preid?: string
}

export interface BumpOptions extends BumpConfig {
  dryRun?: boolean
}

export interface GitProviderOptions {
  from?: string
  to?: string
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

export interface ReleaseConfig {
  push: boolean
  release: boolean
  publish: boolean
  noVerify: boolean
  registry?: string
  tag?: string
  access?: 'public' | 'restricted'
  otp?: string
}

export interface ReleaseOptions extends ReleaseConfig, BumpConfig, PublishConfig, ChangelogConfig {
  dryRun?: boolean
  from?: string
  to?: string
  token?: string
}

export interface ChangelogMonorepoConfig extends IChangelogConfig {
  monorepo: MonorepoConfig

  repo: IChangelogConfig['repo'] & {
    provider?: GitProvider
  }

  bump: Partial<BumpConfig>
  publish: Partial<PublishConfig>
  changelog: Partial<ChangelogConfig>
  release: Partial<ReleaseConfig>
}
