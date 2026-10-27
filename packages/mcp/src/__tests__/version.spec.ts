import { readOwnVersion } from '../version'
import { cleanTempDirs, createTempDir, writeFile } from './helpers'

afterEach(() => {
  cleanTempDirs()
})

describe('given readOwnVersion', () => {
  describe('when it runs from the sources of the package', () => {
    it('then it reads the version of @maz-ui/mcp', () => {
      expect(readOwnVersion()).toMatch(/^\d+\.\d+\.\d+/)
    })
  })

  describe('when a parent folder has the package.json of @maz-ui/mcp', () => {
    it('then it skips the other package.json files', () => {
      const directory = createTempDir()

      writeFile(directory, 'package.json', JSON.stringify({ name: '@maz-ui/mcp', version: '7.8.9' }))
      writeFile(directory, 'dist/package.json', JSON.stringify({ type: 'module' }))

      expect(readOwnVersion(`${directory}/dist`)).toBe('7.8.9')
    })
  })

  describe('when no parent folder has the package.json of @maz-ui/mcp', () => {
    it('then the version is unknown', () => {
      expect(readOwnVersion(createTempDir())).toBe('0.0.0')
    })
  })
})
