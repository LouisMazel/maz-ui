# Maz-UI - Roadmap (après la v5 stable)

Ce qui reste à faire après la v5. Le travail déjà livré (virtualisation de `MazTable`, accessibilité des composants, revue du codemod, warnings `postcss-calc` sous Nuxt, tests axe en CI) n'est plus listé ici.

## Priorité haute - Fondations

### Virtualisation des listes

`MazSelect` et `MazChecklist` rament au-delà de quelques milliers d'éléments (`MazTable` est déjà virtualisé via `@tanstack/vue-virtual`). Opt-in pour rester rétrocompatible.

- [ ] Composable réutilisable `useVirtualList` (hauteur d'item fixe d'abord, mesure dynamique ensuite), ou réutiliser `@tanstack/vue-virtual` comme `MazTable`.
- [ ] `MazSelect` : le plus d'impact. Le focus est aujourd'hui sur les options (`role="option"`, focus réel) : avec la virtualisation, les options hors écran n'existent plus, il faudra passer à `aria-activedescendant` (focus sur le combobox).
- [ ] `MazChecklist` : le plus simple, pas de navigation clavier custom.
- Exclu : `MazDropdown` (contenu de slots arbitraire).

### Primitives headless

shadcn-vue et Nuxt UI v3 reposent sur Reka UI (ex-Radix Vue) pour l'ARIA, le focus trap, le roving tabindex, la détection de collision et la navigation clavier. Maz-UI les implémente à la main. Les tests axe et clavier sont maintenant en place (garde-fou), l'étape suivante serait d'adopter Reka UI comme socle des primitives complexes (`Popover`, `Dropdown`, `Dialog`, `Select`, `Tabs`, `Combobox`) en ne gardant que le style par-dessus.

### API de variants déclarative

Définir les variants (`color` x `size` x `variant`) via une config type-safe (`tailwind-variants` / CVA) plutôt que des chaînes de classes conditionnelles : lisibilité, slots de classes surchargeables, cohérence.

## Priorité moyenne - Composants devenus standards

- **Command palette (⌘K)** : les briques existent (`useStringMatching`, recherche de `MazSelect`).
- **Combobox / Autocomplete** en saisie libre (distinct de `MazSelect`).
- **ContextMenu** (clic droit), **Menubar**, **NavigationMenu** (on n'a que `MazDropdown`).
- **Breadcrumb**.
- **MazTooltip** en composant avec slots (en complément de la directive `vTooltip`).
- **Rating** et **ColorPicker**.
- **Resizable / Splitter**, **ScrollArea** cross-browser, **Tree / TreeView**.

## Priorité basse - Stratégique

- **`@maz-ui/forms`** : générateur de formulaires piloté par un schéma (Standard Schema, sur la base de `useFormValidator`). PR en cours : #1437.
- **Distribution "registry" à la shadcn** : `npx maz add button` qui copie le code dans le projet. Point de départ : `maz-cli`.
- **Tests de régression visuelle** (Playwright screenshots, éventuellement Histoire / Storybook).
- **Container queries** (`@container` de Tailwind v4) pour rendre `MazCard` / `MazTable` responsives à leur conteneur.

## v6 (breaking)

### Styles des composants dans `@layer components`

Les styles scoped des composants sont compilés hors de toute `@layer` (`dist/assets/*.css`) : ils gagnent toujours sur les utilitaires Tailwind du consommateur, qui doit passer par `!` (`text-white!` sur un `MazBtn`) ou par la prop `textColor`. Relevé par un projet qui utilise maz-ui (couleur de texte de `MazBtn color="transparent"`).

- [ ] Compiler les styles des composants dans `@layer components`, pour toute la lib (pas composant par composant).
- [ ] Sortir des templates les classes `maz:` qui fixent ce que le CSS du composant surcharge (`maz:bg-transparent`, `maz:text-foreground`, `maz:border-transparent` de `MazBtn`...) : en `@layer utilities`, elles l'emporteraient sinon sur le CSS du composant.
- [ ] Breaking : un CSS global non layéré du consommateur (reset `button { background: none }`) l'emportera alors sur les composants. À documenter dans le guide de migration.

### `MazAvatar` : chargement natif par défaut

`loading="intersecting"` (le défaut) passe par `MazLazyImg` (async chunk, directive `vLazyImg`, un `IntersectionObserver` par avatar) alors que `loading="lazy"` utilise déjà un `<img>` natif. `MazSelectCountry` est déjà passé au natif.

- [ ] Passer le défaut de `loading` à `'lazy'`.
- [ ] Déprécier `'intersecting'` en 5.x, le retirer en v6, avec les événements `loading` et `intersecting` qui en dépendent. Le `<img>` natif n'émet aujourd'hui que `error` : ajouter un `@load` pour garder `loaded`.
- [ ] Note dans le guide de migration.
