/**
 * An open overlay (popover, dialog, drawer, bottom sheet): what it contains (its panel and its trigger)
 */
export interface OverlayLayer {
  contains: (target: Node) => boolean
}

/**
 * Open overlays, in their opening order. An overlay opened from another one (a select inside a dialog,
 * a dialog opened from a dropdown) is above it: Escape and the focus trap only act on the top one,
 * and a click in an upper overlay is not outside the lower ones.
 */
const openLayers: OverlayLayer[] = []

export function addOverlayLayer(layer: OverlayLayer) {
  removeOverlayLayer(layer)
  openLayers.push(layer)
}

export function removeOverlayLayer(layer: OverlayLayer) {
  const index = openLayers.indexOf(layer)

  if (index !== -1)
    openLayers.splice(index, 1)
}

export function isTopOverlayLayer(layer: OverlayLayer) {
  return openLayers.at(-1) === layer
}

/**
 * Whether the target is inside an overlay opened above the layer
 */
export function isInUpperOverlayLayer(layer: OverlayLayer, target: Node) {
  const index = openLayers.indexOf(layer)

  return index !== -1 && openLayers.slice(index + 1).some(upperLayer => upperLayer.contains(target))
}
