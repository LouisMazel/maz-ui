import type { DefaultTheme } from 'vitepress'

export const icons = {
  text: '@maz-ui/icons',
  items: [
    { text: 'Getting Started', link: '/ecosystem/icons/' },
    { text: 'Icons by name, without maz-ui', link: '/ecosystem/icons/by-name' },
    { text: 'Icon Set (860+ icons)', link: '/ecosystem/icons/icon-set' },
  ],
} satisfies DefaultTheme.SidebarItem
