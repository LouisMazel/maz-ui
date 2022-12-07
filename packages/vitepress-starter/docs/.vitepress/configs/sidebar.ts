import { DefaultTheme } from 'vitepress'
import { components } from './components'
import { directives } from './directives'
import { helpers } from './helpers'
import { guide } from './guide'
import { composables } from './composables'
import { plugins } from './plugins'

export const sidebar: DefaultTheme.SidebarGroup[] = [
  guide,
  components,
  plugins,
  directives,
  helpers,
  composables,
]