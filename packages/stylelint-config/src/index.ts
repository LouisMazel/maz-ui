import type { MazStylelintOptions, StylelintConfig, StylelintOverride } from './types'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { baseRules } from './configs/base'
import { GLOBAL_IGNORES } from './configs/global'
import { LOGICAL_PLUGIN, logicalRules } from './configs/logical'
import { scssRules } from './configs/scss'
import { tailwindAtRuleNoUnknown, tailwindRules } from './configs/tailwind'

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

interface Resolution {
  vue: boolean
  html: boolean
  tailwind: boolean
  scss: boolean
  logical: boolean
  order: MazStylelintOptions['order']
}

function resolveOptions(options: MazStylelintOptions): Resolution {
  const pkg = readConsumerPackageJson()

  return {
    vue: options.vue ?? hasDependency(pkg, 'vue', 'nuxt'),
    html: options.html ?? false,
    tailwind: options.tailwind ?? hasDependency(pkg, 'tailwindcss', '@tailwindcss/vite'),
    scss: options.scss ?? hasDependency(pkg, 'sass', 'sass-embedded', 'node-sass'),
    logical: options.logical ?? true,
    order: options.order ?? 'recess',
  }
}

function applyScss(resolved: Resolution, ctx: BuildContext): void {
  if (!resolved.scss)
    return
  ctx.extends.push('stylelint-config-recommended-scss')
  Object.assign(ctx.rules, scssRules(resolved.tailwind))
  // SCSS shipper-configs disable `at-rule-no-unknown` in favor of
  // `scss/at-rule-no-unknown`; some downstream extends (Vue, HTML) revive
  // it, so we re-disable explicitly.
  ctx.rules['at-rule-no-unknown'] = null
  ctx.overrides.push({
    files: ['**/*.scss'],
    customSyntax: 'postcss-scss',
  })
}

function applyVueAndHtml(resolved: Resolution, ctx: BuildContext): void {
  if (resolved.vue)
    ctx.extends.push('stylelint-config-recommended-vue')
  if (resolved.html)
    ctx.extends.push('stylelint-config-html')
  if (!resolved.vue && !resolved.html)
    return
  const vueGlobs = resolved.vue ? ['**/*.vue'] : []
  const htmlGlobs = resolved.html ? ['**/*.html'] : []
  ctx.overrides.push({
    files: [...vueGlobs, ...htmlGlobs],
    customSyntax: 'postcss-html',
  })
}

function applyLogical(resolved: Resolution, ctx: BuildContext): void {
  if (!resolved.logical)
    return
  ctx.plugins.push(...(LOGICAL_PLUGIN as string[]))
  Object.assign(ctx.rules, logicalRules)
}

function applyUserOverrides(options: MazStylelintOptions, ctx: BuildContext): void {
  if (Array.isArray(options.plugins) && options.plugins.length > 0)
    ctx.plugins.push(...(options.plugins as string[]))
  if (options.rules)
    Object.assign(ctx.rules, options.rules)
  if (options.overrides?.length)
    ctx.overrides.push(...options.overrides)
}

interface BuildContext {
  extends: string[]
  plugins: string[]
  rules: NonNullable<StylelintConfig['rules']>
  overrides: StylelintOverride[]
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
  const resolved = resolveOptions(options)

  const ctx: BuildContext = {
    extends: ['stylelint-config-standard'],
    plugins: [],
    rules: { ...baseRules },
    overrides: [],
  }

  if (resolved.order === 'recess')
    ctx.extends.push('stylelint-config-recess-order')

  applyScss(resolved, ctx)
  applyVueAndHtml(resolved, ctx)

  if (resolved.tailwind) {
    Object.assign(ctx.rules, tailwindRules)
    // Some downstream extends (notably stylelint-config-recommended-vue and
    // stylelint-config-html) re-enable `at-rule-no-unknown`, so we always
    // re-apply our Tailwind whitelist last when Tailwind is on (and SCSS
    // is off — when SCSS is on, `at-rule-no-unknown` stays disabled).
    if (!resolved.scss)
      Object.assign(ctx.rules, tailwindAtRuleNoUnknown)
  }

  applyLogical(resolved, ctx)
  applyUserOverrides(options, ctx)

  const ignoreFiles = options.ignoresOverride
    ?? [...GLOBAL_IGNORES, ...(options.ignores ?? [])]

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
export { TAILWIND_AT_RULES, tailwindAtRuleNoUnknown, tailwindRules } from './configs/tailwind'
export type { MazStylelintOptions, StylelintConfig, StylelintOrderStrategy, StylelintOverride, StylelintRules } from './types'
