import { ref, type Ref } from 'vue'

const handler = ref<UserVisibility>()

import {
  UserVisibility,
  type UserVisibilyCallback,
  type UserVisibilyOptions,
} from '../helpers/user-visibility'

export const useUserVisibility = ({
  callback,
  options,
}: {
  callback: UserVisibilyCallback
  options?: UserVisibilyOptions
}) => {
  const instance = new UserVisibility(callback, options)

  handler.value = instance

  const visibility = handler as Ref<UserVisibility>

  return {
    visibility,
  }
}
