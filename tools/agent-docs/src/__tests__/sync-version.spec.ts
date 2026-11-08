import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { syncBundleVersions } from '../sync-version'

function write(root: string, file: string, content: unknown): void {
  mkdirSync(join(root, file, '..'), { recursive: true })
  writeFileSync(join(root, file), JSON.stringify(content))
}

describe('given built fragments generated before the version bump', () => {
  let root: string

  const read = (file: string): unknown => JSON.parse(readFileSync(join(root, file), 'utf8'))

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'agent-docs-sync-'))
    write(root, 'packages/maz-ui/package.json', { name: 'maz-ui', version: '5.1.0-beta.1' })
    write(root, 'packages/maz-ui/agent-docs/manifest.json', { schemaVersion: 2, version: '5.1.0-beta.0', docs: [] })
    write(root, 'packages/themes/package.json', { name: '@maz-ui/themes', version: '5.1.0-beta.1' })
    write(root, 'packages/mcp/agent-docs/themes/manifest.json', { schemaVersion: 2, version: '5.1.0-beta.0', docs: [] })
    write(root, 'packages/upgrade/package.json', { name: '@maz-ui/upgrade', version: '5.4.0' })
    write(root, 'packages/upgrade/agent-docs/manifest.json', { schemaVersion: 2, version: '5.3.1' })
    write(root, 'packages/mcp/agent-docs/upgrade/manifest.json', { schemaVersion: 2, version: '5.4.0' })
    write(root, 'packages/utils/package.json', { name: '@maz-ui/utils', version: '5.1.0-beta.1' })
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  describe('when the versions are synced', () => {
    it('then each manifest gets the bumped version of its own package and keeps its content', () => {
      expect(syncBundleVersions(root).sort()).toEqual([
        join(root, 'packages/maz-ui/agent-docs/manifest.json'),
        join(root, 'packages/mcp/agent-docs/themes/manifest.json'),
        join(root, 'packages/upgrade/agent-docs/manifest.json'),
      ].sort())
      expect(read('packages/maz-ui/agent-docs/manifest.json')).toEqual({ schemaVersion: 2, version: '5.1.0-beta.1', docs: [] })
      expect(read('packages/mcp/agent-docs/themes/manifest.json')).toEqual({ schemaVersion: 2, version: '5.1.0-beta.1', docs: [] })
      expect(read('packages/upgrade/agent-docs/manifest.json')).toEqual({ schemaVersion: 2, version: '5.4.0' })
    })

    it('then the manifests already up to date and the missing folders are left untouched', () => {
      syncBundleVersions(root)

      expect(syncBundleVersions(root)).toEqual([])
    })
  })
})
