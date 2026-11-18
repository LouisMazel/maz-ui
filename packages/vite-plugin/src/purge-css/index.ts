import type { Plugin, ResolvedConfig } from 'vite'
import type { PurgeManifest } from './manifest'
import type { Usage } from './usage'
import { isAbsolute, relative } from 'node:path'
import { containsToken, loadPurgeManifest } from './manifest'
import { PUBLIC_UTILITIES_LAYER, purgeCss } from './purge'
import { DEFAULT_CONTENT, readContent, resolveUsage } from './usage'

export interface MazUiPurgeCssOptions {
  /**
   * Globs of the files that use maz-ui, relative to the root of the project. The defaults scan every source file of
   * the project (`node_modules`, `dist` and the build folders excluded). Add the files of a package of your monorepo,
   * or of a dependency built on maz-ui: these globs can target `node_modules`.
   */
  content?: string[]
  /**
   * Entries of maz-ui to keep even if the plugin does not find them in the code: a component (`MazBtn`), a directive
   * (`vTooltip`), a plugin (`plugins/toast`)...
   */
  entries?: string[]
  /** Classes to keep, `maz:` classes of the components or public utilities (`text-title-1`, `/^rich-text/`) */
  safelist?: (string | RegExp)[]
  /**
   * Print the CSS saved by the purge
   * @default true
   */
  report?: boolean
}

const CSS_REQUEST = /\.(?:css|scss|sass|less|styl|stylus|pcss|postcss|sss)(?:$|\?)|[?&]lang\.css/
const MANAGED_CLASS_MARKER = 'maz\\:'
const BYTES_PER_KB = 1024

function formatSize(bytes: number): string {
  return `${(bytes / BYTES_PER_KB).toFixed(1)} kB`
}

/**
 * Remove from the CSS of maz-ui (`maz-ui/style.css`, `maz-ui/utilities.css`) the rules of the components, directives,
 * plugins and utilities the app does not use. It runs at build time only: the dev server keeps the whole CSS.
 */
export function MazUiPurgeCss(options: MazUiPurgeCssOptions = {}): Plugin {
  const { content = [], entries = [], safelist = [], report = true } = options

  let config: ResolvedConfig
  let manifest: PurgeManifest | undefined
  let usage: Promise<Usage> | undefined
  const removed = new Set<string>()
  /** Sizes before and after the purge, per file: the same CSS can be transformed twice (`?inline`) */
  const sizes = new Map<string, { before: number, after: number }>()
  let manifestClasses = new Set<string>()
  let manifestUtilities = new Set<string>()

  function isManaged(className: string, inPublicLayer: boolean): boolean {
    if (className.startsWith('maz:'))
      return manifestClasses.has(className)

    return inPublicLayer && manifestUtilities.has(className)
  }

  return {
    name: 'maz-ui:purge-css',
    apply: 'build',

    configResolved(resolvedConfig) {
      config = resolvedConfig
      manifest = loadPurgeManifest(config.root)

      if (!manifest) {
        config.logger.warn('[maz-ui:purge-css] maz-ui/purge-manifest.json not found: the CSS of maz-ui is not purged (maz-ui >= 5.7.0 is required)')
        return
      }

      manifestClasses = new Set(manifest.classes)
      manifestUtilities = new Set(manifest.utilities)
    },

    buildStart() {
      if (!manifest)
        return

      const loadedManifest = manifest
      const extraContent = content.map(glob => isAbsolute(glob)
        ? relative(config.root, glob)
        : glob)

      // The globs of the option can target node_modules (a dependency built on maz-ui): only the defaults ignore it
      usage = Promise.all([
        readContent(config.root, DEFAULT_CONTENT),
        readContent(config.root, extraContent, []),
      ]).then(sources => resolveUsage(loadedManifest, sources.join('\n'), { entries, safelist }))
    },

    async transform(code, id) {
      if (!usage || !CSS_REQUEST.test(id))
        return

      const hasManagedClasses = code.includes(MANAGED_CLASS_MARKER) || code.includes(`@layer ${PUBLIC_UTILITIES_LAYER}`)
      if (!hasManagedClasses)
        return

      const { classes } = await usage
      const result = purgeCss(code, {
        isManaged,
        isUsed: className => classes.has(className),
      })

      if (result.css === code)
        return

      for (const className of result.removed)
        removed.add(className)

      sizes.set(id.split('?')[0]!, { before: code.length, after: result.css.length })

      return { code: result.css, map: null }
    },

    generateBundle(_, bundle) {
      if (removed.size === 0)
        return

      const output = Object.values(bundle)
        .map(file => file.type === 'chunk'
          ? file.code
          : typeof file.source === 'string'
            ? file.source
            : '')
        .join('\n')

      const missing = [...removed].filter(className => containsToken(output, className))

      if (missing.length > 0) {
        config.logger.warn([
          `[maz-ui:purge-css] ${missing.length} purged classes are in the bundle: ${missing.slice(0, 10).join(', ')}${missing.length > 10
            ? '...'
            : ''}`,
          'A component of maz-ui is probably used by a file the plugin does not scan (a dependency, a package of your monorepo).',
          'Add its files to the `content` option, or the component to `entries`.',
        ].join('\n'))
      }
    },

    closeBundle() {
      if (!report || sizes.size === 0 || config.build.ssr)
        return

      const before = [
        ...sizes.values(),
      ].reduce((total, size) => total + size.before, 0)
      const after = [
        ...sizes.values(),
      ].reduce((total, size) => total + size.after, 0)
      const ratio = Math.round((before - after) / before * 100)

      config.logger.info(`[maz-ui:purge-css] ${formatSize(before)} -> ${formatSize(after)} of maz-ui CSS (-${ratio}%, ${removed.size} unused classes removed)`)
    },
  }
}
