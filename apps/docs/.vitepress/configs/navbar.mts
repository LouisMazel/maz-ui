import type { DefaultTheme } from 'vitepress'

import { createRequire } from 'node:module'

import { components } from './components.mjs'
import { composables } from './composables.mjs'
import { directives } from './directives.mjs'
import { guide } from './guide.mjs'
import { plugins } from './plugins.mjs'
import { utils } from './utils.mjs'

const require = createRequire(import.meta.url)

const packageJson = require('maz-ui/package.json')

export const nav = [
  guide,
  components,
  {
    text: 'Modules',
    activeMatch: '/plugins',
    items: [plugins, composables, directives, utils],
  },
  { text: 'Made w/ Maz-UI', link: '/made-with-maz-ui' },
  {
    text: `v${packageJson.version}`,
    items: [
      {
        text: 'Changelog',
        link: 'https://github.com/LouisMazel/maz-ui/releases',
      },
      {
        text: 'v4 announcement',
        link: '/blog/v4',
      },
      {
        text: 'v3 documentation',
        link: 'https://v3.maz-ui.com',
      },
      {
        text: 'Migration v3 to v4',
        link: '/guide/migration-v4',
      },
      {
        text: 'Contributing',
        link: 'https://github.com/LouisMazel/maz-ui/blob/master/CONTRIBUTING.md',
      },
    ],
  },
] satisfies DefaultTheme.NavItem[]
