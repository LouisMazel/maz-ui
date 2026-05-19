import type { DefaultTheme } from 'vitepress'
import { components } from './components.mjs'
import { composables } from './composables.mjs'
import { directives } from './directives.mjs'
import { ecosystem } from './ecosystem.mjs'
import { eslintConfig } from './eslint-config.mjs'
import { guide } from './guide.mjs'
import { node } from './node.mjs'
import { plugins } from './plugins.mjs'
import { stylelintConfig } from './stylelint-config.mjs'
import { utils } from './utils.mjs'

export const sidebar: DefaultTheme.Sidebar = {
  '/ecosystem/utils/': [utils],
  '/ecosystem/node/': [node],
  '/ecosystem/eslint-config': [eslintConfig],
  '/ecosystem/stylelint-config': [stylelintConfig],
  '/': [
    guide,
    components,
    plugins,
    composables,
    directives,
    ecosystem,
  ],
}
