# PRD: Refonte du MCP Maz-UI — Recherche Full-Text Performante

## Overview

Le serveur MCP actuel de Maz-UI (6 outils, recherche fuzzy basique caractère par caractère, pas de recherche dans le contenu) ne permet pas aux IA de trouver efficacement la bonne documentation. Cette refonte vise à repartir from scratch avec 3 outils bien définis et un moteur de recherche full-text avec index pré-construit au démarrage, scoring TF-IDF, et extraction automatique de métadonnées depuis le contenu des docs.

## Goals

- Réduire de 6 à 3 outils MCP (`search`, `get_doc`, `list`) pour que l'IA sache immédiatement quel outil utiliser
- Implémenter une recherche full-text dans le contenu markdown avec scoring TF-IDF
- Construire un index de recherche au démarrage du serveur pour des réponses instantanées
- Combiner tags manuels enrichis + métadonnées extraites automatiquement (props, events, slots, descriptions)
- Permettre le filtrage optionnel par catégorie sur la recherche et le listing
- Retourner des extraits pertinents (snippets) dans les résultats de recherche

## Quality Gates

Ces commandes doivent passer pour chaque user story :

- `pnpm typecheck` — Vérification des types (dans `packages/mcp`)
- `pnpm lint` — Linting (dans `packages/mcp`)
- `pnpm test:unit` — Tests unitaires (dans `packages/mcp`)

## User Stories

### US-001: Créer le moteur d'indexation full-text avec scoring TF-IDF

As a developer using the MCP, I want the server to build a full-text search index at startup so that searches return relevant results based on document content, not just names and tags.

**Acceptance Criteria:**

- [ ] Créer un module `SearchEngine` (fichier `src/SearchEngine.ts`) séparé de la logique serveur
- [ ] Au démarrage, lire tous les fichiers markdown et construire un index inversé (terme → liste de documents avec fréquence)
- [ ] Implémenter le scoring TF-IDF : TF (fréquence du terme dans le doc) × IDF (log(N/df) où df = nombre de docs contenant le terme)
- [ ] Tokeniser le contenu : lowercase, suppression de la ponctuation markdown, split par espaces/tirets/underscores
- [ ] Supporter les requêtes multi-mots : scorer chaque terme individuellement et combiner les scores
- [ ] Supporter la recherche par phrases exactes (entre guillemets)
- [ ] Retourner les résultats triés par score décroissant avec un extrait contextuel (snippet de ~150 caractères autour du match)
- [ ] Le temps d'indexation au démarrage ne dépasse pas 500ms pour l'ensemble des docs (~100 fichiers)
- [ ] Tests unitaires couvrant : indexation, recherche mono-mot, multi-mots, phrase exacte, scoring, snippets

### US-002: Extraire automatiquement les métadonnées depuis le contenu des docs

As a developer using the MCP, I want document metadata to be automatically extracted from markdown content so that search results are enriched without manual maintenance.

**Acceptance Criteria:**

- [ ] Créer un module `MetadataExtractor` (fichier `src/MetadataExtractor.ts`)
- [ ] Extraire depuis le frontmatter YAML : `title`, `description`
- [ ] Extraire depuis les docs générés (`.doc.md`) : noms des props, noms des slots, noms des events/emits
- [ ] Extraire depuis le contenu : titres de sections (h2, h3), premiers paragraphes de chaque section
- [ ] Stocker les métadonnées dans une structure `DocumentMetadata` : `{ name, displayName, type, description, tags, props?, slots?, events?, sections[] }`
- [ ] Conserver les tags manuels existants (aliases comme btn→button, dialog→modal) et les fusionner avec les métadonnées extraites
- [ ] Tests unitaires couvrant : extraction frontmatter, extraction props/slots/events, fusion tags manuels + extraits

### US-003: Refondre le `DocumentationService` pour alimenter l'index

As a developer using the MCP, I want the DocumentationService to provide structured document data to the search engine so that all documentation types are indexed uniformly.

**Acceptance Criteria:**

- [ ] Refactorer `DocumentationService.ts` pour retourner des objets `Document` avec `{ name, type, content, metadata }` au lieu de simples strings
- [ ] Unifier le chargement : une seule méthode `getAllDocuments()` qui retourne tous les docs de toutes les catégories
- [ ] Conserver les méthodes `getComponentDoc(name)`, `getGuideDoc(name)`, etc. pour la récupération de contenu individuel
- [ ] Intégrer le `MetadataExtractor` pour enrichir chaque document au chargement
- [ ] Gérer correctement la combinaison docs manuels + générés pour les composants (comme actuellement)
- [ ] Tests unitaires couvrant : chargement unifié, métadonnées enrichies, combinaison manual+generated

### US-004: Implémenter l'outil `search` unifié

As an AI assistant, I want a single powerful `search` tool so that I can find relevant documentation with any type of query (name, description, use case, prop name).

**Acceptance Criteria:**

- [ ] Outil `search` avec paramètres : `query` (string, required), `category` (enum optionnel: 'component', 'guide', 'composable', 'directive', 'plugin', 'helper'), `maxResults` (number, default 10)
- [ ] La recherche combine : score exact sur le nom (boost ×3), score sur les tags/aliases (boost ×2), score TF-IDF sur le contenu (×1)
- [ ] Les résultats incluent : `name`, `displayName`, `type`, `description`, `score`, `snippet` (extrait contextuel du match dans le contenu)
- [ ] Si un filtre `category` est fourni, ne retourner que les docs de cette catégorie
- [ ] La description de l'outil dans le schema MCP est claire et explicite pour guider l'IA sur quand l'utiliser
- [ ] Retourner un message explicite si aucun résultat n'est trouvé (avec suggestion de reformuler)
- [ ] Tests unitaires couvrant : recherche par nom, par description fonctionnelle, par nom de prop, avec filtre catégorie, sans résultat

### US-005: Implémenter l'outil `get_doc`

As an AI assistant, I want a `get_doc` tool to retrieve the full content of a specific documentation item so that I can provide complete information to the user.

**Acceptance Criteria:**

- [ ] Outil `get_doc` avec paramètres : `name` (string, required), `type` (enum optionnel: 'component', 'guide', 'composable', 'directive', 'plugin', 'helper')
- [ ] Résolution intelligente du nom : supporte PascalCase (`MazBtn`), kebab-case (`maz-btn`), nom court (`btn`), alias connus
- [ ] Si `type` n'est pas fourni, chercher dans toutes les catégories (auto-detect)
- [ ] Retourner le contenu markdown complet du document
- [ ] Si le document n'est pas trouvé, retourner une erreur avec les 3 suggestions les plus proches (en utilisant le `SearchEngine`)
- [ ] Tests unitaires couvrant : résolution PascalCase, kebab-case, alias, auto-detect type, document not found avec suggestions

### US-006: Implémenter l'outil `list`

As an AI assistant, I want a `list` tool to browse all available documentation so that I can discover what components and features exist.

**Acceptance Criteria:**

- [ ] Outil `list` avec paramètres : `category` (enum optionnel: 'all', 'component', 'guide', 'composable', 'directive', 'plugin', 'helper', default 'all')
- [ ] Retourner la liste groupée par catégorie avec pour chaque item : `name`, `displayName`, `description` (extraite des métadonnées)
- [ ] Inclure un compteur par catégorie (ex: "Components (56)", "Helpers (22)")
- [ ] Format de sortie clair en markdown pour une lecture facile par l'IA
- [ ] Tests unitaires couvrant : list all, list par catégorie, format de sortie

### US-007: Assembler le serveur MCP avec les 3 nouveaux outils

As a developer, I want the MCP server to be rewritten cleanly with only the 3 new tools so that the codebase is simple and maintainable.

**Acceptance Criteria:**

- [ ] Réécrire `mcp.ts` en utilisant les modules `SearchEngine`, `MetadataExtractor`, `DocumentationService` refactoré
- [ ] Enregistrer exactement 3 outils : `search`, `get_doc`, `list`
- [ ] Conserver les resources MCP (URI schemes : `component://`, `guide://`, etc.) pour la compatibilité
- [ ] Les descriptions des outils dans le schema MCP sont optimisées pour guider l'IA (exemples de requêtes dans la description)
- [ ] Le serveur démarre correctement et l'index est construit au démarrage
- [ ] Le binary `bin/maz-ui-mcp.mjs` continue de fonctionner
- [ ] Tests d'intégration couvrant : démarrage serveur, appel de chaque outil, resources

## Functional Requirements

- FR-1: Le `SearchEngine` construit un index inversé au démarrage à partir de tous les documents markdown
- FR-2: Le scoring TF-IDF pondère les résultats par pertinence du terme dans le document et rareté du terme dans le corpus
- FR-3: Les recherches multi-mots combinent les scores de chaque terme pour un scoring final
- FR-4: Les recherches entre guillemets cherchent la phrase exacte dans le contenu
- FR-5: Le `MetadataExtractor` parse le frontmatter YAML et extrait les props/slots/events des docs générés
- FR-6: Les tags manuels (aliases) sont fusionnés avec les métadonnées extraites automatiquement
- FR-7: L'outil `search` combine le score de nom (×3), tags (×2), et contenu TF-IDF (×1) pour le ranking
- FR-8: L'outil `get_doc` résout les noms en PascalCase, kebab-case, et alias avant la recherche
- FR-9: L'outil `list` retourne les documents groupés par catégorie avec compteurs
- FR-10: Les snippets de résultats affichent ~150 caractères de contexte autour du match

## Non-Goals

- Recherche sémantique / embeddings (trop lourd pour un MCP local)
- Interface utilisateur ou dashboard pour la recherche
- Cache persistant de l'index sur disque (reconstruit à chaque démarrage, c'est suffisamment rapide)
- Support de langues multiples (docs en anglais uniquement)
- Modification de la pipeline de génération des docs (`copy-docs.ts`, `generate:components-docs`)
- Modification du `bin/maz-ui-mcp.mjs` (seul le serveur importé change)

## Technical Considerations

- Le `SearchEngine` doit être un module pur sans dépendance au SDK MCP pour faciliter les tests
- L'index inversé tient facilement en mémoire (~100 docs markdown)
- Le `MetadataExtractor` utilise des regex simples pour parser le frontmatter et les tables markdown (pas besoin de parser YAML complet)
- Les tests du `DocumentationService` existants sont des tests d'intégration qui lisent les vrais fichiers — les conserver et les adapter
- Le coverage actuel est à ~96% — maintenir ce niveau
- Respecter la configuration `unbuild` existante (single entry `src/mcp.ts`)

## Success Metrics

- L'IA trouve le bon composant/doc dès la première recherche dans >90% des cas
- Le temps d'indexation au démarrage < 500ms
- 3 outils au lieu de 6 — chaque outil a un rôle clair et distinct
- Coverage des tests > 95%
- Les requêtes par description fonctionnelle (ex: "phone number input", "toast notification") retournent le bon résultat en premier

## Open Questions

- Faut-il supporter le hot-reload de l'index si les docs changent pendant que le serveur tourne ? (probablement non, le serveur est relancé à chaque session)
- Faut-il ajouter des stop-words (mots ignorés comme "the", "a", "is") dans le tokenizer pour améliorer la pertinence TF-IDF ?
