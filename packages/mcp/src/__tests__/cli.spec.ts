import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import packageJson from '../../package.json' with { type: 'json' }
import { HELP, main, runCli } from '../cli.ts'
import { MAX_REVIEWED_FILES } from '../review/files.ts'
import { startStdioServer } from '../server.ts'
import { BUNDLE_DIR, cleanTempDirs, createTempDir, writeFakeMazUi, writeFile } from './helpers.ts'

vi.mock('../server.ts', () => ({
  startStdioServer: vi.fn(),
}))

function mockStdin(content: string): void {
  vi.spyOn(process, 'stdin', 'get').mockReturnValue(Readable.from([
    Buffer.from(content),
  ]) as unknown as typeof process.stdin)
}

describe('given the maz-ui-mcp CLI', () => {
  let log: ReturnType<typeof vi.spyOn>
  let error: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    log = vi.spyOn(console, 'log').mockImplementation(() => {})
    error = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanTempDirs()
    process.exitCode = undefined
  })

  function logged(): string {
    return log.mock.calls.map((call: unknown[]) => call.join(' ')).join('\n')
  }

  function errored(): string {
    return error.mock.calls.map((call: unknown[]) => call.join(' ')).join('\n')
  }

  describe('when --help is passed', () => {
    it('then it prints the help', async () => {
      expect(await runCli(['--help'])).toBe(0)
      expect(logged()).toBe(HELP)
    })
  })

  describe('when --version is passed', () => {
    it('then it prints the version', async () => {
      expect(await runCli(['-v'])).toBe(0)
      expect(logged()).toBe(packageJson.version)
    })
  })

  describe('when the command is unknown', () => {
    it('then it prints the help as an error', async () => {
      expect(await runCli(['nope'])).toBe(1)
      expect(errored()).toContain('Unknown command "nope"')
    })
  })

  describe('when the colors command is run', () => {
    it('then it prints the effective colors of the project presets', async () => {
      const cwd = createTempDir()

      writeFile(cwd, 'package.json', '{}')
      writeFile(cwd, 'src/preset.ts', 'export const brand = definePreset({ base: \'ocean\', overrides: { name: \'brand\' } })')

      expect(await runCli(['colors', '--cwd', cwd])).toBe(0)
      expect(logged()).toContain('### Effective colors of `brand` (`src/preset.ts`)')
    })

    it('then it prints a bundled preset with the given colors and steps', async () => {
      expect(await runCli([
        'colors',
        'nova',
        '--colors',
        'primary, accent',
        '--steps',
        '100,900',
      ])).toBe(0)
      expect(logged()).toContain('| `accent-900` |')
      expect(logged()).not.toContain('| `accent-500` |')
    })

    it('then an unknown preset is an error', async () => {
      expect(await runCli(['colors', 'nope'])).toBe(1)
      expect(errored()).toContain('Unknown preset "nope"')
    })
  })

  describe('when no command is given', () => {
    it('then it starts the stdio server and keeps the process alive', async () => {
      const cwd = createTempDir()

      expect(await runCli(['--cwd', cwd, '--docs', BUNDLE_DIR])).toBe(-1)
      expect(startStdioServer).toHaveBeenCalledWith({ cwd, docsDir: BUNDLE_DIR })
    })

    it('then the docs option is optional', async () => {
      const cwd = createTempDir()

      await runCli(['serve', '--cwd', cwd])

      expect(startStdioServer).toHaveBeenCalledWith({ cwd, docsDir: undefined })
    })
  })

  describe('when search is used', () => {
    it('then it prints the results', async () => {
      expect(await runCli([
        'search',
        'phone',
        'number',
        '--cwd',
        createTempDir(),
      ])).toBe(0)
      expect(logged()).toContain('MazInputPhoneNumber')
    })

    it('then it searches a default query without words', async () => {
      await runCli([
        'search',
        '--cwd',
        createTempDir(),
        '--docs',
        BUNDLE_DIR,
      ])

      expect(logged()).toContain('results for "button"')
    })
  })

  describe('when review is used', () => {
    it('then it requires paths', async () => {
      expect(await runCli([
        'review',
        '--cwd',
        createTempDir(),
      ])).toBe(1)
      expect(errored()).toContain('Pass the files')
    })

    it('then it prints the findings and fails on errors', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'A.vue', '<template><MazBtn color="red">x</MazBtn></template>')

      expect(await runCli([
        'review',
        'A.vue',
        '--cwd',
        cwd,
        '--docs',
        BUNDLE_DIR,
      ])).toBe(1)
      expect(logged()).toContain('A.vue: 1 error')
      expect(logged()).toContain('1 file(s) reviewed')
    })

    it('then it succeeds without errors and respects --max-warnings', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'A.vue', '<template><button>b</button></template>')

      expect(await runCli(['review', 'A.vue', '--cwd', cwd])).toBe(0)
      expect(await runCli([
        'review',
        'A.vue',
        '--cwd',
        cwd,
        '--max-warnings',
        '0',
      ])).toBe(1)
      expect(await runCli([
        'review',
        'A.vue',
        '--cwd',
        cwd,
        '--min-severity',
        'error',
      ])).toBe(0)
    })

    it('then it prints JSON', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'a.ts', 'import { MazBtn } from \'maz-ui\'')

      await runCli([
        'review',
        'a.ts',
        '--cwd',
        cwd,
        '--format',
        'json',
        '--framework',
        'vue',
      ])

      const output = JSON.parse(logged()) as { totals: { error: number }, files: Array<{ file: string }>, truncated: boolean }

      expect(output.totals.error).toBe(1)
      expect(output.files[0].file).toBe('a.ts')
      expect(output.truncated).toBe(false)
    })
  })

  describe('when a review stops at the file limit', () => {
    it('then it warns with the number of files not reviewed and how to review them', async () => {
      const cwd = createTempDir()

      for (let index = 0; index < MAX_REVIEWED_FILES + 5; index++) writeFile(cwd, `src/f${String(index).padStart(3, '0')}.ts`, '')

      await runCli(['review', 'src', '--cwd', cwd, '--framework', 'vue'])

      expect(logged()).toContain(`${MAX_REVIEWED_FILES} file(s) reviewed`)
      expect(errored()).toContain('5 more file(s) were NOT reviewed')
      expect(errored()).toContain('narrower paths')
    })

    it('then the JSON output gives the number of skipped files', async () => {
      const cwd = createTempDir()

      for (let index = 0; index < MAX_REVIEWED_FILES + 3; index++) writeFile(cwd, `src/f${String(index).padStart(3, '0')}.ts`, '')

      await runCli(['review', 'src', '--cwd', cwd, '--format', 'json', '--framework', 'vue'])

      const output = JSON.parse(logged()) as { truncated: boolean, skipped: number }

      expect(output.truncated).toBe(true)
      expect(output.skipped).toBe(3)
    })
  })

  describe('when review runs as a Claude Code hook', () => {
    it('then a file with findings exits with 2 and explains them on stderr', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'package.json', JSON.stringify({ dependencies: { 'maz-ui': '^5.0.0' } }))
      const file = writeFile(cwd, 'src/A.vue', '<template><button>b</button></template>')
      mockStdin(JSON.stringify({
        tool_input: { file_path: file },
        cwd,
      }))

      expect(await runCli(['review', '--hook', '--cwd', cwd])).toBe(2)
      expect(errored()).toContain('[prefer-maz-component]')
      expect(errored()).toContain('maz-ui-review-ignore')
    })

    it('then the files of a monorepo app are reviewed with the maz-ui of the app, loaded once', async () => {
      const cwd = createTempDir()
      execFileSync('git', ['init', '-q'], { cwd })
      writeFile(cwd, 'apps/web/package.json', JSON.stringify({ dependencies: { 'maz-ui': '^5.0.0' } }))
      writeFakeMazUi(join(cwd, 'apps/web'), { version: '5.8.0' })
      writeFile(cwd, 'apps/web/src/A.vue', '<template><button>a</button></template>')
      writeFile(cwd, 'apps/web/src/B.vue', '<template><button>b</button></template>')
      mockStdin(JSON.stringify({ hook_event_name: 'Stop', cwd }))

      expect(await runCli(['review', '--hook', '--cwd', cwd])).toBe(2)
      expect(errored()).toContain('apps/web/src/A.vue')
      expect(errored()).toContain('apps/web/src/B.vue')
    })

    it('then a file outside of any package exits with 0', async () => {
      const cwd = createTempDir()
      mockStdin(JSON.stringify({
        tool_input: { file_path: writeFile(cwd, 'A.vue', '<template><button>b</button></template>') },
      }))

      expect(await runCli(['review', '--hook', '--cwd', cwd])).toBe(0)
    })

    it('then a file of a project with an invalid package.json exits with 0', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'package.json', '{ "dependencies": ')
      mockStdin(JSON.stringify({
        tool_input: { file_path: writeFile(cwd, 'A.vue', '<template><button>b</button></template>') },
      }))

      expect(await runCli(['review', '--hook', '--cwd', cwd])).toBe(0)
    })

    it('then a file of a project without maz-ui exits with 0', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'package.json', JSON.stringify({ dependencies: { vue: '^3.5.0' } }))
      const file = writeFile(cwd, 'A.vue', '<template><button>b</button></template>')
      mockStdin(JSON.stringify({
        tool_input: { file_path: file },
        cwd,
      }))

      expect(await runCli(['review', '--hook', '--cwd', cwd])).toBe(0)
      expect(errored()).toBe('')
    })

    it('then a clean file exits with 0', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'package.json', JSON.stringify({ devDependencies: { 'maz-ui': '^5.0.0' } }))
      const file = writeFile(cwd, 'a.ts', 'export const a = 1')
      mockStdin(JSON.stringify({
        tool_input: { file_path: file },
      }))

      expect(await runCli(['review', '--hook', '--cwd', cwd])).toBe(0)
    })

    it.each([
      [
        'a non reviewable file',
        {
          tool_input: { file_path: '/project/README.md' },
        },
      ],
      [
        'a dependency file',
        {
          tool_input: { file_path: '/project/node_modules/x/a.vue' },
        },
      ],
      ['no file', {}],
    ])('then %s exits with 0', async (_, input) => {
      mockStdin(JSON.stringify(input))

      expect(await runCli([
        'review',
        '--hook',
        '--cwd',
        createTempDir(),
      ])).toBe(0)
    })

    it('then an empty stdin exits with 0', async () => {
      mockStdin('')

      expect(await runCli([
        'review',
        '--hook',
        '--cwd',
        createTempDir(),
      ])).toBe(0)
    })
  })

  describe('when init is used', () => {
    beforeEach(() => {
      vi.stubEnv('HOME', createTempDir())
    })

    afterEach(() => {
      vi.unstubAllEnvs()
    })

    it('then it registers the review hook of Claude Code, unless --no-hooks is passed', async () => {
      const cwd = createTempDir()
      const args = ['init', '--targets', 'claude', '--docs', BUNDLE_DIR, '--cwd', cwd]

      await runCli([...args, '--no-hooks'])

      expect(existsSync(join(cwd, '.claude/settings.json'))).toBe(false)

      await runCli(args)

      expect(readFileSync(join(cwd, '.claude/settings.json'), 'utf8')).toContain('maz-ui/mcp@')
      expect(readFileSync(join(cwd, '.claude/settings.json'), 'utf8')).toContain('review --hook')

      await runCli([...args, '--remove'])

      expect(existsSync(join(cwd, '.claude/settings.json'))).toBe(false)
    })

    it('then it recommends the Claude Code plugin until it is enabled', async () => {
      const cwd = createTempDir()
      const args = ['init', '--targets', 'claude', '--docs', BUNDLE_DIR, '--cwd', cwd]

      await runCli(args)

      expect(logged()).toContain('claude plugin install maz-ui --marketplace LouisMazel/maz-ui')

      log.mockClear()
      writeFile(cwd, '.claude/settings.local.json', JSON.stringify({ enabledPlugins: { 'maz-ui@maz-ui': true } }))
      await runCli(args)

      expect(logged()).not.toContain('claude plugin install')
    })

    it('then it registers the MCP server of Codex and recommends its plugin until it is enabled', async () => {
      const cwd = createTempDir()
      const codexHome = createTempDir()
      const args = ['init', '--targets', 'codex', '--docs', BUNDLE_DIR, '--cwd', cwd]
      vi.stubEnv('CODEX_HOME', codexHome)

      await runCli(args)

      expect(readFileSync(join(cwd, '.codex/config.toml'), 'utf8')).toContain('[mcp_servers.maz-ui]')
      expect(logged()).toContain('codex plugin marketplace add LouisMazel/maz-ui')

      log.mockClear()
      writeFile(codexHome, 'config.toml', '[plugins."maz-ui@maz-ui"]\nenabled = true\n')
      await runCli(args)

      expect(logged()).not.toContain('codex plugin marketplace add')
    })

    it('then it rejects unknown targets', async () => {
      expect(await runCli([
        'init',
        '--targets',
        'claude,emacs',
        '--cwd',
        createTempDir(),
      ])).toBe(1)
      expect(errored()).toContain('Unknown target(s): emacs')
    })

    it('then a dry run lists the changes without writing', async () => {
      const cwd = createTempDir()

      expect(await runCli([
        'init',
        '--dry-run',
        '--docs',
        BUNDLE_DIR,
        '--cwd',
        cwd,
      ])).toBe(0)
      expect(logged()).toContain('(claude, agents-md) - dry run')
      expect(logged()).toContain('would create')
      expect(existsSync(join(cwd, 'AGENTS.md'))).toBe(false)
    })

    it('then it configures the detected agents from the installed maz-ui', async () => {
      const cwd = createTempDir()
      const packageDir = writeFakeMazUi(cwd, { version: '5.0.0', withDocs: false })
      cpSync(join(BUNDLE_DIR, 'maz-ui'), join(packageDir, 'agent-docs'), { recursive: true })
      writeFile(cwd, '.cursor/rules/x.mdc', '')
      writeFile(cwd, 'CLAUDE.md', '# Project')

      expect(await runCli(['init', '--cwd', cwd])).toBe(0)
      expect(logged()).toContain('created')
      expect(readFileSync(join(cwd, '.cursor/mcp.json'), 'utf8')).toContain('@maz-ui/mcp')
      expect(readFileSync(join(cwd, 'AGENTS.md'), 'utf8')).toContain('<!-- BEGIN:maz-ui -->')
      expect(logged()).toContain('Cline and Zed read AGENTS.md')
    })

    it('then explicit targets, --no-mcp and --remove are applied', async () => {
      const cwd = createTempDir()

      await runCli([
        'init',
        '--targets',
        'claude',
        '--no-mcp',
        '--docs',
        BUNDLE_DIR,
        '--cwd',
        cwd,
      ])

      expect(existsSync(join(cwd, '.claude/rules/maz-ui.md'))).toBe(true)
      expect(existsSync(join(cwd, '.mcp.json'))).toBe(false)

      log.mockClear()
      await runCli([
        'init',
        '--targets',
        'claude',
        '--remove',
        '--cwd',
        cwd,
      ])

      expect(existsSync(join(cwd, '.claude/rules/maz-ui.md'))).toBe(false)
      expect(logged()).toContain('removed')
      expect(logged()).not.toContain('Cline and Zed')
    })

    it('then --paths scopes the Claude rule with a frontmatter and reports it', async () => {
      const cwd = createTempDir()

      await runCli([
        'init',
        '--targets',
        'claude',
        '--paths',
        'apps/web/**, packages/ui/**',
        '--docs',
        BUNDLE_DIR,
        '--cwd',
        cwd,
      ])

      expect(readFileSync(join(cwd, '.claude/rules/maz-ui.md'), 'utf8').startsWith('---\npaths:\n  - "apps/web/**"\n  - "packages/ui/**"\n---\n\n<!-- Managed by maz-ui')).toBe(true)
      expect(logged()).toContain('only loaded for: apps/web/**, packages/ui/**')
    })

    it('then --paths all keeps the Claude rule always loaded', async () => {
      const cwd = createTempDir()

      await runCli([
        'init',
        '--targets',
        'claude',
        '--paths',
        'all',
        '--docs',
        BUNDLE_DIR,
        '--cwd',
        cwd,
      ])

      expect(readFileSync(join(cwd, '.claude/rules/maz-ui.md'), 'utf8').startsWith('<!-- Managed by maz-ui')).toBe(true)
      expect(logged()).not.toContain('only loaded for')
    })

    it('then --no-rules only registers the MCP server', async () => {
      const cwd = createTempDir()

      await runCli([
        'init',
        '--targets',
        'claude,agents-md',
        '--no-rules',
        '--docs',
        BUNDLE_DIR,
        '--cwd',
        cwd,
      ])

      expect(existsSync(join(cwd, '.mcp.json'))).toBe(true)
      expect(existsSync(join(cwd, '.claude/rules/maz-ui.md'))).toBe(false)
      expect(existsSync(join(cwd, 'AGENTS.md'))).toBe(false)
      expect(logged()).not.toContain('Cline and Zed')
    })

    it('then a project without maz-ui only gets the MCP server', async () => {
      const cwd = createTempDir()

      expect(await runCli([
        'init',
        '--targets',
        'claude,agents-md',
        '--cwd',
        cwd,
      ])).toBe(0)
      expect(existsSync(join(cwd, '.mcp.json'))).toBe(true)
      expect(existsSync(join(cwd, '.claude/rules/maz-ui.md'))).toBe(false)
      expect(existsSync(join(cwd, 'AGENTS.md'))).toBe(false)
      expect(logged()).toContain('maz-ui is not installed in this project: only the MCP server is registered')
      expect(logged()).not.toContain('Cline and Zed')
    })

    it('then a project without maz-ui gets the rules of an explicit docs bundle', async () => {
      const cwd = createTempDir()

      await runCli([
        'init',
        '--targets',
        'claude',
        '--docs',
        BUNDLE_DIR,
        '--cwd',
        cwd,
      ])

      expect(existsSync(join(cwd, '.claude/rules/maz-ui.md'))).toBe(true)
      expect(logged()).not.toContain('maz-ui is not installed')
    })

    it('then a project without maz-ui and with --no-mcp fails', async () => {
      await expect(runCli([
        'init',
        '--targets',
        'claude',
        '--no-mcp',
        '--cwd',
        createTempDir(),
      ])).rejects.toThrow('maz-ui is not installed')
    })

    it('then the MCP server is pinned to this version and the local install is suggested', async () => {
      const cwd = createTempDir()

      await runCli([
        'init',
        '--targets',
        'claude',
        '--no-rules',
        '--cwd',
        cwd,
      ])

      expect(JSON.parse(readFileSync(join(cwd, '.mcp.json'), 'utf8')).mcpServers['maz-ui'].args).toEqual(['-y', `@maz-ui/mcp@${packageJson.version}`])
      expect(logged()).toContain('install @maz-ui/mcp as a devDependency of the project (`npm install -D @maz-ui/mcp`)')
    })

    it('then the install command follows the package manager of the project', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'pnpm-lock.yaml', '')

      await runCli([
        'init',
        '--targets',
        'claude',
        '--no-rules',
        '--cwd',
        cwd,
      ])

      expect(logged()).toContain('`pnpm add -D @maz-ui/mcp`')
    })

    it('then the installed @maz-ui/mcp is started through the package manager of the project', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'package.json', JSON.stringify({
        packageManager: 'pnpm@10.0.0',
        devDependencies: { '@maz-ui/mcp': '^5.0.0' },
      }))

      await runCli([
        'init',
        '--targets',
        'claude',
        '--no-rules',
        '--cwd',
        cwd,
      ])

      expect(JSON.parse(readFileSync(join(cwd, '.mcp.json'), 'utf8')).mcpServers['maz-ui']).toEqual({
        type: 'stdio',
        command: 'pnpm',
        args: ['exec', 'maz-ui-mcp'],
      })
      expect(logged()).not.toContain('devDependency')
    })

    it('then an up to date project reports unchanged files', async () => {
      const cwd = createTempDir()

      await runCli([
        'init',
        '--targets',
        'claude',
        '--docs',
        BUNDLE_DIR,
        '--cwd',
        cwd,
      ])
      log.mockClear()
      await runCli([
        'init',
        '--targets',
        'claude',
        '--docs',
        BUNDLE_DIR,
        '--cwd',
        cwd,
      ])

      expect(logged()).toContain('up to date')
    })

    it('then a dry run removal and skipped files are reported', async () => {
      const cwd = createTempDir()
      writeFile(cwd, '.claude/rules/maz-ui.md', 'my own rule')
      await runCli([
        'init',
        '--targets',
        'claude',
        '--docs',
        BUNDLE_DIR,
        '--cwd',
        cwd,
      ])

      expect(logged()).toContain('skipped')

      log.mockClear()
      writeFile(cwd, '.claude/rules/maz-ui.md', '<!-- Managed by maz-ui -->')
      await runCli([
        'init',
        '--targets',
        'claude',
        '--remove',
        '--dry-run',
        '--cwd',
        cwd,
      ])

      expect(logged()).toContain('would remove')
    })
  })

  describe('when main runs', () => {
    it('then it sets the exit code of the command', async () => {
      const argv = process.argv
      process.argv = ['node', 'maz-ui-mcp', 'nope']

      await main()

      expect(process.exitCode).toBe(1)
      process.argv = argv
    })

    it('then it keeps the exit code for the server', async () => {
      const argv = process.argv
      process.argv = [
        'node',
        'maz-ui-mcp',
        '--cwd',
        createTempDir(),
      ]

      await main()

      expect(process.exitCode).toBeUndefined()
      process.argv = argv
    })

    it('then it prints thrown errors', async () => {
      const argv = process.argv
      process.argv = ['node', 'maz-ui-mcp', '--unknown-flag']

      await main()

      expect(process.exitCode).toBe(1)
      expect(errored()).toContain('--unknown-flag')
      process.argv = argv
    })
  })

  describe('when doctor runs in a project without problem', () => {
    it('then it prints the versions and the servers', async () => {
      vi.stubEnv('HOME', createTempDir())
      const cwd = createTempDir()
      writeFakeMazUi(cwd, { version: '5.8.0' })
      writeFile(cwd, '.mcp.json', JSON.stringify({ mcpServers: { 'maz-ui': { command: 'pnpm', args: ['exec', 'maz-ui-mcp'] } } }))

      expect(await runCli(['doctor', '--cwd', cwd])).toBe(0)
      expect(logged()).toContain('maz-ui           5.8.0 (node_modules/maz-ui)')
      expect(logged()).toContain('@maz-ui/mcp      not installed: the servers download it with npx')
      expect(logged()).toContain('project  maz-ui: pnpm exec maz-ui-mcp (runs)')
      expect(logged()).toContain('No problem found.')
    })
  })

  describe('when doctor finds duplicates and an old maz-ui', () => {
    it('then it lists the problems with their fix', async () => {
      const home = createTempDir()
      vi.stubEnv('HOME', home)
      const cwd = createTempDir()
      writeFakeMazUi(cwd, { version: '4.0.0', withDocs: false })
      writeFakeMazUi(join(cwd, 'tools'), { version: '5.8.0' })
      writeFile(cwd, 'node_modules/@maz-ui/mcp/package.json', JSON.stringify({ name: '@maz-ui/mcp', version: '5.8.0' }))
      writeFile(home, '.claude/settings.json', JSON.stringify({ enabledPlugins: { 'maz-ui@maz-ui': true } }))
      writeFile(home, '.claude.json', JSON.stringify({ mcpServers: { 'maz-ui': { command: 'npx', args: ['@maz-ui/mcp'] } } }))
      writeFile(cwd, '.mcp.json', JSON.stringify({ mcpServers: { 'maz-ui': { command: 'npx', args: ['-y', '@maz-ui/mcp@4.0.0'] } } }))
      writeFile(cwd, '.claude/settings.local.json', JSON.stringify({ disabledMcpjsonServers: ['maz-ui'] }))

      expect(await runCli(['doctor', '--cwd', cwd])).toBe(1)
      expect(logged()).toContain('Claude plugin    enabled')
      expect(logged()).toContain('@maz-ui/mcp      5.8.0 (node_modules/@maz-ui/mcp)')
      expect(logged()).toContain('project  maz-ui: npx -y @maz-ui/mcp@4.0.0 (disabled for you (disabledMcpjsonServers))')
      expect(logged()).toContain('user     maz-ui: npx @maz-ui/mcp (runs)')
      expect(logged()).toContain('2 problems:')
      expect(logged()).toContain('runs beside the server of the maz-ui plugin')
      expect(logged()).toContain('fix: claude mcp remove maz-ui -s user')
      expect(logged()).toContain('maz-ui 4.0.0 ships no docs for the agents')
    })
  })

  describe('when doctor finds a server of the same name that wins', () => {
    it('then it shows the other one as not used', async () => {
      const home = createTempDir()
      vi.stubEnv('HOME', home)
      const cwd = createTempDir()
      writeFile(home, '.claude.json', JSON.stringify({ mcpServers: { 'maz-ui': { command: 'npx', args: ['@maz-ui/mcp'] } } }))
      writeFile(cwd, '.mcp.json', JSON.stringify({ mcpServers: { 'maz-ui': { command: 'pnpm', args: ['exec', 'maz-ui-mcp'] } } }))

      await runCli(['doctor', '--cwd', cwd])

      expect(logged()).toContain('user     maz-ui: npx @maz-ui/mcp (not used: another server of the same name wins)')
    })
  })

  describe('when doctor runs where Claude Code has no maz-ui server', () => {
    it('then it says so', async () => {
      vi.stubEnv('HOME', createTempDir())
      const cwd = createTempDir()

      expect(await runCli(['doctor', '--cwd', cwd])).toBe(1)
      expect(logged()).toContain('not installed: the docs bundled in @maz-ui/mcp are used')
      expect(logged()).toContain('Claude plugin    not enabled')
      expect(logged()).toContain('    none')
      expect(logged()).toContain('1 problem:')
    })
  })
})
