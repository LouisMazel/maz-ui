import { scanIconNames } from '../scan'

function scan(code: string, prefixes?: string[]) {
  return [
    ...scanIconNames(code, prefixes).names,
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
        hasIconContext: false,
      })
      expect(scanIconNames('import MazIcon from "maz-ui/components/MazIcon"').hasIconContext).toBe(false)
    })
  })

  describe('when the code has an icon context without a literal', () => {
    it('then the context is found', () => {
      expect(scanIconNames('{ icon: item.icon }')).toEqual({
        names: new Set(),
        hasIconContext: true,
      })
    })
  })
})
