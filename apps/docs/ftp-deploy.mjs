// @ts-check

import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { deploy, excludeDefaults } from '@samkirkland/ftp-deploy'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

const MAX_ATTEMPTS = 3
const RETRY_DELAY_MS = 30_000

/**
 * Load environment variables from a .env file
 * @param {string} envFileName
 * @returns {Record<string, string>} environment variables
 */
function loadEnvFile(envFileName = '.env') {
  try {
    const envPath = join(_dirname, envFileName)
    const envContent = readFileSync(envPath, 'utf-8')

    /** @type {Record<string, string>} */
    const envVars = {}

    envContent.split('\n').forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        let value = match[2].trim()
        value = value.replace(/^['"](.*)['"]$/, '$1')
        envVars[key] = value
      }
    })
    return envVars
  }
  catch {
    return {}
  }
}

/**
 * Deploy to Hostinger
 */
async function deployToHostinger() {
  const env = loadEnvFile()
  const isNextEnv = process.env.DEPLOY_ENV === 'next'
  console.warn(`🚚 Deploy started${isNextEnv ? ' (next environment)' : ''}`)

  /** @type {Parameters<typeof deploy>[0]} */
  const options = {
    'server': process.env.HOSTINGER_FTP_SERVER || process.env.FTP_SERVER || env.FTP_SERVER,
    'username': process.env.HOSTINGER_FTP_USERNAME || process.env.FTP_USERNAME || env.FTP_USERNAME,
    'password': process.env.HOSTINGER_FTP_PASSWORD || process.env.FTP_PASSWORD || env.FTP_PASSWORD,
    'local-dir': join(resolve(_dirname, './.vitepress/dist/'), '/'),
    ...(isNextEnv
      ? { 'server-dir': '/next/' }
      : {}),
    'exclude': [
      ...excludeDefaults,
      '.env',
      '.git/**',
      'node_modules/**',
    ],
    'timeout': 1000000,
  }

  // The FTP server sometimes drops the connection (idle timeout, refused connection): the next attempt syncs from the state of the server
  for (let attempt = 1; ; attempt++) {
    try {
      await deploy(options)
      break
    }
    catch (error) {
      if (attempt >= MAX_ATTEMPTS)
        throw error

      const reason = error instanceof Error
        ? error.message
        : error
      console.warn(`⚠️ Deploy failed (attempt ${attempt}/${MAX_ATTEMPTS}), retrying in ${RETRY_DELAY_MS / 1000}s:`, reason)
      await sleep(RETRY_DELAY_MS)
    }
  }

  console.warn('🚀 Deploy done!')
}

deployToHostinger()
