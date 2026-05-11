import type { Rule } from 'eslint'

export interface NoArbitraryPxOptions {
  /**
   * Root font size, in pixels, used to convert `Npx` to `rem`/`em`.
   *
   * @default 16
   */
  baseFontSize?: number

  /**
   * Output unit for the autofix.
   *
   * @default 'rem'
   */
  unit?: 'rem' | 'em'
}

const DEFAULT_BASE_FONT_SIZE = 16
const DEFAULT_UNIT: 'rem' | 'em' = 'rem'

/**
 * Match a Tailwind arbitrary value bracket pair `[...]`. The content is
 * captured but literal whitespace is forbidden — Tailwind encodes spaces
 * as `_` inside arbitrary values, so any bracket with real spaces is
 * plain prose (e.g. `[up to 100px]`) and must be left alone.
 *
 * The `px` filter is applied separately on the captured content with
 * {@link HAS_PX_VALUE} to keep this regex linear (no backtracking — the
 * trailing `\]` is the unambiguous terminator).
 */
// eslint-disable-next-line sonarjs/slow-regex -- bounded by the literal `]` terminator; no backtracking
const ARBITRARY_BRACKET = /\[([^\s\]]+)\]/g

/** Quick presence check: does the bracket body contain a px value? */
const HAS_PX_VALUE = /\dpx/i

/**
 * Match a single px value (supports negatives like `-16px` from
 * `m-[-16px]`, decimals like `1.5px`, and bare decimals like `.5px`).
 *
 * The two alternatives are mutually exclusive — `\d+(?:\.\d+)?` requires
 * a leading digit, `\.\d+` requires a leading dot — so the regex stays
 * linear (no overlapping backtracking).
 */
// eslint-disable-next-line sonarjs/slow-regex -- alternatives are disjoint; no backtracking
const PX_VALUE = /(-?(?:\d+(?:\.\d+)?|\.\d+))px/gi

function convertPx(pxStr: string, base: number, unit: 'rem' | 'em'): string {
  const px = Number.parseFloat(pxStr)
  const value = px / base
  // Trim trailing zeros and avoid floating-point noise.
  const formatted = Number.parseFloat(value.toFixed(6)).toString()
  return `${formatted}${unit}`
}

interface Replacement {
  original: string
  fixed: string
  index: number
  length: number
}

function findReplacements(input: string, base: number, unit: 'rem' | 'em'): Replacement[] {
  const out: Replacement[] = []
  for (const match of input.matchAll(ARBITRARY_BRACKET)) {
    const full = match[0]
    const inner = match[1]
    if (!HAS_PX_VALUE.test(inner))
      continue
    const fixedInner = inner.replace(PX_VALUE, (_m, num: string) => convertPx(num, base, unit))
    // `matchAll` always populates `index` on the match objects it yields.
    out.push({
      original: full,
      fixed: `[${fixedInner}]`,
      index: match.index as number,
      length: full.length,
    })
  }
  return out
}

function applyReplacements(input: string, replacements: Replacement[]): string {
  let output = ''
  let cursor = 0
  for (const r of replacements) {
    output += input.slice(cursor, r.index) + r.fixed
    cursor = r.index + r.length
  }
  output += input.slice(cursor)
  return output
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow `px` units inside Tailwind arbitrary value classes; prefer `rem` (or `em`).',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          baseFontSize: { type: 'number', minimum: 1 },
          unit: { type: 'string', enum: ['rem', 'em'] },
        },
      },
    ],
    messages: {
      preferRelativeUnit: 'Tailwind class uses px; replace `{{original}}` with `{{fixed}}`.',
    },
  },
  create(context) {
    const options = (context.options[0] ?? {}) as NoArbitraryPxOptions
    const base = options.baseFontSize ?? DEFAULT_BASE_FONT_SIZE
    const unit = options.unit ?? DEFAULT_UNIT
    const { sourceCode } = context

    function check(node: Rule.Node | { type: string, range: [number, number] }): void {
      const raw = sourceCode.getText(node as Rule.Node)
      const replacements = findReplacements(raw, base, unit)
      if (replacements.length === 0)
        return
      const fixedRaw = applyReplacements(raw, replacements)
      for (const r of replacements) {
        context.report({
          node: node as Rule.Node,
          messageId: 'preferRelativeUnit',
          data: { original: r.original, fixed: r.fixed },
          fix: fixer => fixer.replaceText(node as Rule.Node, fixedRaw),
        })
      }
    }

    const jsVisitor: Rule.RuleListener = {
      Literal(node) {
        if (typeof node.value !== 'string')
          return
        check(node)
      },
      TemplateElement(node) {
        check(node)
      },
    }

    // Vue SFC: the template body is parsed separately by `vue-eslint-parser`
    // and walked via `defineTemplateBodyVisitor` instead of the standard
    // listener map. Falls through to the plain JS visitor in non-Vue files.
    const parserServices = context.sourceCode.parserServices as {
      defineTemplateBodyVisitor?: (
        templateVisitor: Record<string, (node: any) => void>,
        scriptVisitor?: Rule.RuleListener,
      ) => Rule.RuleListener
    }

    if (parserServices.defineTemplateBodyVisitor) {
      return parserServices.defineTemplateBodyVisitor(
        { VLiteral: (node: any) => check(node) },
        jsVisitor,
      )
    }

    return jsVisitor
  },
}

export default rule
