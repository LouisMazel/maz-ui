import MazAvatar from '@components/MazAvatar.vue'
import MazLazyImg from '@components/MazLazyImg.vue'
import MazIcon from '@components/MazIcon.vue'
import { shallowMount } from '@vue/test-utils'

describe('MazAvatar', () => {
  test('Component should have expected props', () => {
    const wrapper = shallowMount(MazAvatar)
    const expectedProps = [
      'src',
      'caption',
      'href',
      'to',
      'alt',
      'target',
      'size',
      'bordered',
      'clickable',
      'square',
      'noElevation',
      'showCaption',
      'imageHeightFull',
      'noLoader',
      'buttonColor',
    ]
    expect(Object.keys(wrapper.props())).toEqual(expectedProps)
  })

  test('Component props should have correct default values', () => {
    const wrapper = shallowMount(MazAvatar)
    expect(wrapper.props().src).toBeUndefined()
    expect(wrapper.props().caption).toBeUndefined()
    expect(wrapper.props().href).toBeUndefined()
    expect(wrapper.props().to).toBeUndefined()
    expect(wrapper.props().alt).toBe('avatar image')
    expect(wrapper.props().target).toBe('_self')
    expect(wrapper.props().size).toBeUndefined()
    expect(wrapper.props().bordered).toBe(false)
    expect(wrapper.props().clickable).toBe(false)
    expect(wrapper.props().square).toBe(false)
    expect(wrapper.props().noElevation).toBe(false)
    expect(wrapper.props().showCaption).toBe(false)
    expect(wrapper.props().imageHeightFull).toBe(false)
    expect(wrapper.props().noLoader).toBe(false)
    expect(wrapper.props().buttonColor).toBe('info')
  })

  test('Component should render correctly', () => {
    const wrapper = shallowMount(MazAvatar)
    expect(wrapper.find('.m-avatar').exists()).toBe(true)
    expect(wrapper.find('.m-avatar__wrapper').exists()).toBe(true)
    expect(wrapper.findComponent(MazLazyImg).exists()).toBe(false)
    expect(wrapper.find('.m-avatar__initial').exists()).toBe(false)
    expect(wrapper.find('.m-avatar__button').exists()).toBe(false)
    expect(wrapper.findComponent(MazIcon).exists()).toBe(false)
    expect(wrapper.find('.m-avatar__caption').exists()).toBe(false)
  })
})
