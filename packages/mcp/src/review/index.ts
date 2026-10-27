import type { ElementNode, RootNode } from '@vue/compiler-dom'
import type { Finding, ReviewContext, ReviewOptions, RuleId, Severity } from './types'

import { NodeTypes, parse } from '@vue/compiler-dom'
import { localComponents, reviewScript } from './script'
import { reviewStyle } from './style'
import { reviewTemplate } from './template'
import { SEVERITY_ORDER } from './types'

export type { Finding, Framework, ReviewOptions, RuleId, Severity } from './types'

type FileKind = 'vue' | 'script' | 'style' | 'template'

export function detectKind(code: string, filename?: string): FileKind {
  const extension = filename?.split('.').pop()?.toLowerCase()

  if (extension === 'vue')
    return 'vue'
  if (['ts', 'tsx', 'js', 'jsx', 'mjs', 'mts', 'cjs', 'cts'].includes(extension ?? ''))
    return 'script'
  if (['css', 'scss', 'pcss', 'postcss', 'sass', 'less'].includes(extension ?? ''))
    return 'style'
  if (extension === 'html')
    return 'template'

  if (/<template[\s>]|<script[\s>]/.test(code))
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
 * An optional comma separated list of rule ids restricts the ignore.
 */
type IgnoreScope = Set<string> | 'all'

function ignoredRules(lines: string[]): { file: IgnoreScope | undefined, byLine: Map<number, IgnoreScope> } {
  const byLine = new Map<number, IgnoreScope>()
  let file: IgnoreScope | undefined

  const parseRules = (rest: string): IgnoreScope => {
    const [directive] = rest.replace(/-->|\*\/|\*\}|\}/g, '').split(/\s--\s/)
    const rules = directive.split(/[\s,]+/).filter(rule => /^[a-z][a-z\d-]+$/.test(rule))

    return rules.length > 0 ? new Set(rules) : 'all'
  }

  for (const [index, line] of lines.entries()) {
    const fileMatch = /maz-ui-review-ignore-file\b(.*)/.exec(line)

    if (fileMatch) {
      file = parseRules(fileMatch[1])
      continue
    }

    const match = /maz-ui-review-ignore\b(.*)/.exec(line)

    if (!match)
      continue

    const isAlone = /^\s*(?:<!--|\/\/|\/\*|\{\/\*)\s*maz-ui-review-ignore/.test(line)

    byLine.set(isAlone ? index + 2 : index + 1, parseRules(match[1]))
  }

  return { file, byLine }
}

function isIgnored(rule: RuleId, scope: IgnoreScope | undefined): boolean {
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

  return { content: block.loc.source.slice(start - block.loc.start.offset, end - block.loc.start.offset), offset: start }
}

export function reviewCode(code: string, options: ReviewOptions): Finding[] {
  const starts = lineStarts(code)
  const findings: Finding[] = []
  const seen = new Set<string>()
  const context: ReviewContext = {
    ...options,
    report: (finding, offset) => {
      const position = locate(starts, offset)
      const key = `${finding.rule}:${position.line}:${position.column}:${finding.message}`

      if (seen.has(key))
        return

      seen.add(key)
      findings.push({ ...finding, ...position })
    },
  }

  const kind = detectKind(code, options.filename)

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

    context.localComponents = localComponents(blocks.filter(block => block.tag === 'script').map(block => blockContent(block).content).join('\n'))

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

  const { file, byLine } = ignoredRules(code.split('\n'))

  return findings
    .filter(finding => !isIgnored(finding.rule, file) && !isIgnored(finding.rule, byLine.get(finding.line)))
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
    .map(severity => `${counts[severity]} ${severity}${counts[severity] > 1 ? 's' : ''}`)
    .join(', ')

  return [
    `${label}: ${summary}`,
    ...findings.map(finding => `- L${finding.line}:${finding.column} ${finding.severity} [${finding.rule}] ${finding.message}${finding.suggestion ? `\n  -> ${finding.suggestion}` : ''}`),
  ].join('\n')
}
