import { defineConfig } from '@yoloship/action'

export default defineConfig({
  agent: 'all',
  autoMerge: false,
  maxTurns: 100,
  reviewMaxTurns: 10,
  ralphLoopEnabled: true,
  rtkEnabled: false,
  autoSkills: true,
  logLevel: 'default',
})
