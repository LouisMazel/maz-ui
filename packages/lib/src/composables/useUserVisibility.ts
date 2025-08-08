import type { UserVisibilyCallback, UserVisibilyOptions } from '@maz-ui/utils/helpers/userVisibility'
import { UserVisibility } from '@maz-ui/utils/helpers/userVisibility'

export function useUserVisibility({
  callback,
  options,
}: {
  callback: UserVisibilyCallback
  options?: UserVisibilyOptions
}) {
  return new UserVisibility(callback, options)
}
