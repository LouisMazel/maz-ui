import type { DeepPartial } from '@maz-ui/utils'
import type { ChangelogMonorepoConfig } from './types'

export * from './commands'
export * from './core'
export * from './types'

export function defineConfig(config: DeepPartial<ChangelogMonorepoConfig>) {
  return config
}
