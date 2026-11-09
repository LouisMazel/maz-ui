import type { HookContext } from 'relizy'
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

interface PublishedPackage {
  name: string
  dir: string
  files: string[]
}

function getPublishablePackages(cwd: string): PublishedPackage[] {
  return readdirSync(join(cwd, 'packages'))
    .map(dir => join(cwd, 'packages', dir))
    .filter(dir => existsSync(join(dir, 'package.json')))
    .map((dir) => {
      const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as { name: string, private?: boolean, files?: string[] }

      return pkg.private
        ? undefined
        : { name: pkg.name, dir, files: pkg.files ?? [] }
    })
    .filter(pkg => pkg !== undefined)
}

/**
 * Builds the packages the release publishes (and their dependencies, `dependsOn: ['^build']`), after the bump: the
 * builds and the docs bundled for AI agents get the released version. Without a release (`relizy publish`), every
 * package. Fails before the publication when a published file is missing.
 */
export function buildPublishedPackages(cwd: string, dryRun: boolean, context?: HookContext) {
  const publishable = getPublishablePackages(cwd)
  const released = context?.release.groups.flatMap(group => group.packages).map(pkg => pkg.name)
  const packages = released
    ? publishable.filter(pkg => released.includes(pkg.name))
    : publishable

  if (packages.length === 0)
    return

  const names = packages.map(pkg => pkg.name)

  if (dryRun) {
    console.warn(`[dry-run] build of ${names.join(', ')}`)
    return
  }

  // eslint-disable-next-line sonarjs/no-os-command-from-path -- the pnpm of the release job, like the scripts of the repository
  execFileSync('pnpm', [
    'exec',
    'nx',
    'run-many',
    '-t',
    'build',
    '-p',
    ...names,
  ], {
    cwd,
    stdio: 'inherit',
  })

  const missing = packages.flatMap(pkg => pkg.files
    .filter(file => !file.includes('*') && !existsSync(join(pkg.dir, file)))
    .map(file => `${pkg.name}: ${file}`))

  if (missing.length > 0)
    throw new Error(`Published files missing after the build:\n${missing.join('\n')}`)
}
