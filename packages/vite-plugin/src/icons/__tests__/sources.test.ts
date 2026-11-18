import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { loadIconNames, loadPackageIcons, loadProjectIcons, locateIconsPackage, mergeIconSources, resolveIconsPackage, toIconName } from '../sources'
import { createProject, HERO_SVG } from './fixtures'

const roots: string[] = []

function project(...args: Parameters<typeof createProject>) {
  const root = createProject(...args)
  roots.push(root)
  return root
}

afterAll(() => {
  for (const root of roots)
    rmSync(root, { recursive: true, force: true })
})

describe('given the path of a SVG of the project', () => {
  describe('when it is converted to a name', () => {
    it('then it is in kebab case, with the folders', () => {
      expect(toIconName('hero.svg')).toBe('hero')
      expect(toIconName('brand/LogoDark.svg')).toBe('brand-logo-dark')
      expect(toIconName('_Icons/arrow_up 2.SVG')).toBe('icons-arrow-up-2')
    })
  })
})

describe('given a project with maz-ui', () => {
  describe('when @maz-ui/icons is a dependency of maz-ui only', () => {
    it('then it is found from maz-ui', () => {
      const root = project({ icons: 'maz-ui' })

      expect(resolveIconsPackage(root)).toBe(join(root, 'node_modules/maz-ui/node_modules/@maz-ui/icons'))
    })
  })

  describe('when @maz-ui/icons is located', () => {
    it('then its modules are resolved from maz-ui', () => {
      const root = project({ icons: 'maz-ui' })

      expect(locateIconsPackage(root)).toEqual({
        packageDir: join(root, 'node_modules/maz-ui/node_modules/@maz-ui/icons'),
        importer: join(root, 'node_modules/maz-ui/package.json'),
      })
    })
  })

  describe('when @maz-ui/icons is a dependency of the project', () => {
    it('then it is found from the project', () => {
      const root = project({ icons: 'root' })

      expect(resolveIconsPackage(root)).toBe(join(root, 'node_modules/@maz-ui/icons'))
    })
  })

  describe('when the icons of the package are loaded', () => {
    it('then each name points to its file and its component', () => {
      const root = project()
      const packageDir = resolveIconsPackage(root)!

      expect(loadPackageIcons(packageDir)).toEqual(new Map([
        [
          'home',
          {
            file: join(packageDir, 'svg/home.svg'),
            root: packageDir,
            component: 'MazHome',
          },
        ],
        [
          'x-mark',
          {
            file: join(packageDir, 'svg/x-mark.svg'),
            root: packageDir,
            component: 'MazXMark',
          },
        ],
      ]))
    })
  })
})

describe('given a folder of SVG in the project', () => {
  describe('when it is loaded without a prefix', () => {
    it('then each file is a name, the invalid ones aside', () => {
      const root = project({
        files: {
          'src/icons/hero.svg': HERO_SVG,
          'src/icons/brand/logo.svg': HERO_SVG,
          'src/icons/ü.svg': HERO_SVG,
          'src/icons/readme.md': '',
        },
      })

      expect(loadProjectIcons({ root, dir: 'src/icons' })).toEqual({
        icons: new Map([
          [
            'brand-logo',
            {
              file: join(root, 'src/icons/brand/logo.svg'),
              root,
            },
          ],
          [
            'hero',
            {
              file: join(root, 'src/icons/hero.svg'),
              root,
            },
          ],
        ]),
        invalid: [
          join('src', 'icons', 'ü.svg'),
        ],
      })
    })
  })

  describe('when it is loaded with a prefix', () => {
    it('then the names have the prefix', () => {
      const root = project({
        files: { 'src/icons/hero.svg': HERO_SVG },
      })

      expect([
        ...loadProjectIcons({ root, dir: 'src/icons', prefix: 'app' }).icons.keys(),
      ]).toEqual(['app:hero'])
    })
  })

  describe('when the folder does not exist', () => {
    it('then there is no icon', () => {
      const root = project()

      expect(loadProjectIcons({ root, dir: 'src/icons' })).toEqual({
        icons: new Map(),
        invalid: [],
      })
    })
  })

  describe('when a project icon has the name of an icon of maz-ui', () => {
    it('then it replaces it, and the replacement is reported', () => {
      const root = project({
        files: { 'src/icons/home.svg': HERO_SVG },
      })
      const packageIcons = loadPackageIcons(resolveIconsPackage(root)!)

      const sources = mergeIconSources(packageIcons, loadProjectIcons({ root, dir: 'src/icons' }), root)

      expect(sources.icons.get('home')).toEqual({
        file: join(root, 'src/icons/home.svg'),
        root,
      })
      expect(sources.overrides).toEqual([
        [
          'home',
          join('src', 'icons', 'home.svg'),
        ],
      ])
    })
  })

  describe('when every name is listed', () => {
    it('then the names of maz-ui and of the project are listed', () => {
      const root = project({
        files: { 'app/icons/hero.svg': HERO_SVG },
      })

      expect(loadIconNames({ root, dir: 'app/icons', prefix: 'app' })).toEqual(['home', 'x-mark', 'app:hero'])
      expect(loadIconNames({ root })).toEqual(['home', 'x-mark'])
    })
  })
})
