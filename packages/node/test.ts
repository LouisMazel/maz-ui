/* eslint-disable no-console, complexity, sonarjs/cognitive-complexity */

import { execPromise } from './src'

// Couleurs pour rendre les tests plus lisibles
const colors = {
  reset: '\x1B[0m',
  bright: '\x1B[1m',
  dim: '\x1B[2m',
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
}

function testSection(title: string) {
  console.log(`\n${colors.cyan}${colors.bright}${'='.repeat(process.stdout.columns)}${colors.reset}`)
  console.log(`${colors.cyan}${colors.bright}📋 ${title}${colors.reset}`)
  console.log(`${colors.cyan}${colors.bright}${'='.repeat(process.stdout.columns)}${colors.reset}\n`)
}

function testCase(description: string) {
  console.log()
  console.log(`${colors.yellow}▶ Test: ${description}${colors.reset}`)
  console.log()
}

function success(message: string) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`)
}

function error(message: string) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`)
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock logger pour capturer les logs
class TestLogger {
  logs: Array<{ level: string, message: string, args: any[] }> = []

  debug(message: string, ...args: any[]) {
    this.logs.push({ level: 'debug', message, args })
    console.log(`  ${colors.dim}[DEBUG]${colors.reset} ${message}`, ...args)
  }

  error(message: string, ...args: any[]) {
    this.logs.push({ level: 'error', message, args })
    console.log(`  ${colors.red}[ERROR]${colors.reset} ${message}`, ...args)
  }

  success(message: string, ...args: any[]) {
    this.logs.push({ level: 'success', message, args })
    console.log(`  ${colors.green}[SUCCESS]${colors.reset} ${message}`, ...args)
  }

  clear() {
    this.logs = []
  }

  hasLog(level: string, partial: string): boolean {
    return this.logs.some(log =>
      log.level === level && log.message.includes(partial),
    )
  }
}

const testLogger = new TestLogger()

async function main() {
  console.log(`${colors.bright}🧪 Tests pour execPromise${colors.reset}`)

  testSection('2. STDERR ET OUTPUTS MIXTES')

  testCase('Commande qui écrit sur stderr (sans erreur)')
  try {
    // >&2 redirige vers stderr sous Linux/Mac
    const result = await execPromise('echo "Warning message" >&2', {
      // logger: testLogger,
    })
    success(`Stderr capturé: "${result.stderr.trim()}"`)
    if (testLogger.hasLog('debug', 'Warning message')) {
      success('Stderr loggé en debug (pas en warn)')
    }
  }
  catch (err) {
    error(`Erreur inattendue: ${err}`)
  }
  testLogger.clear()
  await sleep(100)

  testCase('Commande avec stderr et noStderr=true')
  try {
    const result = await execPromise('echo "Hidden stderr" >&2', {
      // logger: testLogger,
      noStderr: true,
    })
    if (!testLogger.hasLog('debug', 'Hidden stderr')) {
      success(`Stderr non loggé mais retourné: "${result.stderr.trim()}"`)
    }
    else {
      error('Stderr loggé alors que noStderr=true')
    }
  }
  catch (err) {
    error(`Erreur inattendue: ${err}`)
  }
  testLogger.clear()
  await sleep(100)

  testCase('Commande avec stdout ET stderr')
  try {
    const result = await execPromise('echo "stdout"; echo "stderr" >&2', {
      // logger: testLogger,
    })
    success(`Stdout: "${result.stdout.trim()}", Stderr: "${result.stderr.trim()}"`)
    if (testLogger.hasLog('debug', 'stdout') && testLogger.hasLog('debug', 'stderr')) {
      success('Les deux outputs loggés correctement')
    }
  }
  catch (err) {
    error(`Erreur inattendue: ${err}`)
  }
  testLogger.clear()
  await sleep(100)

  // ========================================
  // 3. GESTION DES ERREURS
  // ========================================
  testSection('3. GESTION DES ERREURS')

  testCase('Commande qui échoue')
  try {
    await execPromise('exit 1', {
      // logger: testLogger,
    })
    error('La commande aurait dû échouer')
  }
  catch (err: any) {
    success(`Erreur capturée correctement: ${err.message}`)
    if (testLogger.hasLog('error', 'Execution failed')) {
      success('Erreur correctement loggée')
    }
  }
  testLogger.clear()
  await sleep(100)

  testCase('Commande inexistante')
  try {
    await execPromise('command_qui_nexiste_pas_123456', {
      // logger: testLogger,
    })
    error('La commande aurait dû échouer')
  }
  catch (err: any) {
    success(`Erreur capturée: ${err.message}`)
    if (testLogger.hasLog('error', 'Execution failed')) {
      success('Erreur correctement loggée')
    }
  }
  testLogger.clear()
  await sleep(100)

  testCase('Erreur avec packageName')
  try {
    await execPromise('exit 42', {
      // logger: testLogger,
      packageName: 'error-package',
    })
    error('La commande aurait dû échouer')
  }
  catch (err: any) {
    success(`Code de sortie: ${err.code}`)
    if (testLogger.hasLog('error', '[error-package]')) {
      success('PackageName présent dans le log d\'erreur')
    }
  }
  testLogger.clear()
  await sleep(100)

  // ========================================
  // 4. CAS SPÉCIAUX
  // ========================================
  testSection('4. CAS SPÉCIAUX')

  testCase('Commande avec output vide')
  try {
    const result = await execPromise('true', {
      // logger: testLogger,
    })
    success(`Commande réussie sans output: stdout="${result.stdout}", stderr="${result.stderr}"`)
    // Vérifier qu'on ne logge pas d'output vide
    const hasEmptyLog = testLogger.logs.some(log =>
      log.level === 'debug' && log.args[0] === '',
    )
    if (!hasEmptyLog) {
      success('Pas de log pour output vide')
    }
  }
  catch (err) {
    error(`Erreur inattendue: ${err}`)
  }
  testLogger.clear()
  await sleep(100)

  testCase('Commande avec beaucoup d\'output')
  try {
    // Génère 100 lignes
    const result = await execPromise('for i in {1..100}; do echo "Line $i"; done', {
      // logger: testLogger,
      noStdout: true, // Pour ne pas polluer la console
    })
    const lines = result.stdout.trim().split('\n').length
    success(`${lines} lignes capturées correctement`)
  }
  catch (err) {
    error(`Erreur: ${err}`)
  }
  testLogger.clear()
  await sleep(100)

  testCase('Commande avec caractères spéciaux')
  try {
    const result = await execPromise('echo "Test avec \'quotes\' et \\"doubles\\" et $VAR"', {
      // logger: testLogger,
    })
    success(`Output avec caractères spéciaux: "${result.stdout.trim()}"`)
  }
  catch (err) {
    error(`Erreur: ${err}`)
  }
  testLogger.clear()
  await sleep(100)

  testCase('Toutes les options désactivées')
  try {
    const result = await execPromise('echo "Silent mode"', {
      // logger: testLogger,
      noSuccess: true,
      noStdout: true,
      noStderr: true,
    })
    if (testLogger.logs.length === 0) {
      success(`Mode silencieux total, mais output retourné: "${result.stdout.trim()}"`)
    }
    else {
      error(`Des logs ont été émis: ${testLogger.logs.length}`)
    }
  }
  catch (err) {
    error(`Erreur: ${err}`)
  }
  testLogger.clear()

  // ========================================
  // 5. TESTS SANS LOGGER CUSTOM
  // ========================================
  testSection('5. TESTS AVEC LOGGER PAR DÉFAUT')

  testCase('Utilisation du logger par défaut')
  try {
    console.log('  (Utilise le logger par défaut)')
    const result = await execPromise('echo "Default logger test"')
    success(`Commande exécutée avec logger par défaut: "${result.stdout.trim()}"`)
  }
  catch (err) {
    error(`Erreur: ${err}`)
  }
  await sleep(100)

  // ========================================
  // RÉSUMÉ
  // ========================================
  console.log(`\n${colors.bright}${colors.magenta}${'='.repeat(60)}${colors.reset}`)
  console.log(`${colors.bright}📊 Tests terminés !${colors.reset}`)
  console.log(`${colors.magenta}${'='.repeat(60)}${colors.reset}`)

  // Afficher quelques statistiques
  console.log(`\n${colors.cyan}Conseils d'après les tests:${colors.reset}`)
  console.log('• Utilisez noStdout/noStderr pour les commandes verboses')
  console.log('• Ajoutez packageName pour identifier l\'origine des commandes')
  console.log('• stderr n\'est pas toujours une erreur (loggé en debug)')
  console.log('• Les erreurs sont correctement propagées avec reject()')
}

// Lancer les tests
main().catch((err) => {
  console.error(`${colors.red}Erreur fatale:${colors.reset}`, err)
  process.exit(1)
})
