import type { DefaultTheme } from 'vitepress'

export const utils = {
  text: '@maz-ui/utils',
  items: [
    { text: 'Getting Started', link: '/ecosystem/utils/' },
    {
      text: 'Strings',
      collapsed: false,
      items: [
        { text: 'camelCase', link: '/ecosystem/utils/camel-case' },
        { text: 'capitalize', link: '/ecosystem/utils/capitalize' },
        { text: 'kebabCase', link: '/ecosystem/utils/kebab-case' },
        { text: 'normalizeString', link: '/ecosystem/utils/normalize-string' },
        { text: 'pascalCase', link: '/ecosystem/utils/pascal-case' },
        { text: 'snakeCase', link: '/ecosystem/utils/snake-case' },
        { text: 'upperFirst', link: '/ecosystem/utils/upper-first' },
      ],
    },
    {
      text: 'Numbers & Currency',
      collapsed: false,
      items: [
        { text: 'formatCurrency', link: '/ecosystem/utils/currency' },
        { text: 'formatNumber', link: '/ecosystem/utils/number' },
      ],
    },
    {
      text: 'Dates',
      collapsed: false,
      items: [
        { text: 'formatDate', link: '/ecosystem/utils/date' },
      ],
    },
    {
      text: 'Timing',
      collapsed: false,
      items: [
        { text: 'debounce', link: '/ecosystem/utils/debounce' },
        { text: 'debounceCallback', link: '/ecosystem/utils/debounce-callback' },
        { text: 'debounceId', link: '/ecosystem/utils/debounce-id' },
        { text: 'IdleTimeout', link: '/ecosystem/utils/idle-timeout' },
        { text: 'sleep', link: '/ecosystem/utils/sleep' },
        { text: 'throttle', link: '/ecosystem/utils/throttle' },
        { text: 'throttleId', link: '/ecosystem/utils/throttle-id' },
      ],
    },
    {
      text: 'Browser & DOM',
      collapsed: false,
      items: [
        { text: 'cookie', link: '/ecosystem/utils/cookie' },
        { text: 'getBrowserLocale', link: '/ecosystem/utils/get-browser-locale' },
        { text: 'isClient', link: '/ecosystem/utils/is-client' },
        { text: 'isServer', link: '/ecosystem/utils/is-server' },
        { text: 'isStandaloneMode', link: '/ecosystem/utils/is-standalone-mode' },
        { text: 'ScriptLoader', link: '/ecosystem/utils/script-loader' },
        { text: 'Swipe', link: '/ecosystem/utils/swipe-handler' },
        { text: 'TextareaAutogrow', link: '/ecosystem/utils/textarea-autogrow' },
        { text: 'UserVisibility', link: '/ecosystem/utils/user-visibility' },
      ],
    },
    {
      text: 'Country & Flags',
      collapsed: false,
      items: [
        { text: 'countryCodeToUnicodeFlag', link: '/ecosystem/utils/country-code-to-unicode-flag' },
        { text: 'fetchLocaleIp', link: '/ecosystem/utils/fetch-locale-ip' },
        { text: 'getCountryFlagUrl', link: '/ecosystem/utils/get-country-flag-url' },
      ],
    },
    {
      text: 'Validation & Comparison',
      collapsed: false,
      items: [
        { text: 'checkAvailability', link: '/ecosystem/utils/check-availability' },
        { text: 'isEqual', link: '/ecosystem/utils/is-equal' },
        { text: 'truthyFilter', link: '/ecosystem/utils/truthy-filter' },
      ],
    },
    {
      text: 'Formatting & Errors',
      collapsed: false,
      items: [
        { text: 'formatJson', link: '/ecosystem/utils/format-json' },
        { text: 'formatPhoneNumber', link: '/ecosystem/utils/format-phone-number' },
        { text: 'getErrorMessage', link: '/ecosystem/utils/get-error-message' },
      ],
    },
    {
      text: 'TypeScript Helpers',
      collapsed: true,
      items: [
        { text: 'DeepKeyOf', link: '/ecosystem/utils/types/deep-key-of' },
        { text: 'DeepPartial', link: '/ecosystem/utils/types/deep-partial' },
        { text: 'DeepRequired', link: '/ecosystem/utils/types/deep-required' },
        { text: 'FlattenObjectKeys', link: '/ecosystem/utils/types/flatten-object-keys' },
        { text: 'GenericInstanceType', link: '/ecosystem/utils/types/generic-instance-type' },
        { text: 'InferMaybeRef', link: '/ecosystem/utils/types/infer-maybe-ref' },
      ],
    },
  ],
} satisfies DefaultTheme.SidebarItem
