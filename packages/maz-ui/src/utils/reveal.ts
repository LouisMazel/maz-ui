import { isClient } from '@maz-ui/utils/helpers/isClient'
import { REVEAL_CSS } from './revealStyles.ts'

export type RevealEffect
  = | 'fade'
    | 'slide-up'
    | 'slide-down'
    | 'slide-start'
    | 'slide-end'
    | 'slide-left'
    | 'slide-right'
    | 'blur'
    | 'scale'
    | 'curtain-up'
    | 'curtain-down'
    | 'curtain-start'
    | 'curtain-end'
    | 'iris'
    | 'settle'
    | 'lines'
    | 'words'

export interface RevealOptions {
  /**
   * The effect. `slide-left` and `slide-right` are physical (they do not follow the direction), prefer `slide-start` and `slide-end`
   * @default 'slide-up'
   */
  effect?: RevealEffect
  /**
   * Delay before the reveal, in milliseconds
   * @default 0
   */
  delay?: number
  /**
   * Duration of the reveal in milliseconds
   * @default the `--maz-motion-slower` token
   */
  duration?: number
  /**
   * Reveal once. When `false`, the element hides again when it leaves the screen
   * @default true
   */
  once?: boolean
  /**
   * Delay in milliseconds between the children (or the lines and words) of the element
   */
  stagger?: number
  /**
   * `enter` reveals when the element enters the screen, `scroll` links the progress to the scroll
   * (browsers without `animation-timeline` fall back to `enter`)
   * @default 'enter'
   */
  mode?: 'enter' | 'scroll'
  /**
   * Visible ratio (0 to 1) that triggers the reveal. By default, the element reveals when it crosses the bottom 10% of the screen
   */
  threshold?: number
  /**
   * Add a blur to the effect
   * @default false
   */
  blur?: boolean
}

const STATE = 'data-maz-reveal-state'
const CASCADE_STEP = 70
const CASCADE_MAX = 6
const SYMBOL = Symbol.for('maz-ui.reveal.styles')

type Handler = (entry: IntersectionObserverEntry, rank: number) => void

interface Pool {
  observer: IntersectionObserver
  /** Several directives can observe the same element (`v-reveal` and `v-tilt`): one set of handlers per element */
  handlers: Map<Element, Set<Handler>>
}

const pools = new Map<string, Pool>()

function dispatch(pool: Pool, entries: IntersectionObserverEntry[]) {
  const entering = entries
    .filter(entry => entry.isIntersecting)
    // eslint-disable-next-line sonarjs/bitwise-operators
    .sort((a, b) => a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1)

  for (const entry of entries) {
    const rank = entering.indexOf(entry)

    for (const handler of pool.handlers.get(entry.target) ?? [])
      handler(entry, Math.max(rank, 0))
  }
}

/**
 * Calls `handler` each time the visibility of an element changes. All the elements share one `IntersectionObserver`
 * (per `threshold`). Returns the function that stops it. `rank` orders the elements that enter together.
 * @example const stop = observeIntersection(element, (entry, rank) => {})
 */
export function observeIntersection(element: Element, handler: Handler, options: { threshold?: number } = {}): () => void {
  if (!isClient() || !('IntersectionObserver' in globalThis))
    return () => {}

  const key = options.threshold === undefined ? 'edge' : String(options.threshold)
  let pool = pools.get(key)

  if (!pool) {
    const created: Pool = { observer: undefined as unknown as IntersectionObserver, handlers: new Map() }
    created.observer = new IntersectionObserver(entries => dispatch(created, entries), options.threshold === undefined
      ? { rootMargin: '0px 0px -10% 0px' }
      : { threshold: [0, options.threshold] })
    pools.set(key, created)
    pool = created
  }

  const current = pool
  let elementHandlers = current.handlers.get(element)

  if (!elementHandlers) {
    elementHandlers = new Set()
    current.handlers.set(element, elementHandlers)
  }

  elementHandlers.add(handler)
  // Observing again gives the new handler the current visibility of the element
  current.observer.unobserve(element)
  current.observer.observe(element)

  let stopped = false

  return () => {
    if (stopped)
      return
    stopped = true

    const set = current.handlers.get(element)
    set?.delete(handler)

    if (set && set.size > 0)
      return

    current.handlers.delete(element)
    current.observer.unobserve(element)

    if (current.handlers.size === 0) {
      current.observer.disconnect()
      pools.delete(key)
    }
  }
}

function ensureStyles() {
  const registry = globalThis as unknown as Record<symbol, boolean>

  if (registry[SYMBOL])
    return

  registry[SYMBOL] = true

  try {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(REVEAL_CSS)
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
  }
  catch {
    const style = document.createElement('style')
    style.dataset.mazReveal = ''
    style.textContent = REVEAL_CSS
    document.head.append(style)
  }
}

interface Entry {
  key: string
  options: RevealOptions
  revealed: boolean
  stop?: () => void
  restore?: () => void
  resplit?: () => void
  disconnect?: () => void
  marked?: Element[]
}

const entries = new WeakMap<HTMLElement, Entry>()

function supportsScrollTimeline() {
  return typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()')
}

function createSpan(className: string) {
  const span = document.createElement('span')
  span.className = className
  return span
}

function measureLines(wordSpans: HTMLElement[], words: string[]) {
  const lines: Array<{ text: string }> = []
  let top: number | undefined
  let current: string[] = []

  for (const [index, span] of wordSpans.entries()) {
    const { top: spanTop } = span.getBoundingClientRect()

    if (top !== undefined && Math.abs(spanTop - top) > 2) {
      lines.push({ text: current.join(' ') })
      current = []
    }

    top = spanTop
    current.push(words[index]!)
  }

  lines.push({ text: current.join(' ') })

  return lines
}

function buildLines(visual: HTMLElement, lines: Array<{ html?: string, text?: string }>) {
  visual.replaceChildren()

  for (const line of lines) {
    const mask = createSpan('m-reveal-line')
    const inner = createSpan('')
    inner.setAttribute('data-maz-reveal-item', '')

    if (line.html === undefined)
      inner.textContent = line.text ?? ''
    else
      inner.innerHTML = line.html

    mask.append(inner)
    visual.append(mask)
  }
}

function split(element: HTMLElement, kind: 'lines' | 'words') {
  const html = element.innerHTML
  const text = (element.textContent ?? '').trim()

  const screenReader = createSpan('m-reveal-sr')
  screenReader.textContent = text

  const visual = createSpan('')
  visual.setAttribute('aria-hidden', 'true')
  visual.setAttribute('data-maz-reveal-split', '')

  const words = text.split(/\s+/).filter(Boolean)
  const wordSpans: HTMLElement[] = []

  for (const [index, word] of words.entries()) {
    if (index > 0)
      visual.append(' ')

    const span = createSpan('m-reveal-word')
    span.textContent = word
    wordSpans.push(span)
    visual.append(span)
  }

  element.replaceChildren(screenReader, visual)

  if (kind === 'words') {
    for (const span of wordSpans)
      span.setAttribute('data-maz-reveal-item', '')
  }
  else {
    const hasBreaks = html.search(/<br\s*\/?>/i) !== -1

    buildLines(visual, hasBreaks
      ? html.split(/<br\s*\/?>/i).map(part => ({ html: part }))
      : measureLines(wordSpans, words))
  }

  return () => {
    element.innerHTML = html
  }
}

function getItems(element: HTMLElement, options: RevealOptions, entry: Entry) {
  if (options.effect === 'lines' || options.effect === 'words' || options.stagger !== undefined || element.querySelector('[data-maz-reveal-item]')) {
    if (!element.querySelector('[data-maz-reveal-item]')) {
      entry.marked = [...element.children]

      for (const child of entry.marked)
        child.setAttribute('data-maz-reveal-item', '')
    }

    return [...element.querySelectorAll<HTMLElement>('[data-maz-reveal-item]')]
  }

  return []
}

function applyAttributes(element: HTMLElement, options: RevealOptions, items: HTMLElement[], scroll: boolean) {
  element.setAttribute('data-maz-reveal', options.effect ?? 'slide-up')
  element.setAttribute('data-maz-reveal-mode', scroll ? 'scroll' : 'enter')

  if (options.blur)
    element.setAttribute('data-maz-reveal-blur', '')
  else
    element.removeAttribute('data-maz-reveal-blur')

  const stagger = options.stagger ?? (options.effect === 'lines' ? 100 : options.effect === 'words' ? 60 : undefined)
  const variables: Array<[string, number | undefined]> = [
    ['--maz-reveal-delay', options.delay],
    ['--maz-reveal-duration', options.duration],
    ['--maz-reveal-stagger', stagger],
  ]

  for (const [name, value] of variables) {
    if (value === undefined)
      element.style.removeProperty(name)
    else
      element.style.setProperty(name, `${value}ms`)
  }

  if (items.length === 0) {
    element.removeAttribute('data-maz-reveal-items')
  }
  else {
    element.setAttribute('data-maz-reveal-items', '')

    for (const [index, item] of items.entries())
      item.style.setProperty('--maz-i', String(index))
  }
}

function clean(element: HTMLElement) {
  for (const name of ['data-maz-reveal', 'data-maz-reveal-mode', 'data-maz-reveal-blur', 'data-maz-reveal-items', STATE])
    element.removeAttribute(name)

  for (const name of ['--maz-reveal-delay', '--maz-reveal-duration', '--maz-reveal-stagger', '--maz-reveal-cascade'])
    element.style.removeProperty(name)
}

function release(element: HTMLElement, entry: Entry, restoreDom: boolean) {
  entry.stop?.()
  entry.disconnect?.()

  if (restoreDom)
    entry.restore?.()

  for (const child of entry.marked ?? []) {
    child.removeAttribute('data-maz-reveal-item')
    ;(child as HTMLElement).style.removeProperty('--maz-i')
  }

  entries.delete(element)
}

function settle(element: HTMLElement, entry: Entry) {
  const finish = () => {
    if (entries.get(element) !== entry || element.getAttribute(STATE) !== 'in')
      return

    element.setAttribute(STATE, 'done')
    element.style.removeProperty('--maz-reveal-cascade')
    entry.disconnect?.()
    entry.restore?.()
    entry.restore = undefined
    entry.resplit = undefined

    for (const item of element.querySelectorAll<HTMLElement>('[data-maz-reveal-item]'))
      item.style.removeProperty('--maz-i')
  }

  const wait = () => {
    const animations = element.getAnimations?.({ subtree: true }) ?? []

    Promise.allSettled(animations.map(animation => animation.finished)).then(finish)
  }

  if (typeof requestAnimationFrame === 'function')
    requestAnimationFrame(wait)
  else
    wait()
}

function connectResplit(element: HTMLElement, entry: Entry, kind: 'lines' | 'words') {
  const resplit = () => {
    if (entries.get(element) !== entry || element.getAttribute(STATE) !== 'hidden')
      return

    entry.restore?.()
    entry.restore = split(element, kind)
    const items = getItems(element, entry.options, entry)

    for (const [index, item] of items.entries())
      item.style.setProperty('--maz-i', String(index))
  }

  entry.resplit = resplit

  if (kind === 'lines') {
    document.fonts?.ready.then(resplit)

    if (!entry.options.once && typeof ResizeObserver !== 'undefined') {
      let width = element.clientWidth
      const observer = new ResizeObserver(() => {
        if (element.clientWidth !== width) {
          width = element.clientWidth
          resplit()
        }
      })

      observer.observe(element)
      entry.disconnect = () => observer.disconnect()
    }
  }
}

/**
 * Reveals an element: applies the effect, hides it once the system is ready (client only, after the hydration)
 * and shows it when it enters the screen. Safe to call again with other options.
 */
export function reveal(element: HTMLElement, input: RevealOptions = {}) {
  if (!isClient())
    return

  const options: RevealOptions = { effect: 'slide-up', once: true, ...Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) }
  const key = JSON.stringify(options)
  const current = entries.get(element)
  const isSplit = options.effect === 'lines' || options.effect === 'words'

  if (current?.key === key) {
    if (isSplit && !element.querySelector('[data-maz-reveal-split]'))
      current.resplit?.()

    return
  }

  const wasRevealed = current?.revealed === true && options.once !== false

  if (current)
    release(element, current, true)

  ensureStyles()

  const entry: Entry = { key, options, revealed: wasRevealed }
  entries.set(element, entry)

  if (isSplit) {
    entry.restore = split(element, options.effect as 'lines' | 'words')
    connectResplit(element, entry, options.effect as 'lines' | 'words')
  }

  const items = getItems(element, options, entry)
  const scroll = options.mode === 'scroll' && supportsScrollTimeline()

  applyAttributes(element, options, items, scroll)

  if (scroll || wasRevealed) {
    if (wasRevealed)
      element.setAttribute(STATE, 'done')

    return
  }

  element.setAttribute(STATE, 'hidden')

  entry.stop = observeIntersection(element, (observed, rank) => {
    const state = element.getAttribute(STATE)
    const visible = observed.isIntersecting && (options.threshold === undefined || observed.intersectionRatio >= options.threshold)

    if (visible) {
      if (state !== 'hidden')
        return

      element.style.setProperty('--maz-reveal-cascade', `${Math.min(rank, CASCADE_MAX) * CASCADE_STEP}ms`)
      element.setAttribute(STATE, 'in')
      entry.revealed = true

      if (options.once !== false) {
        entry.stop?.()
        settle(element, entry)
      }
    }
    else if (options.once === false) {
      if (state === 'in')
        element.setAttribute(STATE, 'hidden')
    }
    else if (state === 'hidden' && observed.boundingClientRect.bottom < 0) {
      entry.stop?.()
      entry.revealed = true
      element.setAttribute(STATE, 'done')
    }
  }, { threshold: options.threshold })
}

/**
 * Stops revealing an element and removes what `reveal` added
 */
export function unreveal(element: HTMLElement, { restore = false }: { restore?: boolean } = {}) {
  const entry = entries.get(element)

  if (!entry)
    return

  release(element, entry, restore)
  clean(element)
}

function readNumber(element: HTMLElement, name: string) {
  const value = element.getAttribute(`data-maz-reveal-${name}`)
  const number = value === null || value === '' ? Number.NaN : Number(value)

  return Number.isNaN(number) ? undefined : number
}

/**
 * Reads the options of an element from its `data-maz-reveal*` attributes
 * @example <p data-maz-reveal="slide-up" data-maz-reveal-delay="200" data-maz-reveal-once="false">
 */
export function readRevealOptions(element: HTMLElement): RevealOptions {
  const blur = element.getAttribute('data-maz-reveal-blur')
  const mode = element.getAttribute('data-maz-reveal-mode')

  return {
    effect: (element.getAttribute('data-maz-reveal') || undefined) as RevealEffect | undefined,
    delay: readNumber(element, 'delay'),
    duration: readNumber(element, 'duration'),
    stagger: readNumber(element, 'stagger'),
    threshold: readNumber(element, 'threshold'),
    once: element.getAttribute('data-maz-reveal-once') === 'false' ? false : undefined,
    blur: blur === null ? undefined : blur !== 'false',
    mode: mode === 'scroll' ? 'scroll' : undefined,
  }
}

/**
 * Whether an element is revealed by the system
 */
export function isRevealed(element: HTMLElement) {
  return entries.has(element)
}
