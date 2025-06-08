import type { DefaultTheme } from 'vitepress'

export const helpers = {
  text: 'Helpers',
  collapsed: false,
  items: [
    { text: 'capitalize', link: '/helpers/capitalize' },
    { text: 'country-code-to-unicode-flag', link: '/helpers/country-code-to-unicode-flag' },
    { text: 'currency', link: '/helpers/currency' },
    { text: 'date', link: '/helpers/date' },
    { text: 'number', link: '/helpers/number' },
  ],
} satisfies DefaultTheme.SidebarItem
