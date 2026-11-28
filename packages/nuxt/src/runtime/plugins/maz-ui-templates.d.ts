declare module '#build/maz-ui-translations.mjs' {
  import type { MazUiTranslationsMessages } from '@maz-ui/translations'

  const messages: MazUiTranslationsMessages
  export default messages
}

declare module '#build/maz-ui-flags.mjs' {
  const loadCountryFlag: ((code: string) => Promise<string | undefined>) | undefined
  export default loadCountryFlag
}

declare module '#build/maz-ui-open-external.mjs' {
  const openExternal: ((href: string, event: MouseEvent) => void) | undefined
  export default openExternal
}
