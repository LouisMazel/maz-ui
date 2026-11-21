import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HOOKS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../plugins/claude-code/hooks')
const FAKE_MCP_BIN = 'process.stderr.write("reviewed")\nprocess.exit(2)\n'

let root: string

function write(file: string, content: string): void {
  mkdirSync(dirname(join(root, file)), { recursive: true })
  writeFileSync(join(root, file), content)
}

function installMazUi(project: string, version = '5.9.0'): void {
  write(`${project}/node_modules/maz-ui/package.json`, JSON.stringify({ name: 'maz-ui', version }))
  write(`${project}/node_modules/maz-ui/agent-docs/agents/session-context.md`, '# maz-ui\n\nReuse the ecosystem.\n')
}

function runHook(script: string, input: Record<string, unknown>) {
  const result = spawnSync(process.execPath, [join(HOOKS_DIR, script)], { input: JSON.stringify({ cwd: root, ...input }), encoding: 'utf8' })

  return { status: result.status, stdout: result.stdout, stderr: result.stderr }
}

function context(input: Record<string, unknown> = {}): string | undefined {
  const { stdout } = runHook('context.mjs', { hook_event_name: 'SessionStart', ...input })

  return stdout
    ? (JSON.parse(stdout) as { hookSpecificOutput: { additionalContext: string } }).hookSpecificOutput.additionalContext
    : undefined
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'maz-ui-plugin-hooks-'))
})

afterEach(() => {
  rmSync(root, { recursive: true, force: true })
})

describe('given the context hook of the plugin', () => {
  describe('when the session starts in a project that installs maz-ui', () => {
    it('then it adds the rules of the installed version', () => {
      installMazUi('.')

      expect(context()).toBe('maz-ui 5.9.0 is installed in `.`. Its rules, from its docs (maz-ui Claude Code plugin):\n\n# maz-ui\n\nReuse the ecosystem.\n')
    })
  })

  describe('when the session starts at the root of a pnpm monorepo', () => {
    it('then it finds maz-ui in the apps', () => {
      write('pnpm-workspace.yaml', 'packages: [apps/*]')
      installMazUi('apps/web')
      installMazUi('apps/admin')

      expect(context()).toContain('is installed in `apps/admin`, `apps/web`')
    })
  })

  describe('when a folder that is not a monorepo holds projects', () => {
    it('then it adds nothing', () => {
      installMazUi('projects/web')

      expect(context()).toBeUndefined()
    })
  })

  describe('when a read-only subagent or the maz-ui editor starts', () => {
    it('then it adds nothing', () => {
      installMazUi('.')

      expect(context({ hook_event_name: 'SubagentStart', agent_type: 'Explore' })).toBeUndefined()
      expect(context({ hook_event_name: 'SubagentStart', agent_type: 'maz-ui:maz-ui-editor' })).toBeUndefined()
    })
  })

  describe('when a subagent that writes code starts', () => {
    it('then it gets the rules too', () => {
      installMazUi('.')

      expect(context({ hook_event_name: 'SubagentStart', agent_type: 'general-purpose' })).toContain('Reuse the ecosystem.')
    })
  })

  describe('when the project loads the rules at each session', () => {
    it.each([
      ['an unscoped Claude rule', '.claude/rules/maz-ui.md', '# maz-ui\n'],
      ['the maz-ui section in CLAUDE.md', 'CLAUDE.md', '<!-- BEGIN:maz-ui -->\n'],
    ])('then %s is enough', (_, file, content) => {
      installMazUi('.')
      write(file, content)

      expect(context()).toBeUndefined()
    })

    it('then the section of AGENTS.md imported by CLAUDE.md is enough', () => {
      installMazUi('.')
      write('CLAUDE.md', '@AGENTS.md\n')
      write('AGENTS.md', '<!-- BEGIN:maz-ui -->\n')

      expect(context()).toBeUndefined()
    })
  })

  describe('when the Claude rule is scoped to some paths', () => {
    it('then the rules are added', () => {
      installMazUi('.')
      write('.claude/rules/maz-ui.md', '---\npaths:\n  - "src/**"\n---\n# maz-ui\n')

      expect(context()).toContain('Reuse the ecosystem.')
    })
  })

  describe('when the installed maz-ui has no agent docs', () => {
    it('then it asks to use the skill and the MCP tools', () => {
      write('node_modules/maz-ui/package.json', JSON.stringify({ name: 'maz-ui', version: '4.0.0' }))

      expect(context()).toContain('Invoke the `maz-ui` skill')
    })
  })
})

describe('given the review hook of the plugin', () => {
  function createMonorepo(): void {
    // eslint-disable-next-line sonarjs/no-os-command-from-path -- the git of the machine, in a temporary folder
    execFileSync('git', ['init', '-q'], { cwd: root })
    write('pnpm-workspace.yaml', 'packages: [apps/*]')
    installMazUi('apps/desktop')
    write('apps/desktop/node_modules/@maz-ui/mcp/bin/maz-ui-mcp.mjs', FAKE_MCP_BIN)
  }

  describe('when a task stops at the root of a pnpm monorepo with a file of an app changed', () => {
    it('then it reviews it with the @maz-ui/mcp of the app', () => {
      createMonorepo()
      write('apps/desktop/src/slug.ts', 'export const a = 1\n')

      const { status, stderr } = runHook('review.mjs', { hook_event_name: 'Stop' })

      expect(status).toBe(2)
      expect(stderr).toBe('reviewed')
    })
  })

  describe('when the changed files are outside of the apps that use maz-ui', () => {
    it('then nothing is spawned', () => {
      createMonorepo()
      write('scripts/build.ts', 'export const a = 1\n')

      expect(runHook('review.mjs', { hook_event_name: 'Stop' }).status).toBe(0)
    })
  })

  describe('when the agent already continues because of a stop hook', () => {
    it('then it lets it stop', () => {
      createMonorepo()
      write('apps/desktop/src/slug.ts', 'export const a = 1\n')

      expect(runHook('review.mjs', { hook_event_name: 'Stop', stop_hook_active: true }).status).toBe(0)
    })
  })

  describe('when a file of an app is edited from the root', () => {
    it('then it is reviewed, with a relative path too', () => {
      createMonorepo()

      expect(runHook('review.mjs', { hook_event_name: 'PostToolUse', tool_input: { file_path: 'apps/desktop/src/App.vue' } }).status).toBe(2)
    })
  })

  describe('when the edited file is not reviewable', () => {
    it.each(['apps/desktop/README.md', 'apps/desktop/node_modules/x/index.js'])('then %s is skipped', (file) => {
      createMonorepo()

      expect(runHook('review.mjs', { hook_event_name: 'PostToolUse', tool_input: { file_path: file } }).status).toBe(0)
    })
  })

  describe('when the session is not in a git repository', () => {
    it('then a stop reviews nothing', () => {
      installMazUi('.')

      expect(runHook('review.mjs', { hook_event_name: 'Stop' }).status).toBe(0)
    })
  })
})
