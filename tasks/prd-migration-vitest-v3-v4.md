# PRD: Migration Vitest v3 → v4

## Overview

Migrer l'ensemble du monorepo Maz UI de Vitest v3 à Vitest v4.0.18 (ainsi que `@vitest/coverage-v8` 4.0.18). Cette migration touche les 5 packages disposant d'une configuration Vitest : `lib`, `utils`, `themes`, `translations`, et `mcp`. Elle implique la mise à jour des dépendances, l'adaptation des fichiers `vitest.config.ts` aux breaking changes de v4, la régénération des snapshots et la correction des éventuelles régressions.

## Goals

- Mettre à jour `vitest` et `@vitest/coverage-v8` à la version 4.0.18 dans tous les packages concernés
- Adapter les fichiers `vitest.config.ts` aux breaking changes de Vitest v4
- Ajouter `coverage.include` dans tous les packages ayant une config de couverture pour garantir la cohérence des rapports Codecov
- Ajouter les patterns d'exclusion explicites là où les anciens defaults de v3 sont nécessaires
- Régénérer tous les snapshots au nouveau format v4
- Corriger toute régression liée aux changements de `vi.mock` ou autres breaking changes
- S'assurer que tous les tests passent après la migration

## Quality Gates

Ces commandes doivent passer pour chaque user story :

- `pnpm test:unit:all` — Tests unitaires de tous les packages
- `pnpm typecheck:all` — Vérification des types
- `pnpm lint:fix:all` — Linting avec auto-fix

## User Stories

### US-001: Bump des dépendances Vitest

As a developer, I want vitest and @vitest/coverage-v8 updated to 4.0.18 across all packages so that the monorepo uses the latest major version.

**Acceptance Criteria:**

- [ ] `vitest` est mis à jour en 4.0.18 dans tous les `package.json` qui le référencent
- [ ] `@vitest/coverage-v8` est mis à jour en 4.0.18 dans tous les `package.json` qui le référencent
- [ ] Toute autre dépendance liée à vitest (ex: `@vitest/*`) est mise à jour en version compatible
- [ ] `pnpm install` s'exécute sans erreur après les mises à jour

### US-002: Mise à jour des `vitest.config.ts` — patterns d'exclusion

As a developer, I want the vitest configs to explicitly define exclude patterns so that the removal of v3 defaults (dist, cypress, .nuxt, etc.) does not cause unwanted test file discovery.

**Acceptance Criteria:**

- [ ] Chaque `vitest.config.ts` inclut explicitement les patterns d'exclusion nécessaires (`**/node_modules/**`, `**/dist/**`, `**/cypress/**`, `**/.{idea,git,cache,output,temp}/**`, `**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*`)
- [ ] Les patterns sont ajoutés uniquement là où c'est pertinent (pas de patterns inutiles)
- [ ] Aucun fichier hors-test n'est découvert par vitest

### US-003: Configuration `coverage.include` pour tous les packages

As a developer, I want coverage.include explicitly configured in all packages with coverage config so that Codecov reports are accurate and don't show inflated coverage.

**Acceptance Criteria:**

- [ ] `coverage.include` est ajouté dans la config vitest de `packages/lib`
- [ ] `coverage.include` est ajouté dans la config vitest de `packages/utils`
- [ ] `coverage.include` est ajouté dans la config vitest de `packages/themes`
- [ ] `coverage.include` est ajouté dans la config vitest de `packages/translations`
- [ ] `coverage.include` est ajouté dans la config vitest de `packages/mcp` (si couverture configurée)
- [ ] Les patterns `include` ciblent les fichiers source pertinents (ex: `src/**/*.ts`, `src/**/*.vue`)
- [ ] Les rapports de couverture reflètent uniquement le code source réel

### US-004: Régénération des snapshots

As a developer, I want all snapshots regenerated in the v4 format so that tests using snapshots pass without manual intervention.

**Acceptance Criteria:**

- [ ] Tous les fichiers de snapshot existants sont régénérés avec `vitest --update`
- [ ] Les snapshots utilisent le nouveau format v4 (sans guillemets autour des noms)
- [ ] Tous les tests utilisant des snapshots passent

### US-005: Correction des régressions liées à `vi.mock` et autres breaking changes

As a developer, I want any test failures caused by v4 breaking changes (vi.mock hoisting, globals access, etc.) fixed so that the full test suite passes.

**Acceptance Criteria:**

- [ ] Tous les usages de `vi.mock` avec factory fonctionnent correctement après migration
- [ ] Les éventuels accès à des globals dans les factories `vi.mock` sont corrigés
- [ ] Les imports de `vi` depuis `vitest` sont ajoutés là où nécessaire si `globals: true` ne suffit plus
- [ ] `pnpm test:unit:all` passe à 100% sans skip ni exclusion

## Functional Requirements

- FR-1: Les versions de `vitest` et `@vitest/coverage-v8` doivent être exactement `4.0.18` dans tous les packages concernés
- FR-2: Les fichiers `vitest.config.ts` doivent être compatibles avec l'API de Vitest v4
- FR-3: La configuration de couverture doit explicitement inclure les fichiers source via `coverage.include`
- FR-4: Les patterns d'exclusion doivent être explicites pour compenser la suppression des defaults v3
- FR-5: Les snapshots doivent être au format v4
- FR-6: La suite de tests complète doit passer après migration

## Non-Goals

- Refactoring des tests existants au-delà de ce qui est nécessaire pour la migration
- Ajout de nouveaux tests
- Migration vers d'autres outils de test
- Modification de la configuration ESLint ou TypeScript
- Mise à jour d'autres dépendances non liées à Vitest

## Technical Considerations

- Guide de migration officiel : https://vitest.dev/guide/migration.html
- En v4, `coverage.all` est supprimé — seuls les fichiers couverts sont inclus par défaut
- En v4, les defaults de `exclude` sont réduits à `node_modules` et `.git`
- En v4, les factories `vi.mock` ne sont plus hoistées automatiquement
- En v4, le format des snapshots change (suppression des guillemets autour des noms)
- Le monorepo utilise `pnpm` comme gestionnaire de packages
- Les 5 packages avec config vitest : `packages/lib`, `packages/utils`, `packages/themes`, `packages/translations`, `packages/mcp`

## Success Metrics

- `pnpm test:unit:all` passe sans erreur
- `pnpm typecheck:all` passe sans erreur
- `pnpm lint:fix:all` passe sans erreur
- Les rapports de couverture Codecov sont cohérents (pas de couverture artificiellement élevée)

## Open Questions

- Y a-t-il des plugins Vitest tiers dans le repo qui nécessitent aussi une mise à jour pour v4 ?
