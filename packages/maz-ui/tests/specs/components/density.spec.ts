import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import MazBtn from '@components/MazBtn.vue'
import MazListItem from '@components/MazListItem.vue'
import MazSegmented from '@components/MazSegmented.vue'
import MazTextarea from '@components/MazTextarea.vue'
import { mount } from '@vue/test-utils'

const SIZES = ['mini', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const DEFAULT_HEIGHTS = { mini: 6, xs: 8, sm: 10, md: 12, lg: 14, xl: 16 }
const css = readFileSync(resolve(__dirname, '../../../src/css/density.css'), 'utf8')
const defaultBlock = css.slice(css.indexOf(':where(:root'), css.indexOf('.m-density-compact {'))
const compactBlock = css.slice(css.indexOf('.m-density-compact {'))

describe('given the density tokens', () => {
  describe('when reading the default density', () => {
    it.each(SIZES)('then the %s height is the one of maz-ui 5', (size) => {
      expect(defaultBlock).toContain(`--maz-control-height-${size}: calc(var(--maz-space, 0.25rem) * ${DEFAULT_HEIGHTS[size]});`)
    })

    it('then the ratio of the paddings is 1', () => {
      expect(defaultBlock).toContain('--maz-density-ratio: 1;')
    })
  })

  describe('when reading the compact density', () => {
    it.each(SIZES)('then the %s height is declared', (size) => {
      expect(compactBlock).toContain(`--maz-control-height-${size}:`)
    })

    it('then a md control is 36px at a 14px base', () => {
      expect(compactBlock).toContain('--maz-control-height-md: calc(var(--maz-space, 0.25rem) * 72 / 7);')
    })

    it('then the menus are tighter', () => {
      expect(compactBlock).toContain('--maz-menu-padding: calc(var(--maz-space, 0.25rem) * 1);')
    })
  })
})

describe('given MazBtn', () => {
  describe('when the size is md', () => {
    it('then the height and the padding come from the tokens with the default values as fallback', () => {
      const classes = mount(MazBtn, { props: { size: 'md' } }).classes()

      expect(classes).toContain('maz:min-h-[var(--maz-control-height-md,3rem)]')
      expect(classes).toContain('maz:px-[var(--maz-control-padding-x-md,1rem)]')
    })
  })

  describe('when the button is a fab', () => {
    it('then the square follows the height token', () => {
      expect(mount(MazBtn, { props: { fab: true, size: 'sm' } }).classes()).toContain('maz:size-[var(--maz-control-height-sm,2.5rem)]')
    })
  })
})

describe('given MazSegmented', () => {
  describe('when the size is sm', () => {
    it('then the segment height follows the token and keeps the class of the default density', () => {
      const segment = mount(MazSegmented, { props: { modelValue: 'a', options: [{ label: 'A', value: 'a' }], size: 'sm' } }).find('[role="radio"]')

      expect(segment.classes()).toContain('maz:h-9')
      expect(segment.attributes('style')).toContain('--maz-control-height-sm')
      expect(segment.attributes('style')).toContain('--maz-density-ratio')
    })
  })
})

describe('given MazListItem', () => {
  describe('when the size is md', () => {
    it('then the height and the padding follow the density ratio', () => {
      const main = mount(MazListItem, { props: { title: 'Item', size: 'md' } }).find('.m-list-item__main')

      expect(main.attributes('style')).toContain('--maz-space, 0.25rem) * 11 * var(--maz-density-ratio, 1)')
    })
  })
})

describe('given MazTextarea', () => {
  describe('when the size is md', () => {
    it('then the height of the control follows the token', () => {
      const style = mount(MazTextarea, { props: { modelValue: '' } }).find('.m-textarea').attributes('style')

      expect(style).toContain('--mt-height: 3rem')
      expect(style).toContain('--mt-control-height: var(--maz-control-height-md, 3rem)')
    })
  })
})
