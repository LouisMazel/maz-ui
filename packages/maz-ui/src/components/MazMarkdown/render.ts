import type { MarkedOptions, Token, TokensList } from 'marked'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { escapeHtml, unescapeHtml } from '../../utils/escapeHtml.ts'

export type MazMarkdownPart
  = | { kind: 'html', html: string }
    | { kind: 'code', code: string, language?: string }

export interface MazMarkdownRenderOptions {
  sanitize: boolean
  highlight: boolean
  inline: boolean
  headingAnchors: boolean
  externalLinks: boolean
  renderFunction?: (markdown: string) => string | Promise<string>
  markedOptions?: MarkedOptions | Record<string, unknown>
}

const ANCHOR_TAG_REGEX = /<a\s[^>]*>/gi
const EXTERNAL_HREF_REGEX = /\shref="(?:https?:)?\/\//i
const TARGET_ATTRIBUTE_REGEX = /\starget=/i

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .split(/[\s-]+/)
    .filter(Boolean)
    .join('-')
}

function addExternalLinkAttributes(html: string): string {
  return html.replace(ANCHOR_TAG_REGEX, (tag) => {
    if (!EXTERNAL_HREF_REGEX.test(tag) || TARGET_ATTRIBUTE_REGEX.test(tag))
      return tag
    return `${tag.slice(0, -1)} target="_blank" rel="noopener noreferrer">`
  })
}

function finalize(html: string, options: MazMarkdownRenderOptions): string {
  const clean = options.sanitize ? DOMPurify.sanitize(html) : html
  return options.externalLinks ? addExternalLinkAttributes(clean) : clean
}

function isThenable<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as Promise<T> | undefined)?.then === 'function'
}

function fallbackParts(source: string): MazMarkdownPart[] {
  return [{ kind: 'html', html: `<pre>${escapeHtml(source)}</pre>` }]
}

function createMarkedOptions(options: MazMarkdownRenderOptions) {
  const used = new Map<string, number>()
  const base = { gfm: true, breaks: true, ...options.markedOptions, async: false } as MarkedOptions & { async: false }

  if (!options.headingAnchors)
    return base

  const renderer = new marked.Renderer()
  renderer.heading = function ({ tokens, depth }) {
    const html = this.parser.parseInline(tokens)
    const slug = slugify(unescapeHtml(html.replace(/<[^<>]*>/g, ''))) || 'section'
    const count = used.get(slug) ?? 0
    used.set(slug, count + 1)
    const id = count === 0 ? slug : `${slug}-${count}`
    return `<h${depth} id="${id}">${html}</h${depth}>\n`
  }
  return { ...base, renderer }
}

function renderBlocksWithCode(source: string, options: MazMarkdownRenderOptions): MazMarkdownPart[] {
  const markedOptions = createMarkedOptions(options)
  const tokens = marked.lexer(source, markedOptions)
  const parts: MazMarkdownPart[] = []
  let pending: Token[] = []

  const flush = () => {
    if (pending.length === 0)
      return
    const list = Object.assign(pending, { links: tokens.links }) as TokensList
    parts.push({ kind: 'html', html: finalize(marked.parser(list, markedOptions), options) })
    pending = []
  }

  for (const token of tokens) {
    if (token.type === 'code' && token.codeBlockStyle !== 'indented') {
      flush()
      parts.push({ kind: 'code', code: token.text, language: token.lang?.trim().split(/\s+/)[0] || undefined })
    }
    else {
      pending.push(token)
    }
  }
  flush()

  return parts
}

export function renderMarkdown(source: string, options: MazMarkdownRenderOptions): MazMarkdownPart[] | Promise<MazMarkdownPart[]> {
  try {
    let html: string | Promise<string>

    if (options.renderFunction) {
      html = options.renderFunction(source)
    }
    else if (options.highlight && !options.inline) {
      return renderBlocksWithCode(source, options)
    }
    else {
      const markedOptions = createMarkedOptions(options)
      html = options.inline
        ? marked.parseInline(source, markedOptions)
        : marked.parse(source, markedOptions)
    }

    if (isThenable(html)) {
      return html
        .then(value => [{ kind: 'html', html: finalize(value, options) } satisfies MazMarkdownPart])
        .catch(() => fallbackParts(source))
    }

    return [{ kind: 'html', html: finalize(html, options) }]
  }
  catch {
    return fallbackParts(source)
  }
}
