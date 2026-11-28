# Visual regression tests

Playwright screenshots of the main components, in light and dark, LTR and RTL (4 projects: `light-ltr`, `dark-ltr`, `light-rtl`, `dark-rtl`). The blocks live in `src/pages/visual.vue` (`data-visual="<name>"`), fixed content, no network.

Stable captures: reduced motion forced (`reducedMotion: 'reduce'` and `--maz-motion-scale: 0`), animations and transitions off, Google Fonts blocked (system font). The date picker shows a past month (March 2026) so "today" never appears. The clock is not frozen: a fixed `Date` breaks the popovers (MazSelect does not open).

## Run

```bash
pnpm -F nuxt-app test:visual          # compare with the baselines
pnpm -F nuxt-app test:visual:update   # rewrite the baselines
```

The config builds and previews the app (`nuxi build` then `nuxi preview` on port 3401, `VISUAL_PORT` to change it); a server already running on that port is reused. Build the packages first (`pnpm build:packages`) so the app sees the current maz-ui.

First time: `pnpm -F nuxt-app exec playwright install chromium`.

## Update the baselines

A failing test writes the expected, actual and diff images in `tests/visual/.results/` (ignored by git). If the change is wanted, run `test:visual:update`, look at the changed PNG in `__screenshots__/` and commit them with the PR. Add a block to `visual.vue` and a name in `BLOCKS` of `visual.spec.ts` for a new component.

## Not in the CI

The baselines depend on the OS (font rendering): they are generated on macOS and run locally before the PRs that change visuals (the plan of the modernisation requires it). To run them in the CI, generate the baselines in the same image (Playwright Docker image) first.
