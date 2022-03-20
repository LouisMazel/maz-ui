import type { SidebarConfig } from '@vuepress/theme-default'
import { components } from './components'
import { directives } from './directives'
import { filters } from './filters'
import { helpers } from './helpers'
import { plugins } from './plugins'

export const sidebar: SidebarConfig = [
  {
    text: 'Guide',
    children: [
      '/guide/getting-started.md',
      '/guide/colors.md',
      '/guide/theme.md',
      '/guide/dark-theme.md',
    ],
  },
  components,
  plugins,
  directives,
  filters,
  helpers,
]