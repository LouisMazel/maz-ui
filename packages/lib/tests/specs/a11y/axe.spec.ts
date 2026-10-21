import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import * as components from '@components/index'
import { mazUi } from '@maz-ui/themes/presets/mazUi'
import { runAxe } from '@tests/helpers/axe'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

interface AxeCase {
  name: string
  component: Component
  props?: Record<string, unknown>
  slots?: Record<string, string>
  attrs?: Record<string, unknown>
  auditBody?: boolean
}

// Standalone components audited in isolation. Sub-components that require a
// parent context (MazTableCell/Row/Title, MazTabsContent*, MazSidebar*,
// MazBtnGroup children) are audited through their parent instead.
const cases: AxeCase[] = [
  { name: 'MazBtn', component: components.MazBtn, slots: { default: 'Click me' } },
  { name: 'MazBadge', component: components.MazBadge, slots: { default: 'New' } },
  { name: 'MazAlert', component: components.MazAlert, slots: { default: 'Something happened', title: 'Heads up' } },
  { name: 'MazAccordion', component: components.MazAccordion, slots: { 'title-1': 'Section 1', 'content-1': 'Body 1' } },
  { name: 'MazInput', component: components.MazInput, props: { label: 'Email', id: 'axe-input' } },
  { name: 'MazTextarea', component: components.MazTextarea, props: { label: 'Message' } },
  { name: 'MazInputNumber', component: components.MazInputNumber, props: { label: 'Quantity' } },
  { name: 'MazInputPrice', component: components.MazInputPrice, props: { label: 'Price' } },
  { name: 'MazInputTags', component: components.MazInputTags, props: { label: 'Tags' } },
  { name: 'MazInputCode', component: components.MazInputCode },
  { name: 'MazCheckbox', component: components.MazCheckbox, slots: { default: 'Accept' } },
  { name: 'MazSwitch', component: components.MazSwitch, slots: { default: 'Enabled' } },
  { name: 'MazRadio', component: components.MazRadio, props: { value: 'a', name: 'axe-radio' }, slots: { default: 'Option A' } },
  { name: 'MazRadioButtons', component: components.MazRadioButtons, props: { options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] } },
  { name: 'MazChecklist', component: components.MazChecklist, props: { items: [{ label: 'One', value: '1' }, { label: 'Two', value: '2' }] } },
  { name: 'MazSlider', component: components.MazSlider, props: { modelValue: 50 } },
  { name: 'MazAvatar', component: components.MazAvatar },
  { name: 'MazCard', component: components.MazCard, slots: { default: 'Card body' } },
  { name: 'MazCardSpotlight', component: components.MazCardSpotlight, slots: { default: 'Spotlight body' } },
  { name: 'MazContainer', component: components.MazContainer, slots: { default: 'Container body' } },
  { name: 'MazSpinner', component: components.MazSpinner },
  { name: 'MazSkeleton', component: components.MazSkeleton },
  { name: 'MazLoadingBar', component: components.MazLoadingBar },
  { name: 'MazReadingProgressBar', component: components.MazReadingProgressBar },
  { name: 'MazCircularProgressBar', component: components.MazCircularProgressBar, props: { percentage: 50 } },
  { name: 'MazLink', component: components.MazLink, props: { href: '/somewhere' }, slots: { default: 'Link' } },
  { name: 'MazPagination', component: components.MazPagination, props: { modelValue: 1, totalPages: 5 } },
  { name: 'MazAnimatedCounter', component: components.MazAnimatedCounter, props: { count: 100 } },
  { name: 'MazWindowMockup', component: components.MazWindowMockup, slots: { default: 'Window body' } },
  { name: 'MazReadMore', component: components.MazReadMore, slots: { default: 'Some long content to read more about' } },
  { name: 'MazCodeHighlight', component: components.MazCodeHighlight, props: { code: 'const a = 1', language: 'js' } },
  { name: 'MazTable', component: components.MazTable, props: { headers: ['Id', 'Name'], rows: [{ Id: 1, Name: 'John' }] } },
  { name: 'MazDropdown', component: components.MazDropdown, props: { items: [{ label: 'Profile', href: '/p' }, { label: 'Logout', onClick: () => {} }] }, slots: { default: 'Open' } },
  { name: 'MazDropdown (open)', component: components.MazDropdown, props: { modelValue: true, items: [{ label: 'Profile', href: '/p' }, { label: 'Logout', onClick: () => {} }] }, slots: { default: 'Open' }, auditBody: true },
  { name: 'MazSelect', component: components.MazSelect, props: { label: 'Fruit', options: [{ label: 'Apple', value: 'a' }, { label: 'Banana', value: 'b' }] } },
  { name: 'MazSelect (open)', component: components.MazSelect, props: { label: 'Fruit', open: true, modelValue: 'a', options: [{ label: 'Apple', value: 'a' }, { label: 'Banana', value: 'b' }] }, auditBody: true },
  { name: 'MazSelect (open, multiple)', component: components.MazSelect, props: { label: 'Fruit', open: true, multiple: true, modelValue: ['a'], options: [{ label: 'Apple', value: 'a' }, { label: 'Banana', value: 'b' }] }, auditBody: true },
  { name: 'MazSelect (open, search, optgroup)', component: components.MazSelect, props: { label: 'Fruit', open: true, search: true, options: [{ label: 'Fruits', options: [{ label: 'Apple', value: 'a' }] }, { label: 'Vegetables', options: [{ label: 'Leek', value: 'l' }] }] }, auditBody: true },
  { name: 'MazSelect (open, no results)', component: components.MazSelect, props: { label: 'Fruit', open: true, options: [] }, auditBody: true },
  { name: 'MazTabsBar', component: components.MazTabsBar, props: { items: ['First', 'Second', { label: 'Third', disabled: true }], modelValue: 1 }, attrs: { 'aria-label': 'Sections' } },
  { name: 'MazTabs', component: { components: { MazTabs: components.MazTabs, MazTabsBar: components.MazTabsBar, MazTabsContent: components.MazTabsContent, MazTabsContentItem: components.MazTabsContentItem }, template: '<MazTabs><MazTabsBar :items="[\'First\', \'Second\']" /><MazTabsContent><MazTabsContentItem :tab="1">One</MazTabsContentItem><MazTabsContentItem :tab="2">Two</MazTabsContentItem></MazTabsContent></MazTabs>' } },
  { name: 'MazRadioButtons (hint, error)', component: components.MazRadioButtons, props: { options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }], hint: 'Pick one', error: true }, attrs: { 'aria-label': 'Letters' } },
  { name: 'MazDatePicker (inline)', component: components.MazDatePicker, props: { inline: true, modelValue: '2024-01-15', locale: 'en-US', label: 'Date' } },
  { name: 'MazDatePicker (inline, double range)', component: components.MazDatePicker, props: { inline: true, double: true, modelValue: { start: '2024-01-10', end: '2024-01-20' }, locale: 'en-US', label: 'Period' } },
  { name: 'MazDatePicker (open)', component: components.MazDatePicker, props: { open: true, modelValue: '2024-01-15', locale: 'en-US', label: 'Date' }, auditBody: true },
  { name: 'MazDialog (open)', component: components.MazDialog, props: { modelValue: true, title: 'Confirm' }, slots: { default: '<p>Are you sure?</p>' }, auditBody: true },
  { name: 'MazBottomSheet (open)', component: components.MazBottomSheet, props: { modelValue: true, title: 'Options' }, slots: { default: '<p>Content</p>' }, auditBody: true },
  { name: 'MazDrawer (open)', component: components.MazDrawer, props: { title: 'Menu' }, attrs: { modelValue: true }, slots: { default: '<p>Content</p>' }, auditBody: true },
  { name: 'MazMarkdownEditor', component: components.MazMarkdownEditor, props: { label: 'Content', name: 'content' } },
  { name: 'MazMarkdownEditor (split)', component: components.MazMarkdownEditor, props: { label: 'Content', name: 'content', mode: 'split', modelValue: '# Title' } },
  { name: 'MazTable (sortable, selectable)', component: components.MazTable, props: { sortable: true, selectable: true, headers: ['Id', 'Name'], rows: [{ Id: 1, Name: 'John' }, { Id: 2, Name: 'Jane' }] } },
  { name: 'MazAnimatedText', component: components.MazAnimatedText, props: { text: 'Hello world' } },
  { name: 'MazAnimatedElement', component: components.MazAnimatedElement, slots: { default: '<p>Animated</p>' } },
  { name: 'MazExpandAnimation', component: components.MazExpandAnimation, props: { modelValue: true }, slots: { default: '<p>Expanded</p>' } },
  { name: 'MazBtnGroup', component: components.MazBtnGroup, props: { items: [{ text: 'One' }, { text: 'Two' }] } },
  { name: 'MazBackdrop (open)', component: components.MazBackdrop, props: { modelValue: true, ariaLabelledby: 'axe-backdrop-title' }, slots: { default: '<h2 id="axe-backdrop-title">Title</h2>' }, auditBody: true },
  { name: 'MazDialogConfirm (open)', component: components.MazDialogConfirm, props: { identifier: 'axe-confirm', modelValue: true, title: 'Delete?', message: 'This cannot be undone' }, auditBody: true },
  { name: 'MazCarousel', component: components.MazCarousel, slots: { default: '<div>Item 1</div><div>Item 2</div>' } },
  { name: 'MazDropzone', component: components.MazDropzone },
  { name: 'MazFullscreenLoader', component: components.MazFullscreenLoader, slots: { default: 'Loading' }, auditBody: true },
  { name: 'MazGallery', component: components.MazGallery, props: { images: [{ src: 'https://example.com/1.jpg', alt: 'First' }, { src: 'https://example.com/2.jpg', alt: 'Second' }] } },
  { name: 'MazIcon', component: components.MazIcon, props: { icon: '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>' } },
  { name: 'MazLazyImg', component: components.MazLazyImg, props: { src: 'https://example.com/image.jpg', alt: 'Example' } },
  { name: 'MazPullToRefresh', component: components.MazPullToRefresh, slots: { default: '<p>Content</p>' } },
  { name: 'MazSelectCountry', component: components.MazSelectCountry, props: { label: 'Country' } },
  { name: 'MazSelectCountry (open)', component: components.MazSelectCountry, props: { label: 'Country', open: true, onlyCodes: ['FR', 'US', 'DE', 'JP'] }, auditBody: true },
  { name: 'MazInputPhoneNumber', component: components.MazInputPhoneNumber },
  { name: 'MazSidebar', component: { components: { MazSidebar: components.MazSidebar, MazSidebarHeader: components.MazSidebarHeader, MazSidebarContent: components.MazSidebarContent, MazSidebarGroup: components.MazSidebarGroup, MazSidebarMenu: components.MazSidebarMenu, MazSidebarMenuItem: components.MazSidebarMenuItem, MazSidebarMenuButton: components.MazSidebarMenuButton, MazSidebarMenuSub: components.MazSidebarMenuSub, MazSidebarSeparator: components.MazSidebarSeparator, MazSidebarFooter: components.MazSidebarFooter, MazSidebarTrigger: components.MazSidebarTrigger }, template: '<MazSidebar :open="true"><MazSidebarHeader>Logo</MazSidebarHeader><MazSidebarContent><MazSidebarGroup label="Main"><MazSidebarMenu><MazSidebarMenuItem><MazSidebarMenuButton label="Home" href="/" /></MazSidebarMenuItem><MazSidebarMenuItem><MazSidebarMenuSub label="More" :default-open="true"><MazSidebarMenuItem><MazSidebarMenuButton label="Child" href="/child" /></MazSidebarMenuItem></MazSidebarMenuSub></MazSidebarMenuItem></MazSidebarMenu></MazSidebarGroup><MazSidebarSeparator /></MazSidebarContent><MazSidebarFooter><MazSidebarTrigger /></MazSidebarFooter></MazSidebar>' } },
  { name: 'MazStepper', component: components.MazStepper, props: { modelValue: 1, steps: [{ title: 'One' }, { title: 'Two' }] }, slots: { 'content-1': '<p>First</p>', 'content-2': '<p>Second</p>' } },
  { name: 'MazTicker', component: components.MazTicker, slots: { default: '<span>News</span>' } },
  { name: 'MazTimeline', component: components.MazTimeline, props: { steps: [{ title: 'Step 1' }, { title: 'Step 2' }] } },
  { name: 'MazUiProvider', component: components.MazUiProvider, props: { theme: { preset: mazUi } }, slots: { default: '<p>App</p>' } },
  { name: 'MazPopover (open)', component: components.MazPopover, props: { modelValue: true }, slots: { trigger: '<button>Open</button>', default: '<p>Content</p>' }, auditBody: true },
]

let mountedWrapper: VueWrapper | undefined

beforeAll(() => {
  Element.prototype.scrollTo ??= vi.fn()
  globalThis.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof globalThis.matchMedia
})

afterEach(() => {
  mountedWrapper?.unmount()
  mountedWrapper = undefined
  document.body.innerHTML = ''
})

describe('given the components are mounted', () => {
  describe.each(cases)('when $name is audited with axe', ({ component, props, slots, attrs, auditBody }) => {
    it('then it has no accessibility violations', { timeout: 20000 }, async () => {
      const wrapper = mountedWrapper = mount(component, {
        props,
        slots,
        attrs,
        attachTo: document.body,
      })

      await vi.dynamicImportSettled()
      await nextTick()
      await vi.dynamicImportSettled()
      await nextTick()

      expect(await runAxe(auditBody ? document.body : wrapper)).toHaveNoViolations()
    })
  })
})
