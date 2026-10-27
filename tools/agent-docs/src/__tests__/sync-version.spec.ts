import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { syncBundleVersions } from '../sync-version'

function write(root: string, file: string, content: unknown): void {
  mkdirSync(join(root, file, '..'), { recursive: true })
  writeFileSync(join(root, file), JSON.stringify(content))
}

describe('given built bundles generated before the version bump', () => {
  let root: string

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'agent-docs-sync-'))
    write(root, 'packages/lib/package.json', { name: 'maz-ui', version: '5.1.0-beta.1' })
    write(root, 'packages/lib/docs/manifest.json', { schemaVersion: 1, version: '5.1.0-beta.0', docs: [] })
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  describe('when the versions are synced', () => {
    it('then the manifests get the bumped maz-ui version and keep their content', () => {
      expect(syncBundleVersions(root)).toEqual([join(root, 'packages/lib/docs/manifest.json')])
      expect(JSON.parse(readFileSync(join(root, 'packages/lib/docs/manifest.json'), 'utf8'))).toEqual({ schemaVersion: 1, version: '5.1.0-beta.1', docs: [] })
    })

    it('then the manifests already up to date are left untouched', () => {
      syncBundleVersions(root)

      expect(syncBundleVersions(root)).toEqual([])
    })
  })
})
