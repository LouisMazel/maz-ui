This project is built with **maz-ui** and its ecosystem (`@maz-ui/themes`, `@maz-ui/icons`, `@maz-ui/utils`, `@maz-ui/translations`, `@maz-ui/nuxt`). Reuse what it provides instead of re-implementing it: most UI elements, helpers, icons and styles you need already exist.

### Look it up before you write it

Before creating a component, composable, helper, icon or style, check what maz-ui offers:

- **MCP server `maz-ui`** (when available): `search_docs` (describe the need: "confirm before delete", "phone input"), `get_component_api` (exact props, events, slots), `find_icons`, `get_theme_tokens` (Tailwind classes), `get_doc`, `review_code`.
- **Version-matched docs** in `node_modules/maz-ui/docs/` (start with `README.md`; in a monorepo, resolve `maz-ui` from the app package). Read the relevant page before using an API.

Never guess an API: only use props, events, slots and imports that are documented.

### Components

- Use `Maz*` components instead of native elements or hand-made widgets: `MazBtn` (not `<button>`), `MazInput`, `MazSelect`, `MazCheckbox`, `MazSwitch`, `MazTextarea`, `MazDialog`, `MazDialogConfirm`, `MazDrawer`, `MazBottomSheet`, `MazPopover`, `MazDropdown`, `MazTabs`, `MazTable`, `MazCard`, `MazAvatar`, `MazBadge`, `MazAlert`, `MazSkeleton`, `MazSpinner`, `MazDatePicker`, `MazInputPhoneNumber`, `MazDropzone`, `MazStepper`, `MazSidebar`, `MazPagination`...
- Prop values are typed: colors are `primary | secondary | accent | info | success | warning | destructive | contrast | transparent` (plus `surface` on some components), sizes `mini | xs | sm | md | lg | xl`.
- Feedback and overlays: `useToast()` for notifications, `useDialog()` or `MazDialogConfirm` for confirmations, `useWait()` for loading states.
- Forms: `useFormValidator` / `useFormField` with your Standard Schema library (Zod, Valibot, ArkType).

### Icons

Use `@maz-ui/icons` (860+ icons: `MazTrash`, `MazXMark`, `MazMagnifyingGlass`, `MazFlagFR`, `MazLogoVue`...). Never inline SVG or add another icon library. Pass icon components to icon props: `<MazBtn :start-icon="MazTrash">`.

### Helpers and composables

Use `@maz-ui/utils` and maz-ui composables instead of lodash, VueUse or hand-written code: `debounce`, `throttle`, `sleep`, `isEqual`, `capitalize`, `formatCurrency`, `formatDate`, `formatNumber`, `formatPhoneNumber`, `getCookie`/`setCookie`, `useBreakpoints`, `useWindowSize`, `useTimer`, `useIdleTimeout`, `useSwipe`, `vClickOutside`, `vTooltip`, `vLazyImg`...

### Styling with Tailwind

The maz-ui theme is exposed to Tailwind (`@import 'maz-ui/tailwindcss/theme.css'`). Only use its tokens:

- Colors: `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `destructive`, `contrast` (each with `-foreground` and `-50` to `-950`), `surface`, `foreground`, `muted`, `divider`, `overlay`, plus `bg-container` and `bg-input`. Example: `bg-surface text-foreground border-divider`, `bg-primary text-primary-foreground`, `text-muted`.
- Never use the default Tailwind palette (`bg-blue-500`, `text-gray-600`, `bg-white`, `text-black`) nor hard-coded colors (`#fff`, `rgb()`, `bg-[#...]`). Theme colors already adapt to dark mode: do not add `dark:` color overrides.
- Radius `rounded-*`, shadows `shadow-sm` to `shadow-xl` and `shadow-elevation`, spacing scale (`p-4`, `gap-2`), breakpoints `mob-*`, `tab-*`, `lap-*` (plus `sm` to `2xl`), utilities `flex-center`, `padded-container`.
- **No `maz:` prefix** in this project: it is internal to the maz-ui library and its documentation.
- In custom CSS, use the variables: `var(--maz-primary)`, `var(--maz-rounded-md)`, `calc(var(--maz-space) * 4)`.

### Theme

Brand colors, fonts, radius and spacing come from a `@maz-ui/themes` preset (`definePreset`), not from overrides scattered in CSS. Use `useTheme()` for dark mode and presets (`toggleDarkMode`, `setColorMode`, `updateTheme`), never toggle the `dark` class or store the mode yourself.

### Imports

- Deep imports: `maz-ui/components/MazBtn`, `maz-ui/composables/useToast`, `maz-ui/directives/vTooltip`, `@maz-ui/utils/helpers/debounce`, `@maz-ui/icons/static/MazTrash`. The `maz-ui` root entry only exports types. Never import from `maz-ui/src` or `maz-ui/dist`.
- With `@maz-ui/nuxt`, components and composables are auto-imported: do not import them.

### Before you finish

Run `review_code` (MCP) on the files you changed, or `npx @maz-ui/mcp review <files>`, and fix every finding.
