import type { DefaultTheme } from 'vitepress'

export const guide = {
  text: 'Guide',
  collapsed: true,
  items: [
    { text: 'Getting Started', link: '/guide/getting-started' },
    { text: 'Auto-imports - Resolvers', link: '/guide/resolvers' },
    { text: 'Nuxt', link: '/guide/nuxt' },
    { text: 'Theming', link: '/guide/theme' },
    { text: 'Translations (i18n)', link: '/guide/translations' },
    { text: 'Icons', link: '/guide/icons', collapsed: true, items: [
      { text: 'Icon Set - 300+ icons', link: '/guide/icon-set' },
    ] },
    { text: 'CLI', link: '/guide/cli' },
    { text: 'Migration v3 to v4', link: '/guide/migration-v4' },
  ],
} satisfies DefaultTheme.SidebarItem
