---
name: "maz-ui"
description: "Build Vue and Nuxt UIs with the maz-ui ecosystem (components, composables, directives, @maz-ui/icons, @maz-ui/utils, @maz-ui/themes, Tailwind theme tokens) instead of re-implementing them. Use whenever you write or review Vue/Nuxt components, pages, forms, layouts, styles or helpers in a project that depends on maz-ui."
---

# maz-ui

This project is built with **maz-ui** and its ecosystem. Reuse what it provides instead of re-implementing it: most UI elements, helpers, icons and styles you need already exist.

### Look it up before you write it

- **MCP server `maz-ui`** (when available): `search_docs` (describe the need: "confirm before delete"), `get_component_api`, `find_icons`, `get_theme_tokens`, `get_doc`, `review_code`.
- **Version-matched docs** in `node_modules/maz-ui/docs/` (start with `README.md`; in a monorepo, the `maz-ui` of the app).

Never guess an API: only use documented props, events, slots and imports.

### Which package for what

`maz-ui` (components, composables, directives, plugins), `@maz-ui/themes` (brand colors, fonts, dark mode), `@maz-ui/icons` (icons, logos, flags), `@maz-ui/utils` (helpers), `@maz-ui/translations` (texts of the components), `@maz-ui/nuxt` (Nuxt module).

### Components

- Use `Maz*` components instead of native elements or hand-made widgets: `MazBtn` (not `<button>`), `MazLink`, `MazInput`, `MazSelect`, `MazCheckbox`, `MazDialog`, `MazDrawer`, `MazPopover`, `MazDropdown`, `MazTabs`, `MazTable`, `MazCard`, `MazAvatar`, `MazBadge`, `MazAlert`, `MazDatePicker`, `MazInputPhoneNumber`, `MazDropzone`, `MazPagination`...
- Prop values are typed: colors are `primary | secondary | accent | info | success | warning | destructive | contrast | transparent` (plus `surface` on some components), sizes `mini | xs | sm | md | lg | xl`.
- A button with only an icon needs an `aria-label`.

### Feedback, overlays and forms

- `useToast()` for notifications, `useDialog()` or `MazDialogConfirm` for confirmations, `useWait()` for loading states, `MazSkeleton` / `MazSpinner` while data loads.
- These composables need their plugin. Vue: `app.use(ToastPlugin)` from `maz-ui/plugins/toast` (`DialogPlugin`, `WaitPlugin`, `AosPlugin` likewise). Nuxt: `mazUi: { plugins: { toast: true } }`, off by default like the directives (`mazUi.directives.vTooltip`, or import the directive).
- Forms: `useFormValidator` / `useFormField` with your Standard Schema library (Zod, Valibot, ArkType).

### Icons

Use `@maz-ui/icons`, never inline SVG nor another icon library. Pick the format by usage:

- **Icon props** (`<MazBtn :start-icon>`, `<MazIcon :icon>`...): the raw SVG string, the lightest, `@maz-ui/icons/raw/MazTrash`.
- **Directly in a template**: the component, `@maz-ui/icons/static/MazTrash`, then `<MazTrash class="size-5 text-muted" />` (size and color from the text: `1em`, `currentColor`).
- **Not visible at first render** (`v-if`, menus, dialogs, tabs): the lazy component, `@maz-ui/icons/lazy/MazTrash`. Never for icons visible on load: each one is an extra request.
- `<img>` or CSS only for multicolor icons (flags, logos): `@maz-ui/icons/svg/<name>.svg`, the text color does not apply there.

### Helpers

Use `@maz-ui/utils/helpers/<name>` and the maz-ui composables instead of lodash, VueUse or hand-written code: `debounce`, `throttle`, `sleep`, `isEqual`, `formatCurrency`, `formatDate`, `formatNumber`, `formatPhoneNumber`, `capitalize`, `normalizeString`, `getCookie` / `setCookie`, `useBreakpoints`, `useWindowSize`, `useTimer`, `useIdleTimeout`, `useSwipe`, `vClickOutside`, `vTooltip`, `vLazyImg`...

### Texts and languages

The texts built in the components come from `@maz-ui/translations`: change the language with `useTranslations().setLocale('fr')` and customize the texts in its options, not in every component.

### Styling with Tailwind

The maz-ui theme is exposed to Tailwind (`@import 'maz-ui/tailwindcss/theme.css'`) and the project usually extends it. Only use theme tokens:

- **Project tokens first**: the Tailwind entry of the project adds its own `@theme` tokens, variants and utilities, and the `definePreset` file sets the brand values. `get_theme_tokens` lists both (or read these files). When a value is missing, add a token to the project `@theme` instead of an arbitrary value.
- Colors: `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `destructive`, `contrast` (each with `-foreground` and `-50` to `-950`), `surface`, `foreground`, `muted`, `divider`, `overlay`, `bg-container`, `bg-input`. Example: `bg-surface text-foreground border-divider`.
- Never the default Tailwind palette (`bg-blue-500`, `text-gray-600`, `bg-white`, `text-black`) nor hard-coded colors (`#fff`, `rgb()`, `bg-[#...]`). Theme colors already adapt to dark mode: no `dark:` color overrides.
- Radius `rounded-*`, shadows `shadow-sm` to `shadow-xl` and `shadow-elevation`, spacing scale (`p-4`, `gap-2`), breakpoints `mob-*`, `tab-*`, `lap-*` (plus `sm` to `2xl`), utilities `flex-center`, `padded-container`.
- **No `maz:` prefix** in this project: it is internal to the maz-ui library.
- In custom CSS, use the variables: `var(--maz-primary)`, `var(--maz-rounded-md)`, `calc(var(--maz-space) * 4)`.

### Theme

Brand colors, fonts, radius and spacing come from a `@maz-ui/themes` preset (`definePreset`), not from overrides scattered in CSS. Use `useTheme()` for dark mode and presets (`toggleDarkMode`, `setColorMode`, `updateTheme`), never toggle the `dark` class or store the mode yourself.

### Imports

- Deep imports: `maz-ui/components/MazBtn`, `maz-ui/composables/useToast`, `maz-ui/directives/vTooltip`, `maz-ui/plugins/toast`, `@maz-ui/utils/helpers/debounce`, `@maz-ui/icons/raw/MazTrash`. The `maz-ui` root entry only exports types. Never import from `maz-ui/src` or `maz-ui/dist`.
- With `@maz-ui/nuxt`, components and composables are auto-imported: do not import them. Icons are not: import them. The theme and the translations are set in the `mazUi` options of `nuxt.config`, not with the `MazUi` Vue plugin.

### Before you finish

Run `review_code` (MCP) on the files you changed, or `npx @maz-ui/mcp review <files>`, and fix every finding.

### Workflow

1. **Search by need**: `search_docs("<what you need>")`, e.g. "user avatar with initials", "confirm before delete", "phone number input", "debounce search". Pick the most specific result.
2. **Read the exact API** before writing a template: `get_component_api(["MazBtn", "MazDialog"])` (batch up to 10). Never invent a prop, event or slot.
3. **Icons**: `find_icons("delete")` returns the icon names and their imports.
4. **Styling**: `get_theme_tokens()` lists the theme of the project (its preset, `@theme` tokens, variants and utilities) and every Tailwind class of maz-ui (colors, radius, shadows, breakpoints, utilities). Use `get_doc("guide/tailwind")` to extend the theme.
5. **Write the code** with deep imports, or rely on the auto-imports of `@maz-ui/nuxt`.
6. **Review**: `review_code({ paths: ["src/components/MyForm.vue"] })` and fix every finding (unknown props, invalid values, native elements, default palette colors, `maz:` prefix, duplicated helpers).

Without the MCP server, read `node_modules/maz-ui/docs/README.md` (index of the docs of the installed version), then the relevant pages, `reference/tailwind-tokens.md` and `reference/icons.md`.
