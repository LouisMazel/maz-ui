import type { ChangelogMonorepoConfig } from './types'

export * from './commands'
export * from './core'
export * from './types'

export function defineConfig(config: Partial<ChangelogMonorepoConfig>): Partial<ChangelogMonorepoConfig> {
  return config
}
