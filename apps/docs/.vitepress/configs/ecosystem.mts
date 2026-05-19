import type { DefaultTheme } from 'vitepress'
import { withNewBadge } from './badges.mjs'

export const ecosystem = {
  text: withNewBadge('Ecosystem'),
  collapsed: true,
  items: [
    { text: withNewBadge('@maz-ui/utils'), link: '/ecosystem/utils/' },
    { text: withNewBadge('@maz-ui/node'), link: '/ecosystem/node/' },
    { text: withNewBadge('@maz-ui/eslint-config'), link: '/ecosystem/eslint-config' },
    { text: withNewBadge('@maz-ui/stylelint-config'), link: '/ecosystem/stylelint-config' },
    { text: withNewBadge('@maz-ui/icons'), link: '/guide/icons' },
    { text: withNewBadge('@maz-ui/mcp'), link: '/guide/mcp' },
    { text: '@maz-ui/nuxt', link: '/guide/nuxt' },
    { text: '@maz-ui/translations', link: '/guide/translations' },
    { text: '@maz-ui/themes', link: '/guide/themes' },
  ],
} satisfies DefaultTheme.SidebarItem
