# @maz-ui/upgrade

Automated source rewrites for migrating a project from **Maz-UI v4** to **v5**.

Run it once at the start of your migration to clear the mechanical changes
from your todo list, then walk through the rest of the
[migration guide](https://maz-ui.com/guide/migration-v5) for the items that
need a human eye (theme `foundation.radius` reshape, `MazIcon` API,
`MazBadge` numeric sizes, `MazChart` `update-mode`).

The companion [`@maz-ui/mcp`](https://maz-ui.com/ecosystem/mcp) server lets your
AI assistant read the migration guide and apply the manual steps with full
context.

## Table of contents

- [@maz-ui/upgrade](#maz-uiupgrade)
  - [Table of contents](#table-of-contents)
  - [Quick start](#quick-start)
  - [Usage](#usage)
  - [Options](#options)
  - [What it scans](#what-it-scans)
  - [How it ignores files](#how-it-ignores-files)
  - [Transform groups](#transform-groups)
    - [`imports`](#imports)
    - [`props`](#props)
    - [`css`](#css)
    - [`config`](#config)
    - [`deps`](#deps)
  - [Dependency install](#dependency-install)
  - [Output](#output)
  - [Exit codes](#exit-codes)
  - [What it does NOT do](#what-it-does-not-do)
  - [Programmatic API](#programmatic-api)
  - [License](#license)

## Quick start

```bash
# 1. Preview the rewrites without touching anything
npx @maz-ui/upgrade ./ --dry-run

# 2. Apply when the diff looks good
npx @maz-ui/upgrade ./

# 3. Run your typecheck / tests, fix the few remaining manual items
#    listed at the end of the migration guide
```

Working in a Vue/Nuxt monorepo? Point at the app:

```bash
npx @maz-ui/upgrade ./apps/web --dry-run
```

## Usage

```text
npx @maz-ui/upgrade [options] <path...>
```

- **`<path...>`** — one or more directories to walk. Each path is resolved
  against the current working directory. At least one path is required;
  pass `./` to scan the whole project.
- The tool walks every supported file under those paths, applies the
  enabled transform groups, and writes the result back in place (or just
  prints what would change with `--dry-run`).

## Options

| Flag              | Description                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-n`, `--dry-run` | Print every file that would change without writing it back. Use this first.                                                                           |
| `--only=<groups>` | Comma-separated list of transform groups to run. See [Transform groups](#transform-groups). Default: `imports,props,css,config,deps` (all of them).   |
| `--no-gitignore`  | Do not respect the project's `.gitignore`. The built-in safe list of build / dependency directories still applies.                                    |
| `--no-install`    | Do not run the package manager after rewriting `package.json` files. By default the CLI runs `<pm> install` once at least one `package.json` changed. |
| `-h`, `--help`    | Print the help screen and exit.                                                                                                                       |
| `-v`, `--version` | Print the upgrade tool version and exit.                                                                                                              |

Examples:

```bash
# Only rewrite import paths and component props
npx @maz-ui/upgrade ./src --only=imports,props

# Same, but also include files your .gitignore would otherwise skip
npx @maz-ui/upgrade ./src --only=css --no-gitignore

# Multiple roots in one run
npx @maz-ui/upgrade ./apps/web ./packages/ui-kit --dry-run
```

## What it scans

The CLI walks every file matching one of these extensions inside the
provided paths:

- **Vue:** `.vue`
- **Stylesheets:** `.css`, `.scss`, `.sass`, `.less`, `.styl`, `.stylus`, `.pcss`, `.postcss`
- **TypeScript:** `.ts`, `.tsx`, `.cts`, `.mts`
- **JavaScript:** `.js`, `.jsx`, `.cjs`, `.mjs`
- **Manifest:** every `package.json` (root + nested in monorepo workspaces)

That covers component templates, scoped/global styles, plus `nuxt.config.ts`,
`main.ts` / `main.js`, custom theme preset files, plugin registration files,
and anything else where a v4 pattern can appear.

## How it ignores files

Two layers, applied in order:

1. **Built-in safe list** (always on): `node_modules`, `dist`, `build`,
   `.nuxt`, `.output`, `.next`, `.svelte-kit`, `.turbo`, `.cache`,
   `coverage`, `.vercel`, `.netlify`.
2. **Your `.gitignore`** — read at the project root and any nested
   `.gitignore` files, the same way `prettier`, `eslint` or
   `@tailwindcss/upgrade` work. Pass `--no-gitignore` to skip this layer
   (the safe list above still applies).

If your build output, generated types, or vendored copies of maz-ui live
outside both lists, add them to a local `.gitignore` (or to a sibling
`.git/info/exclude`) so they're skipped on the next run.

## Transform groups

By default all five groups run. Use `--only=<a,b,...>` to scope the run.
Each group is independent. Re-running the tool on already-migrated code is a
no-op, except for the `MazAvatar` size rewrite (a unit value can not be told
apart from an already multiplied one): run it once, on v4 code.

### `imports`

CSS subpath renames, applied to imports in `.vue`, JS/TS files and
stylesheets (`@import`), and the root import move, applied to `.vue` and JS/TS
files:

| v4                                  | v5                                      |
| ----------------------------------- | --------------------------------------- |
| `import 'maz-ui/styles'`            | `import 'maz-ui/style.css'`             |
| `import 'maz-ui/aos-styles'`        | `import 'maz-ui/aos.css'`               |
| `import 'maz-ui/dist/css/main.css'` | `import 'maz-ui/style.css'`             |
| `import 'maz-ui/dist/css/aos.css'`  | `import 'maz-ui/aos.css'`               |
| `import { sleep } from 'maz-ui'`    | `import { sleep } from '@maz-ui/utils'` |

The `maz-ui` root entry still exists in v5 as a type-only surface: imports made
only of its types (`MazColor`, `MazSize`, `MazSizeUnit`, `MazRoundedSize`,
`GlobalizableProps`, `MazComponentName`, `MazUiDefaultsOptions`,
`MazUiOptions`) are kept on `maz-ui`. Other deep `maz-ui/dist/...` imports (the
`./*` wildcard export was removed) are reported as a warning at the end of the
run.

### `props`

Component prop / slot / class renames, applied to `.vue` files only. The
props (`left-icon`, `variant=`, `color="background"`, icon names…) are
rewritten **only inside `<Maz...>` / `<maz-...>` opening tags**, never on your
own components or other libraries (Vant `left-icon`…). The slots,
`footer-align`, `rounded-size`, `active-color` and the maz-ui class names are
specific enough to be rewritten file-wide. Kebab-case, camelCase and
`v-bind:` / `v-slot:` forms are all handled.

| v4                                                                                                        | v5                                                                |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `left-icon="x"` / `right-icon="x"`                                                                        | `start-icon="x"` / `end-icon="x"`                                 |
| `:left-icon="x"` / `:right-icon="x"`                                                                      | `:start-icon="x"` / `:end-icon="x"`                               |
| `:leftIcon="x"` / `v-bind:right-icon="x"`                                                                 | `:startIcon="x"` / `v-bind:end-icon="x"`                          |
| `start-icon="user"` (bare icon name, MazBtn / MazInput / MazLink / MazContainer / MazDropdown / MazAlert) | `start-icon="/user.svg"`                                          |
| `<MazIcon src="/a.svg">` / `<MazIcon :src="url">`                                                         | `<MazIcon icon="/a.svg">` / `<MazIcon :icon="url">`               |
| `<MazIcon name="home">` / `<MazIcon name="home" path="/icons">`                                           | `<MazIcon icon="/home.svg">` / `<MazIcon icon="/icons/home.svg">` |
| `<template #left-icon>` / `<template #right-icon>`                                                        | `<template #start-icon>` / `<template #end-icon>`                 |
| `<template #icon-left>` / `<template #icon-right>` (MazContainer)                                         | `<template #icon-start>` / `<template #icon-end>`                 |
| `footer-align="left"` / `footer-align="right"`                                                            | `footer-align="start"` / `footer-align="end"`                     |
| `<MazDrawer variant="left">` / `<MazDrawer variant="right">`                                              | `<MazDrawer variant="start">` / `<MazDrawer variant="end">`       |
| `<Maz... color="background">`                                                                             | `<Maz... color="surface">`                                        |
| `active-color="background"`                                                                               | `active-color="surface"`                                          |
| `rounded-size="base"`                                                                                     | `rounded-size="md"`                                               |
| `.--has-left-icon` / `.--has-right-icon` (CSS selectors)                                                  | `.--has-start-icon` / `.--has-end-icon`                           |
| `.m-input-wrapper-left` / `.m-input-wrapper-right`                                                        | `.m-input-wrapper-start` / `.m-input-wrapper-end`                 |
| `.drawer-anim-left-*` / `.drawer-anim-right-*`                                                            | `.drawer-anim-start-*` / `.drawer-anim-end-*`                     |
| `<MazAvatar size="2rem">` (static CSS unit)                                                               | `<MazAvatar size="6rem">` (value ×3, render preserved)            |
| `<MazPullToRefresh :on-click="x">`                                                                        | `<MazPullToRefresh :on-refresh="x">`                              |

The `MazAvatar` rewrite targets only `<MazAvatar>` / `<maz-avatar>` opening
tags. v5 fixed the avatar size scale (a CSS-unit `size` no longer renders 3x
too large), so the numeric value is multiplied by 3 to keep the exact same
render. Every CSS unit is supported. `MazSize` keywords (`mini`..`xl`) and
bound `:size="…"` expressions are left untouched - the latter is reported as
a warning at the end of the run.

v4 rendered a string icon prop as `<MazIcon :name>`, resolved to
`${mazIconPath}/<name>.svg`. v5 only accepts a URL (or a raw SVG) for a string,
so a bare name renders nothing: it is rewritten to the relative URL of the same
file (`mazIconPath` is still prepended to relative URLs). A bare name is never
a valid v5 value, so this rewrite is idempotent. Bound values, a bound
`:name` / `:path` on `MazIcon` and the removed `@loaded` / `@unloaded` events
are reported as warnings at the end of the run. If you provide a `mazIconPath`
(Nuxt `general.defaultMazIconPath`), note that v5 also prepends it to the
relative URLs of a former `src` or `path`.

The `MazPullToRefresh` rewrite targets only `<MazPullToRefresh>` /
`<maz-pull-to-refresh>` opening tags. v5 renamed the callback prop `on-click`
to `on-refresh` (both kebab-case and camelCase, bound or static), so native
click handlers and the `onClick` prop of other components are never touched.

### `css`

CSS variable renames + `hsl(var(...))` collapse, applied to `.vue` files,
stylesheets, and any inline strings in `.ts`/`.js` (the maz-ui class names of
the `props` table are renamed in stylesheets too):

| v4                                                                                         | v5                                                                                |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `var(--maz-background)` / `var(--maz-background-700)` / `var(--maz-background-foreground)` | `var(--maz-surface)` / `var(--maz-surface-700)` / `var(--maz-surface-foreground)` |
| `var(--maz-border)` / `var(--maz-border-700)`                                              | `var(--maz-divider)` / `var(--maz-divider-700)`                                   |
| `hsl(var(--maz-primary))`                                                                  | `var(--maz-primary)`                                                              |
| `hsl(var(--maz-primary) / 0.5)` / `hsl(var(--maz-primary) / 50%)`                          | `color-mix(in srgb, var(--maz-primary) 50%, transparent)`                         |
| `hsl(var(--maz-primary) / var(--alpha))`                                                   | `color-mix(in srgb, var(--maz-primary) calc(var(--alpha) * 100%), transparent)`   |

Foundation tokens that happen to start with the same prefix (e.g.
`--maz-border-width`, `--maz-border-radius`) are explicitly **not**
renamed.

### `config`

Plugin / Nuxt module / preset config keys, applied to `.vue` and JS/TS
files:

| v4                                                                                                                                       | v5                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Nuxt `mazUi.css.injectMainCss`                                                                                                           | `mazUi.css.injectCss`                   |
| Theme `strategy: 'hybrid'`                                                                                                               | `strategy: 'runtime'`                   |
| `MazUiTheme` plugin options `injectCriticalCSS: …` / `injectFullCSS: …`                                                                  | option removed (silently ignored in v5) |
| Nuxt theme `injectAllCSSOnServer: …`                                                                                                     | option removed (silently ignored in v5) |
| `generateCSS` / `buildThemeCSS` / `buildSeparateThemeFiles` `onlyCritical`, `criticalColors`, `criticalFoundation`, `includeColorScales` | option removed                          |
| Custom preset `colors.{light,dark}.background`                                                                                           | `colors.{light,dark}.surface`           |
| Custom preset `colors.{light,dark}.border`                                                                                               | `colors.{light,dark}.divider`           |

The removed options are cleaned on their own line or inline
(`{ preset, onlyCritical: true }`). The preset color rename is scoped to
`light: { … }` / `dark: { … }` blocks, and it runs with the
`strategy: 'hybrid'` rewrite only in files referencing maz-ui (a `maz-ui` /
`@maz-ui/*` import, the Nuxt `mazUi` key, `MazUi*` plugins, `definePreset`,
`setupTheme`, `useTheme`, `darkModeStrategy`), so generic objects elsewhere are
left alone.

### `deps`

Dependency version bumps in every `package.json` the walk picks up
(root + nested workspaces). Bumps `maz-ui` and every `@maz-ui/*`
entry across `dependencies`, `devDependencies` and `peerDependencies`
to `^5.0.0`. Existing JSON indentation and trailing newline are
preserved; non-maz-ui dependencies are never touched.

| What                                                                         | Behaviour             |
| ---------------------------------------------------------------------------- | --------------------- |
| `maz-ui`, `@maz-ui/*` semver ranges (`^4.x`, `~4.x`, `4.x`, `4.0.0`, …)      | Rewritten to `^5.0.0` |
| `workspace:*`, `link:…`, `file:…`, `portal:…`, `npm:…`, `http(s):…`, `git+…` | Left untouched        |
| Dist tags (`latest`, `next`, `beta`, `alpha`, `canary`)                      | Left untouched        |
| `@maz-ui/cli` (not published in v5)                                          | Left untouched        |
| Anything else (`vue`, `chart.js`, your own packages, …)                      | Left untouched        |

When the `imports` group runs, two dependencies are added next to `maz-ui`
if a source needs them and no `package.json` declares them: `@maz-ui/utils`
(when a `from 'maz-ui'` import is moved to it) and `valibot` (`^1.3.1`, when a
source imports it: it was a dependency of maz-ui v4, it is an optional peer
dependency in v5).

`vue-chartjs` is **not** removed automatically, even though `MazChart`
no longer depends on it — keep it if you use it directly elsewhere,
remove it manually otherwise.

## Dependency install

Once the rewrite is done, if at least one `package.json` changed and
the `deps` group ran, the CLI:

1. Detects your package manager from the lockfile in `cwd`:
   `bun.lockb`/`bun.lock` → **bun**, `pnpm-lock.yaml` → **pnpm**,
   `yarn.lock` → **yarn**, `package-lock.json` → **npm**, otherwise
   defaults to **npm**.
2. Runs `<pm> install` with inherited stdio so you see the install
   progress live. The CLI exits with the install's exit code if it
   fails.

Pass `--no-install` to skip step 2 — the CLI then prints the command
you should run manually:

```text
package.json files updated. Run `pnpm install` to apply.
```

`--dry-run` always skips the install regardless of `--no-install`.

## Output

For each file that the tool changes, you get one line on stdout:

```text
updated: src/components/Header.vue
updated: app.vue
updated: nuxt.config.ts
```

In dry-run mode the prefix becomes `[dry-run] would update: ...`.

At the end of the run you get a summary:

```text
Scanned 142 files, updated 27.
Groups applied: imports, props, css, config, deps

Detected package manager: pnpm. Running `pnpm install`…

[ … pnpm install output … ]

Next: see https://maz-ui.com/guide/migration-v5 for the manual steps
(foundation.radius → scales.rounded.md, MazIcon API, MazBadge sizes, MazChart update-mode).
```

## Exit codes

- `0` — completed successfully (zero or more files updated; install
  step, if any, succeeded).
- `1` — argument error (unknown option or unknown group), no path
  provided, or unhandled error during the walk.
- Any other code propagated from the package manager when the install
  step fails (CLI exits with that exact status).

## What it does NOT do

Some changes need a human (or your AI assistant via the
[`@maz-ui/mcp`](https://maz-ui.com/ecosystem/mcp) server) — see the
[migration guide](https://maz-ui.com/guide/migration-v5) for the full
context:

- **`MazIcon` bound values** - a bound `:name` / `:path` and the removed
  `@loaded` / `@unloaded` events (reported as warnings). Static `name`,
  `path` and `src` are rewritten by the `props` group.
- **Icon values in scripts** - `h(MazBtn, { leftIcon })`, `v-bind` objects,
  `MazStepper` `steps[].icon`: keys too generic to rewrite safely in JS.
- **`MazBadge` numeric `size`** — picking the right keyword (`mini`/`xs`/…)
  is a judgment call.
- **Theme preset radius reshape** — `foundation.radius` →
  `scales.rounded.md` needs to move the value to a new sibling block,
  which is too structural for a safe regex. The simpler color key renames
  (`background` → `surface`, `border` → `divider`) are handled by the
  `config` group, and the `package.json` version bump by the `deps`
  group.
- **`MazChart` `update-mode` default** — switched from `'default'` to
  `'none'` in v5; deciding whether to restore the v4 animation is up to
  you.
- **Tailwind v3 → v4 migration** — if you ship your own Tailwind utilities
  alongside maz-ui, run `npx @tailwindcss/upgrade` first; it covers 95% of
  the Tailwind side. See the
  [Tailwind integration page](https://maz-ui.com/guide/tailwind).

## Programmatic API

Each transform is exported as a pure `(string) => string` function, so
you can call them from your own scripts or compose a custom orchestrator:

```ts
import type { TransformGroup, TransformOptions } from '@maz-ui/upgrade'
import {
  ALL_GROUPS,
  transformConfig,
  transformCssVars,
  transformDeps,
  transformFile,
  transformHslVar,
  transformImports,
  transformPresetColors,
  transformProps,
} from '@maz-ui/upgrade'

transformImports(`import 'maz-ui/styles'`)
// → `import 'maz-ui/style.css'`

transformProps(`<MazBtn left-icon="x" />`)
// → `<MazBtn start-icon="x" />`

transformHslVar(`color: hsl(var(--maz-primary) / 0.5)`)
// → `color: color-mix(in srgb, var(--maz-primary) 0.5, transparent)`

transformCssVars(`background: var(--maz-background-700);`)
// → `background: var(--maz-surface-700);`

transformPresetColors(`light: { background: '0 0% 100%', border: '220 13% 91%' }`)
// → `light: { surface: '0 0% 100%', divider: '220 13% 91%' }`

transformConfig(`{ css: { injectMainCss: true } }`)
// → `{ css: { injectCss: true } }`

transformDeps(`{ "dependencies": { "maz-ui": "^4.9.3" } }`)
// → `{ "dependencies": { "maz-ui": "^5.0.0" } }`

// Compose at the file level (extension-aware orchestration):
transformFile('nuxt.config.ts', source, { groups: ['imports', 'config'] })
// Pass no options to apply ALL_GROUPS.
transformFile('app.vue', source)
```

`ALL_GROUPS` is exported as `readonly TransformGroup[]` (`['imports', 'props', 'css', 'config', 'deps']`) so you can derive your own subsets.

## License

MIT
