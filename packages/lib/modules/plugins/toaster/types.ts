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
  action?: ToasterAction
  link?: ToasterLink
}

export type ToasterLink = {
  href: string
  text?: string
  /** @default _self */
  target?: string
  closeToast?: boolean
}

export type ToasterAction = {
  func: (..._arguments: unknown[]) => unknown
  text: string
  closeToast?: boolean
}
