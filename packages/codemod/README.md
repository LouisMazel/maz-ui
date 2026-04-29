# @maz-ui/codemod

Automated source rewrites for migrating a project from **Maz-UI v4** (Tailwind v3) to **Maz-UI v5** (Tailwind v4).

## Install & run

You don't need to install it — use `npx`:

```bash
# Preview first
npx @maz-ui/codemod tailwind-v4 ./src --dry-run

# Apply
npx @maz-ui/codemod tailwind-v4 ./src

# Inject @reference directives while you're at it
npx @maz-ui/codemod tailwind-v4 ./src --add-reference=src/tailwind.css
```

The CLI scans the given paths for `.vue`, `.ts`/`.tsx`/`.mts`/`.cts`, and `.css` files, skipping `node_modules`, `dist`, `.nuxt`, and `.output`.

## What it does

- **Prefix**: `maz-flex` → `maz:flex`
- **Variants**: `dark:maz-border` → `maz:dark:border`, multi-variants preserved
- **Important modifier**: `!maz-m-0` → `maz:m-0!` (the `!dark:maz-X` and `dark:!maz-X` forms both land on `maz:dark:X!`)
- **Negative values**: `-maz-mt-4` → `maz:-mt-4`, plus the collapsed `maz--translate-y-1/2` → `maz:-translate-y-1/2`
- **`@apply X !important`** (CSS) → `@apply X!` per token
- **Utility renames** (official Tailwind v4): `rounded-sm` → `rounded-xs`, `outline-none` → `outline-hidden`, `shadow` → `shadow-sm`, `shadow-sm` → `shadow-xs`, `drop-shadow` → `drop-shadow-sm`, `drop-shadow-sm` → `drop-shadow-xs`, `blur` → `blur-sm`, `blur-sm` → `blur-xs`, `backdrop-blur` → `backdrop-blur-sm`, `backdrop-blur-sm` → `backdrop-blur-xs`, `ring` → `ring-3`, every `bg-gradient-to-*` → `bg-linear-to-*`
- **`hsl(var(--X))` double-wrap elimination**: in Maz-UI v5 the `--maz-*` variables are already `hsl(…)`, so the wrapper has to go. `hsl(var(--X) / 0.5)` becomes `color-mix(in srgb, var(--X) 0.5, transparent)`.
- **Tailwind arbitrary values**: `maz:bg-[var(--maz-X)]` → `maz:bg-(--maz-X)`, and the `[hsl(var(--X))]` variants collapse to the v4 paren shorthand.

## What it does NOT do

- Change your `package.json` deps (you do that manually).
- Rewrite JS code that builds class names at runtime from non-literal inputs (e.g. `` `maz-${unknown}` ``).
- Touch custom CSS classes whose name happens to start with `maz-` if they're referenced from `.js`/`.ts` via `classList.add('maz-my-class')` — re-run with `--add-reference` **only on files you control**.
- Edit your `tailwind.config.{js,ts}` — the v4 setup is CSS-first, see [the migration guide](https://maz-ui.com/guide/migration-v5).

## Full migration guide

[https://maz-ui.com/guide/migration-v5](https://maz-ui.com/guide/migration-v5)

## Programmatic API

Every transformation is also exported as a pure string-to-string function:

```ts
import {
  transformApplyImportant,
  transformClassToken,
  transformFile,
  transformHslVar,
  transformText,
  transformVueFile,
} from '@maz-ui/codemod'

transformClassToken('dark:!maz-m-0')                      // 'maz:dark:m-0!'
transformHslVar('border: 1px solid hsl(var(--maz-primary) / 0.5)')
//  -> 'border: 1px solid color-mix(in srgb, var(--maz-primary) 0.5, transparent)'
```

## License

MIT
