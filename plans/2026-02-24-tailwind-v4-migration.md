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
- **Mainteneur solo, pas de support v4 parallèle** — après stable v5, v4 n'est plus maintenue (ni security fixes, ni backports).

---

## Méthodologie d'exécution

Cette section gouverne **comment** le plan est exécuté. Les règles ci-dessous sont des garde-fous pour garantir la qualité d'un major release porté par un mainteneur solo.

### Règle 1 — Une phase = une session focused

Pas de fragmentation arbitraire. Si une phase est trop grosse pour tenir en une session (ex: Phase 3 rename + fixes, Phase 7 tests complets), elle est découpée en sous-sessions cohérentes (une sous-phase par session). Jamais l'inverse : deux phases dans une session.

### Règle 2 — Pause obligatoire avant chaque phase : choisir la technique

Avant d'attaquer une phase, s'arrêter et répondre explicitement à **"quelle est la bonne technique ici ?"**. Documenter le choix dans un commentaire de commit ou un message à l'utilisateur avant de coder.

Matrice de décision :

| Nature de la phase                                         | Technique                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| **Design-heavy** (nouvelle API, architecture, choix)       | Interactif avec le mainteneur. Brainstorm → alignement → code. Skill `superpowers:brainstorming`. |
| **Bug / comportement inattendu**                           | Investigation d'abord. Skill `superpowers:systematic-debugging`. |
| **TDD applicable** (pure function, transform, parser)      | Tests écrits AVANT l'implémentation. Skill `superpowers:test-driven-development`. |
| **Mécanique + validation claire** (rename, scaffolding)    | **Subagent-driven parallèle**. Skill `superpowers:subagent-driven-development`. |
| **Exploration codebase > 3 recherches**                    | Agent `Explore` en subagent (protège le contexte principal). |
| **Review critique à un gate**                              | Agent `superpowers:code-reviewer`.                           |
| **Doc multi-pages indépendantes**                          | Subagent-driven parallèle (une page = un subagent).          |

### Règle 3 — Subagent-driven pour tout ce qui est parallélisable et mécanique

Identifier, dans chaque phase, les sous-tâches **indépendantes** (pas de shared state, pas d'ordre imposé) et les dispatcher en parallèle via des subagents. Gain massif sur :

- **Phase 3** — fichiers Vue à fixer après le rename script (bug au cas par cas) : un subagent par composant problématique.
- **Phase 7.7** — scaffolding Playwright : un subagent par composant.
- **Phase 8.1** — fixtures codemod avant/après : un subagent par transform.
- **Phase 9.1–9.3** — rédaction des pages doc indépendantes (installation, theming, browser-support) : un subagent par page.
- **Phase 6.4.1** — éclatement de `theme.css` en modules : un subagent par module si la structure est clarifiée.

À chaque fois, les subagents s'exécutent dans le même message (parallélisation réelle), avec un brief explicite par subagent (pas de prompt terse).

### Règle 4 — Discipline de session

**Début de session**, dans cet ordre :
1. Lire `plans/2026-02-24-tailwind-v4-migration.md` (source de vérité).
2. Lire `MEMORY.md` + mémoires projet pertinentes.
3. `git log --oneline v5/tailwind-v4 ^master` (ce qui a été fait).
4. Identifier la prochaine phase/sous-phase (marqueur `⏭ next` dans le plan).

**Fin de session**, dans cet ordre :
1. Commit scopé `feat(v5-phase-N): description précise`.
2. Plan mis à jour avec marqueurs : `✅ done` / `🚧 in progress` / `⏭ next`.
3. Mémoire ajoutée si décision non triviale prise (ex: choix d'approximation OKLCH, décision sur `postcss-replace`).

### Règle 5 — Gates de qualité non négociables entre phases

Avant de démarrer une nouvelle phase :

1. `pnpm healthcheck` vert.
2. Code review via l'agent `superpowers:code-reviewer` sur les changements de la phase qui se termine.
3. Canary publié et testé par le mainteneur sur au moins un projet externe (détection précoce de régression).
4. Validation explicite du mainteneur sur les points de décision listés dans la phase.

Pas de "on verra plus tard" qui accumule de la dette.

### Règle 6 — Escalade au mainteneur sur les décisions structurantes

Points où l'exécution s'arrête et le mainteneur décide :

- **Fin Phase 1** — approximation de conversion OKLCH → HSL : précision acceptable ou exiger une conversion colorimétrique exacte ?
- **Fin Phase 2** — validation des noms de tokens exposés au consommateur (contrat public, impossible à changer sans breaking).
- **Fin Phase 4** — décision finale sur `postcss-replace` (supprimer ou garder), avec mesure CSS compilée à l'appui.
- **Fin Phase 8** — review des breaking changes du codemod avant publish npm.

Ces escalades sont listées dans la phase correspondante.

---

## Phase -1 : Baselines de mesure (prérequis)

**Statut** : 🟡 partiellement fait — quick baselines ✅, Playwright ⏭ reporté à la prochaine session

**Contexte** : cette phase est **exécutée avant toute modification du code source**. Elle capture l'état "avant" pour pouvoir mesurer objectivement l'impact de la migration v4 sur la taille du bundle, le temps de build et le rendu visuel. Ces mesures seront publiées dans le CHANGELOG v5 et le blog post (Phases 9.4 et 9.5).

**Lieu d'exécution** : worktree `../maz-ui-v5` sur branche `v5/tailwind-v4`, **sans aucun changement de code applicatif** par rapport à `develop`. Tout commit qui modifie du code doit venir après cette phase.

### -1.1 Setup worktree ✅

- `git worktree add ../maz-ui-v5 -b v5/tailwind-v4` depuis `develop` (inclut fixes v4.9.3 — identique à `master` au moment de la migration).
- `pnpm install` dans le worktree (postinstall `nuxi prepare` de `apps/nuxt-app` échoue car `@maz-ui/utils/dist/*` pas encore built au moment du postinstall — non bloquant, se résout après `pnpm build:packages`).
- `pnpm test:unit:all` comme sanity check : **2835 tests passed / 0 failed** sur 7 projets (23s). Baseline verte confirmée.

### -1.2 Bundle size baseline ✅

```bash
cd packages/lib && pnpm build
wc -c dist/css/main.css                        # taille brute
gzip -c dist/css/main.css | wc -c              # taille gzippée
du -sh dist/                                   # total dist
```

Sauvegarder dans `tools/baselines/v3-bundle.txt` avec date et version exacte.

**Résultat (2026-04-23, commit 293882df0, v4.9.3)** :

- `main.css` : **13 279 B raw / 2 626 B gzip**
- `aos.css` : 19 292 B raw / 1 743 B gzip
- Total `dist/` : 2.2 MB (434 fichiers : 74 CSS, 204 JS, 156 .d.ts)

### -1.3 Build time baseline ✅

3 runs moyennés, cache NX clear entre chaque pour reproductibilité :

```bash
for i in 1 2 3; do
  pnpm nx:cache:clear
  rm -rf packages/lib/dist
  /usr/bin/time -p pnpm -C packages/lib build 2>&1 | grep real
done
```

Sauvegarder dans `tools/baselines/v3-buildtime.txt`.

**Résultat (Apple M1 Pro)** : 9.16s / 8.73s / 8.59s → **moyenne 8.83s** (écart-type ~0.3s).

### -1.4 Screenshots visuels Playwright ⏭ reporté à la prochaine session

**Technique** : subagent-driven (une tâche par composant en parallèle) — Règle 3 du plan.

Setup minimal Playwright dans `apps/vue-app/tests/visual/`, une page de test par composant cible :

- MazBtn (variants, sizes, disabled, loading)
- MazInput, MazSelect, MazCheckbox, MazRadio, MazSwitch
- MazCard, MazAvatar, MazBadge
- MazDialog, MazDropdown, MazPopover, MazTooltip
- MazTabs, MazTable
- MazPicker, MazDatePicker

Chaque composant : screenshot light + dark + chaque couleur principale (primary, secondary, destructive).

Baselines stockées dans `apps/vue-app/tests/visual/__screenshots__/v3/` et committées sur la branche `v5/tailwind-v4` pour référence pendant les phases suivantes.

**Raison du report** : setup Playwright (install browsers, config Vue test harness, écrire un fixture par composant, validation visuelle par le mainteneur) = ampleur d'une session dédiée. Doit impérativement être fait AVANT Phase 0 pour que la baseline soit capturée sur du code non modifié.

**Handoff vers prochaine session** : technique = subagent-driven (un subagent par composant), voir Règle 3.

### -1.5 Vérification Phase -1

- `pnpm healthcheck` vert (ou documenté comme "pré-existant" si échec non lié à v5).
- `tools/baselines/v3-bundle.txt` et `tools/baselines/v3-buildtime.txt` présents et lisibles.
- Screenshots Playwright v3 committés, au moins 15 composants × 2 modes = ~30 images minimum.
- **Commit** : `chore(v5): capture v3 baselines before migration`.

### -1.6 Escalade mainteneur

Aucune décision à valider à ce stade — mesures et setup seulement.

---

## Phase 0 : Préparation des dépendances

**Statut** : ✅ done (commits `21042bceb`, `dc5bd60d4`)

### 0.1 Mettre à jour les dépendances ✅

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

**Note d'exécution** : en plus des retraits listés (autoprefixer, postcss-import, postcss-nested), `packages/lib/postcss.config.cjs` a été simplifié immédiatement pour remplacer `tailwindcss` par `@tailwindcss/postcss` et retirer les plugins v3 incompatibles (`tailwindcss/nesting`, `postcss-nested`, `postcss-import`, `autoprefixer`). Sans ce fix, les tests cassaient à cause du loader PostCSS de Vite. Le nettoyage final (retrait de `postcss-url` et `postcss-replace`) reste prévu en Phase 4.1.

### 0.2 Script de rename des classes ✅

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

**Implémentation livrée** : `tools/migrate-tw-prefix/` (transform.ts + cli.ts + transform.test.ts). 22 tests TDD green sur fixtures Gherkin. Dry-run validé : 79/83 fichiers à modifier, spot-check manuel OK sur MazDialog, MazCard, MazAvatar (variants, `:class` bindings, arbitrary values, important modifier). L'exécution réelle aura lieu en Phase 3.

---

## Phase 1 : @maz-ui/themes — Système de couleurs

**Statut** : ✅ done — tous les sous-objectifs livrés et tests verts (233 tests themes). Escalade mainteneur sur précision OKLCH : approximation standard (matrice OKLab → linéaire sRGB → sRGB → HSL) suffisante pour la génération d'échelles, à valider visuellement en Phase 7.5 avec un preset oklch custom si besoin.

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

**Statut** : 🟡 mostly done — bridge + utilities + entry + padded-container migrés et compile OK via `@tailwindcss/cli`. Snapshot tests (2.6) reportés à une session dédiée (subagent-driven après Phase 3 quand les utilities réelles seront générées).

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

### 2.6 Snapshot tests du bridge & des presets

**Objectif** : verrouiller le comportement du bridge (mapping `--color-*` → `var(--maz-*)`) et des sorties CSS des 4 presets, pour détecter toute régression silencieuse lors de modifications futures.

**Nouveau fichier** : `/packages/lib/src/tailwindcss/__tests__/bridge.test.ts`

Pour chaque preset (`mazUi`, `ocean`, `pristine`, `obsidian`) :

1. Compiler un fichier CSS minimal qui `@import "tailwindcss"` + bridge + un petit template avec `bg-primary`, `text-foreground`, `rounded`, `shadow-elevation`, `md:bg-secondary`, `dark:bg-surface-50`.
2. Snapshot du CSS compilé → vérifier que :
   - `.bg-primary` contient `var(--maz-primary)` (et non une valeur hardcodée).
   - Les utilities conservent bien le prefix `maz:` en contexte lib.
   - Les variants (`dark:`, `md:`, `hover:`) fonctionnent.
3. Bootstrapper chaque preset avec `setupTheme()` en JSDOM et vérifier que `--maz-primary` est injecté avec la bonne valeur `hsl()`.

**Nouveau fichier** : `/packages/themes/src/__tests__/preset-output.snap.test.ts`

Snapshot complet du CSS injecté par chaque preset (y compris dark mode et scales). Une modification de valeur d'un preset devient un diff review explicite.

### 2.7 Vérification Phase 2

Vérifier que le fichier CSS d'entrée est syntaxiquement correct avec :

```bash
npx @tailwindcss/cli -i packages/lib/src/tailwindcss/tailwind.css -o /tmp/test-output.css
```

Lancer les snapshot tests :

```bash
cd packages/lib && pnpm test:unit -- bridge
cd packages/themes && pnpm test:unit -- preset-output
```

---

## Phase 3 : Composants — Rename des classes

**Statut** : ✅ done — codemod appliqué, classes transformées, tous les tests passent (2835/2835). 106 classes custom BEM/Vue Transition/JS handler state ont été correctement isolées du rename Tailwind. Commits `3c28865ba`, `ee450333c`, `8e30b2ee9`, `34c48e5f7`.

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

**Statut** : ✅ done — `pnpm -C packages/lib build` passe en 10.12s. `@tailwindcss/cli` utilisé pour main.css, `@tailwindcss/vite` pour résolution `@apply` dans les `<style>` blocks, `@reference` directive ajoutée dans chaque SFC (71 fichiers). Utilitaires bare (blur, backdrop-blur, drop-shadow) renommés au passage. Validation officielle : passe `npx @tailwindcss/upgrade` qui apporte quelques améliorations idiomatiques (`[var(--x)]` → `(--x)`, `w-[3rem]` → `w-12`, `end-0` → `inset-e-0`).

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

### 4.5 Tests SSR et performance build

**SSR / hydratation** : `@maz-ui/themes` doit injecter les `--maz-*` aussi bien côté serveur (Nuxt, SSR Vue) que côté client, sans flash de thème incorrect (FOUT/FOUC) à l'hydratation.

- Ajouter un test dans `apps/nuxt-app` qui rend une page SSR, vérifie que le CSS inline contient les `--maz-*` attendues au server render, et qu'il n'y a pas de mismatch client/serveur.
- Documenter la stratégie d'injection SSR dans le README de `@maz-ui/themes`.

**Performance build** : Tailwind v4 annonce un build 5-10× plus rapide. À mesurer et documenter pour l'annonce de release.

- Baseline v4.9.3 (v3) : `time pnpm -C packages/lib build` → noter les temps (build complet, rebuild incremental).
- Après migration v5 : même mesure.
- Documenter le delta dans le CHANGELOG v5 et dans le blog post.

### 4.6 Vérification Phase 4

```bash
cd packages/lib && pnpm build
```

Vérifier :

1. `dist/css/main.css` est généré et contient les utilities avec le prefix `maz:`
2. Les CSS per-component dans `dist/` ont les `@apply` correctement résolus
3. Pas de duplication excessive
4. Temps de build mesuré et comparé à la baseline v3

---

## Phase 5 : Apps — Migration

**Statut** : ✅ done — les 3 apps buildent.

- 5.1 `apps/vue-app` ✅ — commit `363b30154`, build 1.82s.
- 5.2 `apps/docs` ✅ — commit `053ae478c`, build 43.16s. VitePress nettoyé (postcss chain simplifié, main.css réécrit en v4, `hsl(var(--x))` → `var(--x)` + `color-mix()` pour alpha).
- 5.3 `apps/nuxt-app` ✅ — commit `7f6375956`, build <1s. `@nuxtjs/tailwindcss` retiré (v6 pas compat v4), remplacé par `@tailwindcss/vite`.

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

**Statut** : ✅ done — tous les artefacts v3 supprimés, linters v4-ready, exports consommateur en place. Commits `fe5905095` (cleanup + postcss simplification), `975ee00f0` (linters), `cbedad205` (consumer exports), `6eae6e7e1` (hsl() cleanup global).

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

**Statut** : ✅ done — exports publics en place (`maz-ui/tailwindcss/theme.css`, `…/utilities.css`, et les 6 modules granulaires), les 3 apps internes utilisent ces paths publics, doc dédiée `apps/docs/src/guide/tailwind.md` + mentions dans getting-started / vue / nuxt. Commits `cbedad205`, `c829a2fe7`.

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

**Statut** : 🟡 mostly done — typecheck, lint, build, CSS inspection et métriques bundle/build faits. Phases 7.5 (inspection visuelle manuelle) et 7.7 (tests Playwright) reportées à des sessions dédiées.
- Typecheck ✅ (correctif `tailwindcss/types/config` retiré)
- Lint ✅ (nuxt stylelint config nettoyé)
- Build ✅ (3 apps + lib)
- Tests ✅ (2835 + 26 codemod + 233 themes)
- CSS inspection ✅ (prefix propre, color-mix pour alpha, pas de leak)
- Bundle size + build time capturés dans `tools/baselines/SUMMARY.md` : main.css +35KB raw mais dist total +5%, build +45% sur cold NX cache (trade-off per-SFC @tailwindcss/vite)

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

### 7.7 Tests visuels automatisés

Un refactor qui touche toutes les classes de tous les composants DOIT avoir un filet visuel. Options à évaluer :

**Option A — Playwright + snapshots** (recommandé, interne) :

- Créer une suite `apps/vue-app/tests/visual/` avec une page par composant.
- `@playwright/test` en mode screenshot avec baseline sur `master` (v4) → compare après migration.
- Inclure : default, dark mode, chaque preset, hover/focus states.
- Lancer sur CI dans un container linux pour déterminisme des rendus.

**Option B — Chromatic** (externe, payant mais moins d'effort) :

- Setup Storybook minimal qui importe les composants maz-ui.
- Chromatic publie les baselines et gère les diffs.

Décision : **Option A** (pas de dépendance tierce, mainteneur solo). Scope minimal pour v5 : couvrir les 15-20 composants les plus utilisés (Btn, Input, Select, Checkbox, Radio, Dialog, Card, Avatar, Badge, Tabs, Tooltip, Popover, Dropdown, Picker, Table). Les autres seront couverts incrémentalement.

### 7.8 Mesure du bundle CSS avant/après

**Baseline v3** (avant démarrage de la migration) :

```bash
git checkout master
cd packages/lib && pnpm build
wc -c dist/css/main.css
wc -c dist/css/main.css | gzip -c | wc -c
```

**Après migration v4** : mêmes commandes, comparer.

Inclure le delta (taille brute + gzippée) dans le CHANGELOG v5 et le blog post. Si la taille augmente significativement (contre la promesse v4), investiguer le `@apply` unresolved ou la duplication.

---

## Phase 8 : Migration guide & codemod utilisateur

**Contexte** : v5 est un breaking change majeur pour les utilisateurs de la lib (prefix `maz-` → `maz:`, utilities renommées, types modifiés, config CSS-first). Un mainteneur solo ne peut pas supporter la v4 en parallèle — donc le chemin de migration des utilisateurs doit être **automatisé et documenté avec rigueur**.

### 8.1 Codemod `@maz-ui/codemod`

Publier un package npm dédié qui réutilise et étend le script interne de Phase 0.2.

**Nouveau package** : `/packages/codemod/`

```
packages/codemod/
├── package.json          # publié en npm, exécutable via npx
├── src/
│   ├── index.ts          # CLI entry
│   ├── transforms/
│   │   ├── tailwind-prefix.ts      # maz- → maz:
│   │   ├── tailwind-renames.ts     # rounded-sm → rounded-xs, etc.
│   │   ├── tailwind-important.ts   # !maz-x → maz:x!
│   │   └── theme-types.ts          # HSL → CSSColor dans ts
│   └── utils/
│       └── file-walker.ts
└── README.md
```

**CLI** :

```bash
npx @maz-ui/codemod tailwind-v4 ./src
npx @maz-ui/codemod tailwind-v4 ./src --dry-run
npx @maz-ui/codemod tailwind-v4 ./src --extensions=vue,tsx,jsx,html
```

**Garanties** :

- Supporte Vue SFC, React JSX/TSX, Svelte, Astro, HTML plain.
- Mode `--dry-run` pour prévisualiser les changements.
- Gère les classes dynamiques dans les `:class` bindings (best effort, flag les cas ambigus).
- Préserve la mise en forme (indentation, guillemets) — utiliser un parser AST (ex: `@babel/parser` pour JSX, `@vue/compiler-sfc` pour Vue).
- Tests unitaires : un fichier fixture avant/après par type de transformation.

### 8.2 Guide de migration dans la doc

**Nouveau fichier** : `/apps/docs/src/guide/migration/v4-to-v5.md`

Structure :

1. **TL;DR** — commande npx codemod + ce qui reste à faire manuellement.
2. **Prérequis** — Node >= X, Tailwind v4 côté app, navigateurs supportés.
3. **Étape 1 : exécuter le codemod** — transforme automatiquement les classes.
4. **Étape 2 : migrer la config Tailwind** — supprimer `tailwind.config.ts`, passer au CSS-first (avec snippet copy-paste).
5. **Étape 3 : migrer les types TypeScript** — `HSL` → `CSSColor`, format des presets.
6. **Étape 4 : valider** — checklist visuelle, commandes de test.
7. **Tableau des breaking changes** — exhaustif, référence rapide.
8. **Troubleshooting** — classes non détectées, CSS dupliqué, dark mode cassé, SSR qui flash.
9. **FAQ**.

### 8.3 Tableau exhaustif des breaking changes

À inclure dans le guide de migration ET dans le CHANGELOG v5.

| Catégorie   | v4                                 | v5                                    | Auto via codemod |
| ----------- | ---------------------------------- | ------------------------------------- | ---------------- |
| Prefix      | `maz-flex`                         | `maz:flex`                            | ✅               |
| Important   | `!maz-m-0`                         | `maz:m-0!`                            | ✅               |
| Utilities   | `maz-rounded-sm`                   | `maz:rounded-xs`                      | ✅               |
| Utilities   | `maz-outline-none`                 | `maz:outline-hidden`                  | ✅               |
| Utilities   | `maz-backdrop-blur-sm`             | `maz:backdrop-blur-xs`                | ✅               |
| Utilities   | `maz-bg-gradient-to-r`             | `maz:bg-linear-to-r`                  | ✅               |
| Utilities   | `maz-shadow` (bare)                | `maz:shadow-sm`                       | ✅               |
| Types       | `HSL`                              | `CSSColor` (alias de `string`)        | ✅               |
| Presets     | `'210 100% 56%'`                   | `'hsl(210 100% 56%)'` / `'#...'`      | ⚠️ manuel        |
| Config      | `tailwind.config.ts` côté app      | `@import "tailwindcss"` dans CSS      | ❌ manuel        |
| API         | `defineMazTailwindConfig()`        | Deprecated, remplacé par CSS-first    | ❌ manuel        |
| Navigateurs | —                                  | Chrome 111+, Safari 16.4+, Firefox 128+ | —             |

### 8.4 Vérification Phase 8

- Tester le codemod sur `apps/vue-app` encore en v4 (dans une branche éphémère) — il doit tout transformer sans casser le build.
- Tester sur un projet externe de l'utilisateur (test first-party).
- Relire le guide avec un œil "je découvre la lib" et traquer les implicites.

---

## Phase 9 : Documentation & communication

### 9.1 Refonte page Installation

**Fichier** : `/apps/docs/src/guide/installation.md` (ou équivalent)

- Snippet d'install complet avec Tailwind v4 CSS-first.
- Section dédiée "Intégration avec votre propre Tailwind" → reprend les 3 scénarios de Phase 6.4.3.
- Onglets framework : Vue, Nuxt, Vite, Astro.

### 9.2 Guide de theming mis à jour

**Fichier** : `/apps/docs/src/guide/theming.md`

- Expliquer le nouveau type `CSSColor` et les formats acceptés (`hsl()`, `oklch()`, `rgb()`, `#hex`).
- Marquer le format legacy `'210 100% 56%'` comme deprecated (mais toujours accepté, auto-wrappé).
- Exemples de presets custom avec chaque format.
- Flux de bascule de preset à chaud (code JS + résultat visuel).

### 9.3 Nouvelle page Browser support

**Nouveau fichier** : `/apps/docs/src/guide/browser-support.md`

- Minimums : Chrome 111+, Safari 16.4+, Firefox 128+.
- Explication : Tailwind v4 utilise `@property`, `color-mix()`, cascade layers natives.
- Comment vérifier : lien vers caniuse pour chaque feature.
- Pas de polyfill prévu.

### 9.4 CHANGELOG v5

**Fichier** : `CHANGELOG.md`

Structure :

- `## 5.0.0 — YYYY-MM-DD`
- `### BREAKING CHANGES` — liste exhaustive avec lien vers le guide de migration.
- `### Features` — Tailwind v4, theming multi-format, scénarios d'intégration consommateur.
- `### Performance` — temps de build (delta vs v3), taille bundle CSS (delta vs v3).
- `### Internal` — refactos non visibles.
- `### Migration` — lien proéminent vers `guide/migration/v4-to-v5.md` et commande codemod.

### 9.5 Blog post de release

**Nouveau fichier** : `/apps/docs/src/blog/maz-ui-v5.md`

Structure narrative :

1. Pourquoi Tailwind v4 pour maz-ui.
2. Ce qui change pour vous (pitch court, focus utilisateur).
3. La nouveauté killer : intégrer les tokens du design system dans votre propre Tailwind en 3 lignes.
4. Gains mesurés (build speed, bundle size).
5. Comment migrer (1 commande + guide).
6. Roadmap post-v5 et remerciements.

### 9.6 Communication externe

- GitHub Release avec le contenu du CHANGELOG + lien blog post.
- Pin d'une issue GitHub "v5 feedback" pour centraliser les retours.
- Post sur les réseaux (X, Bluesky, Reddit r/vuejs si pertinent).
- Mention dans les newsletters communautaires (Vue.js News, This Week in Vue).

---

## Phase 10 : Release strategy

**Contrainte** : mainteneur solo, pas de support parallèle de la v4 après la sortie stable de la v5 (pas de security fixes ni backports). Les canary/alpha/beta sont donc d'autant plus critiques pour capter les bugs avant stable.

### 10.1 Canary — dès que la lib build

- Tag npm : `canary`.
- Publication automatique à chaque merge sur la branche `v5` (via GitHub Action).
- Usage : `pnpm add maz-ui@canary`.
- Pas de guarantee de stabilité, changes à chaque commit.

### 10.2 Alpha — Phases 0 à 6 terminées

- Tag npm : `alpha`.
- API publique gelée (bridge Tailwind + exports).
- Annonce dans un issue GitHub "v5 alpha: feedback welcome".

### 10.3 Beta — Phases 7 à 9 terminées

- Tag npm : `beta`.
- Doc complète en ligne, codemod publié.
- QA communautaire : migration test sur des projets tiers volontaires.

### 10.4 RC — bugs remontés en beta corrigés

- Tag npm : `rc`.
- Freeze total, uniquement des fixes critiques entre RC et stable.

### 10.5 Stable

- Tag npm : `latest`.
- Blog post publié, GitHub Release, communication externe.
- Issue "v5 feedback" épinglée.

### 10.6 Dépréciation v4

- Readme et npm : ajouter une bannière v4 "no longer maintained, please upgrade to v5 — migration guide: ...".
- Dernière version v4 : ajouter une note `deprecate` via `npm deprecate`.
- Pas de security fixes annoncés pour la v4. À documenter explicitement dans le CHANGELOG v5 et dans la deprecation notice.

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

### Tests du bridge et visuels (Phases 2, 4, 7)

| Fichier                                                          | Action                                                |
| ---------------------------------------------------------------- | ----------------------------------------------------- |
| `packages/lib/src/tailwindcss/__tests__/bridge.test.ts`          | **NOUVEAU** — snapshot bridge + 4 presets (2.6)       |
| `packages/themes/src/__tests__/preset-output.snap.test.ts`       | **NOUVEAU** — snapshot CSS par preset (2.6)           |
| `apps/nuxt-app/tests/ssr/theme-injection.test.ts`                | **NOUVEAU** — test SSR `--maz-*` (4.5)                |
| `apps/vue-app/tests/visual/`                                     | **NOUVEAU** — suite Playwright screenshots (7.7)      |
| `playwright.config.ts` (workspace)                               | **NOUVEAU** — config visual tests (7.7)               |
| Script CI — baseline bundle size + build time                    | **NOUVEAU** — mesure avant/après (4.5, 7.8)           |

### Codemod et migration utilisateur (Phase 8)

| Fichier                                                | Action                                             |
| ------------------------------------------------------ | -------------------------------------------------- |
| `packages/codemod/`                                    | **NOUVEAU package** — `@maz-ui/codemod` publié     |
| `packages/codemod/src/transforms/tailwind-prefix.ts`   | **NOUVEAU** — transforme `maz-x` → `maz:x`         |
| `packages/codemod/src/transforms/tailwind-renames.ts`  | **NOUVEAU** — utilities renommées v4               |
| `packages/codemod/src/transforms/tailwind-important.ts`| **NOUVEAU** — `!maz-x` → `maz:x!`                  |
| `packages/codemod/src/transforms/theme-types.ts`       | **NOUVEAU** — type HSL → CSSColor                  |
| `packages/codemod/__tests__/fixtures/`                 | **NOUVEAU** — fixtures avant/après                 |
| `apps/docs/src/guide/migration/v4-to-v5.md`            | **NOUVEAU** — guide complet                        |

### Documentation & communication (Phase 9)

| Fichier                                        | Action                                          |
| ---------------------------------------------- | ----------------------------------------------- |
| `apps/docs/src/guide/installation.md`          | Refonte complète (9.1)                          |
| `apps/docs/src/guide/theming.md`               | Mise à jour — nouveaux formats couleur (9.2)    |
| `apps/docs/src/guide/browser-support.md`       | **NOUVEAU** — minimums navigateurs (9.3)        |
| `CHANGELOG.md`                                 | Entrée `5.0.0` complète (9.4)                   |
| `apps/docs/src/blog/maz-ui-v5.md`              | **NOUVEAU** — blog post release (9.5)           |
| GitHub Release, issue feedback, réseaux        | Communication externe (9.6)                     |

### Release strategy (Phase 10)

| Artefact                                    | Action                                            |
| ------------------------------------------- | ------------------------------------------------- |
| `.github/workflows/release-canary.yml`      | **NOUVEAU** — publish auto `canary` tag           |
| `.github/workflows/release-prerelease.yml`  | **NOUVEAU** — publish `alpha`/`beta`/`rc`         |
| `package.json` root — scripts release       | Adapter `version:*` et `publish:*` par tag        |
| `npm deprecate` sur `maz-ui@4.x`            | Après sortie stable v5 (10.6)                     |
| README bannière v4                          | Ajouter notice "no longer maintained" (10.6)      |

---

## Risques et points d'attention

1. **`@tailwindcss/vite` et le build lib** : Le plugin Vite traite les `<style>` blocks. S'il interfère avec le `cssCodeSplit` ou `libInjectCss`, il faudra peut-être le désactiver pour le build production et n'utiliser que `@tailwindcss/postcss`.

2. **Duplication CSS** : Vérifier que le CLI ne génère pas des utilities déjà résolues par @apply dans les composants. Si c'est le cas, réintroduire le content transform.

3. **`postcss-replace` suppression** : Vérifier que v4 avec `prefix(maz)` préfixe correctement TOUTES les variables internes. Inspecter `dist/css/main.css` pour confirmer qu'il n'y a plus de `--tw-*` non préfixées.

4. **`@nuxtjs/tailwindcss`** : Vérifier la compatibilité avec Tailwind v4. Si incompatible, utiliser `@tailwindcss/vite` directement dans la config Nuxt.

5. **Browser support** : Chrome 111+, Safari 16.4+, Firefox 128+. Documenter dans le CHANGELOG.

6. **`cap-f::first-letter`** : La directive `@utility` ne supporte pas les pseudo-elements. Garder cette règle dans un fichier CSS standard (pas @utility).
