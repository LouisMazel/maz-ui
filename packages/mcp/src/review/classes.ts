import type { ReviewContext } from './types'

const COLOR_UTILITIES = 'bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|outline|fill|stroke|divide|from|via|to|decoration|placeholder|accent|caret|shadow|inset-shadow|inset-ring|text-shadow'
const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'

const PALETTE_CLASS = new RegExp(`^(?:[\\w-]+:)*!?(${COLOR_UTILITIES})-(${PALETTE})-(\\d{2,3})(?:/\\d+)?!?$`)
const BLACK_WHITE_CLASS = new RegExp(`^(?:[\\w-]+:)*!?(${COLOR_UTILITIES})-(white|black|background)(?:/\\d+)?!?$`)
const ARBITRARY_COLOR_CLASS = /^(?:[\w-]+:)*!?[\w-]+-\[(?:#[\da-f]{3,8}|(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\([^\]]*\))\]/i
const ARBITRARY_FONT_SIZE_CLASS = /^(?:[\w-]+:)*!?text-\[(?:length:)?\d*\.?\d+(?:px|rem|em)\]!?$/
const TYPE_SCALE_CLASS = /^(?:[\w-]+:)*!?text-(?:display|title-\d|body(?:-sm|-lg)?|label|caption|overline|code)$/

/** Combinations of Tailwind classes that a level of the type scale replaces */
const TYPE_SCALE_COMBINATIONS: Array<{ level: string, classes: RegExp[] }> = [
  {
    level: 'text-overline',
    classes: [/^text-xs$/, /^uppercase$/, /^tracking-(?:wide|wider|widest)$/],
  },
  {
    level: 'text-caption',
    classes: [/^text-xs$/, /^text-muted$/],
  },
  {
    level: 'text-title-1',
    classes: [/^text-(?:3xl|4xl)$/, /^font-(?:semibold|bold|extrabold)$/],
  },
  {
    level: 'text-title-2',
    classes: [/^text-2xl$/, /^font-(?:semibold|bold)$/],
  },
  {
    level: 'text-title-3',
    classes: [/^text-xl$/, /^font-(?:semibold|bold)$/],
  },
  {
    level: 'text-title-4',
    classes: [/^text-lg$/, /^font-(?:semibold|bold)$/],
  },
  {
    level: 'text-label',
    classes: [/^text-sm$/, /^font-medium$/],
  },
]

function hasTypeScale(context: ReviewContext): boolean {
  return !!context.knowledge.tailwind?.utilities.some(utility => utility.name === 'text-caption')
}

/** Suggests the level of the type scale for an ad hoc combination (`text-xs text-muted` -> `text-caption`) */
function checkTypeScale(value: string, offset: number, context: ReviewContext): void {
  const tokens = [
    ...value.matchAll(/\S+/g),
  ]

  if (!hasTypeScale(context) || tokens.some(([token]) => TYPE_SCALE_CLASS.test(token)))
    return

  for (const { level, classes } of TYPE_SCALE_COMBINATIONS) {
    const matched = classes.map(pattern => tokens.find(([token]) => pattern.test(token)))

    if (matched.every(Boolean)) {
      context.report({
        rule: 'type-scale',
        severity: 'info',
        message: `\`${matched.map(match => match![0]).join(' ')}\` is a level of the maz-ui type scale.`,
        suggestion: `Use \`${level}\`: it sets the size, weight, line height and letter spacing of the theme together. See \`get_theme_tokens({ topics: ["type-scale"] })\`.`,
      }, offset + (matched[0]!.index ?? 0))
      return
    }
  }
}

const TAILWIND_V3_CLASS = /^(?:[\w-]+:)*!?(?:(?:bg|text|border|divide|ring|placeholder)-opacity-\d+|flex-(?:shrink|grow)(?:-\d+)?|overflow-ellipsis|decoration-(?:slice|clone))$/

/** Theme color advised for each default palette hue */
const HUE_TO_THEME: Record<string, string> = {
  slate: 'surface / foreground / muted / divider',
  gray: 'surface / foreground / muted / divider',
  zinc: 'surface / foreground / muted / divider',
  neutral: 'surface / foreground / muted / divider',
  stone: 'surface / foreground / muted / divider',
  red: 'destructive',
  rose: 'destructive',
  orange: 'warning',
  amber: 'warning',
  yellow: 'warning',
  green: 'success',
  emerald: 'success',
  lime: 'success',
  teal: 'success / info',
  cyan: 'info',
  sky: 'info',
  blue: 'primary / info',
  indigo: 'primary',
  violet: 'secondary / accent',
  purple: 'secondary / accent',
  fuchsia: 'accent',
  pink: 'accent',
}

function neutralSuggestion(utility: string): string {
  if (utility === 'text')
    return '`text-foreground` (body text) or `text-muted` (secondary text)'
  if (utility.startsWith('border') || utility === 'divide')
    return `\`${utility}-divider\``
  if (utility === 'bg')
    return '`bg-surface`, `bg-surface-{50..950}` or `bg-container`'

  return `\`${utility}-foreground\`, \`${utility}-muted\` or \`${utility}-divider\``
}

function themeSuggestion(utility: string, hue: string, step: string): string {
  const neutral = [
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
  ].includes(hue)

  if (neutral)
    return neutralSuggestion(utility)

  const colors = HUE_TO_THEME[hue].split(' / ')
  const scale = step === '500'
    ? ''
    : `-${step}`

  return colors.map(color => `\`${utility}-${color}${scale}\``).join(' or ')
}

const THEME_BACKGROUND = /^(?:[\w-]+:)*!?bg-(primary|secondary|accent|info|success|warning|destructive|contrast)(?:-\d{2,3})?(?:\/\d+)?!?$/
/** Backgrounds that keep the same color in light and dark mode (overlay, black, media, gradients...) */
const FIXED_BACKGROUND = /^(?:[\w-]+:)*!?(?:bg-(?:overlay|black|white|transparent|linear|radial|conic|gradient|none)|bg-\[|bg-\(|from-|via-|to-)/

export interface Background { kind: 'theme' | 'fixed', color?: string }

/** The background set in the same class list, which decides the right text color */
export function backgroundOf(classList: string): Background | undefined {
  for (const token of classList.split(/\s+/)) {
    const theme = THEME_BACKGROUND.exec(token)

    if (theme)
      return { kind: 'theme', color: theme[1] }
    if (FIXED_BACKGROUND.test(token))
      return { kind: 'fixed' }
  }

  return undefined
}

function reportBlackWhite(token: string, utility: string, color: string, background: Background | undefined, position: number, context: ReviewContext): void {
  if (color === 'background') {
    context.report({
      rule: 'theme-colors',
      severity: 'warning',
      message: `\`${token}\` is not a maz-ui color: the page color is named \`surface\` (the \`background\` of shadcn).`,
      suggestion: `Use \`${token.replace('-background', '-surface')}\`.`,
    }, position)
    return
  }

  if (background?.kind === 'fixed' && utility !== 'bg')
    return

  if (background?.color && color === 'white' && utility !== 'bg') {
    context.report({
      rule: 'theme-colors',
      severity: 'warning',
      message: `\`${token}\` on \`bg-${background.color}\`: the theme gives the readable color of each background.`,
      suggestion: `Use \`${utility}-${background.color}-foreground\`.`,
    }, position)
    return
  }

  context.report({
    rule: 'theme-colors',
    severity: 'warning',
    message: `\`${token}\` is a fixed color that does not follow the theme nor dark mode.`,
    suggestion: color === 'white'
      ? `Use \`${utility}-surface\` (backgrounds) or the \`-foreground\` of the color behind (\`text-primary-foreground\`). Over media (image, video) or a fixed dark background, keep it with \`<!-- maz-ui-review-ignore theme-colors -- over the video -->\` above the element.`
      : `Use \`${utility}-foreground\` (text) or \`${utility}-contrast\`.`,
  }, position)
}

/**
 * Checks a list of Tailwind classes. `offset` is the position of the first class in the reviewed source,
 * `inherited` the background set by a parent element
 */
export function checkClassList(value: string, offset: number, context: ReviewContext, inherited?: Background): void {
  const background = backgroundOf(value) ?? inherited

  for (const match of value.matchAll(/\S+/g)) {
    const token = match[0]
    const position = offset + (match.index ?? 0)

    if (/^(?:[\w-]+:)*maz:/.test(token) || token.startsWith('maz:')) {
      context.report({
        rule: 'internal-prefix',
        severity: 'error',
        message: `\`${token}\` uses the \`maz:\` prefix, which is internal to the maz-ui library and its docs: it does not exist in your project.`,
        suggestion: `Use \`${token.replace(/maz:/g, '')}\`.`,
      }, position)
      continue
    }

    const palette = PALETTE_CLASS.exec(token)

    if (palette) {
      const [, utility, hue, step] = palette

      context.report({
        rule: 'theme-colors',
        severity: 'warning',
        message: `\`${token}\` uses the default Tailwind palette: it ignores the maz-ui theme (presets, dark mode).`,
        suggestion: `Use a theme color: ${themeSuggestion(utility, hue, step)}. See \`get_theme_tokens({ topics: ["colors"] })\`.`,
      }, position)
      continue
    }

    const blackWhite = BLACK_WHITE_CLASS.exec(token)

    if (blackWhite) {
      reportBlackWhite(token, blackWhite[1], blackWhite[2], background, position, context)
      continue
    }

    if (ARBITRARY_COLOR_CLASS.test(token)) {
      context.report({
        rule: 'hardcoded-color',
        severity: 'warning',
        message: `\`${token}\` hard-codes a color.`,
        suggestion: 'Use a theme color class (`bg-primary`, `text-muted`...) or `var(--maz-*)`. For a brand color missing from the theme, define it once in your Tailwind `@theme` or in the preset.',
      }, position)
      continue
    }

    if (ARBITRARY_FONT_SIZE_CLASS.test(token)) {
      context.report({
        rule: 'arbitrary-font-size',
        severity: 'warning',
        message: `\`${token}\` hard-codes a font size outside of the scale.`,
        suggestion: hasTypeScale(context)
          ? 'Use a level of the type scale (`text-title-2`, `text-body`, `text-body-sm`, `text-caption`...) or a Tailwind size (`text-sm`, `text-lg`...). See `get_theme_tokens({ topics: ["type-scale"] })`.'
          : 'Use a Tailwind size (`text-xs` to `text-9xl`), or add a `--text-*` token to your Tailwind `@theme`.',
      }, position)
      continue
    }

    if (TAILWIND_V3_CLASS.test(token)) {
      context.report({
        rule: 'tailwind-v3',
        severity: 'warning',
        message: `\`${token}\` is a Tailwind v3 utility removed in Tailwind v4.`,
        suggestion: token.includes('opacity')
          ? 'Use the opacity modifier: `bg-primary/50`.'
          : 'Use `shrink-0`, `grow`, `text-ellipsis` or `box-decoration-slice`.',
      }, position)
    }
  }

  checkTypeScale(value, offset, context)
}

/** Finds class lists in string literals of an expression (`:class`, `cn(...)`, computed classes) */
export function checkClassStrings(code: string, offset: number, context: ReviewContext): void {
  for (const match of code.matchAll(/(['"`])((?:(?!\1)[^\\\n]|\\.)*)\1/g)) {
    const content = match[2]

    if (/(?:^|\s)(?:[\w-]+:)*(?:maz:|(?:bg|text|border|ring|fill|stroke|from|to|via|outline|divide)-)/.test(content))
      checkClassList(content, offset + (match.index ?? 0) + 1, context)
  }
}
