import { defineConfig } from '@yoloship/action'

export default defineConfig({
  agent: 'all',
  autoMerge: false,
  maxTurns: 0,
  reviewMaxTurns: 0,
  ralphLoopEnabled: false,
  rtkEnabled: true,
  autoSkills: true,
  logLevel: 'default',
  apiUrl: process.env.YOLO_API_URL,
  apiKey: process.env.YOLO_API_KEY,
  providerApiKey: process.env.YOLO_PROVIDER_API_KEY,
  agentGuidelinesEnabled: true,
  gitToken: process.env.GITHUB_TOKEN,
  worktree: true,
  greffierEnabled: false,
  language: 'fr',
  provider: 'anthropic',
  baseBranch: 'develop',
})
