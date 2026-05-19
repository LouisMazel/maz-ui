import type { DefaultTheme } from 'vitepress'

export const utils = {
  text: '@maz-ui/utils',
  items: [
    { text: 'Getting Started', link: '/utils/' },
    {
      text: 'Strings',
      collapsed: false,
      items: [
        { text: 'camelCase', link: '/utils/camel-case' },
        { text: 'capitalize', link: '/utils/capitalize' },
        { text: 'kebabCase', link: '/utils/kebab-case' },
        { text: 'normalizeString', link: '/utils/normalize-string' },
        { text: 'pascalCase', link: '/utils/pascal-case' },
        { text: 'snakeCase', link: '/utils/snake-case' },
        { text: 'upperFirst', link: '/utils/upper-first' },
      ],
    },
    {
      text: 'Numbers & Currency',
      collapsed: false,
      items: [
        { text: 'formatCurrency', link: '/utils/currency' },
        { text: 'formatNumber', link: '/utils/number' },
      ],
    },
    {
      text: 'Dates',
      collapsed: false,
      items: [
        { text: 'formatDate', link: '/utils/date' },
      ],
    },
    {
      text: 'Timing',
      collapsed: false,
      items: [
        { text: 'debounce', link: '/utils/debounce' },
        { text: 'debounceCallback', link: '/utils/debounce-callback' },
        { text: 'debounceId', link: '/utils/debounce-id' },
        { text: 'IdleTimeout', link: '/utils/idle-timeout' },
        { text: 'sleep', link: '/utils/sleep' },
        { text: 'throttle', link: '/utils/throttle' },
        { text: 'throttleId', link: '/utils/throttle-id' },
      ],
    },
    {
      text: 'Browser & DOM',
      collapsed: false,
      items: [
        { text: 'cookie', link: '/utils/cookie' },
        { text: 'getBrowserLocale', link: '/utils/get-browser-locale' },
        { text: 'isClient', link: '/utils/is-client' },
        { text: 'isServer', link: '/utils/is-server' },
        { text: 'isStandaloneMode', link: '/utils/is-standalone-mode' },
        { text: 'ScriptLoader', link: '/utils/script-loader' },
        { text: 'Swipe', link: '/utils/swipe-handler' },
        { text: 'TextareaAutogrow', link: '/utils/textarea-autogrow' },
        { text: 'UserVisibility', link: '/utils/user-visibility' },
      ],
    },
    {
      text: 'Country & Flags',
      collapsed: false,
      items: [
        { text: 'countryCodeToUnicodeFlag', link: '/utils/country-code-to-unicode-flag' },
        { text: 'fetchLocaleIp', link: '/utils/fetch-locale-ip' },
        { text: 'getCountryFlagUrl', link: '/utils/get-country-flag-url' },
      ],
    },
    {
      text: 'Validation & Comparison',
      collapsed: false,
      items: [
        { text: 'checkAvailability', link: '/utils/check-availability' },
        { text: 'isEqual', link: '/utils/is-equal' },
        { text: 'truthyFilter', link: '/utils/truthy-filter' },
      ],
    },
    {
      text: 'Formatting & Errors',
      collapsed: false,
      items: [
        { text: 'formatJson', link: '/utils/format-json' },
        { text: 'formatPhoneNumber', link: '/utils/format-phone-number' },
        { text: 'getErrorMessage', link: '/utils/get-error-message' },
      ],
    },
    {
      text: 'TypeScript Helpers',
      collapsed: true,
      items: [
        { text: 'DeepKeyOf', link: '/utils/types/deep-key-of' },
        { text: 'DeepPartial', link: '/utils/types/deep-partial' },
        { text: 'DeepRequired', link: '/utils/types/deep-required' },
        { text: 'FlattenObjectKeys', link: '/utils/types/flatten-object-keys' },
        { text: 'GenericInstanceType', link: '/utils/types/generic-instance-type' },
        { text: 'InferMaybeRef', link: '/utils/types/infer-maybe-ref' },
      ],
    },
  ],
} satisfies DefaultTheme.SidebarItem
