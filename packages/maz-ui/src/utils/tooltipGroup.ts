/** A tooltip opened less than this delay (ms) after another one closed opens without its delay */
export const TOOLTIP_GROUP_DELAY = 300

const openTooltips = new Set<unknown>()
let lastClosedAt = Number.NEGATIVE_INFINITY

export function shouldSkipTooltipDelay(now = Date.now()) {
  return openTooltips.size > 0 || now - lastClosedAt < TOOLTIP_GROUP_DELAY
}

export function markTooltipOpen(key: unknown) {
  openTooltips.add(key)
}

export function markTooltipClosed(key: unknown, now = Date.now()) {
  if (openTooltips.delete(key))
    lastClosedAt = now
}

export function forgetTooltip(key: unknown) {
  openTooltips.delete(key)
}

export function resetTooltipGroup() {
  openTooltips.clear()
  lastClosedAt = Number.NEGATIVE_INFINITY
}
