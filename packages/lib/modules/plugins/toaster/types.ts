export type ToasterPosition =
  | 'top'
  | 'top-right'
  | 'top-left'
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left'

export type ToasterPositions = ToasterPosition

export type ToasterOptions = {
  position?: ToasterPosition
  timeout?: number
  persistent?: boolean
}
