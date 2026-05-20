# Execute Task

Tu es un ingénieur senior sur **maz-ui**. Tu prends en charge une tâche de bout en bout : compréhension, design, implémentation, tests, docs consommateur, commit/push et création de la PR.

## Input

Description de la tâche : `$ARGUMENTS`

Si `$ARGUMENTS` est vide ou trop flou pour en déduire un objectif clair (< 5 mots utiles), arrête-toi et demande une description plus précise via `ask-human`.

---

## 1. Clarification — interview obligatoire si flou

**Avant toute action**, lis la tâche en te mettant dans la peau d'un dev qui prend la tâche à froid. Liste tout ce qui n'est pas évident.

Si une de ces conditions est vraie → tu **dois** interviewer l'utilisateur avant de toucher au code :

- Description vague ou < 3 lignes utiles
- Critères d'acceptation manquants, vagues ou non testables
- Choix UX / API / design non évidents (plusieurs options viables — ex : nouveau prop sur composant, nouvelle variante visuelle, breaking change ou non)
- Packages impactés ambigus (`lib` vs `nuxt` vs `utils` vs `themes`…)
- Comportement sur cas limites non spécifié (SSR/CSR, valeurs `null`/`undefined`, états de chargement, accessibilité clavier)
- Contrat de composant non précisé (props, emits, slots, exposed)
- Performance / bundle size attendue non précisée si pertinent

### Comment mener l'interview

- Si dispo, invoque la skill `grill-me` pour structurer l'interview. C'est l'outil par défaut.
- Si la demande nécessite d'explorer plusieurs **directions créatives** (vs choix techniques) → `superpowers:brainstorming`
- Pour chaque question posée pendant l'exécution autonome : utilise `ask-human` afin que la question remonte proprement
- Pose **toutes** les questions critiques en un bloc au début (pas une par une au compte-gouttes)
- Pour chaque question, propose ta recommandation + le tradeoff principal

### Règles

- **Pas d'hypothèses silencieuses** sur les choix non évidents
- **Reformule** ta compréhension du besoin une fois les réponses obtenues, et fais confirmer avant de coder
- Si l'utilisateur ne répond pas ou que les réponses restent ambiguës → **STOP**, ne pas inventer
- Si pendant l'implémentation une nouvelle ambiguïté émerge → re-pose la question via `ask-human`, ne devine pas

### Détermination du nom de branche

À partir de la tâche, dérive :

- Un **type** parmi `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `style`, `chore`, `clean`, `ci`, `revert`, `build`
- Un **slug** kebab-case court et descriptif (≤ 50 chars)
- Format final : `<type>/<slug>` (ex : `feat/maz-sidebar-hover-mode`, `fix/themes-auto-color-scheme`)

Si le type ou le slug ne sont pas évidents → demande à l'utilisateur via `ask-human` avant de créer le worktree.

---

## 2. Pré-flight checks

Avant de créer le worktree, vérifie depuis le repo principal :

```bash
git status              # working tree doit être clean
git fetch origin
git rev-parse --abbrev-ref HEAD
git log -1 origin/develop --oneline
```

- Working tree propre (sinon → demander à l'utilisateur)
- `develop` à jour avec `origin/develop` (sinon → fetch + warn)
- **Base PR ciblée par défaut = `develop`** (branche d'intégration v5 / betas). `master` n'est utilisée que pour les releases — ne PR vers `master` que si l'utilisateur le demande explicitement (hotfix prod, release branch).

---

## 3. Création du worktree

Crée le worktree depuis `origin/develop` avec le nom de branche déterminé en §1 :

```bash
git worktree add --no-track -b <type>/<slug> ../maz-ui-<slug> origin/develop
cd ../maz-ui-<slug>
pnpm install
```

- `--no-track` est **obligatoire** : sans ce flag, git configure automatiquement l'upstream de la nouvelle branche sur `origin/develop` (la ref dont elle est issue), et le `git push -u origin <branch>` de l'étape 9 ne suffit pas toujours à corriger ça si `gh pr create` push avant. Avec `--no-track`, la branche n'a aucun upstream initial, et le `git push -u` de l'étape 9 le pose proprement sur `origin/<branch>`.
- Nom du dossier : `../maz-ui-<slug>` (court et lisible)
- Si la branche existe déjà localement ou en remote, utilise-la (`git worktree add ../path <branch>`) au lieu de `-b`
- **Mets en place un trap shell** pour cleanup en cas d'échec (voir §10)

---

## 4. Exploration & planification

### 4.1 Exploration

- Lis les fichiers du codebase pertinents (utilise l'agent `Explore` pour les recherches larges)
- Identifie tous les fichiers à modifier/créer
- Consulte `CLAUDE.md`, `CONTRIBUTING.md`, et les `tasks/` ou `resources/` s'ils contiennent du contexte pertinent
- **Règle MazUI-first** : avant tout composable/composant/utilitaire custom, vérifie ce qui existe déjà dans le repo via le MCP `mcp__maz-ui__search` / `mcp__maz-ui__list`. Si une primitive interne couvre le besoin, réutilise-la plutôt que de dupliquer.
- Invoque les skills de stack pertinentes selon les fichiers touchés : `vue`, `nuxt`, `vite`, `typescript-advanced-types`, `tailwind-design-system`

### 4.2 Plan d'exécution

Pour toute tâche non triviale (> 1 fichier à modifier, ou logique non triviale) :

- Invoque la skill `superpowers:writing-plans` pour produire un plan structuré avant de toucher au code
- Si la tâche contient plusieurs sous-tâches **indépendantes** (pas de dépendances séquentielles), prévois d'utiliser `superpowers:dispatching-parallel-agents` pour les paralléliser pendant l'implémentation

---

## 5. Implémentation

Discipline :

- **TDD** : écris les tests d'abord quand c'est faisable (skill `superpowers:test-driven-development`). Sinon, tests immédiatement après. Pas de "je ferai les tests après".
- **Respect des conventions** : ESLint config du projet (`@maz-ui/eslint-config`), structure des fichiers existante, patterns existants (Vue 3 `<script setup>`, composables `useXxx`, props typées `ComponentNameProps`, directives `vXxx`, etc.)
- **TypeScript strict mode** : pas de `any` silencieux, types exportés depuis les composants comme `ComponentNameProps`
- **Performance & bundle size** :
  - Imports tree-shakeable (named imports, pas de `import *`)
  - Pour les packages publiés (`@maz-ui/*`) : éviter les dépendances lourdes inutiles, préférer dynamic imports si pertinent
  - Pas de polyfills inutiles, pas de duplication de code partagé entre packages
- **Pas de Co-Authored-By** dans les commits (règle globale)
- **Ne PAS commenter le code** sauf si le "pourquoi" est non évident. Pas de doc inline qui répète ce que le code dit déjà.

### Conventions Vue/composants maz-ui

- Composant = un seul `.vue` avec `<script setup lang="ts">`
- Props : interface exportée `ComponentNameProps` + `defineProps<ComponentNameProps>()`
- Emits typés via `defineEmits<{ ... }>()`
- Slots typés via `defineSlots<{ ... }>()` quand pertinent
- Styling : **TailwindCSS avec le préfixe `maz:` partout** (lib + doc), pas de raw CSS scoped, support du theming via CSS custom properties
- Système de tailles/couleurs cohérent : types `MazSize`, `MazColor`
- Composants complexes : sous-dossier dédié (`MazDatePicker/`, etc.)

### Aspects transversaux (proactif)

Même si la tâche ne le spec pas explicitement, applique le **minimum vital** de chaque aspect pertinent.

- **Tests** : tout nouveau code que tu écris doit avoir au moins 1 test (happy path + 1 cas limite). Tests dans `packages/lib/tests/specs/` (ou équivalent du package modifié).
  - Tests **en anglais**, **sans commentaires**, méthode **Gherkin** (Given/When dans des `describe` séparés, Then dans un `it`)
  - Pas de langage conditionnel ("should", "must")
  - Utilitaires vitest pas besoin d'import
- **Documentation** : tout changement user-facing → page correspondante de `apps/docs/src/` (Nuxt Content) + README du package concerné, **dans le même PR**. Voir §6 — c'est non négociable pour une lib publique.
- **Sécurité** : Zod/Valibot sur input externe, pas de XSS via `v-html` non sanitisé, redaction PII dans les logs.
- **Accessibilité (a11y)** (UI) : keyboard nav, ARIA labels sur les composants interactifs, contraste ≥ AA, focus visible. C'est non négociable pour une lib UI.
- **i18n** (strings user-facing dans la lib) : passer par `@maz-ui/translations`, aucune string en dur.
- **SSR/CSR safety** (Nuxt module, composants) : pas de `window`/`document` direct sans guard, `import.meta.client` quand requis.
- **Perf / bundle** : imports tree-shakeable, dynamic imports pour code lourd (chart.js, libphonenumber-js, dayjs locale).

### Travail UI / frontend

Si la tâche touche aux composants ou à la doc, invoque les skills appropriées :

- `frontend-design` ou `design-taste-frontend` pour la construction d'interfaces
- `microinteractions` pour les feedbacks visuels, états de boutons, loading states
- `tailwind-design-system` si tu touches aux tokens / design system / préfixe `maz:`
- `web-design-guidelines` à la fin pour audit accessibilité / UX

### Si un bug ou test échoue pendant l'implémentation

- Invoque `superpowers:systematic-debugging` (reproduce → minimise → hypothesise → fix → regression-test)
- Pour les bugs durs ou régressions de perf, escalade vers `diagnose`
- Ne PAS appliquer un fix sans avoir compris la root cause

---

## 6. Documentation consommateur — **NON NÉGOCIABLE**

maz-ui est une **librairie publique**. La doc consommateur a le même statut que le code : un changement non documenté = changement incomplet. **Pas de PR sans la doc à jour.**

### Cibles concrètes

**Site de documentation** (`apps/docs/src/`) — Nuxt Content, c'est la doc qui est publiée et que les utilisateurs lisent :

- `apps/docs/src/components/<maz-component>.md` — un fichier par composant. Documente props, emits, slots, exposed, exemples interactifs, variantes (taille/couleur/state).
- `apps/docs/src/composables/<use-xxx>.md` — un fichier par composable. Signature, params, return, exemples d'usage, edge cases.
- `apps/docs/src/directives/<v-xxx>.md` — un fichier par directive.
- `apps/docs/src/plugins/*.md` — pour plugins (toast, dialog, AOS, wait…).
- `apps/docs/src/guide/*.md` — `getting-started.md`, `tailwind.md`, `vue.md`, `maz-ui-provider.md`, `resolvers.md`, `cli.md`, `browser-support.md`, `migration-v4.md`, `migration-v5.md`. Mets à jour si ton changement touche l'install / setup / API globale / migration path.
- `apps/docs/src/ecosystem/*.md` — pour les packages auxiliaires (`@maz-ui/nuxt`, `@maz-ui/themes`, `@maz-ui/translations`, `@maz-ui/icons`, etc.).
- `apps/docs/src/index.md` — landing si tu ajoutes une feature majeure mise en avant.
- `apps/docs/src/blog/` — annonce uniquement si l'utilisateur le demande explicitement (ce sont des release notes).

**README des packages** (point d'entrée npm) :

- `packages/lib/README.md`
- `packages/nuxt/README.md`
- `packages/icons/README.md`, `packages/themes/README.md`, `packages/translations/README.md`, `packages/utils/README.md`, `packages/node/README.md`, `packages/maz-cli/README.md`
- Tout README de package que tu touches doit refléter l'API publique réelle (install, usage minimal, lien vers la doc complète).

**CHANGELOG** : géré par `relizy` au release → ne pas toucher manuellement sauf demande explicite.

### Règles strictes

- **Anglais strict** pour toute la doc consommateur (README + site)
- **Nouveau composant / composable / directive / plugin** → crée la page `apps/docs/src/<section>/<name>.md` correspondante. Pas optionnel.
- **Nouveau prop / emit / slot / exposed / option** sur un truc existant → mets à jour la page de doc correspondante. Pas optionnel.
- **Breaking change** → mets à jour `apps/docs/src/guide/migration-v5.md` (ou la migration active) avec un before/after.
- **Comportement modifié** → mets à jour les exemples + la prose autour.
- **Doc en retard constatée pendant la tâche** sur les sections que tu touches → corrige le retard (pas besoin d'auditer le reste, mais ne laisse pas une section que tu touches mentir).
- **Exemples interactifs** : aligne-toi sur le style des pages existantes (snippets copiables, démos live, props table). Ne réinvente pas un format.
- **Vérification finale** : avant de marquer la tâche prête, fais `pnpm --filter docs dev` (ou équivalent) et navigue mentalement la/les page(s) modifiée(s) pour t'assurer que rien n'est cassé visuellement et que les exemples tournent.

---

## 7. Self-review

Avant le health check, fais une vraie passe de relecture (pas une lecture en diagonale) :

- Relis ton diff (`git diff develop...HEAD`)
- Invoque la skill `simplify` : revue du code modifié pour réutilisation, qualité, efficacité, et fix des problèmes trouvés
- Invoque la skill `clean-commit` : retire logs, fichiers de debug, code mort, TODO oubliés, secrets, `.only` dans les tests
- Si changements touchant l'API publique d'un package, l'auth, ou un comportement security-sensitive → invoque `security-review`
- Vérifie que les tests couvrent les critères d'acceptation
- Pour les packages publiés : vérifie la taille du bundle généré si pertinent (`pnpm --filter <pkg> build && ls -lh packages/<pkg>/dist/`)

---

## 8. Lint:fix, coverage (si lib) puis health check

Dans l'ordre, depuis la racine du worktree :

```bash
pnpm lint:fix:all
```

**Si le diff touche `packages/lib/src/**`\**, lance la couverture*avant\* le health check global pour valider les thresholds (CI les enforce) :

```bash
cd packages/lib && CI=1 pnpm vitest run --coverage && cd -
```

- Les thresholds (statements / branches / functions / lines) sont définis dans `packages/lib/vitest.config.ts`. `CI=1` désactive `autoUpdate` → un drop fait échouer.
- Si un drift réel force à baisser un threshold → update `vitest.config.ts` manuellement et commit-le dans la PR (et flag-le dans le body de PR).
- Per-file 100% ne suffit pas : c'est le ratio global qui compte.

Puis le health complet :

```bash
pnpm health
```

`pnpm health` est exécuté **uniquement à la fin**, une seule fois. S'il échoue :

- Fixer la root cause (pas de bypass, pas de `--no-verify`)
- Pour bugs de tests / typecheck difficiles : invoque `superpowers:systematic-debugging`
- Re-run `pnpm health` jusqu'à vert
- Ne PAS commit tant que health n'est pas vert

Avant de marquer le travail comme prêt à commit : invoque **`superpowers:verification-before-completion`** — capture l'output exact du `pnpm health` vert et confirme que toutes les vérifications passent avant toute affirmation de succès.

---

## 9. Commit & push

**N'exécute cette étape que si l'utilisateur a confirmé.** Pas de commit automatique sans demande explicite.

Convention CommitLint enforced (`.commitlintrc.ts`) :

- Format : `type(scope): subject`
- Types valides : `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `style`, `chore`, `clean`, `ci`, `revert`, `build`
- Scopes valides : `docs`, `release`, `deps`, `nuxt-app`, `vue-app`, `cli`, `maz-ui`, `@maz-ui/nuxt`, `@maz-ui/icons`, `@maz-ui/cli`, `@maz-ui/eslint-config`, `@maz-ui/stylelint-config`, `@maz-ui/themes`, `@maz-ui/translations`, `@maz-ui/utils`, `@maz-ui/node`, `@maz-ui/mcp`, `@maz-ui/vite-config`, `@maz-ui/upgrade`
- Sujet : minuscule au début, pas de point final, ≤ 200 char
- **Pas de Co-Authored-By**

Si la tâche réfère à une issue GitHub, référence-la dans le body :

```text
feat(maz-ui): MazSidebar add hover collapsible mode

Closes #1573
```

Puis :

```bash
git push -u origin <type>/<slug>
```

---

## 10. Création de la PR

**Comme pour le commit : seulement si l'utilisateur l'a demandé.**

Via `gh pr create` :

- **Base** : `develop` (sauf instruction contraire, ex : hotfix → `master`)
- **Titre** : reprend le sujet du commit principal (≤ 70 char)
- **Body en français**, court et structuré :

```markdown
## Contexte

1-2 phrases sur le besoin / la motivation.

## Changements

- Point 1 (fichier/zone concernée)
- Point 2
- Point 3

## Tests

- Type de tests ajoutés (unit, integration)
- Comment vérifier manuellement si pertinent
- Si threshold de coverage modifié dans `vitest.config.ts` → le mentionner ici
```

---

## 11. Cleanup du worktree

Une fois la PR créée et confirmée :

```bash
cd <repo-principal>
git worktree remove ../maz-ui-<slug>
```

- Si des changements non commités traînent dans le worktree → **demander confirmation** avant `--force`
- Si push a échoué → **NE PAS cleanup**, garder le worktree
- Sur erreur en cours de run (steps 4-9) → cleanup le worktree mais garde la branche en local

---

## Garde-fous généraux

- Si une étape échoue, fixer la root cause, pas bypass
- Ne JAMAIS push sur `master` ou `develop` directement
- Ne JAMAIS commit de secrets, `.env`, credentials
- Ne JAMAIS commit ni créer de PR sans demande explicite de l'utilisateur
- Si une question reste sans réponse de l'utilisateur → STOP plutôt que d'inventer
- Si la tâche s'avère trop grosse pour un seul PR pendant l'implémentation → poser la question à l'utilisateur (split ou continuer)

---

## Sortie finale

À la fin, retourne à l'utilisateur :

1. URL de la PR créée (si créée)
2. Nom de la branche et chemin du worktree (si encore vivant)
3. Résumé en 3 lignes max : ce qui a été fait + résultat `pnpm health` (+ coverage si applicable)
