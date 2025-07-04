# Migration vers Lerna

Ce projet a migré de Changesets vers Lerna pour la gestion des versions et publications.

## Configuration

### Mode Fixed-Version

Tous les packages partagent la même version (actuellement `4.0.0-alpha.5`), configurée dans `lerna.json`.

### Conventional Commits

Lerna utilise les conventional commits pour déterminer automatiquement les versions (patch/minor/major).

## Scripts Disponibles

### Gestion des Versions

```bash
# Créer une nouvelle version (manuelle)
pnpm lerna:version

# Créer une version alpha
pnpm lerna:version:alpha

# Créer une version beta
pnpm lerna:version:beta

# Graduer les pre-releases vers stable
pnpm lerna:version:graduate
```

### Publication

```bash
# Publier vers npm (latest)
pnpm lerna:publish

# Publier en alpha
pnpm lerna:publish:alpha

# Publier en beta
pnpm lerna:publish:beta
```

### Utilitaires

```bash
# Voir les packages modifiés
pnpm lerna:status

# Voir les différences
pnpm lerna:diff

# Générer les changelogs
pnpm generate:changelogs
```

## Workflows GitHub Actions

### Release Beta (develop)

- **Trigger**: Push sur `develop`
- **Action**: Crée une version beta et publie avec tag `beta`
- **Dist-tag**: `beta`

### Release Latest (master)

- **Trigger**: Push sur `master`
- **Action**: Gradue les pre-releases vers stable et publie
- **Dist-tag**: `latest`

## Secrets Requis

Configurez ces secrets dans votre repository GitHub :

- `NPM_TOKEN`: Token d'authentification npm
- `GITHUB_TOKEN`: Token GitHub (automatiquement fourni)

## Workflow Manuel

### Pour une release beta

```bash
# 1. Faire vos commits avec conventional commits
git commit -m "feat(maz-ui): nouvelle fonctionnalité"

# 2. Créer la version beta
pnpm lerna:version:beta

# 3. Publier
pnpm lerna:publish:beta

# 4. Push les tags
git push --follow-tags
```

### Pour une release latest

```bash
# 1. Graduer vers stable
pnpm lerna:version:graduate

# 2. Publier
pnpm lerna:publish

# 3. Générer les changelogs
pnpm generate:changelogs
```

## Changelogs

### Automatique

- Un changelog global est généré à la racine
- Chaque package a son propre changelog
- Utilise conventional-changelog avec le preset conventionalcommits

### Génération manuelle

```bash
pnpm generate:changelogs
```

## Migration depuis Changesets

✅ **Terminé**:

- Configuration Lerna installée
- Scripts package.json migrés
- Workflows GitHub Actions créés
- Script de génération des changelogs
- Suppression de la configuration Changesets

## Packages Concernés

Tous les packages dans le groupe fixed partagent la même version :

- `maz-ui`
- `@maz-ui/icons`
- `@maz-ui/nuxt`
- `@maz-ui/themes`
- `@maz-ui/eslint-config`
- `@maz-ui/cli`
- `@maz-ui/utils`
- `@maz-ui/translations`

## Notes Importantes

1. **Conventional Commits**: Respectez la convention pour l'auto-versioning
2. **Fixed Mode**: Tous les packages utilisent la même version
3. **Pre-releases**: Utilisez alpha/beta pour les versions de développement
4. **Changelogs**: Générés automatiquement lors des releases
