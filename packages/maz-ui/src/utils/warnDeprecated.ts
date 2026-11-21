const warned = new Set<string>()

// Removed in v6 (plans/ROADMAP.md) with the deprecated plugins
export function warnDeprecated(id: string, message: string) {
  if (process.env.NODE_ENV === 'production' || warned.has(id)) {
    return
  }

  warned.add(id)
  console.warn(`[maz-ui] ${message}`)
}
