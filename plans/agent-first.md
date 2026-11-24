# Maz-UI agent-first

## Positionnement

Faire de maz-ui la lib Vue et Nuxt avec laquelle un agent (Claude Code, Codex, OpenCode, Cursor...) monte un projet complet en un prompt : il démarre le projet, assemble les pages avec les composants maz-ui, vérifie que ça tourne, sans réécrire ce que la lib fournit.

Le travail de base est fait (branche `develop`) : le MCP (recherche par besoin, API des composants, icônes, tokens du thème, review), `npx @maz-ui/mcp init` (rules, `AGENTS.md`, config des agents), les plugins Claude Code, Codex et OpenCode (skill, hooks de review, subagent), des docs qui suivent la version installée, et les evals (`tools/agent-evals`).

Ce qui manque : un point d'entrée qui part de zéro, des pages entières prêtes à assembler, une boucle de vérification, et des chiffres qui prouvent tout ça.

### Vercel UI SDK

Vercel Labs a sorti UI SDK le 13 novembre 2026 ([ui-sdk.dev](https://ui-sdk.dev)) :

- Ce n'est pas une lib de composants : c'est plus de 50 « behaviors » headless (popup, typeahead, roving focus, virtualizer...), et l'agent les assemble lui-même en composants.
- Côté agent :
  - un skill (`npx skills add vercel-labs/ui`) ;
  - des docs dans `node_modules` (`llms.txt`, `.md` par sujet) ;
  - des boutons « Copy Prompt » et « Open as Markdown » sur chaque page ;
  - un Agent Bridge (`agent.snapshot()`, `agent.act()`) pour qu'un agent pilote l'UI sans screenshots.
- Leur marketing repose sur un benchmark publié et reproductible : 59 % de tool calls en moins et 68 % moins cher en React (44 à 53 % en Vue et Svelte). C'est une seule tâche, un seul modèle et 3 runs.
- Ce qu'ils n'ont pas : de CLI, de templates, d'apps d'exemple, de galerie de prompts, de review du code de l'agent.

Notre avantage est là : le MCP, la review après chaque edit et des evals qui comparent `baseline`, `init` et `plugin`. Notre message : la qualité du code produit (l'agent réutilise maz-ui, sans erreur, sans dépendance en trop), pas seulement l'efficacité.

## Décisions

- On ne fait pas d'Agent Bridge (un agent qui pilote l'UI au runtime) : c'est un autre problème, encore de niche, et cher à maintenir sur plus de 60 composants.
- On prouve avant de communiquer : les chiffres des evals d'abord, la nouvelle home ensuite.
- Tout ce qui s'ajoute (blocks, starter, prompts) est généré ou testé par les evals dès le départ, sinon ça pourrit.
- On garde un discours « agent-first, human-proof » : les utilisateurs humains restent la base.

## 1. Les evals, la preuve

Les evals mesurent si Claude Code réutilise maz-ui, seul (`baseline`), avec `init` et avec le plugin.

- [x] Mesurer, par run :
  - les tool calls ;
  - les tokens (tous les modèles, cache compris) ;
  - les lignes ajoutées ;
  - les dépendances ajoutées ;
  - le typecheck (`vue-tsc`) et le build (`vite build`).
  Le rapport sépare la qualité et l'effort.
- [ ] Lancer une première série (quelques tâches, 3 runs par condition) pour avoir une base. Il n'y a aucun résultat gardé aujourd'hui.
- [ ] Ajouter des tâches « app entière » : un admin de projets (auth, table, formulaires, toasts), une landing, une page de settings complète, un checkout. Les prompts ne nomment pas maz-ui, comme les tâches actuelles.
- [ ] Un smoke test Playwright pour ces tâches : l'app démarre, chaque page s'affiche sans erreur dans la console, et on garde un screenshot dans les résultats.
- [ ] Plusieurs modèles (Sonnet, Opus) et Codex, pour la crédibilité multi-agents.
- [ ] Publier les chiffres : un tableau `baseline` / `init` / `plugin` sur la home et dans `/guide/ai-agents` (taux de réussite, tokens, coût, lignes), avec la commande pour les reproduire.
- Plus tard : une comparaison avec d'autres libs Vue (Nuxt UI, PrimeVue). Plus percutante, mais dure à rendre équitable.

## 2. Démarrer de zéro

Aujourd'hui, tout suppose un projet existant (le prompt `setup` du MCP, `init`).

- [ ] Un starter `npm create maz-ui` (Vue ou Nuxt) qui livre un projet prêt pour les agents : le thème, les traductions, Tailwind, `AGENTS.md` et les rules, le MCP, les hooks, et une structure de pages (layout, routing).
- [ ] Un prompt d'install à copier sur la home et dans le guide. L'agent installe et configure tout dans un projet vide ou existant, sans le starter.
- À trancher :
  - un nouveau package publié (`create-maz-ui`, à ajouter à un groupe de `relizy.config.ts` et à `tools/agent-docs/src/packages.ts`) ;
  - ou une commande de `@maz-ui/mcp` (`npx @maz-ui/mcp create`), sans nouveau package à garder en phase.

## 3. Blocks et recettes de pages

C'est le plus gros manque. Un agent bien outillé assemble correctement des composants, mais une app entière sort générique ou incohérente.

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
- [ ] Un prompt `scaffold-app` dans le MCP : découper le projet en pages, choisir les blocks, les assembler, vérifier.
- [ ] Les montrer dans la doc (rendu, code, prompt à copier).
- [ ] Chaque block passe `review_code`, le typecheck et le build en CI.
- Repérer en chemin les composants qui manquent pour des apps entières (layout, navigation...) et les ajouter à `ROADMAP.md`.

## 4. La boucle de vérification

La review est statique : elle dit si le code utilise bien maz-ui, pas si le projet tourne.

- [ ] `npx @maz-ui/mcp check` : typecheck et build du projet, avec les erreurs dans un format lisible par l'agent.
- [ ] L'appeler dans le hook Stop des plugins et de `init`, après la review, et l'exposer en outil MCP.
- [ ] Mettre à jour les plugins (`plugins/maz-ui` : README, hooks, `plugin.json`, `marketplace.json`) et le plugin OpenCode.

## 5. Distribution

- [ ] Publier le skill sur le registre `npx skills`, pour couvrir Cursor et les autres agents.
- [ ] Des boutons « Copy prompt » et « Open as Markdown » sur chaque page de doc (le `.md` par page existe déjà sur maz-ui.com).
- [ ] Une galerie de prompts testés, chacun relié à une tâche des evals.

## 6. Le message

Le titre actuel de la home met « AI tooling » en dernier, comme un bonus.

- [ ] Un nouveau hero, du genre « The Vue & Nuxt library your agent already knows », avec le prompt d'install à copier.
- [ ] Les chiffres des evals et une démo « un prompt → une app ».
- [ ] Revoir le README, la description des packages et les mots-clés dans le même sens.

## Ordre proposé

1. Evals : première série, puis les tâches « app entière » et le smoke test.
2. Blocks, `get_block` et le prompt `scaffold-app` : ce qui fait le rendu « pro » en un prompt.
3. Starter et prompt d'install.
4. `check` dans les hooks.
5. Distribution, puis la nouvelle home avec les chiffres.

## Points de vigilance

- La maintenance : les plugins, OpenCode, les agent-docs et les rules sont déjà à garder en phase. Les blocks et le starter en ajoutent deux.
- Le coût des evals : environ 0,25 $ pour une petite tâche, bien plus pour une app entière. Jamais en CI.

## Trouvé en chemin

Sans `skipLibCheck`, les types publiés de maz-ui ne passent pas `vue-tsc` :

```txt
dist/components/MazInputPhoneNumber.vue.d.mts(420,44): error TS2344: Type 'GlobalComponents' does not satisfy the constraint 'Record<string, Component<...>>'.
```

Un projet en TypeScript strict qui désactive `skipLibCheck` voit cette erreur venir de la lib. L'app des evals active `skipLibCheck`, comme les templates `create-vite` et `create-vue`.
