// @ts-check

/* eslint-disable no-console */
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deploy, excludeDefaults } from '@samkirkland/ftp-deploy'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

const localDir = join(resolve(_dirname, './docs/.vitepress/dist/'), '/')

console.log('localDir', localDir)

async function deployToCPanel() {
  console.log('🚚 Deploy started')
  await deploy({
    'server': process.env.FTP_SERVER,
    'username': process.env.FTP_USERNAME,
    'password': process.env.FTP_PASSWORD,
    'local-dir': localDir,
    'server-dir': '/public_html/',
    'exclude': [...excludeDefaults, '.env', '.git/**', 'node_modules/**'],
  })
  console.log('🚀 Deploy done!')
}

deployToCPanel()
