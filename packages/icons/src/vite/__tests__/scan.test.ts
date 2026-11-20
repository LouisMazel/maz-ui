import { scanIconNames } from '../scan.ts'

function scan(code: string, prefixes?: string[], keys?: string[]) {
  return [
    ...scanIconNames(code, prefixes, keys).names,
  ].sort()
}

describe('given the compiled code of a file', () => {
  describe('when a key contains icon', () => {
    it('then the strings of its value are names', () => {
      expect(scan('_createVNode(_component_MazIcon, { icon: "x-mark" })')).toEqual(['x-mark'])
      expect(scan('{ "start-icon": "moon", endIcon: \'arrow-right\' }')).toEqual(['arrow-right', 'moon'])
      expect(scan('{ icon: _ctx.isDark ? "moon" : "sun", size: "lg" }')).toEqual(['moon', 'sun'])
    })

    it('then the value ends at the bracket that closes its level', () => {
      expect(scan('h(MazIcon, { icon: "bell" }); const label = "home"')).toEqual(['bell'])
      expect(scan('{ startIcon: { icon: "bell", size: "sm" }, label: "home" }')).toEqual(['bell', 'sm'])
    })

    it('then the strings of a template literal without expression are names', () => {
      const interpolation = '$' + '{name}'
      expect(scan(`{ icon: \`home\`, other: \`x-${interpolation}\` }`)).toEqual(['home'])
      expect(scan(`{ icon: \`x-${interpolation}\` }`)).toEqual([])
    })

    it('then the strings with escapes and the commas in strings do not end the value', () => {
      expect(scan('{ icon: fn(\'a, b\', "moon") }')).toEqual(['moon'])
      expect(scan('{ icon: fn("it\\"s", "moon"), label: "home" }')).not.toContain('home')
    })

    it('then a value that does not end is read up to a limit', () => {
      expect(scan(`{ icon: ["moon" ${' '.repeat(3000)} "sun"`)).toEqual(['moon'])
      expect(scan('{ icon: "moon\\')).toEqual([])
    })
  })

  describe('when a variable contains icon', () => {
    it('then the strings of its value are names', () => {
      expect(scan('const icon = isDark ? \'moon\' : \'sun\'')).toEqual(['moon', 'sun'])
      expect(scan('menuIcon.value = "x-mark";')).toEqual(['x-mark'])
    })

    it('then a line break ends the value, unless the expression goes on', () => {
      expect(scan('const icon = \'home\'\nfoo(\'bell\')')).toEqual(['home'])
      expect(scan('const icon = isDark\n  ? \'moon\'\n  : \'sun\'\nfoo(\'bell\')')).toEqual(['moon', 'sun'])
      expect(scan('const icon = user.icon\n  || \'user\'')).toEqual(['user'])
      expect(scan('const icon =\n  \'home\'')).toEqual(['home'])
    })

    it('then comparisons and arrow functions are not values', () => {
      expect(scan('if (icon === "home") {}')).toEqual([])
      expect(scan('items.map(icon => "bell")')).toEqual([])
    })
  })

  describe('when a template in a string has an icon attribute', () => {
    it('then its value and the strings in it are names', () => {
      expect(scan('const template = \'<MazIcon icon="x-mark" />\'')).toEqual(['x-mark'])
      expect(scan('const template = "<MazIcon icon=\\"x-mark\\" />"')).toEqual(['x-mark'])
      expect(scan('template: `<MazBtn :start-icon="dark ? \'moon\' : \'sun\'" />`')).toContain('moon')
    })
  })

  describe('when a string has a prefix', () => {
    it('then it is a name anywhere in the code', () => {
      expect(scan('const hero = "app:hero"; const other = "other:hero"', ['app'])).toEqual(['app:hero'])
    })

    it('then the code without the prefix is not read again', () => {
      expect(scan('const hero = "hero"', ['app'])).toEqual([])
    })
  })

  describe('when a string is not a valid name', () => {
    it('then it is ignored', () => {
      expect(scan('{ icon: "/icons/star.svg", startIcon: "<svg></svg>", endIcon: "two words" }')).toEqual([])
    })
  })

  describe('when the code has no icon context', () => {
    it('then it has no name', () => {
      expect(scanIconNames('const label = "home"')).toEqual({
        names: new Set(),
        lazyNames: new Set(),
        hasIconContext: false,
      })
      expect(scanIconNames('import MazIcon from "maz-ui/components/MazIcon"').hasIconContext).toBe(false)
    })
  })

  describe('when the code has an icon context without a literal', () => {
    it('then the context is found', () => {
      expect(scanIconNames('{ icon: item.icon }')).toEqual({
        names: new Set(),
        lazyNames: new Set(),
        hasIconContext: true,
      })
    })
  })
})

describe('given scan keys', () => {
  describe('when the code has these exact keys', () => {
    it('then the strings of their values are names', () => {
      expect(scan('h(AppIcon, { name: "logo", label: "home" })', [], ['name'])).toEqual(['logo'])
      expect(scan('{ "start-svg": "moon", endSvg: _ctx.dark ? "sun" : "star" }', [], ['startSvg', 'end-svg'])).toEqual(['moon', 'star', 'sun'])
    })
  })

  describe('when the code has these keys in a variable or a template attribute', () => {
    it('then their strings are names', () => {
      expect(scan('const name = isDark ? "moon" : "sun"', [], ['name'])).toEqual(['moon', 'sun'])
      expect(scan('<AppIcon name="logo" :start-svg="\'moon\'" />', [], ['name', 'startSvg'])).toEqual(['logo', 'moon'])
    })
  })

  describe('when a key only contains one of them', () => {
    it('then it is not read', () => {
      expect(scan('{ __name: "Page", fullName: "home", "user-name": "bell" }', [], ['name'])).toEqual([])
    })
  })

  describe('when they are not set', () => {
    it('then only the keys that contain icon are read', () => {
      expect(scan('h(AppIcon, { name: "logo", icon: "bell" })')).toEqual(['bell'])
    })
  })

  describe('when a key has a character of a regular expression', () => {
    it('then it is read as it is', () => {
      expect(scan('{ "svg.name": "logo", svgXname: "home" }', [], ['svg.name'])).toEqual(['logo'])
    })
  })

  describe('when the code has a key and no icon context', () => {
    it('then it has a context, for the safelist', () => {
      expect(scanIconNames('h(AppIcon, { name: dynamicName })', [], ['name']).hasIconContext).toBe(true)
      expect(scanIconNames('h(AppIcon, { name: dynamicName })').hasIconContext).toBe(false)
    })
  })
})

describe('given names written with a ~', () => {
  describe('when they are in an icon context', () => {
    it('then they are lazy names, without the ~', () => {
      const { names, lazyNames } = scanIconNames('h(MazIcon, { icon: "~x-mark" }); <MazBtn start-icon="~moon" />')

      expect([...lazyNames]).toEqual(['x-mark', 'moon'])
      expect([...names]).toEqual([])
    })
  })

  describe('when they have a prefix, outside of an icon context', () => {
    it('then they are lazy names', () => {
      expect([...scanIconNames('const hero = "~app:hero"', ['app']).lazyNames]).toEqual(['app:hero'])
    })
  })

  describe('when the rest is not a name', () => {
    it('then they are ignored', () => {
      expect([...scanIconNames('h(MazIcon, { icon: "~/assets/logo.svg" })').lazyNames]).toEqual([])
    })
  })
})
