import MazLoadingBar from '@components/MazLoadingBar.vue'
import { mount } from '@vue/test-utils'

describe('mazLoadingBar', () => {
  it('renders default color correctly', () => {
    const wrapper = mount(MazLoadingBar)
    // @ts-expect-error - colorCSSVariables is not typed
    expect(wrapper.vm.colorCSSVariables.alpha).toBe('color-mix(in srgb, var(--maz-primary) 20%, transparent)')
    // @ts-expect-error - colorCSSVariables is not typed
    expect(wrapper.vm.colorCSSVariables.main).toBe('var(--maz-primary)')
  })
})

describe('given MazLoadingBar with the neutral color', () => {
  it('then it uses the neutral foreground for the bar and its track', () => {
    const wrapper = mount(MazLoadingBar, { props: { color: 'neutral' } })
    const style = wrapper.attributes('style')

    expect(style).toContain('--loading-bar-main-color: var(--maz-neutral-foreground)')
    expect(style).toContain('var(--maz-neutral-foreground) 20%')
  })
})
