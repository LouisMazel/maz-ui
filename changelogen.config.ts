import { defineConfig } from '@maz-ui/changelogen-monorepo'

export default defineConfig({
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
  templates: {
    commitMessage: 'chore(release): bump version to v{{newVersion}}',
    tagMessage: 'v{{newVersion}}',
    tagBody: 'v{{newVersion}}',
  },
  excludeAuthors: [],
  noAuthors: false,
  hideAuthorEmail: false,

  monorepo: {
    versionMode: 'unified',
    packages: ['packages/*'],
    ignorePackages: [],
    filterCommits: true,
    rootChangelog: true,
  },
})
