import type { DefaultTheme } from 'vitepress'

export const plugins = {
  text: 'Plugins',
  collapsed: true,
  items: [
    { text: 'aos (animation on scroll)', link: '/plugins/aos' },
    { text: 'dialog', link: '/plugins/dialog' },
    { text: 'toast', link: '/plugins/toast' },
    { text: 'wait', link: '/plugins/wait' },
  ],
} satisfies DefaultTheme.NavItemChildren | DefaultTheme.SidebarItem
