import type { PackageInfo, PublishOptions, PublishResponse } from '../types'
import { logger } from '@maz-ui/node'
import { detectPackageManager, executeBuildCmd, getPackages, getPackagesToPublishInIndependentMode, getPackagesToPublishInSelectiveMode, getPackagesWithDependencies, getRootPackage, loadMonorepoConfig, publishPackage, topologicalSort } from '../core'

export async function publish(options: PublishOptions) {
  try {
    logger.start('Start publishing packages')

    const dryRun = options.dryRun ?? false
    logger.debug(`Dry run: ${dryRun}`)

    const packageManager = detectPackageManager(process.cwd())
    logger.debug(`Package manager: ${packageManager}`)

    const config = await loadMonorepoConfig({
      configName: options.configName,
      baseConfig: options.config,
      overrides: {
        publish: {
          access: options.access,
          otp: options.otp,
          registry: options.registry,
          tag: options.tag,
          buildCmd: options.buildCmd,
        },
        logLevel: options.logLevel,
      },
    })

    logger.debug(`Version mode: ${config.monorepo.versionMode}`)
    if (config.publish.registry) {
      logger.debug(`Registry: ${config.publish.registry}`)
    }
    if (config.publish.tag) {
      logger.debug(`Tag: ${config.publish.tag}`)
    }

    const packages = options.bumpedPackages || getPackages({
      cwd: config.cwd,
      patterns: config.publish.packages ?? config.monorepo.packages,
      ignorePackageNames: config.monorepo.ignorePackageNames,
    })
    const rootPackage = getRootPackage(config.cwd)

    logger.debug(`Found ${packages.length} package(s)`)

    logger.debug('Building dependency graph and sorting...')
    const packagesWithDeps = getPackagesWithDependencies(packages, config.bump.dependencyTypes)
    const sortedPackages = topologicalSort(packagesWithDeps)

    let publishedPackages: PackageInfo[] = packages || []

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

    await executeBuildCmd({
      config,
      dryRun,
    })

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
