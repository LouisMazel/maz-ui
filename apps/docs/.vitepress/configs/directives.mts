import type { DefaultTheme } from 'vitepress'
import { withNewBadge } from './badges.mjs'

export const directives = {
  text: 'Directives',
  collapsed: true,
  items: [
    { text: 'v-click-outside', link: '/directives/click-outside' },
    { text: withNewBadge('v-draw'), link: '/directives/draw' },
    { text: 'v-fullscreen-img', link: '/directives/fullscreen-img' },
    {
      text: withNewBadge('v-intersect'),
      link: '/directives/intersect',
    },
    { text: 'v-lazy-img', link: '/directives/lazy-img' },
    { text: withNewBadge('v-magnetic'), link: '/directives/magnetic' },
    { text: withNewBadge('v-press'), link: '/directives/press' },
    {
      text: withNewBadge('v-reveal'),
      link: '/directives/reveal',
    },
    { text: withNewBadge('v-ripple'), link: '/directives/ripple' },
    { text: withNewBadge('v-tilt'), link: '/directives/tilt' },
    { text: 'v-tooltip', link: '/directives/tooltip' },
    { text: 'v-zoom-img', link: '/directives/zoom-img' },
  ],
} satisfies DefaultTheme.SidebarItem
