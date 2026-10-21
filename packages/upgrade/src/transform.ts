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

const IMPORT_PATH = /(['"])maz-ui\/(styles|aos-styles|dist\/css\/main\.css|dist\/css\/aos\.css)\1/g
const ROOT_IMPORT_SPECIFIER = /(\bfrom\s+|\bimport\s*\(\s*|\brequire\s*\(\s*)(['"])maz-ui\2/g

const STYLE_IMPORT_TARGET: Record<string, string> = {
  'styles': 'style.css',
  'aos-styles': 'aos.css',
  'dist/css/main.css': 'style.css',
  'dist/css/aos.css': 'aos.css',
}

// The `maz-ui` root entry still exists in v5, as a type-only surface: imports
// made only of these types are kept on `maz-ui`, so already migrated code (or a
// second run) is never broken.
const MAZ_UI_ROOT_TYPES = new Set([
  'MazColor',
  'MazRoundedSize',
  'MazSize',
  'MazSizeUnit',
  'GlobalizableProps',
  'MazComponentName',
  'MazUiDefaultsOptions',
  'MazUiOptions',
])
const ROOT_NAMED_STATEMENT = /\b(import|export)(\s+type)?\s*\{([^}]*)\}\s*from\s*(['"])maz-ui\4/g
const ROOT_TYPES_PLACEHOLDER = '\u0000maz-ui-root-types\u0000'

function isRootTypesOnly(specifiers: string): boolean {
  const names = specifiers
    .split(',')
    .map(specifier => specifier.trim().replace(/^type\s/, '').trim().split(/\sas\s/)[0]?.trim())
    .filter(Boolean)

  return names.length > 0 && names.every(name => MAZ_UI_ROOT_TYPES.has(name as string))
}

function maskRootTypeImports(content: string): string {
  return content.replace(ROOT_NAMED_STATEMENT, (statement, _kind, _type, specifiers, quote) =>
    isRootTypesOnly(specifiers) ? statement.replace(`${quote}maz-ui${quote}`, `${quote}${ROOT_TYPES_PLACEHOLDER}${quote}`) : statement)
}

export function transformImports(content: string): string {
  return maskRootTypeImports(content)
    .replace(IMPORT_PATH, (_, q, sub) => `${q}maz-ui/${STYLE_IMPORT_TARGET[sub]}${q}`)
    .replace(ROOT_IMPORT_SPECIFIER, (_, prefix, quote) => `${prefix}${quote}@maz-ui/utils${quote}`)
    .replaceAll(ROOT_TYPES_PLACEHOLDER, 'maz-ui')
}

// Stylesheets import the CSS entries too (`@import 'maz-ui/dist/css/main.css'`).
export function transformStyleImports(content: string): string {
  return content.replace(IMPORT_PATH, (_, q, sub) => `${q}maz-ui/${STYLE_IMPORT_TARGET[sub]}${q}`)
}

export function hasMazUiRootImport(content: string): boolean {
  return /(?:\bfrom\s+|\bimport\s*\(\s*|\brequire\s*\(\s*)(['"])maz-ui\1/.test(maskRootTypeImports(content))
}

// Detection-only: the `./*` wildcard export of maz-ui was removed in v5, deep
// `maz-ui/dist/...` imports (other than the CSS entries rewritten above) no
// longer resolve.

const DIST_IMPORT = /(['"])maz-ui\/dist\/(?!css\/(?:main|aos)\.css\1)[^'"]+\1/

export function hasMazUiDistImport(content: string): boolean {
  return DIST_IMPORT.test(content)
}

// Detection-only: `valibot` was a dependency of maz-ui v4, it is an optional
// peer dependency in v5. Projects importing it directly must declare it.

const VALIBOT_IMPORT = /(?:\bfrom\s+|\bimport\s*\(\s*|\brequire\s*\(\s*)(['"])valibot\1/

export function hasValibotImport(content: string): boolean {
  return VALIBOT_IMPORT.test(content)
}

// --- 2. Component prop / slot renames --------------------------------------
// Applied to .vue templates. The icon props, `variant=` and `color=` are scoped
// to `<Maz…>` / `<maz-…>` opening tags so other libraries (Vant `left-icon`…)
// and unrelated attributes are never touched. Slots, `footer-align`,
// `rounded-size` and `active-color` are specific enough to stay global.

/**
 * Opening tags of the given components. Quoted attribute values may contain
 * `>` (`@click="() => go()"`), so they are matched as a whole.
 */
function openTags(names: string): RegExp {
  return new RegExp(String.raw`<(?:${names})\b(?:[^>"']|"[^"]*"|'[^']*')*>`, 'g')
}

const MAZ_OPEN_TAG = openTags(String.raw`Maz[A-Z]\w*|maz-[a-z][\w-]*`)

const ICON_ATTR = /(\s(?::|v-bind:)?)(left|right)-icon\b/g
const ICON_ATTR_CAMEL = /(\s(?::|v-bind:)?)(left|right)Icon\b/g
const ICON_SLOT = /(#|\bv-slot:)(left|right)-icon\b/g
const ICON_LEFT_RIGHT_SLOT = /(#|\bv-slot:)icon-(left|right)\b/g
const FOOTER_ALIGN = /(\s(?:footer-align|footerAlign)\s*=\s*['"])(left|right)(['"])/g
const ROUNDED_SIZE_BASE = /(\s(?:rounded-size|roundedSize)\s*=\s*['"])base(['"])/g
const ACTIVE_COLOR_BG = /(\s(?:active-color|activeColor)\s*=\s*['"])background(['"])/g

const VARIANT_LR = /(\svariant\s*=\s*['"])(left|right)(['"])/g
const COLOR_BG = /(\scolor\s*=\s*['"])background(['"])/g

function flipDirection(value: string): string {
  return value === 'left' ? 'start' : 'end'
}

// --- 2a. Internal class names -----------------------------------------------
// `.--has-left-icon` → `.--has-start-icon`, `.m-input-wrapper-left` →
// `.m-input-wrapper-start`, `drawer-anim-left` → `drawer-anim-start` (and the
// right/end counterparts). These names are specific to maz-ui. Applied to .vue
// files and stylesheets.

const HAS_ICON_CLASS = /\.--has-(left|right)-icon\b/g
const INPUT_WRAPPER_CLASS = /\bm-input-wrapper-(left|right)\b/g
const DRAWER_ANIM_CLASS = /\bdrawer-anim-(left|right)\b/g

export function transformClassNames(content: string): string {
  return content
    .replace(HAS_ICON_CLASS, (_, dir) => `.--has-${flipDirection(dir)}-icon`)
    .replace(INPUT_WRAPPER_CLASS, (_, dir) => `m-input-wrapper-${flipDirection(dir)}`)
    .replace(DRAWER_ANIM_CLASS, (_, dir) => `drawer-anim-${flipDirection(dir)}`)
}

// --- 2d. Bare icon names ------------------------------------------------------
// v4 rendered a string icon prop as `<MazIcon :name>` → `${mazIconPath}/<name>.svg`.
// v5 only accepts a URL (or a raw SVG) for a string: a bare name renders
// nothing. `start-icon="user"` → `start-icon="/user.svg"` renders the same file
// (`mazIconPath` is prepended to relative URLs). A bare name is never a valid v5
// value, so the rewrite is idempotent. Bound values stay manual.

const ICON_STRING_TAG = openTags('MazBtn|MazInput|MazLink|MazContainer|MazDropdown|MazAlert|maz-btn|maz-input|maz-link|maz-container|maz-dropdown|maz-alert')
const BARE_ICON_NAME = /(\s(?:start-icon|end-icon|startIcon|endIcon|icon|dropdown-icon|dropdownIcon)\s*=\s*)(["'])([\w-]+)\2/g

export function transformBareIconNames(content: string): string {
  return content.replace(ICON_STRING_TAG, tag =>
    tag.replace(BARE_ICON_NAME, (_, prefix, quote, name) => `${prefix}${quote}/${name}.svg${quote}`))
}

// --- 2e. MazIcon name / path / src → icon --------------------------------------
// `src="/a.svg"` → `icon="/a.svg"` (`:src` → `:icon`). A static `name` (with an
// optional static `path`) becomes the matching URL: `name="home"` →
// `icon="/home.svg"`, `name="home" path="/icons"` → `icon="/icons/home.svg"`.
// Bound `:name` / `:path` and the removed `@loaded` / `@unloaded` events are
// surfaced as warnings by the CLI.

const MAZ_ICON_OPEN_TAG = openTags('MazIcon|maz-icon')
const ICON_SRC_ATTR = /(\s(?::|v-bind:)?)src(\s*=)/g
const ICON_STATIC_NAME = /\sname\s*=\s*(["'])([^"']+)\1/
const ICON_STATIC_PATH = /\spath\s*=\s*(["'])([^"']*)\1/
const ICON_BOUND_NAME_OR_PATH = /\s(?::|v-bind:)(?:name|path)\s*=/

function transformIconName(tag: string): string {
  const nameMatch = tag.match(ICON_STATIC_NAME)

  if (!nameMatch || ICON_BOUND_NAME_OR_PATH.test(tag))
    return tag

  const pathMatch = tag.match(ICON_STATIC_PATH)
  let base = pathMatch?.[2] ?? ''
  while (base.endsWith('/'))
    base = base.slice(0, -1)
  const quote = nameMatch[1]
  const url = `${base}/${nameMatch[2]}.svg`

  return tag
    .replace(ICON_STATIC_PATH, '')
    .replace(ICON_STATIC_NAME, ` icon=${quote}${url}${quote}`)
}

export function transformMazIcon(content: string): string {
  return content.replace(MAZ_ICON_OPEN_TAG, tag =>
    transformIconName(tag.replace(ICON_SRC_ATTR, (_, prefix, suffix) => `${prefix}icon${suffix}`)))
}

const ICON_LEGACY_EVENTS = /\s(?:@|v-on:)(?:loaded|unloaded)\b/

export function hasMazIconLegacyApi(content: string): boolean {
  for (const match of content.matchAll(MAZ_ICON_OPEN_TAG)) {
    if (ICON_BOUND_NAME_OR_PATH.test(match[0]) || ICON_LEGACY_EVENTS.test(match[0]))
      return true
  }
  return false
}

export function transformProps(content: string): string {
  let out = content

  out = out.replace(ICON_SLOT, (_, prefix, dir) => `${prefix}${flipDirection(dir)}-icon`)
  out = out.replace(ICON_LEFT_RIGHT_SLOT, (_, prefix, dir) => `${prefix}icon-${flipDirection(dir)}`)
  out = out.replace(FOOTER_ALIGN, (_, p, dir, s) => `${p}${flipDirection(dir)}${s}`)
  out = out.replace(ROUNDED_SIZE_BASE, (_, p, s) => `${p}md${s}`)
  out = out.replace(ACTIVE_COLOR_BG, (_, p, s) => `${p}surface${s}`)
  out = transformClassNames(out)

  out = out.replace(MAZ_OPEN_TAG, tag => tag
    .replace(ICON_ATTR, (_, prefix, dir) => `${prefix}${flipDirection(dir)}-icon`)
    .replace(ICON_ATTR_CAMEL, (_, prefix, dir) => `${prefix}${dir === 'left' ? 'start' : 'end'}Icon`)
    .replace(VARIANT_LR, (_, p, dir, s) => `${p}${flipDirection(dir)}${s}`)
    .replace(COLOR_BG, (_, p, s) => `${p}surface${s}`))

  out = transformBareIconNames(out)
  out = transformMazIcon(out)
  out = transformAvatarSize(out)
  out = transformBadgeSize(out)
  out = transformPullToRefresh(out)

  return out
}

// --- 2c. MazPullToRefresh onClick → onRefresh ------------------------------
// v5 renamed the callback prop `on-click` / `onClick` to `on-refresh` /
// `onRefresh` (BREAKING) to reflect that it runs on release, not on click.
// Scoped to `<MazPullToRefresh>` open tags so native click handlers and the
// `onClick` prop of unrelated components are never touched.

const MAZ_PULL_TO_REFRESH_OPEN_TAG = openTags('MazPullToRefresh|maz-pull-to-refresh')
const PULL_TO_REFRESH_ON_CLICK_KEBAB = /(\s:?)on-click\b/g
const PULL_TO_REFRESH_ON_CLICK_CAMEL = /(\s:?)onClick\b/g

export function transformPullToRefresh(content: string): string {
  return content.replace(MAZ_PULL_TO_REFRESH_OPEN_TAG, tag => tag
    .replace(PULL_TO_REFRESH_ON_CLICK_KEBAB, (_, prefix) => `${prefix}on-refresh`)
    .replace(PULL_TO_REFRESH_ON_CLICK_CAMEL, (_, prefix) => `${prefix}onRefresh`))
}

// --- 2b. MazAvatar size scale (x3) -----------------------------------------
// v5 fixed the MazAvatar size ratio: a CSS-unit `size` used to render the
// avatar 3x larger than the value passed (the wrapper is `3em` of
// `font-size: size`). v5 honors the value 1:1. To preserve the previous
// rendered size, a static unit `size` value is multiplied by 3.
//
// The unit is matched generically (`<number><letters|%>`), so every CSS unit
// is supported. Keyword sizes (`mini`..`xl`) and `calc(...)` never start with a
// digit, so they are left untouched. Bound `:size` expressions are left alone
// too (surfaced as a warning by the CLI). Scoped to `<MazAvatar>` open tags so
// the `size` prop of every other component is never touched.

const MAZ_AVATAR_OPEN_TAG = openTags('MazAvatar|maz-avatar')
const AVATAR_SIZE_UNIT = /(?<![:\w-])(size\s*=\s*(["']))(\d+(?:\.\d+)?|\.\d+)([a-z%]+)\2/gi

function tripleLength(value: string): string {
  return String(Number.parseFloat((Number.parseFloat(value) * 3).toFixed(4)))
}

export function transformAvatarSize(content: string): string {
  return content.replace(MAZ_AVATAR_OPEN_TAG, tag =>
    tag.replace(AVATAR_SIZE_UNIT, (_, prefix, quote, num, unit) => `${prefix}${tripleLength(num)}${unit}${quote}`))
}

// --- 2f. MazBadge size: CSS length → MazSize keyword ------------------------
// v5 `MazBadge` `size` only accepts a `MazSize` keyword, the v4 value was the
// font-size of the badge. The keywords are rem font-sizes, so a static `rem`
// value is mapped to the closest one (a tie goes to the larger keyword), which
// matches the table of the migration guide whatever the root font size. `px` /
// `em` values depend on the root or the parent font size: they are surfaced as
// warnings by the CLI.

const MAZ_BADGE_OPEN_TAG = openTags('MazBadge|maz-badge')
const BADGE_STATIC_SIZE = /(?<![:\w-])(size\s*=\s*(["']))([^"']*)\2/
const BADGE_SIZE_KEYWORDS = new Set(['mini', 'xs', 'sm', 'md', 'lg', 'xl'])
const BADGE_KEYWORD_REM: [keyword: string, rem: number][] = [
  ['mini', 0.625],
  ['xs', 0.6875],
  ['sm', 0.75],
  ['md', 0.875],
  ['lg', 1],
  ['xl', 1.25],
]

function getClosestBadgeSize(rem: number): string {
  let closest = BADGE_KEYWORD_REM[0]

  for (const candidate of BADGE_KEYWORD_REM) {
    if (Math.abs(candidate[1] - rem) <= Math.abs(closest[1] - rem) + 1e-9)
      closest = candidate
  }

  return closest[0]
}

function parseRem(value: string): number | undefined {
  if (!value.endsWith('rem'))
    return undefined

  const number = value.slice(0, -'rem'.length)

  return /^[\d.]+$/.test(number) && Number.isFinite(Number(number)) ? Number(number) : undefined
}

export function transformBadgeSize(content: string): string {
  return content.replace(MAZ_BADGE_OPEN_TAG, tag => tag.replace(BADGE_STATIC_SIZE, (match, prefix, quote, value) => {
    const rem = parseRem(value.trim())
    return rem === undefined ? match : `${prefix}${getClosestBadgeSize(rem)}${quote}`
  }))
}

export function hasMazBadgeLengthSize(content: string): boolean {
  for (const match of content.matchAll(MAZ_BADGE_OPEN_TAG)) {
    const value = match[0].match(BADGE_STATIC_SIZE)?.[3].trim()

    if (value && !BADGE_SIZE_KEYWORDS.has(value) && parseRem(value) === undefined)
      return true
  }
  return false
}

// Detection-only: a bound `:size` / `v-bind:size` on a MazAvatar tag cannot be
// rewritten safely (the value is an expression). The CLI surfaces a warning so
// the user multiplies the unit value by 3 (or switches to a keyword) by hand.

const AVATAR_BOUND_SIZE = /(?:^|\s)(?::|v-bind:)size\s*=/

export function hasMazAvatarBoundSize(content: string): boolean {
  for (const match of content.matchAll(MAZ_AVATAR_OPEN_TAG)) {
    if (AVATAR_BOUND_SIZE.test(match[0]))
      return true
  }
  return false
}

// --- 3. CSS variable + hsl(var(...)) collapse ------------------------------
// `--maz-background[-N]` → `--maz-surface[-N]`, `--maz-border[-N]` → `--maz-divider[-N]`.
// Negative lookahead protects suffixes like `--maz-border-width` that are
// foundation tokens, not the divider color scale.

const MAZ_BACKGROUND = /--maz-background(?:(?![-\w])|(?=-(?:foreground|\d)))/g
const MAZ_BORDER_COLOR = /--maz-border(?:(?![-\w])|(?=-(?:foreground|\d)))/g

const MAZ_VAR = /^var\(--(?:maz|m)-[\w-]+\)$/
const HSL_OPEN = /hsl\(/g

export function transformCssVars(content: string): string {
  return content
    .replace(MAZ_BACKGROUND, '--maz-surface')
    .replace(MAZ_BORDER_COLOR, '--maz-divider')
}

/**
 * Index of the parenthesis closing the one opened right before `start`.
 */
function findClosingParen(content: string, start: number): number {
  let depth = 1

  for (let index = start; index < content.length; index++) {
    if (content[index] === '(')
      depth++
    else if (content[index] === ')')
      depth--

    if (depth === 0)
      return index
  }

  return -1
}

/**
 * `color-mix` takes a percentage: a unitless alpha (`0.5`) becomes `50%`, a
 * percentage is kept and any other expression (`var(--o)`, `calc(…)`) is
 * converted with `calc(… * 100%)`.
 */
function isPlainNumber(value: string): boolean {
  return /^[\d.]+$/.test(value) && Number.isFinite(Number(value))
}

function toPercentage(alpha: string): string {
  if (alpha.endsWith('%') && isPlainNumber(alpha.slice(0, -1)))
    return alpha

  if (isPlainNumber(alpha))
    return `${Number.parseFloat((Number.parseFloat(alpha) * 100).toFixed(4))}%`

  return `calc(${alpha} * 100%)`
}

function collapseHsl(inner: string): string | undefined {
  const slashIndex = inner.indexOf('/')
  const color = (slashIndex === -1 ? inner : inner.slice(0, slashIndex)).trim()

  if (!MAZ_VAR.test(color))
    return undefined

  if (slashIndex === -1)
    return color

  return `color-mix(in srgb, ${color} ${toPercentage(inner.slice(slashIndex + 1).trim())}, transparent)`
}

export function transformHslVar(content: string): string {
  let out = ''
  let cursor = 0

  for (const match of content.matchAll(HSL_OPEN)) {
    const start = match.index
    if (start < cursor)
      continue

    const innerStart = start + match[0].length
    const end = findClosingParen(content, innerStart)
    const collapsed = end === -1 ? undefined : collapseHsl(content.slice(innerStart, end))

    if (collapsed === undefined)
      continue

    out += content.slice(cursor, start) + collapsed
    cursor = end + 1
  }

  return out + content.slice(cursor)
}

// --- 4. Config key renames -------------------------------------------------
// Nuxt module: `injectMainCss:` → `injectCss:`.
// Theme strategy literal: `'hybrid'` → `'runtime'`.
// Removes dropped theme injection options that are now silently ignored.

const NUXT_INJECT_MAIN_CSS = /\binjectMainCss\b/g
const STRATEGY_HYBRID = /(\bstrategy\s*:\s*['"])hybrid(['"])/g

// Theme injection options and `generateCSS` / `buildThemeCSS` /
// `buildSeparateThemeFiles` options dropped in v5. The value is a literal, an
// array or a flat object, on its own line or inline (`{ preset, onlyCritical: true }`).
const DEPRECATED_OPTION_KEYS = 'injectCriticalCSS|injectFullCSS|injectAllCSSOnServer|onlyCritical|criticalColors|criticalFoundation|includeColorScales'
const DEPRECATED_OPTION_VALUE = String.raw`(?:\[[^\]\n]*\]|\{[^}\n]*\}|[^,}\n]*)`
const DEPRECATED_OPTION_INLINE_VALUE = String.raw`(?:\[[^\]\n]*\]|\{[^}\n]*\}|[^,}\n]*?)`
const DEPRECATED_OPTION_LINE = new RegExp(String.raw`^[ \t]*(?:${DEPRECATED_OPTION_KEYS})\s*:\s*${DEPRECATED_OPTION_VALUE},?[^\S\n]*\n?`, 'gm')
const DEPRECATED_OPTION_INLINE_AFTER = new RegExp(String.raw`,[^\S\n]*(?:${DEPRECATED_OPTION_KEYS})\s*:\s*${DEPRECATED_OPTION_INLINE_VALUE}(?=[^\S\n]*[,}])`, 'g')
const DEPRECATED_OPTION_INLINE_FIRST = new RegExp(String.raw`(\{[^\S\n]*)(?:${DEPRECATED_OPTION_KEYS})\s*:\s*${DEPRECATED_OPTION_INLINE_VALUE}(?:,[^\S\n]*|(?=[^\S\n]*\}))`, 'g')

/**
 * The rewrites relying on generic keys (`strategy: 'hybrid'`, `light: {}`…) only run on
 * files referencing maz-ui: imports, Nuxt `mazUi` key, maz-ui plugins and theme helpers.
 */
const MAZ_UI_REFERENCE = /['"](?:maz-ui|@maz-ui\/[\w-]+)(?:\/[^'"]*)?['"]|\bmazUi\s*:|\bMazUi\w*\b|\b(?:definePreset|setupTheme|useTheme)\s*\(|\bdarkModeStrategy\s*:/

export function referencesMazUi(content: string): boolean {
  return MAZ_UI_REFERENCE.test(content)
}

export function transformConfig(content: string): string {
  const out = content.replace(NUXT_INJECT_MAIN_CSS, 'injectCss')

  return (referencesMazUi(out) ? out.replace(STRATEGY_HYBRID, (_, p, s) => `${p}runtime${s}`) : out)
    .replace(DEPRECATED_OPTION_LINE, '')
    .replace(DEPRECATED_OPTION_INLINE_AFTER, '')
    .replace(DEPRECATED_OPTION_INLINE_FIRST, (_, open) => open)
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
  if (!referencesMazUi(content))
    return content

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
// Private in v5 (not published anymore): its v4 range is kept
const UNPUBLISHED_PKGS = new Set(['@maz-ui/cli'])
const TARGET_VERSION = '^5.0.0'
const UTILS_PKG = '@maz-ui/utils'
const VALIBOT_PKG = 'valibot'
const VALIBOT_VERSION = '^1.3.1'
const PROTECTED_PREFIX = /^(?:workspace|link|file|portal|npm|http|https|git\+|github):/

function shouldBump(name: string, range: string): boolean {
  if (!MAZ_UI_PKG.test(name) || UNPUBLISHED_PKGS.has(name))
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

function packageHasDep(pkg: Record<string, unknown>, name: string): boolean {
  return DEP_FIELDS.some((field) => {
    const map = getDepMap(pkg, field)
    return !!map && name in map
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
  /**
   * Add `valibot` next to maz-ui: a dependency of maz-ui v4, an optional peer in v5
   */
  addValibot?: boolean
}

function bumpMazUiVersions(pkg: Record<string, unknown>): boolean {
  let changed = false

  for (const field of DEP_FIELDS) {
    const map = getDepMap(pkg, field)
    if (!map)
      continue
    for (const [name, range] of Object.entries(map)) {
      if (typeof range === 'string' && shouldBump(name, range)) {
        map[name] = TARGET_VERSION
        changed = true
      }
    }
  }

  return changed
}

/**
 * Adds the missing dependencies in the field hosting maz-ui
 */
function addMissingDeps(pkg: Record<string, unknown>, deps: [name: string, version: string][]): boolean {
  let changed = false

  for (const [name, version] of deps) {
    const host = findMazUiHostField(pkg)

    if (!host || packageHasDep(pkg, name))
      continue

    getDepMap(pkg, host)![name] = version
    changed = true
  }

  return changed
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

  const addedDeps: [string, string][] = []
  if (options.addUtils)
    addedDeps.push([UTILS_PKG, TARGET_VERSION])
  if (options.addValibot)
    addedDeps.push([VALIBOT_PKG, VALIBOT_VERSION])

  const bumped = bumpMazUiVersions(pkg)
  const added = addMissingDeps(pkg, addedDeps)

  if (!bumped && !added)
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
  addValibotDep?: boolean
}

export const STYLESHEET_EXTENSION = /\.(?:css|scss|sass|less|styl|stylus|pcss|postcss)$/

type FileKind = 'vue' | 'stylesheet' | 'script' | 'packageJson'

function getFileKind(filename: string): FileKind | undefined {
  if (filename.endsWith('.vue'))
    return 'vue'
  if (STYLESHEET_EXTENSION.test(filename))
    return 'stylesheet'
  if (/\.[cm]?[jt]sx?$/.test(filename))
    return 'script'
  if (/(?:^|[\\/])package\.json$/.test(filename))
    return 'packageJson'
  return undefined
}

type Transform = (content: string, options: TransformOptions) => string

/**
 * Transforms applied to each kind of file, by group, in order
 */
const PIPELINE: { group: TransformGroup, kinds: readonly FileKind[], transform: Transform }[] = [
  { group: 'imports', kinds: ['vue', 'script'], transform: transformImports },
  { group: 'imports', kinds: ['stylesheet'], transform: transformStyleImports },
  { group: 'props', kinds: ['vue'], transform: transformProps },
  { group: 'css', kinds: ['stylesheet'], transform: transformClassNames },
  { group: 'css', kinds: ['vue', 'stylesheet', 'script'], transform: transformCssVars },
  { group: 'css', kinds: ['vue', 'stylesheet', 'script'], transform: transformHslVar },
  { group: 'config', kinds: ['vue', 'script'], transform: transformConfig },
  { group: 'config', kinds: ['vue', 'script'], transform: transformPresetColors },
  {
    group: 'deps',
    kinds: ['packageJson'],
    transform: (content, options) => transformDeps(content, { addUtils: options.addUtilsDep, addValibot: options.addValibotDep }),
  },
]

export function transformFile(filename: string, content: string, options: TransformOptions = {}): string {
  const groups = options.groups ?? ALL_GROUPS
  const kind = getFileKind(filename)

  if (!kind)
    return content

  return PIPELINE
    .filter(step => groups.includes(step.group) && step.kinds.includes(kind))
    .reduce((out, step) => step.transform(out, options), content)
}
