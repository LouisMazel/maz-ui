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
    chore: { title: '🏡 Chore' },
    examples: { title: '🏀 Examples' },
    test: { title: '✅ Tests' },
    ci: { title: '🤖 CI' },
    build: { title: '📦 Build' },
  },
  templates: {
    commitMessage: 'chore(release): bump version to v{{newVersion}}',
    tagMessage: 'v{{newVersion}}',
    tagBody: 'v{{newVersion}}',
  },
  noAuthors: false,
  hideAuthorEmail: false,

  monorepo: {
    versionMode: 'selective',
    packages: ['packages/*'],
    ignorePackages: [],
    filterCommits: true,
    rootChangelog: true,
  },

  publish: {
    registry: 'https://registry.npmjs.org',
  },

  changelog: {
    formatCmd: 'pnpm lint:fix:all',
  },
})
