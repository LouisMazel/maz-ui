/**
 * Flag source of `flags: 'local'`: the loaders of the flags are imported on demand,
 * so they stay out of the entry chunk, each flag is a separate chunk, downloaded only when displayed.
 */
export async function loadCountryFlag(code: string): Promise<string | undefined> {
  const { loadCountryFlag } = await import('maz-ui/country-flags')

  return loadCountryFlag(code)
}
