import type { LogLevel } from '@maz-ui/node'
import type { DeepPartial } from '@maz-ui/utils'
import type { BumpConfig, ChangelogConfig, ChangelogMonorepoConfig, GitProvider, ReleaseConfig } from '../types'
import process from 'node:process'
import { logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'
import { loadConfig, setupDotenv } from 'c12'

import { getRepoConfig, resolveRepoConfig } from 'changelogen'
import { defu } from 'defu'

export function getDefaultConfig() {
  return {
    cwd: process.cwd(),
    types: {
      feat: { title: '🚀 Enhancements', semver: 'minor' },
      perf: { title: '🔥 Performance', semver: 'patch' },
      fix: { title: '🩹 Fixes', semver: 'patch' },
      refactor: { title: '💅 Refactors', semver: 'patch' },
      docs: { title: '📖 Documentation', semver: 'patch' },
      build: { title: '📦 Build', semver: 'patch' },
      types: { title: '🌊 Types', semver: 'patch' },
      chore: { title: '🏡 Chore' },
      examples: { title: '🏀 Examples' },
      test: { title: '✅ Tests' },
      style: { title: '🎨 Styles' },
      ci: { title: '🤖 CI' },
    } as NonNullable<ChangelogMonorepoConfig['types']>,
    templates: {
      commitMessage: 'chore(release): bump version to {{newVersion}}',
      tagMessage: 'Bump version to v{{newVersion}}',
      tagBody: 'v{{newVersion}}',
      emptyChangelogContent: 'No relevant changes for this release',
    },
    excludeAuthors: [],
    noAuthors: false,
    bump: {
      type: 'release' satisfies NonNullable<BumpConfig['type']>,
      clean: true,
      dependencyTypes: ['dependencies'],
      yes: true,
    } as Required<Omit<BumpConfig, 'preid'>>,
    changelog: {
      rootChangelog: true,
      includeCommitBody: false,
    } as Required<ChangelogConfig>,
    publish: {
      private: false,
      args: [],
    },
    tokens: {
      gitlab:
        process.env.CHANGELOGEN_TOKENS_GITLAB
        || process.env.GITLAB_TOKEN
        || process.env.GITLAB_API_TOKEN
        || process.env.CI_JOB_TOKEN,
      github:
        process.env.CHANGELOGEN_TOKENS_GITHUB
        || process.env.GITHUB_TOKEN
        || process.env.GH_TOKEN,
    },
    scopeMap: {},
    release: {
      commit: true,
      publish: true,
      changelog: true,
      push: true,
      clean: true,
      release: true,
      noVerify: false,
    } as Required<ReleaseConfig>,
    logLevel: 'default' as LogLevel,
  }
}

function setupLogger(logLevel?: LogLevel) {
  if (logLevel) {
    logger.setLevel(logLevel)
    logger.debug(`Log level set to: ${logLevel}`)
  }
}

async function resolveConfig(
  config: ResolvedConfig,
  cwd: string,
) {
  if (!config.repo) {
    const resolvedRepoConfig = await resolveRepoConfig(cwd)
    config.repo = {
      ...resolvedRepoConfig,
      provider: resolvedRepoConfig.provider as GitProvider,
    }
  }

  if (typeof config.repo === 'string') {
    const resolvedRepoConfig = getRepoConfig(config.repo)
    config.repo = {
      ...resolvedRepoConfig,
      provider: resolvedRepoConfig.provider as GitProvider,
    }
  }

  return config
}

export async function loadMonorepoConfig({ baseConfig, overrides, configName = 'changelog' }: {
  baseConfig?: ResolvedChangelogMonorepoConfig
  overrides?: DeepPartial<ChangelogMonorepoConfig>
  configName?: string
}) {
  const cwd = overrides?.cwd ?? process.cwd()

  await setupDotenv({ cwd })

  const defaultConfig = getDefaultConfig()

  const overridesConfig = defu(overrides, baseConfig)

  const results = await loadConfig<ResolvedConfig>({
    cwd,
    name: configName,
    packageJson: true,
    defaults: defaultConfig as ResolvedConfig,
    overrides: overridesConfig as ResolvedConfig,
  })

  if (!results._configFile) {
    logger.error(`No config file found with name "${configName}"`)
    process.exit(1)
  }

  setupLogger(overrides?.logLevel || results.config.logLevel)

  logger.verbose('User config:', formatJson(results.config.changelog))

  const resolvedConfig = await resolveConfig(results.config, cwd)

  logger.debug('Resolved config:', formatJson(resolvedConfig))

  return resolvedConfig as ResolvedChangelogMonorepoConfig
}

type ResolvedConfig = ChangelogMonorepoConfig & ReturnType<typeof getDefaultConfig>
export type ResolvedChangelogMonorepoConfig = ResolvedConfig & {
  output: string
}

export function defineConfig(config: ChangelogMonorepoConfig) {
  return config
}
