<!-- eslint-disable -->

# @maz-ui/themes — Refacto CSS moderne (light-dark, color-scheme, color-mix)

> Document généré le 11 mai 2026

## Sommaire

- [Contexte & objectif](#contexte--objectif)
- [Décisions verrouillées](#décisions-verrouillées)
- [Architecture cible](#architecture-cible)
- [CSS généré — avant / après](#css-généré--avant--après)
- [Changements module par module](#changements-module-par-module)
- [Garanties de préservation API](#garanties-de-préservation-api)
- [Bonus intégrés (avec attention perf)](#bonus-intégrés-avec-attention-perf)
- [Stratégie de chargement / lazy-loading](#stratégie-de-chargement--lazy-loading)
- [Testing strategy](#testing-strategy)
- [Plan d'implémentation](#plan-dimplémentation)
- [Pièges identifiés](#pièges-identifiés)

---

## Contexte & objectif

Le package `@maz-ui/themes` génère un CSS doublé (`:root` + `.dark` ou `:root` + `@media (prefers-color-scheme: dark)`) et calcule **en JS** 11 paliers de scale × 14 couleurs × 2 modes = ~308 variables émises en dur. Trois primitives CSS désormais Baseline 2024 permettent de simplifier radicalement :

- `light-dark(<light>, <dark>)` — résolution native selon le `color-scheme` actif
- `color-scheme: light dark | only light | only dark` — pilote `light-dark()` ET adapte les contrôles natifs (scrollbars, `<input type="date">`, autofill)
- `color-mix(in oklch, base, white|black N%)` — dérive les paliers de scale en CSS, sans JS

L'objectif est de remplacer la double émission et la dérivation JS par un bloc unique CSS-natif, **sans casser l'API publique** et **sans dégrader les performances initiales**.

---

## Décisions verrouillées

| # | Décision | Justification |
|---|---|---|
| 1 | **Pas de fallback** pour navigateurs < Baseline 2024 | Solo-maintainer, v5 majeure, Tailwind v4 coupe déjà les vieux navigateurs. Dégradation gracieuse = thème light pour les ~5% restants. |
| 2 | Scales dérivées en `color-mix(in oklch, ...)` | Suppression de ~150 lignes JS, scales réactives aux changements de base, oklch perceptuellement uniforme. |
| 3 | Retro-compat HSL `"210 100% 50%"` conservée | Migration utilisateurs simplifiée. `normalizeColor()` reste. |
| 4 | Bonus 1 (anti-FART meta) intégré sans option | Coût négligeable, corrige un bug latent SSR. |
| 5 | Bonus 2 (@property transitions) intégré, option `colorTransition` défaut `true` | Bonne UX par défaut, désactivable. |
| 6 | Bonus 3 (View Transitions) opt-in via paramètre `{ animate: true }` | Lazy-loaded, zéro coût sauf si utilisé. |
| 7 | `noTransition()` conservé pour swap de preset et boot, retiré du toggle dark/light | Bonus 2 prend le relais sur le toggle. Swap preset reste instantané. |

---

## Architecture cible

### Principe

Un seul bloc CSS au niveau `:root`. Le navigateur fait le switch via `color-scheme`. La classe `.dark` / `.light` posée sur `<html>` ne fait que **forcer** `color-scheme: only dark|only light`, ce qui force `light-dark()` à résoudre vers le côté souhaité.

### Stratégies préservées

| `darkModeStrategy` | CSS émis | Comportement JS |
|---|---|---|
| `'class'` (défaut) | `:root { color-scheme: light dark; ... }` + `.dark { color-scheme: only dark }` + `.light { color-scheme: only light }` | `setColorMode(m)` ajoute/retire `.dark` ou `.light`. Pas de classe = auto (suit système). |
| `'media'` | Juste `:root { color-scheme: light dark; ... }`, aucune override | Le navigateur suit `prefers-color-scheme`. `setColorMode` ne touche pas au DOM (préserve le comportement actuel). |

### Modules touchés vs préservés

**Réécrits / modifiés** :
- `utils/css-generator.ts` (réécrit)
- `utils/update-document-class.ts` (étendu pour gérer `.light`)
- `utils/setup-theme.ts` (simplifié, branche mediaQuery supprimée)
- `utils/color-parser.ts` (réduit au strict minimum, retro HSL uniquement)
- `composables/useTheme.ts` (ajout du paramètre optionnel `{ animate }` sur `setColorMode` et `toggleDarkMode`)

**Supprimés** :
- `utils/color-utils.ts` (~150 lignes — `generateColorScale` n'est plus utilisé)

**Nouveaux** :
- `utils/view-transition.ts` (lazy-loaded, ~30 lignes)
- `utils/color-scheme-meta.ts` (anti-FART, ~15 lignes)
- `__tests__/css-generator.test.ts`
- `__tests__/update-document-class.test.ts`

**Inchangés** (API publique 1:1) :
- `define-preset.ts`, `preset-merger.ts`, tous les presets bundled
- `plugin.ts`, `types/index.ts` (sauf ajouts mineurs non breaking)
- `build/index.ts` (mêmes signatures, sortie CSS différente)
- `packages/lib/src/tailwindcss/theme-colors.css` (pont `@theme inline` reste tel quel)

---

## CSS généré — avant / après

### Avant (extrait pour `darkModeStrategy: 'class'`, `mode: 'both'`)

```css
@layer theme {
  :root {
    --maz-surface: oklch(1 0 0);
    --maz-primary: oklch(0.65 0.19 254);
    /* ... 22 colors ... */
    --maz-primary-50: oklch(...);
    --maz-primary-100: oklch(...);
    /* ... 154 lignes scale ... */
  }
  .dark {
    --maz-surface: oklch(0.25 0.02 281);
    --maz-primary: oklch(0.65 0.19 254);
    /* ... 22 colors dupliquées ... */
    --maz-primary-50: oklch(...);
    /* ... 154 lignes scale ré-émises ... */
  }
}
```

**Total** ≈ 660 lignes, ~308 variables scale en dur.

### Après

```css
@layer theme {
  :root {
    color-scheme: light dark;

    /* Foundation, scales radius/shadow, components — inchangés */
    --maz-base-font-size: 14px;
    --maz-rounded-md: 0.7rem;
    --maz-rounded-xs: calc(var(--maz-rounded-md) * 0.25);
    /* ... */

    /* Couleurs de base : un seul light-dark() par token */
    --maz-surface: light-dark(oklch(1 0 0), oklch(0.25 0.02 281));
    --maz-foreground: light-dark(oklch(0.26 0.01 248), oklch(0.88 0 0));
    --maz-primary: light-dark(oklch(0.65 0.19 254), oklch(0.65 0.19 254));
    /* ... 22 lignes ... */

    /* Scales dérivées via color-mix(in oklch) */
    --maz-primary-50:  color-mix(in oklch, var(--maz-primary), white 95%);
    --maz-primary-100: color-mix(in oklch, var(--maz-primary), white 85%);
    --maz-primary-200: color-mix(in oklch, var(--maz-primary), white 70%);
    --maz-primary-300: color-mix(in oklch, var(--maz-primary), white 50%);
    --maz-primary-400: color-mix(in oklch, var(--maz-primary), white 25%);
    --maz-primary-500: var(--maz-primary);
    --maz-primary-600: color-mix(in oklch, var(--maz-primary), black 15%);
    --maz-primary-700: color-mix(in oklch, var(--maz-primary), black 30%);
    --maz-primary-800: color-mix(in oklch, var(--maz-primary), black 45%);
    --maz-primary-900: color-mix(in oklch, var(--maz-primary), black 60%);
    --maz-primary-950: color-mix(in oklch, var(--maz-primary), black 75%);
    /* idem pour les 13 autres scaleColors */
  }

  /* Présent uniquement si darkModeStrategy === 'class' */
  .dark  { color-scheme: only dark; }
  .light { color-scheme: only light; }
}
```

### Mesures

| Métrique | Avant | Après | Δ |
|---|---|---|---|
| Lignes CSS émises | ~660 | ~210 | **−68 %** |
| Blocs distincts | 2 | 1 + 2 toggles | **simplifié** |
| Variables scale calculées en JS | 308 | 0 | **éliminé** |
| Modules JS au runtime | + `color-utils` + parser complet | seulement `normalizeColor` retro | **−~150 lignes JS** |

### Cas particuliers

- **`mode: 'light'` ou `'dark'` seul** : on émet `color-scheme: only <mode>` sur `:root`. `light-dark()` est conservé (le navigateur ignore juste le côté non-actif).
- **Palier 500** : aliasé à `var(--maz-primary)` directement, pas un `color-mix` à 0%.
- **Si `colors.dark` absent** : le merger garantit déjà sa présence via `ThemePreset` (type requis). Si jamais un utilisateur fournit `undefined` à l'exécution, fallback `D = L` dans le générateur.

---

## Changements module par module

### `utils/css-generator.ts` — réécrit

Signature publique préservée : `generateCSS(preset, options) → string`, mêmes clés `CSSOptions`.

Décomposition interne :
- `emitRootBlock(preset, options)` — produit le bloc `:root` unifié
- `emitColorVariables(colorsLight, colorsDark, mode, prefix)` — émet `--maz-X: light-dark(L, D)` (ou juste la valeur si mode `'light'`/`'dark'`)
- `emitColorScales(scaleColorNames, prefix)` — émet les `color-mix` selon une table de pourcentages constante
- `emitColorSchemeOverrides(options)` — émet les `.dark`/`.light` seulement si `darkSelectorStrategy === 'class'`
- `emitPropertyDeclarations(preset, options)` — émet les `@property` si `colorTransition !== false`

Branche `@media (prefers-color-scheme: dark)` supprimée.

### `utils/color-utils.ts` — supprimé

`generateColorScale()` n'est plus utilisé. La constante `scaleColors` migre dans `css-generator.ts` comme `SCALED_COLOR_NAMES`.

### `utils/color-parser.ts` — réduit

`normalizeColor()` reste (retro-compat HSL raw). Le reste (parser RGB/HSL pour algo scale) est supprimé. Fichier final ~20 lignes.

### `utils/update-document-class.ts` — étendu

```ts
// pseudo-code
function updateDocumentClass(colorMode: 'light' | 'dark' | 'auto', state: ThemeState) {
  if (state.darkModeStrategy === 'media') return
  const html = document.documentElement
  html.classList.remove(state.darkClass, state.lightClass)
  if (colorMode === 'dark')  html.classList.add(state.darkClass)
  if (colorMode === 'light') html.classList.add(state.lightClass)
  // 'auto' = aucune classe
}
```

Reçoit désormais le `colorMode` complet (pas juste `isDark`), pour distinguer `'auto'` de `'light'`.

### `utils/setup-theme.ts` — simplifié

- Suppression des branches conditionnelles `mediaQuery` dans la génération CSS
- `watchColorSchemeFromMedia` simplifié : sert uniquement à synchroniser `themeState.isDark` quand `colorMode === 'auto'` (utile pour les composants qui lisent ce ref)
- Un seul chemin de génération `generateCSS(preset, options)`

### `utils/no-transition.ts` — conservé, usage clarifié

Utilisé pour :
- `updateTheme(otherPreset)` — swap complet de preset, instantané
- Boot initial (premier render)

Retiré de :
- `setColorMode` / `toggleDarkMode` — Bonus 2 prend le relais via `@property` + `transition` CSS

### `composables/useTheme.ts` — ajout du paramètre `animate`

```ts
function setColorMode(colorMode: ColorMode, options?: { animate?: boolean }): void
function toggleDarkMode(options?: { animate?: boolean }): void
```

Si `animate: true` → lazy-import de `utils/view-transition.ts` et wrap dans `document.startViewTransition(...)`. Sinon comportement instantané (ou doux selon `colorTransition` config).

### `types/index.ts` — additions non-breaking

```ts
interface BaseThemeConfig {
  // ... toutes les options existantes ...

  /** Class added to document root when light mode is forced. @default 'light' */
  lightClass?: string

  /**
   * Smooth color transition on dark/light toggle via @property + CSS transition.
   * - true → transition douce avec valeurs du preset (motion-normal, easing-in-out)
   * - false → instantané
   * - { duration, easing } → custom
   * @default true
   */
  colorTransition?: boolean | { duration?: Duration, easing?: string }
}
```

Aucun type publié n'est cassé ou retiré.

---

## Garanties de préservation API

| Surface | Status |
|---|---|
| `useTheme()` returns (preset, presetName, colorMode, isDark, strategy, mode, darkModeStrategy, updateTheme, setColorMode, toggleDarkMode, currentPreset) | ✅ identique (ajout paramètre `animate` optionnel) |
| `definePreset({ base, overrides })` sync ou async | ✅ identique |
| `MazUiTheme` plugin options | ✅ pure addition (`lightClass`, `colorTransition`) |
| Presets bundled (`mazUi`, `ocean`, etc.) | ✅ inchangés |
| `ThemePresetOverrides` shape | ✅ identique |
| Formats de couleur acceptés (oklch, rgb, hsl, hex, raw HSL) | ✅ identiques |
| Variables CSS émises (`--maz-X`, `--maz-X-50..950`, etc.) | ✅ noms identiques, valeurs équivalentes (validation visuelle requise) |
| Cookies (`maz-color-mode`, `maz-resolved-color-mode`, `maz-preset`) | ✅ identiques |
| `build/index.ts` exports | ✅ identiques |
| Zero-FOUC en runtime sync | ✅ préservé |
| Mode `'media'` = no-op visuel de `setColorMode` | ✅ préservé |
| SSR guards `isServer()` | ✅ préservés |

---

## Bonus intégrés (avec attention perf)

### Bonus 1 — `<meta name="color-scheme">` (anti-FART)

**Intégration** : automatique, pas d'option config.

- Côté Nuxt (`@maz-ui/nuxt`) : injection via `useHead({ meta: [{ name: 'color-scheme', content }] })` avec `content` résolu côté server (`'light dark'`, `'dark'`, ou `'light'` selon le cookie)
- Côté Vue pur : helper `injectColorSchemeMeta(content)` appelé synchroniquement dans `setupTheme` avant l'injection CSS — append d'une `<meta>` au `<head>` si absente

**Coût** : ~15 lignes, exécuté une fois au boot, hors hot path.

### Bonus 2 — `@property` transitions douces

**Intégration** : option `colorTransition?: boolean | { duration, easing }`, **défaut `true`**.

Quand activé, le générateur émet :
```css
@property --maz-primary {
  syntax: '<color>';
  inherits: true;
  initial-value: oklch(0.65 0.19 254);
}
/* idem pour chaque couleur de base */

:root {
  transition:
    --maz-primary var(--maz-motion-normal) var(--maz-easing-in-out),
    --maz-foreground var(--maz-motion-normal) var(--maz-easing-in-out),
    /* ... pour chaque couleur ... */;
}
```

**Coût perf** : CSS pur, zéro JS supplémentaire, pas de lazy-load nécessaire.

**Caveat à valider pendant l'implémentation** : `@property syntax: '<color>'` doit accepter `light-dark(...)` en `initial-value` et au runtime. Historiquement (début 2024) certains navigateurs rejetaient car la validation se faisait au parse-time alors que `light-dark()` résout au computed-value-time. À tester sur Chrome/Safari/Firefox stables au moment de l'implémentation. Si échec : fallback automatique `colorTransition: false` + warning console dev-only, pas de feature-breaking.

### Bonus 3 — View Transitions API

**Intégration** : paramètre runtime `{ animate: true }` sur `setColorMode` / `toggleDarkMode`. Pas d'option config globale.

```ts
const { toggleDarkMode } = useTheme()
toggleDarkMode({ animate: true })   // déclenche View Transition
toggleDarkMode()                    // comportement par défaut
```

**Coût perf** : code lazy-loaded.
```ts
async function animatedToggle(...) {
  const { startViewTransition } = await import('./utils/view-transition')
  startViewTransition(() => updateDocumentClass(...))
}
```
Tree-shaken hors du bundle si jamais utilisé. Graceful degradation si `document.startViewTransition` absent (Firefox non-stable).

---

## Stratégie de chargement / lazy-loading

### Chemin critique (bundle initial)

Modules chargés au boot pour le premier paint :
- `setup-theme.ts`
- `css-generator.ts` (sauf branches View Transitions)
- `inject-theme-css.ts`
- `update-document-class.ts`
- `get-color-mode.ts`, `cookie-storage.ts`
- `preset-merger.ts`
- `color-parser.ts` (réduit — `normalizeColor` retro HSL)
- `color-scheme-meta.ts` (~15 lignes)

**Estimation** : ~30 à 40 % de JS en moins par rapport à aujourd'hui grâce à la suppression de `color-utils.ts` et `generateColorScale`.

### Lazy-loaded à la demande

- `utils/view-transition.ts` — `import()` dynamique uniquement si `{ animate: true }`
- `getPreset('ocean')` — déjà lazy aujourd'hui pour les presets non-bundled, on garde

### Code mort à supprimer

- `color-utils.ts` entier (~150 lignes)
- Partie scale-generator de `color-parser.ts`
- Branches `mediaQuery` dans `css-generator.ts` et `setup-theme.ts`
- Usage de `noTransition` dans `setColorMode`/`toggleDarkMode` (retiré du flow toggle, conservé pour `updateTheme` et boot)

---

## Testing strategy

### Unit tests Vitest

**Nouveau : `__tests__/css-generator.test.ts`**

Snapshots paramétrés sur la matrice `mode × darkModeStrategy × scaleColorVariables × colorTransition` pour chaque preset bundled.

Assertions ciblées en plus des snapshots :
- `expect(css).toContain('color-scheme: light dark')`
- `expect(css).toContain('light-dark(')`
- `expect(css).toContain('color-mix(in oklch')`
- mode='light' → `expect(css).not.toContain('light-dark(')` (juste valeurs light)
- Input HSL raw `"210 100% 50%"` → `expect(css).toContain('hsl(210 100% 50%)')`
- `colorTransition: false` → `expect(css).not.toContain('@property')`

**Nouveau : `__tests__/update-document-class.test.ts`**

Table de cas :
- `colorMode: 'dark'` → `.dark` posée, `.light` absente
- `colorMode: 'light'` → `.light` posée, `.dark` absente
- `colorMode: 'auto'` → ni l'une ni l'autre
- `darkModeStrategy: 'media'` → aucune classe jamais touchée

**Existants à garder verts** :
- `define-preset.test.ts` — inchangé
- `plugin.test.ts` — l'API publique doit rester valide

### Validation visuelle (manuelle, étape 3 du plan)

Page de test dans `apps/vue-app` ou `apps/docs` :
- MazBtn (toutes variantes × états)
- MazInput, MazCard, MazAlert, MazPopover
- Toggle light/dark/auto + switch entre les 5 presets bundled
- Comparaison screenshot avant/après sur chaque preset
- Ajustement des pourcentages `color-mix` si écart trop important

### Smoke test SSR

Build `apps/nuxt-app` → vérifier l'absence de mismatch hydration entre CSS server et client.

---

## Plan d'implémentation

Étapes mergeables indépendamment :

1. **Snapshots du CSS actuel** sur les 5 presets bundled (baseline pour comparer avant/après refacto)
2. **Réécrire `css-generator.ts`** + créer `__tests__/css-generator.test.ts`
3. **Validation visuelle** sur composants clés, tuning des pourcentages `color-mix` par couleur si nécessaire
4. **Étendre `update-document-class.ts`** + `lightClass` option, créer `__tests__/update-document-class.test.ts`
5. **Nettoyer `setup-theme.ts`** (suppression branche `mediaQuery`), retirer `noTransition` du flow toggle
6. **Bonus 1** — implémenter `color-scheme-meta.ts` + intégration module Nuxt
7. **Bonus 2** — émission `@property` + transition dans `css-generator`, validation runtime browser (`light-dark` accepté en `initial-value`)
8. **Bonus 3** — `utils/view-transition.ts` lazy + paramètre `animate` dans `useTheme`
9. **Supprimer `color-utils.ts`** + réduire `color-parser.ts` à `normalizeColor`
10. **Documentation** — README + JSDoc pour les nouvelles options

---

## Pièges identifiés

| Piège | Mitigation |
|---|---|
| `color-mix(in oklch, base, white|black N%)` ≠ algo JS actuel — paliers visuellement différents | Validation visuelle obligatoire en étape 3, tuning par couleur si nécessaire |
| `@property + light-dark()` historiquement instable | Test sur 3 browsers stables en étape 7, fallback auto sur `colorTransition: false` si échec |
| Performance des 154 `color-mix` au runtime | Résolution mise en cache par le navigateur, impact non mesurable. À monitorer empiriquement. |
| Utilisateur définit preset light-only sans `colors.dark` | Le type `ThemePreset` rend `colors.dark` requis ; en cas d'override partiel, le merger préserve déjà la base. Fallback `D = L` au générateur en défense. |
| View Transitions API non supporté (Firefox stable) | Graceful degradation : si `document.startViewTransition` absent, exécution synchrone du callback. Pas de feature-breaking. |
| Mismatch SSR / client | Le `<meta name="color-scheme">` émis côté server avec le mode résolu via cookie aligne le rendering. Smoke test sur `apps/nuxt-app`. |
| Tests existants qui assertent la présence de `.dark { ... }` dans le CSS | Mettre à jour les assertions vers la nouvelle shape (`.dark { color-scheme: only dark }`) |

---

## Notes finales

- **Aucun breaking change** pour les consumers : toutes les additions sont des options non-required avec défauts sensés.
- **Migration utilisateur** : transparente. Au pire, un consumer qui passe un preset avec uniquement `colors.light` ne perd rien (le dark mode résout sur la valeur light, comme aujourd'hui).
- **Tailwind v4** : le pont `@theme inline` dans `packages/lib/src/tailwindcss/theme-colors.css` reste tel quel. La chaîne `bg-primary/60` → `color-mix(in oklab, var(--color-primary), transparent 40%)` → `color-mix(in oklab, var(--maz-primary), transparent 40%)` → `color-mix(in oklab, light-dark(...), transparent 40%)` est valide par spec CSS Color Module Level 5 et fonctionne sur tous les navigateurs Baseline 2024+.
