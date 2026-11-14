# Changelog

## @maz-ui/node@5.7.0-beta.0 (2026-11-12)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/@maz-ui/node@5.6.0...@maz-ui/node@5.7.0-beta.0)

### 🚀 Features

- **node:** Support more AI agents and monorepos in setupAgents ([a43ac502d](https://github.com/LouisMazel/maz-ui/commit/a43ac502d))

  - `setupAgents` and `detectAgentTargets` support Gemini CLI, OpenCode, Junie, Windsurf, Warp, Kiro and Roo Code: the MCP server goes in their project config, their rules come from `AGENTS.md` (added to the context files of Gemini CLI).
  - New `appDir` option for monorepos: the rules come from the maz-ui of the app, and `mcpVersion` defaults to the version of its `@maz-ui/mcp`.
  - Without any detected agent, nothing is written and maz-ui is not required.
  - `remove: true` also removes the folders it leaves empty (`.cursor/`, `.gemini/`...).
  - `detectPackageManager`, `findProjectPackage`, `findWorkspaceDirs` and `readPackageVersion` are documented (https://maz-ui.com/ecosystem/node/project), the other internal helpers are deprecated.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## @maz-ui/node@5.6.0 (2026-11-08)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.5.0...@maz-ui/node@5.6.0)

### 🚀 Features

- **node:** Only rewrite the managed rules when they change ([3f69191d4](https://github.com/LouisMazel/maz-ui/commit/3f69191d4))
- **node:** Read the agent docs from agent-docs ([43558b5e2](https://github.com/LouisMazel/maz-ui/commit/43558b5e2))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.5.0 (2026-11-07)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.4.0...v5.5.0)

No relevant changes since last release

## v5.4.0 (2026-11-07)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.3.0...v5.4.0)

No relevant changes since last release

## v5.3.1-beta.0 (2026-11-06)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.3.0...v5.3.1-beta.0)

No relevant changes since last release

## v5.3.0 (2026-11-06)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.2.0...v5.3.0)

### 🚀 Features

- **@maz-ui/node:** Load the Claude Code rule only for the files that use maz-ui ([fbca64ec3](https://github.com/LouisMazel/maz-ui/commit/fbca64ec3))

  The generated `.claude/rules/maz-ui.md` now starts with a `paths:` frontmatter listing the workspaces that depend on maz-ui (e.g. `apps/pwa/**/*.{vue,ts,tsx,css,scss}`), so Claude Code loads it when it reads or edits one of these files instead of at every turn. The rule is also cut to its core (about 2.9 KB instead of 6.3 KB); the rest is served on demand by the MCP tools.

  Set `paths: 'all'` or a list of globs in `setupAgents`, `--paths` in `npx @maz-ui/mcp init`, or `mazUi.agents.paths` in Nuxt. Rules generated before are updated, unless you edited them. See [setupAgents](https://maz-ui.com/ecosystem/node/setup-agents).

- **node:** Add marker, versionNote false, legacyMcpPackages and an agents entry to setupAgents ([515233ac0](https://github.com/LouisMazel/maz-ui/commit/515233ac0))

  AgentsTool gets three optional fields, all defaulting to the current behavior: `marker` (header marker, default `Managed by <name>`), `versionNote: false` (no note under the title) and `legacyMcpPackages` (entries of former MCP servers replaced by the entry of the tool).

  The checksum of the generated rules now covers the `paths:` frontmatter, so a hand-edited frontmatter is kept. A checksum of the body alone is still accepted, so rules from published versions and from the previous commit stay recognized.

  In the `auto` scope, workspaces excluded by negated patterns are left out, glob characters of folder names are escaped, and the rule falls back to the globs of the whole project beyond 1000 expanded patterns.

  `@maz-ui/node/agents` exposes setupAgents without consola and figlet.

### 🩹 Fixes

- **node:** Ignore the quotes of the rule frontmatter in its checksum ([b4f9b43fb](https://github.com/LouisMazel/maz-ui/commit/b4f9b43fb))

### 📦 Build

- **deps:** Upgrade minor and patch dependencies ([ac04f8577](https://github.com/LouisMazel/maz-ui/commit/ac04f8577))

  - `marked` from 18.1.1 to 18.1.3 (hardening against quadratic emphasis scans and ReDoS-class backtracking)
  - `@tanstack/vue-virtual` from 3.13.47 to 3.13.52
  - `chart.js` from 4.5.1 to 4.6.1
  - `@nuxt/kit` from 4.6.2 to 4.6.4
  - `eslint-plugin-vuejs-accessibility` from 2.6.2 to 2.6.3
  - `stylelint-config-recess-order` from 7.8.2 to 7.10.0
  - `stylelint-order` from 8.1.2 to 8.1.3

- Require Node.js releases with the October 2026 security fixes ([9db85d136](https://github.com/LouisMazel/maz-ui/commit/9db85d136))

  All the published packages now declare `engines.node` as `^22.23.4 || ^24.22.1 || >=26.12.1`: the Node.js releases of October 21, 2026 fix 10 vulnerabilities, including a remote code execution in the Brotli decoder (CVE-2026-111497) and TLS hostname verification bypasses. Upgrade to Node.js 22.23.4, 24.22.1 or 26.12.1 or later. Node.js 23 and 25 are end-of-life and no longer accepted.

- **deps:** Upgrade @antfu/eslint-config to v10, nx to v24, glob to v14 and @types/node to v26 ([2364673d9](https://github.com/LouisMazel/maz-ui/commit/2364673d9))

  `@maz-ui/eslint-config` now uses `@antfu/eslint-config` v10, which adds new formatting rules: multiline ternaries, arrays and objects. Your lint may report new errors on existing code, run `eslint --fix` to apply them.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.2.0 (2026-11-01)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.1.1...v5.2.0)

### 🚀 Features

- **@maz-ui/node:** Start the installed @maz-ui/mcp and keep the rules edited by hand ([1e6a38a74](https://github.com/LouisMazel/maz-ui/commit/1e6a38a74))

  When the project installs `@maz-ui/mcp`, `setupAgents` writes MCP configs that start it through the package manager of the project (`pnpm exec maz-ui-mcp`, `yarn run maz-ui-mcp`, `npx --no-install maz-ui-mcp`...): no download, and the version of the lockfile. Otherwise they run `npx -y @maz-ui/mcp@<version>`, pinned with the new `mcpVersion` option. `mcpServerCommand(rootDir, version)` returns this command.

  Generated rules edited by hand are kept and no longer updated: delete the file, or the `AGENTS.md` section, to get the rules of a new version.

  In a monorepo, the files are written atomically, and the rules or the pinned version of a newer maz-ui are never downgraded by an app with an older one. Packages are now found in the workspaces of `pnpm-workspace.yaml` or of the `workspaces` field of `package.json`.

- **@maz-ui/node:** Let setupAgents configure the agents of another tool ([6fa96842b](https://github.com/LouisMazel/maz-ui/commit/6fa96842b))

  `setupAgents` configures maz-ui by default, and now any package that ships an MCP server and rules for AI agents with the new `tool` option (an `AgentsTool`: name, MCP package, bin and arguments) and its rules passed with `agentDocs`. It writes `.claude/rules/<name>.md`, the `<name>` section of `AGENTS.md` and the `<name>` MCP server, with the same guarantees as for maz-ui. Several tools can be set up in the same project: each one only manages its own files, section and server entry.

  `mcpServerCommand`, `installsMcpPackage`, `readManagedVersion` and `isEditedManagedContent` take the tool as last argument, and the `PackageManager` type is exported. Nothing changes for maz-ui.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.2.0-beta.0 (2026-11-01)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.1.1...v5.2.0-beta.0)

### 🚀 Features

- **@maz-ui/node:** Start the installed @maz-ui/mcp and keep the rules edited by hand ([1e6a38a74](https://github.com/LouisMazel/maz-ui/commit/1e6a38a74))

  When the project installs `@maz-ui/mcp`, `setupAgents` writes MCP configs that start it through the package manager of the project (`pnpm exec maz-ui-mcp`, `yarn run maz-ui-mcp`, `npx --no-install maz-ui-mcp`...): no download, and the version of the lockfile. Otherwise they run `npx -y @maz-ui/mcp@<version>`, pinned with the new `mcpVersion` option. `mcpServerCommand(rootDir, version)` returns this command.

  Generated rules edited by hand are kept and no longer updated: delete the file, or the `AGENTS.md` section, to get the rules of a new version.

  In a monorepo, the files are written atomically, and the rules or the pinned version of a newer maz-ui are never downgraded by an app with an older one. Packages are now found in the workspaces of `pnpm-workspace.yaml` or of the `workspaces` field of `package.json`.

- **@maz-ui/node:** Let setupAgents configure the agents of another tool ([6fa96842b](https://github.com/LouisMazel/maz-ui/commit/6fa96842b))

  `setupAgents` configures maz-ui by default, and now any package that ships an MCP server and rules for AI agents with the new `tool` option (an `AgentsTool`: name, MCP package, bin and arguments) and its rules passed with `agentDocs`. It writes `.claude/rules/<name>.md`, the `<name>` section of `AGENTS.md` and the `<name>` MCP server, with the same guarantees as for maz-ui. Several tools can be set up in the same project: each one only manages its own files, section and server entry.

  `mcpServerCommand`, `installsMcpPackage`, `readManagedVersion` and `isEditedManagedContent` take the tool as last argument, and the `PackageManager` type is exported. Nothing changes for maz-ui.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.1.0 (2026-10-27)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0...v5.1.0)

### 🚀 Features

- **@maz-ui/node:** Add setupAgents to configure the AI coding agents of a project ([4afa9701f](https://github.com/LouisMazel/maz-ui/commit/4afa9701f))

  `setupAgents({ rootDir })` writes the maz-ui rules of the installed version for Claude Code (`.claude/rules/maz-ui.md`) and `AGENTS.md` (a delimited section), and registers the maz-ui MCP server in `.mcp.json`, `.cursor/mcp.json` and `.vscode/mcp.json`.

  It only touches the files and sections it owns, keeps the formatting and comments of the config files, and supports the `targets`, `mcp`, `dryRun` and `remove` options. `detectAgentTargets(rootDir)` lists the agents configured in a project.

- **@maz-ui/node:** Add the rules option to setupAgents to only register the MCP server ([9cd7578b6](https://github.com/LouisMazel/maz-ui/commit/9cd7578b6))

  `setupAgents({ rootDir, rules: false })` registers the maz-ui MCP server without writing the Claude Code rule nor the `AGENTS.md` section, and works even when the installed maz-ui does not ship the agent docs.

### 🩹 Fixes

- **@maz-ui/node:** Find maz-ui and its version in the apps of a monorepo ([c61107e95](https://github.com/LouisMazel/maz-ui/commit/c61107e95))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.1.0-beta.1 (2026-10-27)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.1.0-beta.0...v5.1.0-beta.1)

### 🩹 Fixes

- **@maz-ui/node:** Find maz-ui and its version in the apps of a monorepo ([c61107e95](https://github.com/LouisMazel/maz-ui/commit/c61107e95))

### ❤️ Contributors

- LouisMazel <me@loicmazuel.com>

## v5.1.0-beta.0 (2026-10-27)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.1-beta.0...v5.1.0-beta.0)

### 🚀 Features

- **@maz-ui/node:** Add setupAgents to configure the AI coding agents of a project ([4afa9701f](https://github.com/LouisMazel/maz-ui/commit/4afa9701f))

  `setupAgents({ rootDir })` writes the maz-ui rules of the installed version for Claude Code (`.claude/rules/maz-ui.md`) and `AGENTS.md` (a delimited section), and registers the maz-ui MCP server in `.mcp.json`, `.cursor/mcp.json` and `.vscode/mcp.json`.

  It only touches the files and sections it owns, keeps the formatting and comments of the config files, and supports the `targets`, `mcp`, `dryRun` and `remove` options. `detectAgentTargets(rootDir)` lists the agents configured in a project.

- **@maz-ui/node:** Add the rules option to setupAgents to only register the MCP server ([9cd7578b6](https://github.com/LouisMazel/maz-ui/commit/9cd7578b6))

  `setupAgents({ rootDir, rules: false })` registers the maz-ui MCP server without writing the Claude Code rule nor the `AGENTS.md` section, and works even when the installed maz-ui does not ship the agent docs.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0 (2026-10-21)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.9.3...v5.0.0)

### 🚀 Features

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([b7dc0cea](https://github.com/LouisMazel/maz-ui/commit/b7dc0cea))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)

  > **Solo maintainer note:** v4 will receive no further support after v5
  > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([3b4b37ac](https://github.com/LouisMazel/maz-ui/commit/3b4b37ac))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)

  > **Solo maintainer note:** v4 will receive no further support after v5
  > stable — no security fixes, no backports.

- **@maz-ui/node:** ExecPromise - add timeout option ([0de1d620](https://github.com/LouisMazel/maz-ui/commit/0de1d620))

  Pass a `timeout` (in milliseconds) to abort a command once it exceeds the given duration: the process is killed and the promise rejects with a `timed out after <ms>ms` error. No timeout is applied by default.

- **@maz-ui/node:** ExecPromise - support env, maxBuffer, killSignal, shell and signal options ([4d694a9d](https://github.com/LouisMazel/maz-ui/commit/4d694a9d))

  New options forwarded to the command:
  - `env`: extra environment variables, merged on top of `process.env`
  - `maxBuffer`: max bytes on stdout/stderr before the command is killed (default 1 MiB)
  - `killSignal`: signal used to kill the command on timeout/abort (default SIGTERM)
  - `shell`: shell used to run the command
  - `signal`: an `AbortSignal` to cancel the command
    The options type is now exported as `ExecPromiseOptions`.

### 🩹 Fixes

- Add default condition to exports for CJS resolver fallback ([3d078772](https://github.com/LouisMazel/maz-ui/commit/3d078772))
- **@maz-ui/node:** ExecPromise - redact secrets in command logs and errors ([c43a9c22](https://github.com/LouisMazel/maz-ui/commit/c43a9c22))

  Secrets (npm auth tokens, --token/--password flags, provider tokens like
  npm_/ghp_, JWTs, basic-auth URLs) are now masked in execPromise logs and in
  the rejected error, instead of being printed in clear. Long tokens keep their
  first and last 4 characters visible (e.g. `npm_***J1iF`) so the right
  credential stays recognizable.
  The `redactSecrets` and `redactError` helpers are also exported for reuse.

### 📦 Build

- **deps:** Upgrade dependencies ([#1639](https://github.com/LouisMazel/maz-ui/pull/1639))
- Require Node.js 22.12 or later ([8135bc29](https://github.com/LouisMazel/maz-ui/commit/8135bc29))

  All the published packages now declare `engines.node` as `>=22.12.0`. Node.js 18 and 20 are no longer supported: upgrade to Node.js 22.12 or later (24 recommended).

#### ⚠️ Breaking Changes

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([b7dc0cea](https://github.com/LouisMazel/maz-ui/commit/b7dc0cea))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)

  > **Solo maintainer note:** v4 will receive no further support after v5
  > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([3b4b37ac](https://github.com/LouisMazel/maz-ui/commit/3b4b37ac))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)

  > **Solo maintainer note:** v4 will receive no further support after v5
  > stable — no security fixes, no backports.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))
- Mazel ([@LouisMazel](https://github.com/LouisMazel))
- Mazel (Loïc Mazuel) ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.44 (2026-09-29)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.43...v5.0.0-beta.44)

### 📦 Build

- **deps:** Upgrade dependencies ([#1639](https://github.com/LouisMazel/maz-ui/pull/1639))

### ❤️ Contributors

- Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.26 (2026-06-10)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.25...v5.0.0-beta.26)

### 🚀 Features

- **@maz-ui/node:** ExecPromise - add timeout option ([db545d0a2](https://github.com/LouisMazel/maz-ui/commit/db545d0a2))

  Pass a `timeout` (in milliseconds) to abort a command once it exceeds the given
  duration: the process is killed and the promise rejects with a `timed out after
<ms>ms` error. No timeout is applied by default.

- **@maz-ui/node:** ExecPromise - support env, maxBuffer, killSignal, shell and signal options ([5867a6876](https://github.com/LouisMazel/maz-ui/commit/5867a6876))

  New options forwarded to the command:
  - `env`: extra environment variables, merged on top of `process.env`
  - `maxBuffer`: max bytes on stdout/stderr before the command is killed (default 1 MiB)
  - `killSignal`: signal used to kill the command on timeout/abort (default SIGTERM)
  - `shell`: shell used to run the command
  - `signal`: an `AbortSignal` to cancel the command
    The options type is now exported as `ExecPromiseOptions`.

### 🩹 Fixes

- **@maz-ui/node:** ExecPromise - redact secrets in command logs and errors ([903cbc080](https://github.com/LouisMazel/maz-ui/commit/903cbc080))

  Secrets (npm auth tokens, --token/--password flags, provider tokens like
  npm*/ghp*, JWTs, basic-auth URLs) are now masked in execPromise logs and in
  the rejected error, instead of being printed in clear. Long tokens keep their
  first and last 4 characters visible (e.g. `npm_***J1iF`) so the right
  credential stays recognizable.
  The `redactSecrets` and `redactError` helpers are also exported for reuse.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.25 (2026-06-09)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.24...v5.0.0-beta.25)

### 🚀 Features

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([76af016e0](https://github.com/LouisMazel/maz-ui/commit/76af016e0))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([ab834af76](https://github.com/LouisMazel/maz-ui/commit/ab834af76))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([b7dc0cea9](https://github.com/LouisMazel/maz-ui/commit/b7dc0cea9))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([3b4b37ac5](https://github.com/LouisMazel/maz-ui/commit/3b4b37ac5))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

### 🩹 Fixes

- Add default condition to exports for CJS resolver fallback ([d63f00ae2](https://github.com/LouisMazel/maz-ui/commit/d63f00ae2))
- Add default condition to exports for CJS resolver fallback ([3d078772a](https://github.com/LouisMazel/maz-ui/commit/3d078772a))

#### ⚠️ Breaking Changes

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([76af016e0](https://github.com/LouisMazel/maz-ui/commit/76af016e0))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([ab834af76](https://github.com/LouisMazel/maz-ui/commit/ab834af76))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([b7dc0cea9](https://github.com/LouisMazel/maz-ui/commit/b7dc0cea9))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([3b4b37ac5](https://github.com/LouisMazel/maz-ui/commit/3b4b37ac5))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))
- Mazel (Loïc Mazuel) ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.24 (2026-06-05)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.23...v5.0.0-beta.24)

### 🚀 Features

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([61883c03c](https://github.com/LouisMazel/maz-ui/commit/61883c03c))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([78659718a](https://github.com/LouisMazel/maz-ui/commit/78659718a))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([76af016e0](https://github.com/LouisMazel/maz-ui/commit/76af016e0))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([ab834af76](https://github.com/LouisMazel/maz-ui/commit/ab834af76))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

### 🩹 Fixes

- Add default condition to exports for CJS resolver fallback ([5f6c6f683](https://github.com/LouisMazel/maz-ui/commit/5f6c6f683))
- Add default condition to exports for CJS resolver fallback ([d63f00ae2](https://github.com/LouisMazel/maz-ui/commit/d63f00ae2))

#### ⚠️ Breaking Changes

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([61883c03c](https://github.com/LouisMazel/maz-ui/commit/61883c03c))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([78659718a](https://github.com/LouisMazel/maz-ui/commit/78659718a))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([76af016e0](https://github.com/LouisMazel/maz-ui/commit/76af016e0))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([ab834af76](https://github.com/LouisMazel/maz-ui/commit/ab834af76))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))
- Mazel (Loïc Mazuel) ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.11 (2026-05-15)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.10...v5.0.0-beta.11)

No relevant changes since last release

## v5.0.0-beta.8 (2026-05-12)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.7...v5.0.0-beta.8)

### 🩹 Fixes

- Add default condition to exports for CJS resolver fallback ([5f6c6f683](https://github.com/LouisMazel/maz-ui/commit/5f6c6f683))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.5 (2026-05-07)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.4...v5.0.0-beta.5)

No relevant changes since last release

## v5.0.0-beta.4 (2026-05-07)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.3...v5.0.0-beta.4)

No relevant changes since last release

## v5.0.0-beta.3 (2026-05-06)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.2...v5.0.0-beta.3)

No relevant changes since last release

## v5.0.0-beta.2 (2026-05-06)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.1...v5.0.0-beta.2)

No relevant changes since last release

## v5.0.0-beta.1 (2026-05-06)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.0...v5.0.0-beta.1)

### 🚀 Features

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([78659718a](https://github.com/LouisMazel/maz-ui/commit/78659718a))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

#### ⚠️ Breaking Changes

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([78659718a](https://github.com/LouisMazel/maz-ui/commit/78659718a))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

### ❤️ Contributors

- Mazel (Loïc Mazuel) ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.0 (2026-05-05)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.9.3...v5.0.0-beta.0)

### 🚀 Features

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([61883c03](https://github.com/LouisMazel/maz-ui/commit/61883c03))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

#### ⚠️ Breaking Changes

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([61883c03](https://github.com/LouisMazel/maz-ui/commit/61883c03))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

### ❤️ Contributors

- Mazel (Loïc Mazuel) ([@LouisMazel](https://github.com/LouisMazel))

## v4.6.0...v4.6.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.6.0...v4.6.1)

### 📦 Build

- Upgrade dependencies ([5dd041ed6](https://github.com/LouisMazel/maz-ui/commit/5dd041ed6))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.3...v4.4.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.3...v4.4.0)

### 💅 Refactors

- **@maz-ui/node:** Add noError option to execPromise logger ([0cff1147](https://github.com/LouisMazel/maz-ui/commit/0cff1147))
  - Add optional noError parameter to suppress error logging
  - Add JSDoc comments for all logging control parameters (noSuccess, noStdout, noStderr, noError)

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.3...v4.4.0-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.3...v4.4.0-beta.1)

### 💅 Refactors

- **@maz-ui/node:** Add noError option to execPromise logger ([ddbed1f91](https://github.com/LouisMazel/maz-ui/commit/ddbed1f91))
  - Add optional noError parameter to suppress error logging
  - Add JSDoc comments for all logging control parameters (noSuccess, noStdout, noStderr, noError)

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.3...v4.3.4-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.3...v4.3.4-beta.0)

### 💅 Refactors

- **@maz-ui/node:** Add noError option to execPromise logger ([ddbed1f9](https://github.com/LouisMazel/maz-ui/commit/ddbed1f9))
  - Add optional noError parameter to suppress error logging
  - Add JSDoc comments for all logging control parameters (noSuccess, noStdout, noStderr, noError)

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.1...v4.3.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1...v4.3.2)

### 🩹 Fixes

- **@maz-ui/node:** Logger - break method break 2 lines when 1 requested ([f9e5449e](https://github.com/LouisMazel/maz-ui/commit/f9e5449e))

### 💅 Refactors

- **@maz-ui/node:** ExecPromise - you can pass a cwd to execute the command ([4cdebdb8](https://github.com/LouisMazel/maz-ui/commit/4cdebdb8))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.1...v4.3.2-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1...v4.3.2-beta.2)

### 🩹 Fixes

- **@maz-ui/node:** Logger - break method break 2 lines when 1 requested ([a58415a9](https://github.com/LouisMazel/maz-ui/commit/a58415a9))

### 💅 Refactors

- **@maz-ui/node:** ExecPromise - you can pass a cwd to execute the command ([d48c8faa](https://github.com/LouisMazel/maz-ui/commit/d48c8faa))

### ❤️ Contributors

- LouisMazel <me@loicmazuel.com>

## v4.3.1...v4.3.2-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1...v4.3.2-beta.1)

### 🩹 Fixes

- **@maz-ui/node:** Logger - break method break 2 lines when 1 requested ([a58415a9](https://github.com/LouisMazel/maz-ui/commit/a58415a9))

### 💅 Refactors

- **@maz-ui/node:** ExecPromise - you can pass a cwd to execute the command ([d48c8faa](https://github.com/LouisMazel/maz-ui/commit/d48c8faa))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.1...v4.3.2-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1...v4.3.2-beta.0)

### 🩹 Fixes

- **@maz-ui/node:** Logger - break method break 2 lines when 1 requested ([a58415a9](https://github.com/LouisMazel/maz-ui/commit/a58415a9))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1-beta.0...v4.3.1)

No relevant changes since last release

## v4.3.1-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1...v4.3.1-beta.0)

### 🩹 Fixes

- **@maz-ui/node:** Update execPromise type handling ([4f2ab147](https://github.com/LouisMazel/maz-ui/commit/4f2ab147))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.0...v4.2.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.0...v4.2.1)

### 🩹 Fixes

- **@maz-ui/node:** Not set log level by default ([c9983ae6](https://github.com/LouisMazel/maz-ui/commit/c9983ae6))

### 💅 Refactors

- **@maz-ui/node:** Improve logger by using consola ([d8a0c350](https://github.com/LouisMazel/maz-ui/commit/d8a0c350))
- **@maz-ui/node:** Improve logging of execPromise utility ([a53ab14e](https://github.com/LouisMazel/maz-ui/commit/a53ab14e))
- **@maz-ui/changelogen-monorepo:** Logging flow improvements ([7cfafb28](https://github.com/LouisMazel/maz-ui/commit/7cfafb28))
- **@maz-ui/node:** Choose log level of execPromise ([491bf63e](https://github.com/LouisMazel/maz-ui/commit/491bf63e))
- **@maz-ui/node:** Logger - add method to get current log level ([2579c675](https://github.com/LouisMazel/maz-ui/commit/2579c675))
- **@maz-ui/node:** Add utility to print banner (useful for CLI) ([47356edd](https://github.com/LouisMazel/maz-ui/commit/47356edd))
- **@maz-ui/node:** PrintBanner - add option to add break line before and after banner ([77cdc303](https://github.com/LouisMazel/maz-ui/commit/77cdc303))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-beta.0...v4.2.1-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-beta.0...v4.2.1-beta.2)

### 💅 Refactors

- **@maz-ui/node:** PrintBanner - add option to add break line before and after banner ([c85127c64](https://github.com/LouisMazel/maz-ui/commit/c85127c64))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-beta.0...v4.2.1-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-beta.0...v4.2.1-beta.1)

### 💅 Refactors

- **@maz-ui/node:** PrintBanner - add option to add break line before and after banner ([c85127c6](https://github.com/LouisMazel/maz-ui/commit/c85127c6))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.16...v4.2.1-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.16...v4.2.1-beta.0)

### 💅 Refactors

- **@maz-ui/node:** Add utility to print banner (useful for CLI) ([044aa02f](https://github.com/LouisMazel/maz-ui/commit/044aa02f))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.12...v4.2.1-alpha.13

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.12...v4.2.1-alpha.13)

### 🩹 Fixes

- **@maz-ui/node:** Not set log level by default ([d3cdd1b69](https://github.com/LouisMazel/maz-ui/commit/d3cdd1b69))

### 💅 Refactors

- **@maz-ui/node:** Logger - add method to get current log level ([fe3b9a64b](https://github.com/LouisMazel/maz-ui/commit/fe3b9a64b))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.9...v4.2.1-alpha.10

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.9...v4.2.1-alpha.10)

### 💅 Refactors

- **@maz-ui/node:** Improve logging of execPromise utility ([4264c45b7](https://github.com/LouisMazel/maz-ui/commit/4264c45b7))
- **@maz-ui/changelogen-monorepo:** Logging flow improvements ([4b231b0c2](https://github.com/LouisMazel/maz-ui/commit/4b231b0c2))
- **@maz-ui/node:** Choose log level of execPromise ([ece81b276](https://github.com/LouisMazel/maz-ui/commit/ece81b276))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.2.1-alpha.8...v4.2.1-alpha.9

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.8...v4.2.1-alpha.9)

### 💅 Refactors

- **@maz-ui/node:** Improve logger by using consola ([e9614e873](https://github.com/LouisMazel/maz-ui/commit/e9614e873))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.8-beta.2...v4.1.8-beta.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8-beta.2...v4.1.8-beta.3)

**Note:** No relevant commits found

## v4.1.8-beta.1...v4.1.8-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8-beta.1...v4.1.8-beta.2)

**Note:** No relevant commits found

## v4.1.8-beta.0...v4.1.8-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8-beta.0...v4.1.8-beta.1)

**Note:** No relevant commits found

## v4.1.7-beta.8...v4.1.8-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.8...v4.1.8-beta.0)

**Note:** No relevant commits found

## v4.1.6...v4.1.7

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.6...v4.1.7)

**Note:** No relevant commits found

## v4.1.7-beta.7...v4.1.7-beta.8

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.7...v4.1.7-beta.8)

**Note:** No relevant commits found

## v4.1.7-beta.6...v4.1.7-beta.7

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.6...v4.1.7-beta.7)

**Note:** No relevant commits found

## v4.1.7-beta.5...v4.1.7-beta.6

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.5...v4.1.7-beta.6)

**Note:** No relevant commits found

## v4.1.7-beta.4...v4.1.7-beta.5

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.4...v4.1.7-beta.5)

**Note:** No relevant commits found

## v4.1.7-beta.3...v4.1.7-beta.4

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.3...v4.1.7-beta.4)

**Note:** No relevant commits found

## v4.1.7-beta.2...v4.1.7-beta.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.2...v4.1.7-beta.3)

**Note:** No relevant commits found

## v4.1.7-beta.1...v4.1.7-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.1...v4.1.7-beta.2)

**Note:** No relevant commits found

## v4.1.7-beta.0...v4.1.7-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.0...v4.1.7-beta.1)

**Note:** No relevant commits found

## v4.1.6...v4.1.7-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.6...v4.1.7-beta.0)

**Note:** No relevant commits found

## v4.1.5...v4.1.6

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.5...v4.1.6)

**Note:** No relevant commits found

## v4.1.4...v4.1.5

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.4...v4.1.5)

**Note:** No relevant commits found

## v4.1.3...v4.1.4

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.3...v4.1.4)

**Note:** No relevant commits found

## v4.1.2...v4.1.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.2...v4.1.3)

**Note:** No relevant commits found

## v4.1.1-beta.1...v4.1.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.1-beta.1...v4.1.2)

**Note:** No relevant commits found

## v4.1.1-beta.0...v4.1.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.1-beta.0...v4.1.1)

## v4.1.1-beta.0...v4.1.1-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.1-beta.0...v4.1.1-beta.1)

**Note:** No relevant commits found

## v4.1.0...v4.1.1-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.0...v4.1.1-beta.0)

**Note:** No relevant commits found

## v4.0.1...v4.1.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.1...v4.1.0)

**Note:** No relevant commits found

## v4.0.0-beta.39...v4.0.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.39...v4.0.1)

**Note:** No relevant commits found

## v4.0.0-beta.39...v4.0.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.39...v4.0.0)

**Note:** No relevant commits found

## v4.0.0-beta.37...v4.0.0-beta.38

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.37...v4.0.0-beta.38)

**Note:** No relevant commits found

## v4.0.0-beta.36...v4.0.0-beta.37

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.36...v4.0.0-beta.37)

**Note:** No relevant commits found

## v4.0.0-beta.35...v4.0.0-beta.36

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.35...v4.0.0-beta.36)

**Note:** No relevant commits found

## v4.0.0-beta.34...v4.0.0-beta.35

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.34...v4.0.0-beta.35)

**Note:** No relevant commits found

## v4.0.0-beta.33...v4.0.0-beta.34

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.33...v4.0.0-beta.34)

**Note:** No relevant commits found

## v4.0.0-beta.32...v4.0.0-beta.33

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.32...v4.0.0-beta.33)

**Note:** No relevant commits found

## v4.0.0-beta.31...v4.0.0-beta.32

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.31...v4.0.0-beta.32)

**Note:** No relevant commits found

## v4.0.0-beta.30...v4.0.0-beta.31

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.30...v4.0.0-beta.31)

**Note:** No relevant commits found

## v4.0.0-beta.29...v4.0.0-beta.30

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.29...v4.0.0-beta.30)

**Note:** No relevant commits found

## v4.0.0-beta.28...v4.0.0-beta.29

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.28...v4.0.0-beta.29)

**Note:** No relevant commits found

## v4.0.0-beta.27...v4.0.0-beta.28

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.27...v4.0.0-beta.28)

**Note:** No relevant commits found

## v4.0.0-beta.26...v4.0.0-beta.27

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.26...v4.0.0-beta.27)

**Note:** No relevant commits found

## v4.0.0-beta.25...v4.0.0-beta.26

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.25...v4.0.0-beta.26)

**Note:** No relevant commits found

## v4.0.0-beta.24...v4.0.0-beta.25

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.24...v4.0.0-beta.25)

**Note:** No relevant commits found

## v4.0.0-beta.23...v4.0.0-beta.24

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.23...v4.0.0-beta.24)

**Note:** No relevant commits found

## v4.0.0-beta.22...v4.0.0-beta.23

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.22...v4.0.0-beta.23)

**Note:** No relevant commits found

## v4.0.0-beta.21...v4.0.0-beta.22

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.21...v4.0.0-beta.22)

**Note:** No relevant commits found

## v4.0.0-beta.20...v4.0.0-beta.21

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.20...v4.0.0-beta.21)

**Note:** No relevant commits found

## v4.0.0-beta.19...v4.0.0-beta.20

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.19...v4.0.0-beta.20)

**Note:** No relevant commits found

## v4.0.0-beta.18...v4.0.0-beta.19

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.18...v4.0.0-beta.19)

**Note:** No relevant commits found

## v4.0.0-beta.17...v4.0.0-beta.18

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.17...v4.0.0-beta.18)

**Note:** No relevant commits found

## v4.0.0-beta.16...v4.0.0-beta.17

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.16...v4.0.0-beta.17)

**Note:** No relevant commits found

## v4.0.0-beta.15...v4.0.0-beta.16

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.15...v4.0.0-beta.16)

**Note:** No relevant commits found

## v4.0.0-beta.14...v4.0.0-beta.15

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.14...v4.0.0-beta.15)

**Note:** No relevant commits found

## v4.0.0-beta.13...v4.0.0-beta.14

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.13...v4.0.0-beta.14)

**Note:** No relevant commits found

## v4.0.0-beta.12...v4.0.0-beta.13

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.12...v4.0.0-beta.13)

**Note:** No relevant commits found

## v4.0.0-beta.11...v4.0.0-beta.12

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.11...v4.0.0-beta.12)

**Note:** No relevant commits found

## v4.0.0-beta.10...v4.0.0-beta.11

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.10...v4.0.0-beta.11)

**Note:** Version bump only to follow ecosystem versioning

## v4.0.0-beta.9...v4.0.0-beta.10

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.9...v4.0.0-beta.10)

**Note:** Version bump only to follow ecosystem versioning

## v4.0.0-beta.8...v4.0.0-beta.9

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.8...v4.0.0-beta.9)

**Note:** Version bump only to follow ecosystem versioning

## v4.0.0-beta.7...v4.0.0-beta.8

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.7...v4.0.0-beta.8)

**Note:** Version bump only to follow ecosystem versioning

All notable changes to this project will be documented in this file.

## v4.0.0-beta.6...v4.0.0-beta.7

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.6...v4.0.0-beta.7)

**Note:** Version bump only to follow ecosystem versioning
