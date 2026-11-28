import MazBreadcrumb from '@components/MazBreadcrumb.vue'
import { flushPromises, mount } from '@vue/test-utils'

vi.mock('@maz-ui/translations/composables/useTranslations', async () => ({
  useTranslations: (await import('../../helpers/translations.ts')).useEnglishTranslations,
}))

let navWidth = 1000

const items = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Company', href: '/company' },
  { label: 'Team', href: '/team' },
  { label: 'Current' },
]

describe('given a MazBreadcrumb', () => {
  beforeEach(() => {
    navWidth = 1000
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get(this: HTMLElement) {
        return this.querySelector('button') && this.classList.contains('m-breadcrumb__item') ? 40 : this.classList.contains('m-breadcrumb__item') ? 100 : 0
      },
    })
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get(this: HTMLElement) {
        return this.tagName === 'NAV' ? navWidth : 0
      },
    })
  })

  afterEach(() => {
    delete (HTMLElement.prototype as any).offsetWidth
    delete (HTMLElement.prototype as any).clientWidth
  })

  async function mountBreadcrumb(props: Record<string, unknown> = {}, slots = {}) {
    const wrapper = mount(MazBreadcrumb, { props: { items, ...props }, slots, attachTo: document.body })

    await flushPromises()

    return wrapper
  }

  function visibleLabels(wrapper: ReturnType<typeof mount>) {
    return wrapper.findAll('li.m-breadcrumb__item')
      .filter(item => !item.classes().includes('maz:invisible'))
      .map(item => item.text())
  }

  describe('when everything fits in one line', () => {
    it('then every crumb is visible and the ellipsis button is hidden', async () => {
      const wrapper = await mountBreadcrumb()

      expect(visibleLabels(wrapper)).toEqual(['Home', 'Projects', 'Company', 'Team', 'Current'])
      expect(wrapper.find('button').element.closest('li')!.classList.contains('maz:invisible')).toBe(true)

      wrapper.unmount()
    })

    it('then it is a labelled navigation landmark', async () => {
      const wrapper = await mountBreadcrumb()

      expect(wrapper.element.tagName).toBe('NAV')
      expect(wrapper.attributes('aria-label')).toBe('Breadcrumb')

      wrapper.unmount()
    })

    it('then a custom label replaces the default one', async () => {
      const wrapper = await mountBreadcrumb({ label: 'You are here' })

      expect(wrapper.attributes('aria-label')).toBe('You are here')

      wrapper.unmount()
    })

    it('then the last crumb is the current page and the others are links', async () => {
      const wrapper = await mountBreadcrumb()

      expect(wrapper.find('[aria-current="page"]').text()).toBe('Current')
      expect(wrapper.findAll('a')).toHaveLength(4)
      expect(wrapper.findAll('a')[0]!.attributes('href')).toBe('/')

      wrapper.unmount()
    })

    it('then a last crumb with a link is still not a link', async () => {
      const wrapper = await mountBreadcrumb({ items: [{ label: 'A', href: '/a' }, { label: 'B', href: '/b' }] })

      expect(wrapper.findAll('a')).toHaveLength(1)
      expect(wrapper.find('[aria-current="page"]').text()).toBe('B')

      wrapper.unmount()
    })
  })

  describe('when it does not fit in one line', () => {
    it('then the middle crumbs collapse behind a button', async () => {
      navWidth = 350
      const wrapper = await mountBreadcrumb()

      expect(visibleLabels(wrapper)).toEqual(['Home', '', 'Team', 'Current'])
      expect(wrapper.find('button').attributes('aria-label')).toBe('Show the hidden pages')

      wrapper.unmount()
    })

    it('then it keeps the first and the last crumbs at least', async () => {
      navWidth = 10
      const wrapper = await mountBreadcrumb()

      expect(visibleLabels(wrapper)).toEqual(['Home', '', 'Current'])

      wrapper.unmount()
    })

    it('then a click on the button unfolds the hidden crumbs and focuses the first one', async () => {
      navWidth = 350
      const wrapper = await mountBreadcrumb()

      await wrapper.find('button').trigger('click')
      await flushPromises()

      expect(visibleLabels(wrapper)).toEqual(['Home', 'Projects', 'Company', 'Team', 'Current'])
      expect(wrapper.find('button').exists()).toBe(false)
      expect(wrapper.findAll('.--unfold')).toHaveLength(2)
      expect(document.activeElement?.textContent?.trim()).toBe('Projects')

      wrapper.unmount()
    })

    it('then the crumbs fold again when the items change', async () => {
      navWidth = 350
      const wrapper = await mountBreadcrumb()

      await wrapper.find('button').trigger('click')
      await wrapper.setProps({ items: [...items] })
      await flushPromises()

      expect(wrapper.find('button').exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('when there are fewer than three crumbs', () => {
    it('then nothing collapses', async () => {
      navWidth = 10
      const wrapper = await mountBreadcrumb({ items: items.slice(0, 2) })

      expect(wrapper.find('button').exists()).toBe(false)

      wrapper.unmount()
    })
  })

  describe('when it uses slots and icons', () => {
    it('then the separator slot replaces the chevron', async () => {
      const wrapper = await mountBreadcrumb({}, { separator: '<span class="sep">/</span>' })

      expect(wrapper.findAll('.sep').length).toBeGreaterThan(0)

      wrapper.unmount()
    })

    it('then the item slot replaces a crumb', async () => {
      const wrapper = await mountBreadcrumb({}, { item: '<template #item="{ item, current }"><b>{{ item.label }}{{ current }}</b></template>' })

      expect(wrapper.findAll('b').at(-1)!.text()).toBe('Currenttrue')

      wrapper.unmount()
    })

    it('then an icon is rendered before the label of a plain crumb', async () => {
      const wrapper = await mountBreadcrumb({ items: [{ label: 'A', href: '/a' }, { label: 'B', icon: { render: () => null } }] })

      expect(wrapper.find('[aria-current="page"]').text()).toBe('B')

      wrapper.unmount()
    })
  })
})
