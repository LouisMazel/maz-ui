# Maz-UI agent-first

## Positionnement

Faire de maz-ui la lib Vue et Nuxt avec laquelle un agent (Claude Code, Codex, OpenCode, Cursor...) travaille seul, du début à la fin :

- ajouter maz-ui à un projet existant et le configurer ;
- créer le thème voulu (marque, typo, densité, dark mode) ;
- construire des pages et des features complètes ;
- démarrer un projet de zéro et monter une app entière en un prompt ;
- vérifier que le code est juste (review) et que le projet tourne ;
- mettre à jour maz-ui.

Le projet de zéro n'est qu'un cas parmi d'autres : la plupart des utilisateurs arrivent avec un projet existant.

### Ce qui existe

Sur `develop` :

- le MCP : recherche par besoin, API des composants, icônes, tokens du thème, infos du projet, guide de setup, review ;
- `npx @maz-ui/mcp init` : rules, `AGENTS.md`, MCP et hooks pour une douzaine d'agents ;
- les plugins Claude Code, Codex et OpenCode : skill, hooks de review, subagent `maz-ui-editor`, skill d'upgrade ;
- des docs qui suivent la version installée ;
- les evals (`tools/agent-evals`).

Dans un projet qui utilise déjà maz-ui, l'agent a ce qu'il faut. Ce qui est faible :

- tout ce qui précède : adopter maz-ui, en faire le thème ;
- les looks très personnalisés ;
- la structure des pages ;
- la vérification que le projet tourne ;
- les chiffres qui prouvent tout ça.

### Vercel UI SDK

Vercel Labs a sorti UI SDK le 13 novembre 2026 ([ui-sdk.dev](https://ui-sdk.dev)) :

- Ce n'est pas une lib de composants : c'est plus de 50 « behaviors » headless (popup, typeahead, roving focus, virtualizer...), et l'agent les assemble lui-même en composants.
- Côté agent :
  - un skill (`npx skills add vercel-labs/ui`) ;
  - des docs dans `node_modules` (`llms.txt`, `.md` par sujet) ;
  - des boutons « Copy Prompt » et « Open as Markdown » sur chaque page ;
  - un Agent Bridge (`agent.snapshot()`, `agent.act()`) pour qu'un agent pilote l'UI sans screenshots.
- Leur marketing repose sur un benchmark publié et reproductible : 59 % de tool calls en moins et 68 % moins cher en React (44 à 53 % en Vue et Svelte). C'est une seule tâche, un seul modèle et 3 runs.
- Ce qu'ils n'ont pas : de CLI, de templates, d'apps d'exemple, de review du code de l'agent.

Notre avantage : le MCP, la review après chaque edit et des evals qui comparent `baseline`, `init` et `plugin`. Notre message : la qualité du code produit (l'agent réutilise maz-ui, sans erreur, sans dépendance en trop, et le projet tourne), pas seulement l'efficacité.

## Décisions

- On ne fait pas d'Agent Bridge (un agent qui pilote l'UI au runtime) : c'est un autre problème, encore de niche, et cher à maintenir sur plus de 60 composants.
- On est agent-first, pas migration-first : pas de table de correspondance ni de codemod depuis d'autres libs (Vuetify, PrimeVue...). L'agent cherche par besoin avec `search_docs`, comme pour le reste.
- Pas de mode unstyled ni headless : notre force, c'est d'être stylé et thémable. On lève plutôt ce qui empêche de surcharger le style (layers, tokens).
- On prouve avant de communiquer : les chiffres des evals d'abord, la nouvelle home ensuite.
- Tout ce qui s'ajoute (blocks, starter, prompts) est généré ou testé par les evals dès le départ, sinon ça pourrit.
- On garde un discours « agent-first, human-proof » : les utilisateurs humains restent la base.

## 1. Les evals, la preuve

Les evals mesurent si Claude Code réutilise maz-ui, seul (`baseline`), avec `init` et avec le plugin. Les prompts ne nomment jamais maz-ui.

- [x] Mesurer, par run :
  - les tool calls ;
  - les tokens (tous les modèles, cache compris) ;
  - les lignes ajoutées ;
  - les dépendances ajoutées ;
  - le typecheck (`vue-tsc`) et le build (`vite build`).
  Le rapport sépare la qualité et l'effort.
- [ ] Lancer une première série (quelques tâches, 3 runs par condition) pour avoir une base. Il n'y a aucun résultat gardé aujourd'hui.
- [ ] Des tâches sur un projet existant :
  - une app Vue sans maz-ui à laquelle on demande d'ajouter une page ;
  - une app avec ses couleurs et ses polices dont il faut garder le look.
- [ ] Des tâches de thème : « le site de la marque X, couleur principale #..., police ..., coins carrés, dense ».
- [ ] Des tâches « app entière » : un admin de projets (auth, table, formulaires, toasts), une landing, un checkout.
- [ ] Un smoke test Playwright pour les tâches de pages : l'app démarre, chaque page s'affiche sans erreur dans la console, et on garde un screenshot dans les résultats.
- [ ] Mesurer l'usage de `maz-ui-editor` (le rapport compte déjà les subagents).
- [ ] Plusieurs modèles (Sonnet, Opus) et Codex, pour la crédibilité multi-agents.
- [ ] Publier les chiffres : un tableau `baseline` / `init` / `plugin` sur la home et dans `/guide/ai-agents` (taux de réussite, tokens, coût, lignes), avec la commande pour les reproduire.

## 2. Des packages assez souples pour n'importe quel site

### CSS des composants dans des layers

Aujourd'hui, une partie seulement du CSS de maz-ui est dans des layers :

- Les classes Tailwind des templates (`maz:px-4`...) sont générées dans `dist/css/main.css`, dans `@layer utilities`. C'est le même layer que les utilities de l'utilisateur : entre `maz:px-4` et son `px-2`, c'est l'ordre de chargement des fichiers qui décide.
- Les `<style scoped>` des composants (57 composants) partent dans un fichier CSS par composant (`dist/assets/MazBtn.*.css`, injecté par `libInjectCss`), hors de tout layer. Ils battent tout CSS en layer, y compris les utilities de l'utilisateur. C'est pour ça qu'il faut `!important` pour surcharger un composant.

La cible : tout le CSS de la lib dans des sous-layers de `components`, sous les utilities de l'utilisateur. Les classes restent dans les templates : la purge et la non-duplication ne changent pas.

```css
@layer theme, base, components, utilities;
@layer components.maz-utilities, components.maz-components;
```

- [ ] Les classes des templates : `@import 'tailwindcss/utilities.css' layer(components.maz-utilities) prefix(maz)` dans `src/tailwindcss/dist-entry.css`, au lieu de `layer(utilities)`.
- [ ] Les styles scoped : un plugin PostCSS dans le build de la lib enveloppe chaque bloc `<style>` de SFC dans `@layer components.maz-components`. On évite de l'écrire à la main dans 57 fichiers, on l'oublierait.
- [ ] Chaque fichier CSS de la lib commence par la ligne qui fixe l'ordre des layers : le premier fichier qui les déclare fixe l'ordre pour toute la page, et un fichier par composant peut se charger avant `main.css`.
- [ ] Un test qui vérifie qu'aucune règle de `dist` ne reste hors layer.
- [ ] Vérifier dans un POC :
  - que Tailwind v4 accepte un nom de layer imbriqué dans `@import ... layer(...)` ;
  - que `MazUiPurgeCss` (`@maz-ui/vite-plugin`) garde bien les enveloppes de layer ;
  - que tout marche aussi sous Nuxt.
- Résultat : les utilities et le CSS hors layer de l'utilisateur passent au-dessus de la lib, sans `!important`. Entre eux, les styles scoped restent plus forts que les classes des templates, comme aujourd'hui.
- Deux layers pour toute la lib, pas un par composant. Chaque fichier CSS répète seulement la ligne qui fixe leur ordre.
- Décision : on le sort dans une version mineure, sans attendre une v6. Une app avec des styles globaux hors layer (un ancien reset, `button { background: none }`) écrasera les composants : c'est à elle de corriger ses règles. On l'annonce clairement dans le changelog et la doc.

### Thème : le style et la densité par composant

Le socle est bon :

- 14 rôles de couleur, et des échelles OKLCH générées à partir d'une seule couleur ;
- rayons, ombres, espacement, motion ;
- 3 familles de polices et une échelle typo à 12 niveaux ;
- dark mode et SSR ;
- 9 presets.

Ce qui manque pour des looks très différents (brutalist, playful, très dense) :

- [ ] La densité par composant : les paddings des cards et des dialogs, et les tailles des boutons et des inputs, sont fixes. Seul le token global `space` les change tous à la fois.
- [ ] Des tokens en plus : style de bordure, focus ring, casse des textes (uppercase des boutons), rayon et ombre par composant au-delà de `btn`, `input`, `container`, `glass` et `dialog`.
- [ ] Retirer ce qui est en dur, comme le `drop-shadow-md` de `MazCard`.
- [ ] Calculer les couleurs `-foreground` quand le preset ne les donne pas (elles sont toutes à écrire à la main aujourd'hui).
- [ ] Le chargement des polices : elles ne sont référencées que par leur nom.

### Traductions

Correct pour une lib de composants, insuffisant pour un site dans n'importe quelle langue :

- [ ] Un pont avec vue-i18n et `@nuxtjs/i18n`. C'est le vrai manque sur un projet existant, qui a déjà son i18n : aujourd'hui, la langue de maz-ui se synchronise à la main.
- [ ] Les pluriels.
- [ ] Des langues RTL (arabe, hébreu) et la fin du RTL dans les composants : il reste une quinzaine de classes `left-` / `right-` (`MazTicker`, actions de `MazCard`, `MazCodeHighlight`, `MazCardSpotlight`).
- [ ] `MazInputPrice` par défaut en `fr-FR` / `EUR` : suivre la langue de l'app.
- Il y a 8 langues aujourd'hui : en, fr, de, es, it, pt, ja, zh-CN.

### Composants : la structure des pages

Les briques sont riches : formulaires, `MazTable` (tri, recherche, pagination, sélection, virtualisation), overlays, médias, feedback. Il manque ce qui structure un site ou une app, par fréquence de besoin :

- [ ] Navbar / header d'app (menu, menu utilisateur).
- [ ] Footer.
- [ ] Breadcrumb (déjà dans `ROADMAP.md`).
- [ ] Menu de navigation : NavigationMenu, Menubar (déjà dans `ROADMAP.md`).
- [ ] Primitives de layout : Stack, Grid.
- [ ] Empty state.
- [ ] Wrapper Form / FormField (label, aide, erreur).
- [ ] Command palette (déjà dans `ROADMAP.md`).
- Au passage, `ROADMAP.md` liste encore le ColorPicker comme manquant alors que `MazColorPicker` existe.

## 3. Un agent autonome

### MCP

- [ ] `generate_preset` : une ou plusieurs couleurs de marque, ou le CSS existant du projet (`@theme`, variables CSS), donnent un preset complet, avec les `-foreground` et les contrastes vérifiés.
- [ ] `check_project` : typecheck et build du projet, avec les erreurs dans un format lisible par l'agent.
- [ ] `list_blocks` et `get_block` (voir 4).
- [ ] Des prompts :
  - `adopt` : ajouter maz-ui à un projet existant, en gardant son look, puis l'utiliser pour la suite ;
  - `theme` : un thème depuis une marque ;
  - `scaffold-app` : une app entière.

### Projets existants

- [ ] Aujourd'hui, `init` ne configure que les agents : quand maz-ui manque, il n'ajoute que le MCP. Ajouter une option qui installe et configure maz-ui (dépendances, plugin ou module Nuxt, CSS, thème).
- [ ] Un guide « Ajouter maz-ui à un projet existant » : l'installation, la cohabitation avec le code et les styles en place, le thème depuis le look actuel.
- À décider : les hooks du plugin restent muets tant que `node_modules/maz-ui` n'existe pas. Faut-il une note courte dans un projet Vue ou Nuxt sans maz-ui, pour que l'agent sache qu'il peut l'ajouter ? Sans devenir intrusif dans les projets qui n'en veulent pas.

### `maz-ui-editor`

Aujourd'hui il n'est presque jamais utilisé. Sa description (« Use proactively for any UI task of a maz-ui project ») est la seule chose qui pousse à déléguer. Rien ne le mentionne ailleurs : ni le contexte de session (`hooks/context.mjs`), ni le skill, ni les rules, ni les instructions du MCP. Et l'agent principal a déjà tout (rules, skill, MCP, review), donc il n'a pas de raison de déléguer.

- [ ] Lui donner un rôle que l'agent principal n'a pas : les gros chantiers UI (une page, un écran complet, le thème), dans un contexte isolé, avec sa propre boucle review + `check_project`.
- [ ] Dire quand déléguer, dans le contexte de session, le skill et les rules.
- [ ] Le faire écrire par `init` (`.claude/agents/`) : les équipes qui n'ont que `init` ne l'ont pas.
- [ ] Le mesurer dans les evals.
- Codex n'a pas de subagents : là-bas, le skill et les rules portent le même workflow.

### Plugins

- [ ] `check_project` dans le hook Stop, après la review.
- [ ] Des skills `maz-ui-theme` et `maz-ui-adopt`, à côté de `maz-ui-upgrade`.
- [ ] Mettre à jour les plugins (`plugins/maz-ui` : README, hooks, `plugin.json`, `marketplace.json`) et le plugin OpenCode à chaque changement.

## 4. Blocks et pages d'exemple

Un agent bien outillé assemble correctement des composants, mais une app entière sort générique ou incohérente. Et il n'a aucune page complète dont s'inspirer : `apps/vue-app` et `apps/nuxt-app` sont des playgrounds (un fichier de 1 700 lignes de composants empilés).

- [ ] Une première liste de blocks construits avec les composants maz-ui :
  - app shell (sidebar, header, menu utilisateur) ;
  - dashboard (stats, chart, table) ;
  - auth (connexion, inscription, mot de passe oublié) ;
  - settings ;
  - CRUD (table, formulaire en dialog, confirmation de suppression) ;
  - landing (hero, features, pricing, FAQ) ;
  - checkout ;
  - empty states.
- [ ] Les exposer aux agents : `list_blocks` et `get_block` dans le MCP, et dans les agent-docs (`tools/agent-docs`).
- [ ] Les montrer dans la doc (rendu, code, prompt à copier).
- [ ] Chaque block passe `review_code`, le typecheck et le build en CI.
- [ ] De vraies pages d'exemple dans les apps de démo, ou une app d'exemple à part.

## 5. Démarrer de zéro

- [ ] Un starter `npm create maz-ui` (Vue ou Nuxt) qui livre un projet prêt pour les agents : le thème, les traductions, Tailwind, `AGENTS.md` et les rules, le MCP, les hooks, et une structure de pages (layout, routing).
- [ ] Un prompt d'install à copier sur la home et dans le guide : l'agent installe et configure tout, dans un projet vide ou existant.
- À trancher :
  - un nouveau package publié (`create-maz-ui`, à ajouter à un groupe de `relizy.config.ts` et à `tools/agent-docs/src/packages.ts`) ;
  - ou une commande de `@maz-ui/mcp` (`npx @maz-ui/mcp create`), sans nouveau package à garder en phase.

## 6. Distribution

- [ ] Publier le skill sur le registre `npx skills`, pour couvrir Cursor et les autres agents.
- [ ] Des boutons « Copy prompt » et « Open as Markdown » sur chaque page de doc (le `.md` par page existe déjà sur maz-ui.com).
- [ ] Une galerie de prompts testés, chacun relié à une tâche des evals.
- Plus tard : lire les tokens d'une maquette (Figma) pour en faire un preset, une fois `generate_preset` en place.

## 7. Le message

Le titre actuel de la home met « AI tooling » en dernier, comme un bonus.

- [ ] Un nouveau hero, du genre « The Vue & Nuxt library your agent already knows », avec le prompt d'install à copier.
- [ ] Les chiffres des evals, et une démo sur un projet existant autant que sur un projet vide.
- [ ] Revoir le README, la description des packages et les mots-clés dans le même sens.

## Ordre proposé

1. Evals : la première série, puis les tâches « projet existant » et « thème ».
2. CSS des composants dans des layers : un POC, puis une version mineure.
3. `generate_preset`, `check_project` et le prompt `adopt` ; l'option d'installation dans `init`.
4. Le rôle de `maz-ui-editor` et la délégation.
5. Les composants de structure, puis les blocks et les pages d'exemple.
6. Le pont vue-i18n et `@nuxtjs/i18n`, le RTL, la densité et les tokens par composant.
7. Le starter, `npx skills`, puis la nouvelle home avec les chiffres.

## Points de vigilance

- La maintenance : les plugins, OpenCode, les agent-docs et les rules sont déjà à garder en phase. Les blocks, le starter et les nouveaux outils en ajoutent.
- Les layers changent la priorité du CSS pour tous les utilisateurs : à annoncer clairement dans le changelog et la doc.
- Le coût des evals : environ 0,25 $ pour une petite tâche, bien plus pour une app entière. Jamais en CI.

## Trouvé en chemin

Sans `skipLibCheck`, les types publiés de maz-ui ne passent pas `vue-tsc` :

```txt
dist/components/MazInputPhoneNumber.vue.d.mts(420,44): error TS2344: Type 'GlobalComponents' does not satisfy the constraint 'Record<string, Component<...>>'.
```

Un projet en TypeScript strict qui désactive `skipLibCheck` voit cette erreur venir de la lib. L'app des evals active `skipLibCheck`, comme les templates `create-vite` et `create-vue`.
