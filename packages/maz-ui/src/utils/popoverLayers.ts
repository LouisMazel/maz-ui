/**
 * An open popover: its panel and its trigger
 */
export interface PopoverLayer {
  contains: (target: Node) => boolean
}

/**
 * Open popovers, in their opening order. A popover opened from the panel of another one (a select
 * inside a dropdown) is above it: Escape only closes the top one, and a click in the panel of an
 * upper popover is not outside the lower ones.
 */
const openLayers: PopoverLayer[] = []

export function addPopoverLayer(layer: PopoverLayer) {
  removePopoverLayer(layer)
  openLayers.push(layer)
}

export function removePopoverLayer(layer: PopoverLayer) {
  const index = openLayers.indexOf(layer)

  if (index !== -1)
    openLayers.splice(index, 1)
}

export function isTopPopoverLayer(layer: PopoverLayer) {
  return openLayers.at(-1) === layer
}

/**
 * Whether the target is inside a popover opened above the layer
 */
export function isInUpperPopoverLayer(layer: PopoverLayer, target: Node) {
  const index = openLayers.indexOf(layer)

  return index !== -1 && openLayers.slice(index + 1).some(upperLayer => upperLayer.contains(target))
}
