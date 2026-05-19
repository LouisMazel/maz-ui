import type { DefaultTheme } from 'vitepress'

export const stylelintConfig = {
  text: '@maz-ui/stylelint-config',
  items: [
    { text: 'Overview', link: '/ecosystem/stylelint-config' },
    { text: 'Installation', link: '/ecosystem/stylelint-config#installation' },
    { text: 'Basic usage', link: '/ecosystem/stylelint-config#basic-usage' },
    { text: 'Configuration', link: '/ecosystem/stylelint-config#configuration' },
    { text: 'Logging', link: '/ecosystem/stylelint-config#logging' },
    { text: 'Logical properties', link: '/ecosystem/stylelint-config#logical-properties-rtl-friendly' },
    { text: 'Tailwind CSS v4', link: '/ecosystem/stylelint-config#tailwind-css-v4' },
    { text: 'Property ordering', link: '/ecosystem/stylelint-config#property-ordering' },
    { text: 'Layering shareable configs', link: '/ecosystem/stylelint-config#layering-shareable-configs' },
    { text: 'What it includes', link: '/ecosystem/stylelint-config#what-it-includes' },
    { text: 'Advanced', link: '/ecosystem/stylelint-config#advanced' },
    { text: 'Migrating', link: '/ecosystem/stylelint-config#migrating-from-a-hand-written-stylelintrc' },
    { text: 'Compatibility', link: '/ecosystem/stylelint-config#compatibility' },
  ],
} satisfies DefaultTheme.SidebarItem
