#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { logger } from './utils/logger'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

const DIST_DIR = path.join(_dirname, '../dist')
const CHUNKS_DIR = path.join(DIST_DIR, 'chunks')
const ANALYSES_DIR = path.join(_dirname, './analyses')
const RESULTS_FILE = path.join(ANALYSES_DIR, 'bundle-analysis.json')
const svgDir = path.join(_dirname, '../../icons/svg')
const svgFiles = fs.readdirSync(svgDir).map(file => file.replace('.svg', ''))

interface Analysis {
  timestamp: string
  entries: Record<string, { size: number, formattedSize: string, category: string }>
  categories: Record<string, { files: number, totalSize: number }>
  chunks: {
    totalFiles: number
    totalSize: number
    types: Record<string, {
      files: number
      totalSize: number
      chunks: Array<{ name: string, size: number, formattedSize: string }>
    }>
    entries: Record<string, { size: number, formattedSize: string, type: string }>
  }
  summary: { totalFiles: number, totalSize: number, mainEntry: number, componentsIndex: number, utilsIndex: number }
}

function getFileSize(filePath: string) {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  }
  catch {
    return 0
  }
}

function formatSize(bytes: number) {
  const units = ['B', 'KB', 'MB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}

function analyzeChunks() {
  logger.log('🧩 Analyse des chunks...\n')

  const chunksAnalysis: Analysis['chunks'] = {
    totalFiles: 0,
    totalSize: 0,
    types: {
      components: { files: 0, totalSize: 0, chunks: [] },
      icons: { files: 0, totalSize: 0, chunks: [] },
      directives: { files: 0, totalSize: 0, chunks: [] },
      composables: { files: 0, totalSize: 0, chunks: [] },
      utils: { files: 0, totalSize: 0, chunks: [] },
      styles: { files: 0, totalSize: 0, chunks: [] },
      other: { files: 0, totalSize: 0, chunks: [] },
    },
    entries: {},
  } as const

  if (!fs.existsSync(CHUNKS_DIR)) {
    logger.log('⚠️ Aucun dossier chunks trouvé')
    return chunksAnalysis
  }

  const chunkFiles = fs.readdirSync(CHUNKS_DIR)
    .filter(file => file.endsWith('.js') && !file.endsWith('.map'))

  chunkFiles.forEach((file) => {
    const filePath = path.join(CHUNKS_DIR, file)
    const size = getFileSize(filePath)
    const type = categorizeChunk(file)

    chunksAnalysis.totalFiles++
    chunksAnalysis.totalSize += size

    chunksAnalysis.types[type].files++
    chunksAnalysis.types[type].totalSize += size
    chunksAnalysis.types[type].chunks.push({
      name: file,
      size,
      formattedSize: formatSize(size),
    })

    chunksAnalysis.entries[file] = {
      size,
      formattedSize: formatSize(size),
      type,
    }
  })

  logger.log(`📊 Total chunks: ${chunksAnalysis.totalFiles} fichiers, ${formatSize(chunksAnalysis.totalSize)}\n`)

  Object.entries(chunksAnalysis.types).forEach(([type, data]) => {
    if (data.files > 0) {
      const avgSize = data.totalSize / data.files
      logger.log(`${getChunkTypeIcon(type as any)} ${type}: ${data.files} chunks, ${formatSize(data.totalSize)} (moy: ${formatSize(avgSize)})`)
    }
  })

  const topChunks = Object.entries(chunksAnalysis.entries)
    .sort(([,a], [,b]) => (b as { size: number }).size - (a as { size: number }).size)
    .slice(0, 5)

  logger.log('\n🔥 Top 5 des plus gros chunks:')
  topChunks.forEach(([name, info], index) => {
    const chunkInfo = info as { formattedSize: string, type: string }
    logger.log(`${index + 1}. ${name} - ${chunkInfo.formattedSize} (${chunkInfo.type})`)
  })

  return chunksAnalysis satisfies Analysis['chunks']
}

function categorizeChunk(filename: string): string {
  const name = filename.toLowerCase()

  const patterns = [
    { type: 'components', test: () => name.includes('maz') && !name.includes('icon') && !name.includes('directive') },
    { type: 'directives', test: () => name.includes('directive') },
    { type: 'composables', test: () => name.includes('use') || name.includes('composable') },
    { type: 'utils', test: () => name.includes('utils') || name.includes('util') },
    { type: 'styles', test: () => name.includes('style') || name.includes('lang') },
    { type: 'icons', test: () => isIconFile(name) },
  ]

  for (const pattern of patterns) {
    if (pattern.test()) {
      return pattern.type
    }
  }

  return 'other'
}

function isIconFile(name: string): boolean {
  return svgFiles.some(file => name.includes(file))
}

function getChunkTypeIcon(type: 'components' | 'icons' | 'directives' | 'composables' | 'utils' | 'styles' | 'other'): string {
  const icons = {
    components: '🧩',
    icons: '🎨',
    directives: '📐',
    composables: '🎣',
    utils: '🔧',
    styles: '💄',
    other: '📦',
  }
  return icons[type] || '📦'
}

function analyzeCategoriesAndEntries(analysis: any) {
  Object.keys(analysis.categories).forEach((category) => {
    const categoryDir = path.join(DIST_DIR, category)

    if (fs.existsSync(categoryDir)) {
      const files = fs.readdirSync(categoryDir)
        .filter(file => file.endsWith('.js') && !file.includes('index'))

      files.forEach((file) => {
        const filePath = path.join(categoryDir, file)
        const size = getFileSize(filePath)

        analysis.categories[category].files++
        analysis.categories[category].totalSize += size
        analysis.summary.totalFiles++
        analysis.summary.totalSize += size

        analysis.entries[`${category}/${file}`] = {
          size,
          formattedSize: formatSize(size),
          category,
        }
      })

      logger.log(`${getCategoryIcon(category as any)} ${category}: ${analysis.categories[category].files} fichiers, ${formatSize(analysis.categories[category].totalSize)}`)
    }
  })
}

function analyzeCSSAssets(analysis: any) {
  const assetsDir = path.join(DIST_DIR, 'assets')
  if (fs.existsSync(assetsDir)) {
    const cssFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.css'))

    cssFiles.forEach((file) => {
      const filePath = path.join(assetsDir, file)
      const size = getFileSize(filePath)

      analysis.categories.css.files++
      analysis.categories.css.totalSize += size

      analysis.entries[`assets/${file}`] = {
        size,
        formattedSize: formatSize(size),
        category: 'css',
      }
    })

    logger.log(`🎨 CSS: ${analysis.categories.css.files} fichiers, ${formatSize(analysis.categories.css.totalSize)}`)
  }
}

function logRecommendations(analysis: Analysis) {
  logger.log('\n💡 Recommandations:')

  if (analysis.summary.mainEntry > analysis.summary.totalSize * 0.3) {
    logger.log('⚠️  L\'entry  principal est trop gros par rapport aux modules individuels')
    logger.log('   → Encouragez les imports spécifiques plutôt que l\'import global')
  }

  if (analysis.categories.css.totalSize > analysis.summary.totalSize * 0.4) {
    logger.log('⚠️  Les CSS représentent une grande partie du bundle')
    logger.log('   → Considérez un build séparé pour les applications backend')
  }

  const avgComponentSize = analysis.categories.components.totalSize / analysis.categories.components.files
  if (avgComponentSize > 50000) {
    logger.log('⚠️  Les composants sont en moyenne assez lourds')
    logger.log(`   → Taille moyenne: ${formatSize(avgComponentSize)}`)
  }

  if (analysis.chunks.totalSize > analysis.summary.totalSize * 0.6) {
    logger.log('⚠️  Les chunks représentent une grande partie du bundle')
    logger.log('   → Vérifiez la stratégie de code splitting')
  }

  const iconChunks = analysis.chunks.types.icons
  if (iconChunks.files > 20) {
    logger.log('⚠️  Beaucoup de chunks d\'icônes séparés')
    logger.log(`   → ${iconChunks.files} chunks d\'icônes, considérez un bundle d\'icônes`)
  }
}

function analyzeBundle() {
  logger.log('🔍 Analyse du bundle Maz UI...\n')

  const analysis: Analysis = {
    timestamp: new Date().toISOString(),
    entries: {},
    categories: {
      components: { files: 0, totalSize: 0 },
      utils: { files: 0, totalSize: 0 },
      composables: { files: 0, totalSize: 0 },
      plugins: { files: 0, totalSize: 0 },
      directives: { files: 0, totalSize: 0 },
      formatters: { files: 0, totalSize: 0 },
      css: { files: 0, totalSize: 0 },
    },
    chunks: {
      totalFiles: 0,
      totalSize: 0,
      types: {
        components: { files: 0, totalSize: 0, chunks: [] },
        icons: { files: 0, totalSize: 0, chunks: [] },
        directives: { files: 0, totalSize: 0, chunks: [] },
        composables: { files: 0, totalSize: 0, chunks: [] },
        utils: { files: 0, totalSize: 0, chunks: [] },
        styles: { files: 0, totalSize: 0, chunks: [] },
        other: { files: 0, totalSize: 0, chunks: [] },
      },
      entries: {},
    },
    summary: {
      totalFiles: 0,
      totalSize: 0,
      mainEntry: 0,
      componentsIndex: 0,
      utilsIndex: 0,
    },
  }

  const mainEntry = path.join(DIST_DIR, 'index.js')
  analysis.summary.mainEntry = getFileSize(mainEntry)
  logger.log(`📦 Entry principal: ${formatSize(analysis.summary.mainEntry)}`)

  const categoryIndexes = [
    { name: 'components', file: 'components/index.js' },
    { name: 'utils', file: 'utils/index.js' },
    { name: 'composables', file: 'composables/index.js' },
    { name: 'plugins', file: 'plugins/index.js' },
    { name: 'directives', file: 'directives/index.js' },
    { name: 'formatters', file: 'formatters/index.js' },
    { name: 'resolvers', file: 'resolvers/index.js' },
    { name: 'icons', file: 'icons/index.js' },
  ]

  categoryIndexes.forEach(({ name, file }) => {
    const filePath = path.join(DIST_DIR, file)
    const size = getFileSize(filePath)
    analysis.summary[`${name}Index` as keyof Analysis['summary']] = size
    logger.log(`📋 Index ${name}: ${formatSize(size)}`)
  })

  logger.log('\n📊 Analyse par catégorie:\n')
  analyzeCategoriesAndEntries(analysis)

  analysis.chunks = analyzeChunks()
  analysis.summary.totalSize += analysis.chunks.totalSize
  analysis.summary.totalFiles += analysis.chunks.totalFiles

  analyzeCSSAssets(analysis)

  logger.log('\n📈 Résumé:')
  logger.log(`📁 Total: ${analysis.summary.totalFiles} fichiers, ${formatSize(analysis.summary.totalSize)}`)
  logger.log(`🧩 Chunks: ${analysis.chunks.totalFiles} fichiers, ${formatSize(analysis.chunks.totalSize)} (${(analysis.chunks.totalSize / analysis.summary.totalSize * 100).toFixed(1)}% du total)`)

  const mainRatio = (analysis.summary.mainEntry / analysis.summary.totalSize * 100).toFixed(1)
  logger.log(`📊 Entry principal représente ${mainRatio}% du total`)

  logger.log('\n🔥 Top 10 des plus gros fichiers:')
  const sortedEntries = Object.entries(analysis.entries)
    .sort(([,a], [,b]) => b.size - a.size)
    .slice(0, 10)

  sortedEntries.forEach(([name, info], index) => {
    logger.log(`${index + 1}. ${name} - ${info.formattedSize}`)
  })

  logRecommendations(analysis)

  if (!fs.existsSync(ANALYSES_DIR)) {
    fs.mkdirSync(ANALYSES_DIR, { recursive: true })
  }
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(analysis, null, 2))
  logger.log(`\n💾 Analyse sauvegardée dans ${RESULTS_FILE}`)

  return analysis
}

function getCategoryIcon(category: 'components' | 'utils' | 'composables' | 'plugins' | 'directives' | 'formatters' | 'css'): string {
  const icons = {
    components: '🧩',
    utils: '🔧',
    composables: '🎣',
    plugins: '🔌',
    directives: '📐',
    formatters: '🔍',
    css: '🎨',
  }
  return icons[category] || '📦'
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function compareWithPrevious() {
  const previousFile = path.join(ANALYSES_DIR, 'bundle-analysis-previous.json')

  if (fs.existsSync(RESULTS_FILE) && fs.existsSync(previousFile)) {
    const current = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'))
    const previous = JSON.parse(fs.readFileSync(previousFile, 'utf8'))

    logger.log('\n📊 Comparaison avec l\'analyse précédente:')

    const sizeDiff = current.summary.totalSize - previous.summary.totalSize
    const sizeChange = sizeDiff > 0 ? '+' : ''
    const changeIcon = sizeDiff > 0 ? '📈' : '📉'

    logger.log(`${changeIcon} Taille totale: ${sizeChange}${formatSize(Math.abs(sizeDiff))}`)

    const mainDiff = current.summary.mainEntry - previous.summary.mainEntry
    const mainChange = mainDiff > 0 ? '+' : ''
    logger.log(`📦 Entry principal: ${mainChange}${formatSize(Math.abs(mainDiff))}`)

    if (current.chunks && previous.chunks) {
      const chunksDiff = current.chunks.totalSize - previous.chunks.totalSize
      const chunksChange = chunksDiff > 0 ? '+' : ''
      const chunksIcon = chunksDiff > 0 ? '📈' : '📉'
      logger.log(`${chunksIcon} Chunks: ${chunksChange}${formatSize(Math.abs(chunksDiff))}`)

      const chunkFilesDiff = current.chunks.totalFiles - previous.chunks.totalFiles
      if (chunkFilesDiff !== 0) {
        const filesChange = chunkFilesDiff > 0 ? '+' : ''
        logger.log(`🧩 Nombre de chunks: ${filesChange}${chunkFilesDiff}`)
      }
    }
  }
}

if (fs.existsSync(RESULTS_FILE)) {
  const previousFile = path.join(_dirname, './analyses/bundle-analysis-previous.json')
  fs.copyFileSync(RESULTS_FILE, previousFile)
}

try {
  analyzeBundle()
  compareWithPrevious()

  logger.log('\n✅ Analyse terminée!')

  process.exit(0)
}
catch (error) {
  logger.error('❌ Erreur lors de l\'analyse:', error instanceof Error ? error.message : String(error))
  process.exit(1)
}
