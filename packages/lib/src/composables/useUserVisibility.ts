import type { UserVisibilyCallback, UserVisibilyOptions } from '../utils/userVisibility'
import { UserVisibility } from '../utils/userVisibility'

export function useUserVisibility({
  callback,
  options,
}: {
  callback: UserVisibilyCallback
  options?: UserVisibilyOptions
}) {
  return new UserVisibility(callback, options)
}
