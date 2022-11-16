import { DefaultTheme } from 'vitepress'
import { components } from './components'
import { directives } from './directives'
import { filters } from './filters'
import { guide } from './guide'
import { helpers } from './helpers'
import { plugins } from './plugins'

export const sidebar: DefaultTheme.SidebarGroup[] = [
  guide,
  // components,
  // plugins,
  // directives,
  // filters,
  // helpers,
]