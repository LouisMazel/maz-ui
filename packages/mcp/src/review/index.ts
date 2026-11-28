import type { ElementNode, RootNode } from '@vue/compiler-dom'
import type { Finding, ReviewContext, ReviewOptions, RuleId, Severity } from './types.ts'

import { NodeTypes, parse } from '@vue/compiler-dom'
import { mazIconNames } from './icons.ts'
import { checkReveal } from './reveal.ts'
import { localComponents, rawIcons, reviewScript } from './script.ts'
import { reviewStyle } from './style.ts'
import { reviewTemplate } from './template.ts'
import { SEVERITY_ORDER } from './types.ts'

export type { Finding, Framework, IconNames, ReviewOptions, RuleId, Severity } from './types.ts'

type FileKind = 'vue' | 'script' | 'style' | 'template'

export function detectKind(code: string, filename?: string): FileKind {
  const extension = filename?.split('.').pop()?.toLowerCase()

  if (extension === 'vue')
    return 'vue'
  if ([
    'ts',
    'tsx',
    'js',
    'jsx',
    'mjs',
    'mts',
    'cjs',
    'cts',
  ].includes(extension ?? '')) {
    return 'script'
  }
  if ([
    'css',
    'scss',
    'pcss',
    'postcss',
    'sass',
    'less',
  ].includes(extension ?? '')) {
    return 'style'
  }
  if (extension === 'html')
    return 'template'

  // the blocks of a SFC start their line, a nested `<template #slot>` belongs to a template
  if (/^<(?:template|script|style)[\s>]/m.test(code))
    return 'vue'
  if (/^\s*</.test(code))
    return 'template'
  if (/^\s*(?:@import|@theme|[.#:@\w-][^{;]*\{)/.test(code) && !/(?:^|[^@\w])(?:import|const|function|export)\s/.test(code))
    return 'style'

  return 'script'
}

function lineStarts(code: string): number[] {
  const starts = [0]

  for (let index = 0; index < code.length; index++) {
    if (code[index] === '\n')
      starts.push(index + 1)
  }

  return starts
}

function locate(starts: number[], offset: number): { line: number, column: number } {
  let low = 0
  let high = starts.length - 1

  while (low < high) {
    const middle = Math.ceil((low + high) / 2)

    if (starts[middle] <= offset)
      low = middle
    else
      high = middle - 1
  }

  return { line: low + 1, column: offset - starts[low] + 1 }
}

/**
 * Lines disabled with `maz-ui-review-ignore` comments:
 * - `maz-ui-review-ignore-file`: the whole file
 * - `maz-ui-review-ignore` (alone on its line): the next line
 * - `maz-ui-review-ignore` at the end of a line: that line
 * An optional comma separated list of rule ids restricts the ignore, the reason after ` -- ` is required.
 */
type IgnoreScope = Set<string> | 'all'

/** The rules of a code that does not work (an unknown component, prop or import...): they are fixed, never ignored */
export const UNIGNORABLE_RULES: ReadonlySet<RuleId> = new Set<RuleId>([
  'unknown-component',
  'unknown-prop',
  'invalid-prop-value',
  'unknown-model',
  'unknown-event',
  'unknown-slot',
  'unknown-slot-binding',
  'missing-required-prop',
  'raw-icon-tag',
  'root-import',
  'internal-import',
  'missing-reference',
  'parse-error',
])

interface IgnoreComments {
  file: IgnoreScope | undefined
  byLine: Map<number, IgnoreScope>
  /** The comments that are not applied: no reason, or an unignorable rule */
  invalid: Omit<Finding, 'severity' | 'rule'>[]
}

function ignoredRules(lines: string[]): IgnoreComments {
  const byLine = new Map<number, IgnoreScope>()
  const invalid: IgnoreComments['invalid'] = []
  let file: IgnoreScope | undefined

  const parse = (rest: string, line: number, column: number): IgnoreScope | undefined => {
    const [directive, ...reason] = rest.replace(/-->|\*\/|\*\}|\}/g, '').split(/\s--(?:\s|$)/)
    const rules = directive.split(/[\s,]+/).filter(rule => /^[a-z][a-z\d-]+$/.test(rule))
    const unignorable = rules.filter(rule => UNIGNORABLE_RULES.has(rule as RuleId))

    if (unignorable.length > 0) {
      invalid.push({
        line,
        column,
        message: `${unignorable.map(rule => `\`${rule}\``).join(', ')} cannot be ignored: the code does not work as written.`,
        suggestion: 'Fix the code with the documented API (get_component_api, search_docs), then remove the comment.',
      })
    }

    if (reason.join(' -- ').trim() === '') {
      invalid.push({
        line,
        column,
        message: '`maz-ui-review-ignore` without a reason is not applied.',
        suggestion: 'Fix the finding, or give the reason after two dashes when it is intended: `maz-ui-review-ignore <rule> -- <reason>`.',
      })

      return undefined
    }

    const ignorable = rules.filter(rule => !UNIGNORABLE_RULES.has(rule as RuleId))

    if (rules.length === 0)
      return 'all'

    return ignorable.length > 0
      ? new Set(ignorable)
      : undefined
  }

  for (const [index, line] of lines.entries()) {
    const match = /(?:<!--|\/\/|\/\*|\{\/\*)\s*maz-ui-review-ignore(-file)?\b(.*)/.exec(line)

    if (!match)
      continue

    const scope = parse(match[2], index + 1, line.indexOf('maz-ui-review-ignore', match.index) + 1)

    if (match[1]) {
      file = scope
      continue
    }

    if (!scope)
      continue

    const isAlone = /^\s*(?:<!--|\/\/|\/\*|\{\/\*)\s*maz-ui-review-ignore/.test(line)

    byLine.set(isAlone
      ? index + 2
      : index + 1, scope)
  }

  return { file, byLine, invalid }
}

function isIgnored(rule: RuleId, scope: IgnoreScope | undefined): boolean {
  if (UNIGNORABLE_RULES.has(rule))
    return false

  return scope === 'all' || (scope instanceof Set && scope.has(rule))
}

function blocksOf(root: RootNode): ElementNode[] {
  return root.children.filter((child): child is ElementNode => child.type === NodeTypes.ELEMENT)
}

function blockContent(block: ElementNode): { content: string, offset: number } {
  const first = block.children[0]
  const last = block.children.at(-1)

  if (!first || !last)
    return { content: '', offset: block.loc.end.offset }

  const start = first.loc.start.offset
  const end = last.loc.end.offset

  return {
    content: block.loc.source.slice(start - block.loc.start.offset, end - block.loc.start.offset),
    offset: start,
  }
}

/** A syntax error of `@vue/compiler-dom`, with its position */
function isSyntaxError(error: unknown): error is SyntaxError & { loc?: { start: { offset: number } } } {
  return error instanceof SyntaxError
}

function reviewByKind(code: string, filename: string | undefined, context: ReviewContext): void {
  const kind = detectKind(code, filename)

  if (kind === 'script') {
    reviewScript(code, 0, context)
  }
  else if (kind === 'style') {
    reviewStyle(code, 0, context)
  }
  else if (kind === 'template') {
    reviewTemplate(parse(code), code, context)
  }
  else {
    const root = parse(code, { parseMode: 'sfc' })
    const blocks = blocksOf(root)

    const scripts = blocks.filter(block => block.tag === 'script').map(block => blockContent(block).content).join('\n')

    context.localComponents = localComponents(scripts)
    context.rawIcons = rawIcons(scripts)

    for (const block of blocks) {
      if (block.tag === 'template') {
        reviewTemplate(block, code, context)
      }
      else if (block.tag === 'script') {
        const { content, offset } = blockContent(block)
        reviewScript(content, offset, context)
      }
      else if (block.tag === 'style') {
        const { content, offset } = blockContent(block)
        reviewStyle(content, offset, context, { sfc: true })
      }
    }
  }
}

export function reviewCode(code: string, options: ReviewOptions): Finding[] {
  const starts = lineStarts(code)
  const findings: Finding[] = []
  const seen = new Set<string>()
  const context: ReviewContext = {
    ...options,
    iconNames: options.icons?.names ?? mazIconNames(options.knowledge),
    report: (finding, offset) => {
      const position = locate(starts, offset)
      const key = `${finding.rule}:${position.line}:${position.column}:${finding.message}`

      if (seen.has(key))
        return

      seen.add(key)
      findings.push({
        ...finding,
        ...position,
      })
    },
  }

  try {
    reviewByKind(code, options.filename, context)

    if (detectKind(code, options.filename) !== 'style')
      checkReveal(code, context)
  }
  catch (error) {
    if (!isSyntaxError(error))
      throw error

    context.report({
      rule: 'parse-error',
      severity: 'error',
      message: `The file cannot be parsed, it is not reviewed: ${error.message.split('\n')[0]}`,
      suggestion: 'Fix the syntax (an unclosed tag, a quote in an attribute name...), then review it again.',
    }, error.loc?.start.offset ?? 0)
  }

  const { file, byLine, invalid } = ignoredRules(code.split('\n'))

  return [
    ...findings.filter(finding => !isIgnored(finding.rule, file) && !isIgnored(finding.rule, byLine.get(finding.line))),
    ...invalid.map(finding => ({ ...finding, rule: 'invalid-ignore' as const, severity: 'error' as const })),
  ]
    .sort((a, b) => a.line - b.line || a.column - b.column || SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
}

export function countBySeverity(findings: Finding[]): Record<Severity, number> {
  return {
    error: findings.filter(finding => finding.severity === 'error').length,
    warning: findings.filter(finding => finding.severity === 'warning').length,
    info: findings.filter(finding => finding.severity === 'info').length,
  }
}

export function filterBySeverity(findings: Finding[], minimum: Severity): Finding[] {
  return findings.filter(finding => SEVERITY_ORDER[finding.severity] <= SEVERITY_ORDER[minimum])
}

export function formatFindings(findings: Finding[], label: string): string {
  const counts = countBySeverity(findings)

  if (findings.length === 0)
    return `${label}: no issue found.`

  const summary = (['error', 'warning', 'info'] as const)
    .filter(severity => counts[severity] > 0)
    .map(severity => `${counts[severity]} ${severity}${counts[severity] > 1
      ? 's'
      : ''}`)
    .join(', ')

  return [
    `${label}: ${summary}`,
    ...findings.map(finding => `- L${finding.line}:${finding.column} ${finding.severity} [${finding.rule}] ${finding.message}${finding.suggestion
      ? `\n  -> ${finding.suggestion}`
      : ''}`),
  ].join('\n')
}
