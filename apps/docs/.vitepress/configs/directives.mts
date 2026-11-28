import type { DefaultTheme } from 'vitepress'
import { withNewBadge } from './badges.mjs'

export const directives = {
  text: 'Directives',
  collapsed: true,
  items: [
    { text: 'v-click-outside', link: '/directives/click-outside' },
    { text: 'v-fullscreen-img', link: '/directives/fullscreen-img' },
    {
      text: withNewBadge('v-intersect'),
      link: '/directives/intersect',
    },
    { text: 'v-lazy-img', link: '/directives/lazy-img' },
    {
      text: withNewBadge('v-reveal'),
      link: '/directives/reveal',
    },
    { text: 'v-tooltip', link: '/directives/tooltip' },
    { text: 'v-zoom-img', link: '/directives/zoom-img' },
  ],
} satisfies DefaultTheme.SidebarItem
