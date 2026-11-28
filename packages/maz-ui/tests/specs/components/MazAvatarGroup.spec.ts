import MazAvatarGroup from '@components/MazAvatarGroup.vue'
import { mount } from '@vue/test-utils'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const avatars = [
  { caption: 'Camille Durand' },
  { caption: 'Louis Mazel' },
  { caption: 'Ines Martin' },
  { src: '/hugo.jpg', alt: 'Hugo Petit' },
  { src: '/jade.jpg' },
]

function mountComponent(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
  return mount(MazAvatarGroup, { props: { avatars, ...props }, ...options })
}

describe('given a MazAvatarGroup', () => {
  describe('when it renders without max', () => {
    it('then every avatar is displayed in a list without a counter', () => {
      const wrapper = mountComponent()

      expect(wrapper.element.tagName).toBe('UL')
      expect(wrapper.findAll('.m-avatar')).toHaveLength(5)
      expect(wrapper.find('.m-avatar-group__more').exists()).toBe(false)
    })

    it('then each avatar keeps an accessible name and a tooltip', () => {
      const wrapper = mountComponent()
      const items = wrapper.findAll('li')

      expect(items[0]!.attributes('title')).toBe('Camille Durand')
      expect(items[0]!.find('.maz\\:sr-only').text()).toBe('Camille Durand')
      expect(items[3]!.attributes('title')).toBe('Hugo Petit')
      expect(items[4]!.attributes('title')).toBeUndefined()
      expect(items[0]!.find('.m-avatar').element.parentElement?.getAttribute('aria-hidden')).toBe('true')
    })

    it('then it renders the same markup on the server', async () => {
      const html = await renderToString(createSSRApp(MazAvatarGroup, { avatars }))

      expect(html).toContain('m-avatar-group')
    })

    it('then the size, the overlap and the class apply', () => {
      const wrapper = mountComponent({ size: 'lg', overlap: 0.4, class: 'custom' })
      const style = (wrapper.element as HTMLElement).style

      expect(style.getPropertyValue('--m-avatar-group-size')).toBe('3.5rem')
      expect(style.getPropertyValue('--m-avatar-group-overlap')).toBe('0.4')
      expect(wrapper.classes()).toContain('custom')
    })

    it('then a free size is kept as is', () => {
      const wrapper = mountComponent({ size: '5rem' })

      expect((wrapper.element as HTMLElement).style.getPropertyValue('--m-avatar-group-size')).toBe('5rem')
    })

    it('then the spread can be turned off', () => {
      expect(mountComponent().classes()).toContain('m-avatar-group--spread')
      expect(mountComponent({ spread: false }).classes()).not.toContain('m-avatar-group--spread')
    })
  })

  describe('when max is lower than the number of avatars', () => {
    it('then the others are counted in a text avatar', () => {
      const wrapper = mountComponent({ max: 3 })

      expect(wrapper.findAll('.m-avatar')).toHaveLength(3)
      expect(wrapper.find('.m-avatar-group__more').element.tagName).toBe('SPAN')
      expect(wrapper.find('.m-avatar-group__more').text()).toContain('+2')
    })

    it('then the count is read by assistive technologies', () => {
      const wrapper = mountComponent({ max: 3 })

      expect(wrapper.find('.m-avatar-group__more .maz\\:sr-only').exists()).toBe(true)
    })

    it('then moreClickable renders a button that emits more-click', async () => {
      const wrapper = mountComponent({ max: 1, moreClickable: true })
      const button = wrapper.find('button.m-avatar-group__more')

      expect(button.attributes('type')).toBe('button')
      await button.trigger('click')
      expect(wrapper.emitted('more-click')).toHaveLength(1)
    })

    it('then a simple counter ignores the click', async () => {
      const wrapper = mountComponent({ max: 1 })

      await wrapper.find('.m-avatar-group__more').trigger('click')
      expect(wrapper.emitted('more-click')).toBeUndefined()
    })

    it('then the more slot replaces the counter with the hidden avatars', () => {
      const wrapper = mountComponent({ max: 2 }, {
        slots: { more: `<template #more="{ count, hidden }"><em id="custom">{{ count }}-{{ hidden.length }}</em></template>` },
      })

      expect(wrapper.find('#custom').text()).toBe('3-3')
      expect(wrapper.find('.m-avatar-group__more').exists()).toBe(false)
    })
  })

  describe('when max is not lower than the number of avatars', () => {
    it('then there is no counter', () => {
      expect(mountComponent({ max: 5 }).find('.m-avatar-group__more').exists()).toBe(false)
      expect(mountComponent({ max: 10 }).findAll('.m-avatar')).toHaveLength(5)
      expect(mountComponent({ max: -1 }).findAll('.m-avatar')).toHaveLength(5)
    })
  })

  describe('when the shape is set', () => {
    it('then the rounded size applies to the items and the counter', () => {
      const wrapper = mountComponent({ max: 1, roundedSize: 'lg' })

      expect(wrapper.find('li').classes()).toContain('maz:rounded-lg')
      expect(wrapper.find('.m-avatar-group__more').classes()).toContain('maz:rounded-lg')
    })

    it('then the none shape has no radius class', () => {
      expect(mountComponent({ roundedSize: 'none' }).find('li').classes().some(name => name.startsWith('maz:rounded'))).toBe(false)
    })
  })
})
