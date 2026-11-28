function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * A duration token of the theme in milliseconds, multiplied by `--maz-motion-scale`
 * @example readMotionDuration('--maz-motion-normal', 220)
 */
export function readMotionDuration(name: string, fallback: number): number {
  const read = (variable: string, defaultValue: number, milliseconds = false) => {
    const match = /^(-?[\d.]+)(ms|s)?$/.exec(readCssVar(variable))
    const value = Number.parseFloat(match?.[1] ?? '')

    if (Number.isNaN(value))
      return defaultValue

    return milliseconds && match?.[2] === 's' ? value * 1000 : value
  }

  return read(name, fallback, true) * read('--maz-motion-scale', 1)
}

/**
 * An easing token of the theme (`--maz-easing-out`...), or the fallback when it is not defined
 */
export function readMotionEasing(name: string, fallback: string): string {
  const value = readCssVar(name)

  return value && !value.includes('var(')
    ? value
    : fallback
}
