import { en } from '@maz-ui/translations'

function resolve(key: string): unknown {
  return key.split('.').reduce<unknown>((value, part) => (value as Record<string, unknown> | undefined)?.[part], en)
}

export function englishT(key: string, variables?: Record<string, unknown>) {
  const message = resolve(key)

  if (typeof message !== 'string')
    return key

  return message.replaceAll(/\{(\w+)\}/g, (match, name: string) => variables && name in variables ? String(variables[name]) : match)
}

export function useEnglishTranslations() {
  return { t: englishT, locale: { value: 'en' } }
}
