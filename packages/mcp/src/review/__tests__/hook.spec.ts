import type { HookInput } from '../hook.ts'

import { execFileSync } from 'node:child_process'
import { realpathSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { cleanTempDirs, createTempDir, getKnowledge, writeFile } from '../../__tests__/helpers.ts'
import { changedFiles, mazUiProjectOf, reviewHook } from '../hook.ts'

const NATIVE_BUTTON = '<template><button>b</button></template>'

function git(cwd: string, ...args: string[]): void {
  execFileSync('git', args, { cwd, stdio: 'ignore' })
}

function createRepository(): string {
  const cwd = createTempDir()

  git(cwd, 'init', '-q')
  git(cwd, 'config', 'user.email', 'test@maz-ui.com')
  git(cwd, 'config', 'user.name', 'test')
  writeFile(cwd, 'package.json', JSON.stringify({ dependencies: { 'maz-ui': '^5.0.0' } }))
  writeFile(cwd, 'src/Committed.vue', '<template><MazBtn>b</MazBtn></template>')
  git(cwd, 'add', '.')
  git(cwd, 'commit', '-q', '-m', 'init')

  return cwd
}

function review(input: HookInput, cwd: string): Promise<string | undefined> {
  return reviewHook(input, { knowledge: getKnowledge(), cwd })
}

afterEach(() => {
  cleanTempDirs()
})

describe('given the files changed in a git repository', () => {
  describe('when files are modified, added, renamed and deleted', () => {
    it('then it lists the modified, added and renamed files, not the deleted ones', () => {
      const cwd = createRepository()

      writeFile(cwd, 'src/Committed.vue', NATIVE_BUTTON)
      writeFile(cwd, 'src/New.vue', NATIVE_BUTTON)
      writeFile(cwd, 'src/Gone.ts', 'export const a = 1')
      git(cwd, 'add', '.')
      git(cwd, 'commit', '-q', '-m', 'files')
      renameSync(join(cwd, 'src/New.vue'), join(cwd, 'src/Renamed.vue'))
      git(cwd, 'add', '-A')
      rmSync(join(cwd, 'src/Gone.ts'))
      writeFile(cwd, 'src/Untracked.ts', 'export const b = 1')

      expect(changedFiles(cwd).map(file => file.slice(file.indexOf('/src/') + 1)).sort()).toEqual(['src/Renamed.vue', 'src/Untracked.ts'])
    })
  })

  describe('when the directory is not a git repository', () => {
    it('then it lists nothing', () => {
      expect(changedFiles(createTempDir())).toEqual([])
    })
  })
})

describe('given the review hook', () => {
  describe('when a task stops with a file written by Bash', () => {
    it('then it reviews the changed files of the repository', async () => {
      const cwd = createRepository()
      writeFile(cwd, 'src/Bash.vue', NATIVE_BUTTON)

      const message = await review({ hook_event_name: 'Stop', cwd }, cwd)

      expect(message).toContain('maz-ui review of the files changed in this task')
      expect(message).toContain('src/Bash.vue')
      expect(message).toContain('[prefer-maz-component]')
      expect(message).not.toContain('Committed.vue')
    })
  })

  describe('when the agent already continues because of a stop hook', () => {
    it('then it lets it stop', async () => {
      const cwd = createRepository()
      writeFile(cwd, 'src/Bash.vue', NATIVE_BUTTON)

      expect(await review({ hook_event_name: 'Stop', stop_hook_active: true, cwd }, cwd)).toBeUndefined()
    })
  })

  describe('when a finding was already sent in the session', () => {
    it('then the stop does not send it again', async () => {
      const cwd = createRepository()
      const file = writeFile(cwd, 'src/Edited.vue', NATIVE_BUTTON)
      const session = `session-${Date.now()}`

      expect(await review({ hook_event_name: 'PostToolUse', session_id: session, tool_input: { file_path: file }, cwd }, cwd)).toContain('[prefer-maz-component]')
      expect(await review({ hook_event_name: 'SubagentStop', session_id: session, cwd }, cwd)).toBeUndefined()
    })
  })

  describe('when a subagent stops without a session id', () => {
    it('then it sends every finding', async () => {
      const cwd = createRepository()
      writeFile(cwd, 'src/Bash.vue', NATIVE_BUTTON)

      expect(await review({ hook_event_name: 'SubagentStop', session_id: '../escape', cwd }, cwd)).toContain('src/Bash.vue')
    })
  })

  describe('when the changed files are clean', () => {
    it('then it has nothing to say', async () => {
      const cwd = createRepository()
      writeFile(cwd, 'src/Clean.ts', 'export const a = 1')

      expect(await review({ hook_event_name: 'Stop' }, cwd)).toBeUndefined()
    })
  })
})

describe('given a pnpm monorepo whose session starts at the root', () => {
  function createMonorepo(): string {
    const cwd = createRepository()

    writeFile(cwd, 'package.json', JSON.stringify({ private: true }))
    writeFile(cwd, 'apps/desktop/package.json', JSON.stringify({ dependencies: { 'maz-ui': '^5.0.0' } }))
    writeFile(cwd, 'apps/desktop/node_modules/maz-ui/package.json', JSON.stringify({ name: 'maz-ui', version: '5.0.0' }))

    return cwd
  }

  describe('when a task stops with a file of the app changed', () => {
    it('then the file is reviewed with the docs of the maz-ui of its app', async () => {
      const cwd = createMonorepo()
      writeFile(cwd, 'apps/desktop/src/Page.vue', NATIVE_BUTTON)
      const knowledgeFor = vi.fn(() => getKnowledge())

      const message = await reviewHook({ hook_event_name: 'Stop', cwd }, { knowledge: getKnowledge(), knowledgeFor, cwd })

      expect(message).toContain('apps/desktop/src/Page.vue')
      expect(knowledgeFor).toHaveBeenCalledWith(join(realpathSync(cwd), 'apps/desktop'))
    })
  })

  describe('when the closest project of a file is looked for', () => {
    it('then it is the folder where maz-ui is installed', () => {
      const cwd = createMonorepo()

      expect(mazUiProjectOf(join(cwd, 'apps/desktop/src/Page.vue'))).toBe(join(cwd, 'apps/desktop'))
      expect(mazUiProjectOf(join(cwd, 'src/Other.vue'))).toBeUndefined()
    })
  })
})
