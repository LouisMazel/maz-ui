import type { DefaultTheme } from 'vitepress'

export const utils = {
  text: 'Utilities',
  collapsed: true,
  items: [
    { text: 'camelCase', link: '/helpers/camel-case' },
    { text: 'checkAvailability', link: '/helpers/check-availability' },
    { text: 'countryCodeToUnicodeFlag', link: '/helpers/country-code-to-unicode-flag' },
    { text: 'debounce', link: '/helpers/debounce' },
    { text: 'debounceCallback', link: '/helpers/debounceCallback' },
    { text: 'debounceId', link: '/helpers/debounceId' },
    { text: 'getFlagUrl', link: '/helpers/get-country-flag-url' },
    { text: 'isClient', link: '/helpers/is-client' },
    { text: 'isEqual', link: '/helpers/is-equal' },
    { text: 'isStandaloneMode', link: '/helpers/is-standalone-mode' },
    { text: 'normalizeString', link: '/helpers/normalize-string' },
    { text: 'pascalCase', link: '/helpers/pascal-case' },
    { text: 'ScriptLoader', link: '/helpers/script-loader' },
    { text: 'sleep', link: '/helpers/sleep' },
    { text: 'throttle', link: '/helpers/throttle' },
    { text: 'throttleId', link: '/helpers/throttleId' },
  ],
} satisfies DefaultTheme.SidebarItem
