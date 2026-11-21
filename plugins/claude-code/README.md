# maz-ui plugin for Claude Code

Makes Claude Code use the maz-ui ecosystem (components, composables, directives, `@maz-ui/icons`, `@maz-ui/utils`, `@maz-ui/themes`, Tailwind theme tokens) instead of re-implementing it, in all your projects, without a file in them.

## Install

From a terminal:

```bash
claude plugin install maz-ui --marketplace LouisMazel/maz-ui
```

Or from a Claude Code session (two steps, the slash command has no shortcut):

```txt
/plugin marketplace add LouisMazel/maz-ui
/plugin install maz-ui@maz-ui
```

The terminal shortcut needs Claude Code 2.1.292 or later. Before, run `claude plugin marketplace add LouisMazel/maz-ui` then `claude plugin install maz-ui@maz-ui`.

## What it contains

- **Rules in every session**: in a project that installs maz-ui (also in the apps of a monorepo), the rules and the ecosystem by need of the installed version are added when a session starts, after a `/clear` or a compaction, and when a subagent that writes code starts. Nothing is added when the project already loads them (`.claude/rules/maz-ui.md` or the maz-ui section of `AGENTS.md`).
- **`maz-ui` skill**: the maz-ui rules, the ecosystem by need (which composable or helper for a loading state, a debounce, a currency...) and the look-up workflow, loaded when Claude works on Vue or Nuxt code.
- **`maz-ui` MCP server** (the `@maz-ui/mcp` installed in the project, else `npx -y @maz-ui/mcp@latest`): how the project uses maz-ui, search by need, component APIs, icons, theme tokens, docs of the maz-ui version installed in the project, code review.
- **Review hook**: after each edit of a `.vue`, `.ts`, `.js` or `.css` file in a project that depends on maz-ui, the file is reviewed against the installed maz-ui and Claude gets the errors and warnings to fix (unknown props, invalid values, native elements, hand-written helpers, default Tailwind palette, `maz:` prefix...). At the end of a task (and of a subagent), the files changed in git are reviewed too, also the ones written through Bash. In a monorepo, each file is reviewed against the maz-ui of its app.
- **`maz-ui-editor` subagent**: Claude hands it the UI tasks of a maz-ui project, it looks up and reviews with the maz-ui tools.
- **`maz-ui-upgrade` skill**: upgrades maz-ui in a project (`/maz-ui:maz-ui-upgrade`), with the migration guide and `@maz-ui/upgrade`.

## Update

Claude Code does not update third-party marketplaces by default: turn on the auto-update of the `maz-ui` marketplace in `/plugin` (**Marketplaces** tab), or run `claude plugin marketplace update maz-ui` then `claude plugin update maz-ui@maz-ui`, and `/reload-plugins`.

## With `npx @maz-ui/mcp init`

`init` configures a project for the whole team and all its agents (rules in `AGENTS.md` and `.claude/rules/`, MCP server in the project config, review hook). It adds no hook when the plugin is enabled, and disables the `maz-ui` server of `.mcp.json` for you in `.claude/settings.local.json` (the plugin runs its own). `npx @maz-ui/mcp doctor` checks the setup: the MCP servers of each scope, the duplicates, the versions. Documentation: https://maz-ui.com/guide/ai-agents#claude-code-plugin

## Maintenance

The skill is generated from `tools/agent-docs/content` and `tools/agent-docs/src/catalog.ts`: run `pnpm -F agent-docs generate:plugin` after changing them (a test fails otherwise). `pnpm -F agent-evals eval` measures whether Claude Code reuses maz-ui with the plugin.
