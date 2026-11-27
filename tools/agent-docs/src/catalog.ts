/**
 * Catalog of the ecosystem by need, written in the rules of the agents. Agents
 * search what they suspect exists: a component, never a composable for a
 * shared loading state or a helper for a currency. The catalog tells them,
 * from the need they have, without a search.
 *
 * Write each need with the words of an agent about to write the code by hand
 * (`a ref shared by several components`, `normalize("NFD")`), the common case
 * first. The names and the imports come from the docs (`docs`, optionally
 * narrowed by `symbols`): they follow the installed version. Every composable,
 * directive, plugin and helper is listed here or in `CATALOG_OMITTED`, the
 * generator warns otherwise.
 */
export interface CatalogNeed {
  /** The need, in the words of an agent about to write it by hand */
  need: string
  /** Doc ids of the tools that cover it */
  docs: string[]
  /** Only these symbols of the docs (all by default) */
  symbols?: string[]
}

export interface CatalogGroup {
  title: string
  needs: CatalogNeed[]
}

export const ECOSYSTEM_CATALOG: CatalogGroup[] = [
  {
    title: 'State, feedback and async',
    needs: [
      { need: 'a loading or busy state shared by several components (or a module): spinner, disabled buttons, fullscreen loader', docs: ['composables/use-wait', 'plugins/wait'] },
      { need: 'a message after an action (saved, failed, undo), instead of an `alert()` or a hand-made banner', docs: ['composables/use-toast', 'plugins/toast'] },
      { need: 'ask a confirmation or a choice from the code (`await` the answer), instead of `confirm()` or a dialog wired by hand', docs: ['composables/use-dialog', 'plugins/dialog'] },
      { need: 'copy a text with a "Copied!" state, a copy button for an ID or a command, instead of `navigator.clipboard.writeText`', docs: ['components/maz-btn-clipboard', 'composables/use-clipboard'] },
      { need: 'validate a form with a Zod, Valibot or ArkType schema (errors per field, on blur or submit)', docs: ['composables/use-form-validator'] },
      { need: 'keep the initial values of a form (a copy that no longer follows the source)', docs: ['composables/use-freeze-value'] },
      { need: 'know if two objects, arrays or dates are equal (unsaved changes), instead of `JSON.stringify(a) === JSON.stringify(b)`', docs: ['ecosystem/utils/is-equal'] },
      { need: 'a readable message from a caught error, instead of `error instanceof Error ? error.message : String(error)`', docs: ['ecosystem/utils/get-error-message'] },
      { need: 'wait until a value exists or matches (poll a getter with a timeout), instead of `setInterval` with a count of attempts', docs: ['ecosystem/utils/check-availability'] },
      { need: 'pause an async function, instead of `new Promise(resolve => setTimeout(resolve, ms))`', docs: ['ecosystem/utils/sleep'] },
      { need: 'remove the falsy values of an array with the type narrowed, instead of `.filter(Boolean)`', docs: ['ecosystem/utils/truthy-filter'] },
      { need: 'a required `inject()`, instead of `inject()` + `throw`', docs: ['composables/use-inject-strict'] },
      { need: 'a unique and SSR safe id per component instance (label `for`, `aria-describedby`), instead of `Math.random().toString(36)`', docs: ['composables/use-instance-uniq-id'] },
      { need: 'render a component from a function (a popup opened by code), instead of `createApp` or `render(h())`', docs: ['composables/use-mount-component'] },
    ],
  },
  {
    title: 'Timers and events',
    needs: [
      { need: 'wait after the last keystroke, or reset a state after a delay, instead of `clearTimeout` + `setTimeout`', docs: ['ecosystem/utils/debounce'] },
      { need: 'a search field that waits for the user to stop typing: the `debounce` prop', docs: ['components/maz-input'] },
      { need: 'only the last call of an async function per id resolves (one request per row)', docs: ['ecosystem/utils/debounce-id'] },
      { need: 'run at most every N ms (scroll, resize, mousemove handlers), instead of a `Date.now() - last` check', docs: ['ecosystem/utils/throttle', 'ecosystem/utils/throttle-id'] },
      { need: 'a countdown or a timeout with pause and resume, instead of `setInterval`', docs: ['composables/use-timer'] },
      { need: 'the user is inactive (auto logout, pause polling), instead of listeners on `mousemove` and `keydown`', docs: ['composables/use-idle-timeout', 'ecosystem/utils/idle-timeout'] },
      { need: 'the tab is hidden or visible again (pause, refresh on return), instead of `visibilitychange`', docs: ['composables/use-user-visibility', 'ecosystem/utils/user-visibility'] },
      { need: 'a click outside of an element (close a menu), instead of a `document` listener and `contains(event.target)`', docs: ['directives/click-outside'] },
      { need: 'the screen size or the breakpoint in the script, instead of `resize` or `matchMedia("(max-width...")`', docs: ['composables/use-breakpoints', 'composables/use-window-size'] },
      { need: 'an event listener, a media query, the window focus, a Cmd/Ctrl shortcut, instead of `addEventListener`, `matchMedia`, `metaKey`', docs: ['composables/use-event-listener', 'composables/use-media-query', 'composables/use-window-focus', 'composables/use-shortcut', 'ecosystem/utils/shortcut'], symbols: ['useEventListener', 'useMediaQuery', 'useWindowFocus', 'useShortcut', 'formatShortcut'] },
      { need: 'the changes or the size of a DOM element, instead of `new MutationObserver` or `new ResizeObserver`', docs: ['composables/use-mutation-observer', 'composables/use-resize-observer'] },
    ],
  },
  {
    title: 'Formatting and text',
    needs: [
      { need: 'an amount of money, instead of `Intl.NumberFormat` with `currency`', docs: ['ecosystem/utils/currency'] },
      { need: 'an input of an amount of money', docs: ['components/maz-input-price'] },
      { need: 'a date or a time, instead of `toLocaleDateString` or `Intl.DateTimeFormat`', docs: ['ecosystem/utils/date'] },
      { need: 'time ago ("3 minutes ago") that refreshes by itself, instead of `Intl.RelativeTimeFormat` and a timer; a duration ("3 min 05 s")', docs: ['composables/use-relative-time', 'ecosystem/utils/relative-time', 'ecosystem/utils/format-duration'], symbols: ['useRelativeTime', 'formatRelativeTime', 'formatDuration'] },
      { need: 'a number, a percentage, a compact number (1.2K), instead of `Intl.NumberFormat`', docs: ['ecosystem/utils/number'] },
      { need: 'a phone number in its international format, instead of `libphonenumber-js`', docs: ['ecosystem/utils/format-phone-number'] },
      { need: 'the name of a country or a language in any locale, instead of `Intl.DisplayNames`', docs: ['composables/use-display-names'] },
      { need: 'a country flag (emoji or image URL), instead of code points (`127397 +`) or a `flagcdn.com` URL', docs: ['ecosystem/utils/country-code-to-unicode-flag', 'ecosystem/utils/get-country-flag-url'] },
      { need: 'the reading time of a text, instead of `split(/\\s+/).length / 200`', docs: ['composables/use-reading-time'] },
      { need: 'change the case of a string (camelCase, kebab-case, snake_case...), instead of `charAt(0).toUpperCase()` or a regex', docs: ['ecosystem/utils/camel-case', 'ecosystem/utils/kebab-case', 'ecosystem/utils/snake-case', 'ecosystem/utils/pascal-case', 'ecosystem/utils/capitalize', 'ecosystem/utils/upper-first'] },
      { need: 'remove accents, compare without case nor accents, make a slug, instead of `normalize("NFD")` + a regex', docs: ['ecosystem/utils/normalize-string'] },
      { need: 'pretty print JSON, instead of `JSON.stringify(value, null, 2)`', docs: ['ecosystem/utils/format-json'] },
      { need: 'filter a list by a typed query (typos, accents, words in any order, highlight), instead of `includes()` on lowercased strings', docs: ['composables/use-fuzzy-search', 'ecosystem/utils/fuzzy-search'], symbols: ['useFuzzySearch', 'highlightMatches'] },
      { need: 'a diff of two texts; a growing log', docs: ['components/maz-code-highlight', 'ecosystem/utils/diff-lines', 'components/maz-log-stream'], symbols: ['MazCodeHighlight', 'diffLines', 'MazLogStream'] },
      { need: 'a select or a list with a search field: the `search` prop', docs: ['components/maz-select', 'components/maz-checklist'] },
      { need: 'how close two strings are ("did you mean")', docs: ['composables/use-string-matching'] },
      { need: 'a long text cut with "Read more"', docs: ['components/maz-read-more'] },
    ],
  },
  {
    title: 'Gestures, files and images',
    needs: [
      { need: 'drop files on an area, instead of `drop` and `dragover` listeners', docs: ['components/maz-dropzone', 'composables/use-dropzone'] },
      { need: 'a swipe on an element (carousel, dismiss), instead of `touchstart` and `touchend` listeners', docs: ['composables/use-swipe', 'ecosystem/utils/swipe-handler'] },
      { need: 'follow a pointer drag live (sheet, slider, reorder), instead of `pointerdown` and `pointermove` listeners', docs: ['composables/use-drag'] },
      { need: 'pull to refresh', docs: ['components/maz-pull-to-refresh', 'composables/use-pull-to-refresh'] },
      { need: 'a tooltip on hover', docs: ['directives/tooltip'] },
      { need: 'an element enters the viewport (infinite scroll, lazy images, animations), instead of `new IntersectionObserver`', docs: ['composables/use-intersection-observer', 'directives/intersect', 'composables/use-infinite-scroll', 'directives/lazy-img', 'components/maz-lazy-img', 'components/maz-animated-element'] },
      { need: 'animate elements when they appear on scroll (fade, zoom, slide), with `aos: true` in MazUi or `mazUi`', docs: ['composables/use-aos', 'plugins/aos'], symbols: ['useAos'] },
      { need: 'scroll position, direction or end, "back to top" or "to bottom" button, instead of `addEventListener("scroll")`', docs: ['composables/use-scroll', 'components/maz-btn-scroll'] },
      { need: 'lock the page scroll, instead of `body.style.overflow`', docs: ['composables/use-scroll-lock'] },
      { need: 'enlarge an image on click, browse a gallery in fullscreen, instead of `requestFullscreen`', docs: ['directives/zoom-img', 'directives/fullscreen-img'] },
      { need: 'a textarea that grows with its content, instead of `style.height = scrollHeight`: the `autogrow` prop', docs: ['components/maz-textarea', 'ecosystem/utils/textarea-autogrow'] },
      { need: 'expand and collapse a block with an animation', docs: ['components/maz-expand-animation', 'components/maz-accordion'] },
    ],
  },
  {
    title: 'Browser and environment',
    needs: [
      { need: 'read or write a cookie, instead of `document.cookie`', docs: ['ecosystem/utils/cookie'] },
      { need: 'run only in the browser or only on the server, instead of `typeof window`', docs: ['ecosystem/utils/is-client', 'ecosystem/utils/is-server'] },
      { need: 'detect iOS, or an app installed as a PWA, instead of `navigator.userAgent` or `display-mode: standalone`', docs: ['ecosystem/utils/is-ios', 'ecosystem/utils/is-standalone-mode'] },
      { need: 'stop iOS from zooming on a focused field, instead of `maximum-scale=1` (it blocks the zoom for everyone)', docs: ['ecosystem/utils/prevent-ios-input-zoom'], symbols: ['preventIosInputZoom'] },
      { need: 'the browser language or the visitor country, instead of `navigator.language` or an IP API', docs: ['ecosystem/utils/get-browser-locale', 'ecosystem/utils/fetch-locale-ip'] },
      { need: 'load a third-party script once (SDK), instead of `document.createElement("script")`', docs: ['ecosystem/utils/script-loader'] },
      { need: 'dark mode toggle, color mode, brand colors at runtime, instead of the `dark` class or `localStorage`', docs: ['ecosystem/themes'], symbols: ['useTheme'] },
      { need: 'the language of the texts of the components', docs: ['ecosystem/translations'], symbols: ['useTranslations'] },
    ],
  },
]

/** Docs left out of the catalog on purpose */
export const CATALOG_OMITTED: Record<string, string> = {
  ...Object.fromEntries(['deep-partial', 'deep-required', 'deep-key-of', 'flatten-object-keys', 'generic-instance-type', 'infer-maybe-ref'].map(name => [`ecosystem/utils/types/${name}`, 'TypeScript types, not logic to write by hand: found by `search_docs`'])),
  'ecosystem/utils/is-production': 'for the libraries: an app built by Vite reads `import.meta.env.PROD`',
  'composables/use-window': 'base of useWindowSize and useWindowFocus: `useEventListener` covers the need',
  'composables/use-sliding-indicator': 'found by `search_docs` (sliding indicator, active pill)',
  'composables/use-roving-focus': 'found by `search_docs` (roving tabindex, arrow keys navigation)',
  'composables/use-origin-transition': 'found by `search_docs` (grow from the button, open from the origin)',
  'ecosystem/utils/is-apple': 'found through useShortcut (`formatShortcut`, `matchesShortcut`)',
  'ecosystem/utils/debounce-callback': 'one timer shared by the whole app: `debounce` or `debounceId` fit better',
}
