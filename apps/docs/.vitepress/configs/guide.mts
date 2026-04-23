import type { DefaultTheme } from 'vitepress'

export const guide = {
  text: 'Guide',
  collapsed: true,
  items: [
    { text: 'Getting Started', link: '/guide/getting-started' },
    { text: 'Vue', link: '/guide/vue' },
    { text: 'Nuxt', link: '/guide/nuxt' },
    { text: 'Theming', link: '/guide/themes' },
    { text: 'Tailwind CSS', link: '/guide/tailwind' },
    { text: 'Translations (i18n)', link: '/guide/translations' },
    { text: 'MazUiProvider', link: '/guide/maz-ui-provider' },
    { text: 'Resolvers (auto-imports)', link: '/guide/resolvers' },
    { text: 'Icons', link: '/guide/icons', collapsed: true, items: [
      { text: 'Icon Set - 860+ icons', link: '/guide/icon-set' },
    ] },
    { text: 'Migration v4 to v5', link: '/guide/migration-v5' },
    { text: 'Migration v3 to v4', link: '/guide/migration-v4' },
    { text: 'Model Context Protocol (MCP)', link: '/guide/mcp' },
    { text: 'Browser Support', link: '/guide/browser-support' },
    { text: 'CLI (v3)', link: '/guide/cli' },
  ],
} satisfies DefaultTheme.SidebarItem
