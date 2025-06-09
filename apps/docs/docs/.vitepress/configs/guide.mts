import type { DefaultTheme } from 'vitepress'

export const guide = {
  text: 'Guide',
  collapsed: false,
  items: [
    { text: 'Getting Started', link: '/guide/getting-started' },
    { text: '@maz-ui/themes', link: '/guide/theme' },
    { text: '@maz-ui/nuxt', link: '/guide/nuxt' },
    { text: '@maz-ui/cli (theme generator)', link: '/guide/cli' },
    { text: '@maz-ui/icons', link: '/guide/icons' },
    { text: 'Migration v4', link: '/guide/migration-v4' },
  ],
} satisfies DefaultTheme.SidebarItem
