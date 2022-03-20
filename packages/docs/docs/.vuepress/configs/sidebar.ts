import type { SidebarConfig } from '@vuepress/theme-default'
import { components } from './components'
import { directives } from './directives'
import { filters } from './filters'
import { guide } from './guide'
import { helpers } from './helpers'
import { plugins } from './plugins'

export const sidebar: SidebarConfig = [
  guide,
  components,
  plugins,
  directives,
  filters,
  helpers,
]