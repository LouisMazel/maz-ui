export type IdleTimeoutCallback = ({
  isIdle,
  eventType,
}: {
  isIdle: boolean
  eventType?: string
}) => void

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
   * Watch immediately
   * @default true
   */
  immediate: boolean
}

export type IdleTimeoutOptions = Partial<IdleTimeoutStrictOption>
