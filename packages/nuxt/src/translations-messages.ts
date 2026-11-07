import type { MazUiNuxtTranslationsMessages } from './types'

export const TRANSLATIONS_MESSAGES_TEMPLATE = 'maz-ui-translations.mjs'

/**
 * Module of the `translations.messages` option, imported by the translations plugin: a file path
 * becomes a lazy import (one chunk per locale, loaded when the locale is used), an object is inlined.
 * Nothing goes through `runtimeConfig`, so the messages are not serialized in the payload of every page.
 */
export async function renderTranslationsMessages(
  messages: MazUiNuxtTranslationsMessages | undefined,
  resolvePath: (path: string) => Promise<string>,
  warn: (message: string) => void,
): Promise<string> {
  const entries: string[] = []

  for (const [locale, value] of Object.entries(messages ?? {})) {
    const key = JSON.stringify(locale)

    if (typeof value === 'string') {
      entries.push(`  ${key}: () => import(${JSON.stringify(await resolvePath(value))}),`)
    }
    else if (typeof value === 'function') {
      warn(`translations.messages.${locale} is a function: it cannot be serialized in the Nuxt config, use the path of a file that exports the messages instead.`)
    }
    else {
      entries.push(`  ${key}: ${JSON.stringify(value)},`)
    }
  }

  return `export default {\n${entries.join('\n')}\n}\n`
}
