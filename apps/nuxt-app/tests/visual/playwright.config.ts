import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.VISUAL_PORT ?? 3401)
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testDir: '.',
  outputDir: './.results',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled', caret: 'hide' },
  },
  use: {
    baseURL,
    viewport: { width: 800, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'light-ltr', use: { ...devices['Desktop Chrome'], viewport: { width: 800, height: 900 }, colorScheme: 'light' } },
    { name: 'dark-ltr', use: { ...devices['Desktop Chrome'], viewport: { width: 800, height: 900 }, colorScheme: 'dark' } },
    { name: 'light-rtl', use: { ...devices['Desktop Chrome'], viewport: { width: 800, height: 900 }, colorScheme: 'light' } },
    { name: 'dark-rtl', use: { ...devices['Desktop Chrome'], viewport: { width: 800, height: 900 }, colorScheme: 'dark' } },
  ],
  webServer: {
    command: `pnpm exec nuxi build && pnpm exec nuxi preview --port ${port}`,
    url: `${baseURL}/visual`,
    reuseExistingServer: true,
    timeout: 300_000,
    cwd: '../..',
  },
})
