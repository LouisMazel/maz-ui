import type { DefaultTheme } from 'vitepress'
import { components } from './components.mjs'
import { composables } from './composables.mjs'
import { directives } from './directives.mjs'
import { ecosystem } from './ecosystem.mjs'
import { guide } from './guide.mjs'
import { icons } from './icons.mjs'
import { node } from './node.mjs'
import { plugins } from './plugins.mjs'
import { utils } from './utils.mjs'

export const sidebar: DefaultTheme.Sidebar = {
  '/ecosystem/utils/': [utils],
  '/ecosystem/node/': [node],
  '/ecosystem/icons/': [icons],
  '/ecosystem/eslint-config': [ecosystem],
  '/ecosystem/stylelint-config': [ecosystem],
  '/ecosystem/mcp': [ecosystem],
  '/ecosystem/nuxt': [ecosystem],
  '/ecosystem/themes': [ecosystem],
  '/ecosystem/translations': [ecosystem],
  '/': [
    guide,
    components,
    plugins,
    composables,
    directives,
    ecosystem,
  ],
}
