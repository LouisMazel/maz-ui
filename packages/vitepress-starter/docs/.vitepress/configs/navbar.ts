import { DefaultTheme } from 'vitepress'
import { version } from 'maz-ui/package.json'

import { guide } from './guide'
import { components } from './components'
import { directives } from './directives'
import { helpers } from './helpers'
import { composables } from './composables'
import { plugins } from './plugins'

export const nav: DefaultTheme.NavItem[] = [
  guide,
  components,
  {
    text: 'Modules',
    activeMatch: '/plugins',
    items: [plugins, directives, composables, helpers],
  },
  { text: 'Made with Maz-ui', link: '/made-with-maz-ui', },
  {
    text: `v${version}`,
    items: [
      {
        text: 'Changelog',
        link: 'https://github.com/LouisMazel/maz-ui/blob/master/packages/lib/CHANGELOG.md',
      },
      {
        text: 'v2.x',
        link: 'https://louismazel.github.io/maz-ui',
      },
    ],
  },
]