import type { LogLevel } from '@maz-ui/node'
import type { DeepPartial } from '@maz-ui/utils'
import type { ChangelogConfig } from 'changelogen'
import type { ChangelogMonorepoConfig, GitProvider } from '../types'
import process from 'node:process'
import { logger } from '@maz-ui/node'
import { formatJson } from '@maz-ui/utils'

import { loadConfig, setupDotenv } from 'c12'
import { getCurrentGitBranch, getCurrentGitRef, getRepoConfig, resolveRepoConfig } from 'changelogen'

import { getLastTag } from './git'

function getDefaultConfig() {
  return {
    from: '',
    to: '',
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
    } as ChangelogConfig['types'],
    templates: {
      commitMessage: 'chore(release): bump version to v{{newVersion}}',
      tagMessage: 'Bump version to v{{newVersion}}',
      tagBody: 'v{{newVersion}}',
      emptyChangelogContent: 'No relevant changes for this release',
    },
    excludeAuthors: [],
    noAuthors: false,
    monorepo: {
      versionMode: 'selective',
      packages: ['packages/*'],
      filterCommits: true,
    },
    bump: {
      type: 'release',
    },
    changelog: {
      rootChangelog: true,
    },
    publish: {
      private: false,
      tag: 'latest',
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
      publish: true,
      push: true,
      release: true,
      noVerify: false,
    },
    logLevel: 'default',
  }
}

function setupLogger(logLevel?: LogLevel) {
  if (logLevel) {
    logger.setLevel(logLevel)
    logger.debug(`Log level set to: ${logLevel}`)
  }
}

export async function loadMonorepoConfig({ overrides }: {
  overrides?: DeepPartial<ChangelogMonorepoConfig>
}) {
  const cwd = overrides?.cwd ?? process.cwd()

  await setupDotenv({ cwd })

  const defaultConfig = getDefaultConfig()

  const { config } = await loadConfig<ResolvedConfig>({
    cwd,
    name: 'changelog',
    packageJson: true,
    defaults: defaultConfig as ResolvedConfig,
    overrides: {
      ...(overrides as ResolvedConfig),
    },
  })

  setupLogger(overrides?.logLevel || config.logLevel)

  logger.debug('User config:', formatJson(config))

  const resolvedConfig = await resolveConfig(config, cwd)

  logger.debug('Resolved config:', formatJson(resolvedConfig))

  return resolvedConfig as ResolvedChangelogMonorepoConfig
}

export async function resolveConfig(
  config: ResolvedConfig,
  cwd: string,
) {
  if (!config.from) {
    config.from = await getLastTag({
      sort: config.monorepo.versionMode === 'independent' ? 'creatordate' : 'refname',
    })
  }

  if (!config.to) {
    config.to = config.monorepo.versionMode === 'independent' ? getCurrentGitBranch(cwd) : getCurrentGitRef(cwd)
  }

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

type ResolvedConfig = ChangelogMonorepoConfig & ReturnType<typeof getDefaultConfig>
export type ResolvedChangelogMonorepoConfig = ResolvedConfig & {
  output: string
}

export function defineConfig(config: ChangelogMonorepoConfig) {
  return config
}
