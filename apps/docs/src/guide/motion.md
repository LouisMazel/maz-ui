---
title: Motion
description: The motion of Maz-UI - the tokens of the theme, the reduced motion, and the components, composables and utilities to animate your own UI the same way.
head:
  - - meta
    - name: keywords
      content: animation, motion, transition, reduced motion, prefers-reduced-motion, easing, spring, duration, motion tokens, maz-ui
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## The motion language

Maz-UI moves with a few motifs, the same everywhere:

- **Grow from the origin**: an overlay grows out of what opened it, and goes back into it ([useOriginTransition](./../composables/use-origin-transition.md)).
- **Rolling text**: only the characters that change roll ([MazRollingText](./../components/maz-rolling-text.md)).
- **Sliding indicator**: a pill slides to the active item ([useSlidingIndicator](./../composables/use-sliding-indicator.md)).
- **Drawn icons**: a check draws itself ([MazDrawnIcon](./../components/maz-drawn-icon.md)), an icon morphs into another ([MazMorphIcon](./../components/maz-morph-icon.md)).
- **Moves of a list**: items glide to their new place (`<TransitionGroup name="maz-list">`, see [Vue transitions](./tailwind.md#vue-transitions)).
- **Reveal on scroll**: a block, its lines or its words appear when they enter the screen ([vReveal](./../directives/reveal.md)).
- **Press feedback**: an element sinks a little while pressed (the [`press` utility](./tailwind.md#focus-and-press)).

Motion stays short (100 to 250 ms), exits are faster than entrances, and only `transform` and `opacity` move: no layout shift.

## Tokens

The durations and easings come from the preset, so every component follows its rhythm:

| Token | Use |
| --- | --- |
| `--maz-motion-instant` | press, hover, toggle |
| `--maz-motion-fast` | tooltip, menu, switch |
| `--maz-motion-normal` | popover, dialog, drawer |
| `--maz-motion-slow` | moves of a layout, bottom sheet, toast |
| `--maz-motion-slower` | large transitions and reveals |
| `--maz-easing-out`, `--maz-easing-in`, `--maz-easing-in-out` | entrances, exits, moves on the screen |
| `--maz-easing-spring`, `--maz-easing-bounce` | springs, without and with a small bounce |
| `--maz-motion-scale` | multiplies every duration (`0.5` is twice faster) |

Use them in your CSS and with Tailwind:

```css
.panel {
  transition:
    transform calc(var(--maz-motion-normal) * var(--maz-motion-scale)) var(--maz-easing-out),
    opacity calc(var(--maz-motion-normal) * var(--maz-motion-scale));
}
```

```html
<div class="transition-transform duration-(--duration-normal) ease-spring">...</div>
```

The Tailwind durations already include `--maz-motion-scale`. Change the values in your preset: see [Foundation tokens](./../ecosystem/themes.md#foundation).

## Reduced motion

When the user asks for reduced motion (`prefers-reduced-motion: reduce`), the components of Maz-UI stop their animations. The animations of your app are not touched.

Force it either way with the `motion` option:

```ts
app.use(MazUi, {
  theme: { preset: mazUi },
  // 'auto' (default), 'reduced' or 'full'
  motion: 'reduced',
})
```

With Nuxt: `mazUi: { motion: 'reduced' }`. `motion: { scope: 'page' }` also stops the animations of the whole page under reduced motion.

In your JavaScript animations, follow the same rule with `shouldReduceMotion`:

```ts
import { useReducedMotion } from 'maz-ui/composables/useReducedMotion'

const { shouldReduceMotion } = useReducedMotion()

element.animate(keyframes, { duration: shouldReduceMotion.value ? 0 : 200 })
```

## Animate your own components

Reuse the building blocks of Maz-UI instead of writing the animations by hand:

| Need | Use |
| --- | --- |
| A panel that opens from its button | [useOriginTransition](./../composables/use-origin-transition.md) |
| A number or a text that changes | [MazRollingText](./../components/maz-rolling-text.md) |
| An active item in a group | [useSlidingIndicator](./../composables/use-sliding-indicator.md) and [useRovingFocus](./../composables/use-roving-focus.md) for the keyboard |
| A check or a status icon | [MazDrawnIcon](./../components/maz-drawn-icon.md) |
| A button with two states | [MazMorphIcon](./../components/maz-morph-icon.md) |
| A block that appears while scrolling | [vReveal](./../directives/reveal.md), [MazReveal](./../components/maz-reveal.md), and [useReveal](./../directives/reveal.md#html-you-do-not-control) for markdown or a CMS |
| A list that changes | `<TransitionGroup name="maz-list">` |
| A height that opens | [MazExpandAnimation](./../components/maz-expand-animation.md) |
| A focus ring, a press, a border that draws itself | the [`focus-ring`, `press` and `border-draw` utilities](./tailwind.md#focus-and-press) |

`review_code` of the [MCP server](./../ecosystem/mcp.md) flags the hard-coded durations, `transition-all` and the transitions of the layout.
