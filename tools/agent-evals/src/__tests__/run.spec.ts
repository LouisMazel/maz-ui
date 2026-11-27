import type { ClaudeRunner } from '../run.ts'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, rmSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { changedFiles, checkBuilt, commitAll, createFixture } from '../fixture.ts'
import { review, runClaude, runTask } from '../run.ts'
import { TASKS } from '../tasks.ts'

const PACKAGE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const REPO_ROOT = resolve(PACKAGE_DIR, '../..')
const TEMPLATE_DIR = join(PACKAGE_DIR, 'fixture')
const COPY_LINK = TASKS.find(task => task.id === 'copy-link')!
const SUCCESS = [
  JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'mcp__maz-ui__search_docs', input: { query: 'copy' } }] } }),
  JSON.stringify({ type: 'result', subtype: 'success', is_error: false, total_cost_usd: 0.3, num_turns: 8, duration_ms: 45_000, result: 'Done' }),
].join('\n')
// maz-ui-review-ignore prefer-ecosystem -- fixture of the hand-made version the eval detects
const HAND_MADE = '<script setup lang="ts">\nfunction copy(url: string) {\n  navigator.clipboard.writeText(url)\n}\n</script>\n\n<template>\n  <button class="bg-blue-500" @click="copy(\'x\')">\n    Copy\n  </button>\n</template>\n'
const REUSED = '<script setup lang="ts">\nimport MazBtn from \'maz-ui/components/MazBtn\'\nimport { useClipboard } from \'maz-ui/composables/useClipboard\'\n\nconst props = defineProps<{ url: string }>()\nconst { copy, copied } = useClipboard()\n</script>\n\n<template>\n  <MazBtn @click="copy(props.url)">\n    {{ copied ? \'Copied\' : \'Copy\' }}\n  </MazBtn>\n</template>\n'

let parent: string

function writer(files: Record<string, string>, stdout = SUCCESS): { runner: ClaudeRunner, calls: Array<{ args: string[], cwd: string }> } {
  const calls: Array<{ args: string[], cwd: string }> = []

  return {
    calls,
    runner: (args, cwd) => {
      calls.push({ args, cwd })

      for (const [file, content] of Object.entries(files)) {
        mkdirSync(dirname(join(cwd, file)), { recursive: true })
        writeFileSync(join(cwd, file), content)
      }

      return Promise.resolve(stdout)
    },
  }
}

beforeEach(() => {
  parent = mkdtempSync(join(tmpdir(), 'maz-ui-agent-evals-'))
})

afterEach(() => {
  rmSync(parent, { recursive: true, force: true })
})

describe('given createFixture', () => {
  describe('when an app is created', () => {
    it('then it links the packages of the repository and commits the template', () => {
      const app = createFixture(REPO_ROOT, TEMPLATE_DIR, { parent })

      expect(existsSync(join(app, 'node_modules/maz-ui/package.json'))).toBe(true)
      expect(existsSync(join(app, 'node_modules/vue/package.json'))).toBe(true)
      expect(existsSync(join(app, 'node_modules/.bin/maz-ui-mcp'))).toBe(true)
      expect(changedFiles(app)).toEqual([])
    })
  })

  describe('when the app is created without @maz-ui/mcp', () => {
    it('then it neither links nor declares it', () => {
      const app = createFixture(REPO_ROOT, TEMPLATE_DIR, { parent, mcp: false })

      expect(existsSync(join(app, 'node_modules/@maz-ui/mcp'))).toBe(false)
      expect(existsSync(join(app, 'node_modules/.bin/maz-ui-mcp'))).toBe(false)
      expect(existsSync(join(app, 'node_modules/.bin/vue-tsc'))).toBe(true)
      expect(readFileSync(join(app, 'package.json'), 'utf8')).not.toContain('@maz-ui/mcp')
      expect(changedFiles(app)).toEqual([])
    })
  })
})

describe('given changedFiles', () => {
  describe('when files are added, changed, renamed and deleted', () => {
    it('then it lists the source files that remain, outside of node_modules and the types', () => {
      const app = createFixture(REPO_ROOT, TEMPLATE_DIR, { parent })

      writeFileSync(join(app, 'src/old.ts'), 'export const a = 1\n')
      commitAll(app, 'old')
      renameSync(join(app, 'src/old.ts'), join(app, 'src/renamed.ts'))
      writeFileSync(join(app, 'src/App.vue'), '<template><div /></template>\n')
      writeFileSync(join(app, 'src/env.d.ts'), 'declare const a: number\n')
      writeFileSync(join(app, 'notes.md'), '# notes\n')
      rmSync(join(app, 'src/style.css'))
      // eslint-disable-next-line sonarjs/no-os-command-from-path -- the git of the machine, in a temporary folder
      execFileSync('git', ['add', '-A'], { cwd: app })

      expect(changedFiles(app)).toEqual(['src/App.vue', 'src/renamed.ts'])
    })
  })
})

describe('given checkBuilt', () => {
  describe('when a package was built before the last change of its sources', () => {
    it('then it is stale', () => {
      for (const file of ['packages/mcp/src/cli.ts', 'packages/maz-ui/src/index.ts', 'packages/maz-ui/dist/index.js', 'packages/maz-ui/agent-docs/agents/session-context.md', 'packages/mcp/dist/cli.mjs', 'packages/mcp/src/__tests__/cli.spec.ts', 'packages/themes/dist/index.js']) {
        mkdirSync(dirname(join(parent, file)), { recursive: true })
        writeFileSync(join(parent, file), '')
      }

      utimesSync(join(parent, 'packages/maz-ui/dist/index.js'), new Date(2020, 0, 1), new Date(2020, 0, 1))
      utimesSync(join(parent, 'packages/mcp/dist/cli.mjs'), new Date(2030, 0, 1), new Date(2030, 0, 1))

      expect(checkBuilt(parent)).toEqual(['packages/maz-ui/dist (older than its sources)'])
    })
  })

  describe('when the packages of the repository are not built', () => {
    it('then it lists what is missing', () => {
      expect(checkBuilt(parent)).toEqual(['packages/maz-ui/dist', 'packages/maz-ui/agent-docs/agents/session-context.md', 'packages/mcp/dist'])
    })
  })
})

describe('given review', () => {
  describe('when there is no file', () => {
    it('then nothing is reviewed', () => {
      expect(review(REPO_ROOT, parent, [])).toBeUndefined()
    })
  })

  describe('when the review prints no JSON', () => {
    it('then there is no review', () => {
      expect(review(parent, parent, ['src/App.vue'])).toBeUndefined()
    })
  })
})

describe('given runTask', () => {
  describe('when the agent of the baseline writes the clipboard by hand', () => {
    it('then the run fails on the review and the patterns, and its results are saved', async () => {
      const { runner, calls } = writer({ 'src/components/ShareLink.vue': HAND_MADE })
      const outDir = join(parent, 'results')

      const score = await runTask({ repoRoot: REPO_ROOT, templateDir: TEMPLATE_DIR, task: COPY_LINK, condition: 'baseline', run: 1, outDir, runClaude: runner })

      expect(score).toMatchObject({ passed: false, files: ['src/components/ShareLink.vue'], linesAdded: 11, addedDependencies: [], checks: { typecheck: { passed: true }, build: { passed: true } }, missing: ['/\\buseClipboard\\b|<MazBtnClipboard\\b/'], forbidden: ['/navigator\\.clipboard/', '/<button\\b/'], costUsd: 0.3 })
      expect(score.findings).toEqual(expect.arrayContaining([expect.stringMatching(/^prefer-ecosystem \(src\/components\/ShareLink\.vue:3\)$/), expect.stringMatching(/^theme-colors /)]))
      expect(calls[0].args).toContain('--strict-mcp-config')
      expect(readFileSync(join(outDir, 'baseline-copy-link-1/transcript.jsonl'), 'utf8')).toBe(SUCCESS)
      expect(existsSync(calls[0].cwd)).toBe(false)
      expect(JSON.parse(readFileSync(join(outDir, 'baseline-copy-link-1/score.json'), 'utf8'))).toEqual(score)
      expect(readFileSync(join(outDir, 'baseline-copy-link-1/result.md'), 'utf8')).toBe('Done\n')
      expect(readFileSync(join(outDir, 'baseline-copy-link-1/files/src/components/ShareLink.vue'), 'utf8')).toBe(HAND_MADE)
    })
  })

  describe('when the agent writes code that does not typecheck', () => {
    it('then the run fails and the output of the typecheck is saved', async () => {
      const { runner } = writer({ 'src/count.ts': 'export const count: number = \'one\'\n' })
      const outDir = join(parent, 'results')

      const score = await runTask({ repoRoot: REPO_ROOT, templateDir: TEMPLATE_DIR, task: COPY_LINK, condition: 'baseline', run: 1, outDir, runClaude: runner })

      expect(score).toMatchObject({ passed: false, checks: { typecheck: { passed: false }, build: { passed: true } } })
      expect(readFileSync(join(outDir, 'baseline-copy-link-1/typecheck.log'), 'utf8')).toContain('TS2322')
      expect(existsSync(join(outDir, 'baseline-copy-link-1/build.log'))).toBe(false)
    })
  })

  describe('when the agent writes no file', () => {
    it('then nothing is checked', async () => {
      const { runner } = writer({})

      const score = await runTask({ repoRoot: REPO_ROOT, templateDir: TEMPLATE_DIR, task: COPY_LINK, condition: 'baseline', run: 1, outDir: join(parent, 'results'), runClaude: runner })

      expect(score).toMatchObject({ passed: false, error: 'no source file written', linesAdded: 0 })
      expect(score.checks).toBeUndefined()
    })
  })

  describe('when the agent of init reuses maz-ui and the app is kept', () => {
    it('then the run passes, the files of init are not counted and the app stays', async () => {
      const { runner, calls } = writer({ 'src/components/ShareLink.vue': REUSED })

      const score = await runTask({ repoRoot: REPO_ROOT, templateDir: TEMPLATE_DIR, task: COPY_LINK, condition: 'init', run: 2, outDir: join(parent, 'results'), keep: true, runClaude: runner })

      expect(score).toMatchObject({ passed: true, files: ['src/components/ShareLink.vue'], findings: [], app: calls[0].cwd, usage: { mcpTools: ['search_docs'] } })
      expect(existsSync(join(calls[0].cwd, '.mcp.json'))).toBe(true)
      expect(existsSync(join(calls[0].cwd, '.claude/settings.json'))).toBe(true)
      expect(existsSync(join(calls[0].cwd, '.claude/settings.local.json'))).toBe(false)
      rmSync(calls[0].cwd, { recursive: true, force: true })
    })
  })
})

describe('given runClaude', () => {
  function fakeClaude(script: string): void {
    const bin = join(parent, 'bin')

    mkdirSync(bin)
    writeFileSync(join(bin, 'claude'), `#!/bin/sh\n${script}\n`, { mode: 0o755 })
    vi.stubEnv('PATH', `${bin}:${process.env.PATH}`)
  }

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('when claude prints its result', () => {
    it('then it resolves with the stdout, run in the app with the arguments', async () => {
      fakeClaude('echo "$PWD $@"')

      expect(await runClaude(['-p', 'hello'], parent)).toBe(`${realpathSync(parent)} -p hello\n`)
    })
  })

  describe('when claude only prints an error', () => {
    it('then it resolves with the stderr', async () => {
      fakeClaude('echo "Not logged in" >&2\nexit 1')

      expect(await runClaude([], parent)).toBe('Not logged in\n')
    })
  })

  describe('when claude is not found', () => {
    it('then it resolves with the error', async () => {
      vi.stubEnv('PATH', parent)

      expect(await runClaude([], parent)).toContain('ENOENT')
    })
  })
})
