# Migration vers Changesets

## 🔄 Résumé des changements

Ce document explique la migration de **Lerna + Changelogen** vers **Changesets** pour la gestion des versions et releases.

## 📂 Fichiers ajoutés

### Configuration Changesets

- `.changeset/config.json` - Configuration principale
- `.changeset/README.md` - Documentation auto-générée
- `CHANGESETS_GUIDE.md` - Guide d'utilisation complet

### Scripts et validation

- `scripts/validate-changesets.js` - Script de validation
- `.github/workflows/changesets-release.yml` - Workflow de release

### Dépendances

- `@changesets/cli` - CLI principal
- `@changesets/changelog-github` - Générateur de changelog avec liens GitHub

## 🔧 Modifications apportées

### package.json racine

Nouveaux scripts ajoutés :

```json
{
  "scripts": {
    "changesets:add": "changeset add",
    "changesets:version": "changeset version",
    "changesets:release": "pnpm build:all && changeset publish",
    "changesets:status": "changeset status",
    "changesets:tag": "changeset tag",
    "changesets:validate": "node scripts/validate-changesets.js",
    "build:all": "pnpm -r build"
  }
}
```

### Configuration des packages synchronisés

Tous les packages maintiennent la même version (configuration `fixed`) :

- `maz-ui`
- `@maz-ui/icons`
- `@maz-ui/nuxt`
- `@maz-ui/themes`
- `@maz-ui/eslint-config`
- `@maz-ui/cli`

## 🔄 Nouveau workflow de release

### Avant (Lerna + Changelogen)

```bash
# Workflow ancien
pnpm release  # = lerna version + changelogen
# Processus manuel en plusieurs étapes
```

### Maintenant (Changesets)

```bash
# 1. Ajouter changeset pour décrire les changements
pnpm changesets:add

# 2. Commit et push
git add .changeset/
git commit -m "chore: add changeset"
git push

# 3. Le workflow GitHub Actions s'occupe du reste automatiquement
# - Crée une PR de release
# - Bump des versions
# - Génère les changelogs
# - Publie sur npm
# - Crée les GitHub releases
```

## 🚨 Fichiers conservés (à ne pas supprimer pour l'instant)

Les fichiers suivants sont gardés pendant la période de transition :

- `lerna.json` - Configuration Lerna existante
- `changelog.config.ts` - Configuration Changelogen
- `changelog-generate.ts` - Scripts de génération de changelog
- Scripts `release:*` dans package.json

⚠️ **Ces fichiers pourront être supprimés plus tard** une fois que Changesets aura prouvé son efficacité.

## 🆚 Comparaison des fonctionnalités

| Fonctionnalité           | Lerna + Changelogen         | Changesets                    |
| ------------------------ | --------------------------- | ----------------------------- |
| **Versioning**           | Manuel avec `lerna version` | Automatisé avec descriptions  |
| **Changelogs**           | Générés après coup          | Intégrés au processus         |
| **GitHub Releases**      | Manuelles                   | Automatiques                  |
| **Review Process**       | Aucun                       | PR de release pour validation |
| **Conventional Commits** | Support via Lerna           | Support via changelog GitHub  |
| **Monorepo**             | Support natif               | Support excellent             |
| **CI/CD**                | Configuration custom        | Workflow prêt à l'emploi      |

## 📋 Checklist de migration

### ✅ Étapes complétées

- [x] Installation de @changesets/cli
- [x] Configuration .changeset/config.json
- [x] Ajout des scripts npm
- [x] Création du workflow GitHub Actions
- [x] Documentation complète
- [x] Script de validation

### 🔄 Étapes de transition

- [ ] Tester le workflow sur une feature branch
- [ ] Former l'équipe sur le nouveau processus
- [ ] Effectuer quelques releases de test
- [ ] Valider que tout fonctionne correctement

### 🗑️ Nettoyage futur (optionnel)

- [ ] Supprimer `lerna.json`
- [ ] Supprimer `changelog.config.ts`
- [ ] Supprimer `changelog-generate.ts`
- [ ] Nettoyer les scripts `release:*` obsolètes
- [ ] Retirer Lerna des devDependencies

## 🔍 Validation de la migration

Exécutez le script de validation :

```bash
pnpm changesets:validate
```

## 🆘 En cas de problème

1. **Rollback possible** : Les anciens scripts sont toujours disponibles
2. **Support** : Consultez `CHANGESETS_GUIDE.md`
3. **Debug** : Utilisez `pnpm changesets:status` pour diagnostiquer

## 📚 Ressources

- [CHANGESETS_GUIDE.md](./CHANGESETS_GUIDE.md) - Guide d'utilisation
- [Documentation Changesets](https://github.com/changesets/changesets)
- [Workflow GitHub Actions](/.github/workflows/changesets-release.yml)
