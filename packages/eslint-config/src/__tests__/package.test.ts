import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const manifest = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8')) as {
  peerDependencies: Record<string, string>
  peerDependenciesMeta: Record<string, { optional?: boolean }>
}

describe('given the package manifest', () => {
  describe('when the peer dependencies are read', () => {
    it('then TypeScript 5 and 6 are accepted, TypeScript 7 (no compiler API for typescript-eslint) is not', () => {
      expect(manifest.peerDependencies.typescript).toBe('^5.0.0 || ^6.0.0')
    })

    it('then TypeScript is optional, for projects without TypeScript files', () => {
      expect(manifest.peerDependenciesMeta.typescript).toEqual({ optional: true })
    })
  })
})
