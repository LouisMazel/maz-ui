import type { DefaultTheme } from 'vitepress'
import { withNewBadge } from './badges.mjs'

export const guide = {
  text: 'Guide',
  collapsed: true,
  items: [
    { text: 'Getting Started', link: '/guide/getting-started' },
    { text: 'Vue', link: '/guide/vue' },
    { text: 'Nuxt', link: '/ecosystem/nuxt' },
    { text: 'Theming', link: '/ecosystem/themes' },
    { text: 'Tailwind CSS', link: '/guide/tailwind' },
    { text: 'Translations (i18n)', link: '/ecosystem/translations' },
    { text: withNewBadge('Global component defaults'), link: '/guide/global-defaults' },
    { text: 'MazUiProvider', link: '/guide/maz-ui-provider' },
    { text: 'Resolvers (auto-imports)', link: '/guide/resolvers' },
    { text: 'Icons', link: '/ecosystem/icons/', collapsed: true, items: [
      { text: 'Icon Set - 860+ icons', link: '/ecosystem/icons/icon-set' },
    ] },
    { text: 'Migration v4 to v5', link: '/guide/migration-v5' },
    { text: 'Model Context Protocol (MCP)', link: '/ecosystem/mcp' },
    { text: 'Browser Support', link: '/guide/browser-support' },
  ],
} satisfies DefaultTheme.SidebarItem
