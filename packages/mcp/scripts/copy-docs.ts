#!/usr/bin/env node

import { existsSync, rmSync } from 'node:fs'
import { copyFile, mkdir, readdir, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { logger } from '@maz-ui/node'
import { getErrorMessage } from '@maz-ui/utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Chemins source et destination
const APPS_MCP_ROOT = resolve(__dirname, '..')
const APPS_DOCS_ROOT = resolve(__dirname, '../../../apps/docs')
const LOCAL_DOCS_DIR = resolve(APPS_MCP_ROOT, 'docs')

const SOURCES = [
  {
    source: resolve(APPS_DOCS_ROOT, 'src'),
    destination: resolve(LOCAL_DOCS_DIR, 'src'),
    name: 'Documentation source',
  },
  {
    source: resolve(APPS_DOCS_ROOT, '.vitepress/generated-docs'),
    destination: resolve(LOCAL_DOCS_DIR, 'generated-docs'),
    name: 'Generated documentation',
  },
]

/**
 * Copie récursive d'un dossier
 */
async function copyDirectory(source: string, destination: string) {
  // Créer le dossier de destination s'il n'existe pas
  if (!existsSync(destination)) {
    await mkdir(destination, { recursive: true })
  }

  const entries = await readdir(source)

  for (const entry of entries) {
    const sourcePath = resolve(source, entry)
    const destinationPath = resolve(destination, entry)

    const stats = await stat(sourcePath)

    if (stats.isDirectory()) {
      // Récursion pour les dossiers
      await copyDirectory(sourcePath, destinationPath)
    }
    else {
      // Copier les fichiers
      await copyFile(sourcePath, destinationPath)
    }
  }
}

function cleanLocalDocs() {
  const publicFolder = resolve(LOCAL_DOCS_DIR, 'src/public')
  const assetsFolder = resolve(LOCAL_DOCS_DIR, 'src/assets')
  const competitionsFile = resolve(LOCAL_DOCS_DIR, 'src/components/competitions.ts')
  if (existsSync(publicFolder)) {
    rmSync(publicFolder, { recursive: true })
  }
  if (existsSync(assetsFolder)) {
    rmSync(assetsFolder, { recursive: true })
  }
  if (existsSync(competitionsFile)) {
    rmSync(competitionsFile)
  }
}

function rimrafDocs() {
  rmSync(LOCAL_DOCS_DIR, { recursive: true })
}

/**
 * Script principal
 */
async function main() {
  logger.log('🚀 Copie des fichiers de documentation...')
  logger.log(`📁 Destination: ${LOCAL_DOCS_DIR}`)

  try {
    rimrafDocs()
    // Créer le dossier docs principal
    if (!existsSync(LOCAL_DOCS_DIR)) {
      await mkdir(LOCAL_DOCS_DIR, { recursive: true })
    }

    // Copier chaque source
    for (const { source, destination, name } of SOURCES) {
      logger.log(`\n📂 Copie de ${name}...`)
      logger.log(`   Source: ${source}`)
      logger.log(`   Destination: ${destination}`)

      if (!existsSync(source)) {
        logger.warn(`⚠️  Source non trouvée: ${source}`)
        logger.warn(`⚠️  Ceci est normal en production où les docs sont pré-générées`)
        continue
      }

      await copyDirectory(source, destination)
      cleanLocalDocs()
      logger.log(`✅ ${name} copié avec succès`)
    }

    logger.log('\n🎉 Copie terminée avec succès!')
    logger.log(`📊 Documentation disponible dans: ${LOCAL_DOCS_DIR}`)
  }
  catch (error) {
    logger.error('❌ Erreur lors de la copie:', getErrorMessage(error))
    process.exit(1)
  }
}

// Exécuter le script
main()
