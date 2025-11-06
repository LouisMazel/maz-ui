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
    test: { title: '🧪 Tests' },
    chore: false,
    examples: false,
    ci: false,
    build: false,
  },

  templates: {
    emptyChangelogContent: 'No relevant changes since last release',
  },

  monorepo: {
    versionMode: 'selective',
    packages: ['packages/*'],
  },

  bump: {
    yes: false,
  },

  changelog: {
    formatCmd: 'git add --all && pnpm pre-commit && git reset',
    includeCommitBody: true,
  },

  publish: {
    registry: 'https://registry.npmjs.org',
    access: 'public',
  },
})
