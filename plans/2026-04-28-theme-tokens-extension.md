# Theme tokens extension — `@maz-ui/themes`

**Date:** 2026-04-28
**Status:** spec — pending validation before implementation
**Owner:** Loïc

## Why

The current `ThemePreset` exposes only colors and a tiny `foundation` block (font, radius, border-width, durations, easings). Consumers cannot:

- Override the **spacing scale** (Tailwind defaults to 0.25rem — no per-app control without re-configuring Tailwind themselves).
- Drive a **radius scale** (only one foundation `radius` exists today; component utilities like `rounded-md`, `rounded-xl` fall back to Tailwind defaults).
- Drive a **shadow scale** (`shadow-elevation` is hardcoded in ~10 components; `shadow-sm`/`md`/`lg`/`xl` use Tailwind defaults).
- Centralize **font-size scale** keyed on `MazSize` (each component re-declares its own `text-xs` / `text-sm` mappings — scattered).
- Override **disabled-state behaviour** (opacity + cursor are hardcoded across ~15 components).
- Have a **`font-mono`** family for `MazInputCode`, `<code>`, `<kbd>`.
- Override **container background** independently of `surface` (for elevated containers like Card / Popover / Dialog when a consumer wants their floating surfaces visually distinct from the page body).
- Override **input background** for filled-input visual styles.
- Override **`MazBtn` font-weight** (today implicit).

Colors are already fully addressed via `@maz-ui/themes` palette generation (50→900 scales auto-derived from each base color, bridged into Tailwind via `packages/lib/src/tailwindcss/theme-colors.css`). **No work needed on color tokens.**

## Scope

### In

1. **Scales** that extend Tailwind v4's `@theme` (consumer's own utilities benefit too):
   - `spacing` (base unit)
   - `radius.{xs, sm, md, lg, xl, 2xl, 3xl}`
   - `shadow.{sm, md, lg, xl, elevation}`
   - `fontSize.{mini, xs, sm, md, lg, xl}` with paired `lineHeight`
2. **Font families**:
   - Keep `font-family` (body / sans)
   - Add `font-mono`
   - Add `font-display` (default = same as body, so non-breaking)
3. **Foundation transverse tokens**:
   - `disabled-opacity`
   - `disabled-cursor`
4. **`components` block** — narrow, validated entries only:
   - `btn.font-weight`
   - `container.bg` (covers MazCard, MazContainer, MazDialog, MazPopover, MazDropdown, MazDrawer)
   - `input.bg` (covers MazInput, MazTextarea, MazSelect, MazCheckbox, MazRadio, MazSwitch)

### Out (explicitly rejected after iteration)

- Color tokens for `surface-*`, `divider`, `scrollbar-thumb`, `backdrop-tint`, `focus-ring`, etc. — already wired through the palette generator and `theme-colors.css` bridge.
- Full per-component token API (`--m-btn-padding-x-*`, `--m-popover-arrow-size`, etc.) — too wide, mostly duplicates what Tailwind utilities already give the consumer.
- `font-serif` — Tailwind already defaults to a sensible system serif stack; no value to override unless we're opinionated, and we're not.
- Per-component `radius` overrides (`btn.radius`, `input.radius`, …) — composers can target the global `radius.md` token or override specific Tailwind utilities (`rounded-md`) themselves.
- Z-index tokens — not requested, would need cross-component coordination, can come later if a real layering bug shows up.

## Detailed spec

### 1. New `scales` block

Lives at the same level as `foundation` and `colors` in `ThemePreset`.

```ts
export interface ThemeScales {
  /**
   * Base spacing unit. Tailwind multiplies this for every `p-N`, `m-N`,
   * `gap-N`, etc. Default: '0.25rem' (Tailwind default).
   */
  spacing: string

  /**
   * Border-radius scale. Maps to Tailwind utilities rounded-{key}.
   * 'full' is intentionally not included — Tailwind keeps `rounded-full`
   * at 9999px regardless.
   */
  radius: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl', string>

  /**
   * Box-shadow scale. Maps to Tailwind utilities shadow-{key}.
   * `elevation` is the maz-ui specific elevated-surface shadow used
   * by MazCard, MazContainer, MazPopover, etc.
   */
  shadow: Record<'sm' | 'md' | 'lg' | 'xl' | 'elevation', string>

  /**
   * Typography scale keyed on `MazSize`. Each entry is `[size, line-height]`.
   * Drives both the global Tailwind `text-{key}` utilities AND the
   * per-component size mappings (MazBtn `size="md"`, MazInput `size="lg"`, …).
   */
  fontSize: Record<MazSize, [size: string, lineHeight: string]>
}
```

**Defaults proposed** (to be confirmed during implementation against the visual baseline):

```ts
scales: {
  spacing: '0.25rem',

  radius: {
    xs: '0.125rem',   // 2px
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
  },

  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    elevation: '<current value lifted from existing implementation>',
  },

  fontSize: {
    mini: ['0.625rem', '0.875rem'],
    xs:   ['0.75rem',  '1rem'],
    sm:   ['0.875rem', '1.25rem'],
    md:   ['1rem',     '1.5rem'],
    lg:   ['1.125rem', '1.75rem'],
    xl:   ['1.25rem',  '1.75rem'],
  },
}
```

### 2. Updated `foundation`

```ts
export interface ThemeFoundation {
  // existing
  'base-font-size': string
  'font-family': string         // body / sans — keep current key for back-compat
  'border-width': string
  'duration-fast': string
  'duration-normal': string
  'duration-slow': string
  'easing-out': string
  'easing-in': string
  'easing-in-out': string

  // removed: 'radius'   →  moved to scales.radius.md (or whichever palier)

  // new — fonts
  'font-mono': string
  'font-display': string       // default: same as 'font-family'

  // new — disabled
  'disabled-opacity': string   // e.g. '0.5'
  'disabled-cursor': string    // e.g. 'not-allowed'
}
```

**Breaking note:** removing `foundation.radius` is the only breaking change at the type level. Migration: that single value moves to `scales.radius.md` (or the closest match). All current usages of `--maz-radius` in components must be remapped to `--maz-radius-md` (or the bridge equivalent).

### 3. New `components` block

The `bg` tokens are **per-mode** — current defaults differ between light and dark:

- containers in light: `bg-surface`; in dark: `bg-surface-400` (a few components — verify per-component)
- inputs in light: `bg-surface`; in dark: `bg-surface-400`

So the consumer must be able to drive the two modes independently, exactly like `colors.{light, dark}`.

```ts
export interface ThemeComponents {
  btn?: {
    'font-weight'?: string
  }
  container?: {
    /**
     * Background of "container" surfaces (Card, Container, Dialog,
     * Popover, Dropdown menu panel, Drawer, BottomSheet, Backdrop
     * content, Accordion panel, etc.).
     * Defaults — light: `var(--maz-surface)`, dark: `var(--maz-surface-400)`.
     */
    bg?: { light?: string, dark?: string }
  }
  input?: {
    /**
     * Background of input controls (Input, Textarea, Select, Checkbox,
     * Radio, Switch, InputNumber, InputCode, InputPhoneNumber,
     * InputPrice, InputTags, DatePicker trigger, Dropzone surface).
     * Defaults — light: `var(--maz-surface)`, dark: `var(--maz-surface-400)`.
     */
    bg?: { light?: string, dark?: string }
  }
}
```

Each entry is optional. When omitted, the component falls back to the existing surface tokens — zero behaviour change.

The runtime must inject `--m-container-bg` and `--m-input-bg` as **mode-aware** vars (i.e. they get a different value under `[data-theme="dark"]` like the color tokens already do), so components can write `background-color: var(--m-container-bg)` once and have it auto-switch.

### 4. CSS bridge — generation

Today the bridge is `packages/lib/src/tailwindcss/theme-colors.css` (handwritten). The new tokens need a parallel structure. Two options:

**Option A — handwritten file `theme-scales.css`** alongside `theme-colors.css`. Same `@theme inline` mechanism. Pros: explicit, follows existing convention. Cons: manual sync between preset key names and CSS bridge.

**Option B — generate the bridge at build time** from the preset keys (a tiny `ViteBuildThemes` extension). Pros: single source of truth, can't drift. Cons: more machinery.

**Recommendation:** start with A (matches existing pattern, lower risk). Migrate to B if drift becomes an issue.

Concretely, `theme-scales.css` would do:

```css
@theme inline {
  /* spacing */
  --spacing: var(--maz-spacing);

  /* radius */
  --radius-xs:  var(--maz-radius-xs);
  --radius-sm:  var(--maz-radius-sm);
  --radius-md:  var(--maz-radius-md);
  --radius-lg:  var(--maz-radius-lg);
  --radius-xl:  var(--maz-radius-xl);
  --radius-2xl: var(--maz-radius-2xl);
  --radius-3xl: var(--maz-radius-3xl);

  /* shadow */
  --shadow-sm:        var(--maz-shadow-style-sm);
  --shadow-md:        var(--maz-shadow-style-md);
  --shadow-lg:        var(--maz-shadow-style-lg);
  --shadow-xl:        var(--maz-shadow-style-xl);
  --shadow-elevation: var(--maz-shadow-style-elevation);

  /* font-size + line-height */
  --text-mini:               var(--maz-text-mini);
  --text-mini--line-height:  var(--maz-text-mini--line-height);
  --text-xs:                 var(--maz-text-xs);
  --text-xs--line-height:    var(--maz-text-xs--line-height);
  /* ... up to xl */

  /* fonts */
  --font-sans:    var(--maz-font-sans);    /* current --maz-font-family aliased */
  --font-mono:    var(--maz-font-mono);
  --font-display: var(--maz-font-display);
}
```

⚠️ Naming: the existing `--maz-shadow-{50..900}` are **colors** (alias of `--color-elevation-*`). The new shadow-style tokens use a different prefix `--maz-shadow-style-*` to avoid collision.

### 5. Runtime injection (`@maz-ui/themes` runtime)

The runtime currently injects `--maz-*` for each color (per mode) and each foundation entry. It must be extended to also inject:

- `--maz-spacing`
- `--maz-radius-{xs..3xl}`
- `--maz-shadow-style-{sm..xl, elevation}`
- `--maz-text-{mini..xl}` and `--maz-text-{key}--line-height`
- `--maz-font-mono`, `--maz-font-display`
- `--maz-disabled-opacity`, `--maz-disabled-cursor`

These are mode-agnostic (live in `:root` or a single layer, not under `[data-theme="dark"]`). Same as the current `foundation` injection.

### 6. Implementation in every affected component

Below is the exhaustive list, drawn from the current source. Each row says which token applies and the concrete change to make. Files in `packages/lib/src/components/` unless noted.

#### 6.1 `container.bg` — replaces `bg-surface` (and `dark:bg-surface-400`) on container surfaces

The expected migration is:

```diff
- maz:bg-surface maz:dark:bg-surface-400
+ maz:bg-(--m-container-bg)
```

…where `--m-container-bg` is injected by the runtime with the right value per mode.

Files to update:

| File | Element / context |
| --- | --- |
| `MazCard.vue` | Card root surface |
| `MazContainer.vue` | Container root |
| `MazDialog.vue` | Dialog modal surface |
| `MazPopover.vue` | Popover panel |
| `MazDropdown.vue` | Dropdown menu panel (verify; may inherit MazPopover) |
| `MazDrawer.vue` | Drawer body |
| `MazBottomSheet.vue` | Sheet body |
| `MazCardSpotlight.vue` | Card surface |
| `MazCarousel.vue` | (verify — uses `bg-surface` for arrows or background?) |
| `MazGallery.vue` | Gallery surface |
| `MazTabsBar.vue` | Tab bar background (if applicable) |
| `MazTable.vue` | Table wrapper / footer (footer is `bg-surface`) |
| `MazTableRow.vue` | Striped rows or hover (verify per existing rules) |
| `MazStepper.vue` | Stepper container |
| `MazDatePicker/MazPickerContainer.vue` | Picker panel |
| `MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarGrid.vue` | Calendar surface (verify) |
| `MazDatePicker/MazPickerMonthSwitcher.vue` | Switcher panel |
| `MazDatePicker/MazPickerYearSwitcher.vue` | Switcher panel |

**Caution**: not every `bg-surface` in these files is a "container background". Some are local accents (e.g. a child element). Audit each occurrence individually rather than bulk replace.

#### 6.2 `input.bg` — replaces `bg-surface` (and `dark:bg-surface-400`) on form controls

```diff
- maz:bg-surface maz:dark:bg-surface-400
+ maz:bg-(--m-input-bg)
```

| File | Element / context |
| --- | --- |
| `MazInput.vue` | Input wrapper |
| `MazTextarea.vue` | Textarea wrapper |
| `MazSelect.vue` | Trigger + list (the popover panel may use `--m-container-bg` instead — verify) |
| `MazCheckbox.vue` | Checkbox box (the unchecked state) |
| `MazRadio.vue` | Radio circle (unchecked) |
| `MazRadioButtons.vue` | Each option's surface |
| `MazSwitch.vue` | Track (unchecked) |
| `MazInputCode.vue` | Each digit input |
| `MazInputTags.vue` | Wrapper |
| `MazSlider.vue` | Cursor surface (verify — could be `--m-container-bg` since it's a "floating" surface) |
| `MazDropzone.vue` | Drop zone surface |
| `MazChecklist.vue` | If present (verify) |

#### 6.3 `btn.font-weight` — adds explicit weight to `MazBtn`

MazBtn currently has no explicit `font-*` class — it inherits from the root. Adding the token makes the button weight explicitly controllable:

```diff
+ maz:font-(--m-btn-font-weight)
```

(Or apply at the `.m-btn` selector level via the bridge / a single class binding.)

| File | Notes |
| --- | --- |
| `MazBtn.vue` | Add the class on `.m-btn` root |

Default value: `500` (medium) to keep current visual weight under most stacks.

#### 6.4 `disabled-opacity` + `disabled-cursor` — centralize disabled state

Replace the `~17` occurrences of `cursor-not-allowed` and `opacity-{40,50}` (when applied to `:disabled` state) with:

```css
&:disabled,
&[disabled] {
  opacity: var(--maz-disabled-opacity);
  cursor: var(--maz-disabled-cursor);
}
```

…written once in a `m-disabled` mixin or inlined per component. Best path: a tiny global rule in `tailwind.css` that targets `[data-maz-disabled]` or similar, so each component just toggles the data-attribute.

| File | Disabled pattern present |
| --- | --- |
| `MazBtn.vue` | `:disabled` styling |
| `MazInput.vue` | `disabled` prop on input |
| `MazTextarea.vue` | Same |
| `MazSelect.vue` | `--disabled` class on root |
| `MazCheckbox.vue` | Disabled checkbox |
| `MazRadio.vue` | Same |
| `MazSwitch.vue` | Same |
| `MazInputCode.vue` | Disabled digit inputs |
| `MazLink.vue` | When acting as button |
| `MazDropdown.vue` | `--disabled` |
| `MazPopover.vue` | `--disabled` |
| `MazDatePicker.vue` | Trigger disabled |
| `MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarGrid.vue` | Disabled days |
| `MazDropzone.vue` | Disabled drop zone |
| `MazStepper.vue` | Disabled steps |
| `MazTabsBar.vue` | Disabled tabs |
| `MazTimeline.vue` | Disabled steps |

#### 6.5 `fontSize` scale — replace per-component size mappings

Many components define their own `SIZE_CLASS` / `CHILD_TEXT_SIZE_CLASS` map keyed on `MazSize`. With the new global `--text-{key}` exposed via the bridge, those maps can shrink to:

```diff
- const SIZE_TEXT_CLASS = { mini: 'maz:text-xs', xs: 'maz:text-xs', sm: 'maz:text-sm', md: 'maz:text-base', lg: 'maz:text-lg', xl: 'maz:text-xl' } as const
+ // Use `maz:text-${size}` directly with size keys mini..xl now bound to the global scale.
```

Affected files (per current SIZE_CLASS / SIZE_TEXT_CLASS / CHILD_TEXT_SIZE_CLASS hardcodes):

| File | Map name |
| --- | --- |
| `MazBtn.vue` | `SIZE_CLASS` (text via `text-sm` / `text-xs`) |
| `MazInput.vue` | `CHILD_TEXT_SIZE_CLASS` |
| `MazSelect.vue` | `SIZE_TEXT_CLASS` (added in v5 perf pass) |
| `MazTimeline.vue` | `TITLE_SIZE_CLASS`, `SUBTITLE_SIZE_CLASS` |
| `MazRadioButtons.vue` | `SIZE_CLASS` |
| `MazDropdown.vue` | Inline size→class (`iconClassSize`) |
| `MazInputCode.vue` | `SIZE_CLASS` |
| `MazBadge.vue` | Size-driven font-size |
| `MazAvatar.vue` | Size-driven font-size |
| `MazTabsBar.vue` | Size-driven |
| `MazPagination.vue` | Size-driven |
| `MazTable.vue` (cells, rows, titles) | `--${size}` classes |

After the refactor, the bridge exposes `--text-mini`, `--text-xs`, …, `--text-xl` so `maz:text-mini`, `maz:text-xs`, etc. all work. Each component keeps its `MazSize` prop and just emits `maz:text-${size}` on the right element.

#### 6.6 `radius` scale — replace fixed `rounded-*`

Today components use `rounded-md`, `rounded-lg`, `rounded-xs`, etc. directly. Once the bridge maps `--radius-{key}` to the consumer-overridable values, these utilities Just Work. No code change needed in components — the override flows through Tailwind. The `foundation.radius` removal is the only migration: components that referenced `var(--maz-radius)` directly (none today, after grep, but verify) need to point at `var(--maz-radius-md)` or whichever palier matches.

#### 6.7 `shadow` scale — replace `shadow-elevation` and friends

Same as radius: the bridge takes care of it. `shadow-elevation`, `shadow-md`, `shadow-lg` continue to work but are now consumer-controllable.

| File | Notes |
| --- | --- |
| Components using `shadow-elevation` — `MazCard.vue`, `MazContainer.vue`, `MazPopover.vue`, `MazDropdown.vue`, `MazSelect.vue` (list), `MazDialog.vue`, `MazDrawer.vue`, `MazTimeline.vue` (`box-shadow` keyframe — verify) | No change in source; bridge handles it |

#### 6.8 `font-display` — opt-in heading font

`font-display` defaults to the same value as `font-sans`. Components that should honor a separate display font when the consumer customizes:

| File | Heading element |
| --- | --- |
| `MazContainer.vue` | `.m-container__header` title (currently no font-* class) |
| `MazCard.vue` | Card title |
| `MazDialog.vue` | `.m-dialog__title` |
| `MazAlert.vue` | Alert title |
| `MazTimeline.vue` | `.m-timeline-title` |
| `MazDrawer.vue` | `.m-drawer-header__title` |
| `MazSelectCountry.vue` | Country name in selector (verify — could stay sans) |

Migration: add `maz:font-display` (Tailwind utility once exposed via the bridge) on the title element.

#### 6.9 `font-mono` — code-style content

| File | Notes |
| --- | --- |
| `MazInputCode.vue` | Add `maz:font-mono` on each digit input — improves visual alignment for verification codes |

Most `font-mono` usage will come from consumers wrapping `<code>` / `<kbd>` inside MazContainer/MazCard. Those rely on the global `--font-mono` Tailwind utility being correctly bridged — which is the only deliverable on our side.

### Migration phasing

The migrations above should not all land in a single PR. Order matters:

1. **Bridge + types + presets** (no component change yet). Components keep working with current Tailwind defaults; the new `--maz-*` vars exist but aren't consumed yet.
2. **Components — token migration, batched**:
   - Batch A: `container.bg` migration (≈14 files)
   - Batch B: `input.bg` migration (≈12 files)
   - Batch C: `disabled-*` centralization (≈17 files)
   - Batch D: `btn.font-weight` (1 file) + `font-display` (≈7 files) + `font-mono` (1 file)
   - Batch E: `fontSize` scale unification (≈12 files) — last, because it's the most invasive (per-component map removals).
3. **Smoke + visual diff** after each batch: docs site, vue-app demo, a representative scroll through Storybook (if it exists, else manual). Coverage tests will catch structural breakage; visuals need a human eye.

## Type updates

`packages/themes/src/types.ts` gets:

```ts
export interface ThemePreset {
  name: string
  foundation: ThemeFoundation
  scales: ThemeScales            // NEW
  components?: ThemeComponents   // NEW, optional
  colors: { light: ThemeColors, dark: ThemeColors }
}
```

The existing 4 presets (`mazUi`, `ocean`, `pristine`, `obsidian`) need a `scales` block populated with the defaults above (or close variations if a preset wants its own visual identity — e.g. `obsidian` might want darker shadows).

## Rollout plan

### Phase 1 — package work (`@maz-ui/themes`)

1. **Types** in `packages/themes/src/types/index.ts`:
   - Add `ThemeScales` interface (spacing, radius, shadow, fontSize).
   - Add `ThemeComponents` interface (btn, container, input).
   - Extend `ThemeFoundation` (`font-mono`, `font-display`, `disabled-opacity`, `disabled-cursor`; remove `radius`).
   - Update `ThemeColors` interface: remove `background`, `border` keys; add `surface`, `divider` keys (rename, not addition).
   - Update `ThemePreset` with `scales: ThemeScales` and optional `components?: ThemeComponents`.
2. **Update the 4 presets** (`mazUi`, `pristine`, `ocean`, `obsidian`):
   - Rename `background` → `surface`, `border` → `divider` in both `colors.light` and `colors.dark`.
   - Move `foundation.radius` value to `scales.radius.md`, fill the rest of the scale with the proposed defaults.
   - Add `scales.spacing`, `scales.shadow`, `scales.fontSize` with the proposed defaults.
   - Add `foundation.font-mono`, `foundation.font-display` (default to `font-family`), `foundation.disabled-opacity`, `foundation.disabled-cursor`.
3. **Runtime injection** (`packages/themes/src/utils/setup-theme.ts` and friends):
   - Emit the new `--maz-*` vars (spacing, radius scale, shadow scale, fontSize scale + line-height, font-mono, font-display, disabled-*).
   - Mode-aware injection for `--m-container-bg`, `--m-input-bg` (different value under `[data-theme="dark"]`).
   - Rename emitted vars: `--maz-background[-{N}]` → `--maz-surface[-{N}]`, `--maz-border[-{N}]` → `--maz-divider[-{N}]`.
   - Strict: no compat alias for the renamed keys (see "Backward compatibility" above).
4. **Theme tests**:
   - Unit tests in `packages/themes/src/composables/__tests__/useTheme.test.ts` for the new fields.
   - Snapshot tests on the generated CSS (the four presets) — add a fixture per preset.
   - Tests that verify the new `--m-container-bg` / `--m-input-bg` flip on dark mode.

### Phase 2 — bridge + lib

5. **CSS bridge** — add `packages/lib/src/tailwindcss/theme-scales.css` with `@theme inline` mapping for spacing / radius / shadow / fontSize / font-mono / font-display, and update `theme-colors.css` to remove the now-stale `--color-divider: var(--maz-border)` aliasing (point directly at `--maz-divider`, same for surface).
6. **Smoke-build** the lib — confirm Tailwind utilities `maz:rounded-md`, `maz:shadow-elevation`, `maz:text-md`, `maz:bg-surface`, `maz:border-divider` still work. No component change yet.

### Phase 3 — component migrations (batched, see §6)

7. **Batch A — `container.bg`**: ≈14 files, plus tests.
8. **Batch B — `input.bg`**: ≈12 files, plus tests.
9. **Batch C — `disabled-*`**: ≈17 files, plus tests.
10. **Batch D — `btn.font-weight` + `font-display` + `font-mono`**: 9 files, plus tests.
11. **Batch E — `fontSize` scale unification**: ≈12 files, plus tests.

After each batch: `pnpm test:unit` (entire lib), `pnpm typecheck`, `pnpm lint`, smoke-test docs site + `apps/vue-app`.

### Phase 4 — props rename in components

12. **Rename `color="background"` → `color="surface"`** in:
    - `packages/lib/src/components/types.ts` (the literal union `MazColor`)
    - `MazBtn.vue`, `MazDropdown.vue`, `MazPagination.vue`
    - all tests / spec files using `color: 'background'`
    - all docs and demos using `color="background"`

### Phase 5 — documentation

13. **`apps/docs/src/guide/migration-v5.md`** — new sections:
    - "Theme preset key renames: `background` → `surface`, `border` → `divider`"
    - "Theme: `foundation.radius` → `scales.radius.md`"
    - "Theme: new `scales`, `components` blocks (additive)"
    - "Component prop: `color=\"background\"` → `color=\"surface\"`"
14. **`apps/docs/src/guide/themes.md`** — full overhaul:
    - Update all preset code samples (`background` → `surface`, `border` → `divider`)
    - Document the new `scales`, `components`, new `foundation` keys
    - Replace HSL examples with OKLCh (already partially done) and the new key names
    - Update the "Generated CSS Variables" section to reflect `--maz-surface*` / `--maz-divider*` and the new scale vars
    - Add a "Customizing scales" subsection with copy-paste examples for `radius`, `shadow`, `fontSize`, etc.
    - Add a "Per-component overrides" subsection explaining `components.btn.font-weight`, `components.container.bg`, `components.input.bg`
    - Update the demo at `applyCustomTheme()` so the `customPreset` uses the new keys
15. **`packages/themes/README.md`** — sync with `themes.md` (key renames, new sections, examples).
16. **`apps/docs/src/guide/getting-started.md`** — only the few lines that name `border`/`background` — usually a `bg-background` becomes `bg-surface`, etc. Audit and update.
17. **`apps/docs/src/guide/tailwind.md`** — references the bridge mappings; update.
18. **`apps/docs/src/guide/maz-ui-provider.md`** — if it shows preset code, update key names.
19. **`apps/docs/src/guide/vue.md`** and **`apps/docs/src/guide/nuxt.md`** — same audit.
20. **`apps/docs/src/guide/cli.md`** — only if it references theme preset code.
21. **`apps/docs/src/blog/v4.md`** — historical, should NOT be edited (snapshot of v4).
22. **`apps/docs/src/components/maz-backdrop.md`**, **`maz-card-spotlight.md`** — only if their snippets mention the renamed keys.
23. **`apps/docs/src/index.md`** — only if it features the renamed keys.
24. **Component pages** — any component doc page that uses `color="background"` in an example needs `color="surface"`. Targets at minimum: `apps/docs/src/components/maz-btn.md`, `maz-dropdown.md`, `maz-pagination.md`.

After phase 5, do a final `rg -i "color=\\\"background\\\"|--maz-background|--maz-border\\b|colors\\.(light|dark)\\.(background|border)\\b"` across the whole repo to catch leftovers.

## Tests

Each phase ships with tests:

- **Phase 1** — unit tests on the runtime: emitted CSS vars match expectations for each preset; soft-compat path absent (i.e. throws or warns clearly if a preset still uses the old keys).
- **Phase 3** — for each batch, the existing component tests stay green. Add specific tests for the new tokens where behavior is observable from JS (e.g. `MazBtn` emits `font-weight` style, `MazInput` reflects the `--m-input-bg` var on the wrapper).
- **Phase 4** — rename `color="background"` → `color="surface"` in all spec files alongside the source change. Add a typecheck guard test that ensures `'background'` is no longer accepted as a `MazColor` literal.
- **Phase 5** — docs are not testable beyond markdown lint; do a manual read-through of each page, view the docs site locally, click each demo.

Coverage thresholds in `vitest.config.ts` may need a small bump if the new code adds covered lines — re-baseline after Phase 1.

## Naming alignment (additional breaking changes — same release window)

The current preset key names diverge from how the library actually uses the colors:

- Preset uses **`border`**, but components consume it as `divider` (via `theme-colors.css` alias `--color-divider: var(--maz-border)`). Confusing for preset authors who think they're styling a "border" but are actually styling dividers.
- Preset uses **`background`**, but components consume it as `surface` (via `theme-colors.css` alias `--color-surface: var(--maz-background)`). Plus a few component props expose `color="background"` which is misleading.

We align everything on the consumer-facing names: **`divider`** and **`surface`**.

### What changes

**Preset keys:**

| v4 / current | v5 / new |
| --- | --- |
| `colors.{light,dark}.border` | `colors.{light,dark}.divider` |
| `colors.{light,dark}.background` | `colors.{light,dark}.surface` |

**Runtime CSS variables:**

| v4 / current | v5 / new |
| --- | --- |
| `--maz-border`, `--maz-border-{50..900}` | `--maz-divider`, `--maz-divider-{50..900}` |
| `--maz-background`, `--maz-background-{50..900}` | `--maz-surface`, `--maz-surface-{50..900}` |

**Tailwind bridge** (`packages/lib/src/tailwindcss/theme-colors.css`): aliases collapse — `--color-divider` and `--color-surface` already exist and continue to work, but they now point directly at `--maz-divider` / `--maz-surface` (the rename target), no aliasing layer.

**Component props** (search `'background'` in `packages/lib/src/components/types.ts` and the 3 component files using `color="background"`):

| File | v4 / current | v5 / new |
| --- | --- | --- |
| `packages/lib/src/components/types.ts` | `'background'` literal in the union | rename to `'surface'` |
| `MazBtn.vue` | `color="background"` accepted | rename to `color="surface"` |
| `MazDropdown.vue` | `color="background"` accepted | rename to `color="surface"` |
| `MazPagination.vue` | `color="background"` accepted | rename to `color="surface"` |

This is a clean rename: every internal usage of `bg-background`, `text-background-foreground`, `--maz-background-*` follows the same `s/background/surface/` and `s/border/divider/` pattern. The Tailwind utilities `maz:bg-surface`, `maz:border-divider` already work today (the aliases existed) — the rename is mostly at the CSS-variable / preset-key / component-prop level.

### What does NOT change

- Tailwind utilities `maz:bg-surface`, `maz:border-divider`, `maz:text-divider-700` — these were already exposed and remain stable.
- The CSS color values — only the keys and var names change.

## Backward compatibility

We're in a v5 major release with already-documented breakings, so we **don't add a compat layer** in `@maz-ui/themes` runtime. Preset authors rename:

- `colors.light.background` → `colors.light.surface`
- `colors.dark.background` → `colors.dark.surface`
- `colors.light.border` → `colors.light.divider`
- `colors.dark.border` → `colors.dark.divider`
- `foundation.radius` → `scales.radius.md`

Everything else (new tokens) defaults sensibly when omitted. Consumers who never touched a preset key see no change.

If demand for compat aliases shows up post-release, we can ship them as a non-breaking opt-in in 5.x. Not before.

## Breaking changes (consolidated)

| What | Migration |
| --- | --- |
| `foundation.radius` removed | Move value to `scales.radius.md` |
| Color key `background` renamed | `colors.{light,dark}.background` → `colors.{light,dark}.surface` |
| Color key `border` renamed | `colors.{light,dark}.border` → `colors.{light,dark}.divider` |
| CSS variable `--maz-background[-{N}]` renamed | Use `--maz-surface[-{N}]` (or stick with the unchanged `maz:bg-surface` Tailwind utility) |
| CSS variable `--maz-border[-{N}]` renamed | Use `--maz-divider[-{N}]` (or stick with `maz:border-divider`) |
| `MazBtn` / `MazDropdown` / `MazPagination` `color="background"` removed | Use `color="surface"` |

All other additions are pure additions.

## Open questions

- Should `shadow.elevation` be a synonym for `shadow.lg`, or genuinely a different token? Today it's used for "this surface is floating above the page" (cards, popovers). Keeping it separate gives consumers a way to customize elevated surfaces without touching all the other shadows.
- Should we expose more `font-*` keys (`font-display-weight`, `font-mono-weight`)? Probably not — consumers can use `font-bold`, `font-semibold` Tailwind utilities. Keep it tight.
- `disabled-cursor` of `'default'` (instead of `'not-allowed'`) is a common request from accessibility folks. Worth defaulting to `'not-allowed'` everywhere or letting each preset choose? **Default to `'not-allowed'`**, presets can override.
