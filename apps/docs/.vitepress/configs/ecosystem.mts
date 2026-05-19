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
    { text: withNewBadge('@maz-ui/icons'), link: '/ecosystem/icons/' },
    { text: withNewBadge('@maz-ui/mcp'), link: '/ecosystem/mcp' },
    { text: '@maz-ui/nuxt', link: '/ecosystem/nuxt' },
    { text: '@maz-ui/translations', link: '/ecosystem/translations' },
    { text: '@maz-ui/themes', link: '/ecosystem/themes' },
  ],
} satisfies DefaultTheme.SidebarItem
