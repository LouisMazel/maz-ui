import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from 'maz-ui/package.json'

import { components } from './components'
import { directives } from './directives'
import { filters } from './filters'
import { helpers } from './helpers'
import { plugins } from './plugins'

export const navbar: NavbarConfig = [
  {
    text: 'Guide',
    children: [
      '/guide/getting-started.md',
      '/guide/colors.md',
      '/guide/theme.md',
      '/guide/dark-theme.md'
    ]
  },
  components,
  {
    text: 'Modules',
    children: [plugins, directives, filters, helpers],
  },
  '/made-with-maz-ui',
  {
    text: `v${version}`,
    children: [
      {
        text: 'Changelog',
        link: 'https://github.com/LouisMazel/maz-ui/blob/next/packages/lib/CHANGELOG.md',
      },
      {
        text: 'v2.x',
        link: 'https://louismazel.github.io/maz-ui',
      },
    ],
  },
]