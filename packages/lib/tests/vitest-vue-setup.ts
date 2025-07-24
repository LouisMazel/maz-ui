import { config } from '@vue/test-utils'

config.global.stubs = {
  teleport: true,
  Teleport: true,
}
// Global configuration for Vue Test Utils

// Global mocks for browser APIs
config.global.mocks = {
  $t: (key: string) => key,
  $tc: (key: string) => key,
  $te: (key: string) => key,
  $d: (value: any) => value,
  $n: (value: any) => value,
}
