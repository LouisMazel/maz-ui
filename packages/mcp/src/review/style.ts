import type { ReviewContext } from './types.ts'

import { checkClassList } from './classes.ts'

const COLOR_LITERAL = /#[\da-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/i
const COLOR_PROPERTIES = /^(?:color|background(?:-color)?|border(?:-[a-z]+)*-color|border(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?|outline(?:-color)?|fill|stroke|box-shadow|text-shadow|caret-color|accent-color|text-decoration-color|column-rule-color)$/

function blankComments(css: string): string {
  return css.replaceAll(/\/\*[\s\S]*?\*\//g, match => match.replaceAll(/[^\n]/g, ' '))
}

const BLACK_OR_WHITE = /^#(?:f{3}|f{6}|f{8}|0{3}|0{6}|0{8})$/i

/** Ranges of the `@keyframes` blocks, where colors often animate over media */
function keyframesRanges(css: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = []

  for (const match of css.matchAll(/@keyframes[^{]*\{/g)) {
    const start = match.index ?? 0
    let depth = 0

    for (let index = start + match[0].length - 1; index < css.length; index++) {
      if (css[index] === '{') {
        depth++
      }
      else if (css[index] === '}' && --depth === 0) {
        ranges.push([start, index])
        break
      }
    }
  }

  return ranges
}

/** Checks `property: value` declarations (style attribute or CSS rules) for hard-coded colors */
export function checkStyleDeclarations(css: string, offset: number, context: ReviewContext): void {
  const keyframes = keyframesRanges(css)

  for (const match of css.matchAll(/(^|[;{\s])([a-z-]+)\s*:\s*([^;{}]+)/g)) {
    const [, prefix, property, value] = match

    if (property.startsWith('--') || !COLOR_PROPERTIES.test(property) || /var\(--/.test(value))
      continue

    const color = COLOR_LITERAL.exec(value)

    if (!color)
      continue

    const index = match.index ?? 0
    const inKeyframes = keyframes.some(([start, end]) => index > start && index < end)
    const blackOrWhite = BLACK_OR_WHITE.test(color[0])

    context.report({
      rule: 'hardcoded-color',
      severity: inKeyframes || blackOrWhite
        ? 'info'
        : 'warning',
      message: `\`${property}\` uses a hard-coded color (\`${color[0].replace('(', '')}\`): it ignores the theme and dark mode.`,
      suggestion: `Use a theme variable: \`var(--maz-primary)\`, \`var(--maz-surface)\`, \`var(--maz-foreground)\`, \`var(--maz-muted)\`, \`var(--maz-divider)\`... (\`color-mix(in oklab, var(--maz-primary) 20%, transparent)\` for tints).${blackOrWhite ? ' Keep it if the element is over media (image, video) or a fixed dark background.' : ''}`,
    }, offset + index + prefix.length)
  }
}

const MOTION_PROPERTIES = /^(?:transition|transition-duration|animation|animation-duration)$/
const TIME_LITERAL = /(?<![\w.-])\d*\.?\d+m?s\b/
const LAYOUT_PROPERTIES = /\b(?:width|height|inline-size|block-size|top|right|bottom|left|inset|margin(?:-[a-z]+)?|padding(?:-[a-z]+)?)\b/

/** Checks the transitions and animations: durations of the theme, no `all`, no layout properties */
export function checkMotionDeclarations(css: string, offset: number, context: ReviewContext): void {
  for (const match of css.matchAll(/(^|[;{\s])([a-z-]+)\s*:\s*([^;{}]+)/g)) {
    const [, prefix, property, value] = match
    const position = offset + (match.index ?? 0) + prefix.length

    if (property === 'transition-property' || property === 'transition') {
      if (/(?:^|[\s,])all\b/.test(value)) {
        context.report({
          rule: 'transition-all',
          severity: 'info',
          message: `\`${property}: ${value.trim()}\` animates every property: a layout change (size, position) is animated too and the browser watches all of them.`,
          suggestion: 'List the properties that move: `transition: transform var(--maz-motion-normal) var(--maz-easing-out), opacity var(--maz-motion-normal)`.',
        }, position)
      }
      else if (LAYOUT_PROPERTIES.test(value.replaceAll(/var\([^)]*\)/g, ''))) {
        context.report({
          rule: 'layout-transition',
          severity: 'info',
          message: `\`${property}: ${value.trim()}\` animates a layout property: the page is laid out again on every frame and the content around jumps.`,
          suggestion: 'Animate `transform` (`translate`, `scale`) and `opacity` instead; for a height, `grid-template-rows: 0fr` to `1fr` (or `MazExpandAnimation`).',
        }, position)
      }
    }

    if (MOTION_PROPERTIES.test(property) && TIME_LITERAL.test(value) && !/var\(--maz-motion/.test(value)) {
      context.report({
        rule: 'hardcoded-motion',
        severity: 'info',
        message: `\`${property}\` hard-codes a duration: it ignores the rhythm of the preset and the reduced motion of the user.`,
        suggestion: 'Use the motion tokens: `var(--maz-motion-fast)`, `var(--maz-motion-normal)`, `var(--maz-motion-slow)` and `var(--maz-easing-out)`, `var(--maz-easing-spring)`. Times `var(--maz-motion-scale)` to follow the reduced motion.',
      }, position)
    }
  }
}

export function reviewStyle(source: string, offset: number, context: ReviewContext, { sfc = false } = {}): void {
  const css = blankComments(source)
  const applies = [
    ...css.matchAll(/@apply\s+([^;]+);/g),
  ]

  for (const apply of applies) {
    checkClassList(apply[1], offset + (apply.index ?? 0) + apply[0].indexOf(apply[1]), context)
  }

  if (sfc && applies.length > 0 && !/@reference\s/.test(css)) {
    context.report({
      rule: 'missing-reference',
      severity: 'error',
      message: '`@apply` in a Vue SFC `<style>` block needs a `@reference` to your Tailwind entry with Tailwind v4.',
      suggestion: 'Start the block with `@reference "<relative path to your Tailwind entry css>";`.',
    }, offset + (applies[0].index ?? 0))
  }

  const withoutThemeBlocks = css.replaceAll(/@theme[^{]*\{[^}]*\}/g, match => match.replaceAll(/[^\n]/g, ' '))

  checkStyleDeclarations(withoutThemeBlocks, offset, context)
  checkMotionDeclarations(withoutThemeBlocks, offset, context)
}
