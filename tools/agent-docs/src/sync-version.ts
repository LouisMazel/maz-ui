import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PACKAGE_DEFINITIONS } from './packages'
import { getSourcePaths } from './paths'

function readVersion(file: string): string {
  return (JSON.parse(readFileSync(file, 'utf8')) as { version: string }).version
}

/**
 * The release bumps the versions after the build: writes the bumped version of each package in the manifest of its
 * fragment and of the fragment bundled in `@maz-ui/mcp` (run by the `success:bump` hook of relizy).
 * Returns the updated manifests.
 */
export function syncBundleVersions(root = getSourcePaths().root): string[] {
  return PACKAGE_DEFINITIONS
    .filter(({ dir }) => existsSync(resolve(root, 'packages', dir, 'package.json')))
    .flatMap(({ dir, short }) => {
      const version = readVersion(resolve(root, 'packages', dir, 'package.json'))

      return [
        resolve(root, 'packages', dir, 'agent-docs/manifest.json'),
        resolve(root, 'packages/mcp/agent-docs', short, 'manifest.json'),
      ].map(file => ({ file, version }))
    })
    .filter(({ file, version }) => {
      if (!existsSync(file))
        return false

      const manifest = JSON.parse(readFileSync(file, 'utf8')) as { version: string }

      if (manifest.version === version)
        return false

      writeFileSync(file, `${JSON.stringify({ ...manifest, version })}\n`)

      return true
    })
    .map(({ file }) => file)
}
