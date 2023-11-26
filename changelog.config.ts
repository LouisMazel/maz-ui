import { ChangelogConfig } from 'changelogen'

function getDefaultConfig(): ChangelogConfig {
  return {
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
    },
    cwd: process.cwd(),
    from: '',
    to: '',
    output: 'CHANGELOG.md',
    scopeMap: {},
    tokens: {
      github:
        process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
    },
    publish: {
      private: false,
      tag: 'latest',
      args: [],
    },
    templates: {
      commitMessage: 'chore(release): v{{newVersion}}',
      tagMessage: 'v{{newVersion}}',
      tagBody: 'v{{newVersion}}',
    },
    excludeAuthors: [],
  }
}

export const config = {
  ...getDefaultConfig(),
  output: 'CHANGELOG.md',
  repo: {
    provider: 'github',
    repo: 'LouisMazel/maz-ui',
    domain: 'github.com',
    token: process.env.GITHUB_TOKEN,
  },
  templates: {
    commitMessage: 'chore(release): update changelog for v{{newVersion}}',
    tagMessage: '{{newVersion}}',
    tagBody: '{{newVersion}}',
  },
} satisfies ChangelogConfig
