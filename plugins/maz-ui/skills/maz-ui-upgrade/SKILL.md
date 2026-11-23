---
name: maz-ui-upgrade
description: Upgrade a project to a new major version of maz-ui (v4 to v5, v3 to v4) - the automatic rewrites of @maz-ui/upgrade, then the manual steps of the migration guide, checked with the maz-ui review. Use when the user asks to upgrade or migrate maz-ui, or when the installed maz-ui is older than the docs or the code expect.
---

# Upgrade maz-ui

1. **Versions.** Read the installed `maz-ui` in the `package.json` of each app (in a monorepo, each app that depends on it) and the target version. `npx @maz-ui/mcp doctor` shows the installed versions and the MCP servers that do not match them.
2. **Guide.** Read the migration guide with the maz-ui MCP server: `get_doc({ id: "guide/migration-v5" })` (v4 to v5) or `get_doc({ id: "guide/migration-v4" })` (v3 to v4). It lists every change, the automatic ones and the manual ones.
3. **Automatic rewrites (v4 to v5).** Run `npx @maz-ui/upgrade <app> --dry-run`, show the planned changes to the user, then run it without `--dry-run`. It rewrites the imports, the renamed props, the CSS and the config, and updates the dependencies.
4. **Manual steps.** Apply the steps of the guide that the tool does not cover (`@maz-ui/upgrade` prints them at the end): theme presets, bound values, sizes in `px` or `em`... Check each API you change with `get_component_api` or `get_doc`: never guess a new prop or import.
5. **Review.** Run `review_code` on the changed files (or `npx @maz-ui/mcp review "src/**/*.{vue,ts}"` for the whole app) and fix every error and warning: unknown props, removed components, old imports, default Tailwind colors.
6. **Check.** Run the typecheck, the tests and the build of the app. Then run `npx @maz-ui/mcp init` again: the agent rules, the MCP server and the review hooks follow the new version.

Report the changes, the manual steps done, and the ones left to the user.
