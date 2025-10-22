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
    chore: false,
    examples: false,
    test: false,
    ci: false,
    build: false,
  },
  templates: {
    commitMessage: 'chore(release): bump version to v{{newVersion}}',
    tagMessage: 'chore(release): bump version to v{{newVersion}}',
    tagBody: 'v{{newVersion}}',
  },
  noAuthors: false,
  hideAuthorEmail: false,

  monorepo: {
    versionMode: 'selective',
    packages: ['packages/*'],
    ignorePackageNames: [],
    filterCommits: true,
  },

  changelog: {
    formatCmd: 'pnpm lint:fix:all',
    rootChangelog: true,
  },
  publish: {
    registry: 'https://registry.npmjs.org',
  },
})
