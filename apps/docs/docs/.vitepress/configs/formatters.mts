import type { DefaultTheme } from 'vitepress'

export const formatters = {
  text: 'Formatters',
  collapsed: true,
  items: [
    { text: 'capitalize', link: '/helpers/capitalize' },
    { text: 'currency', link: '/helpers/currency' },
    { text: 'date', link: '/helpers/date' },
    { text: 'number', link: '/helpers/number' },
  ],
} satisfies DefaultTheme.SidebarItem
