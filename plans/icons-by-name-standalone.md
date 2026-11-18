# Icônes par nom sans maz-ui

Issue : [#1738](https://github.com/LouisMazel/maz-ui/issues/1738).

## Problème

`icon="x-mark"` ne marche qu'avec maz-ui. Le plugin qui enregistre les icônes est dans `@maz-ui/vite-plugin`, le rendu dans `MazIcon`, et les types des noms augmentent le module `maz-ui`. Une autre lib Vue (celles du travail, par exemple) ne peut donc pas profiter des icônes par nom sans dépendre de maz-ui.

Ce qui est déjà indépendant de maz-ui :

- le registre (`@maz-ui/icons/registry` : `registerIcon`, `getRegisteredIcon`), une `Map` de chaînes SVG sur `globalThis` ;
- `MazUiIcons()`, exporté seul par `@maz-ui/vite-plugin`. Son scan lit les clés, attributs et variables dont le nom contient `icon` dans le code compilé : il ne connaît pas les composants ;
- la résolution de `@maz-ui/icons` : depuis maz-ui d'abord, puis le projet, puis le plugin (`locateIconsPackage`).

## Décision

- Tout dans `@maz-ui/icons` : un seul package à installer pour avoir les icônes par nom (plugin, composant, types).
- Seulement les noms. Les URL, data URI, chaînes raw et composants restent dans `MazIcon`. Le composant de `@maz-ui/icons` ne fait que le rendu d'un nom : une lib le wrappe pour ajouter sa taille, son fallback ou d'autres formats.
- Pas de breaking change : `@maz-ui/vite-plugin` ré-exporte le plugin, `MazUi()` et `@maz-ui/nuxt` ne changent pas pour les utilisateurs. Une `feat` (minor) de `@maz-ui/icons`, `@maz-ui/vite-plugin` et maz-ui, dans le groupe `ecosystem` (même version).
- Pas de nouveau package : il faudrait le garder en phase avec `@maz-ui/icons` et `@maz-ui/vite-plugin`, et les gens en installeraient un de plus.

## API

```ts
// vite.config.ts
import { MazUiIcons } from '@maz-ui/icons/vite'

export default defineConfig({
  plugins: [Vue(), MazUiIcons({ dir: 'src/icons' })],
})
```

```vue
<script setup lang="ts">
import { MazNamedIcon } from '@maz-ui/icons/vue'
</script>

<template>
  <MazNamedIcon name="x-mark" />
  <MazNamedIcon name="app:logo" class="size-6 text-primary" />
</template>
```

Le wrapper d'une lib :

```vue
<script setup lang="ts" generic="_T">
import type { IconName } from '@maz-ui/icons'
import { MazNamedIcon } from '@maz-ui/icons/vue'

defineProps<{ name: IconName }>()
</script>

<template>
  <MazNamedIcon :name class="app-icon" />
</template>
```

Une prop d'icône d'un composant de la lib (`<AppBtn start-icon="moon">`) se type avec `IconName` : le scan voit `startIcon: 'moon'` dans le code compilé, l'icône est enregistrée sans configuration.

## Sous-chemins de `@maz-ui/icons`

| Sous-chemin | Contenu | Runtime |
|---|---|---|
| `.`, `./static/*`, `./lazy/*`, `./raw/*` | les icônes et leurs types (déjà là), plus `IconNames`, `IconName`, `IconString` | navigateur |
| `./registry` | le registre (déjà là) | agnostique |
| `./vite` | `MazUiIcons`, `generateIconTypes`, `loadIconNames`, déplacés depuis `packages/vite-plugin/src/icons` | Node |
| `./vue` | `MazNamedIcon` et le helper de lecture et de préparation d'un SVG enregistré | Vue |

## Composant `MazNamedIcon`

- Une prop, `name: IconName`.
- Lit `getRegisteredIcon(name)` et rend le `<svg>` de l'icône comme racine (attributs de la balise `<svg>` lus par regex, contenu en `innerHTML` : pas de `DOMParser`, il tourne en SSR). Les classes et attributs du parent tombent sur le `<svg>` : `class="size-6"` le redimensionne, sans `:deep()`.
- `width="1em"`, `height="1em"` par défaut, pour s'aligner sur le texte ; la couleur vient du `currentColor` des icônes de `@maz-ui/icons`. Le reste se règle en CSS.
- Décoratif par défaut (`aria-hidden="true"`), comme `MazIcon` sans titre. Un `aria-label` passé par le parent retire `aria-hidden` et pose `role="img"`.
- Nom inconnu : ne rend rien, avec un warning en dev qui nomme l'icône et indique `MazUiIcons()` ou `registerIcon()` (le message actuel de `useSvgSource`). Pas de fallback intégré : c'est le rôle du wrapper.
- Pas de style scoped ni de classe Tailwind : il marche sans le CSS de maz-ui.

`MazIcon` garde `useSvgSource` et tous ses formats. Pour un nom, il passe par le même helper que `MazNamedIcon` (lecture du registre, préparation du SVG avec `prepareSvgString`) : un nom s'affiche pareil dans les deux. Le helper et la partie de `svg-utils` qu'il utilise passent dans `@maz-ui/icons`.

## Types

`@maz-ui/icons` déclare :

```ts
export interface IconNames {}
/** Augmentée avec `{ strict: true }` par le plugin */
export interface IconOptions {}
export type IconName = keyof IconNames
export type IconSource = `/${string}` | `http://${string}` | `https://${string}` | `data:${string}` | `blob:${string}` | `<svg${string}`
export type IconString = IconName | (string & (IconOptions extends { strict: true } ? IconSource : Record<never, never>))
```

Le fichier généré par le plugin augmente deux modules :

- `@maz-ui/icons`, toujours : une lib sans maz-ui a ses noms ;
- `maz-ui`, quand le projet le résout : en pnpm strict, une app qui ne dépend que de maz-ui ne résout pas `@maz-ui/icons`, et TypeScript ignore sans erreur l'augmentation d'un module qu'il ne résout pas.

Chaque augmentation garde son `import type {} from '<module>'`, pour ajouter le module au programme (voir le commentaire de `generateIconTypes`). Côté maz-ui, `MazIconNames` et `MazIconOptions` restent (l'API publique et les fichiers déjà générés), et `MazIconName` devient `keyof MazIconNames | IconName`. On ne peut pas ré-exporter `IconNames` depuis maz-ui à la place : TypeScript n'augmente pas une interface à travers un ré-export.

`strict` reste une option du plugin, il augmente `IconOptions` et `MazIconOptions`.

Un composant avec une prop typée `IconName` ou `IconString` doit être générique (`generic="_T"`) : passé comme `Component` (`h()`, une route), le `LooseRequired<props>` d'un `DefineComponent` intersecte les 870+ noms avec eux-mêmes et dépasse la limite de TypeScript (TS2590). À écrire dans la doc.

## Dépendances

`@maz-ui/icons` n'a aucune dépendance aujourd'hui (`vue` et `unplugin-vue-components` en peers optionnels). Le plugin apporte `magic-string`, `tinyglobby` et svgo (par `@maz-ui/vite-svg-loader`), installés par tous les utilisateurs de maz-ui :

- `magic-string`, `tinyglobby` : dépendances (légères) ;
- `vite` et `svgo` : peers optionnels. Sans svgo, le plugin garde les SVG du projet tels quels et prévient une fois, quand il y a un dossier de SVG ;
- `@maz-ui/vite-svg-loader` : à trancher, en dépendance (il tire svgo) ou en n'important que son `optimizeSvg` quand svgo est résolu.

`@maz-ui/vite-plugin` dépend déjà de `@maz-ui/icons` : rien à ajouter. Lancer `node .github/scripts/check-deps.mjs` et `node .github/scripts/publish-exports.mjs` après.

## Tâches

- [ ] Types : `IconNames`, `IconOptions`, `IconName`, `IconString` dans `@maz-ui/icons`, double augmentation dans `generateIconTypes`, `MazIconName` de maz-ui. Commencer par là : vérifier avec une app qui n'a que maz-ui, une qui n'a que `@maz-ui/icons`, et une qui a les deux (pnpm strict, `vue-tsc`).
- [ ] Déplacer `packages/vite-plugin/src/icons` et ses tests (`__tests__` à côté des modules) dans `packages/icons`, exporter `./vite`. `@maz-ui/vite-plugin` ré-exporte `MazUiIcons`, `MazUiIconsOptions`, `generateIconTypes`, `IconTypesOptions`, `loadIconNames`.
- [ ] `./vue` : `MazNamedIcon` et le helper, sortis de `useSvgSource` et `svg-utils`. `MazIcon` s'en sert pour les noms.
- [ ] Build de `@maz-ui/icons` : les entrées `vite` (Node, hors du build Vite des icônes ou avec ses externals) et `vue`.
- [ ] `@maz-ui/nuxt` importe depuis `@maz-ui/icons/vite` (ou garde `@maz-ui/vite-plugin`).
- [ ] Doc : une page « Icônes par nom sans maz-ui » dans l'écosystème `@maz-ui/icons` (plugin, `MazNamedIcon`, wrapper, types, TS2590, `registerIcon` pour les noms dynamiques), et les agent-docs.
- [ ] Les messages restent `[maz-ui:icons]`, et la clé du registre `Symbol.for('maz-ui.icons.v1')` ne change pas (le code injecté et les versions déjà publiées la partagent).

## Hors périmètre

- Les autres formats dans `MazNamedIcon` (URL, raw, composants) : une lib qui en a besoin les ajoute dans son wrapper, ou utilise `MazIcon`.
- Un rendu hors de Vue (React...) : le registre est déjà agnostique, un composant d'un autre framework viendra si on en a besoin.
- Une option pour les props sans `icon` dans le nom (`logo`, `avatar`) : à ajouter au scan si une lib en a besoin.
