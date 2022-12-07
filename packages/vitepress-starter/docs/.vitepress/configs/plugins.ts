import { DefaultTheme } from 'vitepress';

export const plugins: DefaultTheme.NavItemChildren = {
  text: 'Plugins',
  items: [
    { text: 'aos (animation on scroll)', link: '/plugins/aos'},
    { text: 'toaster', link: '/plugins/toaster'},
    { text: 'wait', link: '/plugins/wait'},
    { text: 'idle-timeout', link: '/plugins/idle-timeout' },
    { text: 'user-visibility', link: '/plugins/user-visibility' },
  ]
}