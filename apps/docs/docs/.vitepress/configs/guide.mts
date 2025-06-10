import type { DefaultTheme } from 'vitepress'

export const guide = {
  text: 'Guide',
  collapsed: false,
  items: [
    { text: 'Getting Started', link: '/guide/getting-started' },
    { text: 'Resolvers', link: '/guide/resolvers' },
    { text: '@maz-ui/themes', link: '/guide/theme' },
    { text: '@maz-ui/nuxt', link: '/guide/nuxt' },
    { text: '@maz-ui/cli (deprecated)', link: '/guide/cli' },
    { text: '@maz-ui/icons', link: '/guide/icons', collapsed: true, items: [
      { text: 'Icon Set (300+ icons)', link: '/guide/icon-set' },
    ] },
    { text: 'Migration v4', link: '/guide/migration-v4' },
  ],
} satisfies DefaultTheme.SidebarItem
