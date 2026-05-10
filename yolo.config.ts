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
})
