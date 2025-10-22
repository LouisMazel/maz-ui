import type { PackageInfo, PublishOptions, PublishResponse } from '../types'
import { logger } from '@maz-ui/node'
import { detectPackageManager, getPackagePatterns, getPackages, getPackagesToPublishInIndependentMode, getPackagesToPublishInSelectiveMode, getPackagesWithDependencies, getRootPackage, loadMonorepoConfig, publishPackage, topologicalSort } from '../core'

export async function publish(options: PublishOptions = {}) {
  try {
    logger.start('Start publishing packages')

    const dryRun = options.dryRun ?? false
    logger.debug(`Dry run: ${dryRun}`)

    const packageManager = detectPackageManager(process.cwd())
    logger.debug(`Package manager: ${packageManager}`)

    const config = options.config || await loadMonorepoConfig({
      overrides: {
        publish: {
          access: options.access,
          otp: options.otp,
          registry: options.registry,
          tag: options.tag,
        },
      },
    })

    logger.debug(`Version mode: ${config.monorepo.versionMode}`)
    if (config.publish.registry) {
      logger.debug(`Registry: ${config.publish.registry}`)
    }
    if (config.publish.tag) {
      logger.debug(`Tag: ${config.publish.tag}`)
    }

    const patterns = options.packages ?? config.publish.packages ?? getPackagePatterns(config.monorepo)
    logger.debug(`Package patterns: ${patterns.join(', ')}`)

    const packages = getPackages({
      cwd: config.cwd,
      patterns,
      ignorePackageNames: config.monorepo.ignorePackageNames,
    })
    const rootPackage = getRootPackage(config.cwd)

    logger.debug(`Found ${packages.length} package(s)`)

    logger.debug('Building dependency graph and sorting...')
    const packagesWithDeps = getPackagesWithDependencies(packages)
    const sortedPackages = topologicalSort(packagesWithDeps)

    let publishedPackages: PackageInfo[] = options.bumpedPackages || []

    if (publishedPackages.length === 0 && config.monorepo.versionMode === 'independent') {
      logger.debug('Determining packages to publish in independent mode...')
      publishedPackages = await getPackagesToPublishInIndependentMode(sortedPackages, config)
      logger.info(`Publishing ${publishedPackages.length} package(s) (independent mode)`)
      logger.debug(`Packages: ${publishedPackages.join(', ')}`)
    }
    else if (publishedPackages.length === 0 && config.monorepo.versionMode === 'selective') {
      logger.debug('Determining packages to publish in selective mode...')
      publishedPackages = getPackagesToPublishInSelectiveMode(sortedPackages, rootPackage.version)
      logger.info(`Publishing ${publishedPackages.length} package(s) matching root version (selective mode)`)
      logger.debug(`Packages: ${publishedPackages.join(', ')}`)
    }
    else if (publishedPackages.length === 0) {
      publishedPackages = sortedPackages
      logger.info(`Publishing ${publishedPackages.length} package(s) (unified mode)`)
    }

    if (publishedPackages.length === 0) {
      logger.warn('No packages need to be published')
      return
    }

    for (const pkg of sortedPackages) {
      if (publishedPackages.some(p => p.name === pkg.name)) {
        logger.debug(`Publishing ${pkg.name}@${pkg.version}...`)
        await publishPackage({
          pkg,
          config,
          packageManager,
          dryRun,
        })
      }
    }

    if (!dryRun) {
      logger.info('Packages have been published to npm registry')
    }

    logger.success('Publishing completed!')

    return {
      publishedPackages,
    } satisfies PublishResponse
  }
  catch (error) {
    logger.error('Error publishing packages:', error)
    throw error
  }
}
