import type { SetupAgentsResult } from '../setupAgents'

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import {
  AGENT_TARGETS,
  AGENTS_MD_BEGIN,
  AGENTS_MD_END,
  DEFAULT_MCP_SERVER,
  detectAgentTargets,
  findInstalledPackage,
  findProjectPackage,
  MANAGED_MARKER,
  MCP_SERVER_NAME,
  readAgentDocs,
  setupAgents,
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
    ['.claude/settings.json', ['claude']],
    ['CLAUDE.md', ['claude']],
    ['.claude/CLAUDE.md', ['claude']],
    ['CLAUDE.local.md', ['claude']],
    ['.mcp.json', ['claude']],
    ['.cursor/mcp.json', ['agents-md', 'cursor']],
    ['.cursorrules', ['agents-md', 'cursor']],
    ['.vscode/mcp.json', ['agents-md', 'vscode']],
    ['.github/copilot-instructions.md', ['agents-md', 'vscode']],
    ['.github/instructions/vue.instructions.md', ['agents-md', 'vscode']],
    ['AGENTS.md', ['agents-md']],
    ['.codex/config.toml', ['agents-md']],
    ['.windsurf/rules/main.md', ['agents-md']],
    ['.devin/rules/main.md', ['agents-md']],
    ['.windsurfrules', ['agents-md']],
    ['GEMINI.md', ['agents-md']],
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

      expect(detectAgentTargets(rootDir)).toEqual(['claude', 'agents-md', 'cursor', 'vscode'])
    })
  })

  describe('when reading the exported target list', () => {
    it('then it lists every supported agent', () => {
      expect(AGENT_TARGETS).toEqual(['claude', 'agents-md', 'cursor', 'vscode'])
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
      writeProjectFile('node_modules/maz-ui/package.json', JSON.stringify({ name: 'maz-ui', version: '5.2.0', exports: { './package.json': './package.json' } }))
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
      result = setupAgents({ rootDir, docsDir, targets: ['claude'] })
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
        mcpServers: { [MCP_SERVER_NAME]: { type: 'stdio', ...DEFAULT_MCP_SERVER } },
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
      setupAgents({ rootDir, docsDir, targets: ['claude'] })

      const second = setupAgents({ rootDir, docsDir, targets: ['claude'] })

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
      setupAgents({ rootDir, docsDir, targets: ['claude'] })
      createDocs(docsDir, { version: '5.2.0', claudeRule: '# maz-ui\n\nNew rules.' })

      const result = setupAgents({ rootDir, docsDir, targets: ['claude'] })

      expect(changeOf(result, '.claude/rules/maz-ui.md')?.action).toBe('update')
      expect(readProjectFile('.claude/rules/maz-ui.md')).toContain('New rules.')
      expect(readProjectFile('.claude/rules/maz-ui.md')).toContain('5.2.0')
    })
  })

  describe('when the rule file was written by the user', () => {
    it('then it leaves it untouched', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      writeProjectFile('.claude/rules/maz-ui.md', '# my own maz-ui rules')

      const result = setupAgents({ rootDir, docsDir, targets: ['claude'] })

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
      const result = setupAgents({ rootDir, docsDir, targets: ['claude', 'agents-md'] })

      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(false)
      expect(changeOf(result, '.claude/rules/maz-ui.md')).toBeUndefined()
      expect(readProjectFile('AGENTS.md')).toContain('Use maz-ui components.')
    })

    it('then it removes a rule generated before', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({ rootDir, docsDir, targets: ['claude', 'agents-md'] })
      rmSync(join(rootDir, 'CLAUDE.md'))

      const result = setupAgents({ rootDir, docsDir, targets: ['claude', 'agents-md'] })

      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(false)
      expect(changeOf(result, '.claude/rules/maz-ui.md')?.action).toBe('remove')
    })
  })

  describe('when agents-md is also targeted and the project has a CLAUDE.md', () => {
    it('then it writes both the rule and the AGENTS.md section', () => {
      writeProjectFile('.claude/CLAUDE.md', '# my project')

      setupAgents({ rootDir, docsDir, targets: ['claude', 'agents-md'] })

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
      const result = setupAgents({ rootDir, docsDir, targets: ['agents-md'] })
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

      const result = setupAgents({ rootDir, docsDir, targets: ['agents-md'] })
      const content = readProjectFile('AGENTS.md')

      expect(content.startsWith('# Project rules\n\nUse pnpm.\n\n<!-- BEGIN:maz-ui -->')).toBe(true)
      expect(content.endsWith(`${AGENTS_MD_END}\n`)).toBe(true)
      expect(changeOf(result, 'AGENTS.md')?.action).toBe('update')
    })
  })

  describe('when AGENTS.md already contains the section', () => {
    it('then it replaces the section in place', () => {
      writeProjectFile('AGENTS.md', `# Before\n\n${AGENTS_MD_BEGIN}\nold section\n${AGENTS_MD_END}\n\n# After\n`)

      setupAgents({ rootDir, docsDir, targets: ['agents-md'] })
      const content = readProjectFile('AGENTS.md')

      expect(content.startsWith(`# Before\n\n${AGENTS_MD_BEGIN}`)).toBe(true)
      expect(content.endsWith(`${AGENTS_MD_END}\n\n# After\n`)).toBe(true)
      expect(content).not.toContain('old section')
      expect(content).toContain('Use maz-ui components.')
    })

    it('then a second run changes nothing', () => {
      setupAgents({ rootDir, docsDir, targets: ['agents-md'] })

      const result = setupAgents({ rootDir, docsDir, targets: ['agents-md'] })

      expect(changeOf(result, 'AGENTS.md')?.action).toBe('unchanged')
    })
  })

  describe('when AGENTS.md has a begin marker without end marker', () => {
    it('then it appends a complete section', () => {
      writeProjectFile('AGENTS.md', `# Rules\n\n${AGENTS_MD_BEGIN}\n`)

      setupAgents({ rootDir, docsDir, targets: ['agents-md'] })

      expect(readProjectFile('AGENTS.md').trimEnd().endsWith(AGENTS_MD_END)).toBe(true)
    })
  })
})

describe('given setupAgents with MCP config targets', () => {
  describe('when the cursor target is configured', () => {
    it('then it writes .cursor/mcp.json without the type field', () => {
      setupAgents({ rootDir, docsDir, targets: ['cursor'] })

      expect(JSON.parse(readProjectFile('.cursor/mcp.json'))).toEqual({
        mcpServers: { [MCP_SERVER_NAME]: DEFAULT_MCP_SERVER },
      })
    })
  })

  describe('when the vscode target is configured', () => {
    it('then it writes .vscode/mcp.json under the servers key', () => {
      setupAgents({ rootDir, docsDir, targets: ['vscode'] })

      expect(JSON.parse(readProjectFile('.vscode/mcp.json'))).toEqual({
        servers: { [MCP_SERVER_NAME]: { type: 'stdio', ...DEFAULT_MCP_SERVER } },
      })
    })
  })

  describe('when the config already has other servers and comments', () => {
    it('then it adds the maz-ui server and preserves the rest', () => {
      writeProjectFile('.vscode/mcp.json', '{\n  // my servers\n  "servers": {\n    "github": {\n      "command": "gh-mcp"\n    },\n  }\n}\n')

      const result = setupAgents({ rootDir, docsDir, targets: ['vscode'] })
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

      setupAgents({ rootDir, docsDir, targets: ['claude'], dryRun: false })

      expect(readProjectFile('.mcp.json').endsWith('\n')).toBe(true)
    })
  })

  describe('when the config is indented with tabs', () => {
    it('then it keeps the tab indentation', () => {
      writeProjectFile('.mcp.json', '{\n\t"mcpServers": {}\n}\n')

      setupAgents({ rootDir, docsDir, targets: ['claude'] })

      expect(readProjectFile('.mcp.json')).toContain(`\n\t\t"${MCP_SERVER_NAME}": {`)
    })
  })

  describe('when the config uses Windows line endings', () => {
    it('then it keeps CRLF line endings', () => {
      writeProjectFile('.mcp.json', '{\r\n  "mcpServers": {}\r\n}\r\n')

      setupAgents({ rootDir, docsDir, targets: ['claude'] })

      expect(readProjectFile('.mcp.json')).toContain(`{\r\n    "${MCP_SERVER_NAME}"`)
    })
  })

  describe.each([
    ['@maz-ui/mcp', { command: 'npx', args: ['@maz-ui/mcp'] }],
    ['the maz-ui-mcp binary', { command: 'maz-ui-mcp' }],
  ])('when %s is already registered under another name', (_, server) => {
    it('then it leaves the config unchanged and explains why', () => {
      const config = `${JSON.stringify({ mcpServers: { 'maz-docs': server } }, null, 2)}\n`
      writeProjectFile('.mcp.json', config)

      const result = setupAgents({ rootDir, docsDir, targets: ['claude'] })

      expect(readProjectFile('.mcp.json')).toBe(config)
      expect(changeOf(result, '.mcp.json')).toEqual({
        file: '.mcp.json',
        action: 'unchanged',
        reason: 'maz-ui MCP server already registered as "maz-docs"',
      })
    })
  })

  describe('when a maz-ui server with another command exists', () => {
    it('then it skips the file', () => {
      const config = `${JSON.stringify({ mcpServers: { [MCP_SERVER_NAME]: { command: 'other' }, empty: null } }, null, 2)}\n`
      writeProjectFile('.mcp.json', config)

      const result = setupAgents({ rootDir, docsDir, targets: ['claude'] })

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

      const result = setupAgents({ rootDir, docsDir, targets: ['claude'] })

      expect(readProjectFile('.mcp.json')).toBe(content)
      expect(changeOf(result, '.mcp.json')).toEqual({ file: '.mcp.json', action: 'skip', reason: 'invalid JSON: left untouched' })
    })
  })

  describe('when a custom MCP server command is given', () => {
    it('then it registers this command', () => {
      setupAgents({ rootDir, docsDir, targets: ['cursor'], mcpServer: { command: 'node', args: ['./mcp.mjs'] } })

      expect(JSON.parse(readProjectFile('.cursor/mcp.json'))).toEqual({
        mcpServers: { [MCP_SERVER_NAME]: { command: 'node', args: ['./mcp.mjs'] } },
      })
    })
  })

  describe('when mcp is disabled', () => {
    it('then it writes no MCP config', () => {
      writeProjectFile('CLAUDE.md', '# my project')

      const result = setupAgents({ rootDir, docsDir, targets: ['claude', 'cursor', 'vscode'], mcp: false })

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
      writeProjectFile('.cursor/mcp.json', `${JSON.stringify({ mcpServers: { github: { command: 'gh-mcp' } } }, null, 2)}\n`)
      setupAgents({ rootDir, docsDir, targets: ['claude', 'agents-md', 'cursor', 'vscode'] })
      result = setupAgents({ rootDir, targets: ['claude', 'agents-md', 'cursor', 'vscode'], remove: true })
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
      expect(JSON.parse(readProjectFile('.cursor/mcp.json'))).toEqual({ mcpServers: { github: { command: 'gh-mcp' } } })
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
      setupAgents({ rootDir, docsDir, targets: ['agents-md'] })

      const result = setupAgents({ rootDir, targets: ['agents-md'], remove: true })

      expect(projectFileExists('AGENTS.md')).toBe(false)
      expect(changeOf(result, 'AGENTS.md')?.action).toBe('remove')
    })
  })

  describe('when nothing was set up', () => {
    it('then it changes nothing', () => {
      writeProjectFile('AGENTS.md', '# Project rules\n')

      const result = setupAgents({ rootDir, targets: ['claude', 'agents-md', 'cursor'], remove: true })

      expect(result.changes).toEqual([])
      expect(readProjectFile('AGENTS.md')).toBe('# Project rules\n')
    })
  })

  describe('when the maz-ui server is registered under another name', () => {
    it('then it keeps it', () => {
      const config = `${JSON.stringify({ mcpServers: { 'maz-docs': { command: 'npx', args: ['@maz-ui/mcp'] } } }, null, 2)}\n`
      writeProjectFile('.mcp.json', config)

      const result = setupAgents({ rootDir, targets: ['claude'], remove: true })

      expect(readProjectFile('.mcp.json')).toBe(config)
      expect(changeOf(result, '.mcp.json')).toBeUndefined()
    })
  })

  describe('when the MCP config has other root keys', () => {
    it('then it keeps the file with the other keys', () => {
      writeProjectFile('.vscode/mcp.json', `${JSON.stringify({ inputs: [], servers: { [MCP_SERVER_NAME]: { type: 'stdio', ...DEFAULT_MCP_SERVER } } }, null, 2)}\n`)

      setupAgents({ rootDir, targets: ['vscode'], remove: true })

      expect(JSON.parse(readProjectFile('.vscode/mcp.json'))).toEqual({ inputs: [], servers: {} })
    })
  })
})

describe('given setupAgents in dry run mode', () => {
  describe('when the project is configured', () => {
    it('then it reports the changes without writing anything', () => {
      writeProjectFile('CLAUDE.md', '# my project')

      const result = setupAgents({ rootDir, docsDir, targets: ['claude', 'agents-md', 'cursor'], dryRun: true })

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
      setupAgents({ rootDir, docsDir, targets: ['agents-md'] })

      const result = setupAgents({ rootDir, targets: ['agents-md'], remove: true, dryRun: true })

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
      result = setupAgents({ rootDir, docsDir, targets: ['claude', 'agents-md'], rules: false })
    })

    it('then it writes no rule file', () => {
      expect(projectFileExists('.claude/rules/maz-ui.md')).toBe(false)
      expect(projectFileExists('AGENTS.md')).toBe(false)
    })

    it('then it only registers the MCP server', () => {
      expect(result.changes).toEqual([{ file: '.mcp.json', action: 'create' }])
    })
  })

  describe('when maz-ui does not ship the agent docs', () => {
    it('then the MCP server is still registered', () => {
      const result = setupAgents({ rootDir, targets: ['claude'], rules: false })

      expect(result.changes).toEqual([{ file: '.mcp.json', action: 'create' }])
      expect(result.version).toBe('')
    })
  })

  describe('when the rules were written before and remove is set', () => {
    it('then the rules are removed', () => {
      writeProjectFile('CLAUDE.md', '# my project')
      setupAgents({ rootDir, docsDir, targets: ['claude', 'agents-md'] })

      setupAgents({ rootDir, targets: ['claude', 'agents-md'], rules: false, remove: true })

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
