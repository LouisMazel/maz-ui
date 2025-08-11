import type { ChangelogConfig } from 'changelogen'

export default <Partial<ChangelogConfig>>{
  types: {
    feat: { title: '🚀 Features', semver: 'minor' },
    perf: { title: '🔥 Performance', semver: 'patch' },
    fix: { title: '🩹 Fixes', semver: 'patch' },
    refactor: { title: '💅 Refactors', semver: 'patch' },
    docs: { title: '📖 Documentation', semver: 'patch' },
    types: { title: '🌊 Types', semver: 'patch' },
    style: { title: '💄 Styles', semver: 'patch' },
    build: false,
    chore: false,
    test: false,
    ci: false,
  },
  cwd: process.cwd(),
  from: '',
  to: '',
  templates: {
    commitMessage: 'chore(release): bump version to v{{newVersion}}',
    tagMessage: 'v{{newVersion}}',
    tagBody: 'v{{newVersion}}',
  },
  tokens: {
    github:
      process.env.CHANGELOGEN_TOKENS_GITHUB || process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
  },
  excludeAuthors: [],
  noAuthors: false,
  hideAuthorEmail: false,
}
