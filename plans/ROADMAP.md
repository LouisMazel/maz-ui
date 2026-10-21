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
