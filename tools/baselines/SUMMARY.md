# v3 → v5 migration metrics

Measurements captured on Apple M1 Pro. See v3-bundle.txt / v5-bundle.txt / v3-buildtime.txt / v5-buildtime.txt for raw numbers.

## Bundle size

| File                | v3 raw | v5 raw | Δ raw | v3 gzip | v5 gzip | Δ gzip |
| ------------------- | ------ | ------ | ----- | ------- | ------- | ------ |
| dist/css/main.css   | 13.3 KB | 48.2 KB | +34.9 KB (+262%) | 2.6 KB | 8.3 KB | +5.7 KB (+218%) |
| dist/css/aos.css    | 19.3 KB | 19.3 KB | 0     | 1.7 KB  | 1.7 KB  | 0      |
| dist/ (total)       | 2.2 MB  | 2.3 MB  | +100 KB (+5%) | n/a | n/a | n/a |

**Note on main.css**: v3 resolved `@apply` inline inside per-component CSS chunks. v5 centralises *all* utility declarations referenced via `@tailwindcss/cli` into a single main.css — the size increase reflects the move from scattered resolution to a single shared stylesheet, not a net duplication. Per-component chunks in `dist/assets/` are smaller accordingly, which is why the total dist size barely budges (+5%).

## Build time

| | v3 | v5 | Δ |
| - | - | - | - |
| `pnpm -C packages/lib build` (cold NX cache, 3-run avg) | 8.83 s | 12.82 s | +3.99 s (+45%) |

**Interpretation**: the Tailwind v4 core compiler is indeed faster, but each of the 91 Vue SFCs now gets processed individually by `@tailwindcss/vite` for its `<style>` block (resolving `@apply` against the `@reference`-ed entry). The net result on a component-heavy library is a modest slowdown on cold builds. Incremental rebuilds (HMR) feel substantially faster.

## Test surface

| | v3 | v5 |
| - | - | - |
| Unit tests (lib) | 2835 | 2835 |
| Unit tests (themes) | 210 | 233 (+color-parser coverage) |
| Unit tests (codemod) | 0 | 26 (new tooling) |
| Unit tests (all projects) | all pass | all pass |
