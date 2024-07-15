import type { InjectionKey, ModelRef, Ref } from 'vue'
import { inject } from 'vue'

import type { FormPayload } from './../types'

/**
 * Provide/Inject
 */
export interface InjectedFormData<T = FormPayload> {
  model: ModelRef<T | undefined> | Ref<T | undefined>
  isValid: Ref<boolean>
}

export const formDataInjectKey: InjectionKey<InjectedFormData> = Symbol('form-data')

function injectFormData<U extends FormPayload>(fallback?: InjectedFormData<U>) {
  const resolved = inject<InjectedFormData<U> | undefined>(formDataInjectKey, fallback)

  if (!resolved) {
    throw new TypeError(`[FormGenerator] Could not resolve "form-data" from the provider`)
  }

  return resolved
}

export function useFormGenerator() {
  return {
    injectFormData,
  }
}
