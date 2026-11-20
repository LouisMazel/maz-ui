import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { ICON_SETS, loadDirsIcons, loadIconNames, loadPackageIcons, loadProjectIcons, locateIconsPackage, mergeIconSources, normalizeIconDirs, resolveIconsPackage, resolveIconTypesModule, toIconName, toIconSets } from '../sources.ts'
import { createProject, HERO_SVG } from './fixtures.ts'

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
    it('then each name points to its file, its component and its module', () => {
      const root = project()
      const packageDir = resolveIconsPackage(root)!

      expect(loadPackageIcons(packageDir)).toEqual(new Map([
        [
          'home',
          {
            file: join(packageDir, 'svg/home.svg'),
            root: packageDir,
            component: 'MazHome',
            import: { from: '@maz-ui/icons/raw/MazHome', name: 'MazHome' },
          },
        ],
        [
          'x-mark',
          {
            file: join(packageDir, 'svg/x-mark.svg'),
            root: packageDir,
            component: 'MazXMark',
            import: { from: '@maz-ui/icons/raw/MazXMark', name: 'MazXMark' },
          },
        ],
      ]))
    })
  })
})

describe('given the dir option', () => {
  describe('when it is not set', () => {
    it('then the folder is src/icons', () => {
      expect(normalizeIconDirs()).toEqual([
        { path: 'src/icons', prefix: undefined, svgo: undefined },
      ])
    })
  })

  describe('when it mixes paths and folders with their options', () => {
    it('then the paths take the global prefix and svgo config, the folders keep their own', () => {
      const svgoConfig = { multipass: false }

      expect(normalizeIconDirs([
        'src/icons',
        { path: 'vendor/svg', prefix: 'acme', svgo: false },
      ], { prefix: 'app', svgoConfig })).toEqual([
        { path: 'src/icons', prefix: 'app', svgo: svgoConfig },
        { path: 'vendor/svg', prefix: 'acme', svgo: false },
      ])
    })
  })

  describe('when the SVG of a folder with its svgo config are loaded', () => {
    it('then each icon has the config of its folder', () => {
      const root = project({
        files: { 'vendor/svg/hero.svg': HERO_SVG },
      })

      expect(loadDirsIcons(root, [
        { path: 'vendor/svg', prefix: 'acme', svgo: false },
      ])).toEqual([
        {
          icons: new Map([
            [
              'acme:hero',
              {
                file: join(root, 'vendor/svg/hero.svg'),
                root,
                svgo: false,
              },
            ],
          ]),
          invalid: [],
        },
      ])
    })
  })

  describe('when every name is listed without the icons of maz-ui', () => {
    it('then only the names of the folders are listed', () => {
      const root = project({
        files: {
          'src/icons/hero.svg': HERO_SVG,
          'vendor/svg/logo.svg': HERO_SVG,
        },
      })

      expect(loadIconNames({
        root,
        dir: [
          'src/icons',
          { path: 'vendor/svg', prefix: 'acme' },
        ],
        defaultIcons: false,
      })).toEqual([
        'hero',
        'acme:logo',
      ])
    })
  })
})

describe('given the module of the types of the names', () => {
  describe('when the project only resolves maz-ui', () => {
    it('then maz-ui is augmented', () => {
      expect(resolveIconTypesModule(project({ icons: 'maz-ui' }))).toBe('maz-ui')
    })
  })

  describe('when the project resolves maz-ui and @maz-ui/icons', () => {
    it('then @maz-ui/icons is augmented, its names are the ones of maz-ui too', () => {
      expect(resolveIconTypesModule(project({ icons: 'root' }))).toBe('@maz-ui/icons')
    })
  })

  describe('when the project only resolves @maz-ui/icons', () => {
    it('then @maz-ui/icons is augmented', () => {
      const root = project({ icons: 'root' })
      rmSync(join(root, 'node_modules/maz-ui'), { recursive: true })

      expect(resolveIconTypesModule(root)).toBe('@maz-ui/icons')
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
          'maz-ui',
        ],
      ])
    })
  })

  describe('when two folders have an icon with the same name', () => {
    it('then the icon of the last folder replaces the other one, and the replacement is reported', () => {
      const root = project({
        files: {
          'src/icons/hero.svg': HERO_SVG,
          'vendor/svg/hero.svg': HERO_SVG,
        },
      })

      const sources = mergeIconSources(new Map(), loadDirsIcons(root, normalizeIconDirs(['src/icons', 'vendor/svg'])), root)

      expect(sources.icons.get('hero')?.file).toBe(join(root, 'vendor/svg/hero.svg'))
      expect(sources.overrides).toEqual([
        [
          'hero',
          join('vendor', 'svg', 'hero.svg'),
          join('src', 'icons', 'hero.svg'),
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

describe('given the sets of the icons of maz-ui', () => {
  const ICON_NAMES = JSON.stringify({
    'x-mark': { component: 'MazXMark', file: 'svg/x-mark.svg' },
    'flag-fr': { component: 'MazFlagFR', file: 'flags/3x2/FR.svg' },
    'flag-square-fr': { component: 'MazFlagSquareFR', file: 'flags/1x1/FR.svg' },
    'logo-vue': { component: 'MazLogoVue', file: 'logos/vue.svg' },
  })

  describe('when some sets are loaded', () => {
    it('then only their names are loaded', () => {
      const root = project({
        files: { 'node_modules/maz-ui/node_modules/@maz-ui/icons/icon-names.json': ICON_NAMES },
      })
      const packageDir = resolveIconsPackage(root)!

      expect([...loadPackageIcons(packageDir, ['icons', 'logos']).keys()]).toEqual(['x-mark', 'logo-vue'])
      expect([...loadPackageIcons(packageDir, ['flags-square']).keys()]).toEqual(['flag-square-fr'])
      expect([...loadPackageIcons(packageDir).keys()]).toEqual(['x-mark', 'flag-fr', 'flag-square-fr', 'logo-vue'])
    })
  })

  describe('when every name is listed with some sets', () => {
    it('then the names of these sets are listed', () => {
      const root = project({
        files: { 'node_modules/maz-ui/node_modules/@maz-ui/icons/icon-names.json': ICON_NAMES },
      })

      expect(loadIconNames({ root, defaultIcons: ['flags'] })).toEqual(['flag-fr'])
      expect(loadIconNames({ root, defaultIcons: [] })).toEqual([])
    })
  })

  describe('when the option is read', () => {
    it('then true is every set, false none', () => {
      expect(toIconSets(true)).toBe(ICON_SETS)
      expect(toIconSets(false)).toEqual([])
      expect(toIconSets(['logos'])).toEqual(['logos'])
    })
  })
})
