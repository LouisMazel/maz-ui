import { globSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { logger } from '@maz-ui/node'
import { parse } from 'yaml'

/**
 * Every published package has the scripts that the CI runs on it with `nx affected -t <script>`: a package without one
 * of them is silently skipped by nx.
 * - `check:published-types`: arethetypeswrong on its tarball, the published declarations as a consumer in `node16` / `nodenext`
 *   reads them (the monorepo resolves its packages with `bundler`)
 */

const REQUIRED_SCRIPTS = ['check:published-types']

interface PackageJson {
  name: string
  private?: boolean
  scripts?: Record<string, string>
}

const root = process.cwd()

const workspace: { packages: string[] } = parse(readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf-8'))

const errors = globSync(workspace.packages.map(pattern => join(pattern, 'package.json')), { cwd: root })
  .flatMap((file) => {
    const pkg: PackageJson = JSON.parse(readFileSync(join(root, file), 'utf-8'))

    if (pkg.private)
      return []

    return REQUIRED_SCRIPTS
      .filter(script => !pkg.scripts?.[script])
      .map(script => `${file}: ${pkg.name} is published, add the "${script}" script`)
  })

if (errors.length > 0) {
  logger.error('Published packages without the scripts run by the CI')
  for (const error of errors)
    logger.error(error)
  process.exit(1)
}

logger.success(`Every published package has the ${REQUIRED_SCRIPTS.join(', ')} scripts`)
