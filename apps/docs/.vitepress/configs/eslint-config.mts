import type { DefaultTheme } from 'vitepress'

export const eslintConfig = {
  text: '@maz-ui/eslint-config',
  items: [
    { text: 'Overview', link: '/ecosystem/eslint-config' },
    { text: 'Installation', link: '/ecosystem/eslint-config#installation' },
    { text: 'Basic usage', link: '/ecosystem/eslint-config#basic-usage' },
    { text: 'Configuration', link: '/ecosystem/eslint-config#configuration' },
    { text: 'Logging', link: '/ecosystem/eslint-config#logging' },
    { text: 'Tailwind support', link: '/ecosystem/eslint-config#tailwind-support' },
    { text: 'Custom rules', link: '/ecosystem/eslint-config#custom-rules' },
    { text: 'What it includes', link: '/ecosystem/eslint-config#what-it-includes' },
    { text: 'Advanced', link: '/ecosystem/eslint-config#advanced' },
    { text: 'Compatibility', link: '/ecosystem/eslint-config#compatibility' },
  ],
} satisfies DefaultTheme.SidebarItem
