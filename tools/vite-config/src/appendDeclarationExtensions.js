// @ts-check
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/**
 * Writes explicit `.js` extensions on the relative specifiers of the emitted
 * declarations. A package with `"type": "module"` has to spell those out, or
 * `moduleResolution` `node16` and `nodenext` cannot resolve them and the
 * consumer silently gets `any` for every re-export.
 *
 * Specifiers that already carry an extension are left alone, and a specifier
 * that matches neither a sibling `.d.ts` nor a directory with an `index.d.ts`
 * is left alone too, since guessing would break the import.
 *
 * @param {Map<string, string>} files emitted declaration path to its content
 * @returns {void}
 */
export function appendDeclarationExtensions(files) {
  const emitted = new Set(files.keys())
  for (const [filePath, content] of files) {
    if (!filePath.endsWith('.d.ts'))
      continue
    const rewritten = content.replace(
      /(['"])(\.\.?\/[^'"]*)\1/g,
      (match, quote, specifier) => {
        if (/\.[cm]?[jt]sx?$|\.vue$|\.json$|\.css$|\.svg$/.test(specifier))
          return match
        const target = resolve(dirname(filePath), specifier)
        if (emitted.has(`${target}.d.ts`))
          return `${quote}${specifier}.js${quote}`
        if (emitted.has(`${target}/index.d.ts`))
          return `${quote}${specifier}/index.js${quote}`
        return match
      },
    )
    if (rewritten !== content)
      writeFileSync(filePath, rewritten)
  }
}
