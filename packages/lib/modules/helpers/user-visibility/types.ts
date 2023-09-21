export type UserVisibilyCallback = ({ isVisible }: { isVisible: boolean }) => void

export type UserVisibilyStrictOptions = {
  /**
   * Watch immediately
   * @default true
   */
  immediate: boolean
  /**
   * Timeout visibility in ms
   * @default 5000 // 5 sec
   */
  timeout: number
  /**
   * Watch once
   * @default false
   */
  once: boolean
}
export type UserVisibilyOptions = Partial<UserVisibilyStrictOptions>
