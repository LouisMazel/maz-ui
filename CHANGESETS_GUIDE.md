# Guide Changesets pour maz-ui

## 🎯 Qu'est-ce que Changesets ?

Changesets est un outil qui automatise la gestion des versions et des changelogs dans un monorepo. Il remplace l'ancienne configuration Lerna + Changelogen pour une approche plus moderne et flexible.

## 🏗️ Architecture mise en place

### Packages synchronisés

Tous les packages suivants auront **toujours la même version** (configuration `fixed`) :

- `maz-ui` (package principal)
- `@maz-ui/icons`
- `@maz-ui/nuxt`
- `@maz-ui/themes`
- `@maz-ui/eslint-config`
- `@maz-ui/cli`
- `cli`

### Configuration

- **Base branch** : `master`
- **Conventional commits** : Support automatique via le changelog GitHub
- **Changelogs** : Générés avec des liens GitHub automatiques
- **Commits automatiques** : Activés pour les versions et releases
- **GitHub Releases** : Créées automatiquement

## 🚀 Workflow de release

### 1. Développement normal

```bash
# Faire vos modifications normales
git add .
git commit -m "feat: add new component"
git push
```

### 2. Ajouter un changeset

Quand vous voulez préparer une release, ajoutez un changeset :

```bash
pnpm changesets:add
```

Cette commande vous demandera :

- **Quels packages** ont changé (sélectionnez ceux concernés)
- **Type de changement** :
  - `patch` : Bug fixes, small improvements (0.0.1)
  - `minor` : New features, non-breaking changes (0.1.0)
  - `major` : Breaking changes (1.0.0)
- **Description** du changement pour le changelog

Cela créera un fichier dans `.changeset/` avec vos changements.

#### 2b. Création manuelle de changeset

Si l'interface interactive ne fonctionne pas, vous pouvez créer le fichier manuellement :

```bash
# Créer un fichier dans .changeset/ avec un nom unique
touch .changeset/$(date +%s)-my-change.md
```

Puis éditer le fichier avec ce format :

```yaml
---
'maz-ui': patch
---
Fix button styling issue in disabled state

- Resolve incorrect opacity for disabled buttons
- Improve contrast for accessibility
- Update hover states for better UX
```

Pour un changement majeur sur plusieurs packages :

```yaml
---
"maz-ui": major
"@maz-ui/themes": major
---

Redesign theme system with breaking changes

- Remove deprecated CSS variables
- Update theme structure for better performance
- Add new color system with semantic tokens

BREAKING CHANGE: Old theme variables are no longer supported. See migration guide.
```

### 3. Commit et push du changeset

```bash
git add .changeset/
git commit -m "chore: add changeset for new feature"
git push
```

### 4. Release automatique

Lors du push sur `master`, le workflow GitHub Actions :

1. **Détecte les changesets** en attente
2. **Crée une Pull Request de release** avec :

   - Bump des versions dans tous les packages
   - Changelogs mis à jour
   - Suppression des fichiers changeset utilisés

3. **Quand vous mergez la PR** :
   - Les packages sont buildés
   - Publication sur npm
   - Création des tags Git
   - Création des GitHub Releases
   - Push des changelogs

## 📋 Scripts disponibles

### Scripts principaux

```bash
# Ajouter un changeset (décrit vos changements)
pnpm changesets:add

# Voir le statut des changesets en attente
pnpm changesets:status

# Appliquer les changesets (bump versions + changelogs)
pnpm changesets:version

# Publier tous les packages (après build)
pnpm changesets:release

# Créer les tags Git pour les versions actuelles
pnpm changesets:tag

# Builder tous les packages
pnpm build:all

# Valider la configuration
pnpm changesets:validate
```

### Scripts Alpha/Beta

```bash
# Entrer en mode pre-release alpha
pnpm changesets:pre-alpha

# Entrer en mode pre-release beta
pnpm changesets:pre-beta

# Sortir du mode pre-release
pnpm changesets:pre-exit

# Publier version alpha (build + publish)
pnpm changesets:publish-alpha

# Publier version beta (build + publish)
pnpm changesets:publish-beta

# Créer et publier snapshot temporaire
pnpm changesets:snapshot
```

## 🔄 Types de changements

### Patch (0.0.X)

```bash
# Exemples de patch
- fix: resolve button styling issue
- docs: update component documentation
- perf: optimize component rendering
- style: fix linting issues
```

### Minor (0.X.0)

```bash
# Exemples de minor
- feat: add new MazButton variant
- feat: add dark mode support to MazCard
- feat: new composable useTheme
```

### Major (X.0.0)

```bash
# Exemples de major
- feat!: remove deprecated props
- feat: redesign MazButton API (BREAKING)
- refactor!: change theme structure
```

## 📝 Exemples pratiques

### Scenario 1: Bug fix simple

```bash
# 1. Faire le fix
git add src/components/MazButton.vue
git commit -m "fix: resolve button disabled state"

# 2. Ajouter changeset
pnpm changesets:add
# Sélectionner: maz-ui, patch, "Fix button disabled state styling"

# 3. Commit changeset
git add .changeset/
git commit -m "chore: add changeset for button fix"
git push
```

### Scenario 2: Nouvelle feature

```bash
# 1. Développer la feature
git add .
git commit -m "feat: add MazDatePicker component"

# 2. Ajouter changeset
pnpm changesets:add
# Sélectionner: maz-ui, minor, "Add new MazDatePicker component with full accessibility support"

# 3. Commit et push
git add .changeset/
git commit -m "chore: add changeset for MazDatePicker"
git push
```

### Scenario 3: Breaking change

```bash
# 1. Faire le breaking change
git add .
git commit -m "feat!: redesign theme API"

# 2. Ajouter changeset
pnpm changesets:add
# Sélectionner: maz-ui + @maz-ui/themes, major, "Redesign theme API with new structure. See migration guide."

# 3. Commit et push
git add .changeset/
git commit -m "chore: add changeset for theme redesign"
git push
```

## 🚀 Versions Alpha/Beta (Pre-releases)

### 1. Mode Pre-release avec workflow automatique

Pour publier des versions alpha/beta qui passent par le workflow GitHub Actions :

```bash
# Entrer en mode pre-release alpha
pnpm changeset pre enter alpha

# Ou pour beta
pnpm changeset pre enter beta
```

Ensuite, procédez normalement :

```bash
# Ajouter vos changesets comme d'habitude
pnpm changesets:add

# Commit et push
git add .
git commit -m "chore: add changeset for alpha feature"
git push
```

Le workflow créera une PR avec des versions comme `4.1.0-alpha.0`, `4.1.0-alpha.1`, etc.

Pour sortir du mode pre-release :

```bash
pnpm changeset pre exit
git add .
git commit -m "chore: exit pre-release mode"
git push
```

### 2. Publication manuelle Alpha/Beta

Si vous voulez publier manuellement sans passer par la pipeline :

```bash
# 1. Créer un changeset pour votre feature
pnpm changesets:add

# 2. Appliquer les versions en mode pre-release
pnpm changeset pre enter alpha
pnpm changesets:version

# 3. Builder les packages
pnpm build:all

# 4. Publier manuellement avec tag alpha
pnpm changeset publish --tag alpha

# Ou pour beta
pnpm changeset publish --tag beta
```

### 3. Snapshots (versions temporaires)

Pour des versions de test rapides sans affecter les changelogs :

```bash
# Créer une version snapshot unique
pnpm changeset version --snapshot

# Publier avec un tag spécifique
pnpm changeset publish --tag snapshot
```

### 4. Publication sur des branches spécifiques

Pour publier depuis une branch de feature :

```bash
# Sur votre branch feature/new-component
git checkout feature/new-component

# Ajouter changeset
pnpm changesets:add

# Mode pre-release
pnpm changeset pre enter alpha

# Version et publication manuelle
pnpm changesets:version
pnpm build:all
pnpm changeset publish --tag alpha
```

### 5. Workflow recommandé pour Alpha/Beta

#### Pour des features en développement

1. **Branch de feature** → Publication manuelle alpha
2. **Tests utilisateurs** → Itérations alpha (alpha.0, alpha.1, etc.)
3. **Feature stable** → Passage en beta
4. **Validation finale** → Merge vers master pour release stable

#### Commandes complètes

```bash
# === VERSION ALPHA MANUELLE ===
git checkout feature/my-feature
pnpm changesets:add                    # Décrire les changements
pnpm changeset pre enter alpha         # Mode alpha
pnpm changesets:version               # Bump vers alpha.0
pnpm build:all                        # Build
pnpm changeset publish --tag alpha    # Publier sur npm avec tag alpha

# === VERSION BETA MANUELLE ===
pnpm changeset pre exit               # Sortir du mode alpha
pnpm changeset pre enter beta         # Mode beta
pnpm changesets:version               # Bump vers beta.0
pnpm build:all                        # Build
pnpm changeset publish --tag beta     # Publier sur npm avec tag beta

# === RETOUR EN MODE NORMAL ===
pnpm changeset pre exit               # Sortir du mode pre-release
git checkout master                   # Retour sur master
# Puis workflow normal avec PR automatique
```

### 6. Installation des versions Alpha/Beta

Les utilisateurs peuvent installer vos versions de test :

```bash
# Installer la dernière alpha
npm install maz-ui@alpha

# Installer une version alpha spécifique
npm install maz-ui@4.1.0-alpha.2

# Installer la dernière beta
npm install maz-ui@beta

# Voir toutes les versions disponibles
npm view maz-ui versions --json
```

### 7. Points importants

- ✅ **Les pre-releases ne modifient pas la version `latest`** sur npm
- ✅ **Vous pouvez publier manuellement** sans affecter le workflow automatique
- ✅ **Les tags permettent l'installation sélective** (`@alpha`, `@beta`)
- ⚠️ **Toujours builder avant de publier** (`pnpm build:all`)
- ⚠️ **Les snapshots sont temporaires**, utilisez-les pour les tests uniquement

## 🔧 Configuration avancée

### Modifier la configuration

Editez `.changeset/config.json` pour :

- Changer le comportement des versions
- Modifier les messages de commit
- Ajuster les packages synchronisés
- Personnaliser les changelogs

### Variables d'environnement requises

Dans les secrets GitHub Actions :

```bash
GITHUB_TOKEN=<token_github>  # Fourni automatiquement
NPM_TOKEN=<token_npm>        # À ajouter dans les secrets
```

Pour ajouter le `NPM_TOKEN` :

1. Allez sur [npmjs.com](https://www.npmjs.com/) et connectez-vous
2. Créez un Access Token avec permission "Automation"
3. Dans GitHub : Settings > Secrets and variables > Actions
4. Ajoutez `NPM_TOKEN` avec votre token npm

## 🆚 Différences avec l'ancien système

### Avant (Lerna + Changelogen)

- Versions manuelles avec `lerna version`
- Changelogs générés séparément
- Process en plusieurs étapes
- Pas de PR de review

### Maintenant (Changesets)

- Descriptions intentionnelles des changements
- PR de release pour review
- Workflow entièrement automatisé
- Meilleur contrôle et transparence
- Changelogs plus riches avec liens GitHub

## 🚨 Points d'attention

1. **Toujours ajouter un changeset** avant de merger des changements importants
2. **Reviewer les PR de release** avant de merger
3. **Ne pas modifier manuellement** les versions dans package.json
4. **Garder les descriptions** de changeset claires et utiles
5. **Tester les builds** avant les releases importantes

## 🔍 Dépannage

### "No changesets found"

```bash
# Vérifier s'il y a des changesets en attente
pnpm changesets:status

# Ajouter un changeset si nécessaire
pnpm changesets:add
```

### Build en échec

```bash
# Tester le build localement
pnpm build:all

# Vérifier les erreurs TypeScript
pnpm -r typecheck
```

### Release qui ne se déclenche pas

- Vérifier que vous êtes sur la branche `master`
- Vérifier qu'il y a des changesets dans `.changeset/`
- Vérifier les logs du workflow GitHub Actions

## 📚 Ressources

- [Documentation officielle Changesets](https://github.com/changesets/changesets)
- [Guide des Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
