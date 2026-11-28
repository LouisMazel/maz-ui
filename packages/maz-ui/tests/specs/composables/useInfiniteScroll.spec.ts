import { useInfiniteScroll } from '@composables/useInfiniteScroll.ts'
import { FakeIntersectionObserver, useFakeIntersectionObserver } from '@tests/helpers/intersection-observer.ts'
import { nextTick } from 'vue'

async function setup(loadMore: () => unknown, options: Parameters<typeof useInfiniteScroll>[2] = {}) {
  const sentinel = document.createElement('div')
  const result = useInfiniteScroll(sentinel, loadMore, options)
  await nextTick()
  return { ...result, observer: FakeIntersectionObserver.last! }
}

describe('given useInfiniteScroll', () => {
  useFakeIntersectionObserver()

  describe('when it is created', () => {
    it('then the sentinel is observed with a bottom margin of 200px', async () => {
      const { observer } = await setup(vi.fn())

      expect(observer.options.rootMargin).toBe('0px 0px 200px 0px')
    })
  })

  describe('when the direction is horizontal and the distance 50', () => {
    it('then the margin is on the right', async () => {
      const { observer } = await setup(vi.fn(), { direction: 'horizontal', distance: 50 })

      expect(observer.options.rootMargin).toBe('0px 50px 0px 0px')
    })
  })

  describe('when the sentinel becomes visible', () => {
    it('then the next page is loaded once, isLoading being true meanwhile', async () => {
      let finish!: () => void
      const loadMore = vi.fn(() => new Promise<void>((resolve) => {
        finish = resolve
      }))
      const { observer, isLoading } = await setup(loadMore)

      observer.trigger(true)
      observer.trigger(true)
      expect(isLoading.value).toBe(true)
      observer.trigger(false)
      finish()

      await vi.waitFor(() => expect(isLoading.value).toBe(false))
      expect(loadMore).toHaveBeenCalledOnce()
    })
  })

  describe('when the sentinel stays visible after a load', () => {
    it('then the following page is loaded too, until it is hidden', async () => {
      const loadMore = vi.fn(() => {
        if (loadMore.mock.calls.length === 2)
          FakeIntersectionObserver.last?.trigger(false)
      })
      const { observer } = await setup(loadMore)

      observer.trigger(true)

      await vi.waitFor(() => expect(loadMore).toHaveBeenCalledTimes(2))
      await new Promise(resolve => setTimeout(resolve, 50))
      expect(loadMore).toHaveBeenCalledTimes(2)
    })
  })

  describe('when canLoadMore returns false', () => {
    it('then nothing is loaded and isFinished is true', async () => {
      const loadMore = vi.fn()
      const { observer, isFinished } = await setup(loadMore, { canLoadMore: () => false })

      observer.trigger(true)

      await vi.waitFor(() => expect(isFinished.value).toBe(true))
      expect(loadMore).not.toHaveBeenCalled()
    })
  })

  describe('when loadMore throws', () => {
    it('then the error is kept and the sentinel does not load again', async () => {
      const failure = new Error('network')
      const loadMore = vi.fn().mockRejectedValue(failure)
      const { observer, error } = await setup(loadMore)

      observer.trigger(true)
      await vi.waitFor(() => expect(error.value).toBe(failure))
      observer.trigger(true)

      expect(loadMore).toHaveBeenCalledOnce()
    })

    describe('when reset is called while the sentinel is visible', () => {
      it('then the error is cleared and the page is loaded again', async () => {
        const loadMore = vi.fn().mockRejectedValueOnce(new Error('network')).mockImplementation(() => {
          FakeIntersectionObserver.last?.trigger(false)
        })
        const { observer, error, reset } = await setup(loadMore)

        observer.trigger(true)
        await vi.waitFor(() => expect(error.value).toBeDefined())
        reset()

        await vi.waitFor(() => expect(loadMore).toHaveBeenCalledTimes(2))
        expect(error.value).toBeUndefined()
      })
    })
  })

  describe('when reset is called after the end', () => {
    describe('when the sentinel is hidden', () => {
      it('then isFinished is false and nothing is loaded', async () => {
        let more = false
        const loadMore = vi.fn()
        const { observer, isFinished, reset } = await setup(loadMore, { canLoadMore: () => more })

        observer.trigger(true)
        await vi.waitFor(() => expect(isFinished.value).toBe(true))
        observer.trigger(false)
        more = true
        reset()

        expect(isFinished.value).toBe(false)
        expect(loadMore).not.toHaveBeenCalled()
      })
    })
  })

  describe('when stop is called', () => {
    it('then the sentinel is not observed anymore', async () => {
      const { observer, stop } = await setup(vi.fn())

      stop()

      expect(observer.disconnected).toBe(true)
    })
  })
})
