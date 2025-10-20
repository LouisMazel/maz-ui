import type { ChangelogMonorepoConfig } from './types'

export { bump } from './commands/bump'
export { changelog } from './commands/changelog'
export { github } from './commands/github'
export { gitlab } from './commands/gitlab'
export { publish } from './commands/publish'
export { release } from './commands/release'

export * from './config'

export * from './core/changelog'
export * from './core/dependencies'
export type * from './core/dependencies'
export type * from './core/dependencies'
export * from './core/monorepo'

export * from './core/version'

export type * from './types'

export * from './utils/git'
export * from './utils/gitlab'
export type * from './utils/gitlab'

export function defineConfig(config: Partial<ChangelogMonorepoConfig>): Partial<ChangelogMonorepoConfig> {
  return config
}
