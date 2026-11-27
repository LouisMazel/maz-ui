# agent-evals

Does Claude Code reuse maz-ui? Each run gives a task of a Vue app to the real `claude -p`, then scores what it wrote.

```bash
pnpm build:packages
pnpm -F agent-evals eval --tasks copy-link,price --runs 3
```

## Conditions

- `baseline`: Claude Code alone, without the settings, MCP servers and plugins of the user. The app does not install `@maz-ui/mcp`: only maz-ui and the docs it ships (`node_modules/maz-ui/agent-docs`).
- `init`: what `npx @maz-ui/mcp init` writes in the app (rule, MCP server, review hooks).
- `plugin`: the Claude Code plugin of `plugins/maz-ui`, without init.

## Scoring

A run passes when:

- `maz-ui-mcp review` finds no error nor warning in the files of the agent;
- the code uses the expected maz-ui tools (`useClipboard`, `MazBtn`...);
- the code has no hand-made version (`navigator.clipboard`, `<button>`...);
- the agent added no dependency to the `package.json` of the app (a library for something maz-ui covers);
- the app typechecks (`vue-tsc --noEmit`) and builds (`vite build`).

The app has the tools to check itself: `npm run build` and `npm run typecheck` work in it (linked to the ones of agent-evals).

The tasks live in `src/tasks.ts`. Their prompts never name maz-ui: the eval measures whether the agent finds the ecosystem by itself.

## Results

`results/<date>/` (or `--out`): `report.md`, `scores.json` and one folder per run with its score, the files of the agent, its last message, its transcript (`transcript.jsonl`) and the output of a failed check (`typecheck.log`, `build.log`). `--keep` keeps the apps.

The report has two tables by condition:

- **Quality**: pass rate, review findings, runs that typecheck and build, runs that added a dependency, lines added by the agent.
- **Effort**: tool calls (all tools, then the maz-ui MCP tools), runs that read the agent docs and that reviewed their code, tokens (every model, cached ones included), turns, minutes and cost.

Compare models with one `--out` per model (`--model sonnet --out results/sonnet`).

Each run costs tokens (about $0.25 for a small task): never run it in CI. `--dry-run` prints the runs and the commands.
