# Reddit Post: r/vuejs (primary), adapt for r/nuxtjs, r/webdev

---

**Title:** I've been building a Vue 3 component library for years — 62 components, a theme engine with design tokens, and an MCP server so AI agents stop hallucinating my API. Here's maz-ui.

---

Hey everyone,

I've been building Vue apps professionally for years, and every single project has the same needs: a phone input that actually validates internationally, a date picker that handles ranges and timezones, form validation that doesn't fight you, toast notifications, confirmation dialogs, dark mode... You know the drill.

So I built **maz-ui** — a component library I've been maintaining and using in production for years. **5,000+ commits**, 62 components, composables, directives, plugins, a theming engine, a Nuxt module, and — as of recently — an MCP server so AI coding agents can use it without making up props that don't exist.

It's still largely unknown, so I figured it was time to show it properly. Here's the stuff I think is worth your time.

---

## First things first: setup

maz-ui requires a one-time initialization to set up theming and translations. Two options:

**Option A — Vue plugin (global):**

```ts
import { mazUi as mazUiPreset } from '@maz-ui/themes/presets/mazUi'
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { createApp } from 'vue'
import 'maz-ui/styles'

const app = createApp(App)

app.use(MazUi, {
  theme: { preset: mazUiPreset },
  translations: { locale: 'en' },
})
```

**Option B — component provider (scoped):**

```vue
<template>
  <MazUiProvider :theme="{ preset: mazUi }" :translations="{ locale: 'en' }">
    <App />
  </MazUiProvider>
</template>
```

After that, every component you import just works — dark mode, theming, i18n. You only import what you use, so your bundle stays lean. Every component is individually importable with zero side effects.

---

## The things I'm most proud of

### 1. International phone input that actually works

If you've ever tried building a phone number input with real validation, country detection, and a searchable selector... you know the pain. `MazInputPhoneNumber` wraps Google's `libphonenumber-js` and handles everything:

```vue
<template>
  <MazInputPhoneNumber
    v-model="phoneNumber"
    v-model:country-code="countryCode"
    :preferred-countries="['US', 'FR', 'GB', 'DE']"
    @data="onData"
  />
</template>
```

What you get from the `@data` event:

```ts
const data = {
  isValid: true,
  isPossible: true,
  e164: '+33612345678', // For your API
  formatInternational: '+33 6 12 34 56 78',
  formatNational: '06 12 34 56 78',
  type: 'MOBILE', // or FIXED_LINE, etc.
  countryCallingCode: '33',
}
```

It auto-detects the country from the number, auto-formats as you type, can detect the user's country from browser locale or IP geolocation, supports search in the country selector — and it works server-side. No `<ClientOnly>` hack needed.

> **[SCREENSHOT: MazInputPhoneNumber with country dropdown open — light and dark mode side by side]**

### 2. Form validation with Valibot — and it doesn't block the UI

The `useFormValidator` composable integrates with Valibot schemas. You define your schema, and everything is typed end-to-end — model, errors, field states, submit handler output:

```vue
<script setup lang="ts">
import { useFormValidator } from 'maz-ui/composables'
import { email, minLength, nonEmpty, pipe, string } from 'valibot'

const { model, errorMessages, fieldsStates, handleSubmit } = useFormValidator({
  schema: {
    email: pipe(string(), nonEmpty('Required'), email('Invalid email')),
    password: pipe(string(), nonEmpty('Required'), minLength(8, 'Min 8 chars')),
  },
  options: {
    mode: 'eager',
    scrollToError: '.has-field-error', // auto-scrolls to first error on submit
  },
})
</script>

<template>
  <form @submit="handleSubmit((data) => login(data))">
    <MazInput
      v-model="model.email"
      label="Email"
      :hint="errorMessages.email"
      :error="!!errorMessages.email"
      :success="fieldsStates.email.valid"
    />
    <MazInput
      v-model="model.password"
      label="Password"
      type="password"
      :hint="errorMessages.password"
      :error="!!errorMessages.password"
      :success="fieldsStates.password.valid"
    />
    <MazBtn type="submit">
      Login
    </MazBtn>
  </form>
</template>
```

What makes this different from other form validation solutions:

- **5 validation modes** — `lazy`, `aggressive`, `blur`, `eager`, `progressive` — pick the UX that fits your form
- **Per-field debounce/throttle** — rate-limit expensive validations (like async username checks) independently per field
- **`requestIdleCallback` internally** — validations run when the browser is idle, so they never block typing or scrolling
- **Auto-scroll to first error** on submit
- **Full type inference from Valibot schema** — zero manual type definitions needed

### 3. Programmatic dialogs

Instead of wiring up a `v-model` for every confirmation dialog:

```ts
import { useDialog } from 'maz-ui/composables'

const dialog = useDialog()

dialog.open({
  title: 'Delete this item?',
  message: 'This action cannot be undone.',
  onAccept: () => deleteItem(),
  onReject: () => console.log('Cancelled'),
})
```

No template. No `<MazDialog v-model="isOpen">`. Just call `.open()` and handle the result. Same idea with `useToast()` — call `toast.success('Done!')` from anywhere, no component needed.

### 4. A theming engine with real design tokens

maz-ui ships with **4 built-in theme presets** (Maz-UI, Pristine, Ocean, Obsidian) and a full design token system based on HSL CSS variables. Every component automatically adapts.

Create your own theme by extending an existing preset:

```ts
import { definePreset } from '@maz-ui/themes'
import { mazUi } from '@maz-ui/themes/presets/mazUi'

const myTheme = definePreset({
  base: mazUi,
  overrides: {
    colors: {
      light: { primary: '220 90% 50%' }, // HSL values
      dark: { primary: '220 80% 60%' },
    },
    foundation: {
      'radius': '1rem',
      'font-family': '"Inter", sans-serif',
    },
  },
})
```

Under the hood, it uses a **CSS `@layer` system** (`maz-ui-reset`, `maz-ui-theme`, `maz-ui-animations`, `maz-ui-utilities`) so maz-ui styles never conflict with your own CSS. The theme supports a **hybrid strategy** — critical CSS is injected inline (~500 bytes), full theme CSS loads async — so it's optimized for Core Web Vitals out of the box.

Dark mode works via `prefers-color-scheme` or class-based toggling. The composable gives you `toggleDarkMode()`, `setColorMode()`, and a reactive `isDark` ref. Your preference is persisted to a cookie automatically.

> **[SCREENSHOT: Dashboard demo — dark mode with the default Maz-UI theme]**
> Use: `apps/docs/src/public/img/demo/dashboard-dark.png`

> **[SCREENSHOT: Same dashboard — light mode with the Ocean theme preset]**
> Use: `apps/docs/src/public/img/demo/dashboard-light.png`

---

## The full ecosystem

| Package                | What it does                                                   |
| ---------------------- | -------------------------------------------------------------- |
| `maz-ui`               | 62 components, 22 composables, 6 directives, 6 plugins         |
| `@maz-ui/nuxt`         | Nuxt 3 module — auto-imports, zero-config SSR, theme injection |
| `@maz-ui/themes`       | Theme engine with 4 presets, design tokens, CSS generation     |
| `@maz-ui/icons`        | 860+ SVG icons with lazy/static loading                        |
| `@maz-ui/translations` | i18n for all components (9 locales)                            |
| `@maz-ui/mcp`          | MCP server — AI agents can read the docs natively              |

### Nuxt module: 3 lines, everything works

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    theme: { preset: 'maz-ui', colorMode: 'auto' },
    plugins: { toast: true, dialog: true, aos: true },
    directives: { vTooltip: true },
  },
})
```

Every component, composable, and directive is auto-imported. Theme CSS is injected server-side to prevent FOUC. SSR works out of the box — no hydration mismatches, no `<ClientOnly>`. It even integrates with Nuxt DevTools.

### MCP server: AI agents that actually know your UI library

This is the one that gets the most "wait, what?" reactions. `@maz-ui/mcp` is a [Model Context Protocol](https://modelcontextprotocol.io/) server that exposes the entire maz-ui documentation to AI coding agents.

It's not a simple dump of markdown files. The MCP server provides **3 specialized tools**:

- **`search`** — Search across ALL Maz-UI documentation using a powerful unified search engine. Returns ranked results with contextual snippets.
- **`get_doc`** — Get the complete documentation for a specific item.
- **`list`** — Browse all available Maz-UI documentation grouped by category.

That means when you use Claude, Cursor, or any MCP-compatible tool, it can look up the correct props, events, slots, and usage patterns **from the actual docs** — instead of hallucinating an API that doesn't exist.

If you're building with AI in 2026, this is the kind of integration that makes the difference between "close but wrong" and "actually works on the first try."

---

## Component highlights (the ones you'll actually use)

Beyond what I already showed:

- **MazDatePicker** — range mode with double calendar view, time picker, keyboard navigation, configurable shortcuts ("Last 7 days", "This month"...), min/max constraints, timezone-aware
- **MazSelect** — full TypeScript generics (`MazSelect<User>` gives you type-safe `v-model`), searchable with fuzzy matching, multi-select, option groups
- **MazTable** — sortable, searchable, built-in pagination (configurable rows per page), row selection with checkboxes, server-side mode, loading bar overlay
- **MazDropzone** — drag & drop with concurrency control (max parallel uploads), file validation (size, type, duplicates), smart file type icons for 60+ formats
- **MazCardSpotlight** — that cursor-following spotlight effect, optimized with `requestAnimationFrame` and `IntersectionObserver` (disabled when off-screen)
- **MazInputCode** — OTP/verification code input with auto-focus between segments
- **MazPullToRefresh** — native-feeling pull-to-refresh with PWA detection
- **MazStepper** — multi-step form wizard

And useful directives: `v-tooltip` (HTML support, auto-positioning), `v-zoom-img`, `v-fullscreen-img`, `v-lazy-img`, `v-click-outside`.

> **[SCREENSHOT: Product page demo — showing cards, buttons, badges in a real layout]**
> Use: `apps/docs/src/public/img/demo/product-page-dark.png`

> **[SCREENSHOT: Auth page demo — clean login form with MazInput components]**
> Use: `apps/docs/src/public/img/demo/auth-page-light.png`

---

## The honest stuff

- **100% TypeScript** with strict mode. Every prop, every emit, every composable return type is typed. Generic components where it matters.
- **TailwindCSS under the hood**, but your project doesn't need Tailwind — components work without it. If you do use Tailwind, there's a `defineMazTailwindConfig` helper that bridges the design tokens.
- **159+ unit tests** with Vitest. Not perfect coverage, but the critical paths are tested.
- **MIT licensed.**
- **Solo maintainer.** 5,000+ commits over the years. I use this in production on multiple projects. It's not going anywhere, but I'd love contributors.
- **Not trying to be Vuetify.** maz-ui is opinionated toward simplicity and a clean developer experience. No massive global install, no configuration ceremony.
- **v4.7.5** — actively maintained, last release was days ago.

---

## Links

- **Docs:** [maz-ui.com](https://maz-ui.com)
- **GitHub:** [github.com/LouisMazel/maz-ui](https://github.com/LouisMazel/maz-ui)
- **npm:** `npm install maz-ui`

I'd love to hear what you think. If you've been looking for a Vue component library that's not massive but still covers real-world needs, give it a try. And if you have ideas for components or improvements — issues and PRs are very welcome.

---

## Adaptation notes for other subreddits

### r/nuxtjs

- **Title:** "I built a Nuxt 3 module with 62 auto-imported components, a theme engine, and an MCP server for AI agents — here's @maz-ui/nuxt"
- Lead with the `nuxt.config.ts` setup (3 lines to get everything)
- Emphasize: zero-config SSR, auto-imports, no FOUC, no `<ClientOnly>`, theme injection at server level, Nuxt DevTools integration
- Drop the Vue plugin setup section entirely
- Mention Nuxt 4 compatibility

### r/webdev

- **Post on Showoff Saturday** (check subreddit rules)
- **Title:** "I've been building a Vue/Nuxt component library for years — 62 components, a theme engine, and an MCP server so AI agents can use it correctly"
- Lead with the MCP angle (webdev loves AI tooling discourse)
- Keep it shorter — 2 code examples max (phone input + Nuxt setup)
- Mention the CSS `@layer` system and Core Web Vitals optimization

### r/javascript

- **Title:** "After years of building Vue apps, I open-sourced the component library I use on every project — now with an MCP server for AI agents"
- Emphasize TypeScript-first, tree-shaking, and the MCP angle
- Focus on engineering decisions: HSL-based theme tokens, requestIdleCallback in validation, CSS @layer system, fuzzy search in MCP
- Keep Vue-specific details minimal

### r/opensource

- **Title:** "5,000+ commits solo-maintaining a Vue 3 component library — 62 components, a theme engine, and an MCP server. Looking for contributors."
- Lead with the open-source journey and what you learned
- Mention: TypeScript strict mode, 159+ unit tests, monorepo with NX, comprehensive docs
- Ask specific questions: "What would make you contribute to a project like this?"

---

## Screenshot/media checklist

These files already exist in the repo and can be used directly:

| What                 | File                                                   | Usage                            |
| -------------------- | ------------------------------------------------------ | -------------------------------- |
| Dashboard (dark)     | `apps/docs/src/public/img/demo/dashboard-dark.png`     | Main showcase                    |
| Dashboard (light)    | `apps/docs/src/public/img/demo/dashboard-light.png`    | Theme comparison                 |
| Product page (dark)  | `apps/docs/src/public/img/demo/product-page-dark.png`  | Real-world layout                |
| Product page (light) | `apps/docs/src/public/img/demo/product-page-light.png` | Alt theme                        |
| Auth page (dark)     | `apps/docs/src/public/img/demo/auth-page-dark.png`     | Form showcase                    |
| Auth page (light)    | `apps/docs/src/public/img/demo/auth-page-light.png`    | Clean form design                |
| Library illustration | `apps/docs/src/public/img/maz-ui-illu.png`             | Hero image                       |
| Full screenshot      | `apps/docs/src/public/img/maz-ui-screenshot.png`       | Comprehensive view               |
| Social preview       | `apps/docs/src/public/img/post-layer.png`              | Optimized for sharing (1200x627) |
| Pull to refresh GIF  | `apps/docs/src/public/img/maz-pull-to-refresh.gif`     | Mobile demo                      |

**Recommended posting strategy:**

1. Post the main text as a text post (not a link post — text posts get more engagement on dev subreddits)
2. Embed 3-4 images inline: dashboard dark, product page, auth page, and the pull-to-refresh GIF
3. If the subreddit supports image galleries, use: dashboard dark + light side by side, product page, auth page
4. **Best ROI:** Record a 20-30s screen recording showing the phone input, form validation in action, dark mode toggle, and theme switching. Upload as a GIF. Reddit loves visual proof over code blocks.
