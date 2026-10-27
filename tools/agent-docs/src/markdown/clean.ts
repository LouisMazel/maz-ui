/**
 * Turns a VitePress page (live Vue demos, containers, includes, mustaches,
 * site-relative links) into plain, agent-ready markdown.
 *
 * Only fenced code blocks, prose, tables and headings survive: live demo
 * markup is dropped (its source is always duplicated in a code block).
 */

export interface CleanMarkdownContext {
  frontmatter: { title?: string, description?: string }
  /** Returns the raw content of an included file, or the replacement markdown for a generated API include */
  resolveInclude: (includePath: string) => string | undefined
  /** Returns the new href of a link, or `undefined` to keep only the link text */
  resolveLink: (href: string) => string | undefined
  /** Title of the page targeted by an internal href, used to keep the links of dropped HTML blocks */
  linkTitle?: (href: string) => string | undefined
}

const FENCE_REGEX = /^(\s*)(`{3,}|~{3,})(.*)$/
const INCLUDE_REGEX = /^\s*<!--\s*@include:\s*(\S+?)\s*-->\s*$/
const CONTAINER_OPEN_REGEX = /^\s*:::\s*([\w-]+)\s*(.*)$/
const CONTAINER_CLOSE_REGEX = /^\s*:::\s*$/
const HTML_BLOCK_START_REGEX = /^\s*<[a-z][\w-]*(?=[\s>/]|$)/i
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])
const MAX_INCLUDE_DEPTH = 5

const CONTAINER_LABELS: Record<string, string> = {
  tip: 'Tip',
  info: 'Note',
  warning: 'Warning',
  danger: 'Danger',
  details: 'Details',
}

/**
 * Removes the internal `maz:` Tailwind prefix used by the library and its
 * documentation site. Consumer projects import the maz-ui theme without
 * prefix, so examples must use plain utilities (`flex`, `bg-primary`).
 */
export function stripInternalPrefix(code: string): string {
  return code.replaceAll(/(^|[\s"'`{(,[=])maz:(?=[\w!@[\-*/.(])/g, '$1')
}

export function resolveIncludes(source: string, context: CleanMarkdownContext, depth = 0): string {
  return source
    .split('\n')
    .map((line) => {
      const match = INCLUDE_REGEX.exec(line)

      if (!match)
        return line

      const included = context.resolveInclude(match[1])

      if (included === undefined)
        return ''

      return depth >= MAX_INCLUDE_DEPTH ? included : resolveIncludes(included, context, depth + 1)
    })
    .join('\n')
}

function replaceMustaches(line: string, context: CleanMarkdownContext): string {
  return line.replaceAll(/\{\{\s*([^}]*?)\s*\}\}/g, (_, expression: string) => {
    if (expression === '$frontmatter.title')
      return context.frontmatter.title ?? ''

    if (expression === '$frontmatter.description')
      return context.frontmatter.description ?? ''

    return ''
  })
}

/** Applies a transform to the parts of a line that are not inline code spans */
function mapOutsideInlineCode(line: string, transform: (text: string) => string): string {
  return line
    .split(/(`+[^`]*`+)/)
    .map((part, index) => (index % 2 === 1 ? part : transform(part)))
    .join('')
}

/** Rewrites markdown links and drops images, except inside inline code spans (link labels may contain code) */
function rewriteLinks(text: string, context: CleanMarkdownContext): string {
  const codeSpans = [...text.matchAll(/(`+)[^`]*\1/g)].map(match => [match.index ?? 0, (match.index ?? 0) + match[0].length])
  const inCode = (offset: number): boolean => codeSpans.some(([start, end]) => offset > start && offset < end)

  return text.replaceAll(/(!?)\[((?:`[^`]*`|[^\]`])+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (match: string, image: string, label: string, href: string, offset: number) => {
    if (inCode(offset))
      return match

    if (image)
      return ''

    const target = context.resolveLink(href)

    return target ? `[${label}](${target})` : label
  })
}

function stripInlineHtml(text: string): string {
  return text
    .replaceAll(/<br\s*\/?>/gi, ' ')
    .replaceAll(/<\/?[A-Z][\w-]*(?:\s[^<>]*)?\/?>/gi, '')
}

function cleanProseLine(line: string, context: CleanMarkdownContext): string {
  const withoutMustaches = replaceMustaches(line, context).replace(/^(#{1,6}\s.*?)\s*\{#[\w-]+\}\s*$/, '$1')

  return mapOutsideInlineCode(rewriteLinks(withoutMustaches, context), stripInlineHtml)
}

interface HtmlScanState {
  depth: number
  started: boolean
  inTag: boolean
  inComment: boolean
  closingTag: boolean
  tagName: string
  quote: string
  lastSignificant: string
}

/** Handles a character inside a tag (`<Tag attr="...">`) */
function scanTagChar(char: string, state: HtmlScanState): void {
  if (state.quote) {
    if (char === state.quote)
      state.quote = ''
  }
  else if (char === '"' || char === '\'') {
    state.quote = char
  }
  else if (char === '>') {
    const selfClosing = state.lastSignificant === '/' || VOID_ELEMENTS.has(state.tagName.toLowerCase())

    if (state.closingTag)
      state.depth--
    else if (!selfClosing)
      state.depth++

    state.inTag = false
    state.started = true
  }

  if (char.trim())
    state.lastSignificant = char
}

/** Handles a character outside tags, returns the next index */
function scanTextChar(line: string, index: number, state: HtmlScanState): number {
  if (line.startsWith('<!--', index)) {
    state.inComment = true
    return index + 4
  }

  const tagMatch = line[index] === '<' ? /^<(\/?)([A-Z][\w-]*)/i.exec(line.slice(index)) : null

  if (!tagMatch)
    return index + 1

  state.inTag = true
  state.closingTag = tagMatch[1] === '/'
  state.tagName = tagMatch[2]
  state.lastSignificant = ''

  return index + tagMatch[0].length
}

/** Scans one line of HTML/Vue template markup, updating the element depth */
function scanHtmlLine(line: string, state: HtmlScanState): void {
  let index = 0

  while (index < line.length) {
    if (state.inComment) {
      const end = line.indexOf('-->', index)

      if (end === -1)
        return

      state.inComment = false
      index = end + 3
    }
    else if (state.inTag) {
      scanTagChar(line[index], state)
      index++
    }
    else {
      index = scanTextChar(line, index, state)
    }
  }
}

/**
 * Returns the index of the last line of the HTML block starting at `start`.
 * Fenced code inside the block (ComponentDemo `#code` slots) is collected in `keptFences`.
 */
function consumeHtmlBlock(lines: string[], start: number, keptFences: string[]): number {
  const state: HtmlScanState = {
    depth: 0,
    started: false,
    inTag: false,
    inComment: false,
    closingTag: false,
    tagName: '',
    quote: '',
    lastSignificant: '',
  }
  let inFence = false
  let fenceMarker = ''
  let fenceIndent = 0
  const dedent = (line: string): string => line.slice(Math.min(fenceIndent, line.length - line.trimStart().length))

  for (let index = start; index < lines.length; index++) {
    const line = lines[index]
    const fence = FENCE_REGEX.exec(line)

    if (inFence) {
      keptFences.push(dedent(line))
      if (fence && fence[2].startsWith(fenceMarker) && fence[3].trim() === '') {
        inFence = false
        keptFences.push('')
      }
      continue
    }

    if (fence && !state.inTag) {
      inFence = true
      fenceMarker = fence[2]
      fenceIndent = fence[1].length
      keptFences.push(dedent(line))
      continue
    }

    scanHtmlLine(line, state)

    if (state.started && state.depth <= 0 && !state.inTag) {
      return index
    }
  }

  return lines.length - 1
}

/** Keeps the internal links of a dropped HTML block (navigation cards, buttons) as a markdown list */
function linksOfHtmlBlock(block: string, context: CleanMarkdownContext): string[] {
  const links: string[] = []

  for (const [, href] of block.matchAll(/\shref="([^"#][^"]*)"/g)) {
    const target = /^[a-z]+:/i.test(href) ? undefined : context.resolveLink(href)
    const title = target ? context.linkTitle?.(href) : undefined
    const line = target && title ? `- [${title}](${target})` : undefined

    if (line && !links.includes(line))
      links.push(line)
  }

  return links.length > 0 ? ['', ...links, ''] : []
}

function isAutolink(line: string): boolean {
  return /^\s*<(?:https?:|mailto:)/.test(line)
}

function isClosingFence(fence: RegExpExecArray | null, marker: string): boolean {
  return !!fence && fence[2].startsWith(marker) && fence[3].trim() === ''
}

/** Markdown of a VitePress container line (`::: tip Title`, `:::`), or `undefined` when the line is not one */
function containerLines(line: string, context: CleanMarkdownContext): string[] | undefined {
  if (CONTAINER_CLOSE_REGEX.test(line))
    return ['']

  const containerOpen = CONTAINER_OPEN_REGEX.exec(line)

  if (!containerOpen)
    return undefined

  const [, type, rawTitle] = containerOpen

  if (type === 'code-group')
    return []

  const title = cleanProseLine(rawTitle.trim(), context)
  const label = CONTAINER_LABELS[type] ?? type.charAt(0).toUpperCase() + type.slice(1)

  return ['', title ? `**${label}: ${title}**` : `**${label}:**`, '']
}

/** Converts the HTML block starting at `start`: keeps its code fences, or its internal links */
function htmlBlockLines(lines: string[], start: number, context: CleanMarkdownContext): { output: string[], end: number } {
  const keptFences: string[] = []
  const titleMatch = /<ComponentDemo[^>]*\stitle="([^"]+)"/.exec(lines[start])
  const end = consumeHtmlBlock(lines, start, keptFences)

  if (keptFences.length === 0)
    return { output: linksOfHtmlBlock(lines.slice(start, end + 1).join('\n'), context), end }

  return {
    output: ['', ...(titleMatch ? [`**${titleMatch[1]}**`, ''] : []), ...keptFences.map(stripInternalPrefix)],
    end,
  }
}

export function cleanMarkdown(source: string, context: CleanMarkdownContext): string {
  const lines = resolveIncludes(source, context).split('\n')
  const output: string[] = []
  let fenceMarker = ''
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const fence = FENCE_REGEX.exec(line)

    if (fenceMarker) {
      output.push(stripInternalPrefix(line))
      if (isClosingFence(fence, fenceMarker))
        fenceMarker = ''
    }
    else if (fence) {
      fenceMarker = fence[2]
      output.push(line)
    }
    else if (HTML_BLOCK_START_REGEX.test(line) && !isAutolink(line)) {
      const block = htmlBlockLines(lines, index, context)

      output.push(...block.output)
      index = block.end
    }
    else {
      output.push(...(containerLines(line, context) ?? [cleanProseLine(line, context)]))
    }

    index++
  }

  return normalizeBlankLines(output.join('\n'))
}

/** Replaces em and en dashes with a plain hyphen */
export function normalizeDashes(text: string): string {
  return text.replaceAll(/\s*\u2014\s*/g, ' - ').replaceAll('\u2013', '-')
}

export function normalizeBlankLines(markdown: string): string {
  return `${normalizeDashes(markdown)
    .split('\n')
    .map(line => line.replace(/\s+$/, ''))
    .join('\n')
    .replaceAll(/\n{3,}/g, '\n\n')
    .trim()}\n`
}

/** Removes the leading `# Title` and the description paragraph that VitePress pages repeat from their frontmatter */
export function stripLeadingTitle(markdown: string, description?: string): string {
  const lines = markdown.split('\n')
  let index = 0

  while (index < lines.length && lines[index].trim() === '') index++

  if (lines[index]?.startsWith('# ')) {
    index++
  }

  while (index < lines.length && lines[index].trim() === '') index++

  if (description && lines[index]?.trim() === description.trim()) {
    index++
  }

  return normalizeBlankLines(lines.slice(index).join('\n'))
}

export interface MarkdownHeading {
  level: number
  title: string
  line: number
}

export function extractHeadings(markdown: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = []
  let inFence = false

  for (const [index, line] of markdown.split('\n').entries()) {
    if (FENCE_REGEX.test(line)) {
      inFence = !inFence
      continue
    }

    const match = !inFence && /^(#{1,6})\s+(\S.*?)\s*(?:#+\s*)?$/.exec(line)

    if (match) {
      headings.push({ level: match[1].length, title: match[2].replaceAll(/[*_`]/g, ''), line: index })
    }
  }

  return headings
}

/** Extracts the source of every fenced code block */
export function extractCodeBlocks(markdown: string): string[] {
  const blocks: string[] = []
  let current: string[] | undefined
  let fenceMarker = ''

  for (const line of markdown.split('\n')) {
    const fence = FENCE_REGEX.exec(line)

    if (current) {
      if (fence && fence[2].startsWith(fenceMarker) && fence[3].trim() === '') {
        blocks.push(current.join('\n'))
        current = undefined
      }
      else {
        current.push(line)
      }
      continue
    }

    if (fence) {
      current = []
      fenceMarker = fence[2]
    }
  }

  return blocks
}
