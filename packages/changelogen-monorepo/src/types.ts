import type { LogLevel } from '@maz-ui/node'
import type { GitCommit, ChangelogConfig as IChangelogConfig, SemverBumpType } from 'changelogen'
import type { ReleaseType } from 'semver'
import type { ResolvedChangelogMonorepoConfig } from './core'

export type VersionMode = 'unified' | 'independent' | 'selective'

export type GitProvider = 'github' | 'gitlab'
export interface PackageInfo {
  fromTag?: string
  name: string
  path: string
  version: string
}
export interface PackageWithCommits extends PackageInfo {
  commits: GitCommit[]
}

export interface PublishResponse {
  publishedPackages: PackageInfo[]
}

export type BumpResult = {
  oldVersion?: string
  newVersion?: string
  bumpedPackages: PackageInfo[]
  bumped: true
} | {
  bumped: false
}

export interface PostedRelease {
  name: string
  tag: string
  prerelease: boolean
  version: string
}

export interface MonorepoConfig {
  /**
   * Version mode for the monorepo.
   * @required
   */
  versionMode: VersionMode
  /**
   * Glob pattern matching for packages to bump.
   * @required
   */
  packages: string[]
  /**
   * Package names to ignore.
   * @default []
   */
  ignorePackageNames?: string[]
}

export type ConfigType = {
  title: string
  semver?: SemverBumpType
} | boolean

export interface BumpConfig {
  /**
   * @default 'release'
   */
  type: ReleaseType
  /**
   * @default undefined
   */
  preid?: string
  /**
   * Check if there are any changes to commit before bumping.
   * @default true
   */
  clean?: boolean
  /**
   * Include dev dependencies when bumping.
   * @default ['dependencies']
   */
  dependencyTypes?: ('dependencies' | 'devDependencies' | 'peerDependencies')[]
  /**
   * Skip confirmation prompt about bumping packages
   * @default true
   */
  yes?: boolean
}

export interface BumpOptions extends BumpConfig {
  /**
   * @default false
   */
  dryRun?: boolean
  /**
   * @default undefined
   */
  config?: ResolvedChangelogMonorepoConfig
  /**
   * @default undefined
   */
  logLevel?: LogLevel
  /**
   * @default false
   */
  force?: boolean
}

export interface ChangelogConfig {
  formatCmd?: string
  rootChangelog?: boolean
}
export interface ChangelogOptions extends ChangelogConfig {
  from?: string
  to?: string
  dryRun?: boolean
  packages?: PackageInfo[]
  config?: ResolvedChangelogMonorepoConfig
  logLevel?: LogLevel
  newTag?: string
}

export interface GitProviderOptions {
  from?: string
  to?: string
  token?: string
  dryRun?: boolean
  config?: ResolvedChangelogMonorepoConfig
  logLevel?: LogLevel
}

export type PublishConfig = IChangelogConfig['publish'] & {
  registry?: string
  tag?: string
  access?: 'public' | 'restricted'
  otp?: string
  /**
   * Glob pattern matching for packages to publish.
   * @default undefined
   */
  packages?: string[]
  /**
   * Command to build your packages before publishing.
   * @default undefined
   */
  buildCmd?: string
}

export interface PublishOptions extends PublishConfig {
  dryRun?: boolean
  config?: ResolvedChangelogMonorepoConfig
  bumpedPackages?: PackageInfo[]
  logLevel?: LogLevel
}

export interface ReleaseConfig {
  /**
   * Commit changes and create tag
   * @default true
   */
  commit?: boolean
  /**
   * Push changes to your repository (commit and tag(s))
   * @default true
   */
  push?: boolean
  /**
   * Generate changelog files (CHANGELOG.md)
   * @default true
   */
  changelog?: boolean
  /**
   * Publish release to your repository (github or gitlab)
   * @default true
   */
  release?: boolean
  /**
   * Publish release to your registry
   * @default true
   */
  publish?: boolean
  /**
   * Skip git verification while committing by using --no-verify flag
   * @default true
   */
  noVerify?: boolean
  /**
   * Bump even if there are no commits
   * @default false
   */
  force?: boolean
  /**
   * Determine if the working directory is clean and if it is not clean, exit
   * @default false
   */
  clean?: boolean
}

export interface ReleaseOptions extends ReleaseConfig, BumpConfig, ChangelogConfig, PublishConfig {
  /**
   * Run without side effects
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
  /**
   * @default undefined
   */
  logLevel?: LogLevel
}

export interface TemplatesConfig {
  commitMessage?: string
  tagMessage?: string
  /**
   * Not used with "independent" version mode
   */
  tagBody?: string
  emptyChangelogContent?: string
}

export interface RepoConfig {
  domain?: string
  repo?: string
  token?: string
  provider?: GitProvider
}

export interface ChangelogMonorepoConfig extends Partial<Omit<IChangelogConfig, 'output' | 'templates' | 'publish'>> {
  cwd?: string
  from?: string
  to?: string
  /**
   * @default `{
    versionMode: 'selective',
    packages: ['packages/*'],
    ignorePackageNames: [],
  }`
   */
  monorepo: MonorepoConfig

  repo?: RepoConfig

  templates?: TemplatesConfig

  bump?: BumpConfig
  publish?: PublishConfig
  changelog?: ChangelogConfig
  release?: ReleaseConfig
  logLevel?: LogLevel
}

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'
