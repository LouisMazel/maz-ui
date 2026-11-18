import type { BundledLanguage } from 'shiki/langs'
import type { BundledTheme } from 'shiki/themes'

type ShikiModules = [
  typeof import('shiki/core'),
  typeof import('shiki/engine/javascript'),
  typeof import('shiki/langs'),
  typeof import('shiki/themes'),
]

function createShorthands([core, { createJavaScriptRegexEngine }, { bundledLanguages }, { bundledThemes }]: ShikiModules) {
  const createHighlighter = core.createBundledHighlighter<BundledLanguage, BundledTheme>({
    langs: bundledLanguages,
    themes: bundledThemes,
    // a regex the engine cannot translate is skipped instead of failing the whole highlight
    engine: () => createJavaScriptRegexEngine({ forgiving: true }),
  })

  return core.createSingletonShorthands(createHighlighter, { guessEmbeddedLanguages: core.guessEmbeddedLanguages })
}

export type ShikiShorthands = ReturnType<typeof createShorthands>

let shorthands: Promise<ShikiShorthands> | undefined

/**
 * The highlighter of shiki with its JavaScript regex engine, created once for the app: unlike the `shiki` entry and its
 * Oniguruma engine, it loads no WebAssembly. shiki (an optional peer dependency) is only imported on the first
 * highlight, and the languages and themes when a block uses them.
 */
export function loadShiki(): Promise<ShikiShorthands> {
  shorthands ??= Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
    import('shiki/langs'),
    import('shiki/themes'),
  ]).then(createShorthands)

  return shorthands
}
