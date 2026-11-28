import { utimesSync } from 'node:fs'
import { join } from 'node:path'
import { createContext } from '../context.ts'
import { BUNDLE_DIR, cleanTempDirs, createTempDir, getKnowledge, writeFakeMazUi } from './helpers.ts'

function bump(project: string): void {
  const date = new Date(Date.now() + 10_000)

  utimesSync(join(project, 'node_modules', 'maz-ui', 'package.json'), date, date)
}

describe('given a context created in a project with maz-ui installed', () => {
  afterEach(() => cleanTempDirs())

  describe('when the installed version is unchanged', () => {
    it('then refresh keeps the same knowledge', () => {
      const project = createTempDir()
      writeFakeMazUi(project, { version: '1.0.0' })
      const context = createContext({ cwd: project, bundledDir: BUNDLE_DIR })
      const before = context.knowledge

      expect(context.refresh()).toBe(false)
      expect(context.knowledge).toBe(before)
    })
  })

  describe('when maz-ui is upgraded after the context was created', () => {
    it('then refresh reloads the knowledge of the new version', () => {
      const project = createTempDir()
      writeFakeMazUi(project, { version: '1.0.0' })
      const context = createContext({ cwd: project, bundledDir: BUNDLE_DIR })
      const before = context.knowledge

      expect(before.version).toBe('1.0.0')

      writeFakeMazUi(project, { version: '2.0.0' })
      bump(project)

      expect(context.refresh()).toBe(true)
      expect(context.knowledge).not.toBe(before)
      expect(context.knowledge.version).toBe('2.0.0')
      expect(context.refresh()).toBe(false)
    })
  })

  describe('when the knowledge is given explicitly', () => {
    it('then refresh never reloads', () => {
      const project = createTempDir()
      writeFakeMazUi(project, { version: '1.0.0' })
      const context = createContext({ cwd: project, knowledge: getKnowledge() })

      writeFakeMazUi(project, { version: '2.0.0' })
      bump(project)

      expect(context.refresh()).toBe(false)
    })
  })
})
