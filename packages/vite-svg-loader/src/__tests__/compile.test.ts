import { compileSvgComponent } from '../compile'

describe('given compileSvgComponent', () => {
  describe('when an SVG is compiled', () => {
    it('then the code exports a component with a render function', () => {
      const code = compileSvgComponent('<svg viewBox="0 0 24 24"><path d="M0 0h24"/></svg>', { id: '/icon.svg', path: '/icon.svg' })

      expect(code).toContain('export function render')
      expect(code).toContain('"M0 0h24"')
      expect(code.endsWith('export default { render }')).toBe(true)
    })
  })

  describe('when the SVG has a style tag', () => {
    it('then the style tag is kept', () => {
      const code = compileSvgComponent('<svg><style>.a{fill:red}</style><path class="a"/></svg>', { id: '/icon.svg', path: '/icon.svg' })

      expect(code).toContain('"style"')
      expect(code).toContain('.a{fill:red}')
    })
  })

  describe('when the SVG is not valid', () => {
    it('then an error gives the path of the file', () => {
      expect(() => compileSvgComponent('<svg><path></svg>', { id: '/broken.svg', path: '/broken.svg' })).toThrow('[@maz-ui/vite-svg-loader] /broken.svg')
    })
  })
})
