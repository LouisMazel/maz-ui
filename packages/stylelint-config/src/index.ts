import type { Plugin } from 'stylelint'
import type { Logger } from './configs/logger'
import type { MazStylelintOptions, StylelintConfig, StylelintOverride } from './types'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { baseRules } from './configs/base'
import { GLOBAL_IGNORES } from './configs/global'
import { createLogger } from './configs/logger'
import { LOGICAL_PLUGIN, logicalRules } from './configs/logical'
import { scssRules } from './configs/scss'
import {
  TAILWIND_POLICY_PLUGINS,
  tailwindAtRuleNoUnknown,
  tailwindPluginMinimal,
  tailwindPluginRecommended,
  tailwindPluginStrict,
  tailwindRules,
} from './configs/tailwind'

type StylelintPluginEntry = string | Plugin

const TAG = '[@maz-ui/stylelint-config]'

/**
 * Resolve a shareable config or plugin from the preset's own location instead
 * of the consumer's CWD. Stylelint walks `extends`/`plugins` strings through
 * Node module resolution rooted at the consumer project, which fails when the
 * preset is installed via a `file:`/`link:` dependency in pnpm — the consumer's
 * `node_modules` doesn't contain the transitive deps.
 *
 * Falling back to the bare name preserves the legacy behaviour for any name
 * that is not actually a preset dependency.
 */
const internalRequire = createRequire(import.meta.url)
function resolveInternal(name: string): string {
  try {
    const resolved = import.meta.resolve(name)
    return resolved.startsWith('file:') ? fileURLToPath(resolved) : resolved
  }
  catch {
    try {
      return internalRequire.resolve(name)
    }
    catch {
      return name
    }
  }
}

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

function readConsumerPackageJson(): PackageJson | undefined {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8')) as PackageJson
  }
  catch {
    return undefined
  }
}

function hasDependency(pkg: PackageJson | undefined, ...names: string[]): boolean {
  if (!pkg)
    return false
  const buckets = [pkg.dependencies, pkg.devDependencies, pkg.peerDependencies]
  return names.some(name => buckets.some(bucket => bucket && name in bucket))
}

type TailwindPolicy = 'minimal' | 'recommended' | 'strict'

type Source = 'explicit' | 'auto-detected' | 'default'

interface Resolution {
  vue: boolean
  vueSource: Source
  html: boolean
  htmlSource: Source
  tailwind: false | TailwindPolicy
  tailwindSource: Source
  scss: boolean
  scssSource: Source
  logical: boolean
  order: MazStylelintOptions['order']
}

function resolveTailwind(
  option: MazStylelintOptions['tailwind'],
  pkg: PackageJson | undefined,
): { value: false | TailwindPolicy, source: Source } {
  if (option === false)
    return { value: false, source: 'explicit' }
  if (option === true)
    return { value: 'minimal', source: 'explicit' }
  if (typeof option === 'string')
    return { value: option, source: 'explicit' }
  const detected = hasDependency(pkg, 'tailwindcss', '@tailwindcss/vite')
  return { value: detected ? 'minimal' : false, source: 'auto-detected' }
}

function resolveBoolean(
  explicit: boolean | undefined,
  detected: boolean,
): { value: boolean, source: Source } {
  if (explicit !== undefined)
    return { value: explicit, source: 'explicit' }
  return { value: detected, source: 'auto-detected' }
}

function formatSourceTag(source: Source): string {
  if (source === 'auto-detected')
    return ' (auto-detected)'
  if (source === 'default')
    return ' (default)'
  return ''
}

function formatResolutionBox(resolved: Resolution): string {
  const tailwindLabel = resolved.tailwind === false ? 'off' : resolved.tailwind
  const orderLabel = resolved.order === false ? 'off' : resolved.order ?? 'recess'
  const rows: Array<[string, string]> = [
    ['vue', `${resolved.vue}${formatSourceTag(resolved.vueSource)}`],
    ['html', `${resolved.html}${formatSourceTag(resolved.htmlSource)}`],
    ['tailwind', `${tailwindLabel}${formatSourceTag(resolved.tailwindSource)}`],
    ['scss', `${resolved.scss}${formatSourceTag(resolved.scssSource)}`],
    ['logical', String(resolved.logical)],
    ['order', String(orderLabel)],
  ]
  const labelWidth = Math.max(...rows.map(([k]) => k.length))
  return rows.map(([k, v]) => `${k.padEnd(labelWidth)}  ${v}`).join('\n')
}

function resolveOptions(options: MazStylelintOptions): Resolution {
  const pkg = readConsumerPackageJson()

  const vue = resolveBoolean(options.vue, hasDependency(pkg, 'vue', 'nuxt'))
  const html = options.html === undefined
    ? { value: false, source: 'default' as Source }
    : { value: options.html, source: 'explicit' as Source }
  const tailwind = resolveTailwind(options.tailwind, pkg)
  const scss = resolveBoolean(options.scss, hasDependency(pkg, 'sass', 'sass-embedded', 'node-sass'))

  return {
    vue: vue.value,
    vueSource: vue.source,
    html: html.value,
    htmlSource: html.source,
    tailwind: tailwind.value,
    tailwindSource: tailwind.source,
    scss: scss.value,
    scssSource: scss.source,
    logical: options.logical ?? true,
    order: options.order ?? 'recess',
  }
}

function applyScss(resolved: Resolution, ctx: BuildContext): void {
  if (!resolved.scss)
    return
  // `standard-scss` extends `recommended-scss` + `stylelint-config-standard`
  // adapted to SCSS, which gives more rule coverage than `recommended-scss`
  // alone.
  ctx.extends.push(resolveInternal('stylelint-config-standard-scss'))
  Object.assign(ctx.rules, scssRules(resolved.tailwind))
  // SCSS shipper-configs disable `at-rule-no-unknown` in favor of
  // `scss/at-rule-no-unknown`; some downstream extends (Vue, HTML) revive
  // it, so we re-disable explicitly.
  ctx.rules['at-rule-no-unknown'] = null
  ctx.overrides.push({
    files: ['**/*.scss'],
    customSyntax: resolveInternal('postcss-scss'),
  })
  ctx.log.debug(`${TAG} SCSS: extended stylelint-config-standard-scss + postcss-scss override`)
}

function applyVueAndHtml(resolved: Resolution, ctx: BuildContext): void {
  if (resolved.vue) {
    ctx.extends.push(resolveInternal('stylelint-config-recommended-vue'))
    ctx.log.debug(`${TAG} Vue: extended stylelint-config-recommended-vue`)
  }
  if (resolved.html) {
    ctx.extends.push(resolveInternal('stylelint-config-html'))
    ctx.log.debug(`${TAG} HTML: extended stylelint-config-html`)
  }
  if (!resolved.vue && !resolved.html)
    return
  const vueGlobs = resolved.vue ? ['**/*.vue'] : []
  const htmlGlobs = resolved.html ? ['**/*.html'] : []
  ctx.overrides.push({
    files: [...vueGlobs, ...htmlGlobs],
    customSyntax: resolveInternal('postcss-html'),
  })
}

const TAILWIND_POLICY_RULES = {
  minimal: tailwindPluginMinimal,
  recommended: tailwindPluginRecommended,
  strict: tailwindPluginStrict,
} as const

function applyTailwind(resolved: Resolution, ctx: BuildContext): void {
  if (!resolved.tailwind)
    return
  Object.assign(ctx.rules, tailwindRules)
  // Some downstream extends (notably stylelint-config-recommended-vue and
  // stylelint-config-html) re-enable `at-rule-no-unknown`, so we always
  // re-apply our Tailwind whitelist last when Tailwind is on (and SCSS
  // is off — when SCSS is on, `at-rule-no-unknown` stays disabled).
  if (!resolved.scss)
    Object.assign(ctx.rules, tailwindAtRuleNoUnknown)
  // `'minimal'` is whitelist-only: no plugin loaded. The plugin's rules
  // resolve the project's Tailwind runtime from the linted file's path,
  // which produces false positives in projects with a custom v4 prefix or
  // a non-standard entry CSS. Users opt into the plugin via `'recommended'`
  // or `'strict'`.
  const plugins = TAILWIND_POLICY_PLUGINS[resolved.tailwind]
  if (plugins.length === 0) {
    ctx.log.debug(`${TAG} Tailwind: at-rule whitelist only ("${resolved.tailwind}" policy — no plugin loaded)`)
    return
  }
  // `stylelint-plugin-tailwindcss` only ships plugin instance objects (no
  // module-level default plugin), so we register them individually.
  ctx.plugins.push(...plugins)
  Object.assign(ctx.rules, TAILWIND_POLICY_RULES[resolved.tailwind])
  ctx.log.debug(`${TAG} Tailwind: loaded ${plugins.length} plugin(s) for "${resolved.tailwind}" policy`)
}

function applyLogical(resolved: Resolution, ctx: BuildContext): void {
  if (!resolved.logical)
    return
  ctx.plugins.push(...LOGICAL_PLUGIN.map(name => resolveInternal(name)))
  Object.assign(ctx.rules, logicalRules)
  ctx.log.debug(`${TAG} Logical: loaded stylelint-use-logical-spec`)
}

function applyUserOverrides(options: MazStylelintOptions, ctx: BuildContext): void {
  if (Array.isArray(options.plugins) && options.plugins.length > 0) {
    ctx.plugins.push(...options.plugins)
    ctx.log.debug(`${TAG} User: appended ${options.plugins.length} plugin(s)`)
  }
  if (options.rules) {
    Object.assign(ctx.rules, options.rules)
    ctx.log.debug(`${TAG} User: merged ${Object.keys(options.rules).length} rule override(s)`)
  }
  if (options.overrides?.length) {
    ctx.overrides.push(...options.overrides)
    ctx.log.debug(`${TAG} User: appended ${options.overrides.length} per-file override(s)`)
  }
  // User extends are appended last so they win Stylelint's cascade — useful
  // to swap `stylelint-config-recess-order` for `stylelint-config-clean-order`
  // or to layer `stylelint-config-tailwindcss` on top of the built-ins.
  if (options.extends?.length) {
    ctx.extends.push(...options.extends)
    ctx.log.debug(`${TAG} User: extended ${options.extends.join(', ')}`)
  }
}

interface BuildContext {
  extends: string[]
  plugins: StylelintPluginEntry[]
  rules: NonNullable<StylelintConfig['rules']>
  overrides: StylelintOverride[]
  log: Logger
}

/**
 * Build a Stylelint config tailored for Vue/Nuxt/JS/TS/Tailwind projects.
 *
 * Defaults to the Stylelint Standard rules with a few opinions softened
 * (BEM/Tailwind class patterns, deep nesting, `v-bind()`). Vue, Tailwind
 * and SCSS support is auto-detected from the consuming `package.json` —
 * pass the matching boolean explicitly to opt in or out.
 *
 * @example
 * ```ts
 * // stylelint.config.mjs
 * import { defineConfig } from '@maz-ui/stylelint-config'
 *
 * export default defineConfig({
 *   tailwind: true,
 *   logical: true,
 *   rules: {
 *     'no-descending-specificity': null,
 *   },
 * })
 * ```
 */
export function defineConfig(options: MazStylelintOptions = {}): StylelintConfig {
  const log = createLogger()
  log.setLevel(options.logLevel ?? 'default')

  const resolved = resolveOptions(options)

  log.box({
    title: '@maz-ui/stylelint-config',
    message: formatResolutionBox(resolved),
    style: { borderColor: 'cyan', padding: 1 },
  })

  const ctx: BuildContext = {
    extends: [resolveInternal('stylelint-config-standard')],
    plugins: [],
    rules: { ...baseRules },
    overrides: [],
    log,
  }

  if (resolved.order === 'recess') {
    ctx.extends.push(resolveInternal('stylelint-config-recess-order'))
    log.debug(`${TAG} Order: extended stylelint-config-recess-order`)
  }
  else if (resolved.order === 'alphabetical') {
    ctx.plugins.push(resolveInternal('stylelint-order'))
    ctx.rules['order/properties-alphabetical-order'] = true
    log.debug(`${TAG} Order: loaded stylelint-order with properties-alphabetical-order`)
  }

  applyScss(resolved, ctx)
  applyVueAndHtml(resolved, ctx)
  applyTailwind(resolved, ctx)
  applyLogical(resolved, ctx)
  applyUserOverrides(options, ctx)

  const ignoreFiles = options.ignoresOverride
    ?? [...GLOBAL_IGNORES, ...(options.ignores ?? [])]

  log.verbose(`${TAG} Final extends (${ctx.extends.length}): ${ctx.extends.join(', ')}`)
  log.verbose(`${TAG} Final plugin count: ${ctx.plugins.length}, rule count: ${Object.keys(ctx.rules).length}, override count: ${ctx.overrides.length}, ignore globs: ${ignoreFiles.length}`)

  return {
    extends: ctx.extends,
    plugins: ctx.plugins.length > 0 ? ctx.plugins : undefined,
    rules: ctx.rules,
    overrides: ctx.overrides.length > 0 ? ctx.overrides : undefined,
    ignoreFiles,
  }
}

export { baseRules } from './configs/base'
export { GLOBAL_IGNORES } from './configs/global'
export { logicalRules } from './configs/logical'
export { scssRules } from './configs/scss'
export {
  TAILWIND_AT_RULES,
  tailwindAtRuleNoUnknown,
  tailwindPluginMinimal,
  tailwindPluginRecommended,
  tailwindPluginStrict,
  tailwindRules,
} from './configs/tailwind'
export type { MazStylelintOptions, StylelintConfig, StylelintOrderStrategy, StylelintOverride, StylelintRules } from './types'
