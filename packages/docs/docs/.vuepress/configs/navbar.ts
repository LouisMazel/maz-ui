import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from './../../../../lib/package.json'
import { components } from './components'
import { directives } from './directives'
import { filters } from './filters'
import { plugins } from './plugins'

export const navbar: NavbarConfig = [
  {
    text: 'Guide',
    children: [
      '/guide/getting-started.md',
      '/guide/colors.md',
      '/guide/theme.md',
      '/guide/dark-mode.md'
    ]
  },
  components,
  {
    text: 'Modules',
    children: [plugins, filters, directives],
  },
  '/made-with-maz-ui',
  {
    text: `v${version}`,
    children: [
      {
        text: 'Changelog',
        link: 'https://github.com/LouisMazel/maz-ui/blob/next/CHANGELOG.md',
      },
      {
        text: 'v2.x',
        link: 'https://louismazel.github.io/maz-ui',
      },
    ],
  },
]