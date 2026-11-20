import { copyFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SVG_MODULES = fileURLToPath(new URL('../src/svg-modules.d.ts', import.meta.url))

const SVG_STRING = `\`<svg\${string}\``

const VARIANTS = {
  static: {
    imports: 'import type { FunctionalComponent, SVGAttributes } from \'vue\'',
    type: 'FunctionalComponent<SVGAttributes>',
  },
  lazy: {
    imports: 'import type { FunctionalComponent, Raw, SVGAttributes } from \'vue\'',
    type: 'Raw<FunctionalComponent<SVGAttributes>>',
  },
  raw: {
    imports: undefined,
    type: SVG_STRING,
  },
} as const

function declareModule(module: string, component: string, entry: string): string {
  return `declare module '${module}' {\n  export { ${component} } from '${entry}'\n}`
}

/** Each module of an icon, declared from its entry: `@maz-ui/icons/MazStar` is the static one */
function declareModules(component: string): string[] {
  return [
    declareModule(`@maz-ui/icons/${component}`, component, '@maz-ui/icons/static'),
    ...Object.keys(VARIANTS).map(variant => declareModule(`@maz-ui/icons/${variant}/${component}`, component, `@maz-ui/icons/${variant}`)),
  ]
}

/**
 * The types of the icons in six files, instead of one per module: the entries (`index.d.ts`, `static`, `lazy`,
 * `raw`) declare the icons, `icons.d.ts` declares each module (`@maz-ui/icons/static/MazStar`), the types of the
 * modules in the `exports`. TypeScript uses a declared module before the file it resolves: an import of an icon
 * keeps its exact types.
 */
export function writeIconTypes(outDir: string, components: readonly string[]): void {
  const sorted = components.toSorted((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  for (const [variant, { imports, type }] of Object.entries(VARIANTS)) {
    const declarations = sorted.map(component => `export declare const ${component}: ${type}`)

    writeFileSync(resolve(outDir, variant, 'index.d.ts'), `${[imports, ...declarations].filter(Boolean).join('\n')}\n`)
  }

  const lazyExports = sorted.map(component => `${component} as Lazy${component}`).join(', ')

  copyFileSync(SVG_MODULES, resolve(outDir, 'svg-modules.d.ts'))
  writeFileSync(resolve(outDir, 'index.d.ts'), [
    '/// <reference path="./svg-modules.d.ts" />',
    'import type { Component, ComponentPublicInstance, FunctionalComponent } from \'vue\'',
    'export type IconComponent = FunctionalComponent | ComponentPublicInstance | Component',
    'export type * from \'./types.js\'',
    'export * from \'./static/index.js\'',
    `export { ${lazyExports} } from './lazy/index.js'`,
    '',
  ].join('\n'))

  writeFileSync(resolve(outDir, 'icons.d.ts'), `${sorted.flatMap(declareModules).join('\n')}\n`)
}
