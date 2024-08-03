import { DefaultTheme } from 'vitepress'
import { components } from './components.mjs'
import { directives } from './directives.mjs'
import { helpers } from './helpers.mjs'
import { guide } from './guide.mjs'
import { composables } from './composables.mjs'
import { plugins } from './plugins.mjs'

export const sidebar = [
  guide,
  components,
  plugins,
  composables,
  directives,
  helpers,
] satisfies DefaultTheme.SidebarItem[]