import type { DefaultTheme } from 'vitepress'
import { components } from './components.mjs'
import { composables } from './composables.mjs'
import { directives } from './directives.mjs'
import { guide } from './guide.mjs'
import { plugins } from './plugins.mjs'
import { utils } from './utils.mjs'

export const sidebar = [
  guide,
  components,
  plugins,
  composables,
  directives,
  utils,
] satisfies DefaultTheme.SidebarItem[]
