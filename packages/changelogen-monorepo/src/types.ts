import type { GitCommit, ChangelogConfig as IChangelogConfig } from 'changelogen'
import type { ReleaseType } from 'semver'

export type VersionMode = 'unified' | 'independent' | 'selective'

export type GitProvider = 'github' | 'gitlab'
export interface PackageInfo {
  name: string
  path: string
  version: string
}
export interface PackageWithCommits extends PackageInfo {
  commits: GitCommit[]
}

export interface BumpResult {
  /**
   * @default undefined
   */
  newVersion?: string
  bumpedPackages: PackageInfo[]
}

export interface MonorepoConfig {
  /**
   * @default 'selective'
   */
  versionMode?: VersionMode
  /**
   * @default ['packages/*']
   */
  packages?: string[]
  /**
   * @default []
   */
  ignorePackageNames?: string[]
  /**
   * @default true
   */
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
  /**
   * @default 'release'
   */
  type?: ReleaseType
  /**
   * @default undefined
   */
  preid?: string
}

export interface BumpOptions extends BumpConfig {
  /**
   * @default false
   */
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
  /**
   * @default true
   */
  push?: boolean
  /**
   * @default true
   */
  release?: boolean
  /**
   * @default true
   */
  publish?: boolean
  /**
   * @default true
   */
  verify?: boolean
}

export interface ReleaseOptions extends ReleaseConfig, BumpConfig, ChangelogConfig, PublishConfig {
  /**
   * @default false
   */
  dryRun?: boolean
  /**
   * @default undefined
   */
  from?: string
  /**
   * @default undefined
   */
  to?: string
  /**
   * @default undefined
   */
  token?: string
}

export interface ChangelogMonorepoConfig extends IChangelogConfig {
  /**
   * @default `{
    versionMode: 'selective',
    packages: ['packages/*'],
    ignorePackageNames: [],
    filterCommits: true,
  }`
   */
  monorepo: MonorepoConfig

  repo: IChangelogConfig['repo'] & {
    provider?: GitProvider
  }

  bump: BumpConfig
  publish: PublishConfig
  changelog: ChangelogConfig
  release: ReleaseConfig
}
