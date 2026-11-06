import type { AgentDocs, AgentsTool, SetupAgentsResult } from '../setupAgents'
import { createHash } from 'node:crypto'

import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { parse } from 'jsonc-parser'
import * as agentsEntry from '../agents'
import {
  AGENT_TARGETS,
  AGENTS_MD_BEGIN,
  AGENTS_MD_END,
  compareVersions,
  DEFAULT_MCP_SERVER,
  detectAgentTargets,
  detectPackageManager,
  findInstalledPackage,
  findProjectPackage,
  findWorkspaceDirs,
  findWorkspacesUsing,
  installsMcpPackage,
  isEditedManagedContent,
  MANAGED_MARKER,
  MAZ_UI_AGENTS_TOOL,
  MCP_SERVER_NAME,
  mcpServerCommand,
  readAgentDocs,
  readManagedVersion,
  readWorkspacePatterns,
  resolveRulePaths,
  setupAgents,
  writeFileAtomic,
} from '../setupAgents'

const CLAUDE_RULE = '# maz-ui\n\nUse maz-ui components.'
const AGENTS_SECTION = '## maz-ui\n\nUse maz-ui components.'

let rootDir: string
let docsDir: string

function writeFile(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

function writeProjectFile(file: string, content: string): void {
  writeFile(join(rootDir, file), content)
}

function readProjectFile(file: string): string {
  return readFileSync(join(rootDir, file), 'utf8')
}

function projectFileExists(file: string): boolean {
  return existsSync(join(rootDir, file))
}

function createDocs(directory: string, { version = '5.1.0', claudeRule = CLAUDE_RULE, agentsSection = AGENTS_SECTION } = {}): void {
  writeFile(join(directory, 'manifest.json'), JSON.stringify({ version }))
  writeFile(join(directory, 'agents/claude-rule.md'), `${claudeRule}\n`)
  writeFile(join(directory, 'agents/agents-md.md'), `${agentsSection}\n`)
}

function changeOf(result: SetupAgentsResult, file: string) {
  return result.changes.find(change => change.file === file)
}

beforeEach(() => {
  rootDir = mkdtempSync(join(tmpdir(), 'maz-ui-agents-project-'))
  docsDir = mkdtempSync(join(tmpdir(), 'maz-ui-agents-docs-'))
  createDocs(docsDir)
})

afterEach(() => {
  rmSync(rootDir, { recursive: true, force: true })
  rmSync(docsDir, { recursive: true, force: true })
})

describe('given detectAgentTargets', () => {
  describe('when the project has no agent configuration', () => {
    it('then it returns no target', () => {
      expect(detectAgentTargets(rootDir)).toEqual([])
    })
  })

  describe.each([
    [
      '.claude/settings.json',
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
      'AGENTS.md',
      ['agents-md'],
    ],
    [
      '.codex/config.toml',
      ['agents-md'],
    ],
    [
      '.windsurf/rules/main.md',
      ['agents-md'],
    ],
    [
      '.devin/rules/main.md',
      ['agents-md'],
    ],
    [
      '.windsurfrules',
      ['agents-md'],
    ],
    [
      'GEMINI.md',
      ['agents-md'],
    ],
  ])('when the project contains %s', (file, expected) => {
    it(`then it detects ${expected.join(', ')}`, () => {
      writeProjectFile(file, '{}')

      expect(detectAgentTargets(rootDir)).toEqual(expected)
    })
  })

  describe('when the project contains several agent configurations', () => {
    it('then it returns the targets in the canonical order', () => {
      writeProjectFile('.vscode/mcp.json', '{}')
      writeProjectFile('.cursor/mcp.json', '{}')
      writeProjectFile('CLAUDE.md', '# project')

      expect(detectAgentTargets(rootDir)).toEqual([
        'claude',
        'agents-md',
        'cursor',
        'vscode',
      ])
    })
  })

  describe('when reading the exported target list', () => {
    it('then it lists every supported agent', () => {
      expect(AGENT_TARGETS).toEqual([
        'claude',
        'agents-md',
        'cursor',
        'vscode',
      ])
    })
  })
})

describe('given readAgentDocs', () => {
  describe('when docsDir is provided', () => {
    it('then it reads the version and the agent files', () => {
      expect(readAgentDocs(rootDir, docsDir)).toEqual({
        directory: docsDir,
        version: '5.1.0',
        claudeRule: CLAUDE_RULE,
        agentsMdSection: AGENTS_SECTION,
      })
    })
  })

  describe('when maz-ui is installed in the project', () => {
    it('then it reads the docs of the installed package', () => {
      writeProjectFile('node_modules/maz-ui/package.json', JSON.stringify({
        name: 'maz-ui',
        version: '5.2.0',
        exports: { './package.json': './package.json' },
      }))
      createDocs(join(rootDir, 'node_modules/maz-ui/docs'), { version: '5.2.0' })

      const docs = readAgentDocs(rootDir)

      expect(docs.version).toBe('5.2.0')
      expect(docs.directory).toContain(join('node_modules', 'maz-ui', 'docs'))
    })
  })

  describe('when maz-ui is hoisted in a parent directory', () => {
    it('then it reads the docs of the hoisted package', () => {
      const appDir = join(rootDir, 'apps/web')
      mkdirSync(appDir, { recursive: true })
      writeProjectFile('node_modules/maz-ui/package.json', JSON.stringify({ name: 'maz-ui', version: '5.3.0' }))
      createDocs(join(rootDir, 'node_modules/maz-ui/docs'), { version: '5.3.0' })

      expect(readAgentDocs(appDir).version).toBe('5.3.0')
    })
  })

  describe('when maz-ui is not installed', () => {
    it('then it throws an explicit error', () => {
      expect(() => readAgentDocs(rootDir)).toThrow(`maz-ui is not installed in ${rootDir}`)
    })
  })

  describe('when the installed maz-ui does not ship the agent docs', () => {
    it('then it asks to upgrade maz-ui', () => {
      writeProjectFile('node_modules/maz-ui/package.json', JSON.stringify({ name: 'maz-ui', version: '5.0.0' }))

      expect(() => readAgentDocs(rootDir)).toThrow('upgrade maz-ui to the latest version')
    })
  })

  describe('when the docs folder misses an agent file', () => {
    it('then it asks to upgrade maz-ui', () => {
      rmSync(join(docsDir, 'agents/agents-md.md'))

      expect(() => readAgentDocs(rootDir, docsDir)).toThrow('does not ship the agent docs')
    })
  })
})

describe('given findInstalledPackage', () => {
  describe('when the package is installed in the directory', () => {
    it('then it returns the package folder', () => {
      writeProjectFile('node_modules/maz-ui/package.json', '{}')

      expect(findInstalledPackage(rootDir, 'maz-ui')).toBe(join(rootDir, 'node_modules/maz-ui'))
    })
  })

  describe('when the package is not installed anywhere above', () => {
    it('then it returns undefined', () => {
      expect(findInstalledPackage(rootDir, 'maz-ui-package-that-does-not-exist')).toBeUndefined()
    })
  })
})

describe('given setupAgents with the claude target', () => {
  describe('when the project has a CLAUDE.md', () => {
    let result: SetupAgentsResult

    beforeEach(() => {
      writeProjectFile('CLAUDE.md', '# my project')
      result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })
    })

    it('then it writes the rule with the managed header and the version', () => {
      const rule = readProjectFile('.claude/rules/maz-ui.md')

      expect(rule).toContain(MANAGED_MARKER)
      expect(rule).toContain('5.1.0')
      expect(rule).toContain('# maz-ui\n\n> maz-ui 5.1.0 is installed')
      expect(rule).toContain('Use maz-ui components.')
      expect(changeOf(result, '.claude/rules/maz-ui.md')).toEqual({ file: '.claude/rules/maz-ui.md', action: 'create' })
    })

    it('then it registers the MCP server in .mcp.json with the stdio type', () => {
      expect(JSON.parse(readProjectFile('.mcp.json'))).toEqual({
        mcpServers: {
          [MCP_SERVER_NAME]: { type: 'stdio', ...DEFAULT_MCP_SERVER },
        },
      })
      expect(changeOf(result, '.mcp.json')?.action).toBe('create')
    })

    it('then it reports the targets and the version', () => {
      expect(result.targets).toEqual(['claude'])
      expect(result.version).toBe('5.1.0')
    })

    it('then it leaves CLAUDE.md untouched', () => {
      expect(readProjectFile('CLAUDE.md')).toBe('# my project')
    })
  })

  describe('when it runs twice', () => {
    it('then the second run changes nothing', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      const second = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(changeOf(second, '.claude/rules/maz-ui.md')?.action).toBe('unchanged')
      expect(changeOf(second, '.mcp.json')).toEqual({
        file: '.mcp.json',
        action: 'unchanged',
        reason: `maz-ui MCP server already registered as "${MCP_SERVER_NAME}"`,
      })
    })
  })

  describe('when maz-ui ships new rules', () => {
    it('then it updates the rule', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })
      createDocs(docsDir, { version: '5.2.0', claudeRule: '# maz-ui\n\nNew rules.' })

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(changeOf(result, '.claude/rules/maz-ui.md')?.action).toBe('update')
      expect(readProjectFile('.claude/rules/maz-ui.md')).toContain('New rules.')
      expect(readProjectFile('.claude/rules/maz-ui.md')).toContain('5.2.0')
    })
  })

  describe('when the rule file was written by the user', () => {
    it('then it leaves it untouched', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      writeProjectFile('.claude/rules/maz-ui.md', '# my own maz-ui rules')

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(readProjectFile('.claude/rules/maz-ui.md')).toBe('# my own maz-ui rules')
      expect(changeOf(result, '.claude/rules/maz-ui.md')).toEqual({
        file: '.claude/rules/maz-ui.md',
        action: 'skip',
        reason: 'file exists and was not generated by maz-ui: left untouched',
      })
    })
  })

  describe('when agents-md is also targeted and the project has no CLAUDE.md', () => {
    it('then it does not write the rule because Claude Code reads AGENTS.md', () => {
      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'agents-md'],
      })

      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(false)
      expect(changeOf(result, '.claude/rules/maz-ui.md')).toBeUndefined()
      expect(readProjectFile('AGENTS.md')).toContain('Use maz-ui components.')
    })

    it('then it removes a rule generated before', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'agents-md'],
      })
      rmSync(join(rootDir, 'CLAUDE.md'))

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'agents-md'],
      })

      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(false)
      expect(changeOf(result, '.claude/rules/maz-ui.md')?.action).toBe('remove')
    })
  })

  describe('when agents-md is also targeted and the project has a CLAUDE.md', () => {
    it('then it writes both the rule and the AGENTS.md section', () => {
      writeProjectFile('.claude/CLAUDE.md', '# my project')

      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'agents-md'],
      })

      expect(readProjectFile('.claude/rules/maz-ui.md')).toContain('Use maz-ui components.')
      expect(readProjectFile('AGENTS.md')).toContain('Use maz-ui components.')
    })
  })

  describe('when targets are omitted', () => {
    it('then it configures the detected agents', () => {
      writeProjectFile('CLAUDE.md', '# my project')

      const result = setupAgents({ rootDir, docsDir })

      expect(result.targets).toEqual(['claude'])
      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(true)
    })
  })
})

describe('given setupAgents with the agents-md target', () => {
  describe('when AGENTS.md does not exist', () => {
    it('then it creates it with the delimited section only', () => {
      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['agents-md'],
      })
      const content = readProjectFile('AGENTS.md')

      expect(content.startsWith(AGENTS_MD_BEGIN)).toBe(true)
      expect(content.trimEnd().endsWith(AGENTS_MD_END)).toBe(true)
      expect(content).toContain(MANAGED_MARKER)
      expect(content).toContain('Use maz-ui components.')
      expect(changeOf(result, 'AGENTS.md')?.action).toBe('create')
    })
  })

  describe('when AGENTS.md exists without the section', () => {
    it('then it appends the section and keeps the user content', () => {
      writeProjectFile('AGENTS.md', '# Project rules\n\nUse pnpm.\n\n\n')

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['agents-md'],
      })
      const content = readProjectFile('AGENTS.md')

      expect(content.startsWith('# Project rules\n\nUse pnpm.\n\n<!-- BEGIN:maz-ui -->')).toBe(true)
      expect(content.endsWith(`${AGENTS_MD_END}\n`)).toBe(true)
      expect(changeOf(result, 'AGENTS.md')?.action).toBe('update')
    })
  })

  describe('when AGENTS.md already contains the section', () => {
    it('then it replaces the section in place', () => {
      writeProjectFile('AGENTS.md', `# Before\n\n${AGENTS_MD_BEGIN}\nold section\n${AGENTS_MD_END}\n\n# After\n`)

      setupAgents({
        rootDir,
        docsDir,
        targets: ['agents-md'],
      })
      const content = readProjectFile('AGENTS.md')

      expect(content.startsWith(`# Before\n\n${AGENTS_MD_BEGIN}`)).toBe(true)
      expect(content.endsWith(`${AGENTS_MD_END}\n\n# After\n`)).toBe(true)
      expect(content).not.toContain('old section')
      expect(content).toContain('Use maz-ui components.')
    })

    it('then a second run changes nothing', () => {
      setupAgents({
        rootDir,
        docsDir,
        targets: ['agents-md'],
      })

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['agents-md'],
      })

      expect(changeOf(result, 'AGENTS.md')?.action).toBe('unchanged')
    })
  })

  describe('when AGENTS.md has a begin marker without end marker', () => {
    it('then it appends a complete section', () => {
      writeProjectFile('AGENTS.md', `# Rules\n\n${AGENTS_MD_BEGIN}\n`)

      setupAgents({
        rootDir,
        docsDir,
        targets: ['agents-md'],
      })

      expect(readProjectFile('AGENTS.md').trimEnd().endsWith(AGENTS_MD_END)).toBe(true)
    })
  })
})

describe('given setupAgents with MCP config targets', () => {
  describe('when the cursor target is configured', () => {
    it('then it writes .cursor/mcp.json without the type field', () => {
      setupAgents({
        rootDir,
        docsDir,
        targets: ['cursor'],
      })

      expect(JSON.parse(readProjectFile('.cursor/mcp.json'))).toEqual({
        mcpServers: { [MCP_SERVER_NAME]: DEFAULT_MCP_SERVER },
      })
    })
  })

  describe('when the vscode target is configured', () => {
    it('then it writes .vscode/mcp.json under the servers key', () => {
      setupAgents({
        rootDir,
        docsDir,
        targets: ['vscode'],
      })

      expect(JSON.parse(readProjectFile('.vscode/mcp.json'))).toEqual({
        servers: {
          [MCP_SERVER_NAME]: { type: 'stdio', ...DEFAULT_MCP_SERVER },
        },
      })
    })
  })

  describe('when the config already has other servers and comments', () => {
    it('then it adds the maz-ui server and preserves the rest', () => {
      writeProjectFile('.vscode/mcp.json', '{\n  // my servers\n  "servers": {\n    "github": {\n      "command": "gh-mcp"\n    },\n  }\n}\n')

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['vscode'],
      })
      const content = readProjectFile('.vscode/mcp.json')

      expect(content).toContain('// my servers')
      expect(content).toContain('"github": {\n      "command": "gh-mcp"\n    }')
      expect(content).toContain(`"${MCP_SERVER_NAME}": {`)
      expect(changeOf(result, '.vscode/mcp.json')?.action).toBe('update')
    })
  })

  describe('when the config has no trailing newline', () => {
    it('then it adds one', () => {
      writeProjectFile('.mcp.json', '{"mcpServers":{}}')

      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        dryRun: false,
      })

      expect(readProjectFile('.mcp.json').endsWith('\n')).toBe(true)
    })
  })

  describe('when the config is indented with tabs', () => {
    it('then it keeps the tab indentation', () => {
      writeProjectFile('.mcp.json', '{\n\t"mcpServers": {}\n}\n')

      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(readProjectFile('.mcp.json')).toContain(`\n\t\t"${MCP_SERVER_NAME}": {`)
    })
  })

  describe('when the config uses Windows line endings', () => {
    it('then it keeps CRLF line endings', () => {
      writeProjectFile('.mcp.json', '{\r\n  "mcpServers": {}\r\n}\r\n')

      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(readProjectFile('.mcp.json')).toContain(`{\r\n    "${MCP_SERVER_NAME}"`)
    })
  })

  describe.each([
    [
      '@maz-ui/mcp',
      {
        command: 'npx',
        args: ['@maz-ui/mcp'],
      },
    ],
    [
      'the maz-ui-mcp binary',
      { command: 'maz-ui-mcp' },
    ],
  ])('when %s is already registered under another name', (_, server) => {
    it('then it leaves the config unchanged and explains why', () => {
      const config = `${JSON.stringify({
        mcpServers: { 'maz-docs': server },
      }, null, 2)}\n`
      writeProjectFile('.mcp.json', config)

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(readProjectFile('.mcp.json')).toBe(config)
      expect(changeOf(result, '.mcp.json')).toEqual({
        file: '.mcp.json',
        action: 'unchanged',
        reason: '"maz-docs" runs a custom command: left untouched',
      })
    })
  })

  describe('when a maz-ui server with another command exists', () => {
    it('then it skips the file', () => {
      const config = `${JSON.stringify({
        mcpServers: {
          [MCP_SERVER_NAME]: { command: 'other' },
          empty: null,
        },
      }, null, 2)}\n`
      writeProjectFile('.mcp.json', config)

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(readProjectFile('.mcp.json')).toBe(config)
      expect(changeOf(result, '.mcp.json')).toEqual({
        file: '.mcp.json',
        action: 'skip',
        reason: `a "${MCP_SERVER_NAME}" server already exists with another command: left untouched`,
      })
    })
  })

  describe.each([
    ['malformed JSON', '{ "mcpServers": {'],
    ['an array', '[]'],
    ['null', 'null'],
    ['a number', '42'],
    ['a servers map that is not an object', '{ "mcpServers": 5 }'],
  ])('when the config contains %s', (_, content) => {
    it('then it leaves the file untouched', () => {
      writeProjectFile('.mcp.json', content)

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(readProjectFile('.mcp.json')).toBe(content)
      expect(changeOf(result, '.mcp.json')).toEqual({ file: '.mcp.json', action: 'skip', reason: 'invalid JSON: left untouched' })
    })
  })

  describe('when a custom MCP server command is given', () => {
    it('then it registers this command', () => {
      setupAgents({
        rootDir,
        docsDir,
        targets: ['cursor'],
        mcpServer: {
          command: 'node',
          args: ['./mcp.mjs'],
        },
      })

      expect(JSON.parse(readProjectFile('.cursor/mcp.json'))).toEqual({
        mcpServers: {
          [MCP_SERVER_NAME]: {
            command: 'node',
            args: ['./mcp.mjs'],
          },
        },
      })
    })
  })

  describe('when mcp is disabled', () => {
    it('then it writes no MCP config', () => {
      writeProjectFile('CLAUDE.md', '# my project')

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'cursor', 'vscode'],
        mcp: false,
      })

      expect(projectFileExists('.mcp.json')).toBe(false)
      expect(projectFileExists('.cursor/mcp.json')).toBe(false)
      expect(projectFileExists('.vscode/mcp.json')).toBe(false)
      expect(result.changes.map(change => change.file)).toEqual(['.claude/rules/maz-ui.md'])
    })
  })
})

describe('given setupAgents in remove mode', () => {
  describe('when everything was set up before', () => {
    let result: SetupAgentsResult

    beforeEach(() => {
      writeProjectFile('CLAUDE.md', '# my project')
      writeProjectFile('AGENTS.md', '# Project rules\n')
      writeProjectFile('.cursor/mcp.json', `${JSON.stringify({
        mcpServers: {
          github: { command: 'gh-mcp' },
        },
      }, null, 2)}\n`)
      setupAgents({
        rootDir,
        docsDir,
        targets: [
          'claude',
          'agents-md',
          'cursor',
          'vscode',
        ],
      })
      result = setupAgents({
        rootDir,
        targets: [
          'claude',
          'agents-md',
          'cursor',
          'vscode',
        ],
        remove: true,
      })
    })

    it('then it removes the rule', () => {
      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(false)
      expect(changeOf(result, '.claude/rules/maz-ui.md')?.action).toBe('remove')
    })

    it('then it removes the AGENTS.md section and keeps the user content', () => {
      expect(readProjectFile('AGENTS.md')).toBe('# Project rules\n')
      expect(changeOf(result, 'AGENTS.md')?.action).toBe('update')
    })

    it('then it deletes the MCP configs that only contained the maz-ui server', () => {
      expect(projectFileExists('.mcp.json')).toBe(false)
      expect(projectFileExists('.vscode/mcp.json')).toBe(false)
      expect(changeOf(result, '.mcp.json')?.action).toBe('remove')
    })

    it('then it keeps the other servers', () => {
      expect(JSON.parse(readProjectFile('.cursor/mcp.json'))).toEqual({
        mcpServers: {
          github: { command: 'gh-mcp' },
        },
      })
      expect(changeOf(result, '.cursor/mcp.json')?.action).toBe('update')
    })

    it('then it reports no version', () => {
      expect(result.version).toBe('')
    })

    it('then it leaves CLAUDE.md untouched', () => {
      expect(readProjectFile('CLAUDE.md')).toBe('# my project')
    })
  })

  describe('when AGENTS.md only contains the maz-ui section', () => {
    it('then it deletes AGENTS.md', () => {
      setupAgents({
        rootDir,
        docsDir,
        targets: ['agents-md'],
      })

      const result = setupAgents({
        rootDir,
        targets: ['agents-md'],
        remove: true,
      })

      expect(projectFileExists('AGENTS.md')).toBe(false)
      expect(changeOf(result, 'AGENTS.md')?.action).toBe('remove')
    })
  })

  describe('when nothing was set up', () => {
    it('then it changes nothing', () => {
      writeProjectFile('AGENTS.md', '# Project rules\n')

      const result = setupAgents({
        rootDir,
        targets: ['claude', 'agents-md', 'cursor'],
        remove: true,
      })

      expect(result.changes).toEqual([])
      expect(readProjectFile('AGENTS.md')).toBe('# Project rules\n')
    })
  })

  describe('when the maz-ui server is registered under another name', () => {
    it('then it keeps it', () => {
      const config = `${JSON.stringify({
        mcpServers: {
          'maz-docs': {
            command: 'npx',
            args: ['@maz-ui/mcp'],
          },
        },
      }, null, 2)}\n`
      writeProjectFile('.mcp.json', config)

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        remove: true,
      })

      expect(readProjectFile('.mcp.json')).toBe(config)
      expect(changeOf(result, '.mcp.json')).toBeUndefined()
    })
  })

  describe('when the MCP config has other root keys', () => {
    it('then it keeps the file with the other keys', () => {
      writeProjectFile('.vscode/mcp.json', `${JSON.stringify({
        inputs: [],
        servers: {
          [MCP_SERVER_NAME]: { type: 'stdio', ...DEFAULT_MCP_SERVER },
        },
      }, null, 2)}\n`)

      setupAgents({
        rootDir,
        targets: ['vscode'],
        remove: true,
      })

      expect(JSON.parse(readProjectFile('.vscode/mcp.json'))).toEqual({ inputs: [], servers: {} })
    })
  })
})

describe('given setupAgents in dry run mode', () => {
  describe('when the project is configured', () => {
    it('then it reports the changes without writing anything', () => {
      writeProjectFile('CLAUDE.md', '# my project')

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'agents-md', 'cursor'],
        dryRun: true,
      })

      expect(result.changes.map(change => [change.file, change.action])).toEqual([
        ['.claude/rules/maz-ui.md', 'create'],
        ['AGENTS.md', 'create'],
        ['.mcp.json', 'create'],
        ['.cursor/mcp.json', 'create'],
      ])
      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(false)
      expect(projectFileExists('AGENTS.md')).toBe(false)
      expect(projectFileExists('.mcp.json')).toBe(false)
      expect(projectFileExists('.cursor/mcp.json')).toBe(false)
    })
  })

  describe('when removing in dry run', () => {
    it('then it reports the removals without deleting files', () => {
      setupAgents({
        rootDir,
        docsDir,
        targets: ['agents-md'],
      })

      const result = setupAgents({
        rootDir,
        targets: ['agents-md'],
        remove: true,
        dryRun: true,
      })

      expect(changeOf(result, 'AGENTS.md')?.action).toBe('remove')
      expect(projectFileExists('AGENTS.md')).toBe(true)
    })
  })
})

describe('given setupAgents with the rules option disabled', () => {
  describe('when the claude and agents-md targets are configured', () => {
    let result: SetupAgentsResult

    beforeEach(() => {
      writeProjectFile('CLAUDE.md', '# my project')
      result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'agents-md'],
        rules: false,
      })
    })

    it('then it writes no rule file', () => {
      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(false)
      expect(projectFileExists('AGENTS.md')).toBe(false)
    })

    it('then it only registers the MCP server', () => {
      expect(result.changes).toEqual([
        { file: '.mcp.json', action: 'create' },
      ])
    })
  })

  describe('when maz-ui does not ship the agent docs', () => {
    it('then the MCP server is still registered', () => {
      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        rules: false,
      })

      expect(result.changes).toEqual([
        { file: '.mcp.json', action: 'create' },
      ])
      expect(result.version).toBe('')
    })
  })

  describe('when the rules were written before and remove is set', () => {
    it('then the rules are removed', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'agents-md'],
      })

      setupAgents({
        rootDir,
        targets: ['claude', 'agents-md'],
        rules: false,
        remove: true,
      })

      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(false)
      expect(projectFileExists('AGENTS.md')).toBe(false)
    })
  })
})

describe('given findProjectPackage', () => {
  describe('when the package is installed in a workspace folder of a monorepo', () => {
    it('then it is found from the monorepo root', () => {
      writeProjectFile('apps/web/node_modules/maz-ui/package.json', '{ "version": "5.2.0" }')

      expect(findProjectPackage(rootDir, 'maz-ui')).toBe(join(rootDir, 'apps/web/node_modules/maz-ui'))
    })
  })

  describe('when the package is installed in the packages folder', () => {
    it('then it is found from the monorepo root, files of the folder being ignored', () => {
      writeProjectFile('packages/README.md', '# packages')
      writeProjectFile('packages/ui/node_modules/maz-ui/package.json', '{ "version": "5.2.0" }')

      expect(findProjectPackage(rootDir, 'maz-ui')).toBe(join(rootDir, 'packages/ui/node_modules/maz-ui'))
    })
  })
})

describe('given readAgentDocs in a monorepo', () => {
  describe('when maz-ui is installed in an app and its version was bumped after the docs generation', () => {
    it('then the version of its package.json wins over the manifest', () => {
      const packageDir = join(rootDir, 'apps/web/node_modules/maz-ui')

      writeProjectFile('apps/web/node_modules/maz-ui/package.json', '{ "version": "5.2.0" }')
      createDocs(join(packageDir, 'docs'), { version: '5.1.0' })

      expect(readAgentDocs(rootDir).version).toBe('5.2.0')
    })
  })
})

describe('given writeFileAtomic', () => {
  describe('when the file and its folder do not exist', () => {
    it('then it creates them without leaving a temporary file', () => {
      writeFileAtomic(join(rootDir, 'nested/AGENTS.md'), '# rules\n')

      expect(readProjectFile('nested/AGENTS.md')).toBe('# rules\n')
      expect(readdirSync(join(rootDir, 'nested'))).toEqual(['AGENTS.md'])
    })
  })

  describe('when the file exists', () => {
    it('then it replaces its content', () => {
      writeProjectFile('AGENTS.md', '# old\n')

      writeFileAtomic(join(rootDir, 'AGENTS.md'), '# new\n')

      expect(readProjectFile('AGENTS.md')).toBe('# new\n')
      expect(readdirSync(rootDir)).toEqual(['AGENTS.md'])
    })
  })

  describe('when the target path is a folder', () => {
    it('then it throws and removes the temporary file', () => {
      mkdirSync(join(rootDir, 'AGENTS.md/child'), { recursive: true })

      expect(() => writeFileAtomic(join(rootDir, 'AGENTS.md'), '# rules\n')).toThrow()
      expect(readdirSync(rootDir)).toEqual(['AGENTS.md'])
    })
  })
})

describe('given compareVersions', () => {
  describe.each([
    ['5.1.0', '5.0.9', 1],
    ['5.0.9', '5.1.0', -1],
    ['5.1.0', '5.1.0', 0],
    ['v5.1.0', '5.1.0', 0],
    ['5.10.0', '5.9.0', 1],
    ['5.1.0', '5.1.0-beta.1', 1],
    ['5.1.0-beta.1', '5.1.0', -1],
    ['5.1.0-beta.2', '5.1.0-beta.10', -1],
    ['5.1.0-rc.1', '5.1.0-beta.3', 1],
    ['5.1.0-beta', '5.1.0-beta.1', -1],
    ['5.1.0-beta.1', '5.1.0-1', 1],
    ['5.1.0+build.2', '5.1.0+build.1', 0],
    ['5.1', '5.1.0', 0],
    ['5.1.0', '5.1', 0],
    ['5.x.0', '5.0.0', 0],
    ['5.1.0-1', '5.1.0-beta.1', -1],
    ['5.1.0-beta.1', '5.1.0-beta', 1],
  ])('when comparing %s with %s', (a, b, expected) => {
    it(`then its sign is ${expected}`, () => {
      expect(Math.sign(compareVersions(a, b))).toBe(expected)
    })
  })
})

describe('given readManagedVersion', () => {
  describe('when the content has the managed header', () => {
    it('then it returns the version of the header', () => {
      expect(readManagedVersion(`<!-- ${MANAGED_MARKER} 5.1.0-beta.1: generated by init -->`)).toBe('5.1.0-beta.1')
    })
  })

  describe('when the content has no managed header', () => {
    it('then it returns undefined', () => {
      expect(readManagedVersion('# my rules')).toBeUndefined()
      expect(readManagedVersion(undefined)).toBeUndefined()
    })
  })
})

describe('given setupAgents in a monorepo whose apps install different maz-ui versions', () => {
  describe('when the rules were written by a newer maz-ui', () => {
    let result: SetupAgentsResult
    let ruleBefore: string
    let agentsMdBefore: string

    beforeEach(() => {
      writeProjectFile('CLAUDE.md', '# my project')
      writeProjectFile('AGENTS.md', '# Project rules\n')
      createDocs(docsDir, { version: '5.2.0', claudeRule: '# maz-ui\n\nNewer rules.', agentsSection: '## maz-ui\n\nNewer rules.' })
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'agents-md'],
      })
      ruleBefore = readProjectFile('.claude/rules/maz-ui.md')
      agentsMdBefore = readProjectFile('AGENTS.md')
      createDocs(docsDir, { version: '5.1.0', claudeRule: '# maz-ui\n\nOlder rules.', agentsSection: '## maz-ui\n\nOlder rules.' })

      result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'agents-md'],
      })
    })

    it('then it keeps the Claude Code rule of the newer version', () => {
      expect(readProjectFile('.claude/rules/maz-ui.md')).toBe(ruleBefore)
      expect(changeOf(result, '.claude/rules/maz-ui.md')).toEqual({
        file: '.claude/rules/maz-ui.md',
        action: 'skip',
        reason: 'written by maz-ui 5.2.0, newer than the installed 5.1.0: left untouched',
      })
    })

    it('then it keeps the AGENTS.md section of the newer version', () => {
      expect(readProjectFile('AGENTS.md')).toBe(agentsMdBefore)
      expect(changeOf(result, 'AGENTS.md')?.action).toBe('skip')
    })
  })

  describe('when the rules were written by an older maz-ui', () => {
    it('then it updates them', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      createDocs(docsDir, { version: '5.1.0-beta.1' })
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'agents-md'],
      })
      createDocs(docsDir, { version: '5.1.0', claudeRule: '# maz-ui\n\nStable rules.', agentsSection: '## maz-ui\n\nStable rules.' })

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'agents-md'],
      })

      expect(changeOf(result, '.claude/rules/maz-ui.md')?.action).toBe('update')
      expect(changeOf(result, 'AGENTS.md')?.action).toBe('update')
      expect(readProjectFile('AGENTS.md')).toContain('Stable rules.')
    })
  })

  describe('when the rules of a newer maz-ui are removed', () => {
    it('then it removes them', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      createDocs(docsDir, { version: '9.0.0' })
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        remove: true,
      })

      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(false)
    })
  })
})

describe('given mcpServerCommand', () => {
  describe('when the project does not install @maz-ui/mcp', () => {
    it('then npx downloads the pinned version', () => {
      writeProjectFile('package.json', JSON.stringify({
        devDependencies: { 'maz-ui': '^5.0.0' },
      }))

      expect(mcpServerCommand(rootDir, '5.2.0')).toEqual({
        command: 'npx',
        args: ['-y', '@maz-ui/mcp@5.2.0'],
      })
    })

    it('then npx downloads the latest version when no version is given', () => {
      expect(mcpServerCommand(rootDir)).toEqual(DEFAULT_MCP_SERVER)
    })
  })

  describe.each([
    [
      'the packageManager field declares pnpm',
      { packageManager: 'pnpm@10.0.0' },
      undefined,
      {
        command: 'pnpm',
        args: ['exec', 'maz-ui-mcp'],
      },
    ],
    [
      'the packageManager field declares yarn',
      { packageManager: 'yarn@4.0.0' },
      undefined,
      {
        command: 'yarn',
        args: ['run', 'maz-ui-mcp'],
      },
    ],
    [
      'the packageManager field declares an unknown manager',
      { packageManager: 'deno@2.0.0' },
      undefined,
      {
        command: 'npx',
        args: ['--no-install', 'maz-ui-mcp'],
      },
    ],
    [
      'the project has a pnpm lockfile',
      {},
      'pnpm-lock.yaml',
      {
        command: 'pnpm',
        args: ['exec', 'maz-ui-mcp'],
      },
    ],
    [
      'the project has a yarn lockfile',
      {},
      'yarn.lock',
      {
        command: 'yarn',
        args: ['run', 'maz-ui-mcp'],
      },
    ],
    [
      'the project has a bun lockfile',
      {},
      'bun.lock',
      {
        command: 'bun',
        args: ['x', '--no-install', 'maz-ui-mcp'],
      },
    ],
    [
      'the project has a binary bun lockfile',
      {},
      'bun.lockb',
      {
        command: 'bun',
        args: ['x', '--no-install', 'maz-ui-mcp'],
      },
    ],
    [
      'the project has no lockfile',
      {},
      undefined,
      {
        command: 'npx',
        args: ['--no-install', 'maz-ui-mcp'],
      },
    ],
  ])('when the project installs @maz-ui/mcp and %s', (_, fields, lockfile, expected) => {
    it('then its package manager starts the installed version', () => {
      writeProjectFile('package.json', JSON.stringify({
        ...fields,
        devDependencies: { '@maz-ui/mcp': '^5.1.0' },
      }))

      if (lockfile)
        writeProjectFile(lockfile, '')

      expect(mcpServerCommand(rootDir, '5.2.0')).toEqual(expected)
    })
  })
})

describe('given installsMcpPackage', () => {
  describe.each([
    ['dependencies', true],
    ['devDependencies', true],
    ['optionalDependencies', true],
    ['peerDependencies', false],
  ])('when @maz-ui/mcp is in %s', (field, expected) => {
    it(`then it returns ${expected}`, () => {
      writeProjectFile('package.json', JSON.stringify({
        [field]: { '@maz-ui/mcp': '^5.1.0' },
      }))

      expect(installsMcpPackage(rootDir)).toBe(expected)
    })
  })

  describe('when the package.json is missing or invalid', () => {
    it('then it returns false', () => {
      expect(installsMcpPackage(rootDir)).toBe(false)

      writeProjectFile('package.json', '{ invalid')

      expect(installsMcpPackage(rootDir)).toBe(false)
      expect(detectPackageManager(rootDir)).toBe('npm')
    })
  })
})

describe('given setupAgents with the command of the MCP server', () => {
  function registered(command: string, args: string[], extra: Record<string, unknown> = {}): void {
    writeProjectFile('.mcp.json', `${JSON.stringify({
      mcpServers: {
        [MCP_SERVER_NAME]: {
          type: 'stdio',
          command,
          args,
          ...extra,
        },
      },
    }, null, 2)}\n`)
  }

  function server(): Record<string, unknown> {
    return JSON.parse(readProjectFile('.mcp.json')).mcpServers[MCP_SERVER_NAME]
  }

  describe('when a version is given and the project does not install @maz-ui/mcp', () => {
    it('then the config pins it and the result reports a remote server', () => {
      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        mcpVersion: '5.2.0',
      })

      expect(server()).toEqual({
        type: 'stdio',
        command: 'npx',
        args: ['-y', '@maz-ui/mcp@5.2.0'],
      })
      expect(result.mcpServer).toEqual({
        command: 'npx',
        args: ['-y', '@maz-ui/mcp@5.2.0'],
      })
      expect(result.localMcpServer).toBe(false)
    })
  })

  describe('when the project installs @maz-ui/mcp', () => {
    it('then the config starts the installed version and the result reports a local server', () => {
      writeProjectFile('package.json', JSON.stringify({
        packageManager: 'pnpm@10.0.0',
        devDependencies: { '@maz-ui/mcp': '^5.1.0' },
      }))

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        mcpVersion: '5.2.0',
      })

      expect(server()).toEqual({
        type: 'stdio',
        command: 'pnpm',
        args: ['exec', 'maz-ui-mcp'],
      })
      expect(result.localMcpServer).toBe(true)
    })
  })

  describe('when the entry runs the latest version with other fields', () => {
    let result: SetupAgentsResult

    beforeEach(() => {
      registered('npx', ['-y', '@maz-ui/mcp@latest'], {
        env: { DEBUG: '1' },
      })
      result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        mcpVersion: '5.2.0',
      })
    })

    it('then it pins the version and keeps the other fields', () => {
      expect(server()).toEqual({
        type: 'stdio',
        command: 'npx',
        args: ['-y', '@maz-ui/mcp@5.2.0'],
        env: { DEBUG: '1' },
      })
    })

    it('then it explains the change', () => {
      expect(changeOf(result, '.mcp.json')).toEqual({ file: '.mcp.json', action: 'update', reason: `"${MCP_SERVER_NAME}" now runs npx -y @maz-ui/mcp@5.2.0` })
    })
  })

  describe('when the entry pins a newer version than the given one', () => {
    it('then it keeps it', () => {
      registered('npx', ['-y', '@maz-ui/mcp@5.3.0'])

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        mcpVersion: '5.2.0',
      })

      expect(server().args).toEqual(['-y', '@maz-ui/mcp@5.3.0'])
      expect(changeOf(result, '.mcp.json')).toEqual({ file: '.mcp.json', action: 'unchanged', reason: `"${MCP_SERVER_NAME}" runs @maz-ui/mcp 5.3.0` })
    })
  })

  describe('when the entry pins an older version than the given one', () => {
    it('then it pins the newer one', () => {
      registered('npx', ['-y', '@maz-ui/mcp@5.1.0'])

      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        mcpVersion: '5.2.0',
      })

      expect(server().args).toEqual(['-y', '@maz-ui/mcp@5.2.0'])
    })
  })

  describe('when the entry pins a version and no version is given', () => {
    it('then it keeps the pinned version instead of the latest one', () => {
      registered('npx', ['-y', '@maz-ui/mcp@5.1.0'])

      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(server().args).toEqual(['-y', '@maz-ui/mcp@5.1.0'])
    })
  })

  describe('when the entry pins a version and the project now installs @maz-ui/mcp', () => {
    it('then it starts the installed version', () => {
      registered('npx', ['-y', '@maz-ui/mcp@5.3.0'])
      writeProjectFile('package.json', JSON.stringify({
        devDependencies: { '@maz-ui/mcp': '^5.1.0' },
      }))

      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(server()).toEqual({
        type: 'stdio',
        command: 'npx',
        args: ['--no-install', 'maz-ui-mcp'],
      })
    })
  })

  describe('when the entry starts the installed version and the project no longer installs it', () => {
    it('then npx downloads the given version', () => {
      registered('pnpm', ['exec', 'maz-ui-mcp'])

      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        mcpVersion: '5.2.0',
      })

      expect(server()).toEqual({
        type: 'stdio',
        command: 'npx',
        args: ['-y', '@maz-ui/mcp@5.2.0'],
      })
    })
  })

  describe('when the entry runs a custom command', () => {
    it('then it leaves it untouched', () => {
      registered('npx', [
        '-y',
        '@maz-ui/mcp@latest',
        '--docs',
        'apps/web/node_modules/maz-ui/docs',
      ])
      const before = readProjectFile('.mcp.json')

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        mcpVersion: '5.2.0',
      })

      expect(readProjectFile('.mcp.json')).toBe(before)
      expect(changeOf(result, '.mcp.json')?.reason).toBe(`"${MCP_SERVER_NAME}" runs a custom command: left untouched`)
    })
  })
})

describe('given setupAgents with rules edited by hand', () => {
  function upgradeDocs(): void {
    createDocs(docsDir, { version: '5.2.0', claudeRule: '# maz-ui\n\nNew rules.', agentsSection: '## maz-ui\n\nNew rules.' })
  }

  describe('when the Claude Code rule was edited', () => {
    let result: SetupAgentsResult
    let edited: string

    beforeEach(() => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })
      edited = readProjectFile('.claude/rules/maz-ui.md').replace('Use maz-ui components.', 'Use maz-ui components, and MazBtn for links.')
      writeProjectFile('.claude/rules/maz-ui.md', edited)
      upgradeDocs()
      result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })
    })

    it('then it keeps the edits', () => {
      expect(readProjectFile('.claude/rules/maz-ui.md')).toBe(edited)
    })

    it('then it explains how to get the new rules', () => {
      expect(changeOf(result, '.claude/rules/maz-ui.md')).toEqual({
        file: '.claude/rules/maz-ui.md',
        action: 'skip',
        reason: 'edited since it was generated: left untouched, delete it to get the rules of maz-ui 5.2.0',
      })
    })
  })

  describe('when a formatter only changed the whitespace of the rule', () => {
    it('then it updates the rule', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })
      writeProjectFile('.claude/rules/maz-ui.md', `${readProjectFile('.claude/rules/maz-ui.md').replaceAll('\n\n', '\n\n\n').replace('Use maz-ui', 'Use   maz-ui')}  \n`)
      upgradeDocs()

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(changeOf(result, '.claude/rules/maz-ui.md')?.action).toBe('update')
      expect(readProjectFile('.claude/rules/maz-ui.md')).toContain('New rules.')
    })
  })

  describe('when the rule was written by a version without checksum', () => {
    it('then it updates the rule', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      writeProjectFile('.claude/rules/maz-ui.md', `<!-- ${MANAGED_MARKER} 5.0.0: generated by init -->\n\n# maz-ui\n\nOld rules edited.\n`)

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(changeOf(result, '.claude/rules/maz-ui.md')?.action).toBe('update')
    })
  })

  describe('when the AGENTS.md section was edited', () => {
    it('then it keeps the section and explains how to get the new rules', () => {
      writeProjectFile('AGENTS.md', '# Project rules\n')
      setupAgents({
        rootDir,
        docsDir,
        targets: ['agents-md'],
      })
      const edited = readProjectFile('AGENTS.md').replace('Use maz-ui components.', 'Use our wrappers of maz-ui.')
      writeProjectFile('AGENTS.md', edited)
      upgradeDocs()

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['agents-md'],
      })

      expect(readProjectFile('AGENTS.md')).toBe(edited)
      expect(changeOf(result, 'AGENTS.md')).toEqual({
        file: 'AGENTS.md',
        action: 'skip',
        reason: 'the maz-ui section was edited since it was generated: left untouched, delete the section to get the rules of maz-ui 5.2.0',
      })
    })
  })

  describe('when only the content around the AGENTS.md section was edited', () => {
    it('then it updates the section and keeps the edits', () => {
      setupAgents({
        rootDir,
        docsDir,
        targets: ['agents-md'],
      })
      writeProjectFile('AGENTS.md', `# Team rules\n\nUse pnpm.\n\n${readProjectFile('AGENTS.md')}\n## Testing\n`)
      upgradeDocs()

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['agents-md'],
      })
      const content = readProjectFile('AGENTS.md')

      expect(changeOf(result, 'AGENTS.md')?.action).toBe('update')
      expect(content).toContain('New rules.')
      expect(content.startsWith('# Team rules\n\nUse pnpm.')).toBe(true)
      expect(content).toContain('## Testing')
    })
  })

  describe('when edited rules are removed', () => {
    it('then they are removed', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })
      writeProjectFile('.claude/rules/maz-ui.md', `${readProjectFile('.claude/rules/maz-ui.md')}\nMy edit.\n`)

      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        remove: true,
      })

      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(false)
    })
  })
})

describe('given isEditedManagedContent', () => {
  describe.each([
    ['no content', undefined],
    ['content without the managed header', '# my rules'],
    ['a header without checksum', `<!-- ${MANAGED_MARKER} 5.0.0: generated -->\n\n# rules`],
  ])('when it receives %s', (_, content) => {
    it('then it returns false', () => {
      expect(isEditedManagedContent(content)).toBe(false)
    })
  })
})

function writePackage(folder: string, fields: Record<string, unknown>): void {
  writeProjectFile(join(folder, 'package.json'), JSON.stringify({ name: folder || 'root', ...fields }))
}

const RULE_FILE = '.claude/rules/maz-ui.md'

describe('given findWorkspacesUsing', () => {
  describe('when only some workspaces of a monorepo depend on the packages', () => {
    it('then it returns those workspaces, whatever the dependency field', () => {
      writeProjectFile('pnpm-workspace.yaml', 'packages:\n  - apps/*\n  - packages/*\n')
      writePackage('', {
        devDependencies: { '@maz-ui/mcp': '^5.0.0' },
      })
      writePackage('apps/pwa', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })
      writePackage('apps/api', {
        dependencies: { fastify: '^5.0.0' },
      })
      writePackage('packages/ui', {
        peerDependencies: { '@maz-ui/themes': '^5.0.0' },
      })
      writePackage('packages/kit', {
        devDependencies: { '@maz-ui/icons': '^5.0.0' },
      })

      expect(findWorkspacesUsing(rootDir, ['maz-ui', '@maz-ui/themes', '@maz-ui/icons']).sort()).toEqual(['apps/pwa', 'packages/kit', 'packages/ui'])
    })
  })

  describe('when the root of the project depends on the packages', () => {
    it('then it returns the root as an empty folder', () => {
      writePackage('', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })

      expect(findWorkspacesUsing(rootDir, ['maz-ui'])).toEqual([''])
    })
  })

  describe('when nothing depends on the packages', () => {
    it('then it returns nothing', () => {
      writePackage('', {
        dependencies: { vue: '^3.5.0' },
      })

      expect(findWorkspacesUsing(rootDir, ['maz-ui'])).toEqual([])
    })
  })
})

describe('given resolveRulePaths', () => {
  const tool: AgentsTool = {
    ...MAZ_UI_AGENTS_TOOL,
    packages: ['maz-ui'],
    ruleGlobs: ['**/*.vue', 'tailwind.config.*'],
  }

  describe('when a workspace of a monorepo depends on the tool', () => {
    it('then it scopes the rule to the files of that workspace', () => {
      writeProjectFile('pnpm-workspace.yaml', 'packages:\n  - apps/*\n')
      writePackage('', {
        devDependencies: { '@maz-ui/mcp': '^5.0.0' },
      })
      writePackage('apps/pwa', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })
      writePackage('apps/api', {})

      expect(resolveRulePaths(rootDir, tool)).toEqual(['apps/pwa/**/*.vue', 'apps/pwa/tailwind.config.*'])
    })
  })

  describe('when a single package project depends on the tool', () => {
    it('then it scopes the rule to the files of the tool in the whole project', () => {
      writePackage('', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })

      expect(resolveRulePaths(rootDir, tool)).toEqual(['**/*.vue', 'tailwind.config.*'])
    })
  })

  describe('when the root and a workspace depend on the tool', () => {
    it('then the root scope covers the project', () => {
      writeProjectFile('pnpm-workspace.yaml', 'packages:\n  - apps/*\n')
      writePackage('', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })
      writePackage('apps/pwa', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })

      expect(resolveRulePaths(rootDir, tool)).toEqual(['**/*.vue', 'tailwind.config.*'])
    })
  })

  describe('when no package.json depends on the tool', () => {
    it('then it scopes the rule to the files of the tool in the whole project', () => {
      expect(resolveRulePaths(rootDir, tool)).toEqual(['**/*.vue', 'tailwind.config.*'])
    })
  })

  describe('when the tool declares no package', () => {
    it('then the rule is always loaded', () => {
      expect(resolveRulePaths(rootDir, { ...tool, packages: undefined })).toBeUndefined()
    })
  })

  describe('when the tool applies to the whole project', () => {
    it('then the rule is always loaded', () => {
      writePackage('', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })

      expect(resolveRulePaths(rootDir, { ...tool, ruleGlobs: undefined })).toBeUndefined()
    })
  })

  describe('when the paths option is all', () => {
    it('then the rule is always loaded', () => {
      expect(resolveRulePaths(rootDir, tool, 'all')).toBeUndefined()
    })
  })

  describe('when the paths option lists globs', () => {
    it('then they are used as is, without duplicates', () => {
      expect(resolveRulePaths(rootDir, tool, [' src/** ', 'src/**', ''])).toEqual(['src/**'])
    })
  })

  describe('when the paths option is an empty list or matches everything', () => {
    it.each([
      [[]],
      [
        ['**/*'],
      ],
      [
        ['src/**', '**'],
      ],
    ])('then the rule is always loaded for %j', (paths) => {
      expect(resolveRulePaths(rootDir, tool, paths)).toBeUndefined()
    })
  })
})

describe('given setupAgents with the claude rule scope', () => {
  const rulePaths = '---\npaths:\n  - "apps/pwa/**/*.{vue,ts,tsx,css,scss}"\n---\n\n<!-- Managed by maz-ui'

  function createMonorepo(): void {
    writeProjectFile('CLAUDE.md', '# my project')
    writeProjectFile('pnpm-workspace.yaml', 'packages:\n  - apps/*\n')
    writePackage('', {
      devDependencies: { '@maz-ui/mcp': '^5.0.0' },
    })
    writePackage('apps/pwa', {
      dependencies: { 'maz-ui': '^5.0.0' },
    })
    writePackage('apps/api', {})
  }

  describe('when a workspace of a monorepo depends on maz-ui', () => {
    it('then the frontmatter is the first thing of the rule, before the managed header', () => {
      createMonorepo()

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(readProjectFile(RULE_FILE).startsWith(rulePaths)).toBe(true)
      expect(result.claudeRulePaths).toEqual(['apps/pwa/**/*.{vue,ts,tsx,css,scss}'])
      expect(isEditedManagedContent(readProjectFile(RULE_FILE))).toBe(false)
    })

    it('then a second run changes nothing', () => {
      createMonorepo()
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(changeOf(setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      }), RULE_FILE)?.action).toBe('unchanged')
    })
  })

  describe('when the paths option is all', () => {
    it('then the rule starts with the managed header, without frontmatter', () => {
      createMonorepo()

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        paths: 'all',
      })

      expect(readProjectFile(RULE_FILE).startsWith('<!-- Managed by maz-ui')).toBe(true)
      expect(result.claudeRulePaths).toBeUndefined()
    })
  })

  describe('when the paths option lists globs', () => {
    it('then the rule is scoped to them', () => {
      createMonorepo()

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        paths: ['web/**', 'docs/**/*.vue'],
      })

      expect(readProjectFile(RULE_FILE).startsWith('---\npaths:\n  - "web/**"\n  - "docs/**/*.vue"\n---\n\n<!-- Managed by maz-ui')).toBe(true)
      expect(result.claudeRulePaths).toEqual(['web/**', 'docs/**/*.vue'])
    })
  })

  describe('when the rule was generated before the frontmatter existed', () => {
    it('then it is updated with the frontmatter, in place of being taken for an edited rule', () => {
      createMonorepo()
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        paths: 'all',
      })
      expect(readProjectFile(RULE_FILE).startsWith('<!-- Managed by maz-ui')).toBe(true)

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(changeOf(result, RULE_FILE)).toEqual({ file: RULE_FILE, action: 'update' })
      expect(readProjectFile(RULE_FILE).startsWith(rulePaths)).toBe(true)
    })

    it('then an old rule edited by hand is kept', () => {
      createMonorepo()
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        paths: 'all',
      })
      writeProjectFile(RULE_FILE, `${readProjectFile(RULE_FILE)}\nMy own rule.\n`)

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(changeOf(result, RULE_FILE)?.action).toBe('skip')
      expect(readProjectFile(RULE_FILE).startsWith('<!-- Managed by maz-ui')).toBe(true)
    })
  })

  describe('when a rule with frontmatter is edited by hand', () => {
    it('then the edit is detected and the rule is kept', () => {
      createMonorepo()
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })
      writeProjectFile(RULE_FILE, `${readProjectFile(RULE_FILE)}\nMy own rule.\n`)

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(isEditedManagedContent(readProjectFile(RULE_FILE))).toBe(true)
      expect(changeOf(result, RULE_FILE)?.action).toBe('skip')
      expect(readProjectFile(RULE_FILE)).toContain('My own rule.')
    })
  })

  describe('when the workspace list changes', () => {
    it('then the frontmatter is rewritten and the rule is not taken for an edited one', () => {
      createMonorepo()
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })
      writePackage('apps/admin', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(changeOf(result, RULE_FILE)?.action).toBe('update')
      expect(readProjectFile(RULE_FILE)).toContain('  - "apps/admin/**/*.{vue,ts,tsx,css,scss}"')
    })
  })

  describe('when the rule is removed', () => {
    it('then the file with its frontmatter is deleted', () => {
      createMonorepo()
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
        remove: true,
      })

      expect(changeOf(result, RULE_FILE)?.action).toBe('remove')
      expect(projectFileExists(RULE_FILE)).toBe(false)
    })
  })

  describe('when another tool declares its own packages and globs', () => {
    it('then its rule is scoped to the workspaces that depend on them', () => {
      createMonorepo()
      writePackage('apps/api', {
        devDependencies: { relizy: '^1.0.0' },
      })
      const tool: AgentsTool = {
        ...MAZ_UI_AGENTS_TOOL,
        name: 'relizy',
        packages: ['relizy'],
        ruleGlobs: ['relizy.config.*'],
      }

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool,
        agentDocs: {
          directory: docsDir,
          version: '1.0.0',
          claudeRule: '# relizy\n\nRules.',
          agentsMdSection: '## relizy',
        },
      })

      expect(result.claudeRulePaths).toEqual(['apps/api/relizy.config.*'])
      expect(readProjectFile('.claude/rules/relizy.md').startsWith('---\npaths:\n  - "apps/api/relizy.config.*"\n---\n\n<!-- Managed by relizy 1.0.0')).toBe(true)
    })
  })
})

describe('given readWorkspacePatterns', () => {
  describe('when the project has a pnpm-workspace.yaml', () => {
    it('then it returns its packages without negations', () => {
      writeProjectFile('pnpm-workspace.yaml', 'catalog:\n  vue: ^3.5.0\n\npackages:\n  - \'projects/*\'\n  # the docs\n  - "sites/**"\n  - ./tools/cli/\n  - \'!projects/legacy\'\n  - .\n\nonlyBuiltDependencies:\n  - esbuild\n')

      expect(readWorkspacePatterns(rootDir)).toEqual([
        'projects/*',
        'sites/**',
        'tools/cli',
        '.',
      ])
    })
  })

  describe.each([
    [
      'an array',
      ['web', 'libs/*'],
    ],
    [
      'an object',
      {
        packages: ['web', 'libs/*'],
      },
    ],
  ])('when the workspaces of package.json are %s', (_, workspaces) => {
    it('then it returns them', () => {
      writeProjectFile('package.json', JSON.stringify({ workspaces }))

      expect(readWorkspacePatterns(rootDir)).toEqual(['web', 'libs/*'])
    })
  })

  describe('when the project declares no workspace', () => {
    it('then it returns apps/* and packages/*', () => {
      writeProjectFile('pnpm-workspace.yaml', 'catalog:\n  vue: ^3.5.0\n')

      expect(readWorkspacePatterns(rootDir)).toEqual(['apps/*', 'packages/*'])
    })
  })
})

describe('given findWorkspaceDirs', () => {
  describe('when the patterns use single, double stars and exact folders', () => {
    it('then it returns the matching folders in the order of the patterns', () => {
      writeProjectFile('package.json', JSON.stringify({
        workspaces: [
          'web',
          'libs/*',
          'sites/**',
          'missing/*',
          '*-app',
          '.',
        ],
      }))
      for (const file of [
        'blog-app/package.json',
        'web/package.json',
        'libs/a/package.json',
        'libs/b/package.json',
        'libs/a/src/index.ts',
        'sites/docs/client/package.json',
        'libs/node_modules/x/package.json',
        'libs/.cache/x',
      ])
        writeProjectFile(file, '')

      expect(findWorkspaceDirs(rootDir)).toEqual([
        'web',
        'libs/a',
        'libs/b',
        'sites',
        'sites/docs',
        'sites/docs/client',
        'blog-app',
      ].map(folder => join(rootDir, folder)))
    })
  })
})

describe('given findProjectPackage with the workspaces of pnpm-workspace.yaml', () => {
  describe('when the package is installed in a workspace outside apps and packages', () => {
    it('then it is found from the monorepo root', () => {
      writeProjectFile('pnpm-workspace.yaml', 'packages:\n  - projects/*\n')
      writeProjectFile('projects/shop/node_modules/maz-ui/package.json', '{ "version": "5.2.0" }')

      expect(findProjectPackage(rootDir, 'maz-ui')).toBe(join(rootDir, 'projects/shop/node_modules/maz-ui'))
    })
  })
})

const RELIZY: AgentsTool = {
  name: 'relizy',
  mcpPackage: 'relizy',
  mcpBin: 'relizy',
  mcpArgs: ['mcp'],
  generatedBy: '`relizy mcp init`',
}

function relizyDocs(version = '1.14.0'): AgentDocs {
  return {
    directory: '/relizy/agent-docs',
    version,
    claudeRule: '# relizy\n\nPreview the release first.',
    agentsMdSection: '## relizy\n\nPreview the release first.',
  }
}

function relizyServer(): Record<string, unknown> {
  return JSON.parse(readProjectFile('.mcp.json')).mcpServers.relizy
}

describe('given MAZ_UI_AGENTS_TOOL', () => {
  describe('when its values are read', () => {
    it('then they match the maz-ui constants', () => {
      expect(MAZ_UI_AGENTS_TOOL).toEqual(expect.objectContaining({ name: MCP_SERVER_NAME, mcpPackage: '@maz-ui/mcp', mcpBin: 'maz-ui-mcp' }))
      expect(`Managed by ${MAZ_UI_AGENTS_TOOL.name}`).toBe(MANAGED_MARKER)
    })
  })
})

describe('given setupAgents with the rules of maz-ui passed with agentDocs', () => {
  describe('when the claude target is configured', () => {
    it('then it writes these rules without reading the docs folder', () => {
      writeProjectFile('CLAUDE.md', '# my project')

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        agentDocs: {
          directory: '/nowhere',
          version: '5.4.0',
          claudeRule: '# maz-ui\n\nGiven rules.',
          agentsMdSection: '## maz-ui',
        },
      })

      expect(readProjectFile('.claude/rules/maz-ui.md')).toContain('# maz-ui\n\n> maz-ui 5.4.0 is installed: these rules and the docs in `node_modules/maz-ui/docs` match this version.\n\nGiven rules.')
      expect(result.version).toBe('5.4.0')
    })
  })
})

describe('given setupAgents with another tool', () => {
  describe('when the claude and agents-md targets are configured', () => {
    let result: SetupAgentsResult

    beforeEach(() => {
      writeProjectFile('CLAUDE.md', '# my project')
      result = setupAgents({
        rootDir,
        targets: ['claude', 'agents-md'],
        tool: RELIZY,
        agentDocs: relizyDocs(),
        mcpVersion: '1.14.0',
      })
    })

    it('then it writes the rule of the tool with its marker, generator and version', () => {
      const rule = readProjectFile('.claude/rules/relizy.md')

      expect(rule).toMatch(/^<!-- Managed by relizy 1\.14\.0 \(sha256:[\da-f]{12}\): generated by `relizy mcp init`\. Do not edit/)
      expect(rule).toContain('# relizy\n\n> relizy 1.14.0 is installed: these rules match this version.\n\nPreview the release first.')
      expect(readManagedVersion(rule, RELIZY)).toBe('1.14.0')
      expect(readManagedVersion(rule)).toBeUndefined()
      expect(isEditedManagedContent(rule, RELIZY)).toBe(false)
      expect(changeOf(result, '.claude/rules/relizy.md')?.action).toBe('create')
    })

    it('then it writes the AGENTS.md section between the markers of the tool', () => {
      const agentsMd = readProjectFile('AGENTS.md')

      expect(agentsMd.startsWith('<!-- BEGIN:relizy -->\n\n<!-- Managed by relizy 1.14.0')).toBe(true)
      expect(agentsMd).toContain('## relizy\n\n> relizy 1.14.0 is installed')
      expect(agentsMd.trimEnd().endsWith('<!-- END:relizy -->')).toBe(true)
    })

    it('then it registers the MCP server of the tool under its name with its arguments', () => {
      expect(relizyServer()).toEqual({
        type: 'stdio',
        command: 'npx',
        args: ['-y', 'relizy@1.14.0', 'mcp'],
      })
      expect(result.mcpServer).toEqual({
        command: 'npx',
        args: ['-y', 'relizy@1.14.0', 'mcp'],
      })
      expect(result.localMcpServer).toBe(false)
    })

    it('then a second run changes nothing', () => {
      const second = setupAgents({
        rootDir,
        targets: ['claude', 'agents-md'],
        tool: RELIZY,
        agentDocs: relizyDocs(),
        mcpVersion: '1.14.0',
      })

      expect(second.changes.map(change => change.action)).toEqual(['unchanged', 'unchanged', 'unchanged'])
      expect(changeOf(second, '.mcp.json')?.reason).toBe('relizy MCP server already registered as "relizy"')
    })
  })

  describe('when the project is already set up for maz-ui', () => {
    beforeEach(() => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({
        rootDir,
        docsDir,
        targets: ['claude', 'agents-md'],
      })
      setupAgents({
        rootDir,
        targets: ['claude', 'agents-md'],
        tool: RELIZY,
        agentDocs: relizyDocs(),
      })
    })

    it('then both tools keep their own rules, section and server', () => {
      const agentsMd = readProjectFile('AGENTS.md')

      expect(readProjectFile('.claude/rules/maz-ui.md')).toContain(MANAGED_MARKER)
      expect(readProjectFile('.claude/rules/relizy.md')).toContain('Managed by relizy')
      expect(agentsMd).toContain(AGENTS_MD_BEGIN)
      expect(agentsMd).toContain('<!-- BEGIN:relizy -->')
      expect(Object.keys(JSON.parse(readProjectFile('.mcp.json')).mcpServers)).toEqual([MCP_SERVER_NAME, 'relizy'])
    })

    it('then removing the tool keeps everything of maz-ui', () => {
      setupAgents({
        rootDir,
        targets: ['claude', 'agents-md'],
        tool: RELIZY,
        remove: true,
      })

      const agentsMd = readProjectFile('AGENTS.md')

      expect(projectFileExists('.claude/rules/relizy.md')).toBe(false)
      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(true)
      expect(agentsMd).toContain(AGENTS_MD_BEGIN)
      expect(agentsMd).not.toContain('BEGIN:relizy')
      expect(Object.keys(JSON.parse(readProjectFile('.mcp.json')).mcpServers)).toEqual([MCP_SERVER_NAME])
    })
  })

  describe('when its rule file exists and was not generated by the tool', () => {
    it('then it leaves it untouched', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      writeProjectFile('.claude/rules/relizy.md', '# my relizy rules')

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool: RELIZY,
        agentDocs: relizyDocs(),
      })

      expect(readProjectFile('.claude/rules/relizy.md')).toBe('# my relizy rules')
      expect(changeOf(result, '.claude/rules/relizy.md')?.reason).toBe('file exists and was not generated by relizy: left untouched')
    })
  })

  describe('when its rules were edited by hand', () => {
    it('then it keeps them and names the tool in the reason', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({
        rootDir,
        targets: ['claude', 'agents-md'],
        tool: RELIZY,
        agentDocs: relizyDocs(),
      })
      writeProjectFile('.claude/rules/relizy.md', readProjectFile('.claude/rules/relizy.md').replace('Preview the release first.', 'My own rule.'))
      writeProjectFile('AGENTS.md', readProjectFile('AGENTS.md').replace('Preview the release first.', 'My own rule.'))

      const result = setupAgents({
        rootDir,
        targets: ['claude', 'agents-md'],
        tool: RELIZY,
        agentDocs: relizyDocs('1.15.0'),
      })

      expect(changeOf(result, '.claude/rules/relizy.md')?.reason).toBe('edited since it was generated: left untouched, delete it to get the rules of relizy 1.15.0')
      expect(changeOf(result, 'AGENTS.md')?.reason).toBe('the relizy section was edited since it was generated: left untouched, delete the section to get the rules of relizy 1.15.0')
    })
  })

  describe('when its rules were written by a newer version', () => {
    it('then it keeps them', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({
        rootDir,
        targets: ['claude'],
        tool: RELIZY,
        agentDocs: relizyDocs('2.0.0'),
      })

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool: RELIZY,
        agentDocs: relizyDocs('1.14.0'),
      })

      expect(changeOf(result, '.claude/rules/relizy.md')?.reason).toBe('written by relizy 2.0.0, newer than the installed 1.14.0: left untouched')
    })
  })

  describe('when its version note contains replacement patterns', () => {
    it('then the note is written as is', () => {
      writeProjectFile('CLAUDE.md', '# my project')

      setupAgents({
        rootDir,
        targets: ['claude'],
        tool: {
          ...RELIZY,
          versionNote: version => `> $1 $& relizy ${version}`,
        },
        agentDocs: relizyDocs(),
      })

      expect(readProjectFile('.claude/rules/relizy.md')).toContain('# relizy\n\n> $1 $& relizy 1.14.0\n')
    })
  })

  describe('when its rules are not given', () => {
    it('then it throws', () => {
      expect(() => setupAgents({
        rootDir,
        targets: ['claude'],
        tool: RELIZY,
      })).toThrow('setupAgents needs the rules of relizy: pass them with the agentDocs option.')
    })

    it('then it still registers the MCP server alone', () => {
      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool: RELIZY,
        rules: false,
      })

      expect(relizyServer()).toEqual({
        type: 'stdio',
        command: 'npx',
        args: ['-y', 'relizy@latest', 'mcp'],
      })
      expect(result.version).toBe('')
    })
  })
})

describe('given setupAgents with the command of the MCP server of another tool', () => {
  function registered(servers: Record<string, unknown>): void {
    writeProjectFile('.mcp.json', `${JSON.stringify({ mcpServers: servers }, null, 2)}\n`)
  }

  describe('when the entry pins an older version and the project now installs the tool', () => {
    it('then it starts the installed version with the arguments of the tool', () => {
      registered({
        relizy: {
          type: 'stdio',
          command: 'npx',
          args: ['-y', 'relizy@1.13.0', 'mcp'],
        },
      })
      writeProjectFile('package.json', JSON.stringify({
        packageManager: 'pnpm@10.0.0',
        devDependencies: { relizy: '^1.14.0' },
      }))

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool: RELIZY,
        rules: false,
      })

      expect(relizyServer()).toEqual({
        type: 'stdio',
        command: 'pnpm',
        args: ['exec', 'relizy', 'mcp'],
      })
      expect(changeOf(result, '.mcp.json')?.reason).toBe('"relizy" now runs pnpm exec relizy mcp')
      expect(result.localMcpServer).toBe(true)
    })
  })

  describe('when the entry pins a newer version than the given one', () => {
    it('then it keeps it and names the package in the reason', () => {
      registered({
        release: {
          command: 'npx',
          args: ['-y', 'relizy@2.0.0', 'mcp'],
        },
      })

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool: RELIZY,
        rules: false,
        mcpVersion: '1.14.0',
      })

      expect(JSON.parse(readProjectFile('.mcp.json')).mcpServers.release.args).toEqual(['-y', 'relizy@2.0.0', 'mcp'])
      expect(changeOf(result, '.mcp.json')?.reason).toBe('"release" runs relizy 2.0.0')
    })
  })

  describe('when the entries run the package without the MCP arguments', () => {
    it('then they are not taken for the MCP server of the tool', () => {
      registered({
        release: {
          command: 'npx',
          args: ['relizy', 'release'],
        },
        notes: 'relizy',
        broken: { command: 'relizy', args: 'mcp' },
      })

      setupAgents({
        rootDir,
        targets: ['claude'],
        tool: RELIZY,
        rules: false,
        mcpVersion: '1.14.0',
      })

      const servers = JSON.parse(readProjectFile('.mcp.json')).mcpServers

      expect(servers.release).toEqual({
        command: 'npx',
        args: ['relizy', 'release'],
      })
      expect(servers.relizy).toEqual({
        type: 'stdio',
        command: 'npx',
        args: ['-y', 'relizy@1.14.0', 'mcp'],
      })
    })
  })

  describe('when the entry runs a custom command of the tool', () => {
    it('then it leaves it untouched', () => {
      registered({
        relizy: {
          command: 'npx',
          args: [
            '-y',
            'relizy@latest',
            'mcp',
            '--cwd',
            'apps/web',
          ],
        },
      })

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool: RELIZY,
        rules: false,
        mcpVersion: '1.14.0',
      })

      expect(changeOf(result, '.mcp.json')?.reason).toBe('"relizy" runs a custom command: left untouched')
    })
  })
})

describe('given mcpServerCommand with another tool', () => {
  describe.each([
    [
      'pnpm@10.0.0',
      {
        command: 'pnpm',
        args: ['exec', 'relizy', 'mcp'],
      },
    ],
    [
      'yarn@4.0.0',
      {
        command: 'yarn',
        args: ['run', 'relizy', 'mcp'],
      },
    ],
    [
      'bun@1.2.0',
      {
        command: 'bun',
        args: ['x', '--no-install', 'relizy', 'mcp'],
      },
    ],
    [
      'npm@11.0.0',
      {
        command: 'npx',
        args: ['--no-install', 'relizy', 'mcp'],
      },
    ],
  ])('when the project installs the tool with %s', (packageManager, expected) => {
    it('then its package manager starts the installed bin with the arguments of the tool', () => {
      writeProjectFile('package.json', JSON.stringify({
        packageManager,
        devDependencies: { relizy: '^1.14.0' },
      }))

      expect(installsMcpPackage(rootDir, RELIZY)).toBe(true)
      expect(installsMcpPackage(rootDir)).toBe(false)
      expect(mcpServerCommand(rootDir, '1.14.0', RELIZY)).toEqual(expected)
    })
  })

  describe('when the tool has no MCP arguments and is not installed', () => {
    it('then npx downloads the pinned package', () => {
      expect(mcpServerCommand(rootDir, '2.0.0', { ...RELIZY, mcpArgs: undefined })).toEqual({
        command: 'npx',
        args: ['-y', 'relizy@2.0.0'],
      })
    })
  })
})

function bodyChecksum(body: string): string {
  return createHash('sha256').update(body.replaceAll(/\s+/g, '')).digest('hex').slice(0, 12)
}

describe('given the agents entry', () => {
  describe('when its exports are read', () => {
    it('then it exposes the same API as the setupAgents module', async () => {
      const source = await import('../setupAgents')

      expect(Object.keys(agentsEntry).sort()).toEqual(Object.keys(source).sort())
      expect(agentsEntry.setupAgents).toBe(source.setupAgents)
    })
  })
})

describe('given setupAgents with a custom marker', () => {
  const ACME: AgentsTool = {
    ...RELIZY,
    name: 'acme',
    mcpPackage: '@acme/mcp',
    mcpBin: 'acme-mcp',
    mcpArgs: undefined,
    marker: 'Managed by @acme/mcp',
  }

  describe('when the rules are written', () => {
    it('then the header, the version and the edit detection use the marker', () => {
      writeProjectFile('CLAUDE.md', '# my project')

      setupAgents({
        rootDir,
        targets: ['claude', 'agents-md'],
        tool: ACME,
        agentDocs: relizyDocs('2.0.0'),
      })

      const rule = readProjectFile('.claude/rules/acme.md')

      expect(rule).toMatch(/^<!-- Managed by @acme\/mcp 2\.0\.0 \(sha256:[\da-f]{12}\): generated by/)
      expect(rule).not.toContain('Managed by acme')
      expect(readManagedVersion(rule, ACME)).toBe('2.0.0')
      expect(isEditedManagedContent(rule, ACME)).toBe(false)
      expect(isEditedManagedContent(`${rule}\nMy own rule.`, ACME)).toBe(true)
      expect(readProjectFile('AGENTS.md')).toContain('<!-- BEGIN:acme -->\n\n<!-- Managed by @acme/mcp 2.0.0')
    })
  })

  describe('when a rule written with that marker already exists', () => {
    it('then it is recognized as owned and updated', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        agentDocs: relizyDocs('2.0.0'),
      })

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        agentDocs: relizyDocs('2.1.0'),
      })

      expect(changeOf(result, '.claude/rules/acme.md')?.action).toBe('update')
      expect(readManagedVersion(readProjectFile('.claude/rules/acme.md'), ACME)).toBe('2.1.0')
    })

    it('then a second run changes nothing', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        agentDocs: relizyDocs(),
      })

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        agentDocs: relizyDocs(),
      })

      expect(changeOf(result, '.claude/rules/acme.md')?.action).toBe('unchanged')
    })
  })

  describe('when a file was written with the default marker of the tool', () => {
    it('then it is not owned and left untouched', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      writeProjectFile('.claude/rules/acme.md', '<!-- Managed by acme 1.0.0: generated -->\n\n# old')

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        agentDocs: relizyDocs(),
      })

      expect(changeOf(result, '.claude/rules/acme.md')?.action).toBe('skip')
    })
  })

  describe('when the tool declares no marker', () => {
    it('then the marker is derived from its name', () => {
      writeProjectFile('CLAUDE.md', '# my project')

      setupAgents({
        rootDir,
        targets: ['claude'],
        tool: { ...ACME, marker: undefined },
        agentDocs: relizyDocs(),
      })

      expect(readProjectFile('.claude/rules/acme.md')).toContain('<!-- Managed by acme 1.14.0')
    })
  })
})

describe('given setupAgents with the version note disabled', () => {
  describe('when the rules are written', () => {
    it('then neither the Claude rule nor the AGENTS.md section has a note', () => {
      writeProjectFile('CLAUDE.md', '# my project')

      setupAgents({
        rootDir,
        targets: ['claude', 'agents-md'],
        tool: { ...RELIZY, versionNote: false },
        agentDocs: relizyDocs(),
      })

      expect(readProjectFile('.claude/rules/relizy.md')).toContain('# relizy\n\nPreview the release first.')
      expect(readProjectFile('.claude/rules/relizy.md')).not.toContain('is installed')
      expect(readProjectFile('AGENTS.md')).toContain('## relizy\n\nPreview the release first.')
      expect(readProjectFile('AGENTS.md')).not.toContain('is installed')
    })

    it('then a second run changes nothing and the rules are not taken for edited', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      const tool = { ...RELIZY, versionNote: false as const }
      setupAgents({
        rootDir,
        targets: ['claude'],
        tool,
        agentDocs: relizyDocs(),
      })

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool,
        agentDocs: relizyDocs(),
      })

      expect(changeOf(result, '.claude/rules/relizy.md')?.action).toBe('unchanged')
    })
  })
})

describe('given setupAgents with former MCP packages', () => {
  const ACME: AgentsTool = {
    ...RELIZY,
    name: 'acme',
    mcpPackage: '@acme/mcp',
    mcpBin: 'acme-mcp',
    mcpArgs: undefined,
    legacyMcpPackages: ['@acme/old-mcp', 'old-mcp'],
  }

  function mcpServers(file: string, rootKey = 'mcpServers'): Record<string, unknown> {
    return parse(readProjectFile(file))[rootKey]
  }

  describe('when .mcp.json registers a former package', () => {
    it('then the entry is replaced in place by the entry of the tool, with the comments kept', () => {
      writeProjectFile('.mcp.json', '{\n  // servers\n  "mcpServers": {\n    "other": { "command": "x" },\n    "legacy": { "command": "npx", "args": ["-y", "@acme/old-mcp@1.0.0"], "env": { "A": "1" } }\n  }\n}\n')

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        rules: false,
        mcpVersion: '2.0.0',
      })

      expect(mcpServers('.mcp.json')).toEqual({
        other: { command: 'x' },
        legacy: {
          type: 'stdio',
          command: 'npx',
          args: ['-y', '@acme/mcp@2.0.0'],
        },
      })
      expect(readProjectFile('.mcp.json')).toContain('// servers')
      expect(changeOf(result, '.mcp.json')).toEqual({ file: '.mcp.json', action: 'update', reason: '"legacy" migrated from @acme/old-mcp to @acme/mcp' })
    })

    it('then a second run changes nothing', () => {
      writeProjectFile('.mcp.json', '{"mcpServers":{"legacy":{"command":"npx","args":["-y","@acme/old-mcp"]}}}\n')
      setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        rules: false,
        mcpVersion: '2.0.0',
      })

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        rules: false,
        mcpVersion: '2.0.0',
      })

      expect(changeOf(result, '.mcp.json')?.action).toBe('unchanged')
    })
  })

  describe('when the config file has no trailing newline', () => {
    it('then the migrated file ends with a newline', () => {
      writeProjectFile('.mcp.json', '{"mcpServers":{"legacy":{"command":"npx","args":["-y","@acme/old-mcp"]}}}')

      setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        rules: false,
        mcpVersion: '2.0.0',
      })

      expect(readProjectFile('.mcp.json').endsWith('\n')).toBe(true)
    })
  })

  describe('when the entry only references the bin of a former package', () => {
    it('then it is migrated too', () => {
      writeProjectFile('.mcp.json', '{"mcpServers":{"legacy":{"command":"pnpm","args":["exec","old-mcp"]}}}\n')

      setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        rules: false,
        mcpVersion: '2.0.0',
      })

      expect(mcpServers('.mcp.json').legacy).toEqual({
        type: 'stdio',
        command: 'npx',
        args: ['-y', '@acme/mcp@2.0.0'],
      })
    })
  })

  describe('when the Cursor and VS Code configs register a former package', () => {
    it('then each config keeps its own format', () => {
      writeProjectFile('.cursor/mcp.json', '{"mcpServers":{"legacy":{"command":"npx","args":["-y","@acme/old-mcp"]}}}\n')
      writeProjectFile('.vscode/mcp.json', '{"servers":{"legacy":{"type":"stdio","command":"npx","args":["-y","@acme/old-mcp"]}}}\n')

      setupAgents({
        rootDir,
        targets: ['cursor', 'vscode'],
        tool: ACME,
        rules: false,
        mcpVersion: '2.0.0',
      })

      expect(mcpServers('.cursor/mcp.json').legacy).toEqual({
        command: 'npx',
        args: ['-y', '@acme/mcp@2.0.0'],
      })
      expect(mcpServers('.vscode/mcp.json', 'servers').legacy).toEqual({
        type: 'stdio',
        command: 'npx',
        args: ['-y', '@acme/mcp@2.0.0'],
      })
    })
  })

  describe('when the tool already has an entry besides the former one', () => {
    it('then only the entry of the tool is updated and the former one is left', () => {
      writeProjectFile('.mcp.json', '{"mcpServers":{"legacy":{"command":"npx","args":["-y","@acme/old-mcp"]},"acme":{"command":"npx","args":["-y","@acme/mcp@1.0.0"]}}}\n')

      setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        rules: false,
        mcpVersion: '2.0.0',
      })

      expect(mcpServers('.mcp.json')).toEqual({
        legacy: {
          command: 'npx',
          args: ['-y', '@acme/old-mcp'],
        },
        acme: {
          command: 'npx',
          args: ['-y', '@acme/mcp@2.0.0'],
        },
      })
    })
  })

  describe('when a server named like the tool runs another command next to a former entry', () => {
    it('then the former entry is migrated and the other server is untouched', () => {
      writeProjectFile('.mcp.json', '{"mcpServers":{"acme":{"command":"node","args":["custom.js"]},"legacy":{"command":"npx","args":["-y","@acme/old-mcp"]}}}\n')

      setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        rules: false,
        mcpVersion: '2.0.0',
      })

      expect(mcpServers('.mcp.json').acme).toEqual({
        command: 'node',
        args: ['custom.js'],
      })
      expect(mcpServers('.mcp.json').legacy).toEqual({
        type: 'stdio',
        command: 'npx',
        args: ['-y', '@acme/mcp@2.0.0'],
      })
    })
  })

  describe('when the tool declares no former package', () => {
    it('then an entry of another package is left and the server is added', () => {
      writeProjectFile('.mcp.json', '{"mcpServers":{"legacy":{"command":"npx","args":["-y","@acme/old-mcp"]}}}\n')

      setupAgents({
        rootDir,
        targets: ['claude'],
        tool: { ...ACME, legacyMcpPackages: undefined },
        rules: false,
        mcpVersion: '2.0.0',
      })

      expect(Object.keys(mcpServers('.mcp.json'))).toEqual(['legacy', 'acme'])
    })
  })

  describe('when the setup is removed', () => {
    it('then the entry of a former package is left', () => {
      writeProjectFile('.mcp.json', '{"mcpServers":{"legacy":{"command":"npx","args":["-y","@acme/old-mcp"]}}}\n')

      const result = setupAgents({
        rootDir,
        targets: ['claude'],
        tool: ACME,
        remove: true,
      })

      expect(result.changes).toEqual([])
      expect(mcpServers('.mcp.json').legacy).toBeDefined()
    })
  })
})

describe('given isEditedManagedContent with a frontmatter', () => {
  function createMonorepoRule(): string {
    writeProjectFile('CLAUDE.md', '# my project')
    writeProjectFile('pnpm-workspace.yaml', 'packages:\n  - apps/*\n')
    writeProjectFile('apps/pwa/package.json', JSON.stringify({
      dependencies: { 'maz-ui': '^5.0.0' },
    }))
    setupAgents({
      rootDir,
      docsDir,
      targets: ['claude'],
    })

    return readProjectFile('.claude/rules/maz-ui.md')
  }

  describe('when the paths of the frontmatter are edited by hand', () => {
    it('then the rule is detected as edited and kept', () => {
      const rule = createMonorepoRule()
      writeProjectFile('.claude/rules/maz-ui.md', rule.replace('apps/pwa/**', 'apps/web/**'))

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(isEditedManagedContent(readProjectFile('.claude/rules/maz-ui.md'))).toBe(true)
      expect(changeOf(result, '.claude/rules/maz-ui.md')?.action).toBe('skip')
      expect(readProjectFile('.claude/rules/maz-ui.md')).toContain('apps/web/**')
    })
  })

  describe('when a formatter only changes the whitespace of the frontmatter', () => {
    it('then the rule is not detected as edited', () => {
      const rule = createMonorepoRule()

      expect(isEditedManagedContent(rule.replace('  - "apps', '    -   "apps'))).toBe(false)
    })
  })

  describe('when a formatter only changes the quotes of the frontmatter', () => {
    it('then the rule is not detected as edited', () => {
      const rule = createMonorepoRule()
      const frontmatter = rule.slice(0, rule.indexOf('<!--'))

      expect(isEditedManagedContent(rule.replace(frontmatter, frontmatter.replaceAll('"', '\''))))
        .toBe(false)
      expect(isEditedManagedContent(rule.replace(frontmatter, frontmatter.replaceAll('"', '')))).toBe(false)
    })
  })

  describe('when the checksum only covers the body, as before the frontmatter was part of it', () => {
    it('then the rule is not detected as edited and is rewritten with the new checksum', () => {
      const rule = createMonorepoRule()
      const body = rule.slice(rule.indexOf('-->') + 3)
      const legacyRule = rule.replace(/sha256:[\da-f]+/, `sha256:${bodyChecksum(body)}`)
      writeProjectFile('.claude/rules/maz-ui.md', legacyRule)

      const result = setupAgents({
        rootDir,
        docsDir,
        targets: ['claude'],
      })

      expect(isEditedManagedContent(legacyRule)).toBe(false)
      expect(changeOf(result, '.claude/rules/maz-ui.md')?.action).toBe('update')
      expect(readProjectFile('.claude/rules/maz-ui.md')).toBe(rule)
    })

    it('then an edit of the body is still detected', () => {
      const rule = createMonorepoRule()
      const body = rule.slice(rule.indexOf('-->') + 3)
      const legacyRule = rule.replace(/sha256:[\da-f]+/, `sha256:${bodyChecksum(body)}`)

      expect(isEditedManagedContent(`${legacyRule}\nMy own rule.`)).toBe(true)
    })
  })

  describe('when the rule was written by a published version, without frontmatter', () => {
    it('then it is not detected as edited', () => {
      const body = '# maz-ui\n\nUse maz-ui components.\n'
      const published = `<!-- Managed by maz-ui 5.2.0 (sha256:${bodyChecksum(body)}): generated by x -->\n\n${body}`

      expect(isEditedManagedContent(published)).toBe(false)
      expect(isEditedManagedContent(`${published}\nMy own rule.`)).toBe(true)
    })
  })
})

describe('given findWorkspacesUsing with negated workspace patterns', () => {
  function createMonorepoWithLegacy(declaration: string): void {
    writeProjectFile('pnpm-workspace.yaml', declaration)
    writePackage('apps/web', {
      dependencies: { 'maz-ui': '^5.0.0' },
    })
    writePackage('apps/legacy', {
      dependencies: { 'maz-ui': '^5.0.0' },
    })
    writePackage('apps/legacy/inner', {
      dependencies: { 'maz-ui': '^5.0.0' },
    })
  }

  describe('when pnpm-workspace.yaml excludes a workspace', () => {
    it('then the excluded workspace is left out with the folders below it', () => {
      createMonorepoWithLegacy('packages:\n  - "apps/**"\n  - "!apps/legacy"\n')

      expect(findWorkspacesUsing(rootDir, ['maz-ui'])).toEqual(['apps/web'])
    })

    it('then a negated pattern with a leading dot and a globstar excludes the same folders', () => {
      createMonorepoWithLegacy('packages:\n  - "apps/**"\n  - "!./apps/legacy/**"\n')

      expect(findWorkspacesUsing(rootDir, ['maz-ui'])).toEqual(['apps/web'])
    })
  })

  describe('when the package.json excludes a workspace', () => {
    it('then the excluded workspace is left out', () => {
      writePackage('', {
        workspaces: ['apps/*', '!apps/legacy'],
      })
      writePackage('apps/web', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })
      writePackage('apps/legacy', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })

      expect(findWorkspacesUsing(rootDir, ['maz-ui'])).toEqual(['apps/web'])
    })
  })

  describe('when the root depends on the packages and workspaces are excluded', () => {
    it('then the root is kept', () => {
      writePackage('', {
        workspaces: ['apps/*', '!apps/legacy'],
        dependencies: { 'maz-ui': '^5.0.0' },
      })
      writePackage('apps/legacy', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })

      expect(findWorkspacesUsing(rootDir, ['maz-ui'])).toEqual([''])
    })
  })

  describe('when the claude rule is scoped', () => {
    it('then the excluded workspace is not in the globs', () => {
      createMonorepoWithLegacy('packages:\n  - "apps/*"\n  - "!apps/legacy"\n')

      expect(resolveRulePaths(rootDir, MAZ_UI_AGENTS_TOOL)).toEqual(['apps/web/**/*.{vue,ts,tsx,css,scss}'])
    })
  })
})

describe('given resolveRulePaths with special characters in workspace folders', () => {
  describe('when a folder name contains glob characters', () => {
    it('then they are escaped in the generated globs', () => {
      writeProjectFile('pnpm-workspace.yaml', 'packages:\n  - "apps/*"\n')
      writePackage('apps/[web]', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })
      writePackage('apps/(site)', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })
      writePackage('apps/a{b}!', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })
      writePackage('apps/plain', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })

      expect(resolveRulePaths(rootDir, MAZ_UI_AGENTS_TOOL)?.sort()).toEqual([
        'apps/\\(site\\)/**/*.{vue,ts,tsx,css,scss}',
        'apps/\\[web\\]/**/*.{vue,ts,tsx,css,scss}',
        'apps/a\\{b\\}\\!/**/*.{vue,ts,tsx,css,scss}',
        'apps/plain/**/*.{vue,ts,tsx,css,scss}',
      ])
    })
  })

  describe('when the folder names have no glob character', () => {
    it('then the globs are unchanged', () => {
      writeProjectFile('pnpm-workspace.yaml', 'packages:\n  - "apps/*"\n')
      writePackage('apps/web', {
        dependencies: { 'maz-ui': '^5.0.0' },
      })

      expect(resolveRulePaths(rootDir, MAZ_UI_AGENTS_TOOL)).toEqual(['apps/web/**/*.{vue,ts,tsx,css,scss}'])
    })
  })
})

describe('given resolveRulePaths with many workspaces', () => {
  const tool: AgentsTool = {
    ...RELIZY,
    packages: ['maz-ui'],
    ruleGlobs: ['**/*.{a,b,c,d,e,f,g,h,i,j}', 'plain.md', String.raw`escaped\{x,y\}.md`],
  }

  function createWorkspaces(count: number): void {
    writeProjectFile('pnpm-workspace.yaml', 'packages:\n  - "apps/*"\n')

    for (let index = 0; index < count; index++) {
      writePackage(`apps/app-${index}`, {
        dependencies: { 'maz-ui': '^5.0.0' },
      })
    }
  }

  describe('when the expanded patterns stay within the budget of Claude Code', () => {
    it('then each workspace has its globs', () => {
      createWorkspaces(80)

      expect(resolveRulePaths(rootDir, tool)).toHaveLength(80 * 3)
    })
  })

  describe('when the expanded patterns exceed the budget of Claude Code', () => {
    it('then the rule falls back to the globs of the whole project', () => {
      createWorkspaces(100)

      expect(resolveRulePaths(rootDir, tool)).toEqual(['**/*.{a,b,c,d,e,f,g,h,i,j}', 'plain.md', String.raw`escaped\{x,y\}.md`])
    })
  })
})
