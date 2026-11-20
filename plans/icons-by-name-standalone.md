# Icônes par nom sans maz-ui

Issue : [#1738](https://github.com/LouisMazel/maz-ui/issues/1738).

## Positionnement

Pour les projets qui ont leurs propres SVG (un design system, des marques, des pictos métier) et qui veulent des icônes par nom sans payer en poids. Les icônes de `@maz-ui/icons` (336 icônes, 29 logos, 256 drapeaux en deux formats) sont un bonus, pas le cœur.

Ce qu'on fait mieux que `@nuxt/icon` (Iconify, aussi disponible sans Nuxt par `@nuxt/icon/vite`) :

- Découpage par page : chaque icône est dans le chunk du fichier qui l'utilise, pas dans un bundle client global (`@nuxt/icon` met les icônes scannées et, par défaut, les collections custom entières dans un seul module, avec une limite de 256 Ko).
- Le scan lit le code compilé : toute clé ou prop qui contient `icon` (`start-icon="moon"`, `{ icon: 'x' }`, les props d'un design system), pas seulement `<Icon name="x:y">` et les classes `i-x-y`.
- Libs publiées : une lib précompilée embarque ses icônes, celles de `@maz-ui/icons` restent des imports partagés avec l'app (mode lib).
- svgo sur les SVG des dossiers, réglable par dossier.
- Aucune dépendance runtime autre que Vue : SVG inline, rendu synchrone en SSR (pas de renderer Iconify, pas de mode CSS).
- Noms typés : union générée, autocomplétion, `strict` refuse une faute de frappe.
- Le même registre sert les props des composants (`MazBtn`, `AdsBtn`), pas seulement un composant d'icône.

Là où `@nuxt/icon` reste le bon choix : un catalogue de 200 000+ icônes sans rien installer, des noms inconnus au build récupérés au runtime (endpoint serveur ou CDN), le mode CSS.

La doc suit cet ordre : vos SVG par nom et optimisés d'abord, le poids dans le bundle comme argument, le set de `@maz-ui/icons` ensuite.

## Problème

`icon="x-mark"` ne marche qu'avec maz-ui. Le plugin qui enregistre les icônes est dans `@maz-ui/vite-plugin`, le rendu dans `MazIcon`, et les types des noms augmentent le module `maz-ui`. Une autre lib Vue (`@accor/ads-components` et son `AdsIcon`, par exemple) ne peut donc pas profiter des icônes par nom sans dépendre de maz-ui.

Ce qui est déjà indépendant de maz-ui :

- le registre (`@maz-ui/icons/registry` : `registerIcon`, `getRegisteredIcon`), une `Map` de chaînes SVG sur `globalThis` ;
- `MazUiIcons()`, exporté seul par `@maz-ui/vite-plugin`. Son scan lit les clés, attributs et variables dont le nom contient `icon` dans le code compilé : il ne connaît pas les composants ;
- la résolution de `@maz-ui/icons` : depuis maz-ui d'abord, puis le projet, puis le plugin (`locateIconsPackage`).

## Décision

- Tout dans `@maz-ui/icons` : un seul package à installer pour avoir les icônes par nom (plugin, composant, types).
- `MazIconPrimitive` ne rend que des noms. Les URL, data URI, chaînes raw et composants restent dans `MazIcon` et `MazSvg`, qui passent par `MazIconPrimitive` pour un nom. Une lib le wrappe pour ajouter sa taille, son fallback ou d'autres formats (`AdsIcon`).
- Pas de breaking change : `@maz-ui/vite-plugin` ré-exporte le plugin, `MazUi()`, `@maz-ui/nuxt`, `MazIcon` et `MazSvg` ne changent pas pour les utilisateurs. Une `feat` (minor) de `@maz-ui/icons`, `@maz-ui/vite-plugin` et maz-ui, dans le groupe `ecosystem` (même version).
- Pas de nouveau package : il faudrait le garder en phase avec `@maz-ui/icons` et `@maz-ui/vite-plugin`, et les gens en installeraient un de plus.
- On itère : une première version simple (itération 1), le reste ensuite (itération 2).

## API

```ts
// vite.config.ts
import { MazUiIcons } from '@maz-ui/icons/vite'

export default defineConfig({
  plugins: [
    Vue(),
    MazUiIcons({
      dir: [
        'src/icons',
        { path: 'node_modules/@accor/icons/svg', prefix: 'ads' },
      ],
    }),
  ],
})
```

```vue
<script setup lang="ts">
import { MazIconPrimitive } from '@maz-ui/icons/vue'
</script>

<template>
  <MazIconPrimitive icon="x-mark" />
  <MazIconPrimitive icon="ads:eye" class="size-6 text-primary" />
</template>
```

Le wrapper d'une lib :

```vue
<script setup lang="ts" generic="_T">
import type { MazIconPrimitiveProps } from '@maz-ui/icons/vue'
import { MazIconPrimitive } from '@maz-ui/icons/vue'

defineProps<MazIconPrimitiveProps>()
</script>

<template>
  <MazIconPrimitive v-bind="$props" class="app-icon" />
</template>
```

Une prop d'icône d'un composant de la lib (`<AppBtn start-icon="moon">`) se type avec `IconString` (pas `IconName`, voir Types) : le scan voit `startIcon: 'moon'` dans le code compilé, l'icône est enregistrée sans configuration.

## Sous-chemins de `@maz-ui/icons`

| Sous-chemin | Contenu | Runtime |
| --- | --- | --- |
| `.`, `./static/*`, `./lazy/*`, `./raw/*` | les icônes et leurs types (déjà là), plus `IconNames`, `IconOptions`, `IconName`, `IconString` | navigateur |
| `./registry` | le registre (déjà là) | agnostique |
| `./vite` | `MazUiIcons`, `generateIconTypes`, `loadIconNames`, déplacés depuis `packages/vite-plugin/src/icons` | Node |
| `./vue` | `MazIconPrimitive`, `MazIconPrimitiveProps`, `hasIcon`, et la préparation d'un SVG (`prepareSvgString`) | Vue |

Le motif `./*` (`@maz-ui/icons/MazX`) existe déjà : vérifier que les clés exactes `./vite` et `./vue` passent devant, et qu'aucune icône ne s'appelle `vite` ou `vue`.

## Plugin

### Plusieurs dossiers

`dir` accepte aussi un tableau, sans breaking change : une chaîne seule marche comme aujourd'hui.

```ts
type IconDir = string | { path: string, prefix?: string, svgo?: SvgoConfigOption | false }
dir?: IconDir | IconDir[]
```

Les options globales `prefix` et `svgoConfig` s'appliquent aux entrées en chaîne. Un dossier peut être dans `node_modules` (les SVG d'un package, `@accor/icons/svg`).

### svgo

Tous les SVG des dossiers passent par svgo, ceux des packages compris : poids, couleurs et métadonnées en trop, et surtout les ids préfixés (`prefixIds`), sans quoi deux SVG inlinés avec le même `id` se volent leurs `url(#id)`. Le résultat est mis en cache par fichier. Un dossier que la config par défaut abîme : `svgo: false` ou sa propre config. Les icônes de `@maz-ui/icons` ne repassent pas par svgo, elles sont déjà optimisées.

Les SVG enregistrés au runtime (`registerIcon()`) et les chaînes passées à `MazIcon` ne passent pas par svgo.

### Sans les icônes de maz-ui

`defaultIcons: false` : seules les icônes des dossiers ont un nom. Sans risque pour maz-ui : ses composants n'utilisent aucun nom en interne, seulement des imports `lazy/` et `raw/`.

### Mode app et mode lib

Le code injecté importe les modules virtuels `virtual:maz-icon/*` et `virtual:maz-icon-runtime`. Dans le build d'une lib, ils sont résolus par le plugin de la lib : son `dist` n'en a plus, il a le runtime (même clé `globalThis`) et chaque SVG d'un dossier dans un module, partagé par les fichiers qui l'utilisent.

Mode lib, option `lib` (par défaut, `true` quand `build.lib` est défini, pour une lib buildée sans `build.lib`) : une icône de `@maz-ui/icons` external reste un import `@maz-ui/icons/raw/MazX`, partagé avec l'app, au lieu d'être recopiée dans le `dist`. La lib déclare `@maz-ui/icons` en dépendance, l'app n'a rien à configurer. Une app garde l'inline quand `@maz-ui/icons` est external (build SSR).

Le plugin de l'app ne scanne pas `node_modules` : une lib compilée embarque son registre, elle n'est pas enregistrée deux fois.

## Composant `MazIconPrimitive`

Le nom dit son rôle (la brique qu'on enveloppe), pas ce qu'il fait aujourd'hui : il reste vrai s'il accepte un jour d'autres formats. Il est réservé dans la génération des icônes (une icône ne peut pas s'appeler ainsi). Écrit en TypeScript (`defineComponent`, `h()`), pas en SFC.

- Props :
  - `icon: MazIconPrimitiveName` (pas `name` : le scan lit par défaut les clés qui contiennent `icon`, `name` y attraperait les noms de routes et de composants ; un wrapper nomme sa prop comme il veut et l'ajoute à `scan.keys`) : les noms connus (autocomplétion), toute chaîne sans `strict` (noms enregistrés par `registerIcon()` sans les types du plugin), seulement les noms connus avec `strict` ;
  - `width` et `height` : `1em` par défaut, pour s'aligner sur le texte. Un seul des deux, l'autre suit le ratio du SVG. `false` sur les deux garde la taille du fichier (`MazSvg` sans taille) ;
  - `title` : le nom de l'icône pour les lecteurs d'écran ;
  - `svgAttributes` : des attributs du `<svg>` (relayés par `MazIcon` et `MazSvg`).
- Lit `getRegisteredIcon(name)` et rend le `<svg>` de l'icône comme racine (`prepareSvgString`, puis `parseSvg` : attributs de la balise `<svg>` lus par regex, contenu en `innerHTML`, pas de `DOMParser`, il tourne en SSR). Les classes et attributs du parent tombent sur le `<svg>` : `class="size-6"` le redimensionne, sans `:deep()`.
- La couleur vient du `currentColor` des icônes de `@maz-ui/icons`. Le reste se règle en CSS.
- Nom inconnu : en dev (`process.env.NODE_ENV !== 'production'`, gardé tel quel dans le `dist`), un warning par nom et un carré en pointillés visible (`data-unknown-icon`, `title` `Unknown icon "x"`). En production, il ne rend rien, sans warning.
- Pas de style scoped ni de classe Tailwind : il marche sans le CSS de maz-ui.
- TS2590 : passé comme `Component`, à `h()` ou à une route, il ne déclenche pas le TS2590 sans `generic="_T"`, avec les 877 noms augmentés (vérifié dans `apps/vue-app`). Une piste pour la tâche du TS2590 : écrire les composants avec une prop d'icône en `defineComponent`.

`hasIcon(name)` dit si un nom est enregistré. `MazIcon` et `MazSvg` l'appellent avant de rendre `MazIconPrimitive`, pour garder leur `fallback` et leur événement `error` : ils ne voient jamais le remplacement de dev.

`MazIcon` et `MazSvg` gardent leur `<span>` racine (`m-icon`, `m-svg`), leurs props et leurs événements. Pour un nom, ils rendent `<MazIconPrimitive>` dans le `<span>` à la place du `v-html` : le `<svg>` reste l'enfant direct, leurs règles `:deep(> svg)` ne changent pas. Leur `<span>` porte déjà l'accessibilité : ils passent `role`, `aria-hidden` et `aria-label` à `null` au `<svg>`, qui reste comme aujourd'hui. `useSvgSource` garde les autres formats (URL, fetch, cache, prefetch SSR). `prepareSvgString` et `stripSvgRootDimensions` passent dans `@maz-ui/icons/vue`, `svg-utils` les ré-exporte.

## Accessibilité

Une priorité : une icône est soit décorative (cachée), soit une image nommée, jamais entre les deux.

- Décorative par défaut : `aria-hidden="true"`, sans `role`. C'est le cas d'une icône à côté d'un texte, ou dans un bouton ou un lien qui a son propre nom.
- Nommée : avec `title`, `aria-label` ou `aria-labelledby` (sur le composant ou dans `svgAttributes`), `role="img"`, sans `aria-hidden`. `title` donne aussi l'`aria-label` (un `<title>` seul n'est pas lu par tous les lecteurs d'écran selon le navigateur) et le `<title>` (l'infobulle). Un `aria-label` ou un `aria-labelledby` passé l'emporte sur `title`, sans doublon.
- Le parent décide : un `aria-hidden` passé l'emporte, et `null` retire un attribut (c'est ce que font `MazIcon` et `MazSvg`, dont le `<span>` porte l'accessibilité).
- Le `<title>` d'un SVG source est remplacé par `title`, ou caché avec l'icône quand elle est décorative.
- Mode contrasté (forced colors) : les icônes en `currentColor` suivent la couleur du texte. Un SVG d'un dossier aux couleurs en dur ne la suit pas : à écrire dans la doc.
- Tests : le rendu (SSR) de chaque cas dans `@maz-ui/icons`. Un audit axe (`runAxe` de maz-ui) de `MazIcon` et `MazSvg` avec un nom : décorative, nommée, dans un bouton avec `aria-label`, dans un lien.
- Doc : une section « Accessibilité » sur la page des icônes par nom, avec le cas du bouton icône seule (le nom sur le bouton, l'icône décorative) et celui d'une icône qui porte un sens seule (`title`).

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

La détection cherche `node_modules/<module>` dans le dossier du projet et ses parents, comme TypeScript : pas `require.resolve`, qui lit le `NODE_PATH` posé par pnpm (`node_modules/.pnpm/node_modules`) et trouverait `@maz-ui/icons` dans une app qui ne le résout pas. Sans aucun des deux, le plugin garde `maz-ui`, comme avant. `@maz-ui/nuxt` augmente toujours `maz-ui` (ses composants sont auto-importés), et `@maz-ui/icons` en plus quand le projet le résout.

L'interface est dans `src/types.ts`, ré-exportée par `export type *` à la racine : TypeScript fusionne bien une augmentation à travers un `export *` (vérifié en 6.0).

`@maz-ui/icons/icon-list` exporte déjà un `IconName`, les noms des composants (`'MazStar'`) : un autre module, pas de conflit, il disparaît en v6.

Chaque augmentation garde son `import type {} from '<module>'`, pour ajouter le module au programme (voir le commentaire de `generateIconTypes`). Côté maz-ui, `MazIconNames` et `MazIconOptions` restent (l'API publique et les fichiers déjà générés), et `MazIconName` devient `keyof MazIconNames | IconName`. On ne peut pas ré-exporter `IconNames` depuis maz-ui à la place : TypeScript n'augmente pas une interface à travers un ré-export.

`strict` reste une option du plugin, il augmente `IconOptions` et `MazIconOptions`.

Dans une app, `IconName` ne contient que les noms connus de son plugin (vide sans plugin) : les props d'icône d'une lib publiée se typent avec `IconString`, qui accepte toute chaîne sans `strict`.

Un composant avec une prop typée `IconName` ou `IconString` doit être générique (`generic="_T"`) : passé comme `Component` (`h()`, une route), le `LooseRequired<props>` d'un `DefineComponent` intersecte les 870+ noms avec eux-mêmes et dépasse la limite de TypeScript (TS2590). À écrire dans la doc.

## Dépendances

`@maz-ui/icons` n'a aucune dépendance aujourd'hui (`vue` et `unplugin-vue-components` en peers optionnels). Le plugin apporte `magic-string`, `tinyglobby` et svgo (par `@maz-ui/vite-svg-loader`), installés par tous les utilisateurs de maz-ui :

- `magic-string` (sorti de `@maz-ui/vite-plugin`, qui ne l'utilise plus), `tinyglobby` : dépendances (légères) ;
- `vite` et `@maz-ui/vite-svg-loader` (`workspace:^`, il tire svgo) : peers optionnels. Le plugin importe `optimizeSvg` au premier SVG de dossier chargé : maz-ui dépend de `@maz-ui/icons`, une dépendance installerait svgo chez tous ses utilisateurs. Sans lui, les SVG sont gardés tels quels, avec un warning. `@maz-ui/vite-plugin` le garde en dépendance : `MazUi()` et `@maz-ui/nuxt` optimisent comme avant.

Une app qui résout maz-ui et `@maz-ui/icons` a les noms deux fois dans son `maz-icons.d.ts` (une augmentation par module) : l'augmentation de `maz-ui` ne dépend pas de la copie de `@maz-ui/icons` que maz-ui résout.

`@maz-ui/vite-plugin` dépend déjà de `@maz-ui/icons` : rien à ajouter. Lancer `node .github/scripts/check-deps.mts` et `node .github/scripts/publish-exports.mts` après.

## Itération 1

- [x] Types : `IconNames`, `IconOptions`, `IconName`, `IconString` dans `@maz-ui/icons` (`src/types.ts`, ré-exporté par la racine), option `modules` de `generateIconTypes` (`['maz-ui']` par défaut), `resolveIconTypesModules(root)`, `MazIconName` de maz-ui. Vérifié avec une app qui n'a que maz-ui, une qui n'a que `@maz-ui/icons`, et une qui a les deux.
- [x] Déplacer `packages/vite-plugin/src/icons` et ses tests dans `packages/icons/src/vite` (`plugin.ts`, l'entrée publique `index.ts`), exporter `./vite` (buildé par unbuild après le build Vite des icônes). `@maz-ui/vite-plugin` ré-exporte `MazUiIcons`, `MazUiIconsOptions`, `generateIconTypes`, `IconTypesOptions`, `IconTypesModule`, `loadIconNames`, `resolveIconTypesModules`. Le troisième candidat de `locateIconsPackage` (`import.meta.url`) résout le package lui-même (vérifié).
- [x] `dir` en tableau (une chaîne marche comme avant), svgo par dossier (`svgo: false` garde les SVG tels quels), `defaultIcons: false`, dans le plugin, `loadIconNames` et `@maz-ui/nuxt`. Une icône d'un dossier remplace celle de maz-ui ou d'un dossier précédent, avec un warning.
- [x] Mode lib, option `lib` (détecté par `build.lib` par défaut) : les icônes de `@maz-ui/icons` external restent des imports (vérifié par un vrai build de lib).
- [x] `./vue` : `MazIconPrimitive` (`icon`, `width`, `height`, `title`, `svgAttributes`, remplacement en dev), `hasIcon`, `prepareSvgString`, `parseSvg`, testés en SSR. `MazIcon` et `MazSvg` le rendent pour un nom enregistré (le wrapper reste l'élément accessible, le `<svg>` ne garde que les attributs de `svgAttributes`, il prend l'attribut de scope `data-v-*`), `svg-utils` ré-exporte `prepareSvgString` et `stripSvgRootDimensions`, audit axe fait.
- [x] Build de `@maz-ui/icons` : les entrées `vite` (unbuild, `dist/vite.mjs`) et `vue` (build Vite, `dist/vue.js`).
- [x] `@maz-ui/nuxt` garde `@maz-ui/vite-plugin`, et accepte `dir` en tableau et `defaultIcons`.
- [x] Doc : `ecosystem/icons/by-name` (positionnement, setup, `MazIconPrimitive` et wrapper, scan, dossiers, svgo, options, types et TS2590, poids mesuré, libs, accessibilité, comparaison avec `@nuxt/icon`), options de `vite-plugin.md`, alias et description d'agent-docs. Page prévue : « Icônes par nom sans maz-ui » dans l'écosystème `@maz-ui/icons` (plugin, dossiers, `MazIconPrimitive`, wrapper, types, TS2590, mode lib, `registerIcon` pour les noms dynamiques), et les agent-docs. Une section « Poids dans le bundle », avec des chiffres mesurés : ce que coûte une icône enregistrée (son SVG, dans le chunk du premier fichier qui l'utilise), `safelist` (dans le bundle de départ), le mode lib (SVG inlinés dans le `dist` de la lib, icônes de `@maz-ui/icons` partagées avec l'app), le runtime injecté, et comment le vérifier (`rollup-plugin-visualizer`, `vite build --mode analyze`...).
- [x] Les messages restent `[maz-ui:icons]`, la clé du registre `Symbol.for('maz-ui.icons.v1')` et `virtual:maz-icon-runtime` ne changent pas (le code injecté et les versions déjà publiées les partagent).

- [x] À la fin : chercher un contournement du TS2590. Conclusion : la cause est `LooseRequired` de Vue (`(U | undefined) & U` sur une prop optionnelle, produit croisé au-delà de 100 000 dès ~315 noms), aucune forme du type des noms ne l'évite sans perdre l'autocomplétion. On garde `generic="_T"`, corrigé en amont par vuejs/core#15104 (issue #10514). Objectif de départ : pour ne plus imposer `generic="_T"` aux composants avec une prop d'icône (maz-ui, et les wrappers comme `AdsIcon`). Pistes à mesurer : un type de nom qui ne se distribue pas dans `LooseRequired` (interface ou type marqué plutôt qu'une union de littéraux), une prop typée `IconString` côté runtime et les noms seulement pour l'autocomplétion, l'effet sur les 12 composants génériques de maz-ui. Garder l'autocomplétion et `strict`.

## Itération 2

- [x] Chargement à la demande : `{ path, prefix, lazy: true }`. Une table `nom → () => import(...)` dans le chunk des fichiers qui contiennent le préfixe (86 octets par nom minifié, 17 en gzip, sur les 222 icônes d'`@accor/assets`), un chunk par SVG (médiane 440 octets). `defineAsyncComponent` par nom : le SSR attend le SVG, l'hydratation aussi, un svg vide de sa taille pendant le chargement. Doc dans `by-name.md`, test de budget dans `plugin.test.ts`.
- [x] `~x-mark` : un nom écrit en dur, chargé à son premier affichage. Le fichier n'importe que son loader (`virtual:maz-icon-lazy/~x-mark`), le SVG est dans son chunk. Les types ajoutent `` `~${IconName}` `` : pas de TS2590, `vue-tsc` passe de 10,5 s à 10,7 s sur vue-app.
- [x] `maz-ui-icons types` (dans `@maz-ui/icons` et `maz-ui`) : écrit les types sans build, avant `vue-tsc`. Lit la config Vite avec `resolveConfig` et le Vite du projet (pour `npx`). Avec Nuxt, `nuxi prepare` suffit.
- [x] `strict` : les modules `raw` typés `` `<svg${string}` ``, `svg-modules.d.ts` type `@maz-ui/icons/svg/*?raw` et `?url`, et `?svg` / `?uri` de `@maz-ui/vite-svg-loader` (`?raw` et `?url` avec un type précis) pour les SVG d'un projet. Un package d'icônes comme `@accor/assets` réexporte `?svg` : ses apps sont typées sans changement.
- Écartés pour l'instant : `scan.exclude` (un faux positif coûte quelques octets), les globs dans `safelist` (`lazy` fait mieux), les noms d'une lib dans ses types publiés, `--check` sur la commande (`git diff --exit-code` suffit).
- [x] Les jeux de `@maz-ui/icons` : `defaultIcons: ['icons', 'flags', 'flags-square', 'logos']` (336, 256, 256 et 29 noms), tous par défaut (les noms sont publiés en 5.x : n'en garder qu'un serait cassant). Moins de noms à autocompléter et à typer, le bundle ne change pas.
- Écarté pour l'instant : un préfixe pour les icônes de `@maz-ui/icons`. Préfixer ses propres dossiers distingue déjà les icônes, et un préfixe libre rendrait faux les noms de la doc, des agents et du MCP pour ces projets.

## Hors périmètre

- Les autres formats dans `MazIconPrimitive` (URL, raw, composants) : une lib qui en a besoin les ajoute dans son wrapper, ou utilise `MazIcon`.
- Un rendu hors de Vue (React, Svelte...) : le registre est déjà agnostique, un composant d'un autre framework viendra si on en a besoin.
