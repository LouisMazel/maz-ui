export type UserVisibilyCallback = ({
  isVisible,
}: {
  isVisible: boolean
}) => void

export type UserVisibilyStrictOptions = {
  immediate: boolean
  timeout: number
  once: boolean
}
export type UserVisibilyOptions = Partial<UserVisibilyStrictOptions>
