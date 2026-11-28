This project is built with **maz-ui** and its ecosystem. Reuse what it provides instead of re-implementing it: most UI elements, helpers, icons and styles you need already exist.

### Look it up before you write it

- **MCP server `maz-ui`** (when available): `search_docs` (describe the need: "confirm before delete"), `get_component_api`, `find_icons`, `get_theme_tokens`, `get_doc`, `review_code`.
- **Version-matched docs** in `node_modules/maz-ui/agent-docs/` and `node_modules/@maz-ui/<package>/agent-docs/` (start with `node_modules/maz-ui/agent-docs/README.md`, which lists the other packages; in a monorepo, the packages of the app).

Never guess an API: only use documented props, events, slots and imports.

<!--@include: ../../../apps/docs/.vitepress/generated-docs/ecosystem-catalog.doc.md-->

### Which package for what

`maz-ui` (components, composables, directives, plugins), `@maz-ui/themes` (brand colors, fonts, dark mode), `@maz-ui/icons` (icons, logos, flags), `@maz-ui/utils` (helpers), `@maz-ui/translations` (texts of the components), `@maz-ui/nuxt` (Nuxt module).

### Components

- Use `Maz*` components instead of native elements or hand-made widgets: `MazBtn` (not `<button>`), `MazLink`, `MazInput`, `MazSelect`, `MazCheckbox`, `MazDialog`, `MazDrawer`, `MazPopover`, `MazDropdown`, `MazTabs`, `MazTable`, `MazCard`, `MazAvatar`, `MazBadge`, `MazAlert`, `MazDatePicker`, `MazInputPhoneNumber`, `MazDropzone`, `MazPagination`...
- Prop values are typed: colors are `primary | secondary | accent | info | success | warning | destructive | contrast | neutral | transparent` (plus `surface` and `container` on some components), sizes `mini | xs | sm | md | lg | xl`.
- A button with only an icon needs an `aria-label`.

### Feedback, overlays and forms

- `useToast()` for notifications, `useDialog()` or `MazDialogConfirm` for confirmations, `useWait()` for a loading state shared between components, `MazSkeleton` / `MazSpinner` while data loads.
- These composables work without plugin. Their global options go in the MazUi plugin: `app.use(MazUi, { theme, toast: { position: 'top-right' }, dialog: { acceptText: 'Yes' } })` (Nuxt: `mazUi: { toast: {...}, dialog: {...} }`). Outside of a component (store, router guard), `useToast` and `useDialog` need the MazUi plugin, `useWait` works anywhere.
- Animations on scroll: `aos: true` in the MazUi plugin with `import 'maz-ui/aos.css'` (Nuxt: `mazUi: { aos: true }`), then `useAos`. The directives are off by default with Nuxt (`mazUi.directives.vTooltip`, or import the directive).
- Forms: `useFormValidator` / `useFormField` with your Standard Schema library (Zod, Valibot, ArkType).

### Motion

- Reuse the motion of maz-ui instead of hand-written animations: `MazRollingText` (a number or a text that changes), `MazDrawnIcon` (a check that draws itself), `MazMorphIcon` (a two-state icon), `useOriginTransition` (a panel that opens from its button), `useSlidingIndicator` (an active pill), `<TransitionGroup name="maz-list">`, the `press`, `focus-ring` and `border-draw` utilities.
- Overlays: a `MazDialog` opens from its trigger (`#trigger` slot or `origin`, `useDialog().confirm({ origin: event })`), `MazDialogConfirm` takes a `confirmation` text to type for destructive actions, `toast.promise()` for an async action, `MazLightbox` (or `v-fullscreen-img`) to view images.
- Durations and easings from the theme (`var(--maz-motion-normal)`, `var(--maz-easing-out)`, `duration-(--duration-normal)`), only `transform` and `opacity`, `useReducedMotion().shouldReduceMotion` in JS animations.

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
- Colors: `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `destructive`, `contrast`, `neutral` (each with `-foreground` and `-50` to `-950`), `surface`, `foreground`, `muted`, `divider`, `overlay`, `bg-container`, `bg-input`. Example: `bg-surface text-foreground border-divider`. The page color is `surface`, not shadcn's `background` (`bg-background` does not exist).
- `secondary` is the second strong brand color, not a muted surface (unlike shadcn/ui): never make `primary` or `secondary` pale (3:1 minimum against `surface`, light and dark); discreet backgrounds use `surface`, `container`, `muted` or the `-50`/`-100` steps.
- Never the default Tailwind palette (`bg-blue-500`, `text-gray-600`, `bg-white`, `text-black`) nor hard-coded colors (`#fff`, `rgb()`, `bg-[#...]`). Theme colors already adapt to dark mode: no `dark:` color overrides.
- Radius `rounded-*`, shadows `shadow-sm` to `shadow-xl` and `shadow-elevation`, spacing scale (`p-4`, `gap-2`), utilities `flex-center`, `disabled-state`.
- Layout: `MazPageSection` (or the `padded-container` class) on each full-width band of a page (header, sections, footer) instead of `container mx-auto px-4`; breakpoints `mob-*`, `tab-*`, `lap-*` (`tab-m:grid-cols-2`), and the same names as container queries under an `@container` parent (`@tab-m:grid-cols-2`).
- Text: the type scale (`text-display`, `text-title-1` to `text-title-4`, `text-body-lg`, `text-body`, `text-body-sm`, `text-label`, `text-caption`, `text-overline`, `text-code`; `type-<level>` keeps the font size of the element) instead of ad hoc sizes (`text-2xl font-semibold`, `text-xs text-muted`, `text-[13px]`); `rich-text` on raw HTML (Markdown, CMS).
- One solid primary `MazBtn` per group of actions; the others `variant="outline"`, `variant="soft"` or a `MazLink`.
- **No `maz:` prefix** in this project: it is internal to the maz-ui library.
- In custom CSS, use the variables: `var(--maz-primary)`, `var(--maz-rounded-md)`, `calc(var(--maz-space) * 4)`.

### Theme

Brand colors, fonts, radius and spacing come from a `@maz-ui/themes` preset (`definePreset`), not from overrides scattered in CSS. Use `useTheme()` for dark mode and presets (`toggleDarkMode`, `setColorMode`, `updateTheme`), never toggle the `dark` class or store the mode yourself.

### Imports

- Deep imports: `maz-ui/components/MazBtn`, `maz-ui/composables/useToast`, `maz-ui/directives/vTooltip`, `maz-ui/plugins/toast`, `@maz-ui/utils/helpers/debounce`, `@maz-ui/icons/raw/MazTrash`. The `maz-ui` root entry only exports types. Never import from `maz-ui/src` or `maz-ui/dist`.
- With `@maz-ui/nuxt`, components and composables are auto-imported: do not import them. Icons are used by name (`icon="trash"`). The theme and the translations are set in the `mazUi` options of `nuxt.config`, not with the `MazUi` Vue plugin.

### Before you finish

Run `review_code` (MCP) on the files you changed, or `npx @maz-ui/mcp review <files>`, and fix every error and warning until none is left.
