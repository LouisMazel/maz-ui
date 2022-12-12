import { DefaultTheme } from 'vitepress';

export const plugins: DefaultTheme.NavItemChildren = {
  text: 'Plugins',
  items: [
    { text: 'toaster', link: '/plugins/toaster'},
    { text: 'aos (animation on scroll)', link: '/plugins/aos'},
    { text: 'wait', link: '/plugins/wait'},
  ]
}