import { useRelativeTime } from '@composables/useRelativeTime'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { withSetup } from '@tests/helpers/withSetup'
import { effectScope, nextTick, ref } from 'vue'

const NOW = new Date('2024-06-15T12:00:00.000Z')
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function ago(ms: number) {
  return new Date(NOW.getTime() - ms)
}

function ahead(ms: number) {
  return new Date(NOW.getTime() + ms)
}

async function advance(ms: number) {
  await vi.advanceTimersByTimeAsync(ms)
  await nextTick()
}

function setVisibility(state: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('given the useRelativeTime composable', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    setVisibility('visible')
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('when the date is a plain value', () => {
    it('then the text, the unit and the details are returned', () => {
      const [{ text, unit, result }, app] = withSetup(() => useRelativeTime(ago(3 * MINUTE), { locale: 'en' }))

      expect(text.value).toBe('3 minutes ago')
      expect(unit.value).toBe('minute')
      expect(result.value).toMatchObject({ kind: 'relative', value: -3, isFuture: false })

      app.unmount()
    })

    it.each([
      ['en', '3 minutes ago'],
      ['fr', 'il y a 3 minutes'],
      ['ja', '3 分前'],
    ])('then the locale %s is applied', (locale, expected) => {
      const [{ text }, app] = withSetup(() => useRelativeTime(ago(3 * MINUTE), { locale }))

      expect(text.value).toBe(expected)

      app.unmount()
    })

    it('then the title is the full localized date', () => {
      const [{ title }, app] = withSetup(() => useRelativeTime(ago(3 * MINUTE), { locale: 'en' }))

      expect(title.value).toBe(new Intl.DateTimeFormat('en', { dateStyle: 'long', timeStyle: 'short' }).format(ago(3 * MINUTE)))

      app.unmount()
    })

    it('then the title options are applied', () => {
      const [{ title }, app] = withSetup(() => useRelativeTime(ago(3 * MINUTE), {
        locale: 'en',
        titleOptions: { dateStyle: 'short', timeZone: 'UTC' },
      }))

      expect(title.value).toBe('6/15/24')

      app.unmount()
    })

    it('then the helper options are forwarded', () => {
      const [{ text }, app] = withSetup(() => useRelativeTime(ago(3 * MINUTE), { locale: 'en', format: 'compact', style: 'narrow' }))

      expect(text.value).toBe('3m')

      app.unmount()
    })
  })

  describe('when the inputs are reactive', () => {
    it('then the text follows the date, the locale and the options', async () => {
      const date = ref<Date | string | number>(ago(3 * MINUTE))
      const locale = ref('en')
      const options = ref<{ locale: typeof locale, format: 'relative' | 'compact' }>({ locale, format: 'relative' })

      const [{ text }, app] = withSetup(() => useRelativeTime(date, options))

      expect(text.value).toBe('3 minutes ago')

      date.value = ago(2 * HOUR).toISOString()
      await nextTick()
      expect(text.value).toBe('2 hours ago')

      locale.value = 'fr'
      await nextTick()
      expect(text.value).toBe('il y a 2 heures')

      options.value = { locale, format: 'compact' }
      await nextTick()
      expect(text.value.replaceAll(/\s/g, ' ')).toBe('2 h')

      app.unmount()
    })

    it('then getters are accepted', () => {
      const date = ref(ago(5 * MINUTE))

      const [{ text }, app] = withSetup(() => useRelativeTime(() => date.value, () => ({
        locale: () => 'en',
      })))

      expect(text.value).toBe('5 minutes ago')

      app.unmount()
    })
  })

  describe('when the locale is not provided', () => {
    it('then the locale of the translations plugin is used', async () => {
      const locale = ref('fr')
      vi.mocked(useTranslations).mockReturnValueOnce({ locale } as unknown as ReturnType<typeof useTranslations>)

      const [{ text }, app] = withSetup(() => useRelativeTime(ago(3 * MINUTE)))

      expect(text.value).toBe('il y a 3 minutes')

      locale.value = 'en'
      await nextTick()
      expect(text.value).toBe('3 minutes ago')

      app.unmount()
    })

    it('then the explicit locale wins over the translations plugin', () => {
      vi.mocked(useTranslations).mockReturnValueOnce({
        locale: ref('fr'),
      } as unknown as ReturnType<typeof useTranslations>)

      const [{ text }, app] = withSetup(() => useRelativeTime(ago(3 * MINUTE), { locale: 'ja' }))

      expect(text.value).toBe('3 分前')

      app.unmount()
    })

    it('then the browser locale is used without the plugin', () => {
      vi.spyOn(globalThis.navigator, 'language', 'get').mockReturnValue('fr-FR')
      vi.mocked(useTranslations).mockImplementationOnce(() => {
        throw new Error('plugin not installed')
      })

      const [{ text }, app] = withSetup(() => useRelativeTime(ago(3 * MINUTE)))

      expect(text.value).toBe('il y a 3 minutes')

      app.unmount()
    })
  })

  describe('when time passes', () => {
    it('then the text is refreshed every second under a minute', async () => {
      const [{ text }, app] = withSetup(() => useRelativeTime(ago(30 * SECOND), { locale: 'en' }))

      expect(text.value).toBe('30 seconds ago')

      await advance(SECOND)
      expect(text.value).toBe('31 seconds ago')

      await advance(2 * SECOND)
      expect(text.value).toBe('33 seconds ago')

      app.unmount()
    })

    it('then a single timer is scheduled at the next change above the minute', async () => {
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')

      const [{ text }, app] = withSetup(() => useRelativeTime(ago(2 * MINUTE + 20 * SECOND), { locale: 'en' }))

      expect(text.value).toBe('2 minutes ago')
      expect(vi.getTimerCount()).toBe(1)
      expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 40 * SECOND)

      await advance(40 * SECOND - 1)
      expect(text.value).toBe('2 minutes ago')

      await advance(1)
      expect(text.value).toBe('3 minutes ago')
      expect(vi.getTimerCount()).toBe(1)
      expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), MINUTE)

      app.unmount()
    })

    it('then the future date counts down and switches to now then to the past', async () => {
      const [{ text }, app] = withSetup(() => useRelativeTime(ahead(10 * SECOND + 1), { locale: 'en' }))

      expect(text.value).toBe('in 10 seconds')

      await advance(5 * SECOND + 2)
      expect(text.value).toBe('now')

      await advance(5 * SECOND)
      expect(text.value).toBe('now')

      await advance(5 * SECOND)
      expect(text.value).toBe('5 seconds ago')

      app.unmount()
    })

    it('then the timer is rescheduled when the date changes', async () => {
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
      const date = ref(ago(10 * SECOND))

      const [{ text }, app] = withSetup(() => useRelativeTime(date, { locale: 'en' }))

      expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), SECOND)

      date.value = ago(2 * HOUR + 15 * MINUTE)
      await nextTick()

      expect(text.value).toBe('2 hours ago')
      expect(vi.getTimerCount()).toBe(1)
      expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 45 * MINUTE)

      app.unmount()
    })

    it('then the date changing uses the current time', async () => {
      const date = ref(ago(10 * MINUTE))

      const [{ text }, app] = withSetup(() => useRelativeTime(date, { locale: 'en', autoUpdate: false }))

      vi.setSystemTime(new Date(NOW.getTime() + HOUR))
      date.value = ago(10 * MINUTE)
      await nextTick()

      expect(text.value).toBe('1 hour ago')

      app.unmount()
    })

    it('then the timer is split when the delay exceeds the maximum timeout', async () => {
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')

      const [{ text }, app] = withSetup(() => useRelativeTime(ahead(1000 * DAY), { locale: 'en' }))

      expect(text.value).toBe('in 2 years')
      expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 2_147_483_647)

      await advance(2_147_483_647)
      expect(vi.getTimerCount()).toBe(1)
      expect(text.value).toBe('in 2 years')

      app.unmount()
    })

    it('then no timer is scheduled when the absolute date never changes', () => {
      const [{ text }, app] = withSetup(() => useRelativeTime(ago(30 * DAY), {
        locale: 'en',
        absoluteAfter: 7 * DAY,
        absoluteOptions: { dateStyle: 'medium', timeZone: 'UTC' },
      }))

      expect(text.value).toBe('May 16, 2024')
      expect(vi.getTimerCount()).toBe(0)

      app.unmount()
    })
  })

  describe('when the auto update is disabled', () => {
    it('then no timer is scheduled and refresh updates the text', async () => {
      const [{ text, refresh }, app] = withSetup(() => useRelativeTime(ago(30 * SECOND), { locale: 'en', autoUpdate: false }))

      expect(vi.getTimerCount()).toBe(0)

      await advance(10 * SECOND)
      expect(text.value).toBe('30 seconds ago')

      refresh()
      await nextTick()
      expect(text.value).toBe('40 seconds ago')

      app.unmount()
    })

    it('then the timer starts when the option is enabled', async () => {
      const autoUpdate = ref(false)

      const [{ text }, app] = withSetup(() => useRelativeTime(ago(30 * SECOND), { locale: 'en', autoUpdate }))

      expect(vi.getTimerCount()).toBe(0)

      autoUpdate.value = true
      await nextTick()
      expect(vi.getTimerCount()).toBe(1)

      await advance(SECOND)
      expect(text.value).toBe('31 seconds ago')

      autoUpdate.value = false
      await nextTick()
      expect(vi.getTimerCount()).toBe(0)

      app.unmount()
    })
  })

  describe('when a reference date is provided', () => {
    it('then the text is fixed and no timer is scheduled', async () => {
      const now = ref(NOW)

      const [{ text }, app] = withSetup(() => useRelativeTime(ago(30 * SECOND), { locale: 'en', now }))

      expect(text.value).toBe('30 seconds ago')
      expect(vi.getTimerCount()).toBe(0)

      now.value = new Date(NOW.getTime() + MINUTE)
      await nextTick()
      expect(text.value).toBe('1 minute ago')

      app.unmount()
    })
  })

  describe('when the date is missing or invalid', () => {
    it.each([null, undefined, ''])('then the text is empty for %s', (value) => {
      const [{ text, title, unit, result }, app] = withSetup(() => useRelativeTime(value, { locale: 'en' }))

      expect(text.value).toBe('')
      expect(title.value).toBe('')
      expect(unit.value).toBeNull()
      expect(result.value).toBeUndefined()
      expect(vi.getTimerCount()).toBe(0)

      app.unmount()
    })

    it('then an invalid date warns and gives an empty text', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const [{ text }, app] = withSetup(() => useRelativeTime('not a date', { locale: 'en' }))

      expect(text.value).toBe('')
      expect(warn).toHaveBeenCalled()

      app.unmount()
    })

    it('then the text appears when the date becomes valid', async () => {
      const date = ref<Date | null>(null)

      const [{ text }, app] = withSetup(() => useRelativeTime(date, { locale: 'en' }))

      date.value = ago(MINUTE)
      await nextTick()

      expect(text.value).toBe('1 minute ago')
      expect(vi.getTimerCount()).toBe(1)

      app.unmount()
    })
  })

  describe('when the component is unmounted', () => {
    it('then the timer is cleared', () => {
      const [, app] = withSetup(() => useRelativeTime(ago(30 * SECOND), { locale: 'en' }))

      expect(vi.getTimerCount()).toBe(1)

      app.unmount()

      expect(vi.getTimerCount()).toBe(0)
    })

    it('then the visibility listener is removed', () => {
      const removeSpy = vi.spyOn(document, 'removeEventListener')

      const [, app] = withSetup(() => useRelativeTime(ago(30 * SECOND), { locale: 'en' }))

      app.unmount()

      expect(removeSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    })

    it('then an effect scope stops the timer', () => {
      const scope = effectScope()

      scope.run(() => useRelativeTime(ago(30 * SECOND), { locale: 'en' }))
      expect(vi.getTimerCount()).toBe(1)

      scope.stop()
      expect(vi.getTimerCount()).toBe(0)
    })

    it('then the composable works outside of any scope', () => {
      const { text } = useRelativeTime(ago(30 * SECOND), { locale: 'en', pauseWhenHidden: false })

      expect(text.value).toBe('30 seconds ago')
    })
  })

  describe('when the page is hidden', () => {
    it('then the timer is paused and the text is refreshed when visible again', async () => {
      const [{ text }, app] = withSetup(() => useRelativeTime(ago(30 * SECOND), { locale: 'en' }))

      expect(vi.getTimerCount()).toBe(1)

      setVisibility('hidden')
      await advance(5 * SECOND)

      expect(vi.getTimerCount()).toBe(0)
      const hiddenText = text.value

      await advance(MINUTE)
      expect(text.value).toBe(hiddenText)

      setVisibility('visible')
      await nextTick()

      expect(text.value).toBe('1 minute ago')
      expect(vi.getTimerCount()).toBe(1)

      app.unmount()
    })

    it('then the timer keeps running when pauseWhenHidden is false', async () => {
      const [{ text }, app] = withSetup(() => useRelativeTime(ago(30 * SECOND), { locale: 'en', pauseWhenHidden: false }))

      setVisibility('hidden')
      await advance(6 * SECOND)

      expect(text.value).toBe('36 seconds ago')

      app.unmount()
    })
  })
})
