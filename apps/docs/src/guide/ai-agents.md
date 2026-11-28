---
title: AI agents
description: Make Claude Code, Codex, OpenCode, Cursor, GitHub Copilot and the other AI coding agents use maz-ui and its ecosystem instead of re-implementing it - project rules, MCP server, version-matched docs, llms.txt and automatic code review.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Why

Left alone, coding agents rebuild what maz-ui already provides: native buttons instead of `MazBtn`, lodash instead of `@maz-ui/utils`, inline SVG instead of `@maz-ui/icons`, `bg-blue-500` instead of the theme colors. They also guess APIs from outdated training data.

maz-ui gives them five things:

| | What | Where |
| --- | --- | --- |
| **Rules** | How to use maz-ui in your project, loaded automatically by the agent | `.claude/rules/maz-ui.md`, `AGENTS.md` |
| **Version-matched docs** | Agent-ready markdown of the installed version: guides, component APIs, icons, Tailwind tokens | `node_modules/maz-ui/agent-docs/`, `node_modules/@maz-ui/<package>/agent-docs/` |
| **MCP server** | Search by need, exact component APIs, icons, theme tokens, setup guides, code review | `npx @maz-ui/mcp` |
| **Code review** | Static checks against the real maz-ui APIs, in the agent loop and in CI | `review_code` tool, `npx @maz-ui/mcp review` |
| **Plugins** | The rules, the MCP server and the review of each edited file, in all your projects: Claude Code, Codex and OpenCode | `claude plugin install maz-ui --marketplace LouisMazel/maz-ui` |

## Quick start

Two ways, use both or either:

- **You use Claude Code, Codex or OpenCode**: install the plugin once for your user ([Claude Code](#claude-code-plugin), [Codex](#codex-plugin), [OpenCode](#opencode-plugin)). It works in all your projects, without any file in them.
- **Your team, every agent**: run `npx @maz-ui/mcp init` in the project and commit the files it writes (rules, MCP config, review hook).

```bash
# Claude Code plugin, for your user
claude plugin install maz-ui --marketplace LouisMazel/maz-ui

# Codex plugin, for your user
codex plugin marketplace add LouisMazel/maz-ui
codex plugin add maz-ui@maz-ui

# the project, for your team and all its agents
npx @maz-ui/mcp init
```

### Configure a project with init

It detects the agents you use and configures them, using the docs of the maz-ui version installed in the project:

| Agent | Rules | MCP server |
| --- | --- | --- |
| Claude Code | `.claude/rules/maz-ui.md` (loaded for the files of the workspaces that use maz-ui) and a review hook in `.claude/settings.json` | `.mcp.json` |
| Cursor | `AGENTS.md` | `.cursor/mcp.json` |
| GitHub Copilot (VS Code) | `AGENTS.md` | `.vscode/mcp.json` |
| Codex | `AGENTS.md` | `.codex/config.toml` (read in the trusted projects), not written when the [Codex plugin](#codex-plugin) is enabled |
| OpenCode | `AGENTS.md`, and the [OpenCode plugin](#opencode-plugin) for the review | `opencode.json` |
| Windsurf, Zed, Gemini CLI... | `AGENTS.md` | the config of the agent, or its global config (see [MCP](./../ecosystem/mcp.md)) |

When no agent is detected, it configures Claude Code and `AGENTS.md`. Commit the generated files: your whole team and your CI agents get them.

The rules list the composables, directives and helpers of the ecosystem by need ("loading state shared between components: `useWait`", "amount of money: `formatCurrency`"): agents rarely search for a tool they do not suspect exists. For Claude Code, `init` also adds a hook that reviews each file Claude edits and sends the errors and warnings back to it, so it fixes them right away (see [Review hook](#review-hook-without-the-plugin)). It adds no hook when the maz-ui Claude Code plugin is enabled: the plugin has its own.

In a project without maz-ui (only `@maz-ui/utils` or `@maz-ui/node`, for example), it only registers the MCP server, which serves the docs bundled with `@maz-ui/mcp`: the rules are about the maz-ui components and are written once maz-ui is installed. Pass `--docs <dir>` to write them anyway.

For a fast start of the MCP server, install it in the project first (`pnpm add -D @maz-ui/mcp`): the configs then start the installed version through your package manager, in about a second and at the version of your lockfile, instead of downloading it with `npx`. See [MCP server](./../ecosystem/mcp.md#in-a-project-install-it).

::: tip It never overwrites your own instructions
- Your `CLAUDE.md` is never touched: Claude Code loads `.claude/rules/maz-ui.md` on top of it.
- In `AGENTS.md`, maz-ui only manages the section between `<!-- BEGIN:maz-ui -->` and `<!-- END:maz-ui -->`.
- In the MCP config files, only the `maz-ui` entry is added, the formatting and comments of the file are preserved. An existing server running `@maz-ui/mcp` under another name is kept as is.
- A file you created yourself with the same path is never overwritten.
- If you edit the generated rules, your edits are kept and the rules are no longer updated: delete the file (or the section) to get the rules of a new maz-ui version. To add your own rules, write them in another file or outside the section.
:::

### Options

```bash
npx @maz-ui/mcp init --targets claude,agents-md,cursor,vscode  # choose the agents
npx @maz-ui/mcp init --no-rules                                # MCP server only
npx @maz-ui/mcp init --no-mcp                                  # rules only
npx @maz-ui/mcp init --no-hooks                                # no review hook (Claude Code) nor OpenCode plugin
npx @maz-ui/mcp init --dry-run                                 # show the changes
npx @maz-ui/mcp init --remove                                  # remove everything init added
```

Run it again after upgrading maz-ui: the rules follow the installed version.

### Nuxt: opt-in

With [`@maz-ui/nuxt`](./../ecosystem/nuxt.md), set `agents.mcp: true` to connect the agents detected in the project to the maz-ui MCP server when you start the dev server: the module adds the `maz-ui` entry to their MCP config (`.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`). The instructions of the MCP server already give the maz-ui rules to the agents. Nothing is written by default.

```ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    // default: { rules: false, mcp: false }
    agents: {
      mcp: true, // register the maz-ui MCP server
      rules: true, // also write .claude/rules/maz-ui.md and the AGENTS.md section
      targets: ['claude', 'agents-md'], // default: the detected agents
    },
    // or enable everything: agents: true
  },
})
```

It only runs in development (never in CI, in tests or during builds), writes nothing when no agent is detected, keeps the files in sync with the installed maz-ui version and never overwrites files it does not own. In a monorepo, it writes at the root of the workspace, where the agents start (`agents.dir` to choose another folder).

### Monorepos with several Nuxt apps

Each app syncs the agent files when it starts (`nuxt dev`, `nuxt prepare`), and all of them write at the root of the workspace:

- **Same options in every app**: the first app writes the files, the next ones find them up to date and write nothing.
- **Different options**: they add up. An app with `rules: false` does not remove the rules written by an app with `rules: true` (only `npx @maz-ui/mcp init --remove` removes them), and the `targets` of each app are added. With `agents.dir`, each app writes in its own folder.
- **Apps started together** (`nx run-many -t dev`, `turbo dev`): the files are written atomically, an app never reads a file another app is writing.
- **Different maz-ui versions per app**: the rules of the most recent version are kept, an app with an older maz-ui never downgrades them. Align the versions (a pnpm catalog, for example) to get the same rules everywhere.

::: warning One MCP server for the whole workspace
Started at the root, the MCP server serves the docs of the first maz-ui it finds: in the root `node_modules`, then in the workspaces of the monorepo (`pnpm-workspace.yaml` or the `workspaces` field of `package.json`), in their order. When the apps install different maz-ui versions, an agent working on one app can get the docs of the version of another app. Align the versions, or point the server to the docs of an app with `--docs` (see [Version-matched docs](./../ecosystem/mcp.md#version-matched-docs)).
:::

### Without any file in the project

The MCP server carries the rules in its instructions: registering it once for your user is enough, in every project, without writing anything in them.

- Claude Code: install the [plugin](#claude-code-plugin), or run `claude mcp add maz-ui --scope user -- npx -y @maz-ui/mcp@latest`.
- Codex: install the [plugin](#codex-plugin).
- OpenCode: add the [plugin](#opencode-plugin) to `~/.config/opencode/opencode.json`.
- Cursor, Windsurf...: add the server to the global MCP config of the agent (see [MCP](./../ecosystem/mcp.md#configuration)).

Write the project files (`init`, the Nuxt option) when your whole team, or agents without MCP, need the rules.

## Claude Code plugin

The maz-ui plugin gives Claude Code everything it needs in all your projects, without a file in them:

- the **rules in every session**: in a project that installs maz-ui (also in the apps of a monorepo), the rules and the ecosystem by need of the installed version are added when a session starts, after a `/clear` or a compaction, and when a subagent that writes code starts. Nothing is added when the project already loads them (`.claude/rules/maz-ui.md` or the maz-ui section of `AGENTS.md`);
- the **`maz-ui` skill**: the rules and the look-up workflow, with the ecosystem by need, loaded when Claude works on Vue or Nuxt code;
- the **MCP server**: the `@maz-ui/mcp` installed in the project, else the latest one;
- a **review hook**: each `.vue`, `.ts`, `.js` or `.css` file Claude edits in a project that uses maz-ui is reviewed, and Claude fixes the errors and warnings right away. At the end of a task, the files changed in git are reviewed too, also the ones written through Bash. In a monorepo, each file is reviewed against the maz-ui of its app;
- the **`maz-ui-editor` subagent**: Claude hands it the UI tasks of a maz-ui project, it looks up and reviews with the maz-ui tools;
- the **`maz-ui-upgrade` skill**: upgrades maz-ui in a project (`/maz-ui:maz-ui-upgrade`), with the migration guide and `@maz-ui/upgrade`.

### Install

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

It is installed for your user (`--scope user`, the default). `--scope project` enables it in the `.claude/settings.json` of the project, but each teammate still installs it: Claude Code does not download plugins from the project settings.

### Update

Claude Code does not update third-party marketplaces by default. Turn on the auto-update of the `maz-ui` marketplace in `/plugin` (**Marketplaces** tab), or update it by hand:

```bash
claude plugin marketplace update maz-ui
claude plugin update maz-ui@maz-ui
```

Then run `/reload-plugins` in the open sessions.

### With init

`init` adds no review hook when the plugin is enabled: the plugin has its own. The plugin also runs its own MCP server (`plugin:maz-ui:maz-ui`): `init` keeps the `maz-ui` server of `.mcp.json` for the teammates without the plugin, and disables it for you in `.claude/settings.local.json`, a file that is not committed:

```json
{
  "disabledMcpjsonServers": ["maz-ui"]
}
```

Run `init` again after removing the plugin: it enables the server again. Until `init` runs, the plugin tells Claude at each session to use the tools of its own server.

### Check the setup

`doctor` shows how Claude Code gets maz-ui in a project: the MCP servers of each scope (local, project, user, plugin), the one that runs, the duplicates, the servers pinned to another version than the installed maz-ui, and outdated rules. Each problem comes with its fix:

```bash
npx @maz-ui/mcp doctor
```

A server of your user (`claude mcp add -s user`) runs beside the one of the plugin: remove it with `claude mcp remove maz-ui -s user`.

### Review hook without the plugin

The review hook of the plugin is the `review --hook` mode of the CLI. `npx @maz-ui/mcp init` adds it to `.claude/settings.json`; to add it by hand, write it in `.claude/settings.json` (shared with your team) or `.claude/settings.local.json` (your machine only):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [{ "type": "command", "command": "npx -y @maz-ui/mcp@latest review --hook", "timeout": 90 }]
      }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "npx -y @maz-ui/mcp@latest review --hook", "timeout": 90 }] }
    ],
    "SubagentStop": [
      { "hooks": [{ "type": "command", "command": "npx -y @maz-ui/mcp@latest review --hook", "timeout": 90 }] }
    ]
  }
}
```

- `PostToolUse`: each file Claude edits in a project that uses maz-ui is reviewed. The errors and warnings are sent back to Claude, which fixes them.
- `Stop` and `SubagentStop`: at the end of a task (or of a subagent), the files changed in git are reviewed, also the ones written another way (a script, a heredoc in Bash). Only the findings not sent yet in the session are sent, once: Claude fixes them before it stops.

## Codex plugin

The plugin of Claude Code also works in Codex, from the same marketplace: the rules in every session, the `maz-ui` and `maz-ui-upgrade` skills, the MCP server, and the review of each edited file and, at the end of a task, of the files changed in git.

```bash
codex plugin marketplace add LouisMazel/maz-ui
codex plugin add maz-ui@maz-ui
```

Codex runs the hooks of a plugin once you trust them: review and accept them in `/hooks`. Codex plugins have no subagents: there is no `maz-ui-editor` in Codex.

`init` does not register the MCP server in `.codex/config.toml` when the plugin is enabled: the plugin runs its own.

## OpenCode plugin

OpenCode plugins are npm packages: `@maz-ui/mcp` is the maz-ui plugin of OpenCode, with the same skills, subagent, MCP server and review as the plugin of Claude Code and Codex. Add it to the `plugin` list of `opencode.json`, in the project or in `~/.config/opencode/opencode.json` for all your projects:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@maz-ui/mcp"]
}
```

It brings:

- the **MCP server**: the `@maz-ui/mcp` installed in the project, else its own, unless the config already starts one;
- the **`maz-ui` and `maz-ui-upgrade` skills**;
- the **`maz-ui-editor` subagent**, unless the config already has an agent of that name;
- in a project that uses maz-ui, the **rules** of the installed version in the system prompt, unless `AGENTS.md` already has them;
- the **review** of each file the agent edits in a project that uses maz-ui: the errors and warnings are added to the result of the edit, and at the end of a task, the findings of the files changed in git are sent back to the agent.

Restart OpenCode after changing its config: it loads its plugins when it starts. `opencode debug skill`, `opencode agent list` and `opencode mcp list` show what the plugin added.

With the `opencode` target, `init` adds it for you, pinned to the version of the MCP server (`--no-hooks` to leave it out).

## Version-matched docs

Every package of the ecosystem ships the documentation of its own version for agents in its `agent-docs/` folder, so a package released on its own (`@maz-ui/eslint-config`, `@maz-ui/stylelint-config`, `@maz-ui/upgrade`) is never documented by another version. `maz-ui` also lists the other packages in its index:

```txt
node_modules/maz-ui/agent-docs/
├── README.md                     # index of its pages and of the other packages, start here
├── rules.md                      # the rules below
├── manifest.json                 # machine-readable index, component APIs, tokens
├── components/maz-btn.md         # usage, examples and full API of each component
├── composables/  directives/  plugins/  guide/
└── reference/tailwind-tokens.md  # every Tailwind class and CSS variable of the theme

node_modules/@maz-ui/icons/agent-docs/    # ecosystem/icons.md, reference/icons.md (the 860+ icon names)
node_modules/@maz-ui/themes/agent-docs/   # same layout for each package: README.md, manifest.json, pages
```

The pages are the ones of this website, cleaned for agents: no live demos, every example as code, and the full API of each component (props with their accepted values, `v-model`, events, slots) generated from the TypeScript sources.

Agents read the docs of **your** version, not what they remember from their training data. The MCP server serves the same files.

## MCP server

The MCP server gives agents tools that work with the needs they have, and verify their code:

| Tool | Purpose |
| --- | --- |
| `search_docs` | Find what maz-ui provides for a need ("confirm before delete", "phone input", "debounce search") |
| `get_project_info` | How the project uses maz-ui: installed versions, setup of the toasts, dialogs and aos, auto-imports, icons by name, theme presets, the components and tools already used |
| `get_component_api` | Exact props, values, events, slots of up to 10 components, with the sections of their examples (`compact: true`: names and types only) |
| `find_icons` | Icons by meaning ("delete", "settings", "france flag") with their imports |
| `get_theme_tokens` | The theme of your project (preset, `@theme` tokens, variants, utilities), its effective colors (every step in light and dark, contrasts, what to check) and every Tailwind class and CSS variable of maz-ui |
| `get_doc` | Any page of the docs, or only some sections |
| `list_docs` | The whole catalog |
| `get_setup_guide` | Installation in a Vue or Nuxt app, with or without Tailwind |
| `review_code` | Review files against the installed maz-ui |

See [MCP](./../ecosystem/mcp.md) for the configuration of each agent.

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
| `deprecated-prop` | warning | A prop kept for compatibility: the message gives its replacement |
| `invalid-prop-value` | error | `color="red"` on a component that accepts `primary`, `secondary`... |
| `boolean-prop-string` | error | `disabled="false"` (a truthy string) |
| `unknown-model`, `unknown-event`, `unknown-slot` | error | `v-model:foo`, `@clik`, `<template #captions>` |
| `unknown-slot-binding` | error | A slot prop the slot does not provide: `<template #trigger="{ isOpenn }">` |
| `missing-required-prop` | warning | A required prop or `v-model` left out: `<MazSelect>` without `options` |
| `unknown-icon` | error | An icon that does not exist in `@maz-ui/icons`, or a name (`icon="x-mak"`) that is neither an icon of maz-ui nor of the project |
| `unregistered-icon-names` | info | Icon names in a project without `MazUi()` (`@maz-ui/vite-plugin`) nor `@maz-ui/nuxt`: they render the fallback |
| `prefer-maz-component` | warning | `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`... (a `<button>` that is a clickable card, with a layout, a component or a title and a subtitle, or an empty hit area, is left alone) |
| `inline-svg` | warning | SVG icons written inline |
| `icon-button-label` | warning | A `MazBtn` that only shows an icon, without `text`, content nor `aria-label` |
| `input-label` | warning | A `MazInput`, `MazSelect`, `MazTextarea`... without `label`, `top-label`, `placeholder` nor `aria-label` |
| `button-navigation` | warning | A `MazBtn` inside a link, or navigating from `@click` (`router.push`, `navigateTo`, `window.open`): use `to` or `href` |
| `multiple-primary-actions` | info | Several solid primary `MazBtn` side by side |
| `native-dialog` | warning | `alert()`, `confirm()`, `prompt()` instead of `useToast()` and `useDialog()` |
| `prefer-dialog-confirm` | warning | A `MazDialog` with a cancel and a confirm button: use `useDialog().confirm()` or `MazDialogConfirm` |
| `before-close-event` | warning | `@before-close` on `MazDialog`, `MazDrawer`, `MazBottomSheet` or `MazBackdrop`: the event cannot cancel the close, use the `before-close` prop returning `false` |
| `btn-important-text` | warning | An important text class on `MazBtn` (`!text-red-500`): its text colors are plain utilities now, drop the `!` |
| `prefer-input-secret` | warning | A password `MazInput` with a bullet placeholder: use `MazInputSecret` for a saved secret |
| `prefer-markdown` | warning | `MazMarkdownEditor mode="preview"` or `v-html` of `marked(...)` used as a markdown renderer: use `MazMarkdown` |
| `prefer-open-external` | warning | A `MazLink as="button"` whose click opens a URL (`openExternal`, `openUrl`, `window.open`): keep the `href` and set the `openExternal` option of the MazUi plugin |
| `table-part-outside-table` | warning | `MazTableRow`, `MazTableCell` or `MazTableTitle` outside of a `MazTable` (invalid HTML): `MazTable` sorts, searches and paginates by itself |
| `prefer-ecosystem`, `prefer-utils` | warning / info | lodash, VueUse, toast, icon, tooltip, date picker... libraries that maz-ui already covers, and hand-written code it provides (`Intl.NumberFormat` for a currency, a `setTimeout` debounce, a loading `ref` shared by a module, `JSON.stringify` to compare objects, a click outside listener, `navigator.clipboard`, a countdown with `setInterval`, the iOS detection, a case conversion regex, `document.cookie`, a `resize` or `scroll` listener, a `new IntersectionObserver`, `body.style.overflow`...). Warning when the tool covers the case, info when the hand-written code can be intended |
| `theme-colors` | warning | Default Tailwind palette (`bg-blue-500`, `text-gray-600`, `bg-white`) |
| `hardcoded-color` | warning | `bg-[#1d90ff]`, `color: #fff` |
| `hardcoded-motion` | info | `duration-300`, `transition: opacity 300ms`: the motion tokens follow the preset and the reduced motion (`var(--maz-motion-normal)`, `duration-(--duration-normal)`) |
| `transition-all`, `layout-transition` | info | `transition-all`, `transition: all`, `transition: height`: animate `transform` and `opacity` |
| `pale-brand-color` | warning | A `primary` or `secondary` of `definePreset` under 3:1 against the surface: they are strong brand colors, not subtle backgrounds |
| `internal-prefix` | error | The internal `maz:` prefix |
| `tailwind-v3` | warning | `bg-opacity-50`, `flex-shrink-0`... |
| `missing-reference` | error | `@apply` in a SFC style block without `@reference` |
| `manual-dark-mode` | warning | Dark mode handled by hand instead of `useTheme()` |
| `root-import`, `internal-import` | error | Runtime imports from `maz-ui` (types only) or from `src`/`dist` |
| `nuxt-auto-import` | info | Imports that `@maz-ui/nuxt` already auto-imports (a component used in the script, `h(MazIcon)`, keeps its import) |
| `deprecated-api` | warning | `app.use(ToastPlugin)`, `DialogPlugin`, `WaitPlugin`, `$mazToast`... and `mazUi.plugins` in `nuxt.config`: the composables work without them (removed in v6) |
| `parse-error` | error | A file the parser cannot read (an unclosed tag): it is not reviewed |
| `invalid-ignore` | error | A `maz-ui-review-ignore` comment without a reason, or on a rule that cannot be ignored |

When something is intended, ignore it with a comment on the line above, with the reason after `--`: `<!-- maz-ui-review-ignore theme-colors -- frame over the video -->`, `// maz-ui-review-ignore prefer-utils -- mock of capitalize`. `maz-ui-review-ignore-file` ignores a whole file. A comment without a reason is not applied.

The errors of a code that does not work cannot be ignored: an unknown component, prop, value, model, event or slot, a missing required prop, a raw icon used as a tag, a root or internal import, a missing `@reference` and a parse error. Fix them.

## llms.txt

The documentation is also published for agents that browse the web:

- [maz-ui.com/llms.txt](https://maz-ui.com/llms.txt): index of every page
- [maz-ui.com/llms-full.txt](https://maz-ui.com/llms-full.txt): the whole documentation in one file
- Each page as markdown: `https://maz-ui.com/components/maz-btn.md`

## The rules

This is what `init`, the Nuxt option, the plugins and the MCP server teach to your agents:

<!--@include: ../../../../tools/agent-docs/content/rules.md-->
