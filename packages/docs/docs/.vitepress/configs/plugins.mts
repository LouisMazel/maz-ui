import { DefaultTheme } from 'vitepress';

export const plugins = {
  text: 'Plugins',
  collapsed: false,
  items: [
    { text: 'toaster', link: '/plugins/toaster' },
    { text: 'aos (animation on scroll)', link: '/plugins/aos' },
    { text: 'wait', link: '/plugins/wait' },
  ]
} satisfies DefaultTheme.NavItemChildren | DefaultTheme.SidebarItem