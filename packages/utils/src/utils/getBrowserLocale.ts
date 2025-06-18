import { isServer } from './isServer'

export function getBrowserLocale(): string | undefined {
  try {
    if (isServer()) {
      return undefined
    }

    return window.navigator.language
  }
  catch (error) {
    throw new Error(`[MazInputPhoneNumber] (browserLocale) ${error}`)
  }
}
