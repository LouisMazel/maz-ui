export type ToasterPosition =
  | 'top'
  | 'top-right'
  | 'top-left'
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left'

export interface ToasterLink {
  href: string
  text?: string
  /** @default _self */
  target?: string
  closeToast?: boolean
}

export interface ToasterAction {
  func: (..._arguments: unknown[]) => unknown
  text: string
  closeToast?: boolean
}

export interface ToasterOptions {
  /**
   * The position of the toast on the screen
   * @default 'bottom-right'
   */
  position?: ToasterPosition
  /**
   * The timeout is in ms, it's the time before the toast is automatically closed
   * if set to `false`, the toast will not be closed automatically
   * @default 10000
   */
  timeout?: number | boolean
  /**
   * If the toast is persistent, it can't be closed by user interaction (only on timeout or programmatically)
   * @default false
   */
  persistent?: boolean
  /**
   * Display an icon in the toast
   * @default true
   */
  icon?: boolean
  /**
   * The link will be displayed as a button in the toast
   * @default undefined
   */
  link?: {
    href: string
    text?: string
    /** @default _self */
    target?: string
    /** @default false */
    closeToast?: boolean
  }
  /**
   * The action will be displayed as a button in the toast
   * @default undefined
   */
  action?: {
    func: (..._arguments: unknown[]) => unknown
    text: string
    /** @default false */
    closeToast?: boolean
  }
}
