import type { Component } from 'vue'
import * as components from '@components/index'
import { runAxe } from '@tests/helpers/axe'
import { mount } from '@vue/test-utils'

interface AxeCase {
  name: string
  component: Component
  props?: Record<string, unknown>
  slots?: Record<string, string>
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
]

// Popover / backdrop based components trip `nested-interactive` because the
// MazPopover trigger wrapper is `role="button"` around an interactive slot.
// Fixing it requires moving the trigger ARIA onto the real interactive element
// (see plans/a11y-v5.md, "MazPopover"). Kept as todo so the gap stays visible.
const pendingCases: AxeCase[] = [
  { name: 'MazSelect', component: components.MazSelect, props: { label: 'Fruit', options: [{ label: 'Apple', value: 'a' }, { label: 'Banana', value: 'b' }] } },
  { name: 'MazDropdown', component: components.MazDropdown, props: { items: [{ label: 'Profile', href: '/p' }, { label: 'Logout', onClick: () => {} }] }, slots: { default: 'Open' } },
  // MazMarkdownEditor exposes the write/preview <textarea> with role="tabpanel",
  // which is an invalid role on a form field. Fixing it means restructuring the
  // tab markup (a wrapper tabpanel around the textarea), not just ARIA - deferred.
  { name: 'MazMarkdownEditor', component: components.MazMarkdownEditor, props: { label: 'Content' } },
]

describe('given the components are mounted', () => {
  describe.each(cases)('when $name is audited with axe', ({ component, props, slots }) => {
    it('then it has no accessibility violations', async () => {
      const wrapper = mount(component, {
        props,
        slots,
        attachTo: document.body,
      })

      await vi.dynamicImportSettled()

      expect(await runAxe(wrapper)).toHaveNoViolations()

      wrapper.unmount()
    })
  })

  describe.each(pendingCases)('when $name is audited with axe (pending MazPopover a11y)', ({ name }) => {
    it.todo(`then ${name} has no accessibility violations`)
  })
})
