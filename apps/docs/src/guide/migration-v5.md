---
title: Maz-UI v5.0.0 Migration Guide
description: What changes for you when upgrading from Maz-UI v4 to v5
---

# {{ $frontmatter.title }}

Maz-UI v5 is a major release. For **most consumers** the migration is short — you keep installing the package, importing its styles, using the components. Below is what actually changes for you.

::: warning Solo maintainer notice
Maz-UI is maintained by a single developer. After the v5 stable release, **v4 will no longer receive any support** — no security fixes, no backports. Please plan your upgrade.
:::

## TL;DR

1. Bump **Node to ≥ 20** and confirm your audience has modern browsers (see below).
2. If your **custom CSS** uses `hsl(var(--maz-<color>))`, simplify to `var(--maz-<color>)`.
3. Rename `import 'maz-ui/styles'` to `import 'maz-ui/style.css'` (and `maz-ui/aos-styles` → `maz-ui/aos.css`).
4. If you imported anything via `maz-ui/src/...`, switch to the public subpath (e.g. `maz-ui/components/MazBtn`).
5. That's it for most apps. Everything else is opt-in.

## Prerequisites

### Node

```bash
node -v   # must be >= 20
```

### Browser support

v5 requires native support for a few modern CSS features (`color-mix()`, `@property`, native CSS nesting). Minimum versions:

| Browser | Minimum |
| --- | --- |
| Chromium (Chrome, Edge, Opera, Brave, Arc) | 111 (March 2023) |
| Safari | 16.4 (March 2023) |
| Firefox | 128 (July 2024) |
| Samsung Internet | 22 |

There is no polyfill path. If your audience still relies on older browsers, stay on v4. See the dedicated [Browser Support](./browser-support.md) page for the rationale.

## Required changes

### 1. `hsl(var(--maz-<color>))` → `var(--maz-<color>)` in your CSS

The biggest — and usually only — change to chase down in your codebase.

**In v4** the CSS variables injected by `@maz-ui/themes` held raw HSL channels (`210 100% 56%`), so you had to wrap them yourself:

```css
.brand {
  background-color: hsl(var(--maz-primary));
  border-color: hsl(var(--maz-primary) / 0.5);
}
```

**In v5** the same variables hold complete CSS colors (`hsl(210 100% 56%)`). Wrapping in `hsl(...)` again produces `hsl(hsl(...))`, which is invalid. Update your own CSS:

```css
.brand {
  background-color: var(--maz-primary);
  border-color: color-mix(in srgb, var(--maz-primary) 50%, transparent);
}
```

For the alpha case, use `color-mix()`. The old `/ <alpha>` syntax no longer applies to already-wrapped values.

Quick search-and-fix:

```bash
# Find the patterns to update
rg "hsl\(\s*var\(--maz-" src/
```

### 2. CSS subpath renames

The two CSS entry points have been renamed to include their real file extension, so TypeScript treats them as plain side-effect CSS imports (no more `.d.ts` stubs required):

| v4 | v5 |
| --- | --- |
| `import 'maz-ui/styles'` | `import 'maz-ui/style.css'` |
| `import 'maz-ui/aos-styles'` | `import 'maz-ui/aos.css'` |

Both resolve to the same compiled CSS they did in v4, only the subpath key changes.

```bash
# Find the patterns to update
rg "['\"]maz-ui/(styles|aos-styles)['\"]" src/
```

## Informational changes (probably no action needed)

### Preset type: `HSL` → `CSSColor`

If you authored a custom preset via `@maz-ui/themes`, the color field type is now the looser `CSSColor = string` instead of the template literal `HSL`.

- Your existing raw values (`'210 100% 56%'`) keep working — they are auto-wrapped in `hsl(...)` at runtime by `normalizeColor`.
- You can now use any CSS color form: `'hsl(210 100% 56%)'`, `'#22c55e'`, `'oklch(0.7 0.15 30)'`, `'rgb(22 194 211)'`.
- Type checking on custom colors is now permissive. If you want strict validation, keep using the raw HSL form or validate at your boundary.

No action required for existing presets.

### Default border color

Tailwind v4 changed the default `border` color from the configured gray to `currentColor`. **Inside maz-ui components** we restore the v3 behavior so shadows, dividers and outlines keep their neutral tint; your own styles are unaffected (you get the Tailwind v4 default). If you also want the v3 default in your own code, see the [official Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide#default-border-color).

### Visual parity

Most visual regressions were caught during the migration, but keep an eye on:

- Shadows, radius and blur scales — Tailwind v4 shifted a few names (`shadow` → `shadow-sm`, `blur` → `blur-sm`, etc.). Maz-ui components have been updated internally; your own code is affected only if you used these classes directly.
- `outline-none` → `outline-hidden` (same story).

## What you can ignore

Unless you had your own Tailwind v3 setup alongside maz-ui, none of the following apply to you:

- Tailwind CSS config migration (CSS-first)
- Class prefix changes (`maz-flex` → `maz:flex`) — these are internal to maz-ui's compiled CSS
- `@apply X !important` → `@apply X!` syntax
- Utility renames en masse
- `defineMazTailwindConfig` removal
- CSS variable shorthand (`bg-[var(--x)]` → `bg-(--x)`)

If you DO have your own Tailwind v4 setup and want to expose maz-ui's theme tokens to your own utilities, read the [Tailwind integration](./tailwind.md) page. That's where all the Tailwind-specific migration lives.

## Troubleshooting

**Colors look wrong in devtools — I see `hsl(hsl(...))` somewhere.**
You still have `hsl(var(--maz-<color>))` in your CSS. See the required change above.

**A maz-ui component's border is a weird color.**
Expected if you were overriding `--maz-border` with a non-color value. Confirm it's a valid CSS color in v5.

**My custom preset's colors are ignored.**
Check the preset's type — if you imported `HSL` explicitly, switch to `CSSColor` (or just remove the type annotation). Raw HSL strings still work at runtime.

## Advanced: you had your own Tailwind setup

If you were already running Tailwind v3 in your app, shipping classes like `maz-flex` yourself, you need the same migration as any Tailwind v3 → v4 upgrade:

1. Run the official Tailwind upgrade tool: `npx @tailwindcss/upgrade` — it handles 95% of the work (utility renames, `@apply !important` syntax, `tailwind.config` → CSS-first, …).
2. Replace any `hsl(var(--maz-<color>))` in your own CSS (see above).
3. Read the [Tailwind integration](./tailwind.md) page to learn how to import maz-ui's bridge and expose your theme tokens to your own Tailwind config.

This is a niche path — most consumers never wrote maz-prefixed classes in their own code.

## See also

- [Tailwind CSS integration](./tailwind.md) — optional, for consumers who have their own Tailwind setup
- [Theming](./themes.md) — preset authoring and runtime theme switching
- [Browser Support](./browser-support.md) — exact minimum versions and the features they enable
