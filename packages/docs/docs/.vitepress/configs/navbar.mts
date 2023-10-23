import { DefaultTheme } from 'vitepress'

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const packageJson = require('maz-ui/package.json');

import { guide } from './guide.mjs'
import { components } from './components.mjs'
import { directives } from './directives.mjs'
import { helpers } from './helpers.mjs'
import { composables } from './composables.mjs'
import { plugins } from './plugins.mjs'

export const nav: DefaultTheme.NavItem[] = [
  guide,
  components,
  {
    text: 'Modules',
    activeMatch: '/plugins',
    items: [plugins, composables, directives, helpers],
  },
  { text: 'Made with Maz-ui', link: '/made-with-maz-ui', },
  {
    text: `v${packageJson.version}`,
    items: [
      {
        text: 'Changelog',
        link: 'https://github.com/LouisMazel/maz-ui/blob/master/CHANGELOG.md',
      },
      {
        text: 'v2.x',
        link: 'https://louismazel.github.io/maz-ui',
      },
    ],
  },
]