// @ts-check

/*
 * Writes `<fileName>` (`exports.json` by default) at the root of the output: for each key, the names of the values
 * exported by an entry of the build, read from the bundle (`chunk.exports`), so the list never drifts from the barrel.
 * The tools that need the public API of a package (the Nuxt module, the auto-import resolvers) read it instead of
 * keeping their own list.
 */
/**
 * @param {Record<string, string | { entry: string, include: RegExp }>} entries key in the file, name of the entry in
 * `build.lib.entry`, with `include` to keep only the names it matches
 * @param {{ fileName?: string }} [options]
 * @returns {import('vite').Plugin}
 */
export function ViteExportNames(entries, { fileName = 'exports.json' } = {}) {
  return {
    name: 'vite-export-names',
    apply: 'build',
    generateBundle(_, bundle) {
      /** @type {Record<string, string[]>} */
      const names = {}

      for (const [key, value] of Object.entries(entries)) {
        const { entry, include = undefined } = typeof value === 'string'
          ? { entry: value }
          : value
        const chunk = Object.values(bundle).find(output => output.type === 'chunk' && output.isEntry && output.name === entry)

        if (!chunk || chunk.type !== 'chunk')
          this.error(`[vite-export-names] no entry "${entry}" in the bundle`)

        names[key] = chunk.exports.filter(name => !include || include.test(name)).sort()
      }

      this.emitFile({ type: 'asset', fileName, source: `${JSON.stringify(names, null, 2)}\n` })
    },
  }
}
