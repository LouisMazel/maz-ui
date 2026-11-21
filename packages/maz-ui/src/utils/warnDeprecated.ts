import { isProduction } from '@maz-ui/utils/helpers/isProduction'

const warned = new Set<string>()

// Removed in v6 (plans/ROADMAP.md) with the deprecated plugins
export function warnDeprecated(id: string, message: string) {
  if (isProduction() || warned.has(id)) {
    return
  }

  warned.add(id)
  console.warn(`[maz-ui] ${message}`)
}
