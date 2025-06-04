import type { DefaultTheme } from 'vitepress'

export const guide = {
  text: 'Guide',
  collapsed: false,
  items: [
    { text: 'Getting Started', link: '/guide/getting-started' },
    { text: 'Basic colors', link: '/guide/colors' },
    { text: 'Theme', link: '/guide/theme' },
    { text: 'Dark mode', link: '/guide/dark-mode' },
    { text: 'Nuxt Module', link: '/guide/nuxt' },
    { text: '@mazui/cli (theme generator)', link: '/guide/cli' },
    { text: 'Migration v4', link: '/guide/migration-v4' },
  ],
} satisfies DefaultTheme.SidebarItem
