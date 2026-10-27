import { Buffer } from 'node:buffer'
import { cpSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { version } from '../../package.json' with { type: 'json' }
import { HELP, main, runCli } from '../cli'
import { startStdioServer } from '../server'
import { BUNDLE_DIR, cleanTempDirs, createTempDir, writeFakeMazUi, writeFile } from './helpers'

vi.mock('../server', () => ({ startStdioServer: vi.fn() }))

function mockStdin(content: string): void {
  vi.spyOn(process, 'stdin', 'get').mockReturnValue(Readable.from([Buffer.from(content)]) as unknown as typeof process.stdin)
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
      expect(logged()).toBe(version)
    })
  })

  describe('when the command is unknown', () => {
    it('then it prints the help as an error', async () => {
      expect(await runCli(['nope'])).toBe(1)
      expect(errored()).toContain('Unknown command "nope"')
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
      expect(await runCli(['search', 'phone', 'number', '--cwd', createTempDir()])).toBe(0)
      expect(logged()).toContain('MazInputPhoneNumber')
    })

    it('then it searches a default query without words', async () => {
      await runCli(['search', '--cwd', createTempDir(), '--docs', BUNDLE_DIR])

      expect(logged()).toContain('results for "button"')
    })
  })

  describe('when review is used', () => {
    it('then it requires paths', async () => {
      expect(await runCli(['review', '--cwd', createTempDir()])).toBe(1)
      expect(errored()).toContain('Pass the files')
    })

    it('then it prints the findings and fails on errors', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'A.vue', '<template><MazBtn color="red">x</MazBtn></template>')

      expect(await runCli(['review', 'A.vue', '--cwd', cwd, '--docs', BUNDLE_DIR])).toBe(1)
      expect(logged()).toContain('A.vue: 1 error')
      expect(logged()).toContain('1 file(s) reviewed')
    })

    it('then it succeeds without errors and respects --max-warnings', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'A.vue', '<template><button>b</button></template>')

      expect(await runCli(['review', 'A.vue', '--cwd', cwd])).toBe(0)
      expect(await runCli(['review', 'A.vue', '--cwd', cwd, '--max-warnings', '0'])).toBe(1)
      expect(await runCli(['review', 'A.vue', '--cwd', cwd, '--min-severity', 'error'])).toBe(0)
    })

    it('then it prints JSON', async () => {
      const cwd = createTempDir()
      writeFile(cwd, 'a.ts', 'import { MazBtn } from \'maz-ui\'')

      await runCli(['review', 'a.ts', '--cwd', cwd, '--format', 'json', '--framework', 'vue'])

      const output = JSON.parse(logged()) as { totals: { error: number }, files: Array<{ file: string }>, truncated: boolean }

      expect(output.totals.error).toBe(1)
      expect(output.files[0].file).toBe('a.ts')
      expect(output.truncated).toBe(false)
    })
  })

  describe('when review runs as a Claude Code hook', () => {
    it('then a file with findings exits with 2 and explains them on stderr', async () => {
      const cwd = createTempDir()
      const file = writeFile(cwd, 'A.vue', '<template><button>b</button></template>')
      mockStdin(JSON.stringify({ tool_input: { file_path: file }, cwd }))

      expect(await runCli(['review', '--hook', '--cwd', cwd])).toBe(2)
      expect(errored()).toContain('[prefer-maz-component]')
      expect(errored()).toContain('maz-ui-review-ignore')
    })

    it('then a clean file exits with 0', async () => {
      const cwd = createTempDir()
      const file = writeFile(cwd, 'a.ts', 'export const a = 1')
      mockStdin(JSON.stringify({ tool_input: { file_path: file } }))

      expect(await runCli(['review', '--hook', '--cwd', cwd])).toBe(0)
    })

    it.each([
      ['a non reviewable file', { tool_input: { file_path: '/project/README.md' } }],
      ['a dependency file', { tool_input: { file_path: '/project/node_modules/x/a.vue' } }],
      ['no file', {}],
    ])('then %s exits with 0', async (_, input) => {
      mockStdin(JSON.stringify(input))

      expect(await runCli(['review', '--hook', '--cwd', createTempDir()])).toBe(0)
    })

    it('then an empty stdin exits with 0', async () => {
      mockStdin('')

      expect(await runCli(['review', '--hook', '--cwd', createTempDir()])).toBe(0)
    })
  })

  describe('when init is used', () => {
    it('then it rejects unknown targets', async () => {
      expect(await runCli(['init', '--targets', 'claude,emacs', '--cwd', createTempDir()])).toBe(1)
      expect(errored()).toContain('Unknown target(s): emacs')
    })

    it('then a dry run lists the changes without writing', async () => {
      const cwd = createTempDir()

      expect(await runCli(['init', '--dry-run', '--docs', BUNDLE_DIR, '--cwd', cwd])).toBe(0)
      expect(logged()).toContain('(claude, agents-md) - dry run')
      expect(logged()).toContain('would create')
      expect(existsSync(join(cwd, 'AGENTS.md'))).toBe(false)
    })

    it('then it configures the detected agents from the installed maz-ui', async () => {
      const cwd = createTempDir()
      const packageDir = writeFakeMazUi(cwd, { version: '5.0.0', withDocs: false })
      cpSync(BUNDLE_DIR, join(packageDir, 'docs'), { recursive: true })
      writeFile(cwd, '.cursor/rules/x.mdc', '')
      writeFile(cwd, 'CLAUDE.md', '# Project')

      expect(await runCli(['init', '--cwd', cwd])).toBe(0)
      expect(logged()).toContain('created')
      expect(readFileSync(join(cwd, '.cursor/mcp.json'), 'utf8')).toContain('@maz-ui/mcp')
      expect(readFileSync(join(cwd, 'AGENTS.md'), 'utf8')).toContain('<!-- BEGIN:maz-ui -->')
      expect(logged()).toContain('Codex and Windsurf read AGENTS.md')
    })

    it('then explicit targets, --no-mcp and --remove are applied', async () => {
      const cwd = createTempDir()

      await runCli(['init', '--targets', 'claude', '--no-mcp', '--docs', BUNDLE_DIR, '--cwd', cwd])

      expect(existsSync(join(cwd, '.claude/rules/maz-ui.md'))).toBe(true)
      expect(existsSync(join(cwd, '.mcp.json'))).toBe(false)

      log.mockClear()
      await runCli(['init', '--targets', 'claude', '--remove', '--cwd', cwd])

      expect(existsSync(join(cwd, '.claude/rules/maz-ui.md'))).toBe(false)
      expect(logged()).toContain('removed')
      expect(logged()).not.toContain('Codex and Windsurf')
    })

    it('then --no-rules only registers the MCP server', async () => {
      const cwd = createTempDir()

      await runCli(['init', '--targets', 'claude,agents-md', '--no-rules', '--docs', BUNDLE_DIR, '--cwd', cwd])

      expect(existsSync(join(cwd, '.mcp.json'))).toBe(true)
      expect(existsSync(join(cwd, '.claude/rules/maz-ui.md'))).toBe(false)
      expect(existsSync(join(cwd, 'AGENTS.md'))).toBe(false)
      expect(logged()).not.toContain('Codex and Windsurf')
    })

    it('then an up to date project reports unchanged files', async () => {
      const cwd = createTempDir()

      await runCli(['init', '--targets', 'claude', '--docs', BUNDLE_DIR, '--cwd', cwd])
      log.mockClear()
      await runCli(['init', '--targets', 'claude', '--docs', BUNDLE_DIR, '--cwd', cwd])

      expect(logged()).toContain('up to date')
    })

    it('then a dry run removal and skipped files are reported', async () => {
      const cwd = createTempDir()
      writeFile(cwd, '.claude/rules/maz-ui.md', 'my own rule')
      await runCli(['init', '--targets', 'claude', '--docs', BUNDLE_DIR, '--cwd', cwd])

      expect(logged()).toContain('skipped')

      log.mockClear()
      writeFile(cwd, '.claude/rules/maz-ui.md', '<!-- Managed by maz-ui -->')
      await runCli(['init', '--targets', 'claude', '--remove', '--dry-run', '--cwd', cwd])

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
      process.argv = ['node', 'maz-ui-mcp', '--cwd', createTempDir()]

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
})
