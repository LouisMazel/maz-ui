import { useReadingTime } from '@composables/useReadingTime'
import { ref } from 'vue'

describe('given the useReadingTime composable', () => {
  describe('when content is provided directly and velocity is default', () => {
    it('then it should calculate reading time correctly', () => {
      const options = { content: 'This is a test content with several words.' }
      const { content, wordCount, velocity, duration } = useReadingTime(options)

      expect(content.value).toBe('This is a test content with several words.')
      expect(wordCount.value).toBe(8)
      expect(velocity.value).toBe(150)
      expect(duration.value).toBe(1)
    })
  })

  describe('when content is provided through a selector and custom velocity', () => {
    it('then it should calculate reading time correctly', () => {
      document.body.innerHTML = `<div id="content">This is another test content with several words.</div>`
      const options = { contentSelector: '#content', velocity: 100 }
      const { content, wordCount, velocity, duration } = useReadingTime(options)

      expect(content.value).toBe('This is another test content with several words.')
      expect(wordCount.value).toBe(8)
      expect(velocity.value).toBe(100)
      expect(duration.value).toBe(1)
    })
  })

  describe('when content is provided through a ref and custom velocity', () => {
    it('then it should calculate reading time correctly', () => {
      const contentRef = ref({ textContent: 'This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words.' })
      const options = { contentRef, velocity: 100 } as any
      const { content, wordCount, velocity, duration } = useReadingTime(options)

      expect(content.value).toBe('This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words. This is yet another test content with several words.')
      expect(wordCount.value).toBe(315)
      expect(velocity.value).toBe(100)
      expect(duration.value).toBe(4)
    })
  })
})
