import { fileURLToPath } from 'node:url'
import { loadIconNames, locateIconsPackage, resolveIconsPackage } from '../sources.ts'

const { resolvable } = vi.hoisted(() => ({
  resolvable: { fromPlugin: true },
}))

vi.mock('node:module', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:module')>()
  return {
    ...actual,
    createRequire: (from: string) => ({
      resolve: (id: string) => {
        if (from.startsWith('file:') && resolvable.fromPlugin)
          return `/plugin/node_modules/${id}`
        throw new Error(`Cannot find module '${id}'`)
      },
    }),
  }
})

describe('given a project that resolves neither maz-ui nor @maz-ui/icons', () => {
  describe('when the plugin resolves @maz-ui/icons', () => {
    it('then the one of the plugin is used', () => {
      resolvable.fromPlugin = true

      expect(resolveIconsPackage('/project')).toBe('/plugin/node_modules/@maz-ui/icons')
      expect(locateIconsPackage('/project')?.importer).toBe(fileURLToPath(new URL('../sources.ts', import.meta.url)))
    })
  })

  describe('when nothing resolves @maz-ui/icons', () => {
    it('then it is not found', () => {
      resolvable.fromPlugin = false

      expect(resolveIconsPackage('/project')).toBeUndefined()
      expect(loadIconNames({ root: '/project' })).toEqual([])
    })
  })
})
