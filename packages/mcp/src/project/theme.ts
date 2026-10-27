import type { TailwindTokens } from '../knowledge/schema'
import type { ThemeTopic } from '../tools/get-theme-tokens'
import type { PresetValue, ProjectPreset } from './preset'
import type { ProjectStylesheet, ProjectToken } from './stylesheet'

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { globSync } from 'tinyglobby'
import { readPresets } from './preset'
import { isTailwindStylesheet, readStylesheet } from './stylesheet'

export interface ProjectTheme {
  stylesheets: ProjectStylesheet[]
  presets: ProjectPreset[]
}

const IGNORED = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/public/**',
  '**/.*/**',
  '**/*.min.css',
  '**/*.d.ts',
  '**/*.{spec,test}.*',
]
const MAX_FILE_SIZE = 300_000
const PATTERNS = ['*.css', '*.ts', '*.mts', '*.cts', '*.js', '*.mjs']
const IGNORED_PATH = /(?:^|\/)(?:node_modules|dist|build|coverage|public|fixtures|__tests__|\.[^/]+)\/|\.min\.css$|\.d\.ts$|\.(?:spec|test)\.\w+$/

/** Source files of the project: the git files (fast, respects `.gitignore`), or a glob outside git */
function projectFiles(rootDir: string): string[] {
  try {
    // eslint-disable-next-line sonarjs/no-os-command-from-path -- the git of the user, run in its own project
    return execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '--', ...PATTERNS], { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 })
      .split('\n')
      .filter(file => file && !IGNORED_PATH.test(file))
  }
  catch {
    return globSync(PATTERNS.map(pattern => `**/${pattern}`), { cwd: rootDir, ignore: IGNORED, deep: 8 })
      .filter(file => !IGNORED_PATH.test(file))
  }
}

function readSmallFile(path: string): string | undefined {
  try {
    return statSync(path).size <= MAX_FILE_SIZE ? readFileSync(path, 'utf8') : undefined
  }
  catch {
    return undefined
  }
}

/** Finds the Tailwind stylesheets and the `definePreset` calls of a project (monorepos included) */
export function readProjectTheme(rootDir: string): ProjectTheme {
  if (!existsSync(join(rootDir, 'package.json')))
    return { stylesheets: [], presets: [] }

  const files = projectFiles(rootDir).sort()
  const theme: ProjectTheme = { stylesheets: [], presets: [] }

  for (const file of files) {
    const source = readSmallFile(join(rootDir, file))

    if (!source)
      continue

    if (file.endsWith('.css')) {
      if (isTailwindStylesheet(source))
        theme.stylesheets.push(readStylesheet(file, source))
    }
    else if (source.includes('definePreset(')) {
      theme.presets.push(...readPresets(file, source))
    }
  }

  return theme
}

const FOUNDATION_USAGE: Record<string, { topic: ThemeTopic, usage: string }> = {
  'base-font-size': { topic: 'typography', usage: 'root font size: every `rem` and the `text-*` sizes' },
  'border-width': { topic: 'typography', usage: '`border` (default width)' },
  'font-family': { topic: 'typography', usage: '`font-sans` (default font)' },
  'font-mono-stack': { topic: 'typography', usage: '`font-mono`' },
  'font-display-stack': { topic: 'typography', usage: '`font-display`' },
  'motion-fast': { topic: 'typography', usage: '`duration-(--duration-fast)`' },
  'motion-normal': { topic: 'typography', usage: '`duration-(--duration-normal)` and the default transition duration' },
  'motion-slow': { topic: 'typography', usage: '`duration-(--duration-slow)`' },
  'easing-out': { topic: 'typography', usage: '`ease-out` and the default transition easing' },
  'easing-in': { topic: 'typography', usage: '`ease-in`' },
  'easing-in-out': { topic: 'typography', usage: '`ease-in-out`' },
  'disabled-opacity': { topic: 'utilities', usage: '`disabled-opacity`, `disabled-state`' },
  'disabled-cursor': { topic: 'utilities', usage: '`disabled-cursor`, `disabled-state`' },
  'space': { topic: 'spacing', usage: 'every spacing utility (`p-4` = 4 x space)' },
}

const COMPONENT_USAGE: Record<string, string> = {
  'btn.font-weight': 'font weight of MazBtn',
  'container.bg': '`bg-container`: MazCard, MazContainer, MazDialog, MazPopover, MazDrawer...',
  'input.bg': '`bg-input`: MazInput, MazSelect, MazTextarea, MazCheckbox...',
  'input.top-label-font-weight': 'font weight of the `top-label` of the inputs',
  'dialog.max-width': 'max width of MazDialog',
  'dialog.min-width': 'min width of MazDialog',
}

function code(value: string): string {
  return `\`${value.replaceAll('`', '\'').replaceAll('|', '\\|')}\``
}

function shorten(value: string, max = 70): string {
  return value.length > max ? `${value.slice(0, max - 3)}...` : value
}

function display(value: PresetValue | undefined): string {
  if (value === undefined)
    return '-'

  return code(shorten(typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)))
}

function asRecord(value: PresetValue | undefined): Record<string, PresetValue> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

const COLOR_CLASSES: Record<string, string> = {
  shadow: '`shadow-shadow/20`',
  overlay: '`bg-overlay`',
  divider: '`border-divider`',
}

function colorClasses(name: string): string {
  if (COLOR_CLASSES[name])
    return COLOR_CLASSES[name]

  return name.endsWith('-foreground') ? code(`text-${name}`) : `${code(`bg-${name}`)} ${code(`text-${name}`)}`
}

function presetColors(preset: ProjectPreset): string[] {
  const colors = asRecord(preset.overrides.colors)
  const light = asRecord(colors.light)
  const dark = asRecord(colors.dark)
  const names = [...new Set([...Object.keys(light), ...Object.keys(dark)])]

  if (names.length === 0)
    return []

  return [
    '| Color | Classes | Light | Dark |',
    '| --- | --- | --- | --- |',
    ...names.map(name => `| \`${name}\` | ${colorClasses(name)} | ${display(light[name])} | ${display(dark[name])} |`),
  ]
}

function presetFoundation(preset: ProjectPreset, wanted: (topic: ThemeTopic) => boolean): string[] {
  const rows = Object.entries(asRecord(preset.overrides.foundation))
    .filter(([key]) => wanted(FOUNDATION_USAGE[key]?.topic ?? 'css-variables'))
    .map(([key, value]) => `| \`${key}\` | \`--maz-${key}\` | ${FOUNDATION_USAGE[key]?.usage ?? '-'} | ${display(value)} |`)

  return rows.length > 0 ? ['| Foundation | CSS variable | Used by | Value |', '| --- | --- | --- | --- |', ...rows] : []
}

function presetScales(preset: ProjectPreset, wanted: (topic: ThemeTopic) => boolean): string[] {
  const scales = asRecord(preset.overrides.scales)
  const rows = [
    ...(wanted('radius') ? Object.entries(asRecord(scales.rounded)).map(([key, value]) => `| ${code(`rounded-${key}`)} | ${display(value)} |`) : []),
    ...(wanted('shadows') ? Object.entries(asRecord(scales.shadow)).map(([key, value]) => `| ${code(`shadow-${key}`)} | ${display(value)} |`) : []),
  ]

  return rows.length > 0 ? ['| Class | Value |', '| --- | --- |', ...rows] : []
}

function flatten(value: PresetValue, path: string): Array<[string, PresetValue]> {
  const record = asRecord(value)
  const keys = Object.keys(record)

  if (keys.length === 0 || keys.every(key => key === 'light' || key === 'dark'))
    return [[path, value]]

  return keys.flatMap(key => flatten(record[key], path ? `${path}.${key}` : key))
}

function presetComponents(preset: ProjectPreset): string[] {
  const rows = flatten(asRecord(preset.overrides.components), '')
    .filter(([path]) => path)
    .map(([path, value]) => `| \`components.${path}\` | ${COMPONENT_USAGE[path] ?? '-'} | ${display(value)} |`)

  return rows.length > 0 ? ['| Component token | Used by | Value |', '| --- | --- | --- |', ...rows] : []
}

function renderPreset(preset: ProjectPreset, wanted: (topic: ThemeTopic) => boolean, filtered: boolean): string | undefined {
  const name = typeof preset.overrides.name === 'string' ? ` \`${preset.overrides.name}\`` : ''
  const origin = [preset.exportName && `\`${preset.exportName}\``, preset.base && `base \`${preset.base}\``].filter(Boolean).join(', ')
  const tables = [
    wanted('colors') ? presetColors(preset) : [],
    presetFoundation(preset, wanted),
    presetScales(preset, wanted),
    wanted('colors') ? presetComponents(preset) : [],
  ].filter(table => table.length > 0)

  if (filtered && tables.length === 0)
    return undefined

  return [
    `### Preset${name} - \`${preset.file}\`${origin ? ` (${origin})` : ''}`,
    'The preset sets the **values** of the maz-ui tokens at runtime, the class names stay the same: `bg-primary` uses the preset `primary`, `font-display` the preset `font-display-stack`. Brand colors, fonts, radius, shadows and motion belong here, not in CSS.',
    ...tables.map(table => table.join('\n')),
  ].join('\n\n')
}

/** maz-ui Tailwind variables, with their maz-ui value, to spot the project tokens that redefine them */
export function mazUiThemeVariables(tailwind: TailwindTokens): Map<string, string> {
  const variables = new Map<string, string>()
  const named = (entries: Array<{ name: string, value: string }>, toVariable: (name: string) => string): void => {
    for (const entry of entries) variables.set(toVariable(entry.name), entry.value)
  }

  for (const color of tailwind.colors) variables.set(`--color-${color.name}`, `var(${color.variable})`)
  named(tailwind.fonts, name => `--${name}`)
  named(tailwind.radius, name => name.replace(/^rounded-/, '--radius-'))
  named(tailwind.shadows, name => `--${name}`)
  named(tailwind.breakpoints, name => `--breakpoint-${name.replace(/:$/, '')}`)
  named(tailwind.easings, name => `--${name}`)
  named(tailwind.zIndex, name => `--${name}`)
  named(tailwind.durations, name => /--duration-[\w-]+/.exec(name)?.[0] ?? name)

  return variables
}

function tokenNote(token: ProjectToken, mazUi: Map<string, string>): string {
  const original = mazUi.get(token.variable)
  const notes = [
    token.comment,
    original && original !== token.value ? `Redefines the maz-ui token (maz-ui: ${code(shorten(original, 50))}): this class no longer follows the preset.` : undefined,
  ]

  return notes.filter(Boolean).join(' ').replaceAll('|', '\\|') || '-'
}

function renderStylesheet(stylesheet: ProjectStylesheet, mazUi: Map<string, string>, wanted: (topic: ThemeTopic) => boolean, animated: Set<string>): string[] {
  const sections: string[] = []
  const problems = stylesheetProblems(stylesheet)

  if (problems.length > 0)
    sections.push(problems.map(problem => `> ${problem}`).join('\n>\n'))

  const tokens = stylesheet.tokens.filter(token => wanted(token.topic))

  if (tokens.length > 0) {
    sections.push([
      `#### Project tokens (\`@theme\`)`,
      '',
      '| Classes | Variable | Value | Note |',
      '| --- | --- | --- | --- |',
      ...tokens.map(token => `| ${code(token.usage)} | \`${token.variable}\` | ${code(shorten(token.value, 60))} | ${tokenNote(token, mazUi)} |`),
    ].join('\n'))
  }

  if (stylesheet.resets.length > 0 && wanted('colors'))
    sections.push(`Reset namespaces: ${stylesheet.resets.map(reset => code(reset)).join(', ')}: the default Tailwind tokens of these namespaces do not exist.`)

  if (stylesheet.variants.length > 0 && (wanted('variants') || wanted('breakpoints')))
    sections.push(['#### Custom variants', '', '| Variant | Definition |', '| --- | --- |', ...stylesheet.variants.map(variant => `| \`${variant.name}:\` | ${code(shorten(variant.definition))} |`)].join('\n'))

  if (stylesheet.utilities.length > 0 && wanted('utilities'))
    sections.push(['#### Custom utilities', '', '| Class | CSS |', '| --- | --- |', ...stylesheet.utilities.map(utility => `| \`${utility.name}\` | ${code(shorten(utility.css))} |`)].join('\n'))

  const keyframes = stylesheet.keyframes.filter(name => !animated.has(name))

  if (keyframes.length > 0 && wanted('typography'))
    sections.push(`Keyframes without \`animate-*\` token: ${keyframes.map(name => code(name)).join(', ')}. Use them in CSS or add a \`--animate-<name>\` token to the \`@theme\` to get a class.`)

  if (stylesheet.mazVariables.length > 0 && (wanted('layout') || wanted('css-variables'))) {
    sections.push([
      '#### maz-ui variables set in CSS',
      '',
      '| Variable | Value | Selector |',
      '| --- | --- | --- |',
      ...stylesheet.mazVariables.map(variable => `| \`${variable.variable}\` | ${code(shorten(variable.value, 50))} | ${code(variable.selector)} |`),
    ].join('\n'))
  }

  return sections
}

function renderStylesheetSection(stylesheet: ProjectStylesheet, mazUi: Map<string, string>, topics: ThemeTopic[] | undefined, animated: Set<string>): string | undefined {
  const sections = renderStylesheet(stylesheet, mazUi, topic => !topics?.length || topics.includes(topic), animated)

  if (topics?.length && sections.length === 0)
    return undefined

  const imports = stylesheet.imports.length > 0 ? [`Imports: ${stylesheet.imports.map(path => code(path)).join(', ')}`] : []

  return [`### Tailwind \`${stylesheet.file}\``, ...imports, ...sections].join('\n\n')
}

/** Setup problems of a Tailwind entry (the file that imports `tailwindcss`) */
export function stylesheetProblems(stylesheet: ProjectStylesheet): string[] {
  if (!stylesheet.imports.includes('tailwindcss'))
    return []

  const mazUiImports = stylesheet.imports.filter(path => path.startsWith('maz-ui/tailwindcss'))
  const problems: string[] = []

  if (mazUiImports.length === 0)
    problems.push('The maz-ui theme is not imported: `bg-primary`, `rounded-md`, `mob-m:`... do not exist. Add `@import \'maz-ui/tailwindcss/theme.css\';` after `@import \'tailwindcss\';`.')
  else if (!mazUiImports.includes('maz-ui/tailwindcss/utilities.css'))
    problems.push('`maz-ui/tailwindcss/utilities.css` is not imported: `flex-center`, `padded-container`, `disabled-state`... do not exist.')

  return problems
}

const HOW_IT_WORKS = `How your theme combines with maz-ui:

1. **The preset** (\`definePreset\` of \`@maz-ui/themes\`) sets the runtime values of the maz-ui tokens (\`--maz-*\`): brand colors, fonts, radius, shadows, motion. The maz-ui classes keep their names and follow it, in light and dark mode.
2. **The Tailwind entry** imports the maz-ui theme, then extends it with \`@theme\` tokens (each one generates classes: \`--animate-rise\` -> \`animate-rise\`, \`--font-display\` -> \`font-display\`), \`@custom-variant\` and \`@utility\`.
3. **Pick classes in this order**: the project tokens below for project-specific needs, then the maz-ui classes, never the default Tailwind palette, hard-coded values or arbitrary values. When a value is missing, add a token to the project \`@theme\` (or a brand value to the preset) and use its class.`

export function renderProjectTheme(theme: ProjectTheme, tailwind: TailwindTokens, topics?: ThemeTopic[]): string | undefined {
  if (theme.stylesheets.length === 0 && theme.presets.length === 0)
    return undefined

  const wanted = (topic: ThemeTopic): boolean => !topics?.length || topics.includes(topic)
  const mazUi = mazUiThemeVariables(tailwind)
  const animated = new Set(theme.stylesheets.flatMap(stylesheet => stylesheet.tokens
    .filter(token => token.variable.startsWith('--animate-'))
    .map(token => token.value.split(/\s/)[0])))

  return [
    '## Your project theme',
    HOW_IT_WORKS,
    ...theme.presets.map(preset => renderPreset(preset, wanted, !!topics?.length)),
    ...theme.stylesheets.map(stylesheet => renderStylesheetSection(stylesheet, mazUi, topics, animated)),
  ].filter(Boolean).join('\n\n')
}
