import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { findPackageDefinition, PACKAGE_DEFINITIONS } from '../packages'
import { getSourcePaths } from '../paths'

describe('given PACKAGE_DEFINITIONS', () => {
  const { root } = getSourcePaths()

  describe('when reading the packages of the repository', () => {
    it('then every definition matches a published package', () => {
      for (const definition of PACKAGE_DEFINITIONS) {
        const file = join(root, 'packages', definition.dir, 'package.json')

        expect(existsSync(file), definition.name).toBe(true)

        const manifest = JSON.parse(readFileSync(file, 'utf8')) as { name: string, private?: boolean }

        expect(manifest.name).toBe(definition.name)
        expect(manifest.private).toBeUndefined()
        expect(definition.short).toBe(definition.name.replace('@maz-ui/', ''))
      }
    })

    it('then ecosystem and tooling packages follow the release groups', () => {
      const tooling = PACKAGE_DEFINITIONS.filter(definition => definition.group === 'tooling').map(definition => definition.name)

      expect(tooling).toEqual([
        '@maz-ui/node',
        '@maz-ui/eslint-config',
        '@maz-ui/stylelint-config',
        '@maz-ui/upgrade',
      ])
    })
  })

  describe('when looking up a package', () => {
    it('then returns its definition or undefined', () => {
      expect(findPackageDefinition('@maz-ui/icons')?.dir).toBe('icons')
      expect(findPackageDefinition('@maz-ui/unknown')).toBeUndefined()
    })
  })
})
