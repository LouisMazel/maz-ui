import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { detectAgentTargets } from '../agents/detectAgentTargets'
import { AGENT_TARGETS } from '../agents/types'

let rootDir: string

function writeProjectFile(file: string): void {
  const path = join(rootDir, file)

  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, '')
}

beforeEach(() => {
  rootDir = mkdtempSync(join(tmpdir(), 'maz-ui-detect-agents-'))
})

afterEach(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

describe('given detectAgentTargets', () => {
  describe('when the project has no agent file', () => {
    it('then it detects no agent', () => {
      expect(detectAgentTargets(rootDir)).toEqual([])
    })
  })

  describe.each([
    [
      '.claude/settings.local.json',
      ['claude'],
    ],
    [
      'CLAUDE.md',
      ['claude'],
    ],
    [
      '.claude/CLAUDE.md',
      ['claude'],
    ],
    [
      'CLAUDE.local.md',
      ['claude'],
    ],
    [
      '.mcp.json',
      ['claude'],
    ],
    [
      'AGENTS.md',
      ['agents-md'],
    ],
    [
      '.agents/rules/style.md',
      ['agents-md'],
    ],
    [
      '.agent/rules/style.md',
      ['agents-md'],
    ],
    [
      '.codex/config.toml',
      ['agents-md'],
    ],
    [
      '.clinerules',
      ['agents-md'],
    ],
    [
      '.cline/rules/main.md',
      ['agents-md'],
    ],
    [
      '.zed/settings.json',
      ['agents-md'],
    ],
    [
      '.rules',
      ['agents-md'],
    ],
    [
      '.cursor/mcp.json',
      ['agents-md', 'cursor'],
    ],
    [
      '.cursorrules',
      ['agents-md', 'cursor'],
    ],
    [
      '.vscode/mcp.json',
      ['agents-md', 'vscode'],
    ],
    [
      '.github/copilot-instructions.md',
      ['agents-md', 'vscode'],
    ],
    [
      '.github/instructions/vue.instructions.md',
      ['agents-md', 'vscode'],
    ],
    [
      '.gemini/settings.json',
      ['agents-md', 'gemini'],
    ],
    [
      'GEMINI.md',
      ['agents-md', 'gemini'],
    ],
    [
      'opencode.json',
      ['agents-md', 'opencode'],
    ],
    [
      'opencode.jsonc',
      ['agents-md', 'opencode'],
    ],
    [
      '.opencode/agents/review.md',
      ['agents-md', 'opencode'],
    ],
    [
      '.junie/guidelines.md',
      ['agents-md', 'junie'],
    ],
    [
      '.windsurf/rules/main.md',
      ['agents-md', 'windsurf'],
    ],
    [
      '.windsurfrules',
      ['agents-md', 'windsurf'],
    ],
    [
      '.devin/rules/main.md',
      ['agents-md', 'windsurf'],
    ],
    [
      '.warp/.mcp.json',
      ['agents-md', 'warp'],
    ],
    [
      'WARP.md',
      ['agents-md', 'warp'],
    ],
    [
      '.kiro/steering/main.md',
      ['agents-md', 'kiro'],
    ],
    [
      '.roo/mcp.json',
      ['agents-md', 'roo'],
    ],
    [
      '.roorules',
      ['agents-md', 'roo'],
    ],
  ])('when the project contains %s', (file, expected) => {
    it(`then it detects ${expected.join(', ')}`, () => {
      writeProjectFile(file)

      expect(detectAgentTargets(rootDir)).toEqual(expected)
    })
  })

  describe('when the project contains the files of several agents', () => {
    it('then it returns each agent once, in the order of the targets', () => {
      writeProjectFile('GEMINI.md')
      writeProjectFile('.vscode/mcp.json')
      writeProjectFile('.cursor/mcp.json')
      writeProjectFile('CLAUDE.md')
      writeProjectFile('.mcp.json')

      expect(detectAgentTargets(rootDir)).toEqual([
        'claude',
        'agents-md',
        'cursor',
        'vscode',
        'gemini',
      ])
    })
  })
})

describe('given AGENT_TARGETS', () => {
  describe('when it is read', () => {
    it('then it lists every supported agent', () => {
      expect(AGENT_TARGETS).toEqual([
        'claude',
        'agents-md',
        'cursor',
        'vscode',
        'gemini',
        'opencode',
        'junie',
        'windsurf',
        'warp',
        'kiro',
        'roo',
      ])
    })
  })
})
