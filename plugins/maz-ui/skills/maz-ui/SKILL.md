---
name: "maz-ui"
description: "Build Vue and Nuxt UIs with the maz-ui ecosystem (components, composables, directives, @maz-ui/icons, @maz-ui/utils, @maz-ui/themes, Tailwind theme tokens) instead of re-implementing them. Use whenever you write or review Vue/Nuxt components, pages, forms, layouts, styles or helpers in a project that depends on maz-ui."
---

# maz-ui

This project is built with **maz-ui** and its ecosystem. Reuse what it provides instead of re-implementing it: most UI elements, helpers, icons and styles you need already exist.

### Look it up before you write it

- **MCP server `maz-ui`** (when available): `search_docs` (describe the need: "confirm before delete"), `get_component_api`, `find_icons`, `get_theme_tokens`, `get_doc`, `review_code`.
- **Version-matched docs** in `node_modules/maz-ui/agent-docs/` and `node_modules/@maz-ui/<package>/agent-docs/` (start with `node_modules/maz-ui/agent-docs/README.md`, which lists the other packages; in a monorepo, the packages of the app).

Never guess an API: only use documented props, events, slots and imports.

### The ecosystem by need

Before writing logic by hand (a state shared between components, a timer, an event listener, an observer, a formatter, a browser API), look for the need below: these tools already exist. Read their API with `get_doc` or `search_docs` (or their page in `agent-docs`) before using them, and `search_docs` the needs that are not listed. `useToast`, `useDialog` and `useWait` work without plugin: their global options (and `aos`) go in the MazUi plugin (`app.use(MazUi, { toast, dialog, aos })`, `mazUi` with Nuxt).

**State, feedback and async**

- a loading or busy state shared by several components (or a module): spinner, disabled buttons, fullscreen loader: `useWait` (`maz-ui/composables/useWait`)
- a message after an action (saved, failed, undo), instead of an `alert()` or a hand-made banner: `useToast` (`maz-ui/composables/useToast`)
- ask a confirmation or a choice from the code (`await` the answer), instead of `confirm()` or a dialog wired by hand: `useDialog` (`maz-ui/composables/useDialog`)
- copy a text with a "Copied!" state, a copy button for an ID or a command, instead of `navigator.clipboard.writeText`: `MazBtnClipboard` (`maz-ui/components/MazBtnClipboard`), `useClipboard` (`maz-ui/composables/useClipboard`)
- validate a form with a Zod, Valibot or ArkType schema (errors per field, on blur or submit): `useFormValidator` (`maz-ui/composables/useFormValidator`)
- keep the initial values of a form (a copy that no longer follows the source): `useFreezeValue` (`maz-ui/composables/useFreezeValue`)
- know if two objects, arrays or dates are equal (unsaved changes), instead of `JSON.stringify(a) === JSON.stringify(b)`: `isEqual` (`@maz-ui/utils/helpers/isEqual`)
- a readable message from a caught error, instead of `error instanceof Error ? error.message : String(error)`: `getErrorMessage` (`@maz-ui/utils/helpers/getErrorMessage`)
- wait until a value exists or matches (poll a getter with a timeout), instead of `setInterval` with a count of attempts: `checkAvailability` (`@maz-ui/utils/helpers/checkAvailability`)
- pause an async function, instead of `new Promise(resolve => setTimeout(resolve, ms))`: `sleep` (`@maz-ui/utils/helpers/sleep`)
- remove the falsy values of an array with the type narrowed, instead of `.filter(Boolean)`: `truthyFilter` (`@maz-ui/utils/helpers/truthyFilter`)
- a required `inject()`, instead of `inject()` + `throw`: `useInjectStrict` (`maz-ui/composables/useInjectStrict`)
- a unique and SSR safe id per component instance (label `for`, `aria-describedby`), instead of `Math.random().toString(36)`: `useInstanceUniqId` (`maz-ui/composables/useInstanceUniqId`)
- render a component from a function (a popup opened by code), instead of `createApp` or `render(h())`: `useMountComponent` (`maz-ui/composables/useMountComponent`)

**Timers and events**

- wait after the last keystroke, or reset a state after a delay, instead of `clearTimeout` + `setTimeout`: `debounce` (`@maz-ui/utils/helpers/debounce`)
- a search field that waits for the user to stop typing: the `debounce` prop: `MazInput` (`maz-ui/components/MazInput`)
- only the last call of an async function per id resolves (one request per row): `debounceId` (`@maz-ui/utils/helpers/debounceId`)
- run at most every N ms (scroll, resize, mousemove handlers), instead of a `Date.now() - last` check: `throttle`, `throttleId` (`@maz-ui/utils/helpers/<name>`)
- a countdown or a timeout with pause and resume, instead of `setInterval`: `useTimer` (`maz-ui/composables/useTimer`)
- the user is inactive (auto logout, pause polling), instead of listeners on `mousemove` and `keydown`: `useIdleTimeout` (`maz-ui/composables/useIdleTimeout`), `IdleTimeout` (`@maz-ui/utils/helpers/idleTimeout`)
- the tab is hidden or visible again (pause, refresh on return), instead of `visibilitychange`: `useUserVisibility` (`maz-ui/composables/useUserVisibility`), `UserVisibility` (`@maz-ui/utils/helpers/userVisibility`)
- a click outside of an element (close a menu), instead of a `document` listener and `contains(event.target)`: `vClickOutside` (`maz-ui/directives/vClickOutside`)
- the screen size or the breakpoint in the script, instead of `resize` or `matchMedia("(max-width...")`: `useBreakpoints`, `useWindowSize` (`maz-ui/composables/<name>`)
- an event listener, a media query, the window focus, a Cmd/Ctrl shortcut, instead of `addEventListener`, `matchMedia`, `metaKey`: `useEventListener`, `useMediaQuery`, `useWindowFocus`, `useShortcut` (`maz-ui/composables/<name>`), `formatShortcut` (`@maz-ui/utils/helpers/shortcut`)
- the changes or the size of a DOM element, instead of `new MutationObserver` or `new ResizeObserver`: `useMutationObserver`, `useResizeObserver` (`maz-ui/composables/<name>`)

**Formatting and text**

- an amount of money, instead of `Intl.NumberFormat` with `currency`: `formatCurrency` (`@maz-ui/utils/helpers/formatCurrency`)
- an input of an amount of money: `MazInputPrice` (`maz-ui/components/MazInputPrice`)
- a date or a time, instead of `toLocaleDateString` or `Intl.DateTimeFormat`: `formatDate` (`@maz-ui/utils/helpers/formatDate`)
- time ago ("3 minutes ago") that refreshes by itself, instead of `Intl.RelativeTimeFormat` and a timer; a duration ("3 min 05 s"): `useRelativeTime` (`maz-ui/composables/useRelativeTime`), `formatRelativeTime`, `formatDuration` (`@maz-ui/utils/helpers/<name>`)
- a number, a percentage, a compact number (1.2K), instead of `Intl.NumberFormat`: `formatNumber` (`@maz-ui/utils/helpers/formatNumber`)
- a phone number in its international format, instead of `libphonenumber-js`: `formatPhoneNumber` (`@maz-ui/utils/helpers/formatPhoneNumber`)
- the name of a country or a language in any locale, instead of `Intl.DisplayNames`: `useDisplayNames` (`maz-ui/composables/useDisplayNames`)
- a country flag (emoji or image URL), instead of code points (`127397 +`) or a `flagcdn.com` URL: `countryCodeToUnicodeFlag`, `getCountryFlagUrl` (`@maz-ui/utils/helpers/<name>`)
- the reading time of a text, instead of `split(/\s+/).length / 200`: `useReadingTime` (`maz-ui/composables/useReadingTime`)
- change the case of a string (camelCase, kebab-case, snake_case...), instead of `charAt(0).toUpperCase()` or a regex: `camelCase`, `kebabCase`, `snakeCase`, `pascalCase`, `capitalize`, `upperFirst` (`@maz-ui/utils/helpers/<name>`)
- remove accents, compare without case nor accents, make a slug, instead of `normalize("NFD")` + a regex: `normalizeString` (`@maz-ui/utils/helpers/normalizeString`)
- pretty print JSON, instead of `JSON.stringify(value, null, 2)`: `formatJson` (`@maz-ui/utils/helpers/formatJson`)
- filter a list by a typed query (typos, accents, words in any order, highlight), instead of `includes()` on lowercased strings: `useFuzzySearch` (`maz-ui/composables/useFuzzySearch`), `highlightMatches` (`@maz-ui/utils/helpers/fuzzySearch`)
- a diff of two texts; a growing log: `MazCodeHighlight`, `MazLogStream` (`maz-ui/components/<name>`), `diffLines` (`@maz-ui/utils/helpers/diffLines`)
- a select or a list with a search field: the `search` prop: `MazSelect`, `MazChecklist` (`maz-ui/components/<name>`)
- how close two strings are ("did you mean"): `useStringMatching` (`maz-ui/composables/useStringMatching`)
- a long text cut with "Read more": `MazReadMore` (`maz-ui/components/MazReadMore`)

**Gestures, files and images**

- drop files on an area, instead of `drop` and `dragover` listeners: `MazDropzone` (`maz-ui/components/MazDropzone`), `useDropzone` (`maz-ui/composables/useDropzone`)
- a swipe on an element (carousel, dismiss), instead of `touchstart` and `touchend` listeners: `useSwipe` (`maz-ui/composables/useSwipe`), `Swipe` (`@maz-ui/utils/helpers/swipeHandler`)
- follow a pointer drag live (sheet, slider, reorder), instead of `pointerdown` and `pointermove` listeners: `useDrag` (`maz-ui/composables/useDrag`)
- pull to refresh: `MazPullToRefresh` (`maz-ui/components/MazPullToRefresh`), `usePullToRefresh` (`maz-ui/composables/usePullToRefresh`)
- a tooltip on hover: `vTooltip` (`maz-ui/directives/vTooltip`)
- an element enters the viewport (infinite scroll, lazy images, animations), instead of `new IntersectionObserver`: `useIntersectionObserver`, `useInfiniteScroll` (`maz-ui/composables/<name>`), `vIntersect`, `vLazyImg` (`maz-ui/directives/<name>`), `MazLazyImg`, `MazAnimatedElement` (`maz-ui/components/<name>`)
- animate elements when they appear on scroll (fade, zoom, slide), with `aos: true` in MazUi or `mazUi`: `useAos` (`maz-ui/composables/useAos`)
- scroll position, direction or end, "back to top" or "to bottom" button, instead of `addEventListener("scroll")`: `useScroll` (`maz-ui/composables/useScroll`), `MazBtnScroll` (`maz-ui/components/MazBtnScroll`)
- lock the page scroll, instead of `body.style.overflow`: `useScrollLock` (`maz-ui/composables/useScrollLock`)
- enlarge an image on click, browse a gallery in fullscreen, instead of `requestFullscreen`: `vZoomImg`, `vFullscreenImg` (`maz-ui/directives/<name>`)
- a textarea that grows with its content, instead of `style.height = scrollHeight`: the `autogrow` prop: `MazTextarea` (`maz-ui/components/MazTextarea`), `TextareaAutogrow` (`@maz-ui/utils/helpers/TextareaAutogrow`)
- expand and collapse a block with an animation: `MazExpandAnimation`, `MazAccordion` (`maz-ui/components/<name>`)

**Browser and environment**

- read or write a cookie, instead of `document.cookie`: `getCookie`, `setCookie`, `deleteCookie` (`@maz-ui/utils/helpers/cookie`)
- run only in the browser or only on the server, instead of `typeof window`: `isClient`, `isServer` (`@maz-ui/utils/helpers/<name>`)
- detect iOS, or an app installed as a PWA, instead of `navigator.userAgent` or `display-mode: standalone`: `isIos`, `isStandaloneMode` (`@maz-ui/utils/helpers/<name>`)
- stop iOS from zooming on a focused field, instead of `maximum-scale=1` (it blocks the zoom for everyone): `preventIosInputZoom` (`@maz-ui/utils/helpers/preventIosInputZoom`)
- the browser language or the visitor country, instead of `navigator.language` or an IP API: `getBrowserLocale`, `fetchLocaleIp` (`@maz-ui/utils/helpers/<name>`)
- load a third-party script once (SDK), instead of `document.createElement("script")`: `ScriptLoader` (`@maz-ui/utils/helpers/scriptLoader`)
- dark mode toggle, color mode, brand colors at runtime, instead of the `dark` class or `localStorage`: `useTheme` (`@maz-ui/themes`)
- the language of the texts of the components: `useTranslations` (`@maz-ui/translations`)

### Which package for what

`maz-ui` (components, composables, directives, plugins), `@maz-ui/themes` (brand colors, fonts, dark mode), `@maz-ui/icons` (icons, logos, flags), `@maz-ui/utils` (helpers), `@maz-ui/translations` (texts of the components), `@maz-ui/nuxt` (Nuxt module).

### Components

- Use `Maz*` components instead of native elements or hand-made widgets: `MazBtn` (not `<button>`), `MazLink`, `MazInput`, `MazSelect`, `MazCheckbox`, `MazDialog`, `MazDrawer`, `MazPopover`, `MazDropdown`, `MazTabs`, `MazTable`, `MazCard`, `MazAvatar`, `MazBadge`, `MazAlert`, `MazDatePicker`, `MazInputPhoneNumber`, `MazDropzone`, `MazPagination`...
- Prop values are typed: colors are `primary | secondary | accent | info | success | warning | destructive | contrast | transparent` (plus `surface` on some components), sizes `mini | xs | sm | md | lg | xl`.
- A button with only an icon needs an `aria-label`.

### Feedback, overlays and forms

- `useToast()` for notifications, `useDialog()` or `MazDialogConfirm` for confirmations, `useWait()` for a loading state shared between components, `MazSkeleton` / `MazSpinner` while data loads.
- These composables work without plugin. Their global options go in the MazUi plugin: `app.use(MazUi, { theme, toast: { position: 'top-right' }, dialog: { acceptText: 'Yes' } })` (Nuxt: `mazUi: { toast: {...}, dialog: {...} }`). Outside of a component (store, router guard), `useToast` and `useDialog` need the MazUi plugin, `useWait` works anywhere.
- Animations on scroll: `aos: true` in the MazUi plugin with `import 'maz-ui/aos.css'` (Nuxt: `mazUi: { aos: true }`), then `useAos`. The directives are off by default with Nuxt (`mazUi.directives.vTooltip`, or import the directive).
- Forms: `useFormValidator` / `useFormField` with your Standard Schema library (Zod, Valibot, ArkType).

### Icons

Use `@maz-ui/icons`, never inline SVG nor another icon library. Pick the format by usage:

- **Icon props** (`<MazBtn start-icon>`, `<MazIcon icon>`, `<MazSvg icon>`...): the name, `start-icon="trash"`, when the project has `MazUi()` of `@maz-ui/vite-plugin` in its Vite config, or `@maz-ui/nuxt`: no import, only the icons used are bundled. The SVG of its icons folder are names too (`src/icons/hero.svg` is `hero`); a name built at runtime (`` `flag-${code}` ``) goes in the `safelist` of the plugin. Without the plugin, the raw SVG string, the lightest, `@maz-ui/icons/raw/MazTrash`. A raw icon is a string: used as a tag (`<MazTrash />`) it renders nothing, without error.
- **Directly in a template**: the component, `@maz-ui/icons/static/MazTrash`, then `<MazTrash class="size-5 text-muted" />` (size and color from the text: `1em`, `currentColor`).
- **Not visible at first render** (`v-if`, menus, dialogs, tabs): the lazy component, `@maz-ui/icons/lazy/MazTrash`. Never for icons visible on load: each one is an extra request.
- **Illustrations, logos, flags** at their own size and colors: `<MazSvg icon="flag-fr" width="32" />`. `<img>` or CSS only for multicolor icons, the text color does not apply there: the files are `@maz-ui/icons/svg/star.svg`, `@maz-ui/icons/flags/3x2/FR.svg` (`flags/1x1` for the square ones) and `@maz-ui/icons/logos/vue.svg`.

### Texts and languages

The texts built in the components come from `@maz-ui/translations`: change the language with `useTranslations().setLocale('fr')` and customize the texts in its options, not in every component.

### Styling with Tailwind

The maz-ui theme is exposed to Tailwind (`@import 'maz-ui/tailwindcss/theme.css'`) and the project usually extends it. Only use theme tokens:

- **Project tokens first**: the Tailwind entry of the project adds its own `@theme` tokens, variants and utilities, and the `definePreset` file sets the brand values. `get_theme_tokens` lists both (or read these files). When a value is missing, add a token to the project `@theme` instead of an arbitrary value.
- Colors: `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `destructive`, `contrast` (each with `-foreground` and `-50` to `-950`), `surface`, `foreground`, `muted`, `divider`, `overlay`, `bg-container`, `bg-input`. Example: `bg-surface text-foreground border-divider`. The page color is `surface`, not shadcn's `background` (`bg-background` does not exist).
- `secondary` is the second strong brand color, not a muted surface (unlike shadcn/ui): never make `primary` or `secondary` pale (3:1 minimum against `surface`, light and dark); discreet backgrounds use `surface`, `container`, `muted` or the `-50`/`-100` steps.
- Never the default Tailwind palette (`bg-blue-500`, `text-gray-600`, `bg-white`, `text-black`) nor hard-coded colors (`#fff`, `rgb()`, `bg-[#...]`). Theme colors already adapt to dark mode: no `dark:` color overrides.
- Radius `rounded-*`, shadows `shadow-sm` to `shadow-xl` and `shadow-elevation`, spacing scale (`p-4`, `gap-2`), utilities `flex-center`, `disabled-state`.
- Layout: `MazPageSection` (or the `padded-container` class) on each full-width band of a page (header, sections, footer) instead of `container mx-auto px-4`; breakpoints `mob-*`, `tab-*`, `lap-*` (`tab-m:grid-cols-2`), and the same names as container queries under an `@container` parent (`@tab-m:grid-cols-2`).
- Text: the type scale (`text-display`, `text-title-1` to `text-title-4`, `text-body-lg`, `text-body`, `text-body-sm`, `text-label`, `text-caption`, `text-overline`, `text-code`; `type-<level>` keeps the font size of the element) instead of ad hoc sizes (`text-2xl font-semibold`, `text-xs text-muted`, `text-[13px]`); `rich-text` on raw HTML (Markdown, CMS).
- One solid primary `MazBtn` per group of actions; the others `outlined`, `pastel` or a `MazLink`.
- **No `maz:` prefix** in this project: it is internal to the maz-ui library.
- In custom CSS, use the variables: `var(--maz-primary)`, `var(--maz-rounded-md)`, `calc(var(--maz-space) * 4)`.

### Theme

Brand colors, fonts, radius and spacing come from a `@maz-ui/themes` preset (`definePreset`), not from overrides scattered in CSS. Use `useTheme()` for dark mode and presets (`toggleDarkMode`, `setColorMode`, `updateTheme`), never toggle the `dark` class or store the mode yourself.

### Imports

- Deep imports: `maz-ui/components/MazBtn`, `maz-ui/composables/useToast`, `maz-ui/directives/vTooltip`, `maz-ui/plugins/toast`, `@maz-ui/utils/helpers/debounce`, `@maz-ui/icons/raw/MazTrash`. The `maz-ui` root entry only exports types. Never import from `maz-ui/src` or `maz-ui/dist`.
- With `@maz-ui/nuxt`, components and composables are auto-imported: do not import them. Icons are used by name (`icon="trash"`). The theme and the translations are set in the `mazUi` options of `nuxt.config`, not with the `MazUi` Vue plugin.

### Before you finish

Run `review_code` (MCP) on the files you changed, or `npx @maz-ui/mcp review <files>`, and fix every error and warning until none is left.

### Workflow

0. **Know the project**: `get_project_info()` gives the installed versions, the plugins and options already set up, whether components and icons resolve by name, the theme presets and the components and tools the code already uses.
1. **Search by need**: `search_docs("<what you need>")`, e.g. "user avatar with initials", "confirm before delete", "phone number input", "debounce search". Pick the most specific result.
2. **Read the exact API** before writing a template: `get_component_api(["MazBtn", "MazDialog"])` (batch up to 10). Never invent a prop, event or slot.
3. **Icons**: `find_icons("delete")` returns the icon names and their imports.
4. **Styling**: `get_theme_tokens()` lists the theme of the project (its preset, `@theme` tokens, variants and utilities) its effective colors, and every Tailwind class of maz-ui (colors, radius, shadows, breakpoints, container queries, layout, type scale, utilities). Use `get_doc("guide/tailwind")` to extend the theme.
5. **Write the code** with deep imports, or rely on the auto-imports of `@maz-ui/nuxt`.
6. **Review**: `review_code({ paths: ["src/components/MyForm.vue"] })` and fix every finding (unknown props, invalid values, native elements, default palette colors, `maz:` prefix, duplicated helpers).

Without the MCP server, read `node_modules/maz-ui/agent-docs/README.md` (index of the docs of the installed version, and of the other packages of the ecosystem), then the relevant pages, `reference/tailwind-tokens.md` and `node_modules/@maz-ui/icons/agent-docs/reference/icons.md`.
