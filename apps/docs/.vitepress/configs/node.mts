import type { DefaultTheme } from 'vitepress'

export const node = {
  text: '@maz-ui/node',
  items: [
    { text: 'Getting Started', link: '/ecosystem/node/' },
    { text: 'execPromise', link: '/ecosystem/node/exec-promise' },
    { text: 'logger / createLogger', link: '/ecosystem/node/logger' },
    { text: 'printBanner', link: '/ecosystem/node/print-banner' },
  ],
} satisfies DefaultTheme.SidebarItem
