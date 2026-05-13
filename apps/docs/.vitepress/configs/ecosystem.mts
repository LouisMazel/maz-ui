import type { DefaultTheme } from 'vitepress'
import { withNewBadge } from './badges.mjs'

export const ecosystem = {
  text: 'Ecosystem',
  collapsed: true,
  items: [
    { text: '@maz-ui/nuxt', link: '/guide/nuxt' },
    { text: '@maz-ui/translations', link: '/guide/translations' },
    { text: '@maz-ui/themes', link: '/guide/themes' },
    { text: withNewBadge('@maz-ui/icons'), link: '/guide/icons' },
    { text: withNewBadge('@maz-ui/mcp'), link: '/guide/mcp' },
    { text: withNewBadge('@maz-ui/eslint-config'), link: '/ecosystem/eslint-config' },
    { text: withNewBadge('@maz-ui/stylelint-config'), link: '/ecosystem/stylelint-config' },
  ],
} satisfies DefaultTheme.SidebarItem
