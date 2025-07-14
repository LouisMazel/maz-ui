import 'vitest-canvas-mock'

export function setup() {
  process.env.TZ = 'Europe/Paris'
}

vi.mock('@maz-ui/translations/src/useTranslations.js', () => ({
  useTranslations: vi.fn().mockReturnValue({
    t: vi.fn().mockReturnValue('test'),
  }),
}))

vi.mock('globalThis', () => ({
  globalThis: {
    document: {
      createElement: vi.fn(),
    },
  },
}))
