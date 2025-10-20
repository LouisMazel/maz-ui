import type { PublishOptions } from '../types'
import { consola } from 'consola'
import { getPackagePatterns, loadMonorepoConfig } from '../config'
import { getPackagesWithDependencies, topologicalSort } from '../core/dependencies'
import { getPackages, getRootPackage } from '../core/monorepo'
import { getPackagesToPublishInIndependentMode, getPackagesToPublishInSelectiveMode, publishPackage } from '../core/npm'

export async function publish(options: PublishOptions = {}) {
  try {
    consola.start('Publishing packages...')

    const config = await loadMonorepoConfig()

    const patterns = options.packages ?? config.publish.packages ?? getPackagePatterns(config.monorepo)

    const packages = getPackages({
      cwd: config.cwd,
      patterns,
      ignorePackages: config.monorepo.ignorePackages,
    })
    const rootPackage = getRootPackage(config.cwd)

    consola.info(`Found ${packages.length} packages`)

    const packagesWithDeps = getPackagesWithDependencies(packages)
    const sortedPackages = topologicalSort(packagesWithDeps)

    let packagesToPublish: string[] = []

    if (config.monorepo.versionMode === 'independent') {
      packagesToPublish = await getPackagesToPublishInIndependentMode(sortedPackages, config)
      consola.info(`Publishing packages that were bumped (independent mode): ${packagesToPublish.join(', ')}`)
    }
    else if (config.monorepo.versionMode === 'selective') {
      packagesToPublish = getPackagesToPublishInSelectiveMode(sortedPackages, rootPackage.version)
      consola.info(`Publishing packages that match root version (selective mode): ${packagesToPublish.join(', ')}`)
    }
    else {
      packagesToPublish = sortedPackages.map(pkg => pkg.name)
      consola.info('Publishing all packages (unified mode)')
    }

    if (packagesToPublish.length === 0) {
      consola.warn('No packages need to be published')
      return
    }

    for (const pkg of sortedPackages) {
      if (packagesToPublish.includes(pkg.name)) {
        await publishPackage({
          packagePath: pkg.path,
          packageName: pkg.name,
          version: pkg.version,
          options,
          config,
        })
      }
    }

    if (!options.dryRun) {
      consola.box('Packages have been published to npm registry')
    }

    consola.success('Publishing completed!')

    return {
      packagesToPublish,
    }
  }
  catch (error) {
    consola.error('Error publishing packages:', (error as Error).message)
    throw error
  }
}
