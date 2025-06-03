import type { UserVisibilyCallback, UserVisibilyOptions } from '../helpers/userVisibility'
import { UserVisibility } from '../helpers/userVisibility'

export function useUserVisibility({
  callback,
  options,
}: {
  callback: UserVisibilyCallback
  options?: UserVisibilyOptions
}) {
  return new UserVisibility(callback, options)
}
