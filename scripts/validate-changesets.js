#!/usr/bin/env node

/**
 * Script de validation de la configuration Changesets
 */

const fs = require('fs')
const path = require('path')

function validateChangesets() {
  console.log('🔍 Validation de la configuration Changesets...\n')

  // 1. Vérifier que le dossier .changeset existe
  const changesetDir = path.join(process.cwd(), '.changeset')
  if (!fs.existsSync(changesetDir)) {
    console.error("❌ Le dossier .changeset n'existe pas")
    process.exit(1)
  }
  console.log('✅ Dossier .changeset trouvé')

  // 2. Vérifier la configuration
  const configPath = path.join(changesetDir, 'config.json')
  if (!fs.existsSync(configPath)) {
    console.error("❌ Le fichier .changeset/config.json n'existe pas")
    process.exit(1)
  }
  console.log('✅ Fichier config.json trouvé')

  // 3. Valider le contenu de la configuration
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

    // Vérifier la base branch
    if (config.baseBranch !== 'master') {
      console.warn('⚠️  Base branch n\'est pas "master":', config.baseBranch)
    } else {
      console.log('✅ Base branch configurée sur "master"')
    }

    // Vérifier les packages fixed
    if (!config.fixed || !Array.isArray(config.fixed) || config.fixed.length === 0) {
      console.error('❌ Configuration "fixed" manquante ou incorrecte')
      process.exit(1)
    }
    console.log('✅ Configuration "fixed" trouvée avec', config.fixed[0].length, 'packages')

    // Vérifier les packages attendus
    const expectedPackages = [
      'maz-ui',
      '@maz-ui/icons',
      '@maz-ui/nuxt',
      '@maz-ui/themes',
      '@maz-ui/eslint-config',
      '@maz-ui/cli',
      'cli',
    ]
    const configuredPackages = config.fixed[0]

    const missingPackages = expectedPackages.filter((pkg) => !configuredPackages.includes(pkg))
    if (missingPackages.length > 0) {
      console.warn('⚠️  Packages manquants dans la configuration:', missingPackages.join(', '))
    } else {
      console.log('✅ Tous les packages attendus sont configurés')
    }

    // Vérifier le changelog GitHub
    if (Array.isArray(config.changelog) && config.changelog[0] === '@changesets/changelog-github') {
      console.log('✅ Changelog GitHub configuré')
    } else {
      console.warn("⚠️  Changelog GitHub n'est pas configuré correctement")
    }
  } catch (error) {
    console.error('❌ Erreur lors de la lecture de la configuration:', error.message)
    process.exit(1)
  }

  // 4. Vérifier le package.json racine
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    const requiredScripts = [
      'changesets:add',
      'changesets:version',
      'changesets:release',
      'changesets:status',
      'build:all',
    ]

    const missingScripts = requiredScripts.filter((script) => !packageJson.scripts[script])
    if (missingScripts.length > 0) {
      console.warn('⚠️  Scripts manquants dans package.json:', missingScripts.join(', '))
    } else {
      console.log('✅ Tous les scripts Changesets sont configurés')
    }
  } catch (error) {
    console.error('❌ Erreur lors de la lecture du package.json:', error.message)
    process.exit(1)
  }

  // 5. Vérifier le workflow GitHub
  const workflowPath = path.join(process.cwd(), '.github/workflows/changesets-release.yml')
  if (!fs.existsSync(workflowPath)) {
    console.error("❌ Le workflow GitHub Actions n'existe pas:", workflowPath)
    process.exit(1)
  }
  console.log('✅ Workflow GitHub Actions trouvé')

  console.log('\n🎉 Configuration Changesets validée avec succès!')
  console.log("📖 Consultez CHANGESETS_GUIDE.md pour l'utilisation")
}

validateChangesets()
