# Retours de Ripple

Manques et bugs relevés en construisant Ripple (`ripple/docs/maz-ui-feedbacks.md`), triés pour ne garder que ce qui sert à tous les utilisateurs de maz-ui. Tout part dans une seule PR. Cocher au fil de l'eau ; retirer l'entrée correspondante du fichier de Ripple quand elle est livrée.

Hors de cette PR : les composants arc-en-ciel (`MazRainbowFrame` et dérivés, PR à part).

## Exigences pour chaque point

Un point n'est coché que quand tout ceci est fait :

- Docs du site complètes et simples : cas courant d'abord, démo, tableau d'API à jour (props, events, slots, modèles).
- Agent docs parfaites : `pnpm -F agent-docs generate --bundle /tmp/x --strict` propre, `search_docs` trouve le besoin par ses mots courants (ajouter les alias si besoin), `get_component_api` renvoie l'API.
- Règles de la review (`packages/mcp/src/review`) et des hooks du plugin : une règle quand un usage fautif est probable (ancienne façon de faire, contournement devenu inutile), avec ses tests. Penser à `plugins/maz-ui` et au plugin OpenCode, et à `pnpm -F agent-docs generate:plugin` si `tools/agent-docs/content` change.
- Perfs et taille : rien de chargé si la fonction n'est pas utilisée (import dynamique, composant à part plutôt qu'une prop qui alourdit un composant de base), mesurer la taille des composants touchés avant et après.
- Tests unitaires en Gherkin, seuils de couverture verts (`CI=1 pnpm vitest run --coverage` dans `packages/maz-ui`).

## Bugs

- [x] `MazDropdown` : `relative` sur `m-dropdown__wrapper`, le libellé `sr-only` du déclencheur se place sinon par rapport à la page et la fait défiler dans une zone `overflow-y-auto`.
- [x] `MazRadioButtons` : `min-w-0` avec `equal-size` (`flex: 1` seul laisse un contenu long élargir sa tuile).
- [x] `MazReadMore` : mesurer aussi quand le contenu change (`ResizeObserver` ou `MutationObserver` via les composables existants), pas seulement au montage.
- [x] `MazBtn` : les couleurs de texte sont en `!` (`maz:text-*!`), une classe utilitaire de l'utilisateur ne peut pas les remplacer. Retirer le `!` sans casser les variantes (`transparent`, `outlined`, `pastel`), et vérifier le survol de `color="transparent"` avec `active`.
- [x] `MazDialog` : en-tête aux marges inégales (`ps-6 pe-2 pt-2 pb-4`) ; `content-padding` sans effet sur le `px-6` du contenu ; pas de séparateur sous le titre hors `scrollable`.
- [x] `MazDialog` / `MazBackdrop` : `before-close` ne peut pas annuler la fermeture. Un `before-close` qui renvoie `false` (ou une promesse de `false`) garde le dialogue ouvert, Échap compris (cas : changements non enregistrés).
- [x] `MazList` : ne pas rendre le bloc d'éléments vide (une liste réduite à son en-tête laisse une carte vide).
- [x] `MazList` : `#header-end` sans `title` doit avoir sa rangée d'en-tête.
- [x] `MazInputNumber` : flèches natives visibles sur Safari (le CSS actuel vise `-webkit-inner-spin-button` en `:deep`, à vérifier sur Safari : `-webkit-appearance`, `outer-spin-button`, `margin: 0`).
- [x] À vérifier à l'écran, clair et sombre, presets par défaut et natifs : `MazBadge` `contrast` (plein criard en sombre, `pastel` illisible en clair), `MazBadge` `surface` sur `container` (invisible en clair), segment choisi de `MazSegmented` en sombre (à peine distinct). Corriger ce qui se confirme.
- [x] `MazTimeline` : icône de l'état `error` en `size="sm"` (à vérifier).

## MCP et review

- [x] `get_theme_tokens` : résoudre les constantes d'un `definePreset` (`<expr: NUIT>` retombe aujourd'hui sur le preset de base, d'où de faux contrastes).
- [x] `get_theme_tokens` : lire les presets réellement utilisés, pas un preset défini mais non branché (cas d'un preset choisi à l'exécution : au moins le signaler).
- [x] `get_component_api` : renvoie aucune prop pour `MazTable` (seulement ses exemples).

## Composants nouveaux

- [x] `MazMarkdown` : rendu markdown seul, en lecture seule. Point de départ : `ripple/apps/desktop/src/components/maz-ui/MazMarkdown.vue` (rendu synchrone avec `marked`, DOMPurify, blocs de code via `MazCodeHighlight`, événement `link-click`), à remettre aux normes maz-ui (préfixe `maz:`, props et nommage du design system, traductions, a11y, options utiles au plus grand nombre : rendu personnalisé, options de `marked`, liens externes, coloration, tailles). `marked`, DOMPurify et `MazCodeHighlight` chargés sans alourdir ceux qui ne les utilisent pas.
  - [x] `MazMarkdownEditor` utilise `MazMarkdown` pour son aperçu (une seule logique de rendu).
  - [x] `rich-text` : taille `xs` (Ripple contourne avec `[--maz-rich-text-scale:0.8125]`).
  - [x] Review : signaler `MazMarkdownEditor` en `mode="preview"` utilisé comme simple rendu.
- [x] Prop `diff` de `MazCodeHighlight` (pas de composant dédié) : `code` est le nouveau texte, `diff` l'ancien, lignes ajoutées et retirées avec numéros, lignes identiques repliées (contexte réglable), compteurs `+` / `-`. Point de départ : `diffLines`, `foldDiff`, `diffStats` de `ripple/apps/desktop/src/utils/releases.ts` et `components/releases/ConfigDiffDialog.vue`. Algorithme de diff exporté aussi dans `@maz-ui/utils` si utile seul. Le code du diff n'est chargé que si `diff` est défini ; pas de vue côte à côte.
- [x] `MazLogStream` (nom à confirmer) : un flux de journal dans le cadre de `MazCodeHighlight` (fond, boutons copier et « aller en bas », collé en bas tant qu'on n'a pas remonté), avec des lignes structurées (texte, markdown, lignes atténuées, erreurs). Partager les briques avec `MazCodeHighlight` plutôt que les copier. Point de départ : `ripple/apps/desktop/src/components/runs/RunAgentLog.vue`.
- [x] Champ « clé et valeur » (objet de chaînes) à côté de `MazInputTags`, seulement si l'API reste générique (ajout, retrait, validation de clé en double, `v-model` objet). Sinon, abandonner et l'écrire ici.
- [x] Champ secret « valeur enregistrée » (secret qu'on ne relit jamais : placeholder masqué, bouton effacer ou remplacer) : un composant à part (`MazInputSecret` ?), pas une prop de plus sur `MazInput`.

## Évolutions de composants

- [x] `MazTabs` / `MazTabsBar` : orientation verticale (colonne de sections, flèches haut et bas, compteurs et état actif). Couvre la navigation par sections et les onglets façon Réglages.
- [x] `MazCheckbox` : état `indeterminate` (case « Tout sélectionner »).
- [x] `MazTable` : lignes dépliables (détail sous la ligne, rendu à la première ouverture).
- [x] `MazInputAutocomplete` : reprendre les props de `MazInput` qui lui manquent (`rounded-size`, `start-icon`, et faire le tour des autres) ; signaler une saisie libre valide au lieu de « aucun résultat ».
- [x] `MazSegmented` : infobulle par option, badge ou compteur par option (comme `MazTabsBar`), champs en plus d'une option transmis au slot `#item`.
- [x] `MazSwitch` : prop `size` (comme `MazCheckbox`).
- [x] `MazInputNumber` : préfixe et suffixe d'unité (`$`, `min`).
- [x] `MazBtn` : `loading-position="start"` (loader en icône de début, libellé gardé).
- [x] `MazList` : séparateur titré ou groupes d'éléments.
- [x] `MazListItem` : zone de contenu large sous le titre pour une ligne non repliable.
- [x] `MazSidebarMenuButton` : icône ou slot en fin de libellé, sans perdre la troncature.
- [x] `MazDropdownMenuItem` : infobulle par entrée.
- [x] `MazTimeline` : troncature de la sous-ligne (`subtitle-lines`) sans redéfinir le slot.

## Couleurs libres

Aujourd'hui seules les couleurs du thème sont acceptées. Les ouvrir là où une couleur libre sert vraiment (données, catégories), pas partout.

Règle : une couleur libre quand la couleur porte une donnée (catégorie, série, personne, statut métier) ; le thème seul quand elle porte un rôle d'interface (action, état, validation, marque), car ces composants dérivent survol, focus, texte et contraste des tokens.

Composants qui ouvrent la couleur libre :

- [x] `MazProgressBar` : la barre et chaque segment (répartition, jauges par catégorie).
- [x] `MazCircularProgressBar` : même besoin que la barre (jauge de données).
- [x] `MazBadge` : étiquettes de catégorie (labels, tags) ; texte, bord et `pastel` dérivés de la couleur.
- [x] `MazIndicator` : pastille de statut métier (en ligne, priorité).
- [x] `MazAvatar` : couleur par personne (initiales).
- [x] `MazTimeline` : couleur d'une étape au-delà des états (`completed`, `error`...), par exemple par type d'événement.
- [x] `MazCardSpotlight` : couleur du halo, purement décorative.

Composants qui gardent les couleurs du thème (rôle d'interface) :

- Actions : `MazBtn`, `MazBtnDropdown`, `MazBtnGroup`, `MazBtnClipboard`, `MazBtnScroll`, `MazLink`, `MazDropdown`, `MazPopover`.
- Champs et contrôles : `MazInput`, `MazInputAutocomplete`, `MazInputCode`, `MazInputPhoneNumber`, `MazInputTags`, `MazTextarea`, `MazSelect`, `MazSelectCountry`, `MazDatePicker`, `MazCheckbox`, `MazChecklist`, `MazRadio`, `MazRadioButtons`, `MazSwitch`, `MazSlider`, `MazDropzone`, `MazMarkdownEditor`.
- Navigation et étapes : `MazTabs`, `MazTabsBar`, `MazSegmented`, `MazStepper`, `MazTable`, `MazReadMore`.
- Messages : `MazAlert` (sémantique : info, succès, alerte, erreur).
- Chargement : `MazSpinner`, `MazLoadingBar`, `MazReadingProgressBar`, `MazFullscreenLoader` (couleur de marque, réglable par le thème).

- [x] Forme commune de l'API (une couleur CSS ou une variable, dérivation du texte et du survol avec `oklch`/`color-mix`), documentée une fois et réutilisée.
- [x] Review : accepter ces couleurs libres sans laisser passer la palette Tailwind par défaut ailleurs.

## Liens hors de la WebView

- [x] Option globale d'ouverture des liens (callback dans le plugin, par exemple `openExternal(href, event)`) pour Tauri et Electron, appliquée à tous les composants à `href` : `MazLink`, `MazCard`, `MazAvatar`, `MazBtn` (via `MazLink`), `MazBtnGroup`, `MazDropdown`, `MazListItem`, `MazSidebarMenuButton`, et `MazMarkdown`. L'icône externe (`auto-external`) suit l'option, pas seulement `target="_blank"`.
- [x] Une seule fonction partagée, sans rien ajouter au bundle quand l'option n'est pas posée.

## Thèmes

- [x] Token d'anneau de focus (couleur, épaisseur, décalage) distinct de `primary`.
- [x] Ombre par mode (`scales.shadow` est unique : en sombre, une ombre ou une lueur différente).
- [x] Bouton poussoir neutre des presets natifs (le gris de macOS, Windows, Linux) : `surface` et `container` ne conviennent pas.
- [ ] À clarifier avec Ripple avant de faire : le « token de dégradé de marque » (accent décoratif). Ne rien faire sans un besoin clair.

## Composables et utils

- [x] `useWindow` : abstraction des écouteurs de `window` (SSR, nettoyage au démontage), réutilisée par `useWindowSize`.
- [x] `useWindowFocus` sur `useWindow`.
- [x] `useEventListener` générique (cible, nettoyage automatique).
- [x] `useMediaQuery` et `prefers-reduced-motion` (`useReducedMotion` ou une option documentée).
- [x] `useShortcut` : raccourci selon la plateforme (Cmd sur macOS, Ctrl ailleurs) et son libellé (« ⌘1 » / « Ctrl+1 »).
- [x] `@maz-ui/utils` : `formatDuration` (secondes ou ms vers « 12 s », « 3 min 05 s », via `Intl`).
- [x] `@maz-ui/utils` : `debounce` renvoie un `cancel` (et `throttle` pareil si utile).
- [x] Règle des agents et review : pointer vers ces composables plutôt que `addEventListener` et `matchMedia` à la main.

## Outillage

- [x] `@maz-ui/eslint-config` : supporter TypeScript 5, 6 et 7. Peer `typescript` optionnel en `^5 || ^6` : `typescript-eslint` (8.74) exige `<6.1.0` et TypeScript 7 n'a pas d'API de compilateur ; la doc explique la cohabitation (TS 6 pour ESLint, TS 7 pour `tsc`). Ajouter `^7` quand `typescript-eslint` le supportera.
- [x] `@maz-ui/icons` : icône d'épingle (`MazPin`, Heroicons n'en a pas). Variante barrée abandonnée : pas assez lisible à cette taille.
