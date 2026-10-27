import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getSourcePaths } from './paths'

/** Bundles built with the packages, published with them */
const BUNDLE_DIRS = ['packages/lib/docs', 'packages/mcp/docs']

/**
 * The release bumps the versions after the build: writes the bumped maz-ui version in the manifests
 * of the built bundles (run by the `success:bump` hook of relizy). Returns the updated manifests.
 */
export function syncBundleVersions(root = getSourcePaths().root): string[] {
  const { version } = JSON.parse(readFileSync(resolve(root, 'packages/lib/package.json'), 'utf8')) as { version: string }

  return BUNDLE_DIRS
    .map(directory => resolve(root, directory, 'manifest.json'))
    .filter((file) => {
      if (!existsSync(file))
        return false

      const manifest = JSON.parse(readFileSync(file, 'utf8')) as { version: string }

      if (manifest.version === version)
        return false

      writeFileSync(file, `${JSON.stringify({ ...manifest, version })}\n`)

      return true
    })
}
