import type { IdleTimeout } from './idle-timeout-handler'

export type IdleTimeoutCallback = ({
  isIdle,
  eventType,
  instance,
}: {
  isIdle: boolean
  eventType?: string
  instance: IdleTimeout
}) => unknown

export interface IdleTimeoutStrictOption {
  /**
   * HTMLElement to spy / watch
   * @default undefined
   */
  element?: HTMLElement | Document
  /**
   * Timeout duration in ms
   * @default 60 * 1000 * 5 // 5 min
   */
  timeout: number
  /**
   * Watch once
   * @default false
   */
  once: boolean
  /**
   * Watch immediately on load (make it false is useful for SSR context)
   * @default true
   */
  immediate: boolean
}

export type IdleTimeoutOptions = Partial<IdleTimeoutStrictOption>
