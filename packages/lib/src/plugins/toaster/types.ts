import type { IconComponent } from '@maz-ui/icons'
import type { RouteLocationRaw } from 'vue-router'
import type { MazBtnProps } from '../../components/index.ts'

export type ToasterPosition
  = | 'top'
    | 'top-right'
    | 'top-left'
    | 'bottom'
    | 'bottom-right'
    | 'bottom-left'

export interface ToasterButton extends MazBtnProps {
  /**
   * If the toast is closed when the button is clicked
   * @default false
   */
  closeToast?: boolean
  /**
   * The text of the button
   */
  text?: string
  /**
   * The target of the button
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target
   * @default _self
   */
  target?: string
  /**
   * The method to call when the button is clicked
   */
  onClick?: () => unknown
  /**
   * The route to navigate to when the button is clicked
   * (only with `vue-router`)
   */
  to?: RouteLocationRaw
  /**
   * The URL to navigate to when the button is clicked
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href
   */
  href?: string
  /**
   * The size of the button
   * @default 'xs'
   */
  size?: MazBtnProps['size']
  /**
   * The color of the button
   * @default color of the toast
   */
  color?: MazBtnProps['color']
}

export interface ToasterOptions {
  /**
   * If the message is HTML
   * @default false
   */
  html?: boolean
  /**
   * The type of the toast
   * @default 'theme'
   */
  type?: 'theme' | 'success' | 'info' | 'warning' | 'danger'
  /**
   * The maximum number of toasts to display
   * @default 5
   */
  maxToasts?: number | boolean
  /**
   * If the toast is queued, it will be displayed in the order of the toasts
   * @default false
   */
  queue?: boolean
  /**
   * The position of the toast on the screen
   * @default 'bottom-right'
   */
  position?: ToasterPosition
  /**
   * If the toast is paused on hover, it will be paused when the mouse is over the toast
   * @default true
   */
  pauseOnHover?: boolean
  /**
   * The timeout is in ms, it's the time before the toast is automatically closed
   * if set to `false`, the toast will not be closed automatically
   * @default 10000
   */
  timeout?: number | boolean
  /**
   * If the toast is persistent, the user should close it manually
   * @default false
   */
  persistent?: boolean
  /**
   * Display an icon in the toast
   * @default true
   */
  icon?: false | IconComponent
  /**
   * The action will be displayed as a button in the toast
   * @default undefined
   */
  button?: ToasterButton
  /**
   * The actions will be displayed as a buttons in the toast
   * @default undefined
   */
  buttons?: ToasterButton[]
}
