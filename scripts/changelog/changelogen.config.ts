import type { ChangelogConfig } from 'changelogen'

export default <Partial<ChangelogConfig>>{
  types: {
    feat: { title: '🚀 Features' },
    perf: { title: '🔥 Performance' },
    fix: { title: '🩹 Fixes' },
    refactor: { title: '💅 Refactors' },
    docs: { title: '📖 Documentation' },
    types: { title: '🌊 Types' },
    examples: { title: '🏀 Examples' },
    style: { title: '💄 Styles' },
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
