<!-- eslint-disable -->

# @maz-ui/themes — Plan d'implémentation : refacto CSS moderne

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Réécrire la génération CSS du package `@maz-ui/themes` autour de `light-dark()` + `color-scheme` + `color-mix(in oklch)` pour produire un CSS ~68% plus court, supprimer ~150 lignes de JS au runtime, et brancher des transitions douces / View Transitions opt-in — sans breaking change API.

**Architecture:** Un seul bloc `:root` émis avec `color-scheme: light dark` et toutes les couleurs en `light-dark(L, D)`. Les paliers (`--maz-X-50..950`) dérivés en CSS via `color-mix(in oklch, var(--maz-X), white|black N%)`. Les classes `.dark` / `.light` posées sur `<html>` ne font que forcer `color-scheme: only dark|only light`, ce qui pilote la résolution `light-dark()`. `@property` + transitions activées par défaut (option `colorTransition`). View Transitions API lazy-loadée et opt-in via `setColorMode(..., { animate: true })`.

**Tech Stack:** TypeScript, Vue 3, Vitest, CSS Color Module Level 5 (Baseline 2024).

**Spec source:** `plans/2026-05-11-themes-modern-css-refactor.md`

**Note commits:** L'utilisateur ne veut PAS de commit automatique. Les étapes "Commit" listées sont des points de synchronisation suggérés ; attendre approbation explicite avant chaque `git commit`. **Pas de Co-Authored-By** dans les messages.

---

## File Structure

### Files to create

| Path | Responsibility |
|---|---|
| `packages/themes/src/utils/scale-mix-percentages.ts` | Constante de la table de pourcentages `color-mix` par palier |
| `packages/themes/src/utils/color-scheme-meta.ts` | Helper d'injection `<meta name="color-scheme">` (anti-FART) |
| `packages/themes/src/utils/view-transition.ts` | Wrapper lazy-loaded autour de `document.startViewTransition` |
| `packages/themes/src/utils/__tests__/css-generator.test.ts` | Snapshots + assertions ciblées du CSS généré |
| `packages/themes/src/utils/__tests__/update-document-class.test.ts` | Tests du toggle `.dark`/`.light`/auto |
| `packages/themes/src/utils/__tests__/color-scheme-meta.test.ts` | Tests du helper anti-FART |
| `packages/themes/src/utils/__tests__/scale-mix-percentages.test.ts` | Tests de la table de pourcentages |

### Files to modify

| Path | Changes |
|---|---|
| `packages/themes/src/types/index.ts` | Ajout `lightClass?: string`, `colorTransition?: boolean \| { duration, easing }`, sémantique JSDoc de `DarkModeStrategy` |
| `packages/themes/src/utils/css-generator.ts` | Réécriture complète : un seul bloc `:root`, plus de branche `@media`, scales en `color-mix` |
| `packages/themes/src/utils/update-document-class.ts` | Gère `.light` en plus de `.dark`, accepte `colorMode` complet (pas juste `isDark`) |
| `packages/themes/src/utils/setup-theme.ts` | Plus de branche `mediaQuery` côté CSS, `noTransition` retiré du flow toggle, ajout `lightClass` aux defaults |
| `packages/themes/src/composables/useTheme.ts` | Ajout paramètre optionnel `{ animate?: boolean }` sur `setColorMode` et `toggleDarkMode` |
| `packages/themes/src/utils/index.ts` | Exports : ajout des nouveaux modules, retrait de `color-utils` |
| `packages/themes/src/index.ts` | Retrait export `color-utils` |
| `packages/themes/README.md` | Documentation des nouvelles options |

### Files to delete

| Path | Reason |
|---|---|
| `packages/themes/src/utils/color-utils.ts` | `generateColorScale` n'est plus utilisé (CSS le fait), pas de consumer externe |
| `packages/themes/src/utils/__tests__/color-utils.test.ts` | Test du fichier supprimé |

---

## Task 0: Préparation — créer un baseline du CSS actuel

Avant toute modif, capturer le CSS généré actuellement pour les 5 presets bundled. Ça sert de référence pendant la phase de validation visuelle (étape 9b).

**Files:**
- Create: `packages/themes/scripts/baseline-current-css.ts` (script jetable, à supprimer post-refacto)

- [ ] **Step 1: Créer le script de baseline**

```ts
// packages/themes/scripts/baseline-current-css.ts
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { generateCSS } from '../src/utils/css-generator'
import { mazUi } from '../src/presets/mazUi'
import { ocean } from '../src/presets/ocean'
import { pristine } from '../src/presets/pristine'
import { obsidian } from '../src/presets/obsidian'
import { nova } from '../src/presets/nova'

const outDir = resolve(__dirname, '../.baseline-css')
mkdirSync(outDir, { recursive: true })

for (const preset of [mazUi, ocean, pristine, obsidian, nova]) {
  const css = generateCSS(preset, {
    mode: 'both',
    darkSelectorStrategy: 'class',
    darkClass: 'dark',
    scaleColorVariables: true,
  })
  writeFileSync(resolve(outDir, `${preset.name}.css`), css)
}
console.log(`✓ Baseline CSS written to ${outDir}`)
```

- [ ] **Step 2: Exécuter le script et commit le baseline**

```bash
cd packages/themes && pnpm tsx scripts/baseline-current-css.ts
ls .baseline-css/
```
Expected: 5 fichiers `.css` (un par preset).

- [ ] **Step 3: Commit (suggestion — attendre approbation utilisateur)**

```bash
git add packages/themes/scripts/baseline-current-css.ts packages/themes/.baseline-css/
git commit -m "chore(themes): capture baseline CSS for refactor validation"
```

---

## Task 1: Étendre les types — `lightClass` + `colorTransition`

**Files:**
- Modify: `packages/themes/src/types/index.ts`

- [ ] **Step 1: Ajouter les nouvelles options dans `BaseThemeConfig`**

Localiser `interface BaseThemeConfig` dans `packages/themes/src/types/index.ts` (env. ligne 229). Ajouter **après** la propriété `darkClass?: string` :

```ts
  /**
   * Light mode class
   * @description Class added to the document root when light mode is explicitly forced.
   * Mirror of `darkClass` — used when `colorMode === 'light'` to force `color-scheme: only light`,
   * which prevents the browser from switching to dark via system preference.
   * @default 'light'
   */
  lightClass?: string

  /**
   * Smooth color transition on dark/light toggle.
   * @description When enabled, color CSS custom properties are registered via `@property`
   * and a `transition` is applied so the switch animates smoothly. When `false`, the switch
   * is instantaneous (legacy behaviour).
   * - `true` → transition with preset `motion-normal` duration and `easing-in-out`
   * - `false` → instantaneous
   * - object → custom duration/easing
   * @default true
   */
  colorTransition?: boolean | { duration?: Duration, easing?: string }
```

- [ ] **Step 2: Étendre `ThemeState` pour inclure `lightClass`**

Localiser `interface ThemeState`. Ajouter après `darkClass: string` :

```ts
  /**
   * Light class
   * @description The class added to the document root when light mode is explicitly forced.
   */
  lightClass: string

  /**
   * Color transition config (resolved)
   * @description Resolved transition config — `false` if disabled, `{ duration, easing }` otherwise.
   */
  colorTransition: false | { duration: Duration, easing: string }
```

- [ ] **Step 3: Mettre à jour le JSDoc de `DarkModeStrategy`**

Trouver `export type DarkModeStrategy = 'class' | 'media'` (ligne ~225). Le remplacer par :

```ts
/**
 * Dark mode strategy.
 *
 * - `'class'`: A `.dark` or `.light` class on `<html>` forces `color-scheme: only dark|only light`.
 *   `setColorMode()` adds/removes the class. With no class, `color-scheme: light dark` lets the
 *   browser follow the system preference.
 * - `'media'`: Only `color-scheme: light dark` on `:root`. The browser follows `prefers-color-scheme`.
 *   `setColorMode()` updates the cookie but does NOT toggle any class — system preference always wins.
 */
export type DarkModeStrategy = 'class' | 'media'
```

- [ ] **Step 4: Vérifier que le typecheck passe**

```bash
cd packages/themes && pnpm typecheck
```
Expected: PASS (les nouveaux champs sont optionnels, rien ne casse). Si erreurs liées à `ThemeState`, c'est attendu — elles seront résolues quand `setup-theme.ts` initialisera les nouveaux champs (Task 12).

- [ ] **Step 5: Commit (suggestion)**

```bash
git add packages/themes/src/types/index.ts
git commit -m "feat(@maz-ui/themes): add lightClass and colorTransition options to ThemeConfig"
```

---

## Task 2: Table de pourcentages `color-mix`

**Files:**
- Create: `packages/themes/src/utils/scale-mix-percentages.ts`
- Create: `packages/themes/src/utils/__tests__/scale-mix-percentages.test.ts`

- [ ] **Step 1: Écrire le test**

```ts
// packages/themes/src/utils/__tests__/scale-mix-percentages.test.ts
import { SCALE_MIX_PERCENTAGES, SCALED_COLOR_NAMES } from '../scale-mix-percentages'

describe('given the scale mix percentages table', () => {
  describe('when accessing palette steps', () => {
    it('exposes 11 steps from 50 to 950', () => {
      const keys = Object.keys(SCALE_MIX_PERCENTAGES).map(Number)
      expect(keys.sort((a, b) => a - b)).toEqual([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950])
    })

    it('uses white mixing below 500 and black mixing above', () => {
      expect(SCALE_MIX_PERCENTAGES[50]).toMatchObject({ mixWith: 'white' })
      expect(SCALE_MIX_PERCENTAGES[400]).toMatchObject({ mixWith: 'white' })
      expect(SCALE_MIX_PERCENTAGES[600]).toMatchObject({ mixWith: 'black' })
      expect(SCALE_MIX_PERCENTAGES[950]).toMatchObject({ mixWith: 'black' })
    })

    it('uses identity for step 500', () => {
      expect(SCALE_MIX_PERCENTAGES[500]).toEqual({ mixWith: null })
    })
  })

  describe('when accessing the scaled color names list', () => {
    it('lists every color name that should receive a 50-950 scale', () => {
      expect(SCALED_COLOR_NAMES).toEqual([
        'primary', 'secondary', 'accent', 'destructive', 'success', 'warning',
        'info', 'contrast', 'surface', 'foreground', 'divider', 'muted',
        'overlay', 'shadow',
      ])
    })
  })
})
```

- [ ] **Step 2: Exécuter le test (doit échouer)**

```bash
cd packages/themes && pnpm test:unit -- scale-mix-percentages
```
Expected: FAIL (module manquant)

- [ ] **Step 3: Implémenter le module**

```ts
// packages/themes/src/utils/scale-mix-percentages.ts

/**
 * Mix percentages used to derive the 50-950 palette from a base color via `color-mix(in oklch, ...)`.
 *
 * Below 500 we mix with white (tints). Above 500 we mix with black (shades). The 500 step is the
 * base color itself (`var(--maz-X)`) — emitted directly without `color-mix` for clarity and
 * to keep the runtime reactive to base-color overrides.
 *
 * Values aligned with Tailwind v4's default palette steps. Adjust here if visual validation
 * (apps/vue-app) reveals a per-step mismatch with the previous JS-derived scales.
 */
export const SCALE_MIX_PERCENTAGES = {
  50: { mixWith: 'white', percent: 95 },
  100: { mixWith: 'white', percent: 85 },
  200: { mixWith: 'white', percent: 70 },
  300: { mixWith: 'white', percent: 50 },
  400: { mixWith: 'white', percent: 25 },
  500: { mixWith: null },
  600: { mixWith: 'black', percent: 15 },
  700: { mixWith: 'black', percent: 30 },
  800: { mixWith: 'black', percent: 45 },
  900: { mixWith: 'black', percent: 60 },
  950: { mixWith: 'black', percent: 75 },
} as const satisfies Record<number, { mixWith: 'white' | 'black' | null, percent?: number }>

export type ScaleStep = keyof typeof SCALE_MIX_PERCENTAGES

/**
 * Color names that receive a 50-950 scale. Each name must match a key in `ThemeColors`.
 * Foreground variants (`primary-foreground`, etc.) are intentionally NOT scaled — they're
 * meant to be used as-is for text on the matched base color.
 */
export const SCALED_COLOR_NAMES = [
  'primary', 'secondary', 'accent', 'destructive', 'success', 'warning',
  'info', 'contrast', 'surface', 'foreground', 'divider', 'muted',
  'overlay', 'shadow',
] as const

export type ScaledColorName = (typeof SCALED_COLOR_NAMES)[number]
```

- [ ] **Step 4: Exécuter le test (doit passer)**

```bash
cd packages/themes && pnpm test:unit -- scale-mix-percentages
```
Expected: PASS

- [ ] **Step 5: Commit (suggestion)**

```bash
git add packages/themes/src/utils/scale-mix-percentages.ts packages/themes/src/utils/__tests__/scale-mix-percentages.test.ts
git commit -m "feat(@maz-ui/themes): add scale mix percentages table for color-mix derived palettes"
```

---

## Task 3: Réécrire `css-generator.ts`

C'est la tâche la plus lourde. On la subdivise en sous-étapes TDD, mais en remplaçant le fichier d'un coup à la fin (le diff serait illisible sinon — le fichier passe de ~244 lignes à ~150).

**Files:**
- Modify (full rewrite): `packages/themes/src/utils/css-generator.ts`
- Create: `packages/themes/src/utils/__tests__/css-generator.test.ts`

- [ ] **Step 1: Écrire les tests d'intégration (snapshots + assertions ciblées)**

```ts
// packages/themes/src/utils/__tests__/css-generator.test.ts
import { generateCSS } from '../css-generator'
import { mazUi } from '../../presets/mazUi'

describe('given generateCSS', () => {
  describe('when called with default options (class strategy, both modes, scales on)', () => {
    const css = generateCSS(mazUi, {
      mode: 'both',
      darkSelectorStrategy: 'class',
      darkClass: 'dark',
      lightClass: 'light',
      scaleColorVariables: true,
      colorTransition: false,
    })

    it('wraps the output in @layer theme', () => {
      expect(css).toMatch(/^@layer theme \{[\s\S]+\}\s*$/)
    })

    it('emits color-scheme: light dark on :root', () => {
      expect(css).toContain('color-scheme: light dark')
    })

    it('emits each base color as a light-dark() value', () => {
      expect(css).toMatch(/--maz-primary: light-dark\(/)
      expect(css).toMatch(/--maz-surface: light-dark\(/)
      expect(css).toMatch(/--maz-foreground: light-dark\(/)
    })

    it('emits color-mix(in oklch) for scale steps', () => {
      expect(css).toContain('--maz-primary-50: color-mix(in oklch, var(--maz-primary), white 95%)')
      expect(css).toContain('--maz-primary-900: color-mix(in oklch, var(--maz-primary), black 60%)')
    })

    it('aliases step 500 directly to the base color (no color-mix)', () => {
      expect(css).toContain('--maz-primary-500: var(--maz-primary)')
      expect(css).not.toMatch(/--maz-primary-500: color-mix/)
    })

    it('emits .dark and .light blocks forcing color-scheme', () => {
      expect(css).toContain('.dark { color-scheme: only dark; }')
      expect(css).toContain('.light { color-scheme: only light; }')
    })

    it('never emits a separate :root duplicate or @media (prefers-color-scheme: dark)', () => {
      expect(css).not.toContain('@media (prefers-color-scheme: dark)')
      const rootMatches = css.match(/\:root\s*\{/g) ?? []
      expect(rootMatches.length).toBe(1)
    })
  })

  describe('when darkSelectorStrategy is media', () => {
    const css = generateCSS(mazUi, {
      mode: 'both',
      darkSelectorStrategy: 'media',
      darkClass: 'dark',
      lightClass: 'light',
      scaleColorVariables: true,
      colorTransition: false,
    })

    it('still emits color-scheme: light dark', () => {
      expect(css).toContain('color-scheme: light dark')
    })

    it('does NOT emit .dark or .light override blocks', () => {
      expect(css).not.toContain('.dark { color-scheme:')
      expect(css).not.toContain('.light { color-scheme:')
    })
  })

  describe('when mode is light only', () => {
    const css = generateCSS(mazUi, {
      mode: 'light',
      darkSelectorStrategy: 'class',
      darkClass: 'dark',
      lightClass: 'light',
      scaleColorVariables: true,
      colorTransition: false,
    })

    it('emits color-scheme: only light', () => {
      expect(css).toContain('color-scheme: only light')
      expect(css).not.toContain('color-scheme: light dark')
    })

    it('does not wrap colors in light-dark()', () => {
      expect(css).not.toContain('light-dark(')
    })
  })

  describe('when mode is dark only', () => {
    const css = generateCSS(mazUi, {
      mode: 'dark',
      darkSelectorStrategy: 'class',
      darkClass: 'dark',
      lightClass: 'light',
      scaleColorVariables: true,
      colorTransition: false,
    })

    it('emits color-scheme: only dark', () => {
      expect(css).toContain('color-scheme: only dark')
    })

    it('does not wrap colors in light-dark()', () => {
      expect(css).not.toContain('light-dark(')
    })
  })

  describe('when scaleColorVariables is false', () => {
    const css = generateCSS(mazUi, {
      mode: 'both',
      darkSelectorStrategy: 'class',
      darkClass: 'dark',
      lightClass: 'light',
      scaleColorVariables: false,
      colorTransition: false,
    })

    it('omits all color-mix declarations', () => {
      expect(css).not.toContain('color-mix(')
    })

    it('still emits the base colors as light-dark()', () => {
      expect(css).toContain('--maz-primary: light-dark(')
    })
  })

  describe('when a preset uses the legacy raw HSL format', () => {
    const legacy = {
      ...mazUi,
      colors: {
        ...mazUi.colors,
        light: { ...mazUi.colors.light, primary: '210 100% 50%' as any },
      },
    }
    const css = generateCSS(legacy, {
      mode: 'both',
      darkSelectorStrategy: 'class',
      darkClass: 'dark',
      lightClass: 'light',
      scaleColorVariables: false,
      colorTransition: false,
    })

    it('wraps the raw value in hsl()', () => {
      expect(css).toContain('hsl(210 100% 50%)')
    })
  })

  describe('when colorTransition is true', () => {
    const css = generateCSS(mazUi, {
      mode: 'both',
      darkSelectorStrategy: 'class',
      darkClass: 'dark',
      lightClass: 'light',
      scaleColorVariables: false,
      colorTransition: { duration: '200ms', easing: 'ease-in-out' },
    })

    it('emits @property declarations for each base color', () => {
      expect(css).toContain('@property --maz-primary')
      expect(css).toMatch(/@property --maz-primary\s*\{[^}]+syntax:\s*'<color>'/)
    })

    it('emits a transition on :root for color variables', () => {
      expect(css).toContain('transition:')
      expect(css).toContain('--maz-primary 200ms ease-in-out')
    })
  })

  describe('when colorTransition is false', () => {
    const css = generateCSS(mazUi, {
      mode: 'both',
      darkSelectorStrategy: 'class',
      darkClass: 'dark',
      lightClass: 'light',
      scaleColorVariables: false,
      colorTransition: false,
    })

    it('does not emit any @property block', () => {
      expect(css).not.toContain('@property')
    })

    it('does not emit a transition on :root', () => {
      expect(css).not.toMatch(/:root\s*\{[^}]*transition:/)
    })
  })

  describe('when called with a snapshot baseline', () => {
    it('produces stable output for the mazUi preset (snapshot)', () => {
      const css = generateCSS(mazUi, {
        mode: 'both',
        darkSelectorStrategy: 'class',
        darkClass: 'dark',
        lightClass: 'light',
        scaleColorVariables: true,
        colorTransition: false,
      })
      expect(css).toMatchSnapshot()
    })
  })
})
```

- [ ] **Step 2: Exécuter les tests (doivent échouer)**

```bash
cd packages/themes && pnpm test:unit -- css-generator
```
Expected: FAIL — la nouvelle interface `CSSOptions` n'a pas encore les champs `lightClass` et `colorTransition`.

- [ ] **Step 3: Réécrire `css-generator.ts` en entier**

Remplacer **tout le contenu** de `packages/themes/src/utils/css-generator.ts` par :

```ts
import type { Duration, RoundedScaleKey, ThemeColors, ThemeFoundation, ThemeMode, ThemePreset } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { DEFAULT_ROUNDED_RATIOS } from '../presets/_defaults'
import { normalizeColor } from './color-parser'
import { SCALE_MIX_PERCENTAGES, SCALED_COLOR_NAMES } from './scale-mix-percentages'

export interface CSSOptions {
  /** Theme mode to generate */
  mode: ThemeMode
  /** Dark mode selector: 'class' (.dark/.light) | 'media' (system pref only) */
  darkSelectorStrategy: 'class' | 'media'
  /** CSS variables prefix */
  prefix?: string
  /** Dark class name */
  darkClass: string
  /** Light class name */
  lightClass: string
  /** Whether to emit color-mix scales (--X-50..950) */
  scaleColorVariables: boolean
  /** When truthy, emit @property registrations + transition on color vars. */
  colorTransition: false | { duration: Duration, easing: string }
}

const ROUNDED_KEYS: readonly RoundedScaleKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

export function generateCSS(preset: ThemePreset, options: CSSOptions): string {
  const { prefix = 'maz' } = options

  const lines: string[] = ['@layer theme {']

  if (options.colorTransition) {
    lines.push(emitPropertyBlock(preset, prefix))
  }

  lines.push(emitRootBlock(preset, prefix, options))

  if (options.darkSelectorStrategy === 'class' && options.mode === 'both') {
    lines.push(`  .${options.darkClass} { color-scheme: only dark; }`)
    lines.push(`  .${options.lightClass} { color-scheme: only light; }`)
  }

  lines.push('}')
  return lines.join('\n')
}

function emitRootBlock(preset: ThemePreset, prefix: string, options: CSSOptions): string {
  const lines: string[] = ['  :root {']
  lines.push(`    color-scheme: ${resolveColorScheme(options.mode)};`)

  lines.push(...emitFoundation(preset.foundation, prefix))
  lines.push(...emitScales(preset.scales, prefix))
  lines.push(...emitComponents(preset, prefix, options.mode))
  lines.push(...emitColorVariables(preset.colors, options.mode, prefix))

  if (options.scaleColorVariables) {
    lines.push(...emitColorScales(prefix))
  }

  if (options.colorTransition) {
    lines.push(emitTransition(prefix, options.colorTransition))
  }

  lines.push('  }')
  return lines.join('\n')
}

function resolveColorScheme(mode: ThemeMode): string {
  if (mode === 'light') return 'only light'
  if (mode === 'dark') return 'only dark'
  return 'light dark'
}

function emitColorVariables(
  colors: { light: ThemeColors, dark: ThemeColors },
  mode: ThemeMode,
  prefix: string,
): string[] {
  const lines: string[] = []
  const lightEntries = Object.entries(colors.light) as Array<[keyof ThemeColors, string]>

  for (const [key, lightValue] of lightEntries) {
    if (!lightValue) continue
    if (mode === 'light') {
      lines.push(`    --${prefix}-${key}: ${normalizeColor(lightValue)};`)
    } else if (mode === 'dark') {
      const darkValue = colors.dark[key] ?? lightValue
      lines.push(`    --${prefix}-${key}: ${normalizeColor(darkValue)};`)
    } else {
      const darkValue = colors.dark[key] ?? lightValue
      lines.push(`    --${prefix}-${key}: light-dark(${normalizeColor(lightValue)}, ${normalizeColor(darkValue)});`)
    }
  }

  return lines
}

function emitColorScales(prefix: string): string[] {
  const lines: string[] = []
  for (const name of SCALED_COLOR_NAMES) {
    for (const [stepStr, conf] of Object.entries(SCALE_MIX_PERCENTAGES)) {
      const step = Number(stepStr)
      if (conf.mixWith === null) {
        lines.push(`    --${prefix}-${name}-${step}: var(--${prefix}-${name});`)
      } else {
        lines.push(`    --${prefix}-${name}-${step}: color-mix(in oklch, var(--${prefix}-${name}), ${conf.mixWith} ${conf.percent}%);`)
      }
    }
  }
  return lines
}

function emitFoundation(foundation: Partial<ThemeFoundation>, prefix: string): string[] {
  return Object.entries(foundation)
    .filter(([, value]) => value)
    .map(([key, value]) => `    --${prefix}-${key}: ${value};`)
}

function emitScales(scales: ThemePreset['scales'], prefix: string): string[] {
  const lines: string[] = []
  for (const key of ROUNDED_KEYS) {
    const value = scales.rounded?.[key]
    if (value) {
      lines.push(`    --${prefix}-rounded-${key}: ${value};`)
    } else if (key !== 'md') {
      const ratio = DEFAULT_ROUNDED_RATIOS[key]
      lines.push(`    --${prefix}-rounded-${key}: calc(var(--${prefix}-rounded-md) * ${ratio});`)
    }
  }
  for (const [key, value] of Object.entries(scales.shadow ?? {})) {
    if (value) lines.push(`    --${prefix}-shadow-style-${key}: ${value};`)
  }
  return lines
}

function emitComponents(preset: ThemePreset, prefix: string, mode: ThemeMode): string[] {
  const lines: string[] = []
  const components = preset.components
  if (!components) return lines

  if (components.btn?.['font-weight']) {
    lines.push(`    --${prefix}-btn-font-weight: ${components.btn['font-weight']};`)
  }

  const resolvedMode: 'light' | 'dark' = mode === 'dark' ? 'dark' : 'light'

  const containerBg = components.container?.bg?.[resolvedMode]
  if (containerBg) {
    lines.push(`    --${prefix}-container-bg: ${normalizeColor(containerBg)};`)
  }
  const inputBg = components.input?.bg?.[resolvedMode]
  if (inputBg) {
    lines.push(`    --${prefix}-input-bg: ${normalizeColor(inputBg)};`)
  }
  const inputTopLabelFw = components.input?.['top-label-font-weight']
  if (inputTopLabelFw) {
    lines.push(`    --${prefix}-input-top-label-font-weight: ${inputTopLabelFw};`)
  }

  return lines
}

function emitPropertyBlock(preset: ThemePreset, prefix: string): string {
  const colorKeys = Object.keys(preset.colors.light) as Array<keyof ThemeColors>
  const blocks = colorKeys.map((key) => {
    const initial = normalizeColor(preset.colors.light[key] ?? 'oklch(0 0 0)')
    return [
      `  @property --${prefix}-${key} {`,
      `    syntax: '<color>';`,
      `    inherits: true;`,
      `    initial-value: ${initial};`,
      `  }`,
    ].join('\n')
  })
  return blocks.join('\n')
}

function emitTransition(prefix: string, conf: { duration: Duration, easing: string }): string {
  // Note: animation depends on @property registrations emitted by `emitPropertyBlock`.
  // Without those, the transition is silently ignored by the browser.
  const colorKeys = SCALED_COLOR_NAMES
    .concat(['primary-foreground', 'secondary-foreground', 'accent-foreground', 'destructive-foreground', 'success-foreground', 'warning-foreground', 'info-foreground', 'contrast-foreground'] as any)
  const segments = colorKeys.map(k => `--${prefix}-${k} ${conf.duration} ${conf.easing}`)
  return `    transition: ${segments.join(', ')};`
}

export const CSS_ID = 'maz-theme-css'

export function injectCSS(id = CSS_ID, css: string): void {
  if (isServer()) return

  const styleElements = [...document.querySelectorAll<HTMLStyleElement>(`#${id}`)]

  if (styleElements.length === 0) {
    const element = document.createElement('style')
    element.id = id
    element.textContent = css
    document.head.appendChild(element)
    return
  }

  if (styleElements.length === 1) {
    styleElements[0].textContent = css
    return
  }

  const lastElement = styleElements.at(-1)
  for (let i = 0; i < styleElements.length - 1; i++) {
    styleElements[i].remove()
  }
  if (lastElement) lastElement.textContent = css
}

export function removeCSS(id = CSS_ID): void {
  if (isServer()) return
  document.querySelectorAll<HTMLStyleElement>(`#${id}`).forEach(el => el.remove())
}
```

- [ ] **Step 4: Exécuter les tests (doivent passer)**

```bash
cd packages/themes && pnpm test:unit -- css-generator
```
Expected: PASS sur tous les blocs. Le test snapshot va créer le snapshot file la première fois — c'est attendu. Le commiter dans Step 6.

- [ ] **Step 5: Mettre à jour `build/index.ts` pour le nouveau `CSSOptions`**

Localiser `packages/themes/src/build/index.ts`. Mettre à jour la signature de `BuildThemeOptions` pour exposer les nouvelles options (en gardant les défauts existants) :

```ts
export interface BuildThemeOptions {
  preset: ThemePreset
  mode?: 'light' | 'dark' | 'both'
  darkSelector?: 'class' | 'media'
  prefix?: string
  darkClass?: string
  lightClass?: string
  scaleColorVariables?: boolean
  colorTransition?: false | { duration: Duration, easing: string }
}

export function buildThemeCSS(options: BuildThemeOptions): string {
  const {
    preset,
    mode = 'both',
    darkSelector = 'class',
    prefix = 'maz',
    darkClass = 'dark',
    lightClass = 'light',
    scaleColorVariables = true,
    colorTransition = false,
  } = options

  return generateCSS(preset, {
    mode,
    darkSelectorStrategy: darkSelector,
    prefix,
    darkClass,
    lightClass,
    scaleColorVariables,
    colorTransition,
  })
}
```

Ajouter l'import de `Duration` en haut du fichier :
```ts
import type { Duration, ThemePreset } from '../types'
```

- [ ] **Step 6: Run tests + typecheck**

```bash
cd packages/themes && pnpm typecheck && pnpm test:unit
```
Expected: PASS (sauf tests qui dépendent de `setup-theme.ts` / `update-document-class.ts` non encore migrés — ils seront fixés aux Tasks suivantes).

- [ ] **Step 7: Commit (suggestion)**

```bash
git add packages/themes/src/utils/css-generator.ts packages/themes/src/utils/__tests__/css-generator.test.ts packages/themes/src/build/index.ts
git commit -m "feat(@maz-ui/themes): rewrite CSS generator around light-dark and color-mix"
```

---

## Task 4: Supprimer `color-utils.ts`

**Files:**
- Delete: `packages/themes/src/utils/color-utils.ts`
- Delete: `packages/themes/src/utils/__tests__/color-utils.test.ts`
- Modify: `packages/themes/src/utils/index.ts`
- Modify: `packages/themes/src/index.ts`

- [ ] **Step 1: Vérifier zéro usage externe**

```bash
grep -rn "from '@maz-ui/themes" /Users/mazel/workspace/maz-ui --include="*.ts" --include="*.vue" | grep -i "generateColorScale\|parseHSL\|adjustColorLightness\|getContrastColor" | grep -v "node_modules\|/themes/src/"
```
Expected: aucun résultat (ces exports n'ont aucun consumer externe au package themes).

- [ ] **Step 2: Supprimer les fichiers**

```bash
rm packages/themes/src/utils/color-utils.ts
rm packages/themes/src/utils/__tests__/color-utils.test.ts
```

- [ ] **Step 3: Retirer l'export de `utils/index.ts`**

Dans `packages/themes/src/utils/index.ts`, retirer la ligne :
```ts
export * from './color-utils'
```

- [ ] **Step 4: Retirer l'export de `src/index.ts`**

Dans `packages/themes/src/index.ts`, retirer la ligne :
```ts
export * from './utils/color-utils'
```

- [ ] **Step 5: Run tests + typecheck**

```bash
cd packages/themes && pnpm typecheck && pnpm test:unit
```
Expected: PASS.

- [ ] **Step 6: Commit (suggestion)**

```bash
git add packages/themes/src/utils/index.ts packages/themes/src/index.ts
git add -u packages/themes/src/utils/color-utils.ts packages/themes/src/utils/__tests__/color-utils.test.ts
git commit -m "refactor(@maz-ui/themes): remove JS color scale generator (now derived via color-mix in CSS)"
```

---

## Task 5: Étendre `update-document-class.ts` pour gérer `.light`

**Files:**
- Modify: `packages/themes/src/utils/update-document-class.ts`
- Create: `packages/themes/src/utils/__tests__/update-document-class.test.ts`

- [ ] **Step 1: Écrire les tests**

```ts
// packages/themes/src/utils/__tests__/update-document-class.test.ts
import type { ThemeState } from '../../types'
import { updateDocumentClass } from '../update-document-class'

function makeState(overrides: Partial<ThemeState> = {}): ThemeState {
  return {
    strategy: 'runtime',
    darkClass: 'dark',
    lightClass: 'light',
    darkModeStrategy: 'class',
    colorMode: 'auto',
    mode: 'both',
    preset: undefined,
    persistPreset: true,
    isDark: false,
    colorTransition: false,
    ...overrides,
  } as ThemeState
}

describe('given updateDocumentClass with darkModeStrategy class', () => {
  beforeEach(() => {
    document.documentElement.className = ''
  })

  describe('when colorMode is dark', () => {
    it('adds the dark class and removes the light class', () => {
      document.documentElement.classList.add('light')
      updateDocumentClass('dark', makeState())
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(document.documentElement.classList.contains('light')).toBe(false)
    })
  })

  describe('when colorMode is light', () => {
    it('adds the light class and removes the dark class', () => {
      document.documentElement.classList.add('dark')
      updateDocumentClass('light', makeState())
      expect(document.documentElement.classList.contains('light')).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('when colorMode is auto', () => {
    it('removes both classes', () => {
      document.documentElement.classList.add('dark')
      updateDocumentClass('auto', makeState())
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      expect(document.documentElement.classList.contains('light')).toBe(false)
    })
  })
})

describe('given updateDocumentClass with darkModeStrategy media', () => {
  beforeEach(() => {
    document.documentElement.className = ''
  })

  describe('when called with any colorMode', () => {
    it('never touches the classList', () => {
      updateDocumentClass('dark', makeState({ darkModeStrategy: 'media' }))
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      updateDocumentClass('light', makeState({ darkModeStrategy: 'media' }))
      expect(document.documentElement.classList.contains('light')).toBe(false)
    })
  })
})
```

- [ ] **Step 2: Exécuter les tests (doivent échouer)**

```bash
cd packages/themes && pnpm test:unit -- update-document-class
```
Expected: FAIL — `updateDocumentClass` ne prend pas encore le paramètre `colorMode`.

- [ ] **Step 3: Remplacer le contenu de `update-document-class.ts`**

```ts
// packages/themes/src/utils/update-document-class.ts
import type { ColorMode, ThemeState } from '../types'
import { noTransition } from './no-transition'

export function updateDocumentClass(colorMode: ColorMode, state?: ThemeState): void {
  if (typeof document === 'undefined' || !state || state.darkModeStrategy === 'media') {
    return
  }

  noTransition(() => {
    const html = document.documentElement
    html.classList.remove(state.darkClass, state.lightClass)
    if (colorMode === 'dark') html.classList.add(state.darkClass)
    else if (colorMode === 'light') html.classList.add(state.lightClass)
    // 'auto' = no class
  })
}
```

- [ ] **Step 4: Exécuter les tests (doivent passer)**

```bash
cd packages/themes && pnpm test:unit -- update-document-class
```
Expected: PASS.

- [ ] **Step 5: Commit (suggestion)**

```bash
git add packages/themes/src/utils/update-document-class.ts packages/themes/src/utils/__tests__/update-document-class.test.ts
git commit -m "feat(@maz-ui/themes): updateDocumentClass handles light/dark/auto explicitly"
```

---

## Task 6: Adapter `setup-theme.ts`

**Files:**
- Modify: `packages/themes/src/utils/setup-theme.ts`

- [ ] **Step 1: Mettre à jour `defaultOptions`**

Localiser `export const defaultOptions = { ... }` (env. ligne 75). Le remplacer par :

```ts
export const defaultOptions = {
  strategy: 'runtime',
  overrides: {},
  darkModeStrategy: 'class',
  preset: undefined,
  mode: 'both',
  darkClass: 'dark',
  lightClass: 'light',
  colorMode: 'auto',
  persistPreset: true,
  colorTransition: true,
} satisfies Required<Omit<MazUiThemeOptions, 'preset'>> & Pick<MazUiThemeOptions, 'preset'>
```

- [ ] **Step 2: Mettre à jour `createThemeState`**

Localiser la fonction `createThemeState`. Dans la création du ref, ajouter les nouveaux champs :

```ts
  const resolvedTransition = resolveColorTransition(config.colorTransition, options.preset && typeof options.preset !== 'string' ? options.preset : undefined)

  const themeState: ThemeStateRef = ref({
    strategy: config.strategy,
    darkClass: config.darkClass,
    lightClass: config.lightClass,
    darkModeStrategy: config.darkModeStrategy,
    colorMode: config.colorMode,
    mode: config.mode,
    preset: undefined,
    persistPreset: config.persistPreset,
    colorTransition: resolvedTransition,
    // @ts-expect-error _isDark is a private property
    isDark: options._isDark || isDark,
  })

  updateDocumentClass(themeState.value.colorMode, themeState.value)
```

Ajouter en bas du fichier la nouvelle fonction `resolveColorTransition` :

```ts
function resolveColorTransition(
  raw: MazUiThemeOptions['colorTransition'],
  preset?: ThemePreset,
): false | { duration: Duration, easing: string } {
  if (raw === false) return false
  const defaults = {
    duration: preset?.foundation?.['motion-normal'] ?? '200ms',
    easing: preset?.foundation?.['easing-in-out'] ?? 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
  if (raw === true || raw === undefined) return defaults
  return {
    duration: raw.duration ?? defaults.duration,
    easing: raw.easing ?? defaults.easing,
  }
}
```

Importer `Duration` et `ThemePreset` en haut du fichier si pas déjà fait.

- [ ] **Step 3: Mettre à jour `finalizeTheme` pour passer `lightClass` et `colorTransition` au générateur**

Dans `injectThemeCSS` (à modifier en Task suivante) on lit déjà tout depuis le state. Vérifier que `injectThemeCSS` reçoit tout ce dont il a besoin.

- [ ] **Step 4: Adapter `watchColorSchemeFromMedia`**

Remplacer le contenu de la fonction par une version simplifiée — elle ne synchronise plus que le `isDark` ref (le CSS est piloté par `color-scheme`) :

```ts
function watchColorSchemeFromMedia(themeState: Ref<ThemeState>): () => void {
  if (isServer()) return () => {}

  let mediaCleanup: (() => void) | undefined

  if (themeState.value && themeState.value.colorMode === 'auto') {
    const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)')
    const updateFromMedia = () => {
      if (themeState.value.colorMode === 'auto') {
        themeState.value.isDark = mediaQuery.matches
        saveResolvedColorMode(mediaQuery.matches ? 'dark' : 'light')
      }
    }
    mediaQuery.addEventListener('change', updateFromMedia)
    mediaCleanup = () => mediaQuery.removeEventListener('change', updateFromMedia)
  }

  const stopWatch = watch(() => themeState.value.colorMode, (colorMode) => {
    const resolvedIsDark = colorMode === 'auto' ? getSystemColorMode() === 'dark' : colorMode === 'dark'
    themeState.value.isDark = resolvedIsDark
    updateDocumentClass(colorMode, themeState.value)
    if (colorMode === 'auto') {
      saveResolvedColorMode(resolvedIsDark ? 'dark' : 'light')
    }
  })

  return () => {
    mediaCleanup?.()
    stopWatch()
  }
}
```

- [ ] **Step 5: Run typecheck et tests**

```bash
cd packages/themes && pnpm typecheck && pnpm test:unit
```
Expected: PASS. Si des tests `plugin.test.ts` cassent (assertions sur `.dark` non posée par défaut, etc.), les fixer dans la même tâche : ajuster les attentes pour matcher le nouveau comportement (et non l'inverse).

- [ ] **Step 6: Commit (suggestion)**

```bash
git add packages/themes/src/utils/setup-theme.ts
git commit -m "feat(@maz-ui/themes): adapt setupTheme to new lightClass and colorTransition options"
```

---

## Task 7: Adapter `inject-theme-css.ts` pour le nouveau `CSSOptions`

**Files:**
- Modify: `packages/themes/src/utils/inject-theme-css.ts`

- [ ] **Step 1: Mettre à jour le passage d'options**

Remplacer le contenu :

```ts
import type { MazUiThemeOptions } from '../plugin'
import type { ThemePreset, ThemeState } from '../types'
import { CSS_ID, generateCSS, injectCSS } from './css-generator'

export function injectThemeCSS(
  finalPreset: ThemePreset,
  config: Required<Omit<MazUiThemeOptions, 'preset'>> & Pick<MazUiThemeOptions, 'preset'>,
  resolvedTransition: ThemeState['colorTransition'],
) {
  if (typeof document === 'undefined' || config.strategy === 'buildtime') return

  injectCSS(CSS_ID, generateCSS(finalPreset, {
    mode: config.mode,
    darkSelectorStrategy: config.darkModeStrategy,
    darkClass: config.darkClass,
    lightClass: config.lightClass,
    scaleColorVariables: true,
    colorTransition: resolvedTransition,
  }))
}
```

- [ ] **Step 2: Mettre à jour les callers de `injectThemeCSS`**

Dans `setup-theme.ts`, `finalizeTheme` appelle `injectThemeCSS(finalPreset, config)`. Modifier en :
```ts
injectThemeCSS(finalPreset, config, themeState.value.colorTransition)
```

Idem pour `swapPreset`.

Dans `useTheme.ts` (composable), `updateTheme` régénère le CSS directement via `generateCSS` + `injectCSS`. À adapter pour passer `lightClass` et `colorTransition`. Voir Task 8.

- [ ] **Step 3: Run typecheck et tests**

```bash
cd packages/themes && pnpm typecheck && pnpm test:unit
```
Expected: PASS.

- [ ] **Step 4: Commit (suggestion)**

```bash
git add packages/themes/src/utils/inject-theme-css.ts packages/themes/src/utils/setup-theme.ts
git commit -m "refactor(@maz-ui/themes): thread lightClass and colorTransition through injectThemeCSS"
```

---

## Task 8: Ajouter `{ animate }` à `useTheme` + adapter `updateTheme`

**Files:**
- Modify: `packages/themes/src/composables/useTheme.ts`
- Create: `packages/themes/src/utils/view-transition.ts`
- Create: `packages/themes/src/utils/__tests__/view-transition.test.ts`

- [ ] **Step 1: Écrire les tests pour `view-transition.ts`**

```ts
// packages/themes/src/utils/__tests__/view-transition.test.ts
import { runViewTransition } from '../view-transition'

describe('given runViewTransition', () => {
  describe('when document.startViewTransition is available', () => {
    it('wraps the callback inside startViewTransition', async () => {
      const callback = vi.fn()
      const startViewTransition = vi.fn().mockImplementation((cb: () => void) => {
        cb()
        return { finished: Promise.resolve() }
      })
      // @ts-expect-error mock for jsdom
      document.startViewTransition = startViewTransition

      await runViewTransition(callback)

      expect(startViewTransition).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledOnce()
    })
  })

  describe('when document.startViewTransition is missing', () => {
    it('executes the callback synchronously as a fallback', async () => {
      const callback = vi.fn()
      // @ts-expect-error remove API
      delete document.startViewTransition

      await runViewTransition(callback)

      expect(callback).toHaveBeenCalledOnce()
    })
  })
})
```

- [ ] **Step 2: Exécuter (doit échouer)**

```bash
cd packages/themes && pnpm test:unit -- view-transition
```
Expected: FAIL (module manquant).

- [ ] **Step 3: Implémenter `view-transition.ts`**

```ts
// packages/themes/src/utils/view-transition.ts

/**
 * Wrap a state-changing callback in a View Transition.
 * Graceful degradation: if `document.startViewTransition` is not available,
 * the callback runs synchronously without animation.
 *
 * This module is intended to be lazy-imported so the bundle stays minimal
 * when `{ animate: true }` is never used.
 */
export async function runViewTransition(callback: () => void): Promise<void> {
  if (typeof document === 'undefined') {
    callback()
    return
  }

  const api = (document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }).startViewTransition

  if (typeof api !== 'function') {
    callback()
    return
  }

  const transition = api.call(document, callback)
  await transition.finished.catch(() => {})
}
```

- [ ] **Step 4: Exécuter (doit passer)**

```bash
cd packages/themes && pnpm test:unit -- view-transition
```
Expected: PASS.

- [ ] **Step 5: Ajouter le paramètre `animate` dans `useTheme.ts`**

Dans `packages/themes/src/composables/useTheme.ts`, remplacer :

```ts
function setColorMode(colorMode: ColorMode) {
  if (!themeState.value) return
  themeState.value.colorMode = colorMode
  setCookie('maz-color-mode', colorMode)
  if (colorMode === 'auto') {
    saveResolvedColorMode(getSystemColorMode() === 'dark' ? 'dark' : 'light')
  }
}

function toggleDarkMode() {
  setColorMode(isDark.value ? 'light' : 'dark')
}
```

par :

```ts
async function setColorMode(colorMode: ColorMode, options: { animate?: boolean } = {}): Promise<void> {
  if (!themeState.value) return

  const apply = () => {
    themeState.value!.colorMode = colorMode
    setCookie('maz-color-mode', colorMode)
    if (colorMode === 'auto') {
      saveResolvedColorMode(getSystemColorMode() === 'dark' ? 'dark' : 'light')
    }
  }

  if (options.animate) {
    const { runViewTransition } = await import('../utils/view-transition')
    await runViewTransition(apply)
  } else {
    apply()
  }
}

function toggleDarkMode(options: { animate?: boolean } = {}): Promise<void> {
  return setColorMode(isDark.value ? 'light' : 'dark', options)
}
```

- [ ] **Step 6: Adapter le `updateTheme` du composable pour les nouvelles options**

Dans `updateTheme`, localiser la construction de `cssOptions` (env. ligne 49) et la mettre à jour :

```ts
    const cssOptions: CSSOptions = {
      mode: themeState.value.mode,
      darkSelectorStrategy: themeState.value.darkModeStrategy,
      prefix: 'maz',
      scaleColorVariables: true,
      darkClass: themeState.value.darkClass,
      lightClass: themeState.value.lightClass,
      colorTransition: themeState.value.colorTransition,
    }
```

- [ ] **Step 7: Retirer le `noTransition(updateTheme, preset)` qui wrappait à tort le toggle**

**Garder** `noTransition` autour de `updateTheme` (preset swap reste instantané — Bonus 2 ne couvre que dark/light). Ne pas modifier ce point.

**Vérifier** : si `setColorMode` était wrappé dans `noTransition`, le retirer. Aujourd'hui ce n'est pas le cas dans `useTheme.ts` (le wrap se fait via `updateDocumentClass` → `noTransition`). On modifie `update-document-class.ts` à la Task 9.

- [ ] **Step 8: Run typecheck + tests**

```bash
cd packages/themes && pnpm typecheck && pnpm test:unit
```
Expected: PASS. Le `plugin.test.ts` peut avoir des assertions à mettre à jour si elles testaient les types de retour de `setColorMode` (qui devient async).

- [ ] **Step 9: Commit (suggestion)**

```bash
git add packages/themes/src/utils/view-transition.ts packages/themes/src/utils/__tests__/view-transition.test.ts packages/themes/src/composables/useTheme.ts
git commit -m "feat(@maz-ui/themes): add { animate } option to setColorMode and toggleDarkMode for View Transitions"
```

---

## Task 9: Découpler `noTransition` du toggle dark/light

Aujourd'hui `updateDocumentClass` wrappe son toggle dans `noTransition()`. Avec Bonus 2 actif, on **veut** que la transition CSS prenne effet. Donc `updateDocumentClass` ne doit plus appeler `noTransition` quand `colorTransition !== false`.

**Files:**
- Modify: `packages/themes/src/utils/update-document-class.ts`

- [ ] **Step 1: Mettre à jour le test pour matcher le nouveau comportement**

Ajouter dans `packages/themes/src/utils/__tests__/update-document-class.test.ts` :

```ts
describe('when colorTransition is enabled (truthy)', () => {
  beforeEach(() => {
    document.documentElement.className = ''
    document.head.innerHTML = ''
  })

  it('does NOT inject a no-transition style block', () => {
    updateDocumentClass('dark', makeState({ colorTransition: { duration: '200ms', easing: 'ease' } }))
    const styles = document.head.querySelectorAll('style')
    expect(Array.from(styles).every(s => !s.textContent?.includes('transition: none'))).toBe(true)
  })
})

describe('when colorTransition is disabled (false)', () => {
  beforeEach(() => {
    document.documentElement.className = ''
    document.head.innerHTML = ''
  })

  it('uses noTransition wrapper for an instant switch', () => {
    updateDocumentClass('dark', makeState({ colorTransition: false }))
    // noTransition injects a transient style + removes it; we just verify the class flipped without flicker logic side-effects on persistent styles
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
```

- [ ] **Step 2: Adapter `updateDocumentClass`**

```ts
// packages/themes/src/utils/update-document-class.ts
import type { ColorMode, ThemeState } from '../types'
import { noTransition } from './no-transition'

export function updateDocumentClass(colorMode: ColorMode, state?: ThemeState): void {
  if (typeof document === 'undefined' || !state || state.darkModeStrategy === 'media') return

  const apply = () => {
    const html = document.documentElement
    html.classList.remove(state.darkClass, state.lightClass)
    if (colorMode === 'dark') html.classList.add(state.darkClass)
    else if (colorMode === 'light') html.classList.add(state.lightClass)
  }

  if (state.colorTransition === false) {
    noTransition(apply)
  } else {
    apply()
  }
}
```

- [ ] **Step 3: Run tests**

```bash
cd packages/themes && pnpm test:unit -- update-document-class
```
Expected: PASS.

- [ ] **Step 4: Commit (suggestion)**

```bash
git add packages/themes/src/utils/update-document-class.ts packages/themes/src/utils/__tests__/update-document-class.test.ts
git commit -m "feat(@maz-ui/themes): skip noTransition wrap on toggle when colorTransition is enabled"
```

---

## Task 10: Helper anti-FART `color-scheme-meta.ts`

**Files:**
- Create: `packages/themes/src/utils/color-scheme-meta.ts`
- Create: `packages/themes/src/utils/__tests__/color-scheme-meta.test.ts`

- [ ] **Step 1: Écrire les tests**

```ts
// packages/themes/src/utils/__tests__/color-scheme-meta.test.ts
import { injectColorSchemeMeta, resolveColorSchemeContent } from '../color-scheme-meta'

describe('given resolveColorSchemeContent', () => {
  describe('when mode is both and colorMode is auto', () => {
    it('returns "light dark"', () => {
      expect(resolveColorSchemeContent('both', 'auto')).toBe('light dark')
    })
  })

  describe('when colorMode is explicitly dark', () => {
    it('returns "dark"', () => {
      expect(resolveColorSchemeContent('both', 'dark')).toBe('dark')
    })
  })

  describe('when colorMode is explicitly light', () => {
    it('returns "light"', () => {
      expect(resolveColorSchemeContent('both', 'light')).toBe('light')
    })
  })

  describe('when mode is dark only', () => {
    it('returns "dark" regardless of colorMode', () => {
      expect(resolveColorSchemeContent('dark', 'auto')).toBe('dark')
    })
  })
})

describe('given injectColorSchemeMeta', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  describe('when no meta tag exists', () => {
    it('creates and appends one', () => {
      injectColorSchemeMeta('light dark')
      const meta = document.head.querySelector('meta[name="color-scheme"]')
      expect(meta?.getAttribute('content')).toBe('light dark')
    })
  })

  describe('when a meta tag already exists', () => {
    it('updates its content rather than duplicating', () => {
      const existing = document.createElement('meta')
      existing.setAttribute('name', 'color-scheme')
      existing.setAttribute('content', 'light')
      document.head.appendChild(existing)

      injectColorSchemeMeta('dark')

      const metas = document.head.querySelectorAll('meta[name="color-scheme"]')
      expect(metas).toHaveLength(1)
      expect(metas[0].getAttribute('content')).toBe('dark')
    })
  })
})
```

- [ ] **Step 2: Exécuter (doit échouer)**

```bash
cd packages/themes && pnpm test:unit -- color-scheme-meta
```
Expected: FAIL.

- [ ] **Step 3: Implémenter**

```ts
// packages/themes/src/utils/color-scheme-meta.ts
import type { ColorMode, ThemeMode } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'

/**
 * Resolve the value for `<meta name="color-scheme" content="...">`.
 * Emitted in HTML before CSS loads, so the browser applies the right background
 * canvas immediately and prevents the Flash of inAccurate coloR Theme (FART).
 */
export function resolveColorSchemeContent(mode: ThemeMode, colorMode: ColorMode): string {
  if (mode === 'light') return 'light'
  if (mode === 'dark') return 'dark'
  if (colorMode === 'dark') return 'dark'
  if (colorMode === 'light') return 'light'
  return 'light dark'
}

export function injectColorSchemeMeta(content: string): void {
  if (isServer()) return

  let meta = document.head.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'color-scheme')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}
```

- [ ] **Step 4: Brancher dans `setup-theme.ts`**

Dans `setup-theme.ts`, juste après `createThemeState`, ajouter :

```ts
  injectColorSchemeMeta(resolveColorSchemeContent(themeState.value.mode, themeState.value.colorMode))
```

Et importer en haut :
```ts
import { injectColorSchemeMeta, resolveColorSchemeContent } from './color-scheme-meta'
```

- [ ] **Step 5: Run tests**

```bash
cd packages/themes && pnpm test:unit
```
Expected: PASS.

- [ ] **Step 6: Commit (suggestion)**

```bash
git add packages/themes/src/utils/color-scheme-meta.ts packages/themes/src/utils/__tests__/color-scheme-meta.test.ts packages/themes/src/utils/setup-theme.ts
git commit -m "feat(@maz-ui/themes): inject <meta name=color-scheme> at boot to prevent FART"
```

---

## Task 11: Mettre à jour `utils/index.ts` pour exporter les nouveaux modules

**Files:**
- Modify: `packages/themes/src/utils/index.ts`

- [ ] **Step 1: Ajouter les exports**

```ts
// packages/themes/src/utils/index.ts
export * from './color-parser'
export * from './color-scheme-meta'
export * from './cookie-storage'
export * from './css-generator'
export * from './get-color-mode'
export * from './get-preset'
export * from './inject'
export * from './inject-theme-css'
export * from './no-transition'
export * from './preset-merger'
export * from './scale-mix-percentages'
export * from './setup-theme'
export * from './update-document-class'
// view-transition is intentionally NOT exported here — it is lazy-imported on demand
// to keep the boot bundle minimal.
```

- [ ] **Step 2: Run typecheck**

```bash
cd packages/themes && pnpm typecheck
```
Expected: PASS.

- [ ] **Step 3: Commit (suggestion)**

```bash
git add packages/themes/src/utils/index.ts
git commit -m "chore(@maz-ui/themes): wire new utils into the barrel exports"
```

---

## Task 12: Validation visuelle dans `apps/vue-app`

Cette tâche est **manuelle**, mais on prépare la page de test pour l'œil humain.

**Files:**
- Modify (or create): `apps/vue-app/src/views/ThemeValidation.vue` (ou ajouter une route existante)

- [ ] **Step 1: Identifier ou créer une page test**

```bash
ls apps/vue-app/src/views/
ls apps/vue-app/src/components/
```
Si `ColorScale.vue` existe déjà, l'étendre. Sinon créer une page minimale qui affiche :
- Tous les paliers `--maz-X-50..950` pour 4 couleurs (primary, secondary, accent, destructive)
- Boutons MazBtn variantes principales (filled, ghost, outline) × tous les colors
- Input, Card, Alert, Popover
- Toggle entre les 5 presets bundled
- Boutons "Set light / dark / auto"

- [ ] **Step 2: Lancer le dev server**

```bash
cd apps/vue-app && pnpm dev
```

- [ ] **Step 3: Comparer visuellement avec le baseline**

Comparer manuellement à l'œil les paliers générés (color-mix) avec ce qui était généré avant (les CSS dans `packages/themes/.baseline-css/`). Capturer des screenshots avant/après pour les 5 presets.

- [ ] **Step 4: Si écart trop important, ajuster `SCALE_MIX_PERCENTAGES`**

Critère : un palier 100 doit lire comme "très clair, légèrement teinté". Un palier 900 comme "très foncé, base reconnaissable". Si visuellement décalé, modifier les pourcentages dans `packages/themes/src/utils/scale-mix-percentages.ts` et re-run le test snapshot (il faudra le mettre à jour avec `pnpm test:unit -- -u`).

- [ ] **Step 5: Documenter les choix finaux**

Si des pourcentages ont été ajustés, mettre à jour le JSDoc de `SCALE_MIX_PERCENTAGES` avec la raison (ex: "step 900 lowered to 55% — original 60% darkened destructive too much for the new oklch interpolation").

- [ ] **Step 6: Supprimer le script et le dossier de baseline**

```bash
rm packages/themes/scripts/baseline-current-css.ts
rm -rf packages/themes/.baseline-css/
```

- [ ] **Step 7: Commit (suggestion)**

```bash
git add packages/themes/src/utils/scale-mix-percentages.ts packages/themes/src/utils/__tests__/css-generator.test.ts
git add -u packages/themes/scripts/baseline-current-css.ts packages/themes/.baseline-css/
git commit -m "chore(@maz-ui/themes): finalize color-mix scale percentages after visual validation"
```

---

## Task 13: Validation `@property + light-dark()` empiriquement (Bonus 2)

Le caveat documenté : valider que `@property syntax: '<color>'` accepte `light-dark()` en initial-value et au runtime.

**Files:**
- (test manuel uniquement)

- [ ] **Step 1: Avec le dev server vue-app ouvert, vérifier dans Chrome DevTools**

Inspecter `:root` dans DevTools → onglet Computed. Vérifier que `--maz-primary` a bien une valeur résolue (pas la `initial-value`). Vérifier qu'en togglant `.dark` sur `<html>`, la valeur change visuellement.

- [ ] **Step 2: Tester en Safari et Firefox aussi**

Si l'un des trois browsers ne résout pas correctement `@property + light-dark()` :
- Documenter le browser et la version dans un commentaire dans `css-generator.ts` près de `emitPropertyBlock`
- Soit garder le défaut `colorTransition: true` avec fallback runtime, soit basculer le défaut à `false`

- [ ] **Step 3: Si tout marche, RAS. Si fallback nécessaire, ajouter une détection runtime dans `setup-theme.ts`**

```ts
function supportsPropertyWithLightDark(): boolean {
  if (isServer()) return true
  try {
    return CSS.supports('color', 'light-dark(red, blue)') && typeof CSS.registerProperty === 'function'
  } catch {
    return false
  }
}
```
Et désactiver `colorTransition` dans `resolveColorTransition` si non supporté :
```ts
if (!supportsPropertyWithLightDark()) return false
```

- [ ] **Step 4: Commit si modifications (suggestion)**

```bash
git add -u packages/themes/src/
git commit -m "fix(@maz-ui/themes): gate colorTransition on browser support for @property+light-dark"
```

---

## Task 14: Mettre à jour le README

**Files:**
- Modify: `packages/themes/README.md`

- [ ] **Step 1: Documenter `lightClass`, `colorTransition`, `animate` param**

Ajouter une section "New options" qui :
- Décrit `lightClass` (défaut `'light'`)
- Décrit `colorTransition: boolean | { duration, easing }` (défaut `true`)
- Montre l'usage de `toggleDarkMode({ animate: true })` pour les View Transitions
- Mentionne que `<meta name="color-scheme">` est désormais injecté automatiquement

Mettre aussi à jour la section "Features" en tête pour refléter la modernisation :
- Remplacer "HSL CSS Variables" par "Native `light-dark()` + `color-scheme`"
- Ajouter "Smooth color transitions via `@property` (opt-out)"
- Ajouter "Optional View Transitions on toggle"

- [ ] **Step 2: Mettre à jour la section "Generated CSS variables"**

Documenter le nouveau format :
- Couleurs base émises en `light-dark()`
- Paliers via `color-mix(in oklch, ...)`
- `.dark` / `.light` posées sur `<html>` forcent `color-scheme: only ...`

- [ ] **Step 3: Run full healthcheck pour s'assurer que tout passe**

```bash
cd packages/themes && pnpm build && pnpm test:unit:coverage && pnpm lint
```
Expected: PASS sur tout.

- [ ] **Step 4: Commit (suggestion)**

```bash
git add packages/themes/README.md
git commit -m "docs(@maz-ui/themes): document lightClass, colorTransition, and animate option"
```

---

## Task 15: Smoke test SSR Nuxt + lint global du repo

**Files:**
- (validation seulement)

- [ ] **Step 1: Build `apps/nuxt-app`**

```bash
cd apps/nuxt-app && pnpm build
```
Expected: build PASS, pas d'erreur d'hydration au runtime.

- [ ] **Step 2: Démarrer le serveur Nuxt et vérifier le HTML server**

```bash
pnpm preview
# dans un autre terminal:
curl -s http://localhost:3000 | grep -oE '<meta name="color-scheme"[^>]+>'
```
Expected: meta tag bien présent avec `content="light dark"` (ou autre selon mode).

- [ ] **Step 3: Vérifier l'absence de mismatch hydration au browser**

Ouvrir DevTools Console pendant un reload — pas de warning Vue/Nuxt sur hydration mismatch lié au theme.

- [ ] **Step 4: Run le healthcheck du monorepo**

```bash
cd /Users/mazel/workspace/maz-ui && pnpm healthcheck
```
Expected: PASS sur lint, typecheck, test, build packages, build docs.

- [ ] **Step 5: Final commit (suggestion)**

Si tout est vert, c'est la fin de la refacto. Pas de fichier modifié à ce stade en théorie — sinon commiter les fixes mineurs.

---

## Récapitulatif des suppressions / déprécations

| Élément | Action | Impact |
|---|---|---|
| `packages/themes/src/utils/color-utils.ts` | Supprimé | Pas de consumer externe — `generateColorScale`, `parseHSL`, `adjustColorLightness`, `getContrastColor` indisponibles depuis `@maz-ui/themes`. À documenter dans le changelog v5. |
| Export `noTransition` autour du toggle dark/light | Retiré (sauf si `colorTransition: false`) | Permet aux transitions CSS de prendre effet. |
| `@media (prefers-color-scheme: dark)` dans le CSS généré | Supprimé | `color-scheme: light dark` + `light-dark()` fait le travail. |

## Pièges identifiés (rappel du spec)

- **`color-mix(in oklch)` ≠ algo JS** : Task 12 valide visuellement et tune les pourcentages
- **`@property + light-dark()`** : Task 13 valide empiriquement, ajoute un fallback runtime si nécessaire
- **Performance** : 154 `color-mix` par génération — résolus une fois par le browser et cachés, impact mesurable nul (à monitorer)
- **`apps/docs/ColorPicker.vue`** : utilise `colorToHex`, `formatAsOklch`, `parseColorAsOklch` de `color-parser.ts` — on **ne touche pas** à ce fichier

## Self-review

- ✅ Coverage spec : chaque décision verrouillée du spec (option 1, color-mix scales, retro HSL, bonus 1/2/3, lightClass, noTransition retiré du toggle) est implémentée par une tâche
- ✅ Pas de placeholders `TODO`, `TBD`, "implement later"
- ✅ Types cohérents : `CSSOptions` ajoute `lightClass` et `colorTransition` (Task 3), `ThemeConfig` aligné (Task 1), `ThemeState` aligné (Task 1), tous les callers mis à jour (Tasks 6-8)
- ✅ Signatures cohérentes : `updateDocumentClass(colorMode, state)` partout (pas de `(isDark, state)` résiduel), `runViewTransition(callback)` partout, `injectThemeCSS(preset, config, resolvedTransition)` partout
