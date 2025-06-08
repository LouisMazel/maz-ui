import type { DefaultTheme } from 'vitepress'

export const directives = {
  text: 'Directives',
  collapsed: false,
  items: [
    { text: 'v-click-outside', link: '/directives/click-outside' },
    { text: 'v-closable', link: '/directives/closable' },
    { text: 'v-fullscreen-img', link: '/directives/fullscreen-img' },
    { text: 'v-lazy-img', link: '/directives/lazy-img' },
    { text: 'v-tooltip', link: '/directives/tooltip' },
    { text: 'v-zoom-img', link: '/directives/zoom-img' },
  ],
} satisfies DefaultTheme.SidebarItem
