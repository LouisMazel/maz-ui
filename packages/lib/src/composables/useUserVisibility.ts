import {
  UserVisibility,
  type UserVisibilyCallback,
  type UserVisibilyOptions,
} from '@maz-ui/utils/src/utils/userVisibility.js'

export function useUserVisibility({
  callback,
  options,
}: {
  callback: UserVisibilyCallback
  options?: UserVisibilyOptions
}) {
  return new UserVisibility(callback, options)
}
