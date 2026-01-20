import { defineConfig } from 'relizy'

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
    clean: { title: '🧹 Clean' },
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

  changelog: {
    formatCmd: 'git add --all && pnpm pre-commit && git reset',
  },

  publish: {
    access: 'public',
    safetyCheck: true,
    token: process.env.NPM_TOKEN,
  },

  release: {
    social: true,
  },

  social: {
    changelogUrl: 'https://maz-ui.com/changelog',
    twitter: {
      enabled: true,
      onlyStable: false,
      postMaxLength: 280,
    },
  },
})
