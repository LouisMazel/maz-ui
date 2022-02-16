export type ToasterPositions =
  | 'top'
  | 'top-right'
  | 'top-left'
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left'

export interface ToasterOptions {
  position?: ToasterPositions
  timeout?: number
  persistent?: boolean
}
