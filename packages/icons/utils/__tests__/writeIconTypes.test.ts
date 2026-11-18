import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { writeIconTypes } from '../writeIconTypes'

describe('given the components of the icons', () => {
  describe('when their types are written', () => {
    let outDir: string

    beforeAll(() => {
      outDir = mkdtempSync(join(tmpdir(), 'maz-icons-types-'))
      for (const variant of ['static', 'lazy', 'raw'])
        mkdirSync(join(outDir, variant))

      writeIconTypes(outDir, [
        'MazStar',
        'MazH2',
        'MazH10',
        'MazCheck',
      ])
    })

    afterAll(() => {
      rmSync(outDir, { recursive: true, force: true })
    })

    const read = (path: string) => readFileSync(join(outDir, path), 'utf8')

    it('then five files hold the types of every icon', () => {
      expect(readdirSync(outDir, { recursive: true }).toSorted()).toEqual([
        'icons.d.ts',
        'index.d.ts',
        'lazy',
        'lazy/index.d.ts',
        'raw',
        'raw/index.d.ts',
        'static',
        'static/index.d.ts',
      ])
    })

    it('then each variant declares its icons, sorted', () => {
      expect(read('static/index.d.ts')).toBe([
        'import type { FunctionalComponent, SVGAttributes } from \'vue\'',
        'export declare const MazCheck: FunctionalComponent<SVGAttributes>',
        'export declare const MazH2: FunctionalComponent<SVGAttributes>',
        'export declare const MazH10: FunctionalComponent<SVGAttributes>',
        'export declare const MazStar: FunctionalComponent<SVGAttributes>',
        '',
      ].join('\n'))
      expect(read('lazy/index.d.ts')).toContain('import type { FunctionalComponent, Raw, SVGAttributes } from \'vue\'\nexport declare const MazCheck: Raw<FunctionalComponent<SVGAttributes>>\n')
      expect(read('raw/index.d.ts')).toBe('export declare const MazCheck: string\nexport declare const MazH2: string\nexport declare const MazH10: string\nexport declare const MazStar: string\n')
    })

    it('then the root exports the static icons and the lazy ones, with the extension of their entry', () => {
      expect(read('index.d.ts')).toBe([
        'import type { Component, ComponentPublicInstance, FunctionalComponent } from \'vue\'',
        'export type IconComponent = FunctionalComponent | ComponentPublicInstance | Component',
        'export * from \'./static/index.js\'',
        'export { MazCheck as LazyMazCheck, MazH2 as LazyMazH2, MazH10 as LazyMazH10, MazStar as LazyMazStar } from \'./lazy/index.js\'',
        '',
      ].join('\n'))
    })

    it('then each module of an icon is declared from its entry', () => {
      const modules = read('icons.d.ts')

      expect(modules.match(/declare module/g)).toHaveLength(16)
      expect(modules).toContain('declare module \'@maz-ui/icons/MazStar\' {\n  export { MazStar } from \'@maz-ui/icons/static\'\n}')
      expect(modules).toContain('declare module \'@maz-ui/icons/static/MazStar\' {\n  export { MazStar } from \'@maz-ui/icons/static\'\n}')
      expect(modules).toContain('declare module \'@maz-ui/icons/lazy/MazStar\' {\n  export { MazStar } from \'@maz-ui/icons/lazy\'\n}')
      expect(modules).toContain('declare module \'@maz-ui/icons/raw/MazStar\' {\n  export { MazStar } from \'@maz-ui/icons/raw\'\n}')
    })
  })
})
