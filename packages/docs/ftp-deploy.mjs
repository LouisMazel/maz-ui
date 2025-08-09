// @ts-check

/* eslint-disable no-console */
import { deploy, excludeDefaults } from '@samkirkland/ftp-deploy'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

function loadEnvFile(envFileName = '.env') {
  try {
    const envPath = join(_dirname, envFileName)
    const envContent = readFileSync(envPath, 'utf-8')

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

async function deployToHostinger() {
  const env = loadEnvFile()
  console.log('🚚 Deploy started')

  await deploy({
    'server': process.env.FTP_SERVER || env.FTP_SERVER,
    'username': process.env.FTP_USERNAME || env.FTP_USERNAME,
    'password': process.env.FTP_PASSWORD || env.FTP_PASSWORD,
    'local-dir': join(resolve(_dirname, './docs/.vitepress/dist/'), '/'),
    'server-dir': '/v3/',
    'exclude': [...excludeDefaults, '.env', '.git/**', 'node_modules/**'],
    'timeout': 1000000,
  })
  console.log('🚀 Deploy done!')
}

deployToHostinger()
