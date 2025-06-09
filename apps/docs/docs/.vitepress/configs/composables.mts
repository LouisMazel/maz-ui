import type { DefaultTheme } from 'vitepress'

export const composables = {
  text: 'Composables',
  collapsed: false,
  items: [
    { text: 'useAos', link: '/composables/use-aos' },
    { text: 'useBreakpoints', link: '/composables/use-breakpoints' },
    { text: 'useDialog', link: '/composables/use-dialog' },
    { text: 'useFormValidator', link: '/composables/use-form-validator' },
    { text: 'useIdleTimeout', link: '/composables/use-idle-timeout' },
    { text: 'useLanguageDisplayNames', link: '/composables/use-language-display-names' },
    { text: 'useReadingTime', link: '/composables/use-reading-time' },
    { text: 'useStringMatching', link: '/composables/use-string-matching' },
    { text: 'useSwipe', link: '/composables/use-swipe' },
    { text: 'useTimer', link: '/composables/use-timer' },
    { text: 'useToast', link: '/composables/use-toast' },
    { text: 'useUserVisibility', link: '/composables/use-user-visibility' },
    { text: 'useWait', link: '/composables/use-wait' },
    { text: 'useWindowSize', link: '/composables/use-window-size' },
  ],
} satisfies DefaultTheme.SidebarItem
