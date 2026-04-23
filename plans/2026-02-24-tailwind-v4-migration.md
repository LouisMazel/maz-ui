# Plan de migration Tailwind CSS v3 → v4 (Maz-UI v5)

## Contexte

Maz-UI utilise Tailwind CSS v3.4.16 avec un système de theming basé sur des variables CSS HSL brutes (`210 100% 56%`). La migration vers Tailwind v4.2.1 nécessite une refonte du système de couleurs, du prefix, de la configuration (JS → CSS-first) et du build. C'est une **major version (v5)** avec des breaking changes documentés.

### Décisions actées

- **Tailwind v4.2.1**, config CSS-first
- **Presets** : vraies valeurs CSS (`hsl(210 100% 56%)`, `#hex`, `oklch(...)`, `rgb(...)`)
- **Legacy** : format brut `210 100% 56%` accepté (deprecated), auto-détecté et wrappé en `hsl()`
- **Parser couleurs** : code maison (~1-2KB), pas de dépendance externe
- **Variables CSS** : valeurs complètes dans les custom properties
- **Opacité** : gérée nativement par Tailwind v4 via `color-mix()`
- **Prefix** : `maz-` (v3) → `maz:` (v4) — changement interne uniquement

---

## Phase 0 : Préparation des dépendances

### 0.1 Mettre à jour les dépendances

**Fichier** : `/packages/lib/package.json`

- Remplacer `tailwindcss: ^3.4.16` par `tailwindcss: ^4.2.1`
- Ajouter `@tailwindcss/postcss: ^4.2.1`
- Ajouter `@tailwindcss/cli: ^4.2.1`
- Ajouter `@tailwindcss/vite: ^4.2.1`
- Supprimer `autoprefixer` (intégré dans v4)

**Fichier** : `/package.json` (root)

- Supprimer `postcss-import` (intégré dans v4)
- Supprimer `postcss-nested` (CSS nesting natif dans v4)
- Garder `postcss-replace` temporairement (à évaluer en Phase 3)
- Garder `postcss-url`

**Fichier** : `/apps/docs/package.json`

- Mettre à jour `tailwindcss: ^4.2.1`
- Ajouter `@tailwindcss/vite: ^4.2.1`

**Fichier** : `/apps/vue-app/package.json`, `/apps/nuxt-app/package.json`

- Mettre à jour les dépendances tailwind de la même façon

### 0.2 Script de rename des classes

Créer un script Node.js temporaire (`tools/migrate-tw-prefix.ts`) pour automatiser le renommage des classes dans les composants. Le script doit gérer :

1. **Classes simples** : `maz-flex` → `maz:flex`
2. **Avec variants** : `dark:maz-border` → `maz:dark:border`, `hover:maz-bg-surface` → `maz:hover:bg-surface`
3. **Multi-variants** : `dark:hover:maz-text-primary` → `maz:dark:hover:text-primary`
4. **Important modifier** : `!maz-m-0` → `maz:m-0!` (32 instances, 14 fichiers)
5. **@apply** : même transformation dans les blocs `<style>`
6. **Utilities renommées v4** :
   - `maz-rounded-sm` → `maz:rounded-xs` (11 instances, 9 fichiers)
   - `maz-outline-none` → `maz:outline-hidden` (9 instances, 8 fichiers)
   - `maz-backdrop-blur-sm` → `maz:backdrop-blur-xs` (1 instance)
   - `maz-bg-gradient-to-r` → `maz:bg-linear-to-r` (1 instance, MazSkeleton)
   - `maz-shadow` (bare, sans suffixe) → `maz:shadow-sm` (1 instance, MazAvatar)

**Regex de base pour le rename** :

```
// Pattern: (variant:)*maz-{utility}
// Cas 1 - avec variants devant : (?:([\w-]+):)+maz-([\w\-\/\[\]\.]+)
// Cas 2 - simple : \bmaz-([\w\-\/\[\]\.]+)
// Cas 3 - important : !maz-([\w\-\/\[\]\.]+) → maz:{utility}!
```

Le script opère sur tous les fichiers `.vue` dans `packages/lib/src/` et sur les fichiers CSS dans `packages/lib/src/css/`.

---

## Phase 1 : @maz-ui/themes — Système de couleurs

### 1.1 Types — Accepter tous les formats CSS

**Fichier** : `/packages/themes/src/types/index.ts`

Remplacer :

```ts
export type HSL = `${number} ${number}% ${number}%`
```

Par :

```ts
/** @deprecated Use CSSColor instead */
export type HSL = `${number} ${number}% ${number}%`

/** Any valid CSS color value: hsl(), oklch(), rgb(), #hex, or legacy raw HSL (deprecated) */
export type CSSColor = string

export interface ThemeColors {
  background: CSSColor
  foreground: CSSColor
  // ... toutes les clés restent identiques, seul le type change
}
```

### 1.2 Parser de couleurs maison

**Nouveau fichier** : `/packages/themes/src/utils/color-parser.ts`

Parser léger (~1-2KB) qui normalise n'importe quel format CSS en canaux HSL manipulables `{h, s, l}` :

```ts
interface HSLChannels { h: number, s: number, l: number }

/**
 * Parse any CSS color format into HSL channels for manipulation.
 * Supports: hsl(), oklch(), rgb(), #hex (3/4/6/8 digits), and legacy raw "H S% L%"
 */
export function parseColor(value: string): HSLChannels

/**
 * Format HSL channels as a complete CSS hsl() value.
 */
export function formatAsHSL(channels: HSLChannels): string
// → "hsl(210 100% 56%)"

/**
 * Detect if a value is already a complete CSS color (starts with hsl/oklch/rgb/#)
 * or if it's a legacy raw HSL string.
 */
export function isCompleteCSSColor(value: string): boolean

/**
 * Normalize any color input to a complete CSS color value.
 * Legacy raw HSL "210 100% 56%" → "hsl(210 100% 56%)"
 * Already complete → returned as-is
 */
export function normalizeColor(value: string): string
```

**Implémentation du parsing** :

- `#hex` : extraction R/G/B, conversion → HSL via formule standard
- `rgb(r, g, b)` / `rgb(r g b)` : extraction via regex, conversion → HSL
- `hsl(h, s%, l%)` / `hsl(h s% l%)` : extraction directe des canaux
- `oklch(l, c, h)` : conversion OKLCH → RGB → HSL (formule approximative, suffisante pour la génération d'échelles)
- Legacy `H S% L%` : détection par regex (pas de préfixe de fonction), extraction directe

**Note** : La conversion OKLCH → HSL est approximative mais acceptable car elle sert uniquement à la génération des échelles de couleurs (offsets de luminosité). Le résultat final est reformaté en HSL.

### 1.3 Refactorer color-utils.ts

**Fichier** : `/packages/themes/src/utils/color-utils.ts`

- `parseHSL()` → garder pour rétrocompatibilité interne, mais l'appel principal passe par `parseColor()`
- `formatHSL()` → remplacer par `formatAsHSL()` qui retourne `"hsl(H S% L%)"` (avec le wrapper `hsl()`)
- `generateColorScale()` : prend maintenant n'importe quel format CSS en input, retourne des valeurs `hsl()` complètes
- `getContrastColor()` : retourne `"hsl(0 0% 0%)"` ou `"hsl(0 0% 100%)"` au lieu de `"0 0% 0%"`

### 1.4 Refactorer css-generator.ts

**Fichier** : `/packages/themes/src/utils/css-generator.ts`

Le CSS généré passe de :

```css
--maz-primary: 210 100% 56%;
--maz-primary-50: 210 130% 93.5%;
```

À :

```css
--maz-primary: hsl(210 100% 56%);
--maz-primary-50: hsl(210 130% 93.5%);
```

**Changement** : Dans `generateVariablesBlock()` (ligne 229), appeler `normalizeColor(value)` sur chaque valeur de couleur avant de l'écrire.

Le layer `@layer maz-ui-theme` reste identique — les custom layers CSS fonctionnent en v4.

### 1.5 Mettre à jour les presets

**Fichiers** :

- `/packages/themes/src/presets/mazUi.ts`
- `/packages/themes/src/presets/ocean.ts`
- `/packages/themes/src/presets/pristine.ts`
- `/packages/themes/src/presets/obsidian.ts`

Transformer toutes les valeurs en couleurs CSS complètes :

```ts
// AVANT
'primary': '210 100% 56%',

// APRÈS
'primary': 'hsl(210 100% 56%)',
```

### 1.6 Mettre à jour les tests

**Fichiers** :

- `/packages/themes/src/utils/__tests__/color-utils.test.ts` (264 lignes)
- `/packages/themes/src/utils/__tests__/css-generator.test.ts` (138 lignes)
- `/packages/themes/src/__tests__/define-preset.test.ts` (146 lignes)
- `/packages/themes/src/utils/__tests__/preset-merger.test.ts` (262 lignes)
- `/packages/themes/src/utils/__tests__/inject-theme-css.test.ts` (279 lignes)
- `/packages/themes/src/utils/__tests__/setup-theme.test.ts` (448 lignes)

Nouveaux tests pour le color parser :

- `/packages/themes/src/utils/__tests__/color-parser.test.ts`

### 1.7 Vérification Phase 1

```bash
cd packages/themes && pnpm test:unit
```

Tous les tests doivent passer. Les presets génèrent des variables CSS avec des valeurs `hsl()` complètes.

---

## Phase 2 : Tailwind CSS — Configuration CSS-first

### 2.1 Nouveau fichier de thème CSS pour Tailwind

**Nouveau fichier** : `/packages/lib/src/tailwindcss/theme.css`

Ce fichier est le bridge entre les CSS variables de @maz-ui/themes et le système Tailwind v4. Il utilise `@theme inline` pour que Tailwind ne régénère pas les variables dans `:root` (elles sont déjà gérées par le package themes).

```css
@theme inline {
  /* ===== COULEURS ===== */
  /* Chaque couleur + ses scales 50-900 + foreground */
  --color-primary: var(--maz-primary);
  --color-primary-foreground: var(--maz-primary-foreground);
  --color-primary-50: var(--maz-primary-50);
  --color-primary-100: var(--maz-primary-100);
  --color-primary-200: var(--maz-primary-200);
  --color-primary-300: var(--maz-primary-300);
  --color-primary-400: var(--maz-primary-400);
  --color-primary-500: var(--maz-primary-500);
  --color-primary-600: var(--maz-primary-600);
  --color-primary-700: var(--maz-primary-700);
  --color-primary-800: var(--maz-primary-800);
  --color-primary-900: var(--maz-primary-900);
  /* Répéter pour : secondary, accent, destructive, success, warning, info, contrast */

  /* Couleurs sans foreground (surface, foreground, divider, elevation, overlay, muted) */
  --color-surface: var(--maz-background);
  --color-surface-50: var(--maz-background-50);
  /* ... scales ... */
  --color-surface-900: var(--maz-background-900);

  --color-foreground: var(--maz-foreground);
  /* ... scales ... */

  --color-divider: var(--maz-border);
  /* ... scales ... */

  --color-elevation: var(--maz-shadow);
  /* ... scales ... */

  --color-overlay: var(--maz-overlay);
  /* ... scales ... */

  --color-muted: var(--maz-muted);
  /* ... scales ... */

  /* ===== BORDER RADIUS ===== */
  --radius-xs: calc(var(--maz-radius) - 8px);
  --radius-sm: calc(var(--maz-radius) - 4px);
  --radius: var(--maz-radius);
  --radius-lg: calc(var(--maz-radius) + 4px);
  --radius-xl: calc(var(--maz-radius) + 8px);

  /* ===== BORDER ===== */
  --default-border-width: var(--maz-border-width);

  /* ===== TYPOGRAPHY ===== */
  --font-sans: var(--maz-font-family);

  /* ===== TRANSITIONS ===== */
  --default-transition-duration: 200ms;
  --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  /* ===== SHADOWS ===== */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  /* shadow-elevation utilise la variable theme */
  --shadow-elevation: 0 10px 15px -3px var(--color-elevation);

  /* ===== BREAKPOINTS ===== */
  --breakpoint-mob-s: 320px;
  --breakpoint-mob-m: 425px;
  --breakpoint-mob-l: 576px;
  --breakpoint-tab-s: 640px;
  --breakpoint-tab-m: 768px;
  --breakpoint-tab-l: 992px;
  --breakpoint-lap-s: 1024px;
  --breakpoint-lap-m: 1280px;
  --breakpoint-lap-l: 1366px;
  --breakpoint-lap-xl: 1440px;
  --breakpoint-lap-2xl: 1680px;
  --breakpoint-lap-3xl: 1920px;

  /* ===== Z-INDEX ===== */
  --z-1: 1;
  --z-2: 2;
  --z-3: 3;
  --z-4: 4;
  --z-5: 5;
  --z-15: 15;
  --z-25: 25;
  --z-35: 35;
  --z-45: 45;
  --z-75: 75;
  --z-100: 100;
  --z-default-backdrop: 1050;
}
```

**Note sur les noms de couleurs** : Le mapping `scaleColors` dans `colors.ts` définit des alias Tailwind (ex: `surface` → `background`, `divider` → `border`, `elevation` → `shadow`). Ces alias sont conservés dans le `@theme inline` via le même mapping.

### 2.2 Custom utilities en CSS

**Nouveau fichier** : `/packages/lib/src/tailwindcss/utilities.css`

Migrer les utilities du plugin JS vers des `@utility` CSS :

```css
@utility flex-center {
  align-items: center;
  justify-content: center;
}

@utility padded-container-no-p {
  width: 100%;
  padding-inline: calc(50% - var(--maz-container-max-width) / 2);
}

@utility padded-container {
  width: 100%;
  padding-inline: var(--maz-container-padding);
}
```

**Note** : `cap-f::first-letter` (pseudo-element) n'est pas supporté par `@utility` car il nécessite un pseudo-element. Le garder en CSS classique dans un fichier séparé ou dans `index.css`.

### 2.3 Réécrire le fichier d'entrée Tailwind

**Fichier** : `/packages/lib/src/tailwindcss/tailwind.css`

Remplacer :

```css
@import '../../src/css/index.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Par :

```css
@import 'tailwindcss' prefix(maz);

/* Sources à scanner (templates uniquement, exclut <style>) */
@source "./src/**/*.vue";
@source "./src/**/*.ts";

/* Base CSS de Maz-UI */
@import '../../src/css/index.css';

/* Theme bridge (variables CSS → Tailwind utilities) */
@import './theme.css';

/* Custom utilities */
@import './utilities.css';
```

### 2.4 Supprimer/adapter la config JS

**Fichier** : `/packages/lib/src/tailwindcss/tailwind.config.ts`

La fonction `defineMazTailwindConfig` n'est plus nécessaire pour la configuration Tailwind v4 (tout est en CSS). Cependant, elle est **exportée publiquement** et utilisée par les apps. Il faut :

1. Marquer `defineMazTailwindConfig` comme `@deprecated`
2. Garder l'export des variables JS utilisées ailleurs :
   - `getNumericScreensFromTailwind` (utilisé dans composables)
   - `screens` (breakpoints en JS)
   - Les constantes de couleurs pour le type-checking

**Fichier simplifié** :

```ts
/** @deprecated Use CSS-first configuration with @import "tailwindcss" prefix(maz) and theme.css */
export { defineMazTailwindConfig } from './legacy-config'

export { getNumericScreensFromTailwind, screens } from './variables/breakpoints'
```

### 2.5 Adapter le fichier padded-container-vars.css

**Fichier** : `/packages/lib/src/css/padded-container-vars.css`

Remplacer les directives `@screen` par des `@media` :

```css
/* AVANT */
@screen mob-l {
  :root {
    --maz-container-padding-value: var(--maz-container-padding-tablet);
  }
}
@screen lap-s {
  :root {
    --maz-container-padding-value: var(--maz-container-padding-desktop);
  }
}

/* APRÈS */
@media (width >= 576px) {
  :root {
    --maz-container-padding-value: var(--maz-container-padding-tablet);
  }
}
@media (width >= 1024px) {
  :root {
    --maz-container-padding-value: var(--maz-container-padding-desktop);
  }
}
```

### 2.6 Vérification Phase 2

Vérifier que le fichier CSS d'entrée est syntaxiquement correct avec :

```bash
npx @tailwindcss/cli -i packages/lib/src/tailwindcss/tailwind.css -o /tmp/test-output.css
```

---

## Phase 3 : Composants — Rename des classes

### 3.1 Exécuter le script de rename

Exécuter le script créé en Phase 0.2 sur :

- `packages/lib/src/components/**/*.vue` (74 fichiers, ~1397 références de classes maz-)
- `packages/lib/src/directives/**/*.vue`
- `packages/lib/src/plugins/**/*.vue`
- `packages/lib/src/css/*.css`

**Transformations** :

| Pattern v3                  | Pattern v4                  | Count |
| --------------------------- | --------------------------- | ----- |
| `maz-{utility}`             | `maz:{utility}`             | ~1397 |
| `dark:maz-{utility}`        | `maz:dark:{utility}`        | ~100  |
| `hover:maz-{utility}`       | `maz:hover:{utility}`       | ~46   |
| `focus:maz-{utility}`       | `maz:focus:{utility}`       | ~30   |
| `group-hover:maz-{utility}` | `maz:group-hover:{utility}` | ~5    |
| `first:maz-{utility}`       | `maz:first:{utility}`       | ~5    |
| `last:maz-{utility}`        | `maz:last:{utility}`        | ~5    |
| `!maz-{utility}`            | `maz:{utility}!`            | 32    |
| `maz-rounded-sm`            | `maz:rounded-xs`            | 11    |
| `maz-outline-none`          | `maz:outline-hidden`        | 9     |
| `maz-backdrop-blur-sm`      | `maz:backdrop-blur-xs`      | 1     |
| `maz-bg-gradient-to-r`      | `maz:bg-linear-to-r`        | 1     |
| `maz-shadow` (bare)         | `maz:shadow-sm`             | 1     |

**Note importante** : Les classes CSS propres aux composants (`m-card`, `m-reset-css`, `m-btn`, etc.) ne sont PAS préfixées par Tailwind et ne changent PAS.

### 3.2 MazDialog — Remplacer @screen

**Fichier** : `/packages/lib/src/components/MazDialog.vue` (ligne 177)

Remplacer `@screen tab-s { ... }` par `@media (width >= 640px) { ... }`.

### 3.3 Vérification manuelle

Après le script, vérifier manuellement :

- Que les classes dynamiques dans les `:class` bindings sont correctes (template expressions)
- Que les classes dans les computed properties et objets JS sont correctes
- Qu'aucune classe n'a été partiellement transformée

Lancer un grep de validation :

```bash
# Ne devrait plus trouver de résultats (sauf dans les non-Vue files)
grep -r "maz-flex\|maz-bg-\|maz-text-\|maz-border\|maz-rounded\|maz-p-\|maz-m-" packages/lib/src/components/
```

---

## Phase 4 : Build system

### 4.1 PostCSS config

**Fichier** : `/packages/lib/postcss.config.cjs`

Remplacer complètement :

```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**Supprimés** :

- `postcss-url` : évaluer si encore nécessaire (probablement pas pour Tailwind)
- `postcss-nested` : CSS nesting natif dans v4
- `tailwindcss/nesting` : supprimé en v4
- `postcss-import` : intégré dans v4
- `autoprefixer` : intégré dans v4
- `tailwindcss` : remplacé par `@tailwindcss/postcss`
- `postcss-replace` : **plus nécessaire** — v4 avec `prefix(maz)` préfixe déjà les variables internes en `--maz-*`

**Vérifier** que `postcss-replace` n'est plus nécessaire en inspectant le CSS compilé. Si les variables internes de v4 sont bien préfixées nativement, on peut le supprimer. Sinon, adapter le pattern.

### 4.2 ViteCompileStyles

**Fichier** : `/packages/lib/build/ViteCompileStyles.ts`

Mettre à jour la commande CLI :

```ts
// AVANT
await execPromise(
  'tailwindcss -i ./src/tailwindcss/tailwind.css -o dist/css/main.css --config tailwind.config.ts --postcss --minify',
)

// APRÈS
await execPromise(
  'npx @tailwindcss/cli -i ./src/tailwindcss/tailwind.css -o dist/css/main.css --minify',
)
```

**Changements** :

- `tailwindcss` → `npx @tailwindcss/cli` (nouveau package CLI)
- Retirer `--config tailwind.config.ts` (v4 utilise la config CSS dans le fichier d'entrée)
- Retirer `--postcss` (v4 CLI intègre PostCSS)

### 4.3 Vite config

**Fichier** : `/packages/lib/vite.config.ts`

Ajouter le plugin Vite de Tailwind pour le dev et le processing des `<style>` blocks :

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    // ... autres plugins existants
  ],
})
```

Le plugin Vite gère automatiquement le processing des `@apply` dans les `<style>` blocks des composants Vue.

### 4.4 Content transform (exclusion des \<style\>)

En v3, la config `content.transform.vue` supprimait les `<style>` blocks pour éviter la duplication CSS. En v4 :

- Le plugin Vite (`@tailwindcss/vite`) résout les `@apply` dans les `<style>` blocks directement
- Le CLI (`@tailwindcss/cli`) scanne les sources définies par `@source` dans le CSS
- `@source` scanne le contenu textuel des fichiers entiers (templates + style)

**Solution** : Dans le fichier `tailwind.css`, les `@source` sont déjà configurés pour scanner les Vue files. Le CLI va scanner les fichiers complets, mais comme les `@apply` dans les `<style>` blocks sont déjà résolus par Vite au moment du build, la duplication est gérée car les classes @apply ne sont pas des "utilisations" détectables par le scanner (elles sont dans des directives @apply, pas des attributs class).

Si la duplication persiste, une alternative est de créer un script de pre-processing qui strip les `<style>` blocks avant de passer au CLI, similaire au transform v3. Cependant, tester d'abord sans cette optimisation.

### 4.5 Vérification Phase 4

```bash
cd packages/lib && pnpm build
```

Vérifier :

1. `dist/css/main.css` est généré et contient les utilities avec le prefix `maz:`
2. Les CSS per-component dans `dist/` ont les `@apply` correctement résolus
3. Pas de duplication excessive

---

## Phase 5 : Apps — Migration

### 5.1 apps/vue-app

**Fichier** : `/apps/vue-app/tailwind.config.ts` → **Supprimer**

**Nouveau fichier** : `/apps/vue-app/src/tailwind.css` (ou modifier l'existant)

```css
@import 'tailwindcss' prefix(maz);
@import 'maz-ui/src/tailwindcss/theme.css';
@import 'maz-ui/src/tailwindcss/utilities.css';

/* Overrides app-specific si nécessaire */
```

**Fichier** : `/apps/vue-app/postcss.config.cjs`

```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

Ou utiliser le plugin Vite (`@tailwindcss/vite`) dans `vite.config.ts` à la place de PostCSS.

### 5.2 apps/docs

**Fichier** : `/apps/docs/tailwind.config.ts` → **Supprimer**

**Fichier** : `/apps/docs/.vitepress/config.mts`
Simplifier le plugin chain PostCSS :

```ts
postcss: {
  plugins: [
    tailwindcssPostcss(),  // @tailwindcss/postcss
    postcssIsolateStyles({ includeFiles: [/vp-doc\.css/] }),
  ],
}
```

Ou mieux : utiliser `@tailwindcss/vite` comme plugin Vite.

### 5.3 apps/nuxt-app

Vérifier la compatibilité de `@nuxtjs/tailwindcss` avec Tailwind v4. Si le module Nuxt ne supporte pas v4, configurer manuellement via PostCSS ou le module `@tailwindcss/vite` dans la config Nuxt.

### 5.4 Vérification Phase 5

```bash
pnpm build:apps
```

Vérifier que les 3 apps buildent correctement.

---

## Phase 6 : Nettoyage et exports

### 6.1 Exporter les fichiers CSS pour les consommateurs

**Fichier** : `/packages/lib/package.json`

Ajouter des exports pour les fichiers CSS v4 :

```json
{
  "exports": {
    "./tailwindcss/theme.css": "./src/tailwindcss/theme.css",
    "./tailwindcss/utilities.css": "./src/tailwindcss/utilities.css"
  }
}
```

Les consommateurs qui utilisent leur propre Tailwind v4 pourront importer :

```css
@import 'tailwindcss' prefix(maz);
@import 'maz-ui/tailwindcss/theme.css';
@import 'maz-ui/tailwindcss/utilities.css';
```

### 6.2 Supprimer les fichiers obsolètes

- `/packages/lib/src/tailwindcss/variables/design-tokens.ts` → migré dans `theme.css`
- `/packages/lib/src/tailwindcss/variables/utilities.ts` → migré dans `utilities.css`
- `/packages/lib/src/tailwindcss/variables/z-indexes.ts` → migré dans `theme.css`
- `/packages/lib/src/tailwindcss/utils/colors.ts` → les fonctions `getColors()`, `createScaleColor()`, `createSimpleColor()` ne sont plus nécessaires pour Tailwind (les couleurs sont mappées en CSS)

**Garder** :

- `/packages/lib/src/tailwindcss/variables/breakpoints.ts` → `getNumericScreensFromTailwind()` est utilisé dans des composables JS
- `/packages/lib/src/tailwindcss/variables/colors.ts` → les types `ScaleColorName` et `ColorScale` sont potentiellement utilisés

### 6.3 Mettre à jour les linters

**Fichier** : `/packages/eslint-config/package.json`

- Mettre à jour `eslint-plugin-tailwindcss` vers une version compatible v4

**Fichier** : root `package.json`

- Mettre à jour `stylelint-config-tailwindcss` vers une version compatible v4

### 6.4 Intégration consommateur — API publique

**Contexte** : maz-ui est consommé par des projets tiers (et par les projets propres du mainteneur) qui utilisent leur propre instance de Tailwind v4 — sans le `prefix(maz)` interne à la lib. Ces consommateurs doivent pouvoir **réutiliser les design tokens de maz-ui** (couleurs, radius, breakpoints, shadows, z-index) directement dans leur propre code applicatif, pour que `bg-primary`, `rounded`, `shadow-elevation`, etc. résolvent vers les variables du thème maz-ui actif.

Cette section définit le contrat public v5 pour cette intégration.

#### 6.4.1 Fichiers CSS granulaires

Éclater `theme.css` en modules thématiques pour permettre l'intégration partielle. Le fichier agrégat `theme.css` se contente d'importer les modules.

**Nouveaux fichiers** :

- `/packages/lib/src/tailwindcss/theme-colors.css` — tokens couleur (primary, secondary, accent, destructive, success, warning, info, contrast, surface, foreground, divider, elevation, overlay, muted + scales)
- `/packages/lib/src/tailwindcss/theme-radius.css` — `--radius-*`
- `/packages/lib/src/tailwindcss/theme-breakpoints.css` — `--breakpoint-*`
- `/packages/lib/src/tailwindcss/theme-shadows.css` — `--shadow-*`
- `/packages/lib/src/tailwindcss/theme-z-index.css` — `--z-*`
- `/packages/lib/src/tailwindcss/theme-typography.css` — `--font-*`, `--default-transition-*`, `--default-border-width`

**Fichier agrégat** : `/packages/lib/src/tailwindcss/theme.css`

```css
@import "./theme-colors.css";
@import "./theme-radius.css";
@import "./theme-breakpoints.css";
@import "./theme-shadows.css";
@import "./theme-z-index.css";
@import "./theme-typography.css";
```

#### 6.4.2 Exports enrichis

**Fichier** : `/packages/lib/package.json`

Remplacer les deux exports de la Phase 6.1 par :

```json
{
  "exports": {
    "./tailwindcss/theme.css": "./src/tailwindcss/theme.css",
    "./tailwindcss/theme-colors.css": "./src/tailwindcss/theme-colors.css",
    "./tailwindcss/theme-radius.css": "./src/tailwindcss/theme-radius.css",
    "./tailwindcss/theme-breakpoints.css": "./src/tailwindcss/theme-breakpoints.css",
    "./tailwindcss/theme-shadows.css": "./src/tailwindcss/theme-shadows.css",
    "./tailwindcss/theme-z-index.css": "./src/tailwindcss/theme-z-index.css",
    "./tailwindcss/theme-typography.css": "./src/tailwindcss/theme-typography.css",
    "./tailwindcss/utilities.css": "./src/tailwindcss/utilities.css"
  }
}
```

#### 6.4.3 Scénarios d'intégration documentés

Prérequis commun à tous les scénarios : le consommateur bootstrappe `@maz-ui/themes` pour que les variables `--maz-*` soient injectées dans le DOM.

```ts
// main.ts — identique pour tous les scénarios
import { setupTheme } from "@maz-ui/themes";
import mazUiPreset from "@maz-ui/themes/presets/mazUi";

setupTheme(mazUiPreset);
```

Le bridge Tailwind (`theme.css` et ses modules) est **preset-agnostic** : il référence `var(--maz-primary)`, pas la valeur. Le changement de preset, de dark/light ou de thème à chaud via `setupTheme()` se reflète automatiquement dans les utilities Tailwind du consommateur — aucune recompilation CSS.

Trois scénarios à documenter dans la doc (`apps/docs`), section **Installation → Integrating with your Tailwind**.

**Scénario A — Design system complet** (recommandé par défaut)

Le consommateur adopte intégralement le design system maz-ui. Ses propres `bg-primary`, `rounded`, `shadow-elevation`, `md:…`, etc., utilisent les tokens maz-ui.

```css
@import "tailwindcss";
@import "maz-ui/tailwindcss/theme.css";
@import "maz-ui/tailwindcss/utilities.css";
```

**Scénario B — Tokens aliasés** (cohabitation avec un design system existant)

Le consommateur garde son propre design system mais réutilise certains tokens maz-ui sous ses propres noms :

```css
@import "tailwindcss";

@theme inline {
  --color-brand: var(--maz-primary);
  --color-brand-foreground: var(--maz-primary-foreground);
  --radius-brand: var(--maz-radius);
}
```

Le consommateur utilise `bg-brand`, `rounded-brand` sans conflit avec ses propres tokens. Les variables `--maz-*` sont disponibles grâce au bootstrap de `@maz-ui/themes`.

**Scénario C — Intégration partielle** (cherry-pick)

Le consommateur ne veut que les couleurs de maz-ui et garde ses propres radius, breakpoints, shadows :

```css
@import "tailwindcss";
@import "maz-ui/tailwindcss/theme-colors.css";
```

#### 6.4.4 Contrat de stabilité (API publique)

À documenter explicitement dans le CHANGELOG v5 et dans la doc :

1. **Chemins d'import** : les chemins `maz-ui/tailwindcss/*` et `@maz-ui/themes/presets/*` sont versionnés avec la lib. Un renommage ou un déplacement constitue un breaking change (major release).
2. **Noms de tokens** : les noms des CSS variables exposées (`--color-primary`, `--color-surface-*`, `--radius-*`, `--shadow-elevation`, `--breakpoint-mob-s`, etc.) sont le contrat public. Les renommer est un breaking change.
3. **Valeurs** : les valeurs peuvent évoluer entre minors (c'est le design system qui évolue), les noms non.
4. **Breakpoints** : les breakpoints non-standard (`mob-s`, `mob-m`, `mob-l`, `tab-s`, `tab-m`, `tab-l`, `lap-s`, …) s'**ajoutent** aux breakpoints par défaut de Tailwind v4 (`sm`, `md`, `lg`, `xl`, `2xl`) — le `theme-breakpoints.css` ne fait pas `--breakpoint-*: initial`. Les consommateurs conservent les breakpoints standards.
5. **Couleurs** : le `theme-colors.css` **écrase** `--color-primary`, `--color-secondary`, etc. dans l'instance Tailwind du consommateur. C'est voulu — c'est le design system qui prend le dessus. Pour éviter ce comportement, utiliser le Scénario B.

#### 6.4.5 Vérification Phase 6.4

Créer un projet de test minimal `tools/integration-test-consumer/` avec :

1. Un `package.json` déclarant `maz-ui` et `@maz-ui/themes` en dépendance locale (workspace).
2. Un `src/styles.css` qui teste chacun des trois scénarios dans des fichiers séparés.
3. Un build Vite qui compile chaque scénario et valide :
   - Le CSS final contient bien `var(--maz-primary)` dans les utilities `bg-primary`.
   - Les breakpoints standards (`sm:`, `md:`, `lg:`) fonctionnent toujours en scénario A.
   - Les alias `bg-brand` résolvent vers `var(--maz-primary)` en scénario B.

Ce test sert aussi de documentation exécutable et de régression pour les futures versions.

---

## Phase 7 : Vérification complète

### 7.1 Tests unitaires

```bash
pnpm test:unit:all
```

### 7.2 Typecheck

```bash
pnpm typecheck:all
```

### 7.3 Lint

```bash
pnpm lint:all
```

### 7.4 Build complet

```bash
pnpm build:packages && pnpm build:apps
```

### 7.5 Inspection visuelle

1. Lancer `apps/vue-app` en dev et vérifier visuellement les composants
2. Lancer `apps/docs` en dev et vérifier les composants documentés
3. Vérifier le dark mode toggle
4. Vérifier les changements de thème dynamiques
5. Vérifier les opacités sur les couleurs (ex: `bg-primary/50`)
6. Vérifier le hover sur mobile (le comportement change — hover conditionnel)

### 7.6 Inspection du CSS compilé

```bash
# Vérifier que les variables internes sont bien préfixées
grep -c "\-\-tw-" packages/lib/dist/css/main.css
# Devrait retourner 0 (v4 avec prefix préfixe nativement)

# Vérifier la présence du prefix dans les classes
grep "maz:" packages/lib/dist/css/main.css | head -5

# Vérifier les couleurs CSS
grep "color-mix" packages/lib/dist/css/main.css | head -5
```

---

## Inventaire complet des fichiers impactés

### @maz-ui/themes (Phase 1)

| Fichier                                                    | Action                             |
| ---------------------------------------------------------- | ---------------------------------- |
| `packages/themes/src/types/index.ts`                       | Type HSL → CSSColor                |
| `packages/themes/src/utils/color-parser.ts`                | **NOUVEAU** — parser multi-format  |
| `packages/themes/src/utils/color-utils.ts`                 | Refactorer pour utiliser le parser |
| `packages/themes/src/utils/css-generator.ts`               | Output `hsl()` complet             |
| `packages/themes/src/presets/mazUi.ts`                     | Valeurs `hsl()` complètes          |
| `packages/themes/src/presets/ocean.ts`                     | Valeurs `hsl()` complètes          |
| `packages/themes/src/presets/pristine.ts`                  | Valeurs `hsl()` complètes          |
| `packages/themes/src/presets/obsidian.ts`                  | Valeurs `hsl()` complètes          |
| `packages/themes/src/utils/__tests__/*.test.ts`            | Adapter les tests (6+ fichiers)    |
| `packages/themes/src/utils/__tests__/color-parser.test.ts` | **NOUVEAU** — tests du parser      |

### @maz-ui/lib — Tailwind config (Phase 2)

| Fichier                                           | Action                            |
| ------------------------------------------------- | --------------------------------- |
| `packages/lib/src/tailwindcss/theme.css`          | **NOUVEAU** — @theme inline       |
| `packages/lib/src/tailwindcss/utilities.css`      | **NOUVEAU** — @utility directives |
| `packages/lib/src/tailwindcss/tailwind.css`       | Réécrire (CSS-first)              |
| `packages/lib/src/tailwindcss/tailwind.config.ts` | Deprecate, garder exports JS      |
| `packages/lib/src/css/padded-container-vars.css`  | @screen → @media                  |

### @maz-ui/lib — Composants (Phase 3)

| Fichier                                   | Action                             |
| ----------------------------------------- | ---------------------------------- |
| 74 fichiers `.vue` dans `src/components/` | Rename classes (script automatisé) |
| Fichiers `.vue` dans `src/directives/`    | Rename classes                     |
| Fichiers `.vue` dans `src/plugins/`       | Rename classes                     |

### @maz-ui/lib — Build (Phase 4)

| Fichier                                   | Action                              |
| ----------------------------------------- | ----------------------------------- |
| `packages/lib/postcss.config.cjs`         | Simplifier → `@tailwindcss/postcss` |
| `packages/lib/build/ViteCompileStyles.ts` | CLI v4                              |
| `packages/lib/vite.config.ts`             | Ajouter `@tailwindcss/vite`         |
| `packages/lib/package.json`               | Dépendances                         |

### Apps (Phase 5)

| Fichier                            | Action                  |
| ---------------------------------- | ----------------------- |
| `apps/vue-app/tailwind.config.ts`  | Supprimer               |
| `apps/vue-app/postcss.config.cjs`  | Simplifier              |
| `apps/docs/tailwind.config.ts`     | Supprimer               |
| `apps/docs/.vitepress/config.mts`  | Simplifier PostCSS      |
| `apps/nuxt-app/tailwind.config.ts` | Supprimer ou adapter    |
| `apps/nuxt-app/nuxt.config.ts`     | Adapter Tailwind module |

### Nettoyage et intégration consommateur (Phase 6)

| Fichier                                                      | Action                                         |
| ------------------------------------------------------------ | ---------------------------------------------- |
| `packages/lib/src/tailwindcss/variables/design-tokens.ts`    | Supprimer                                      |
| `packages/lib/src/tailwindcss/variables/utilities.ts`        | Supprimer                                      |
| `packages/lib/src/tailwindcss/variables/z-indexes.ts`        | Supprimer                                      |
| `packages/lib/src/tailwindcss/utils/colors.ts`               | Nettoyer exports                               |
| `package.json` (root)                                        | Supprimer deps PostCSS inutiles                |
| `packages/lib/src/tailwindcss/theme-colors.css`              | **NOUVEAU** — module couleurs (6.4)            |
| `packages/lib/src/tailwindcss/theme-radius.css`              | **NOUVEAU** — module radius (6.4)              |
| `packages/lib/src/tailwindcss/theme-breakpoints.css`         | **NOUVEAU** — module breakpoints (6.4)         |
| `packages/lib/src/tailwindcss/theme-shadows.css`             | **NOUVEAU** — module shadows (6.4)             |
| `packages/lib/src/tailwindcss/theme-z-index.css`             | **NOUVEAU** — module z-index (6.4)             |
| `packages/lib/src/tailwindcss/theme-typography.css`          | **NOUVEAU** — module typography (6.4)          |
| `packages/lib/src/tailwindcss/theme.css`                     | Devenir agrégateur `@import` des modules (6.4) |
| `packages/lib/package.json`                                  | Exports granulaires (6.4.2)                    |
| `tools/integration-test-consumer/`                           | **NOUVEAU** — test des 3 scénarios (6.4.5)     |
| `apps/docs/` — section Installation                          | **NOUVEAU** — doc des 3 scénarios (6.4.3)      |

---

## Risques et points d'attention

1. **`@tailwindcss/vite` et le build lib** : Le plugin Vite traite les `<style>` blocks. S'il interfère avec le `cssCodeSplit` ou `libInjectCss`, il faudra peut-être le désactiver pour le build production et n'utiliser que `@tailwindcss/postcss`.

2. **Duplication CSS** : Vérifier que le CLI ne génère pas des utilities déjà résolues par @apply dans les composants. Si c'est le cas, réintroduire le content transform.

3. **`postcss-replace` suppression** : Vérifier que v4 avec `prefix(maz)` préfixe correctement TOUTES les variables internes. Inspecter `dist/css/main.css` pour confirmer qu'il n'y a plus de `--tw-*` non préfixées.

4. **`@nuxtjs/tailwindcss`** : Vérifier la compatibilité avec Tailwind v4. Si incompatible, utiliser `@tailwindcss/vite` directement dans la config Nuxt.

5. **Browser support** : Chrome 111+, Safari 16.4+, Firefox 128+. Documenter dans le CHANGELOG.

6. **`cap-f::first-letter`** : La directive `@utility` ne supporte pas les pseudo-elements. Garder cette règle dans un fichier CSS standard (pas @utility).
