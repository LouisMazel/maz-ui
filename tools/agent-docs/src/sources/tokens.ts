import type { NamedToken, TailwindManifest, TailwindUtility, ThemeColorToken } from '../types'

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const COLOR_USAGES: Record<string, string> = {
  primary: 'Main brand color: main actions, links, focus rings, selected states. Strong enough to read as text or border on surface (3:1 minimum)',
  secondary: 'Second strong brand color (MazBtn color="secondary", badges, identity accents), not a muted surface and never pale: for discreet backgrounds use surface, container, muted or the -50/-100 steps',
  accent: 'Highlights and tertiary emphasis, distinct from primary and secondary',
  info: 'Informational state (alerts, badges, hints)',
  success: 'Success state (confirmations, valid fields)',
  warning: 'Warning state (caution, pending attention)',
  destructive: 'Error / danger state, invalid fields, destructive actions',
  contrast: 'Neutral high-contrast color (near black in light mode, near white in dark mode)',
  surface: 'Page background (cards, dialogs and inputs use container and input)',
  foreground: 'Body text on surface',
  divider: 'Borders and separators',
  muted: 'Secondary text, placeholders, disabled content, discreet backgrounds (bg-muted/10)',
  overlay: 'Backdrops and scrims behind dialogs',
  shadow: 'Shadow tint (used by the shadow-* utilities)',
  elevation: 'Alias of shadow',
  container: 'Background of MazCard, MazContainer, MazDialog, MazPopover, MazDrawer... (follows the preset `components.container`)',
  input: 'Background of MazInput, MazSelect, MazTextarea, MazCheckbox... (follows the preset `components.input`)',
}

export function stripCssComments(css: string): string {
  return css.replaceAll(/\/\*[\s\S]*?\*\//g, '')
}

export function parseDeclarations(css: string): NamedToken[] {
  return [
    ...stripCssComments(css).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g),
  ].map(match => ({
    name: match[1],
    value: match[2].replaceAll(/\s+/g, ' ').trim(),
  }))
}

export function parseColors(css: string): ThemeColorToken[] {
  const declarations = parseDeclarations(css)
  const colors = new Map<string, ThemeColorToken>()

  for (const { name, value } of declarations) {
    const match = /^--color-([a-z]+)(?:-(foreground|\d+))?$/.exec(name)

    if (!match)
      continue

    const [, color, suffix] = match
    const token = colors.get(color) ?? {
      name: color,
      variable: /var\((--maz-[\w-]+)/.exec(value)?.[1] ?? '',
      foreground: false,
      scale: [],
      usage: COLOR_USAGES[color] ?? '',
    }

    if (suffix === 'foreground')
      token.foreground = true
    else if (suffix)
      token.scale.push(suffix)
    else
      token.variable = /var\((--maz-[\w-]+)/.exec(value)?.[1] ?? token.variable

    colors.set(color, token)
  }

  return [
    ...colors.values(),
  ]
}

export function parseUtilities(css: string): TailwindUtility[] {
  const descriptions: string[] = []
  const marked = css.replaceAll(/\/\*([\s\S]*?)\*\/(\s*)/g, (_, comment: string, space: string, offset: number, source: string) => {
    if (comment.includes('@utility') || !source.startsWith('@utility', offset + _.length))
      return space

    descriptions.push(comment.replaceAll(/^\s*\*\s?/gm, '').replaceAll(/\s+/g, ' ').trim())
    return `@description ${descriptions.length - 1}\n`
  })

  return [
    ...marked.matchAll(/(?:@description (\d+)\n)?@utility\s+([\w-]+)\s*\{([\s\S]*?)\n\}/g),
  ].map(([, index, name, body]) => ({
    name,
    css: body.replaceAll(/\s+/g, ' ').trim(),
    ...(index && { description: descriptions[Number(index)] }),
  }))
}

export function parseCustomVariants(css: string): NamedToken[] {
  return [
    ...stripCssComments(css).matchAll(/@custom-variant\s+([\w-]+)\s+\(([^;]+)\);/g),
  ].map(match => ({
    name: match[1],
    value: match[2].trim(),
  }))
}

export function parseTransitions(css: string): string[] {
  return [
    ...new Set([
      ...css.matchAll(/\.(maz-[\w-]+?)-enter-active/g),
    ].map(match => match[1])),
  ].sort()
}

function prefixed(tokens: NamedToken[], from: RegExp, to: (name: string) => string): NamedToken[] {
  return tokens
    .filter(token => from.test(token.name))
    .map(token => ({
      name: to(token.name.replace(from, '')),
      value: token.value,
    }))
}

export function collectTailwindTokens(tailwindDir: string, cssDir: string): TailwindManifest {
  const read = (file: string): string => readFileSync(join(tailwindDir, file), 'utf8')
  const components = parseDeclarations(read('theme-components.css'))
  const containerVariables = parseDeclarations(readFileSync(join(cssDir, 'padded-container-vars.css'), 'utf8'))
    .filter((token, index, all) => all.findIndex(other => other.name === token.name) === index)
  const typography = parseDeclarations(read('theme-typography.css'))

  const colors = parseColors(read('theme-colors.css'))

  for (const { name, value } of components) {
    const color = name.replace(/^--color-/, '')
    colors.push({
      name: color,
      variable: /var\((--maz-[\w-]+)/.exec(value)?.[1] ?? '',
      foreground: false,
      scale: [],
      usage: COLOR_USAGES[color] ?? '',
    })
  }

  return {
    entries: [
      { path: 'maz-ui/tailwindcss/theme.css', description: 'Every theme token (colors, spacing, radius, breakpoints, container sizes, shadows, z-index, typography, component surfaces, dark variant)' },
      { path: 'maz-ui/tailwindcss/utilities.css', description: 'maz-ui custom utilities: layout (padded-container, flex-center), type scale (text-display, text-title-1..4, text-body, text-caption...), rich-text, cap-f, disabled-*' },
      { path: 'maz-ui/tailwindcss/theme-colors.css', description: 'Colors only' },
      { path: 'maz-ui/tailwindcss/theme-spacing.css', description: 'Spacing scale only' },
      { path: 'maz-ui/tailwindcss/theme-radius.css', description: 'Border radius only' },
      { path: 'maz-ui/tailwindcss/theme-breakpoints.css', description: 'Breakpoints only' },
      { path: 'maz-ui/tailwindcss/theme-containers.css', description: 'Container query sizes only (`@tab-m:`, `max-w-tab-m`)' },
      { path: 'maz-ui/tailwindcss/theme-shadows.css', description: 'Shadows only' },
      { path: 'maz-ui/tailwindcss/theme-z-index.css', description: 'z-index scale only' },
      { path: 'maz-ui/tailwindcss/theme-typography.css', description: 'Fonts, border width, durations and easings only' },
      { path: 'maz-ui/tailwindcss/theme-components.css', description: 'bg-container and bg-input surfaces only' },
      { path: 'maz-ui/tailwindcss/theme-variants.css', description: '`dark:` variant wired to the `.dark` class only' },
    ],
    colors,
    radius: prefixed(parseDeclarations(read('theme-radius.css')), /^--radius-?/, name => (name
      ? `rounded-${name}`
      : 'rounded')),
    shadows: prefixed(parseDeclarations(read('theme-shadows.css')), /^--shadow-/, name => `shadow-${name}`),
    breakpoints: prefixed(parseDeclarations(read('theme-breakpoints.css')), /^--breakpoint-/, name => `${name}:`),
    containers: prefixed(parseDeclarations(read('theme-containers.css')), /^--container-/, name => `@${name}:`),
    zIndex: prefixed(parseDeclarations(read('theme-z-index.css')), /^--z-/, name => `z-${name}`),
    fonts: prefixed(typography, /^--font-/, name => `font-${name}`),
    durations: prefixed(typography, /^--duration-/, name => `duration-(--duration-${name})`),
    easings: prefixed(typography, /^--ease-/, name => `ease-${name}`),
    spacing: parseDeclarations(read('theme-spacing.css')).map(token => ({ name: 'p-*, m-*, gap-*, w-*, h-*, inset-*...', value: token.value })),
    utilities: parseUtilities(read('utilities.css')),
    variants: parseCustomVariants(read('theme-variants.css')),
    containerVariables,
    transitions: parseTransitions(readFileSync(join(cssDir, 'animation.css'), 'utf8')),
  }
}
