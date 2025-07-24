import type { UserVisibilyCallback, UserVisibilyOptions } from '@maz-ui/utils/src/helpers/userVisibility.js'
import { UserVisibility } from '@maz-ui/utils/src/helpers/userVisibility.js'

export function useUserVisibility({
  callback,
  options,
}: {
  callback: UserVisibilyCallback
  options?: UserVisibilyOptions
}) {
  return new UserVisibility(callback, options)
}
