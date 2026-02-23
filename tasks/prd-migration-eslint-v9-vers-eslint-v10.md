# PRD: Migration ESLint v9 vers ESLint v10

## Overview

Migrer le monorepo maz-ui d'ESLint v9 vers ESLint v10, principalement dans le package `@maz-ui/eslint-config`. ESLint 10 apporte des breaking changes (Node.js >=20.19.0, 3 nouvelles règles recommended, suppression des méthodes dépréciées du context, suppression du format `.eslintrc`, etc.). Le projet est déjà en flat config, ce qui simplifie la migration.

## Goals

- Mettre à jour ESLint vers v10 dans tout le monorepo
- Mettre à jour `@antfu/eslint-config` vers la dernière version compatible avec ESLint 10
- Vérifier et mettre à jour la compatibilité de tous les plugins ESLint
- Activer et fixer les 3 nouvelles règles recommended (`no-unassigned-vars`, `no-useless-assignment`, `preserve-caught-error`)
- Mettre à jour le minimum Node.js dans `@maz-ui/eslint-config`
- S'assurer que le lint fonctionne sur tous les types de fichiers (vue, ts, js, json, md, yaml)

## Quality Gates

Ces commandes doivent passer pour chaque user story :

- `pnpm typecheck:all` - Vérification des types
- `pnpm lint:fix:all` - Lint avec auto-fix

## User Stories

### US-001: Mettre à jour les dépendances ESLint et plugins

As a developer, I want to upgrade ESLint to v10 and all related plugins to compatible versions so that the tooling is up to date.

**Acceptance Criteria:**

- [ ] `eslint` en devDependencies de `packages/eslint-config/package.json` est mis à jour vers `^10.0.1`
- [ ] La peerDependency `eslint` dans `packages/eslint-config/package.json` est mise à jour vers `">=9.0.0"` (ou `">=9.0.0 <11.0.0"`)
- [ ] `@antfu/eslint-config` est mis à jour vers la dernière version compatible avec ESLint 10
- [ ] `eslint-plugin-sonarjs` est vérifié et mis à jour si nécessaire pour la compatibilité ESLint 10
- [ ] `eslint-plugin-format` est vérifié et mis à jour si nécessaire
- [ ] `eslint-plugin-vuejs-accessibility` est vérifié et mis à jour si nécessaire
- [ ] `eslint-plugin-tailwindcss` est vérifié et mis à jour si nécessaire (noter dans un commentaire si ses peerDeps ne supportent pas encore ESLint 10)
- [ ] `jiti` est en version >=2.2.0 (requis pour les configs TypeScript)
- [ ] `pnpm install` s'exécute sans erreur après les mises à jour

### US-002: Mettre à jour la contrainte Node.js

As a developer, I want the eslint-config package to require Node.js >=20.19.0 so that it matches ESLint 10's requirements.

**Acceptance Criteria:**

- [ ] Le champ `engines.node` dans `packages/eslint-config/package.json` est mis à jour vers `">=20.19.0"`
- [ ] Le champ `engines.node` n'est PAS modifié dans les autres packages du monorepo (seul eslint-config change)

### US-003: Fixer les violations des nouvelles règles recommended

As a developer, I want the 3 new recommended rules to be enabled and all violations fixed so that the codebase follows ESLint 10 best practices.

**Acceptance Criteria:**

- [ ] La règle `no-unassigned-vars` est active et toutes les violations sont fixées dans le monorepo
- [ ] La règle `no-useless-assignment` est active et toutes les violations sont fixées dans le monorepo
- [ ] La règle `preserve-caught-error` est active et toutes les violations sont fixées dans le monorepo
- [ ] Les fixes ne changent pas le comportement fonctionnel du code
- [ ] Aucune règle n'est désactivée ou passée en `warn`

### US-004: Nettoyer les usages dépréciés dans la config ESLint

As a developer, I want to remove any deprecated patterns so that the config is fully compatible with ESLint 10.

**Acceptance Criteria:**

- [ ] Aucun commentaire `/* eslint-env ... */` n'existe dans le code source (ces commentaires provoquent des erreurs en v10)
- [ ] Le feature flag `v10_config_lookup_from_file` n'est utilisé nulle part (CLI, env vars, API)
- [ ] Si des plugins utilisent des méthodes dépréciées (`context.getCwd()`, `context.getFilename()`, etc.), vérifier que les versions mises à jour sont compatibles
- [ ] Aucun fichier `.eslintrc*` n'existe (déjà vérifié : aucun trouvé)

### US-005: Vérifier le lint sur tous les types de fichiers

As a developer, I want to verify that linting works correctly on all file types so that the migration doesn't break any existing linting capability.

**Acceptance Criteria:**

- [ ] `pnpm lint:fix:all` s'exécute sans erreur sur l'ensemble du monorepo
- [ ] Les fichiers `.vue` sont correctement lintés (tester dans `packages/lib/`)
- [ ] Les fichiers `.ts` sont correctement lintés
- [ ] Les fichiers `.js`/`.mjs` sont correctement lintés
- [ ] Les fichiers `.json` sont correctement lintés
- [ ] Les fichiers `.md` sont correctement lintés (tester dans `apps/docs/`)
- [ ] Les fichiers `.yaml`/`.yml` sont correctement lintés
- [ ] Provoquer volontairement des erreurs de lint dans chaque type de fichier pour vérifier que les erreurs remontent bien
- [ ] Les règles SonarJS fonctionnent correctement
- [ ] Les règles Tailwind CSS fonctionnent correctement (dans `packages/lib/` et `apps/docs/`)
- [ ] Les règles d'accessibilité Vue fonctionnent correctement (dans `packages/lib/`)

### US-006: Vérifier la compatibilité avec eslint-plugin-tailwindcss

As a developer, I want to document the state of eslint-plugin-tailwindcss compatibility with ESLint 10 so that future updates are tracked.

**Acceptance Criteria:**

- [ ] La version actuelle de `eslint-plugin-tailwindcss` (^3.18.2) est testée avec ESLint 10
- [ ] Si les peerDeps du plugin ne supportent pas encore ESLint 10, un commentaire est ajouté dans `packages/eslint-config/package.json` ou un issue/TODO est créé
- [ ] Si le plugin est incompatible, une solution de contournement est documentée (ex: `overrides` de peerDeps dans pnpm)
- [ ] Le lint Tailwind fonctionne toujours dans `packages/lib/` et `apps/docs/`

## Functional Requirements

- FR-1: ESLint 10 doit être installable et fonctionnel dans tout le monorepo
- FR-2: Toutes les 15 configurations `eslint.config.ts` du monorepo doivent fonctionner avec ESLint 10
- FR-3: `@antfu/eslint-config` doit être compatible avec ESLint 10
- FR-4: Les 3 nouvelles règles recommended doivent être actives et sans violations
- FR-5: La commande `pnpm lint:fix:all` doit passer sans erreur
- FR-6: La commande `pnpm typecheck:all` doit passer sans erreur
- FR-7: Le format des configs TypeScript (`.ts`) doit fonctionner avec jiti >=2.2.0

## Non-Goals

- Migrer vers un autre outil de lint (oxlint, biome)
- Modifier les règles ESLint existantes (au-delà des 3 nouvelles)
- Mettre à jour Node.js engines dans les packages autres que `@maz-ui/eslint-config`
- Ajouter de nouveaux plugins ESLint
- Réécrire la configuration ESLint

## Technical Considerations

- Le projet utilise déjà le flat config format (`eslint.config.ts`), pas de migration `.eslintrc` nécessaire
- `@antfu/eslint-config` v7.4.3 encapsule beaucoup de la configuration ; sa mise à jour pourrait entraîner des changements en cascade
- 15 fichiers `eslint.config.ts` existent dans le monorepo, tous doivent être validés
- `eslint-plugin-tailwindcss` pourrait avoir un retard dans le support des peerDeps ESLint 10 ; surveiller les releases
- Les configs utilisent `cross-env NODE_ENV=production eslint` dans les scripts de lint
- Le changement de lookup de config (depuis le fichier linté au lieu du cwd) pourrait affecter le comportement dans le monorepo

## Success Metrics

- `pnpm typecheck:all` passe sans erreur
- `pnpm lint:fix:all` passe sans erreur
- Aucune règle recommended n'est désactivée
- Tous les types de fichiers (vue, ts, js, json, md, yaml) sont correctement lintés
- Aucune régression dans la détection d'erreurs de lint

## Open Questions

- Quelle est la dernière version de `@antfu/eslint-config` compatible avec ESLint 10 ? (à vérifier au moment de l'implémentation)
- `eslint-plugin-tailwindcss` v3.18.2 supporte-t-il ESLint 10 dans ses peerDeps ? (à vérifier)
- Le changement de config lookup (depuis le fichier au lieu du cwd) a-t-il un impact dans la structure monorepo de maz-ui ?
