import { isApple } from './isApple.ts'

export interface ParsedShortcut {
  /** The Cmd key on macOS and iOS, the Ctrl key elsewhere */
  mod: boolean
  ctrl: boolean
  meta: boolean
  alt: boolean
  shift: boolean
  /** Lowercase key (`k`, `1`, `enter`, `escape`, `arrowup`) */
  key: string
}

export interface ShortcutOptions {
  /**
   * Force the platform, by default the one of the browser
   */
  apple?: boolean
}

const MODIFIER_ALIASES: Record<string, 'mod' | 'ctrl' | 'meta' | 'alt' | 'shift'> = {
  mod: 'mod',
  ctrl: 'ctrl',
  control: 'ctrl',
  meta: 'meta',
  cmd: 'meta',
  command: 'meta',
  win: 'meta',
  alt: 'alt',
  option: 'alt',
  opt: 'alt',
  shift: 'shift',
}

const KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  space: ' ',
  spacebar: ' ',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  del: 'delete',
  return: 'enter',
  plus: '+',
}

const APPLE_MODIFIER_SYMBOLS = { ctrl: '⌃', alt: '⌥', shift: '⇧', meta: '⌘' } as const

const KEY_LABELS: Record<string, { apple: string, other: string }> = {
  'enter': { apple: '↵', other: 'Enter' },
  'escape': { apple: 'Esc', other: 'Esc' },
  ' ': { apple: 'Space', other: 'Space' },
  'arrowup': { apple: '↑', other: '↑' },
  'arrowdown': { apple: '↓', other: '↓' },
  'arrowleft': { apple: '←', other: '←' },
  'arrowright': { apple: '→', other: '→' },
  'backspace': { apple: '⌫', other: 'Backspace' },
  'delete': { apple: '⌦', other: 'Del' },
  'tab': { apple: '⇥', other: 'Tab' },
}

/**
 * Parse a shortcut like `mod+k`, `ctrl+shift+s` or `alt+1`
 */
export function parseShortcut(shortcut: string): ParsedShortcut {
  const parsed: ParsedShortcut = { mod: false, ctrl: false, meta: false, alt: false, shift: false, key: '' }
  const parts = shortcut.length > 1 && shortcut.endsWith('++')
    ? [...shortcut.slice(0, -2).split('+'), '+']
    : shortcut.split('+')

  for (const rawPart of parts) {
    const part = rawPart.trim().toLowerCase()
    const modifier = MODIFIER_ALIASES[part]

    if (modifier)
      parsed[modifier] = true
    else if (part)
      parsed.key = KEY_ALIASES[part] ?? part
  }

  return parsed
}

const PUNCTUATION_CODES: Record<string, string> = {
  '/': 'slash',
  '\\': 'backslash',
  '[': 'bracketleft',
  ']': 'bracketright',
  ';': 'semicolon',
  '\'': 'quote',
  ',': 'comma',
  '.': 'period',
  '-': 'minus',
  '=': 'equal',
  '`': 'backquote',
}

function resolveModifiers(parsed: ParsedShortcut, apple: boolean) {
  return {
    ctrl: parsed.ctrl || (parsed.mod && !apple),
    meta: parsed.meta || (parsed.mod && apple),
    alt: parsed.alt,
    shift: parsed.shift,
  }
}

function matchesKey(event: KeyboardEvent, key: string, isSymbol: boolean): boolean {
  const eventKey = event.key?.toLowerCase()
  const eventCode = event.code?.toLowerCase()

  if (eventKey === key || eventCode === `digit${key}`) {
    return true
  }

  if (isSymbol && (event.shiftKey || event.altKey) && eventCode === PUNCTUATION_CODES[key]) {
    return true
  }

  const keyIsAscii = eventKey !== undefined && /^[\u0021-\u007E]$/.test(eventKey)

  return eventCode === `key${key}` && (event.altKey || !keyIsAscii)
}

/**
 * Check whether a keyboard event triggers the shortcut, modifiers are matched exactly (Shift is ignored for a symbol typed with it, like `?`)
 */
export function matchesShortcut(event: KeyboardEvent, shortcut: string | ParsedShortcut, options: ShortcutOptions = {}): boolean {
  const parsed = typeof shortcut === 'string' ? parseShortcut(shortcut) : shortcut
  const wanted = resolveModifiers(parsed, options.apple ?? isApple())

  if (event.ctrlKey !== wanted.ctrl || event.metaKey !== wanted.meta || event.altKey !== wanted.alt) {
    return false
  }

  const isSymbol = /^[^\sa-z0-9]$/.test(parsed.key)

  if (event.shiftKey !== wanted.shift) {
    return !wanted.shift && isSymbol && event.key?.toLowerCase() === parsed.key
  }

  return matchesKey(event, parsed.key, isSymbol)
}

/**
 * Human label of a shortcut for the platform: `⌘1` on macOS, `Ctrl+1` elsewhere
 */
export function formatShortcut(shortcut: string | ParsedShortcut, options: ShortcutOptions = {}): string {
  const parsed = typeof shortcut === 'string' ? parseShortcut(shortcut) : shortcut
  const apple = options.apple ?? isApple()
  const modifiers = resolveModifiers(parsed, apple)
  const keyLabel = KEY_LABELS[parsed.key]?.[apple ? 'apple' : 'other'] ?? parsed.key.toUpperCase()

  if (apple) {
    const symbols = (['ctrl', 'alt', 'shift', 'meta'] as const)
      .filter(name => modifiers[name])
      .map(name => APPLE_MODIFIER_SYMBOLS[name])

    return [...symbols, keyLabel].join('')
  }

  const names = [
    modifiers.ctrl && 'Ctrl',
    modifiers.alt && 'Alt',
    modifiers.shift && 'Shift',
    modifiers.meta && 'Win',
  ].filter(Boolean) as string[]

  return [...names, keyLabel].join('+')
}
