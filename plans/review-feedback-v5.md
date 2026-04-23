# v5 PR review — feedback tracker

**PR**: https://github.com/LouisMazel/maz-ui/pull/1546
**Branche**: `v5/tailwind-v4` → `develop`
**Reviewer**: LouisMazel (solo maintainer)
**Début de review**: 2026-04-23

Chaque entrée = un point soulevé pendant la review. État : 🟥 open · 🟧 in discussion · 🟨 decided, pending action · ✅ done.

---

## 1. Composants qui utilisent `class="maz:X"` brut dans les templates

**État** : 🟨 decided — doc à mettre à jour maintenant, refacto tracké pour après v5

### Constat

Les composants maz-ui écrivent directement du `class="m-btn maz:flex maz:items-center"` dans leurs `<template>` (77 occurrences sur 26 fichiers + ~120 dans les `:class` bindings dynamiques). Pour que ces classes rendent correctement, **quelque chose doit fournir la règle CSS `.maz\:flex { display: flex }`** — c'est le rôle de `main.css` (48 KB généré au build).

Conséquence : **`main.css` est aujourd'hui obligatoire** côté consommateur, contrairement à ce que la doc `tailwind.md` laissait entendre.

### Ce qui est dans la doc actuelle

`apps/docs/src/guide/tailwind.md` montre comme quick start :

```css
@import "tailwindcss";
@import "maz-ui/tailwindcss/theme.css";
@import "maz-ui/tailwindcss/utilities.css";
```

…sans mentionner `maz-ui/styles` (main.css). Incomplet.

### Ce que le consommateur fait vraiment

- Écrit du Tailwind **sans prefix** (plain `flex`, `bg-primary`, `p-4`)
- Utilise les composants maz-ui comme boîtes noires
- Le prefix `maz:` interne n'est PAS dans son code — il sert uniquement à isoler le CSS généré par maz-ui pour éviter les collisions avec le CSS du consommateur

### Décision

- **Court terme (pour la release v5)** : mettre à jour `tailwind.md` pour documenter honnêtement que `maz-ui/styles` (ou équivalent) est requis aujourd'hui.
- **Long terme (post-v5.0.0)** : refactor les 77 raw `class="maz:X"` + 120 bindings dynamiques en pattern `@apply` dans les `<style>` scopés. Objectif : per-component chunks self-contained, `main.css` devient vraiment optionnel. Scope ~1-2 jours focused, subagent-driven possible par composant.

### À faire

- [ ] Corriger `tailwind.md` avec la bonne quick start
- [ ] Ouvrir une issue GitHub "refactor raw maz: classes to @apply pattern" pour tracker

---

## 2. `@maz-ui/codemod` — utilité réelle pour les consommateurs

**État** : 🟧 in discussion — `packages/codemod/` reste dans la PR ; décision de publier ou non reportée (après merge, selon retours d'utilisateurs beta)

### Constat

Le codemod fait 5 transformations principales :

| Transformation | Utile pour maz-ui interne | Utile pour consommateurs |
|---|---|---|
| Prefix `maz-X` → `maz:X` | ✅ 1500 occurrences dans lib | ❌ jamais dans leur code |
| Variants `dark:maz-X` → `maz:dark:X` | ✅ | ❌ |
| Important `!maz-m-0` → `maz:m-0!` | ✅ | ❌ |
| Utility renames (rounded-sm → rounded-xs, etc.) | ✅ | 🟡 mais seulement sur classes préfixées `maz-` ; `@tailwindcss/upgrade` officiel fait le job sur classes plain |
| `hsl(var(--maz-X))` → `var(--maz-X)` | ✅ | ✅ **vraiment utile** si le consommateur customise maz-ui en CSS |
| `hsl(var(--X) / 0.5)` → `color-mix(...)` | ✅ | ✅ idem |
| `@apply X !important` → `@apply X!` | ✅ | 🟡 géré par `@tailwindcss/upgrade` officiel |

### Ce dont un consommateur a vraiment besoin pour migrer v4 → v5

1. `npx @tailwindcss/upgrade` (officiel Tailwind) — 95 % du boulot (utility renames, @apply !important, syntax v4)
2. Supprimer son `tailwind.config.ts` et écrire un CSS entry — manuel, pas codemod
3. Nettoyer ses `hsl(var(--maz-X))` customs — **seul morceau qu'`@tailwindcss/upgrade` ne fait pas**
4. Remplacer ses deep imports (`defineMazTailwindConfig`, etc.) — manuel

### Implication

Le gros du codemod sert la migration **interne** de maz-ui, pas les consommateurs. Publier un package npm de 10 KB quand 90 % de sa valeur a déjà été consommée en interne, c'est surdimensionné.

### Options proposées

- **A.** Ne pas publier `@maz-ui/codemod`. Garder `tools/migrate-tw-prefix/` en interne. Migration guide pointe sur `@tailwindcss/upgrade` + quelques sed manuels.
- **B.** Publier une version slim (uniquement `hsl(var())` + deep-import fixes).
- **C.** Garder tel quel, documenter honnêtement que c'est secondaire.

### À faire

- [ ] Décision : A / B / C
- [ ] Si A : retirer `packages/codemod` de la PR, mettre à jour le migration guide
- [ ] Si B : trimmer le code, réduire la taille du package
- [ ] Si C : clarifier le README du package

---

## 3. `@maz-ui/eslint-config` — suppression à tort du support `eslint-plugin-tailwindcss`

**État** : 🟨 decided, pending action — à restaurer

### Constat

Dans le commit `975ee00f0` (Phase 6.3) j'ai retiré :

- La dépendance `eslint-plugin-tailwindcss@^3.18.3` de `packages/eslint-config/package.json`
- La dépendance `@types/eslint-plugin-tailwindcss`
- L'import du plugin dans `src/index.ts`
- Le fichier `src/configs/tailwindcss.ts`
- La branche `opts.tailwindcss === true` (qui choisissait runtime entre ESLint 9 "active" et ESLint 10+ "warn")
- L'export public `tailwindcssRules`

Mon raisonnement : "maz-ui v5 utilise Tailwind v4, donc le plugin est mort pour nous". Erreur de cadrage.

### Ce qui manque dans ce raisonnement

`@maz-ui/eslint-config` est un **package public**. Ses consommateurs ne sont pas forcément des apps qui consomment maz-ui. Ils peuvent très bien :

- Être sur ESLint 9
- Être sur Tailwind v3
- Vouloir utiliser `opts.tailwindcss: true` pour le linting officiel de `eslint-plugin-tailwindcss@3.x`

Ma suppression casse ce cas d'usage pour eux.

### Décision

Restaurer la capabilité. Le comportement d'origine était bon :

```ts
if (opts.tailwindcss) {
  if (getEslintMajorVersion() >= 10) {
    console.warn('...not compatible with ESLint 10+...')
  }
  else {
    additionalConfigs.push(...tailwind.configs['flat/recommended'])
    additionalConfigs.push({ rules: tailwindcssRules })
  }
}
```

- Sur ESLint 9 + Tailwind v3 : ça marche
- Sur ESLint 10+ : warning au runtime, pas de rules chargées (upstream bug `context.getSourceCode()`)
- Sur ESLint 10+ + Tailwind v4 : idem, warning cohérent

### À faire

- [ ] Re-add `eslint-plugin-tailwindcss@^3.18.3` + `@types/eslint-plugin-tailwindcss@^3.17.0` dans `packages/eslint-config/package.json`
  - Envisager `peerDependenciesMeta.optional` pour ne pas forcer l'install côté users qui n'utilisent pas le flag
- [ ] Restaurer `packages/eslint-config/src/configs/tailwindcss.ts`
- [ ] Restaurer l'import + la branche conditionnelle dans `src/index.ts`
- [ ] Restaurer l'export de `tailwindcssRules`
- [ ] Restaurer `getEslintMajorVersion()` (le helper a aussi été supprimé)
- [ ] Rebuild + typecheck

---

## 4. CI global — `test:unit:all`, `lint:all`, `typecheck:all`, build ne passent pas

**État** : 🟥 open — blocker pour la release

### Constat (retour du mainteneur pendant la review)

Les commandes à la racine qui représentent le gate CI ne passent pas toutes :

- `pnpm test:unit:all` — chaque projet individuel semble OK quand lancé seul, mais le run global via `nx run-many -t test:unit` retourne exit code 1. Cause probable : erreurs de teardown d'environnement (jsdom / `EnvironmentTeardownError`) qui propagent un code de sortie non-zéro même quand les assertions passent. Vu sur le test:unit du lib.
- `pnpm lint:all` — non vérifié jusqu'au bout à la racine. J'ai fait passer `apps/nuxt-app lint` et `packages/lib exec stylelint` individuellement, mais jamais le run global.
- `pnpm typecheck:all` — non vérifié non plus. `packages/lib typecheck` passe après le fix de `tailwindcss/types/config`, mais rien ne garantit les autres packages.
- Build — `packages/lib`, `apps/vue-app`, `apps/nuxt-app`, `apps/docs` buildent chacun individuellement. `pnpm build:packages` passe. `pnpm build:apps` non testé.

### Ce que j'ai prétendu vs ce qui est vrai

Dans le PR body et mes récaps j'ai écrit "tests 7/7 verts", "all builds OK", etc. C'est **vrai par projet pris individuellement**, mais **faux au niveau du run global via NX**. Différence importante pour un release gate.

### Pourquoi c'est un problème

`pnpm healthcheck` (défini dans `package.json` root) chaîne `lint:all && typecheck:all && test:unit:all && build:packages && nx run docs:build`. Tant qu'un de ces maillons renvoie un exit non-zero, on ne peut pas considérer la PR comme mergeable selon la discipline CI du repo.

### À faire (par le mainteneur / en prochaine session)

- [ ] Lancer `pnpm healthcheck` à la racine et capturer l'exit code + output exact de chaque étape
- [ ] Pour `test:unit:all` : isoler si c'est un vrai fail de tests ou le teardown jsdom. Si teardown, décider : ignorer via NX `passWithNoTests` variante, régler la source (probablement `@maz-ui/icons` dynamic SVG loading), ou changer la commande pour filtrer
- [ ] Pour `lint:all` : identifier le premier package qui fail, corriger
- [ ] Pour `typecheck:all` : idem — identifier chaque package qui fail, corriger un par un
- [ ] Pour `build:apps` : vérifier que le run groupé passe (pas juste un-par-un)
- [ ] Ne pas claim "tests verts" dans les futurs récaps avant d'avoir vérifié le gate global

---

## 5. `padded-container-vars.css` — breakpoints perdus dans la conversion `@screen` → `@media`

**État** : 🟨 decided, pending action

### Constat

Dans `packages/lib/src/css/padded-container-vars.css`, j'ai remplacé :

```css
@screen mob-l {  /* v3 Tailwind directive, résolue via le theme */
  :root {
    --maz-container-padding-value: var(--maz-container-padding-tablet);
  }
}
@screen lap-s {
  :root {
    --maz-container-padding-value: var(--maz-container-padding-desktop);
  }
}
```

par :

```css
@media (width >= 576px) {  /* valeur en dur */
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

### Le problème

La directive `@screen` de v3 lisait dynamiquement la valeur du breakpoint depuis `theme.screens.mob-l`. Mon remplacement inline la valeur en dur — **le lien sémantique avec le système de breakpoints est cassé**. Si tu changes `--breakpoint-mob-l` de 576px à une autre valeur dans `theme-breakpoints.css`, cette règle ne suit plus.

### Bonne réponse en v4

`@screen` est retiré en v4, deux remplacements valides :

**Option A — `@variant` (préféré, remplacement le plus direct de `@screen`)** :

```css
:root {
  --maz-container-padding-value: var(--maz-container-padding-mobile);

  @variant mob-l {
    --maz-container-padding-value: var(--maz-container-padding-tablet);
  }

  @variant lap-s {
    --maz-container-padding-value: var(--maz-container-padding-desktop);
  }
}
```

v4 introduit `@variant <name> { ... }` qui applique n'importe quel variant (breakpoint, dark, hover, etc.) au bloc enclosant. Le nesting est naturel, les breakpoints restent sourcés du theme.

**Option B — `@media (width >= theme(--breakpoint-X))`** :

```css
@media (width >= theme(--breakpoint-mob-l)) { ... }
```

`theme()` résout au build. Marche aussi, plus verbeux.

Ce fichier est importé dans `packages/lib/src/tailwindcss/tailwind.css` via le chain `@import '../css/index.css'`, donc Tailwind v4 processe bien `@variant` / `theme()` à la compilation.

### À faire

- [ ] Remplacer les deux `@media (width >= Npx)` par `@variant mob-l { ... }` / `@variant lap-s { ... }` (option A préférée)
- [ ] Vérifier que `@tailwindcss/cli` résout bien `@variant` dans `@layer maz-ui-utilities` (rebuild + grep le CSS compilé)
- [ ] Grep le repo pour les autres endroits où j'ai hardcodé `@media (width >= Npx)` à la place d'un `@variant` / `theme()`
- [ ] Documenter dans le migration guide que les users qui avaient des `@screen` custom doivent passer à `@variant` ou `theme()` — `@tailwindcss/upgrade` officiel ne le fait pas tout seul

---

## 6. `theme-shadows.css` — valeurs arbitraires au lieu de tokens

**État** : 🟨 decided, pending action

### Constat

`packages/lib/src/tailwindcss/theme-shadows.css` :

```css
@theme inline {
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 5%);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -2px rgb(0 0 0 / 10%);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 10%), 0 8px 10px -6px rgb(0 0 0 / 10%);
  --shadow-elevation: 0 10px 15px -3px var(--color-elevation);
}
```

Problèmes :

1. **`rgb(0 0 0 / X%)` hardcodé** — pas de lien avec le thème. En dark mode avec fond très sombre, un shadow noir à 10 % est quasi-invisible ; il faudrait une couleur qui réagit au thème.
2. **Incohérence interne** : `--shadow-elevation` utilise `var(--color-elevation)` (bien) mais `--shadow-xs` … `--shadow-xl` utilisent du noir absolu (pas bien).
3. **Alpha en dur** (5 %, 10 %) — dupliqué sur 8 lignes, pas paramétrable sans éditer chaque ligne.
4. **Offsets/blur en px littéraux** — moins grave (c'est la dimension physique de l'ombre) mais pas non plus « token-ifiable » pour une marque qui voudrait une échelle d'ombres plus marquée.

### Proposition

Tokeniser la couleur et l'alpha, garder les dimensions comme tokens structurels :

```css
@theme inline {
  /* Source de la couleur d'ombre — suit le thème (cf. theme-colors.css : --color-elevation = var(--maz-shadow)) */
  --shadow-color: var(--color-elevation);

  /* Alpha scale — paramétrable, cohérent */
  --shadow-alpha-light: 5%;
  --shadow-alpha-default: 10%;

  --shadow-xs: 0 1px 2px 0 color-mix(in srgb, var(--shadow-color) var(--shadow-alpha-light), transparent);
  --shadow-sm: 0 1px 3px 0 color-mix(in srgb, var(--shadow-color) var(--shadow-alpha-default), transparent), 0 1px 2px -1px color-mix(in srgb, var(--shadow-color) var(--shadow-alpha-default), transparent);
  --shadow-md: 0 4px 6px -1px color-mix(in srgb, var(--shadow-color) var(--shadow-alpha-default), transparent), 0 2px 4px -2px color-mix(in srgb, var(--shadow-color) var(--shadow-alpha-default), transparent);
  --shadow-lg: 0 10px 15px -3px color-mix(in srgb, var(--shadow-color) var(--shadow-alpha-default), transparent), 0 4px 6px -4px color-mix(in srgb, var(--shadow-color) var(--shadow-alpha-default), transparent);
  --shadow-xl: 0 20px 25px -5px color-mix(in srgb, var(--shadow-color) var(--shadow-alpha-default), transparent), 0 8px 10px -6px color-mix(in srgb, var(--shadow-color) var(--shadow-alpha-default), transparent);
  --shadow-elevation: 0 10px 15px -3px var(--shadow-color);
}
```

Bénéfices :

- Un preset peut override `--maz-shadow` (ou le consommateur) → toutes les shadows suivent
- L'alpha est paramétrable en un endroit
- `--shadow-elevation` devient cohérent avec les autres (utilise la même source de couleur)

### Point ouvert

Si on ne veut pas mettre un alpha sur `--shadow-elevation` (c'est un cas spécial « shadow plein de la couleur theme »), on peut le garder séparé et juste renommer pour clarifier l'intention (`--shadow-elevation-full`). À trancher.

### À faire

- [ ] Remplacer les `rgb(0 0 0 / X%)` par `color-mix(in srgb, var(--shadow-color) var(--shadow-alpha-*), transparent)`
- [ ] Ajouter les tokens `--shadow-color` + `--shadow-alpha-light` + `--shadow-alpha-default`
- [ ] Vérifier visuellement les ombres dans les 4 presets (light + dark) — elles peuvent avoir un rendu légèrement différent vu que `var(--color-elevation)` n'est probablement pas du noir pur
- [ ] Si cassant visuellement : ajuster les alphas preset-par-preset, ou offrir un opt-in (`--shadow-source: theme | neutral`)
- [ ] Même exercice à faire sur `theme-radius.css` (valeurs `-8px`, `-4px`, `+4px`, `+8px` en dur autour de `var(--maz-radius)` — moins grave car pas de couleur mais même idée de tokenification possible)

---

## 7. `theme-typography.css` — durations et easing hardcodés

**État** : 🟨 decided, pending action

### Constat

`packages/lib/src/tailwindcss/theme-typography.css` :

```css
@theme inline {
  --font-sans: var(--maz-font-family);
  --default-border-width: var(--maz-border-width);
  --default-transition-duration: 200ms;
  --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Les deux premiers tokens (`--font-sans`, `--default-border-width`) sont bien thémés via `--maz-*`. Les deux autres sont **en dur**, sans lien avec le thème ni avec `@maz-ui/themes`.

### Problèmes

1. **`200ms` littéral** — un consommateur ne peut pas changer la durée globale de transition du design system sans override manuel de ce fichier.
2. **`cubic-bezier(0.4, 0, 0.2, 1)` littéral** — idem pour l'easing.
3. **Pas de scale** — v4 natif a `--transition-duration-fast`, `--transition-duration-normal`, etc. On ne suit pas cette convention ; on définit juste le default sans le reste.
4. **Manque côté `@maz-ui/themes`** — le preset ne fournit aujourd'hui pas de `--maz-transition-duration` / `--maz-easing-*`. Pas de source de vérité côté runtime.

### Proposition

Deux niveaux :

**Niveau CSS theme (`theme-typography.css`)** — offrir une scale tokenisée et sourcée du preset :

```css
@theme inline {
  --font-sans: var(--maz-font-family);
  --default-border-width: var(--maz-border-width);

  /* Timing scale */
  --duration-fast: var(--maz-duration-fast);       /* 100ms par défaut dans le preset */
  --duration-normal: var(--maz-duration-normal);   /* 200ms */
  --duration-slow: var(--maz-duration-slow);       /* 300ms */
  --default-transition-duration: var(--duration-normal);

  /* Easing scale */
  --ease-out: var(--maz-easing-out);               /* cubic-bezier(0.4, 0, 0.2, 1) */
  --ease-in: var(--maz-easing-in);
  --ease-in-out: var(--maz-easing-in-out);
  --default-transition-timing-function: var(--ease-out);
}
```

**Niveau `@maz-ui/themes`** — étendre `ThemeFoundation` pour inclure les tokens de motion :

```ts
export interface ThemeFoundation {
  // existants
  'radius': SizeUnit
  'border-width': SizeUnit
  'font-family'?: string
  'base-font-size'?: SizeUnit

  // nouveaux
  'duration-fast'?: Duration        // '100ms'
  'duration-normal'?: Duration      // '200ms'
  'duration-slow'?: Duration        // '300ms'
  'easing-out'?: string             // 'cubic-bezier(0.4, 0, 0.2, 1)'
  'easing-in'?: string
  'easing-in-out'?: string
}
```

Les 4 presets built-in doivent alors déclarer ces valeurs (ou fournir un fallback dans `css-generator.ts`). Rétrocompat : si le preset ne déclare rien, garder les valeurs actuelles comme fallback.

### Point ouvert

Question de scope : est-ce que le système de motion fait partie du design system de `@maz-ui/themes` (réponse OUI pour un vrai DS), ou ça reste un détail purement Tailwind non-thémé ? Je recommande OUI — un preset « corporate serious » voudrait des durations plus longues qu'un preset « playful ».

### À faire

- [ ] Étendre `ThemeFoundation` dans `@maz-ui/themes` avec les tokens de motion
- [ ] Mettre à jour les 4 presets built-in (mazUi, ocean, pristine, obsidian) avec leurs valeurs
- [ ] Ajouter les `--maz-duration-*` / `--maz-easing-*` dans le CSS généré par `css-generator.ts`
- [ ] Étendre `theme-typography.css` avec la scale et re-router les defaults
- [ ] Envisager de sortir « typography » de ce fichier si on y ajoute de la motion — renommer en `theme-motion.css` ou splitter
- [ ] Mettre à jour la doc `tailwind.md` (liste des tokens exposés)

---

## 8. `packages/lib/postcss.config.cjs` — probablement redondant avec `@tailwindcss/vite`

**État** : 🟨 decided, pending action — à supprimer si validé par test

### Constat

Après mon cleanup de Phase 6, le fichier est réduit à :

```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

Et en parallèle, `packages/lib/vite.config.ts` charge déjà :

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),   // <-- plugin Vite pour Tailwind v4
    ...
  ],
})
```

### Pourquoi c'est redondant

- `@tailwindcss/vite` intercepte directement la pipeline CSS de Vite : l'entrée principale (`tailwind.css`) **et** les `<style>` blocks des SFC (via `@reference`) sont processés par lui.
- `@tailwindcss/postcss` fait *le même job* mais via la pipeline PostCSS de Vite, qui tourne en second sur les CSS que le plugin Vite n'a pas déjà consommés.
- Dans les deux cas, quand Tailwind voit un fichier déjà processé (plus de `@theme`, `@apply`, etc. à résoudre), il no-op. Donc ça ne casse rien, mais ça ajoute un hook pour rien.

La [doc officielle `@tailwindcss/postcss`](https://www.npmjs.com/package/@tailwindcss/postcss) positionne le package pour les pipelines **PostCSS-only** (webpack + postcss-loader, Rollup sans Vite, etc.). Pour les projets Vite, la reco est `@tailwindcss/vite` **seul**.

### Ce qui tient encore le fichier (à vérifier)

- `build/ViteCompileStyles.ts` compile `aos.css` en passant par `postcss([autoprefixer])` directement — il n'utilise PAS `postcss.config.cjs`. Donc pas de dépendance de ce côté.
- `@tailwindcss/cli` (appelé dans `ViteCompileStyles` pour `main.css`) ne lit pas non plus `postcss.config.cjs` — il a sa propre pipeline.
- Les `<style>` block dans les SFC : processés par `@tailwindcss/vite`, pas par postcss.config.

Conclusion : **le fichier ne fait rien d'utile dans la build actuelle**. Il peut être supprimé.

### À faire

- [ ] Supprimer `packages/lib/postcss.config.cjs`
- [ ] Relancer `pnpm -C packages/lib build` et vérifier que :
  - `dist/css/main.css` est identique (au byte près) avant / après suppression
  - Les chunks CSS par composant sont identiques (grep sur quelques règles `@apply`-résolues pour s'assurer qu'elles sont toujours là)
  - Pas de warning Vite du style "no Tailwind processing found"
- [ ] Même exercice côté `apps/nuxt-app` et `apps/vue-app` si un `postcss.config` y traîne encore (probablement pas : les apps utilisent `@tailwindcss/vite` depuis la Phase 5)
- [ ] Garder `postcss.config` **uniquement** dans les setups PostCSS-only (ex: VitePress qui a sa propre chaîne dans `apps/docs/.vitepress/config.mts` et qui utilise bien `@tailwindcss/postcss` — là c'est légitime)

---

## 9. `tools/baselines/` et `tools/migrate-tw-prefix/` — à nettoyer avant merge

**État** : 🟨 decided — supprimer les deux dossiers `tools/` avant merge. `packages/codemod/` est conservé (publication tranchée plus tard, voir #2).

### Ce qu'il y a dans `tools/baselines/`

Mesures pré/post-migration :

```
tools/baselines/
├── README.md
├── v3-bundle.txt      (taille du CSS avant v5)
├── v3-buildtime.txt   (temps de build avant v5)
├── v5-bundle.txt      (après)
├── v5-buildtime.txt   (après)
└── SUMMARY.md         (tableau comparatif)
```

**Utilité aujourd'hui** : documenter le delta mesuré au moment du release. Pas de code, pas utilisé par la build, pas shippé.

**Besoin runtime** : aucun.

**Décision recommandée** : **à supprimer avant merge**. L'info est dans le PR body + le blog post release. Garder ces fichiers dans `main` = bruit permanent dans le repo.

Alternatives :
- Les copier dans un draft de release notes / blog post en même temps que la suppression
- Les garder dans un commit spécifique si on veut y revenir (la git history préserve déjà tout)

### Ce qu'il y a dans `tools/migrate-tw-prefix/`

Les scripts utilisés **en interne pour migrer maz-ui lui-même** pendant Phase 3 + 4 + 6 :

```
tools/migrate-tw-prefix/
├── transform.ts
├── transform.test.ts
├── cli.ts
├── add-reference.mjs
├── add-reference-generic.mjs
├── fix-apply-important.mjs
├── fix-hsl-var.mjs
├── revert-bem.mjs
└── README.md
```

**Utilité aujourd'hui** : la migration interne est terminée. Ces scripts ne seront plus relancés sur le source de maz-ui.

**Relation avec `packages/codemod/`** (voir entrée #2) : la logique a été re-packagée proprement dans `packages/codemod/` pour publication npm. **Donc duplicate partiel avec `tools/migrate-tw-prefix/`.**

**Décision recommandée** : dépend de la décision sur `packages/codemod` (entrée #2) :

- Si on garde `packages/codemod` publié → **supprimer `tools/migrate-tw-prefix/`** (duplicate)
- Si on NE publie PAS `packages/codemod` (option A de #2) → **choisir un des deux** pour rester en interne :
  - Soit garder `tools/migrate-tw-prefix/` (version exhaustive avec tous les scripts one-off : revert-bem, add-reference, etc.)
  - Soit renommer `packages/codemod/` en `tools/codemod/` (sortir du workspace publié)
  - Puis supprimer l'autre

Dans les deux scénarios on n'a **qu'UNE version du codemod** à maintenir.

### À faire

- [ ] `rm -rf tools/baselines/` (copier SUMMARY.md dans le draft de blog post release avant suppression)
- [ ] `rm -rf tools/migrate-tw-prefix/`
- [ ] Garder `packages/codemod/` tel quel — la logique de migration reste accessible via ce package pour les futures évaluations (publication tranchée post-merge)
- [ ] Vérifier qu'aucun script / CI / doc ne référence encore `tools/migrate-tw-prefix` ou `tools/baselines` après suppression (grep `tools/migrate-tw-prefix` et `tools/baselines` sur le repo)

---

## 10. `border` / `border-b` / … sans couleur — breaking change Tailwind v4 non compensé

**État** : 🟥 open — blocker visuel, impacte 10+ composants

### Le breaking change

En Tailwind v3, `border` appliquait `border-width: 1px` **et** une couleur par défaut (config `borderColor.DEFAULT`, par convention `gray-200`). Le preflight injectait `* { border-color: theme('borderColor.DEFAULT') }` pour que toutes les bordures soient de cette couleur par défaut.

En Tailwind v4, `border` n'applique plus que `border-width` + `border-style`. La couleur tombe sur **`currentColor`** (couleur du texte). Le preflight ne force plus de couleur par défaut. [Doc officielle](https://tailwindcss.com/docs/upgrade-guide#default-border-color).

### Impact sur maz-ui

Grep rapide : au moins **10 composants** utilisent `maz:border` / `maz:border-b` / `maz:border-t` sans couleur explicite :

- MazAlert, MazAvatar, MazBadge, MazBtn, MazBtnGroup, MazCard, MazCheckbox, MazContainer, MazDatePicker (2 fichiers), et probablement d'autres

En v3 : bordures couleur `divider` (neutre/gris) par défaut. En v5 : bordures **couleur du texte du composant** — donc visibles mais pas neutres. Régression visuelle partout où il y a une bordure « décorative ».

### Trois façons de corriger

**Option A — Scoper à `.m-reset-css` (pattern existant dans maz-ui)**

`packages/lib/src/css/reset.css` a déjà un reset scopé à la classe `.m-reset-css` appliquée sur les roots des composants maz-ui. Il définit même déjà un `border-color: currentcolor` (ligne 9). **Il suffit de remplacer `currentcolor` par `var(--color-divider, currentcolor)`** :

```css
@layer maz-ui-reset {
  .m-reset-css {
    &,
    & *,
    &::before,
    &::after {
      border-width: 0;
      border-style: solid;
      border-color: var(--color-divider, currentcolor); /* <-- seule modif */
      box-sizing: border-box;
    }
    /* ... reste du reset inchangé ... */
  }
}
```

**Avantages** :
- **Zéro impact sur le CSS du consommateur** — ne s'applique qu'à l'intérieur des composants maz-ui qui portent `.m-reset-css` sur leur root.
- Pattern déjà en place, juste une valeur à changer.
- Le consommateur garde le comportement v4 natif (`currentColor`) sur son propre code, c'est sa cohérence Tailwind v4 qu'il a choisi.
- Cohérent avec la doc officielle Tailwind qui propose la même logique mais sur `*` — on se contente de scoper à notre arborescence.

**Inconvénients** :
- Nécessite que TOUS les composants maz-ui portent bien `.m-reset-css` sur leur root (à vérifier — à priori oui, c'est la convention interne).
- `::backdrop` et `::file-selector-button` (mentionnés par la doc officielle) ne sont pas dans la règle existante — à ajouter si on veut être exhaustif.

### Précisions importantes

La doc Tailwind v4 officielle propose la version globale :

> In v3, the `border-*` and `divide-*` utilities used your configured `gray-200` color by default. We've changed this to `currentColor` in v4 to make Tailwind less opinionated and match browser defaults.

Exemple officiel pour restaurer v3 (cité tel quel) :

```css
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    border-color: var(--color-gray-200, currentColor);
  }
}
```

Nous, on fait **le même raisonnement mais scopé** à `.m-reset-css` — isolation propre, pas de fuite dans l'app du consommateur.

**Option B — Expliciter `maz:border-divider` partout dans les composants**

Refactor de ~50-100 occurrences de `maz:border` → `maz:border maz:border-divider`. **Avantage** : explicite, cohérent avec v4. **Inconvénient** : gros refactor, risque d'oublis, pas de garantie pour le futur (autre breaking similaire).

**Option C — Override le token `--color-border-default` dans le bridge**

Tailwind v4 permet de theme le default via `--color-border-default` (ou équivalent, à vérifier dans les docs v4). Si ça existe, on le route vers `var(--maz-border)` dans `theme-colors.css`. **Avantage** : propre et discret. **Inconvénient** : dépend de l'existence de ce token v4, à vérifier.

### Recommandation

Option **A** (base rule) — c'est ce que fait shadcn-ui et quasi tous les design systems v4. Safe, visuellement conservateur par rapport à v3, documentable en 2 lignes dans le migration guide (« si tu utilises `border` sans couleur, maz-ui restaure le comportement v3 — override si tu veux `currentColor` »).

### Impact consommateur aussi

À noter : les **consommateurs** qui utilisent leur propre Tailwind v4 et qui avaient `border` dans leur code sont impactés **indépendamment de maz-ui**. Le migration guide doit le mentionner. L'option A côté maz-ui ne protège que les composants maz-ui, pas le code du consommateur.

### À faire

- [ ] Option A tranchée — modifier `packages/lib/src/css/reset.css` ligne 9 : `border-color: currentcolor;` → `border-color: var(--color-divider, currentcolor);`
- [ ] Ajouter `&::backdrop` et `&::file-selector-button` au sélecteur si on veut être exhaustif comme la doc officielle
- [ ] Vérifier que tous les composants maz-ui avec `border`/`border-b`/... portent bien `.m-reset-css` sur leur root (sinon le fix ne s'applique pas). Liste à grep : les 10+ identifiés (MazAlert, MazAvatar, MazBadge, MazBtn, MazBtnGroup, MazCard, MazCheckbox, MazContainer, MazDatePicker...)
- [ ] Vérifier visuellement (Playwright ou manuel) : les bordures prennent la couleur `--color-divider` dans light et dark mode
- [ ] Grep du même problème sur `outline-*` et `ring` — est-ce que Tailwind v4 a changé aussi leurs defaults de couleur ?
- [ ] Mention dans le migration guide v4→v5 : « maz-ui scope la couleur de bordure par défaut à ses composants via `.m-reset-css` ; votre propre code reste sur le comportement v4 natif (`currentColor`). Si vous voulez restaurer le comportement v3 dans votre code, voir la [doc Tailwind officielle](https://tailwindcss.com/docs/upgrade-guide#default-border-color). »

---

## 11. `apps/nuxt-app` casse au runtime — `Error: IPC connection closed`

**État** : 🟥 open — blocker, à diagnostiquer

### Erreur rapportée par le mainteneur

```
ℹ Error: IPC connection closed
 ⁃ at Socket.onClose (/Users/mazel/workspace/maz-ui-v5/node_modules/.pnpm/@nuxt+vite-builder@4.4.2_…/node_modules/@nuxt/vite-builder/dist/vite-node.mjs:140:101)
 ⁃ at Socket.emit (node:events:508:28)
 ⁃ at Pipe.<anonymous> (node:net:346:12)
```

### Analyse

L'erreur vient du `vite-node` de Nuxt — le worker-process que Nuxt démarre pour la pipeline Vite communique avec le process principal via IPC. `IPC connection closed` = le worker est mort de façon non prévue. Symptômes classiques :

1. **Crash du worker** (OOM, exception non rattrapée lors de l'import d'un fichier)
2. **Plugin Vite incompatible** avec le sandbox vite-node (certains plugins font des choses que le worker ne supporte pas)
3. **Cache `.nuxt/` obsolète** qui contient des références à l'ancienne config v3 (`@nuxtjs/tailwindcss`, etc.)
4. **Module manquant** après retrait de `@nuxtjs/tailwindcss`

### Changements qui peuvent être en cause dans cette PR

- Retrait de `@nuxtjs/tailwindcss` du `modules` de `nuxt.config.ts` (commit `7f6375956`)
- Ajout de `@tailwindcss/vite` dans `vite.plugins`
- Retrait de `import postcss from 'maz-ui/postcss.config.cjs'` et `postcss: postcss`
- Suppression de `apps/nuxt-app/tailwind.config.ts`
- Réécriture de `src/css/main.css` en v4 (prefix(maz), @source, @import des bridges)
- Ajout de `@reference "../../css/main.css"` dans `src/layouts/default.vue`

### À faire (diagnostic ordonné, pas prouvé)

- [ ] `cd apps/nuxt-app && rm -rf .nuxt node_modules/.cache` puis relancer `pnpm dev` — élimine le cache obsolète, première cause à tester
- [ ] Si l'erreur persiste, lancer `pnpm dev` avec `DEBUG=nuxt:*` pour avoir une stack plus précise du worker avant qu'il ne meure
- [ ] Essayer de retirer temporairement `tailwindcss()` de `vite.plugins` pour isoler si c'est le plugin qui pose problème dans l'IPC Nuxt
- [ ] Vérifier la compatibilité `@tailwindcss/vite@4.2.4` × `@nuxt/vite-builder@4.4.2` — chercher dans les issues GitHub respectives
- [ ] Si `@tailwindcss/vite` incompatible avec le runtime Nuxt : fallback sur `@tailwindcss/postcss` via un `postcss.config.cjs` à la racine d'`apps/nuxt-app` (pipeline PostCSS natif plutôt que Vite plugin)
- [ ] Vérifier que tous les `@reference` dans les SFC nuxt-app pointent vers des chemins relatifs qui existent (une mauvaise résolution d'import pourrait crasher le worker)
- [ ] Tester la build production (`pnpm nuxt-app:build`) — si elle passe mais pas le dev, c'est clair que c'est le worker de dev qui meurt, pas un problème de build
- [ ] Si rien ne marche : rollback temporaire à `@nuxtjs/tailwindcss` v7+ (s'il existe pour Tailwind v4) — sinon documenter comme limitation connue et bloquer le merge

### Note

Lors du commit `7f6375956` j'ai vérifié `pnpm -C apps/nuxt-app exec nuxi build` (build OK en <1s). Mais je n'ai **pas** testé `pnpm dev` ni `nuxi dev`. Le mode dev utilise un pipeline Vite différent du mode build. Mauvaise vérification de ma part — à ajouter à la checklist CI (cf. entrée #4).

---

## 12. `apps/vue-app` — majorité des styles des composants cassée

**État** : 🟥 open — blocker, même catégorie de bug que #11

### Constat du mainteneur

En lançant `apps/vue-app` en dev, la plupart des styles des composants sont cassés. Incertitude sur l'origine : app ou maz-ui. Suspicion sur une résolution PostCSS défaillante dans vue-app.

### Ce que j'ai fait en Phase 5.1 (commit `363b30154`)

- **Supprimé** `apps/vue-app/tailwind.config.ts`
- **Supprimé** `apps/vue-app/postcss.config.cjs`
- **Ajouté** `apps/vue-app/src/tailwind.css` (entry v4 avec `@import "tailwindcss" prefix(maz)` + imports du bridge maz-ui)
- **Ajouté** `@tailwindcss/vite` dans `apps/vue-app/vite.config.ts`
- **Mis à jour** `apps/vue-app/src/main.ts` pour importer `./tailwind.css`
- **Lancé** le codemod sur `apps/vue-app/src` (7 fichiers transformés)
- **Ajouté** `@reference "../tailwind.css"` dans `apps/vue-app/src/assets/main.css`

### Ce que j'ai oublié ou pas vérifié

**Critique — probablement la cause principale** : je n'ai **pas** ajouté de `@reference` dans les `<style>` blocks des SFC de `apps/vue-app/src/**/*.vue`. Ce script (`add-reference-generic.mjs`) a été lancé sur `packages/lib/src/**/*.vue` et sur `apps/nuxt-app/src/**/*.vue`, mais **pas sur apps/vue-app**. Si les SFC de vue-app ont des `@apply` dans leur `<style>`, ils ne résolvent plus rien en v4 sans `@reference`. Symptôme exact : « les styles des composants sont cassés ».

### Autres causes possibles (ordre de probabilité)

1. **`@reference` manquant dans les SFC de vue-app** — cf. ci-dessus, le plus probable
2. **Postcss** : Vite tourne sans `postcss.config.cjs`. Vite a un postcss pipeline par défaut, mais sans plugin Tailwind. Si vue-app a du CSS non-SFC avec `@apply`, il ne sera pas processé (le plugin `@tailwindcss/vite` traite les SFC + le main CSS, mais pas forcément des `.css` tiers dans `src/assets`)
3. **Ordre d'import de `main.ts`** : on importe `./tailwind.css` puis `./assets/main.css`. Si `main.css` utilise `@apply` et a un `@reference`, ça devrait marcher. Mais si `@reference` pointe mal, non.
4. **Build cache Vite obsolète** (`node_modules/.vite`) — peut hériter de l'ancienne config
5. **`prefix(maz)` vs classes d'app** : vue-app/src/App.vue écrit `class="maz:flex maz:h-full"` après codemod. Ça devrait matcher puisque le prefix est bien `maz`. Mais si un composant maz-ui est importé et que son CSS chunk nécessite des tokens qui ne sont pas résolus, ça peut péter.

### À faire (diagnostic ordonné)

- [ ] `cd apps/vue-app && rm -rf node_modules/.vite dist` puis relancer `pnpm dev`
- [ ] **Lancer `add-reference-generic.mjs` sur `apps/vue-app/src/**/*.vue`** avec l'entry `src/tailwind.css` :
  ```
  node packages/codemod/... "apps/vue-app/src/**/*.vue" "apps/vue-app/src/tailwind.css"
  ```
  (À faire AVANT toute autre investigation — c'est la cause la plus probable)
- [ ] Ouvrir l'inspector et regarder quelles règles CSS tombent réellement sur un composant cassé (manque-t-il les rules `.maz\:flex` ? Les rules sont là mais la couleur est mauvaise ? Les rules `@apply` ne sont pas résolues ?)
- [ ] Vérifier `dist/` du build de production — si le build prod rend correctement les styles mais le dev non, c'est une issue vite-dev (cache + plugin)
- [ ] Si `@tailwindcss/vite` ne process pas `src/assets/main.css` correctement, ajouter un `postcss.config.cjs` avec `@tailwindcss/postcss` en fallback
- [ ] Grep toute classe `maz-` restante (non transformée) dans vue-app src — un codemod raté donnerait des classes qui ne matchent rien

### Note globale sur #11 + #12

Les deux apps de démo sont cassées en dev. J'ai claim « build OK » dans mon PR body en m'appuyant uniquement sur `nuxi build` / `vite build`. **Les modes dev ne sont pas vérifiés**. Blocker de release — la doc dit explicitement que `pnpm dev` doit marcher sur vue-app pour itérer.

---

## 13. Erreur de cadrage FONDAMENTALE — la doc présente Tailwind setup comme requis alors que c'est optionnel

**État** : 🟥 open — bloquant pour la doc, refonte à faire

### Ce que le mainteneur dit (à internaliser une bonne fois)

> « Les consommateurs peuvent très bien utiliser la lib sans setup tailwind. Moi je n'exporte que du CSS finalement. »
>
> « La doc `tailwind.md` c'est juste un BONUS. Expliquer qu'ils peuvent utiliser le thème qu'ils ont setup (preset, ou custom) et de set LEUR tailwind config avec. »
>
> « La doc est très mal écrite ! »

### Le positionnement correct de maz-ui v5

maz-ui est **plug-and-play** :

1. `pnpm add maz-ui @maz-ui/themes`
2. Importer les styles compilés (un seul CSS à importer)
3. Installer le plugin `MazUi` avec un preset
4. Utiliser les composants — **aucune config Tailwind nécessaire côté consommateur**

Les styles des composants sont **compilés au build** (main.css + chunks par composant via libInjectCss). Tailwind n'est qu'un outil de *construction interne*, pas une dépendance d'usage.

### Quand le consommateur a besoin du bridge Tailwind

**Uniquement** s'il a DÉJÀ sa propre config Tailwind v4 et veut **étendre** son système de tokens avec ceux de maz-ui — pour écrire `class="bg-primary"` dans SON code qui utilisera les mêmes couleurs que son preset maz-ui actif.

C'est un **scénario avancé et optionnel**. Un bonus. Pas dans le chemin d'installation par défaut.

### Ce que j'ai mis dans la doc (à enlever ou reformuler)

Tous ces endroits présentent Tailwind comme une étape obligatoire de l'install :

1. **`apps/docs/.vitepress/mixins/getting-started.md`** — mixin réutilisé partout, j'y ai ajouté « Set up Tailwind CSS v4 ». **À enlever**.
2. **`apps/docs/src/guide/vue.md`** — section « Set up Tailwind CSS v4 » insérée entre `deps install` et `install plugin`. **À enlever** ou à déplacer en fin de page avec un framing clair « optional: use maz-ui tokens in your own Tailwind ».
3. **`apps/docs/src/guide/nuxt.md`** — idem, section ajoutée juste après l'install du module. **À enlever** ou à déplacer.
4. **`apps/docs/src/guide/getting-started.md`** — bullet « 💨 Tailwind CSS v4 bridge » dans la liste des features. **À laisser MAIS reformuler** pour qu'il soit clair que c'est un bonus (« bring maz-ui's design tokens into your own Tailwind setup if you have one »).
5. **`apps/docs/src/guide/tailwind.md`** (250 lignes) — écrit comme un « Quick start » principal avec des scénarios A/B/C. **À réécrire entièrement** en tant que page bonus :
   - Public visé : consommateurs qui ONT déjà leur Tailwind v4 et veulent l'étendre
   - Angle : « Use your active maz-ui preset's tokens as Tailwind variables in your own config »
   - Pas de framing « ceci est l'installation standard »
6. **`apps/docs/src/guide/migration-v5.md`** — le guide de migration parle beaucoup de Tailwind setup aussi, à réaligner.
7. **`apps/docs/src/guide/browser-support.md`** — décrit Tailwind v4 comme base, reste OK mais mentionner qu'il s'agit de l'outil interne, pas de quelque chose que le user setup forcément.

### Le vrai quick start (ce que la doc devrait dire)

```ts
// main.ts
import { createApp } from 'vue'
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { mazUi } from '@maz-ui/themes'
import App from './App.vue'

import 'maz-ui/styles' // <- seul import CSS nécessaire

const app = createApp(App)
app.use(MazUi, { theme: { preset: mazUi } })
app.mount('#app')
```

Fin. Le consommateur utilise `<MazBtn>`, `<MazCard>`, etc., sans jamais toucher Tailwind.

### Lien avec les autres entrées

- **#1** (raw `maz:X` dans les templates) — la page `tailwind.md` disait « consumer needs maz-ui/styles for raw classes ». Dans le framing correct, `maz-ui/styles` EST le chemin standard, pas une workaround. Donc le problème n'est plus « il faut documenter que main.css est requis » mais « il faut documenter `import 'maz-ui/styles'` comme l'étape CSS unique ».
- **#2** (utilité du codemod) — renforce le constat. Le codemod sert encore moins aux consommateurs puisque la majorité d'entre eux n'avait JAMAIS de classes `maz-X` dans leur code. Ils utilisent les composants comme boîtes noires.

### À faire (gros morceau de doc)

- [ ] **Décision en priorité** : réécrire toute la doc ou juste patcher les endroits problématiques. Recommandation : patch d'abord pour débloquer la release, réécriture complète en post-v5.0.0.
- [ ] Retirer la section « Set up Tailwind CSS v4 » de `getting-started.md` mixin
- [ ] Retirer la section « Set up Tailwind CSS v4 » de `vue.md` (ou la déplacer avec le bon framing)
- [ ] Retirer la section « Set up Tailwind CSS v4 » de `nuxt.md` (ou la déplacer)
- [ ] Reformuler le bullet dans la feature list de `getting-started.md`
- [ ] Réécrire `tailwind.md` comme bonus optionnel :
  - Hook : « You already have your maz-ui theme setup. Here's how to expose those same tokens to YOUR own Tailwind config, so that `class="bg-primary"` in your own templates uses your active maz-ui preset color. »
  - Prérequis : avoir déjà une config Tailwind v4 à soi
  - Installation : importer `maz-ui/tailwindcss/theme.css` dans son entry
  - Pas de trois scénarios A/B/C — juste LE scénario « étendre ma config existante »
- [ ] Vérifier `migration-v5.md` — retirer tout ce qui pousse à setup Tailwind ; les breaking changes (utility renames, prefix, etc.) ne concernent que les user qui avaient déjà leur propre Tailwind
- [ ] Vérifier que le vrai chemin standard (`import 'maz-ui/styles'`) est documenté clairement en tête de `getting-started.md`
- [ ] Mentionner `@maz-ui/themes` comme LA source de theming (preset ou custom), pas Tailwind

### Note

Cette entrée invalide une grosse partie de mon travail de Phase 9 et une partie du framing de la PR. La solution technique (bridge) est bonne, c'est sa PLACE dans la doc qui est cassée. À refaire proprement.

---

## 14. `migration-v5.md` — doit parler de maz-ui, PAS de Tailwind

**État** : 🟥 open — à réécrire entièrement (cohérent avec #13)

### Ce que le mainteneur dit

> « Et du coup dans `migration-v5.md` c'est pareil, on ne parle pas de tailwind ! Juste de maz-ui ! »

### Ce que j'ai écrit (à jeter)

Le guide actuel (~300 lignes) est structuré autour de l'upgrade Tailwind :

- Section « Install Tailwind v4 » avec commandes `pnpm add tailwindcss @tailwindcss/vite`
- Section « Wire up the bundler » avec des configs Vite / PostCSS / Nuxt
- Section « Replace the JS Tailwind config with a CSS entry »
- Section « Run the codemod on your source » avec `@maz-ui/codemod tailwind-v4`
- Tableau exhaustif de 15+ breaking changes Tailwind (utility renames, prefix, variants, important, etc.)

**95 % de ce contenu ne concerne pas les consommateurs typiques de maz-ui**. Ils n'avaient pas Tailwind. Ils utilisaient maz-ui comme lib autonome.

### Ce que le guide DOIT dire (changements maz-ui pour le consommateur typique)

Pour un user qui faisait juste `pnpm add maz-ui` + `import 'maz-ui/styles'` + `<MazBtn>` en v4, la migration v5 concerne :

1. **Node 20+** requis
2. **Navigateurs** : Chromium 111+ / Safari 16.4+ / Firefox 128+ (requis par les features CSS v4 — `color-mix`, `@property`)
3. **Format des presets custom** : si le user a créé son propre preset via `@maz-ui/themes` avec le type `HSL`, les valeurs raw `'210 100% 56%'` sont toujours acceptées (auto-wrappées par `normalizeColor`), mais le type est maintenant `CSSColor`. Pas cassant, mais à mentionner.
4. **Usage de `--maz-*` dans du CSS custom du user** : si leur code écrit `.my-brand { background: hsl(var(--maz-primary)) }`, ça casse en v5 (double-wrap). Doit devenir `var(--maz-primary)`. C'est LE seul vrai breaking change consommateur qui demande action.
5. **Quelques subtilités visuelles** liées aux defaults de Tailwind v4 qui ont pu se répercuter (cf. entrée #10 border color, etc.) — mentionner ce qui est restauré côté maz-ui et ce qui ne l'est pas.

Fin. 5 points. Pas 300 lignes.

### Ce qui doit partir DANS UNE AUTRE PAGE (advanced)

Tout ce qui concerne **les consommateurs qui avaient aussi leur propre Tailwind v3** + bridge maz-ui :
- Install Tailwind v4
- Configs Vite / PostCSS / Nuxt
- CSS entry avec le bridge
- Codemod (si on publie)
- Utility renames, prefix, etc.

Cette audience est minoritaire. Ça a sa place dans `tailwind.md` (le bonus) ou une page dédiée `migration-v5-tailwind-consumers.md`, pas dans le guide principal.

### Structure proposée

```
migration-v5.md (page principale, courte)
├── Intro : v5 est un major, voici ce qui change pour vous
├── Prérequis : Node 20+, navigateurs minimum
├── Changement 1 : hsl(var(--maz-X)) → var(--maz-X) dans votre CSS custom
├── Changement 2 : type HSL déprécié → CSSColor (info only)
├── Changement 3 : subtilités visuelles (border color par défaut, etc.)
└── Section « Advanced : you had your own Tailwind » → lien vers tailwind.md

tailwind.md (bonus, réécrit selon #13)
├── Public : consommateurs qui ont déjà Tailwind v4
├── Comment importer le bridge de maz-ui pour étendre votre config
└── Si vous veniez de Tailwind v3 : pointeur vers @tailwindcss/upgrade officiel + les quelques points spécifiques maz-ui
```

### À faire

- [ ] Réécrire `migration-v5.md` selon la structure ci-dessus (version courte, centrée maz-ui)
- [ ] Déplacer le contenu « Tailwind setup » actuel vers `tailwind.md` ou une page séparée
- [ ] Retirer les tableaux de breaking changes Tailwind du guide principal (ça concerne une minorité) — les garder dans la page Tailwind
- [ ] Vérifier la cohérence avec #13 (le quick start `getting-started` doit raconter la même histoire : maz-ui est plug-and-play, pas de Tailwind requis)
- [ ] Mettre à jour le sidebar `guide.mts` si on crée une nouvelle page
- [ ] Mettre à jour le fixture `@maz-ui/mcp` si on renomme / crée de nouvelles pages

### Note

Mes deux erreurs récurrentes ici :
- J'ai pris le framing « Tailwind v4 migration » du plan technique (qui était bien — c'est le job INTERNE de maz-ui) et je l'ai collé tel quel dans la doc consommateur (qui n'a pas ce problème)
- J'ai confondu le public interne (moi qui migre la lib) et le public externe (user qui consomme la lib). Dans 95 % des cas le user n'est pas concerné par les changements Tailwind — il voit juste des styles de composants qui rendent pareil (ou presque) qu'avant.

---

## 15. `apps/docs` — migration incomplète, beaucoup de classes `maz-*` v3 restées telles quelles

**État** : 🟥 open — blocker visuel sur la doc

### Constat du mainteneur

> « Beaucoup de css et classe n'ont pas été migré dans `apps/docs/`. Toutes les documentations sont cassées. Je vois toujours des "maz-flex maz-flex-col maz-gap-4" »

### Ce qui s'est passé

Phase 5.2 a été déléguée à un subagent avec pour mission de migrer `apps/docs`. Son rapport disait :

> « Ran the codemod on `apps/docs/src`, `apps/docs/.vitepress`, and `apps/docs/components`, and on .md files via an inline script (the shared CLI doesn't scan .md). »

**Deux problèmes apparents** :
1. Le subagent a écrit un « inline script » ad hoc pour les `.md` — pas le codemod officiel. Plus fragile, possiblement incomplet.
2. Le subagent a aussi mentionné devoir écrire un « targeted reverter script » pour les fichiers `.md` parce que le codemod over-triggered sur des URLs, paths, `@layer maz-ui-theme`, etc. Après le revert, il est possible que beaucoup de `maz-*` légitimes (classes dans des exemples markdown) soient revenus à la forme v3.

Résultat : la migration est partielle. Les exemples HTML/Vue embarqués dans les `.md` (notamment les code-groups, les composants live inline, etc.) contiennent encore du `class="maz-flex maz-flex-col maz-gap-4"` v3.

### Portée à mesurer

À grep exhaustivement sur `apps/docs/src/**/*.md` + `apps/docs/**/*.vue` + `apps/docs/**/*.ts` :

```bash
grep -rnE '\bmaz-[a-z][a-z0-9-]*\b' apps/docs/src apps/docs/.vitepress apps/docs/components \
  --include="*.md" --include="*.vue" --include="*.ts" --include="*.mts" \
  | grep -v 'maz-ui' | grep -v 'maz-ui-theme' | grep -v 'maz-ui-reset' | grep -v 'maz-ui-animations' \
  | grep -v 'maz-ui-provider' | grep -v 'github.com/.*maz-ui' | grep -v '@maz-ui' \
  | wc -l
```

Si le compte est élevé, il faut une repasse ciblée.

### Difficulté spécifique aux fichiers `.md`

Les `.md` VitePress contiennent :
- Des blocs de code affichés (ne DOIVENT PAS être transformés — exemples pour les users)
- Des blocs de template live inline Vue (DOIVENT être transformés — rendus comme composants)
- Des URLs `/guide/maz-ui-provider` (ne doivent PAS être transformés)
- Des mentions dans de la prose (`Use the maz-flex utility…`) — à cas par cas

Le codemod actuel scanne bêtement le texte via regex. Pour les `.md`, il FAUT un parser markdown qui distingue :
- Les blocs de code ```` ```vue ```` / ```` ```html ```` → sélective (peut-être ne pas toucher, ou les garder dans l'ancienne syntaxe si ce sont des exemples v4)
- Les zones de template HTML hors code-block → transformer
- Les URLs, imports, frontmatter → ne jamais toucher

### À faire (diagnostic + fix ordonné)

- [ ] Grep exhaustif de `\bmaz-[a-z]` dans `apps/docs/` en excluant les patterns légitimes (`maz-ui`, layers, URLs de repo). Compter par fichier pour hiérarchiser.
- [ ] Inspecter manuellement 2-3 `.md` représentatifs pour comprendre si les classes non-migrées sont :
  - dans des blocs de code (exemples → à migrer si on veut montrer du v5, à laisser si on veut montrer du v4 pour la doc historique)
  - dans du template Vue inline (à migrer absolument)
  - dans de la prose (à migrer au cas par cas)
- [ ] Selon l'audit : refaire une passe codemod plus intelligente ou sed ciblé
- [ ] Pour les exemples dans les code-groups : aligner sur la version v5 (puisque la doc parle de v5)
- [ ] Regarder si le codemod officiel pourrait être étendu à un mode « markdown-aware » (parser avec `remark` ou équivalent) — mais probablement pas dans cette PR
- [ ] Vérifier que `nx run docs:build` ne cache PAS des erreurs de rendu (VitePress peut compiler un .md même avec des classes invalides — pas d'échec au build mais rendu cassé au runtime). Tester en mode `dev` sur 3-4 pages.
- [ ] Même problème potentiel sur les tests de `@maz-ui/mcp` qui lisent les guides en tant que fixtures — si le contenu est incohérent, les assertions peuvent passer malgré des classes cassées visuellement.

### Lien avec les autres entrées

- Symptomatique du **même pattern** que #11 et #12 : j'ai rapidement claim « Phase 5 done, 3 apps build ». Le subagent a rapporté le build OK, je n'ai pas vérifié visuellement. Mon tort identique sur les 3 apps.
- Le framing #13 reste pertinent : si la doc présente bien maz-ui comme « pas besoin de Tailwind », les exemples inline qui utilisent `maz:flex` côté consommateur deviennent **incohérents** avec le message. Les exemples devraient montrer des classes Tailwind standards (`class="flex"`) ou pas de classes du tout.

---

## 16. `apps/docs` — styles postcss pas compilés (même cause que #12)

**État** : 🟥 open — même pattern que #12

### Constat du mainteneur

> « Pareil dans la doc, le style postcss n'est pas bien compilé. Comme pour la vue-app. »

### Symptôme commun avec #12

Le pipeline postcss de VitePress ne résout pas correctement les `@apply` dans les `<style>` blocks des SFC de la doc. Les règles Tailwind ne sont plus appliquées ; seuls les styles CSS brut (non-Tailwind) le sont.

### Pattern racine — à traiter transversalement

Les 3 apps de démo (`vue-app` #12, `docs` #16, `nuxt-app` #11 pour sa part) ont **le même trou de migration** :

Pour que `@tailwindcss/vite` (ou `@tailwindcss/postcss` dans le cas de VitePress) résolve les `@apply` dans chaque `<style>` block de SFC, il faut une directive `@reference "<chemin-vers-entry>"` en tête du block. Sans elle, Tailwind v4 ignore le block et les `@apply` restent non-résolus.

**J'ai lancé `add-reference-generic.mjs` seulement sur `packages/lib/src/**/*.vue`**. Pas sur :
- `apps/vue-app/src/**/*.vue` (entrée #12)
- `apps/docs/**/*.vue` (cette entrée — et aussi les `.vitepress/theme/components/**`, peut-être `components/`)
- `apps/nuxt-app/src/**/*.vue` — j'ai ajouté manuellement à `layouts/default.vue` uniquement, pas aux autres SFC

### Spécificité VitePress

VitePress a sa propre pipeline `css.postcss.plugins` (pas `@tailwindcss/vite`). Le subagent a configuré `@tailwindcss/postcss` dans `apps/docs/.vitepress/config.mts`. À vérifier :

1. Est-ce que `@tailwindcss/postcss` processe bien les `<style>` blocks des composants Vue chargés par VitePress ?
2. Si oui, ont-ils aussi besoin d'un `@reference` ? (probablement oui, même raison que `@tailwindcss/vite`)
3. Les `<style>` inline dans les `.md` (code-groups, snippets live) — est-ce qu'ils passent aussi par la pipeline ?

### À faire

- [ ] **Lancer `add-reference-generic.mjs` sur `apps/docs/**/*.vue`** avec l'entry `apps/docs/.vitepress/theme/main.css` :
  ```
  node packages/codemod/... "apps/docs/**/*.vue" "apps/docs/.vitepress/theme/main.css"
  ```
- [ ] Faire pareil sur `apps/nuxt-app/src/**/*.vue` (entrée #11)
- [ ] Faire pareil sur `apps/vue-app/src/**/*.vue` (entrée #12)
- [ ] Vérifier que `@reference` fonctionne côté VitePress (avec `@tailwindcss/postcss` au lieu de `@tailwindcss/vite`)
- [ ] Si VitePress a des `<style>` dans ses `.md` inline qui utilisent `@apply` — prévoir un traitement spécifique (probablement : mettre le `@apply` dans les composants plutôt que directement dans le `.md`)
- [ ] Mettre à jour le plan de release : **ajouter un point de vérification « visuelle » obligatoire** au gate CI pour les 3 apps, pas juste `build OK`
- [ ] Documenter dans le guide interne que toute nouvelle SFC doit avoir son `@reference` — éviter que ce trou se reproduise

### Note

Les entrées #11, #12 et #16 sont le même bug sur trois apps différentes. À consolider quand on fixera : un script qui parcourt toutes les apps et injecte `@reference` partout, puis vérification visuelle des 3.
