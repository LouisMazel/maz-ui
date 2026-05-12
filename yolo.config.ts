import { defineConfig } from '@yoloship/action'

export default defineConfig({
  agent: 'all',
  autoMerge: false,
  maxTurns: 0,
  reviewMaxTurns: 0,
  ralphLoopEnabled: true,
  rtkEnabled: false,
  autoSkills: true,
  logLevel: 'default',
  apiUrl: process.env.YOLO_API_URL,
  apiKey: process.env.YOLO_API_KEY,
  claudeCodeOauthToken: process.env.CLAUDE_CODE_OAUTH_TOKEN,
  agentGuidelinesEnabled: true,
  gitToken: process.env.GITHUB_TOKEN,
  worktree: true,
  greffierEnabled: false,
  language: 'fr',
  provider: 'anthropic',
  baseBranch: 'develop',
})
