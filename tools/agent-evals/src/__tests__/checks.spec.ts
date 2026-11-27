import { Buffer } from 'node:buffer'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { addedDependencies, addedLines, runChecks } from '../checks.ts'
import { commitAll, createFixture } from '../fixture.ts'

const PACKAGE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const REPO_ROOT = resolve(PACKAGE_DIR, '../..')
const TEMPLATE_DIR = join(PACKAGE_DIR, 'fixture')

let parent: string

beforeEach(() => {
  parent = mkdtempSync(join(tmpdir(), 'maz-ui-agent-evals-checks-'))
})

afterEach(() => {
  rmSync(parent, { recursive: true, force: true })
})

describe('given runChecks', () => {
  describe('when the app is the template', () => {
    it('then it typechecks and builds', () => {
      const app = createFixture(REPO_ROOT, TEMPLATE_DIR, { parent })

      expect(runChecks(app)).toEqual({ typecheck: { passed: true, output: '' }, build: { passed: true, output: '' } })
    })
  })

  describe('when the agent writes a type error and breaks an import', () => {
    it('then both checks fail with their output', () => {
      const app = createFixture(REPO_ROOT, TEMPLATE_DIR, { parent })

      writeFileSync(join(app, 'src/App.vue'), '<script setup lang="ts">\nimport Missing from \'./Missing.vue\'\n\nconst count: number = \'one\'\n</script>\n\n<template>\n  <Missing :count="count" />\n</template>\n')

      const checks = runChecks(app)

      expect(checks.typecheck).toMatchObject({ passed: false, output: expect.stringContaining('TS2322') })
      expect(checks.build).toMatchObject({ passed: false, output: expect.stringContaining('Missing.vue') })
    })
  })
})

describe('given addedDependencies', () => {
  describe('when the agent adds dependencies to the package.json', () => {
    it('then it lists the new ones, sorted', () => {
      const app = createFixture(REPO_ROOT, TEMPLATE_DIR, { parent })
      const manifest = { dependencies: { 'vue': '^3.5.0', 'vee-validate': '^4.0.0' }, devDependencies: { '@vueuse/core': '^13.0.0', 'vite': '^8.0.0' } }

      writeFileSync(join(app, 'package.json'), JSON.stringify(manifest))

      expect(addedDependencies(app)).toEqual(['@vueuse/core', 'vee-validate'])
    })
  })

  describe('when the package.json is not valid JSON', () => {
    it('then nothing is added', () => {
      const app = createFixture(REPO_ROOT, TEMPLATE_DIR, { parent })

      writeFileSync(join(app, 'package.json'), '{')

      expect(addedDependencies(app)).toEqual([])
    })
  })
})

describe('given addedLines', () => {
  describe('when the agent creates and changes files', () => {
    it('then it counts the lines added to both, not the unchanged ones', () => {
      const app = createFixture(REPO_ROOT, TEMPLATE_DIR, { parent })

      writeFileSync(join(app, 'src/new.ts'), 'export const a = 1\nexport const b = 2\n')
      writeFileSync(join(app, 'src/App.vue'), '<template>\n  <div />\n</template>\n')

      expect(addedLines(app, ['src/App.vue', 'src/new.ts'])).toBe(3)
    })
  })

  describe('when a file is binary', () => {
    it('then it adds no line', () => {
      const app = createFixture(REPO_ROOT, TEMPLATE_DIR, { parent })

      commitAll(app, 'before')
      writeFileSync(join(app, 'src/logo.png'), Buffer.from([0, 1, 2, 0, 255]))

      expect(addedLines(app, ['src/logo.png'])).toBe(0)
    })
  })

  describe('when there is no file', () => {
    it('then it is 0', () => {
      expect(addedLines(parent, [])).toBe(0)
    })
  })
})
