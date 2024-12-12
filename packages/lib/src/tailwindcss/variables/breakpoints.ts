import type { ThemeConfig } from 'tailwindcss/types/config'

export const screens = {
  'mob-s': '320px',
  'mob-m': '425px',
  'mob-l': '576px',
  'tab-s': '640px', // sm
  'tab-m': '768px', // md
  'tab-l': '992px',
  'lap-s': '1024px', // lg
  'lap-m': '1280px', // xl
  'lap-l': '1366px',
  'lap-xl': '1440px', // 2xl
  'lap-2xl': '1680px',
  'lap-3xl': '1920px',
} satisfies ThemeConfig['screens']

export function getNumericScreensFromTailwind<
  T extends Record<string, string> | Record<string, number>,
>(inputScreens: T) {
  const breakpoints: Record<string, number> = {}

  for (const [key, value] of Object.entries(inputScreens)) {
    breakpoints[key] = Number.parseInt(value, 10)
  }

  return breakpoints as Record<keyof T, number>
}
