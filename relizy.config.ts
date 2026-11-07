import { defineConfig } from 'relizy'
import { syncBundleVersions } from './tools/agent-docs/src/sync-version'

export default defineConfig({
  projectName: 'maz-ui',
  types: {
    feat: { title: '🚀 Features', semver: 'minor' },
    style: { title: '💄 Styles', semver: 'patch' },
    test: { title: '🧪 Tests' },
    clean: { title: '🧹 Clean' },
    chore: false,
    examples: false,
    ci: false,
  },

  ai: {
    providers: {
      'claude-code': {
        oauthToken: process.env.YOLO_PROVIDER_API_KEY,
      },
    },
    providerRelease: { enabled: true },
    social: {
      twitter: { enabled: true },
    },
  },

  templates: {
    emptyChangelogContent: 'No relevant changes since last release',
    changelogTitle: '{{newVersion}} ({{date}})',
    twitterMessage: '🚀 {{releaseTitle}}\n\n{{changelog}}\n\n{{changelogUrl}}\n{{releaseUrl}}',
  },

  scopeMap: {
    lib: 'maz-ui',
  },

  monorepo: {
    // Explicit lists: a new published package must be put in a group
    groups: [
      {
        // The library and its ecosystem: every package released at once on the same version (a consumer keeps all of
        // them on one version, so a single copy of maz-ui), the `v*` tags and the version of the root package.json
        name: 'ecosystem',
        title: 'maz-ui',
        versionMode: 'unified',
        packages: [
          'packages/icons',
          'packages/maz-ui',
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
        title: 'Tooling',
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

  publish: {
    access: 'public',
    buildCmd: process.env.CI ? undefined : 'pnpm build:packages',
  },

  hooks: {
    // The packages are built before the bump: the docs bundled for AI agents get the released version
    'success:bump': (_config, dryRun) => {
      if (!dryRun)
        syncBundleVersions()
    },
  },

  commitlint: {
    changelogLinter: 'oxc',
    scopes: ['clean', 'deps', 'release'],
  },

  social: {
    changelogUrl: 'https://maz-ui.com/changelog',
    twitter: { enabled: true },
  },
})
