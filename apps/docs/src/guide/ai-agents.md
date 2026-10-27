---
title: AI agents
description: Make Claude Code, Cursor, GitHub Copilot, Codex and the other AI coding agents use maz-ui and its ecosystem instead of re-implementing it - project rules, MCP server, version-matched docs, llms.txt and automatic code review.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Why

Left alone, coding agents rebuild what maz-ui already provides: native buttons instead of `MazBtn`, lodash instead of `@maz-ui/utils`, inline SVG instead of `@maz-ui/icons`, `bg-blue-500` instead of the theme colors. They also guess APIs from outdated training data.

maz-ui gives them four things:

| | What | Where |
| --- | --- | --- |
| **Rules** | How to use maz-ui in your project, loaded automatically by the agent | `.claude/rules/maz-ui.md`, `AGENTS.md` |
| **Version-matched docs** | Agent-ready markdown of the installed version: guides, component APIs, icons, Tailwind tokens | `node_modules/maz-ui/docs/` |
| **MCP server** | Search by need, exact component APIs, icons, theme tokens, setup guides, code review | `npx @maz-ui/mcp` |
| **Code review** | Static checks against the real maz-ui APIs, in the agent loop and in CI | `review_code` tool, `npx @maz-ui/mcp review` |

## Quick start

Run this command at the root of your project:

```bash
npx @maz-ui/mcp init
```

It detects the agents you use and configures them, using the docs of the maz-ui version installed in the project:

| Agent | Rules | MCP server |
| --- | --- | --- |
| Claude Code | `.claude/rules/maz-ui.md` (always loaded) | `.mcp.json` |
| Cursor | `AGENTS.md` | `.cursor/mcp.json` |
| GitHub Copilot (VS Code) | `AGENTS.md` | `.vscode/mcp.json` |
| Codex, Windsurf, Zed, Gemini CLI... | `AGENTS.md` | global config of the agent (see [MCP](./../ecosystem/mcp.md)) |

When no agent is detected, it configures Claude Code and `AGENTS.md`. Commit the generated files: your whole team and your CI agents get them.

::: tip It never overwrites your own instructions
- Your `CLAUDE.md` is never touched: Claude Code loads `.claude/rules/maz-ui.md` on top of it.
- In `AGENTS.md`, maz-ui only manages the section between `<!-- BEGIN:maz-ui -->` and `<!-- END:maz-ui -->`.
- In the MCP config files, only the `maz-ui` entry is added, the formatting and comments of the file are preserved. An existing server running `@maz-ui/mcp` under another name is kept as is.
- A file you created yourself with the same path is never overwritten.
:::

### Options

```bash
npx @maz-ui/mcp init --targets claude,agents-md,cursor,vscode  # choose the agents
npx @maz-ui/mcp init --no-rules                                # MCP server only
npx @maz-ui/mcp init --no-mcp                                  # rules only
npx @maz-ui/mcp init --dry-run                                 # show the changes
npx @maz-ui/mcp init --remove                                  # remove everything init added
```

Run it again after upgrading maz-ui: the rules follow the installed version.

### Nuxt: connected by default

With [`@maz-ui/nuxt`](./../ecosystem/nuxt.md), the agents detected in the project are connected to the maz-ui MCP server when you start the dev server: the module only adds the `maz-ui` entry to their MCP config (`.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`). The instructions of the MCP server already give the maz-ui rules to the agents, so no rule file is written by default.

```ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    // default: { rules: false, mcp: true }
    agents: {
      rules: true, // also write .claude/rules/maz-ui.md and the AGENTS.md section
      targets: ['claude', 'agents-md'], // default: the detected agents
    },
    // or disable it: agents: false
  },
})
```

It only runs in development (never in CI, in tests or during builds), writes nothing when no agent is detected, keeps the files in sync with the installed maz-ui version and never overwrites files it does not own.

### Without any file in the project

The MCP server carries the rules in its instructions: registering it once for your user is enough, in every project, without writing anything in them.

- Claude Code: install the [plugin](#claude-code-plugin), or run `claude mcp add maz-ui --scope user -- npx -y @maz-ui/mcp@latest`.
- Cursor, Windsurf, Codex...: add the server to the global MCP config of the agent (see [MCP](./../ecosystem/mcp.md#configuration)).

Write the project files (`init`, the Nuxt option) when your whole team, or agents without MCP, need the rules.

## Version-matched docs

Each `maz-ui` release ships its documentation for agents in `node_modules/maz-ui/docs/`:

```txt
node_modules/maz-ui/docs/
├── README.md                     # index of every page, start here
├── rules.md                      # the rules below
├── manifest.json                 # machine-readable index, component APIs, icons, tokens
├── components/maz-btn.md         # usage, examples and full API of each component
├── composables/  directives/  plugins/  guide/
├── ecosystem/                    # themes, translations, icons, nuxt, utils, node...
└── reference/
    ├── tailwind-tokens.md        # every Tailwind class and CSS variable of the theme
    └── icons.md                  # the 860+ icon names
```

The pages are the ones of this website, cleaned for agents: no live demos, every example as code, and the full API of each component (props with their accepted values, `v-model`, events, slots) generated from the TypeScript sources.

Agents read the docs of **your** version, not what they remember from their training data. The MCP server serves the same files.

## MCP server

The MCP server gives agents tools that work with the needs they have, and verify their code:

| Tool | Purpose |
| --- | --- |
| `search_docs` | Find what maz-ui provides for a need ("confirm before delete", "phone input", "debounce search") |
| `get_component_api` | Exact props, values, events, slots of up to 10 components |
| `find_icons` | Icons by meaning ("delete", "settings", "france flag") with their imports |
| `get_theme_tokens` | Every Tailwind class and CSS variable of the theme |
| `get_doc` | Any page of the docs, or only some sections |
| `list_docs` | The whole catalog |
| `get_setup_guide` | Installation in a Vue or Nuxt app, with or without Tailwind |
| `review_code` | Review files against the installed maz-ui |

See [MCP](./../ecosystem/mcp.md) for the configuration of each agent.

## Claude Code plugin

The maz-ui plugin bundles the MCP server, a `maz-ui` skill (rules and workflow) and a hook that reviews every `.vue`, `.ts` and `.css` file Claude edits, so it fixes maz-ui mistakes before you see them.

```txt
/plugin marketplace add LouisMazel/maz-ui
/plugin install maz-ui@maz-ui
```

The plugin works in every project, `init` configures one project for your whole team: use both or either.

## Code review in CI

The checks of `review_code` are also available from the command line:

```bash
npx @maz-ui/mcp review "src/**/*.{vue,ts,css}"
npx @maz-ui/mcp review app --min-severity warning --max-warnings 0
npx @maz-ui/mcp review src --format json
```

The command exits with an error code when it finds errors (or more warnings than `--max-warnings`).

| Rule | Severity | Detects |
| --- | --- | --- |
| `unknown-component` | error | `<MazButton>` (did you mean `MazBtn`?) |
| `unknown-prop` | warning | A prop the component does not have (`colour`) |
| `invalid-prop-value` | error | `color="red"` on a component that accepts `primary`, `secondary`... |
| `boolean-prop-string` | error | `disabled="false"` (a truthy string) |
| `unknown-model`, `unknown-event`, `unknown-slot` | error | `v-model:foo`, `@clik`, `<template #captions>` |
| `unknown-icon` | error | An icon that does not exist in `@maz-ui/icons` |
| `prefer-maz-component` | warning | `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`... |
| `inline-svg` | warning | SVG icons written inline |
| `prefer-ecosystem`, `prefer-utils` | warning / info | lodash, VueUse, toast, icon, tooltip, date picker... libraries that maz-ui already covers |
| `theme-colors` | warning | Default Tailwind palette (`bg-blue-500`, `text-gray-600`, `bg-white`) |
| `hardcoded-color` | warning | `bg-[#1d90ff]`, `color: #fff` |
| `internal-prefix` | error | The internal `maz:` prefix |
| `tailwind-v3` | warning | `bg-opacity-50`, `flex-shrink-0`... |
| `missing-reference` | error | `@apply` in a SFC style block without `@reference` |
| `manual-dark-mode` | warning | Dark mode handled by hand instead of `useTheme()` |
| `root-import`, `internal-import` | error | Runtime imports from `maz-ui` (types only) or from `src`/`dist` |
| `nuxt-auto-import` | info | Imports that `@maz-ui/nuxt` already auto-imports |

When something is intended, ignore it with a comment on the line above (`<!-- maz-ui-review-ignore prefer-maz-component -->`, `// maz-ui-review-ignore theme-colors`), or `maz-ui-review-ignore-file` for a whole file.

## llms.txt

The documentation is also published for agents that browse the web:

- [maz-ui.com/llms.txt](https://maz-ui.com/llms.txt): index of every page
- [maz-ui.com/llms-full.txt](https://maz-ui.com/llms-full.txt): the whole documentation in one file
- Each page as markdown: `https://maz-ui.com/components/maz-btn.md`

## The rules

This is what `init`, the Nuxt option, the Claude Code plugin and the MCP server teach to your agents:

<!--@include: ../../../../tools/agent-docs/content/rules.md-->
