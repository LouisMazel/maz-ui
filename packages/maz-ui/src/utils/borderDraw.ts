/**
 * Sets the entry point of the `border-draw` utility: the angle (`0deg` is the top, clockwise) of the pointer
 * seen from the center of the element. One rect read per interaction.
 */
export function setBorderDrawFrom(event: PointerEvent | MouseEvent) {
  const element = event.currentTarget as HTMLElement | null

  if (!element)
    return

  const rect = element.getBoundingClientRect()
  const x = event.clientX - rect.left - rect.width / 2
  const y = event.clientY - rect.top - rect.height / 2

  element.style.setProperty('--maz-border-draw-from', `${Math.round((Math.atan2(x, -y) * 180) / Math.PI)}deg`)
}
