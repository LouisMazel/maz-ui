// Maz-UI v4 → v5 mechanical transforms.
//
// Each function is a pure (string) → string. The `transformFile` orchestrator
// composes them based on file extension. The CLI exposes per-group toggles
// (--only=imports|props|css|config), so each transform stays standalone.

// --- 1. Import path renames ------------------------------------------------
// `maz-ui/styles` → `maz-ui/style.css`, `maz-ui/aos-styles` → `maz-ui/aos.css`.
// `from 'maz-ui'` / `import('maz-ui')` / `require('maz-ui')` → `'@maz-ui/utils'`.
// The root re-export of `@maz-ui/utils` was removed in v5; subpaths
// (`maz-ui/components`, `maz-ui/style.css`, …) are left untouched.

const IMPORT_PATH = /(['"])maz-ui\/(styles|aos-styles)\1/g
const ROOT_IMPORT_SPECIFIER = /(\bfrom\s+|\bimport\s*\(\s*|\brequire\s*\(\s*)(['"])maz-ui\2/g

export function transformImports(content: string): string {
  return content
    .replace(IMPORT_PATH, (_, q, sub) => `${q}maz-ui/${sub === 'styles' ? 'style.css' : 'aos.css'}${q}`)
    .replace(ROOT_IMPORT_SPECIFIER, (_, prefix, quote) => `${prefix}${quote}@maz-ui/utils${quote}`)
}

export function hasMazUiRootImport(content: string): boolean {
  return /(?:\bfrom\s+|\bimport\s*\(\s*|\brequire\s*\(\s*)(['"])maz-ui\1/.test(content)
}

// --- 2. Component prop / slot renames --------------------------------------
// Applied to .vue templates. Patterns are specific enough to be safe globally
// (`left-icon` / `right-icon` / `footer-align` / `rounded-size` are not common
// outside maz-ui usage). The `variant=` and `color=` patterns are scoped to
// `<Maz…>` opening tags to avoid touching unrelated components.

const ICON_ATTR = /(\s:?)(left|right)-icon\b/g
const ICON_SLOT = /#(left|right)-icon\b/g
const ICON_LEFT_RIGHT_SLOT = /#icon-(left|right)\b/g
const FOOTER_ALIGN = /(\sfooter-align\s*=\s*['"])(left|right)(['"])/g
const ROUNDED_SIZE_BASE = /(\srounded-size\s*=\s*['"])base(['"])/g
const ACTIVE_COLOR_BG = /(\sactive-color\s*=\s*['"])background(['"])/g
const HAS_ICON_CLASS = /\.--has-(left|right)-icon\b/g

const MAZ_OPEN_TAG = /<Maz[A-Z]\w*\b[^>]*>/g
const VARIANT_LR = /(\svariant\s*=\s*['"])(left|right)(['"])/g
const COLOR_BG = /(\scolor\s*=\s*['"])background(['"])/g

function flipDirection(value: string): string {
  return value === 'left' ? 'start' : 'end'
}

export function transformProps(content: string): string {
  let out = content

  out = out.replace(ICON_ATTR, (_, prefix, dir) => `${prefix}${flipDirection(dir)}-icon`)
  out = out.replace(ICON_SLOT, (_, dir) => `#${flipDirection(dir)}-icon`)
  out = out.replace(ICON_LEFT_RIGHT_SLOT, (_, dir) => `#icon-${flipDirection(dir)}`)
  out = out.replace(FOOTER_ALIGN, (_, p, dir, s) => `${p}${flipDirection(dir)}${s}`)
  out = out.replace(ROUNDED_SIZE_BASE, (_, p, s) => `${p}md${s}`)
  out = out.replace(ACTIVE_COLOR_BG, (_, p, s) => `${p}surface${s}`)
  out = out.replace(HAS_ICON_CLASS, (_, dir) => `.--has-${flipDirection(dir)}-icon`)

  out = out.replace(MAZ_OPEN_TAG, tag => tag
    .replace(VARIANT_LR, (_, p, dir, s) => `${p}${flipDirection(dir)}${s}`)
    .replace(COLOR_BG, (_, p, s) => `${p}surface${s}`))

  return out
}

// --- 3. CSS variable + hsl(var(...)) collapse ------------------------------
// `--maz-background[-N]` → `--maz-surface[-N]`, `--maz-border[-N]` → `--maz-divider[-N]`.
// Negative lookahead protects suffixes like `--maz-border-width` that are
// foundation tokens, not the divider color scale.

const MAZ_BACKGROUND = /--maz-background(?:(?![-\w])|(?=-(?:foreground|\d)))/g
const MAZ_BORDER_COLOR = /--maz-border(?:(?![-\w])|(?=-(?:foreground|\d)))/g

const MAZ_VAR = String.raw`var\(--(?:maz|m)-[\w-]+\)`
const HSL_WITH_ALPHA = new RegExp(String.raw`hsl\(\s*(${MAZ_VAR})\s*\/\s*([^)]+)\)`, 'g')
const HSL_NO_ALPHA = new RegExp(String.raw`hsl\(\s*(${MAZ_VAR})\s*\)`, 'g')

export function transformCssVars(content: string): string {
  return content
    .replace(MAZ_BACKGROUND, '--maz-surface')
    .replace(MAZ_BORDER_COLOR, '--maz-divider')
}

export function transformHslVar(content: string): string {
  return content
    .replace(HSL_WITH_ALPHA, (_, v, alpha) => `color-mix(in srgb, ${v} ${alpha.trim()}, transparent)`)
    .replace(HSL_NO_ALPHA, (_, v) => v)
}

// --- 4. Config key renames -------------------------------------------------
// Nuxt module: `injectMainCss:` → `injectCss:`.
// Theme strategy literal: `'hybrid'` → `'runtime'`.
// Removes dropped theme injection options that are now silently ignored.

const NUXT_INJECT_MAIN_CSS = /\binjectMainCss\b/g
const STRATEGY_HYBRID = /(\bstrategy\s*:\s*['"])hybrid(['"])/g
const DEPRECATED_THEME_OPTIONS = /^[^\S\n]*(?:injectCriticalCSS|injectFullCSS|injectAllCSSOnServer)\s*:[^,\n]*,?[^\S\n]*\n?/gm

export function transformConfig(content: string): string {
  return content
    .replace(NUXT_INJECT_MAIN_CSS, 'injectCss')
    .replace(STRATEGY_HYBRID, (_, p, s) => `${p}runtime${s}`)
    .replace(DEPRECATED_THEME_OPTIONS, '')
}

// --- 5. Theme preset color keys --------------------------------------------
// Inside `light: { … }` / `dark: { … }` flat object blocks (the shape used
// for `colors.light` / `colors.dark` in custom presets), rename:
//   - `background:` → `surface:`
//   - `border:` → `divider:`
// The transform is scoped to the brace-balanced light/dark blocks so it never
// touches generic CSS-in-JS objects, JSX style props, or unrelated theme
// libraries elsewhere in the codebase.

const LIGHT_DARK_BLOCK = /(\b(?:light|dark)\s*:\s*\{)([^{}]*)(\})/g

export function transformPresetColors(content: string): string {
  return content.replace(LIGHT_DARK_BLOCK, (_, open, body, close) => {
    const renamed = body
      .replace(/(['"]?)background\1(\s*:)/g, (_match: string, q: string, suffix: string) => `${q}surface${q}${suffix}`)
      .replace(/(['"]?)border\1(\s*:)/g, (_match: string, q: string, suffix: string) => `${q}divider${q}${suffix}`)
    return `${open}${renamed}${close}`
  })
}

// --- 5b. Detection-only: foundation.radius -------------------------------
// Detect `foundation: { … radius: … }` in TS/JS sources. The migration moves
// the value to `scales.rounded.md`, but the rewrite is structural (key moved
// across blocks) and unsafe to do via regex. The CLI surfaces a warning at
// the end of the run so the user can move the value by hand. Scoped to a
// brace-balanced `foundation` block to avoid false positives on unrelated
// `radius` keys (e.g. CSS-in-JS, chart configs, …).

const FOUNDATION_BLOCK = /\bfoundation\s*:\s*\{([^{}]*)\}/g
const RADIUS_KEY_INSIDE = /(?:^|[\s,{])(['"]?)radius\1\s*:/

export function hasFoundationRadius(content: string): boolean {
  for (const match of content.matchAll(FOUNDATION_BLOCK)) {
    if (RADIUS_KEY_INSIDE.test(match[1]))
      return true
  }
  return false
}

// --- 6. Dependency version bumps in package.json ---------------------------
// Bumps every `maz-ui` and `@maz-ui/*` entry in `dependencies`,
// `devDependencies` and `peerDependencies` to the v5 target range. Workspace,
// link, file, npm-tag and url specs are left untouched. Indentation and the
// trailing newline of the original file are preserved.

const MAZ_UI_PKG = /^(?:maz-ui|@maz-ui\/.+)$/
const TARGET_VERSION = '^5.0.0'
const UTILS_PKG = '@maz-ui/utils'
const PROTECTED_PREFIX = /^(?:workspace|link|file|portal|npm|http|https|git\+|github):/

function shouldBump(name: string, range: string): boolean {
  if (!MAZ_UI_PKG.test(name))
    return false
  if (PROTECTED_PREFIX.test(range))
    return false
  if (['latest', 'next', 'beta', 'alpha', 'canary', '*'].includes(range))
    return false
  return range !== TARGET_VERSION
}

function detectIndent(content: string): string | number {
  const match = content.match(/\n([ \t]+)"/)
  return match ? match[1] : 2
}

const DEP_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies'] as const
type DepField = typeof DEP_FIELDS[number]

function getDepMap(pkg: Record<string, unknown>, field: DepField): Record<string, unknown> | undefined {
  const deps = pkg[field]
  if (!deps || typeof deps !== 'object' || Array.isArray(deps))
    return undefined
  return deps as Record<string, unknown>
}

function packageHasUtils(pkg: Record<string, unknown>): boolean {
  return DEP_FIELDS.some((field) => {
    const map = getDepMap(pkg, field)
    return !!map && UTILS_PKG in map
  })
}

function findMazUiHostField(pkg: Record<string, unknown>): DepField | undefined {
  for (const field of DEP_FIELDS) {
    const map = getDepMap(pkg, field)
    if (!map)
      continue
    if (Object.keys(map).some(k => k === 'maz-ui' || k.startsWith('@maz-ui/')))
      return field
  }
  return undefined
}

export interface TransformDepsOptions {
  addUtils?: boolean
}

export function transformDeps(content: string, options: TransformDepsOptions = {}): string {
  let pkg: Record<string, unknown>
  try {
    pkg = JSON.parse(content)
  }
  catch {
    return content
  }
  if (!pkg || typeof pkg !== 'object' || Array.isArray(pkg))
    return content

  let changed = false
  for (const field of DEP_FIELDS) {
    const map = getDepMap(pkg, field)
    if (!map)
      continue
    for (const [name, range] of Object.entries(map)) {
      if (typeof range !== 'string')
        continue
      if (shouldBump(name, range)) {
        map[name] = TARGET_VERSION
        changed = true
      }
    }
  }

  if (options.addUtils && !packageHasUtils(pkg)) {
    const host = findMazUiHostField(pkg)
    if (host) {
      const map = getDepMap(pkg, host)!
      map[UTILS_PKG] = TARGET_VERSION
      changed = true
    }
  }

  if (!changed)
    return content

  const indent = detectIndent(content)
  const trailingNewline = content.endsWith('\n') ? '\n' : ''
  return JSON.stringify(pkg, null, indent) + trailingNewline
}

// --- Orchestration ---------------------------------------------------------

export type TransformGroup = 'imports' | 'props' | 'css' | 'config' | 'deps'

export const ALL_GROUPS: readonly TransformGroup[] = ['imports', 'props', 'css', 'config', 'deps']

export interface TransformOptions {
  groups?: readonly TransformGroup[]
  addUtilsDep?: boolean
}

export function transformFile(filename: string, content: string, options: TransformOptions = {}): string {
  const groups = options.groups ?? ALL_GROUPS
  const enabled = (g: TransformGroup) => groups.includes(g)

  const isVue = filename.endsWith('.vue')
  const isCss = filename.endsWith('.css')
  const isJs = /\.[cm]?[jt]sx?$/.test(filename)
  const isPackageJson = /(?:^|[\\/])package\.json$/.test(filename)

  let out = content

  if (enabled('imports') && (isVue || isJs))
    out = transformImports(out)

  if (enabled('props') && isVue)
    out = transformProps(out)

  if (enabled('css')) {
    if (isVue || isCss)
      out = transformCssVars(out)
    if (isVue || isCss || isJs)
      out = transformHslVar(out)
  }

  if (enabled('config') && (isVue || isJs)) {
    out = transformConfig(out)
    out = transformPresetColors(out)
  }

  if (enabled('deps') && isPackageJson)
    out = transformDeps(out, { addUtils: options.addUtilsDep })

  return out
}
