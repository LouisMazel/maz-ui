import type { ReviewContext } from './types'

import { checkClassList } from './classes'

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
      severity: inKeyframes || blackOrWhite ? 'info' : 'warning',
      message: `\`${property}\` uses a hard-coded color (\`${color[0].replace('(', '')}\`): it ignores the theme and dark mode.`,
      suggestion: `Use a theme variable: \`var(--maz-primary)\`, \`var(--maz-surface)\`, \`var(--maz-foreground)\`, \`var(--maz-muted)\`, \`var(--maz-divider)\`... (\`color-mix(in oklab, var(--maz-primary) 20%, transparent)\` for tints).${blackOrWhite ? ' Keep it if the element is over media (image, video) or a fixed dark background.' : ''}`,
    }, offset + index + prefix.length)
  }
}

export function reviewStyle(source: string, offset: number, context: ReviewContext, { sfc = false } = {}): void {
  const css = blankComments(source)
  const applies = [...css.matchAll(/@apply\s+([^;]+);/g)]

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
}
