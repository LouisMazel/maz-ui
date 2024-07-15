import type { BaseFormPayload, ExtractModelKey, Validation } from '../../modules/composables/use-form-validator/types'
import type { FormSection } from './types'

export function getFormValidationSchema<
  T extends FormSection[],
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>(sections: T) {
  const validationObject = {} as Record<ModelKey, Validation>

  for (const section of sections) {
    const fields = section.fields ?? []

    for (const { name, validation } of fields) {
      if (validation) {
        validationObject[name as ModelKey] = validation.rule
      }
    }
  }

  return validationObject
}

export function getDefaultValues<Model extends BaseFormPayload>(sections: FormSection[]): Partial<Model> {
  const defaultValues: Partial<Model> = {}

  for (const section of sections) {
    const fields = section.fields ?? []

    for (const { name, defaultValue } of fields) {
      if (defaultValue !== undefined) {
        (defaultValues as any)[name] = defaultValue
      }
    }
  }

  return defaultValues
}
