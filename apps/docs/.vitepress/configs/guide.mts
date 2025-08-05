import type { DefaultTheme } from 'vitepress'

export const guide = {
  text: 'Guide',
  collapsed: true,
  items: [
    { text: 'Getting Started', link: '/guide/getting-started' },
    { text: 'Vue', link: '/guide/vue' },
    { text: 'Nuxt', link: '/guide/nuxt' },
    { text: 'Theming', link: '/guide/themes' },
    { text: 'Translations (i18n)', link: '/guide/translations' },
    { text: 'Resolvers (auto-imports)', link: '/guide/resolvers' },
    { text: 'Icons', link: '/guide/icons', collapsed: true, items: [
      { text: 'Icon Set - 300+ icons', link: '/guide/icon-set' },
    ] },
    { text: 'Migration v3 to v4', link: '/guide/migration-v4' },
    { text: 'Model Context Protocol (MCP)', link: '/guide/mcp' },
    { text: 'CLI (v3)', link: '/guide/cli' },
  ],
} satisfies DefaultTheme.SidebarItem
