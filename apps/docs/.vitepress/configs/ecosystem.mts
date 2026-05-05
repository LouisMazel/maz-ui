import type { DefaultTheme } from 'vitepress'

export const ecosystem = {
  text: 'Ecosystem',
  collapsed: true,
  items: [
    { text: 'ESLint config', link: '/ecosystem/eslint-config' },
    { text: 'Stylelint config', link: '/ecosystem/stylelint-config' },
  ],
} satisfies DefaultTheme.SidebarItem
