import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from 'maz-ui/package.json'

import { guide } from './guide'
import { components } from './components'
import { directives } from './directives'
import { filters } from './filters'
import { helpers } from './helpers'
import { plugins } from './plugins'

export const navbar: NavbarConfig = [
  guide,
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