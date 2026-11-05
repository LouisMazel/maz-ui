import { defineConfig } from 'relizy'
import { syncBundleVersions } from './tools/agent-docs/src/sync-version'

export default defineConfig({
  projectName: 'maz-ui',
  types: {
    feat: { title: '🚀 Features', semver: 'minor' },
    perf: { title: '🔥 Performance', semver: 'patch' },
    fix: { title: '🩹 Fixes', semver: 'patch' },
    refactor: { title: '💅 Refactors', semver: 'patch' },
    docs: { title: '📖 Documentation', semver: 'patch' },
    types: { title: '🌊 Types', semver: 'patch' },
    style: { title: '💄 Styles', semver: 'patch' },
    build: { title: '📦 Build', semver: 'patch' },
    test: { title: '🧪 Tests' },
    clean: { title: '🧹 Clean' },
    chore: false,
    examples: false,
    ci: false,
  },

  ai: {
    provider: 'claude-code',
    providers: {
      'claude-code': {
        oauthToken: process.env.YOLO_PROVIDER_API_KEY,
      },
    },
    providerRelease: { enabled: true },
    social: {
      twitter: { enabled: true },
      slack: { enabled: false },
    },
  },

  templates: {
    emptyChangelogContent: 'No relevant changes since last release',
    changelogTitle: '{{newVersion}} ({{date}})',
    twitterMessage: '🚀 {{projectName}} {{newVersion}} is out!\n\n{{changelog}}\n\n{{changelogUrl}}\n{{releaseUrl}}',
  },

  monorepo: {
    // Explicit lists: a new published package must be put in a group
    groups: [
      {
        // The library and its ecosystem: every package released at once on the same version (a consumer keeps all of
        // them on one version, so a single copy of maz-ui), the `v*` tags and the version of the root package.json
        name: 'ecosystem',
        versionMode: 'unified',
        packages: [
          'packages/icons',
          'packages/lib',
          'packages/mcp',
          'packages/node',
          'packages/nuxt',
          'packages/themes',
          'packages/translations',
          'packages/utils',
        ],
      },
      {
        // Tooling with its own version line and tags (`@maz-ui/eslint-config@5.1.0`)
        name: 'tooling',
        versionMode: 'independent',
        packages: [
          'packages/eslint-config',
          'packages/stylelint-config',
          'packages/upgrade',
        ],
        changelog: { rootChangelog: false },
      },
    ],
  },

  changelog: {
    formatCmd: 'git add --all && pnpm pre-commit && git reset',
  },

  publish: {
    access: 'public',
    safetyCheck: true,
    token: process.env.NPM_TOKEN,
    buildCmd: process.env.CI ? undefined : 'pnpm build:packages',
  },

  release: {
    social: true,
  },

  hooks: {
    // The packages are built before the bump: the docs bundled for AI agents get the released version
    'success:bump': (_config, dryRun) => {
      if (!dryRun)
        syncBundleVersions()
    },
  },

  commitlint: {
    title: false,
    codeBlocksLinter: 'oxc',
    scopes: ['clean', 'deps', 'release'],
  },

  social: {
    changelogUrl: 'https://maz-ui.com/changelog',
    twitter: {
      enabled: true,
      onlyStable: true,
      postMaxLength: 280,
    },
  },
})
