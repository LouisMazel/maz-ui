import type { DefaultTheme } from 'vitepress'

export const formatters = {
  text: 'Formatters',
  collapsed: true,
  items: [
    { text: 'capitalize', link: '/helpers/capitalize' },
    { text: 'formatCurrency', link: '/helpers/currency' },
    { text: 'formatDate', link: '/helpers/date' },
    { text: 'formatNumber', link: '/helpers/number' },
  ],
} satisfies DefaultTheme.SidebarItem
