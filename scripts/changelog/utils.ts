import { join } from 'node:path'
import { logger } from '@maz-ui/utils/src/helpers/logger.js'
import { generateMarkDown, getGitDiff, type GitCommit, loadChangelogConfig, parseCommits, type ResolvedChangelogConfig } from 'changelogen'
import { version } from '../../lerna.json'
import changelogenConfig from './changelogen.config'

export interface PackageInfo {
  name: string
  path: string
}

export const rootDir = join(__dirname, '../..')
export const packagesDir = join(__dirname, '../../packages')

export async function getChangelogConfig({ from, to }: { from: string, to: string }) {
  const config = await loadChangelogConfig(rootDir, {
    ...changelogenConfig,
    tokens: {
      github:
        process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
    },
    from,
    to,
  })

  if (!config.output) {
    throw new Error('No output specified in changelog config')
  }

  if (!config.tokens.github) {
    throw new Error('No GitHub token specified in changelog config')
  }

  return config
}

async function getPackageCommits({ pkg, config }: { pkg: PackageInfo, config: ResolvedChangelogConfig }): Promise<GitCommit[]> {
  const rawCommits = await getGitDiff(config.from, config.to)

  const pathFilter = pkg.path === rootDir ? undefined : pkg.path.replace(`${rootDir}/`, '')

  const commits = parseCommits(rawCommits, config).filter((commit) => {
    const isAllowedType = config.types[commit.type]
    const isAllowedScope = pkg.name === 'root' || commit.scope === pkg.name

    const body: string = commit.body

    const isAllowedBody = (pathFilter && body.includes(`${pathFilter}`)) ?? true

    return isAllowedType && (isAllowedScope || isAllowedBody)
  })

  if (commits.length === 0) {
    return []
  }

  return commits
}

export async function generateChangelog({ pkg, config, to }: { pkg: PackageInfo, config: ResolvedChangelogConfig, to?: string }) {
  logger.log(`🔄 generate changelog for ${pkg.name}...`)

  try {
    // Get commits filtered by package path
    const commits = await getPackageCommits({ pkg, config })

    let newChangelog = await generateMarkDown(commits, config)

    // Replace HEAD with actual version in the changelog
    if (to === 'HEAD') {
      newChangelog = newChangelog.replace(/HEAD/g, `v${version}`)
    }

    if (commits.length === 0) {
      logger.log(`📭 No relevant commits found for ${pkg.name}`)

      newChangelog = `${newChangelog}\n\n` + `**Note:** Version bump only to follow ecosystem versioning`
    }

    logger.success(`✅ Changelog generated for ${pkg.name}!`)

    return newChangelog
  }
  catch (error) {
    logger.error(`❌ Error generating changelog for ${pkg.name}:`, (error as Error).message)
    throw error
  }
}
