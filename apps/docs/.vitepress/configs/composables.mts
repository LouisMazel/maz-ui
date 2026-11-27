import type { DefaultTheme } from 'vitepress'
import { withNewBadge } from './badges.mjs'

export const composables = {
  text: 'Composables',
  collapsed: true,
  items: [
    { text: 'useAos', link: '/composables/use-aos' },
    { text: 'useBreakpoints', link: '/composables/use-breakpoints' },
    {
      text: withNewBadge('useClipboard'),
      link: '/composables/use-clipboard',
    },
    { text: 'useDialog', link: '/composables/use-dialog' },
    {
      text: withNewBadge('useDrag'),
      link: '/composables/use-drag',
    },
    { text: 'useDropzone', link: '/composables/use-dropzone' },
    { text: withNewBadge('useEventListener'), link: '/composables/use-event-listener' },
    { text: 'useFormValidator', link: '/composables/use-form-validator' },
    { text: 'useFreezeValue', link: '/composables/use-freeze-value' },
    {
      text: withNewBadge('useFuzzySearch'),
      link: '/composables/use-fuzzy-search',
    },
    { text: 'useIdleTimeout', link: '/composables/use-idle-timeout' },
    {
      text: withNewBadge('useInfiniteScroll'),
      link: '/composables/use-infinite-scroll',
    },
    { text: 'useInjectStrict', link: '/composables/use-inject-strict' },
    { text: 'useInstanceUniqId', link: '/composables/use-instance-uniq-id' },
    {
      text: withNewBadge('useIntersectionObserver'),
      link: '/composables/use-intersection-observer',
    },
    { text: 'useDisplayNames', link: '/composables/use-display-names' },
    { text: withNewBadge('useMediaQuery'), link: '/composables/use-media-query' },
    { text: 'useMountComponent', link: '/composables/use-mount-component' },
    { text: 'useMutationObserver', link: '/composables/use-mutation-observer' },
    {
      text: withNewBadge('usePullToRefresh'),
      link: '/composables/use-pull-to-refresh',
    },
    { text: 'useReadingTime', link: '/composables/use-reading-time' },
    {
      text: withNewBadge('useRelativeTime'),
      link: '/composables/use-relative-time',
    },
    {
      text: withNewBadge('useResizeObserver'),
      link: '/composables/use-resize-observer',
    },
    {
      text: withNewBadge('useScroll'),
      link: '/composables/use-scroll',
    },
    {
      text: withNewBadge('useScrollLock'),
      link: '/composables/use-scroll-lock',
    },
    { text: withNewBadge('useShortcut'), link: '/composables/use-shortcut' },
    { text: 'useStringMatching', link: '/composables/use-string-matching' },
    { text: 'useSwipe', link: '/composables/use-swipe' },
    { text: 'useTimer', link: '/composables/use-timer' },
    { text: 'useToast', link: '/composables/use-toast' },
    { text: 'useUserVisibility', link: '/composables/use-user-visibility' },
    { text: 'useWait', link: '/composables/use-wait' },
    { text: withNewBadge('useWindow'), link: '/composables/use-window' },
    { text: withNewBadge('useWindowFocus'), link: '/composables/use-window-focus' },
    { text: 'useWindowSize', link: '/composables/use-window-size' },
  ],
} satisfies DefaultTheme.SidebarItem
