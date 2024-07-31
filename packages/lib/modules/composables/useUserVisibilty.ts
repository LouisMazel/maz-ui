import {
  UserVisibility,
  type UserVisibilyCallback,
  type UserVisibilyOptions,
} from '../helpers/user-visibility'

export function useUserVisibility({
  callback,
  options,
}: {
  callback: UserVisibilyCallback
  options?: UserVisibilyOptions
}) {
  return new UserVisibility(callback, options)
}
