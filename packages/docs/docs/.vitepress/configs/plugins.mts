import { DefaultTheme } from 'vitepress';

export const plugins = {
  text: 'Plugins',
  collapsed: false,
  items: [
    { text: 'aos (animation on scroll)', link: '/plugins/aos' },
    { text: 'dialog', link: '/plugins/dialog' },
    { text: 'toaster', link: '/plugins/toaster' },
    { text: 'wait', link: '/plugins/wait' },
  ]
} satisfies DefaultTheme.NavItemChildren | DefaultTheme.SidebarItem