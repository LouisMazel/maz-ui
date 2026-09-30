import type { Plugin } from 'vite'
import postcss from 'postcss'
import postcssNested from 'postcss-nested'

/*
 * Runs postcss-nested on every SFC <style> block before @tailwindcss/vite
 * processes the content. This is needed because maz-ui component styles use
 * the postcss-nested `&-child` concatenation syntax (e.g. `.m-btn { &-loader
 * { … } }` → `.m-btn-loader`). That syntax is invalid in native CSS nesting,
 * which is what Tailwind v4's internal lightningcss engine expects. Without
 * pre-flattening, the resulting selectors come out garbled (leading-hyphen
 * tag selectors that never match).
 *
 * Apply `enforce: 'pre'` so we always run before @tailwindcss/vite's
 * generate hook.
 */
export function VitePreNestedCss(): Plugin {
  const processor = postcss([postcssNested()])

  return {
    name: 'maz-ui:pre-nested-css',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\.vue\?.*type=style/.test(id) && !id.endsWith('.css'))
        return

      if (!code.includes('&'))
        return

      const { css } = await processor.process(code, { from: id, to: id })
      return { code: css, map: null }
    },
  }
}
