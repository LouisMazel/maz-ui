import type { AsyncComponentLoader, Component } from 'vue'
import type { FormComponentName } from './schema-helpers'
import { defineAsyncComponent } from 'vue'

export type ComponentImportFn = () => Promise<{ default: Component }>

export interface AsyncComponentOptions {
  loadingComponent?: Component
  errorComponent?: Component
  delay?: number
  timeout?: number
  onError?: (
    error: Error,
    retry: () => void,
    fail: () => void,
    attempts: number,
  ) => void
}

const componentImports: Record<FormComponentName, ComponentImportFn> = {
  MazInput: () => import('maz-ui/components/MazInput'),
  MazTextarea: () => import('maz-ui/components/MazTextarea'),
  MazSelect: () => import('maz-ui/components/MazSelect'),
  MazSelectCountry: () => import('maz-ui/components/MazSelectCountry'),
  MazCheckbox: () => import('maz-ui/components/MazCheckbox'),
  MazSwitch: () => import('maz-ui/components/MazSwitch'),
  MazRadio: () => import('maz-ui/components/MazRadio'),
  MazRadioButtons: () => import('maz-ui/components/MazRadioButtons'),
  MazInputNumber: () => import('maz-ui/components/MazInputNumber'),
  MazInputPrice: () => import('maz-ui/components/MazInputPrice'),
  MazInputCode: () => import('maz-ui/components/MazInputCode'),
  MazInputTags: () => import('maz-ui/components/MazInputTags'),
  MazInputPhoneNumber: () => import('maz-ui/components/MazInputPhoneNumber'),
  MazDatePicker: () => import('maz-ui/components/MazDatePicker'),
  MazSlider: () => import('maz-ui/components/MazSlider'),
}

export function getComponentImport(name: FormComponentName): ComponentImportFn {
  return componentImports[name]
}

export function createAsyncComponent(
  name: FormComponentName,
  options: AsyncComponentOptions = {},
): Component {
  const loader = componentImports[name] as AsyncComponentLoader

  return defineAsyncComponent({
    loader,
    loadingComponent: options.loadingComponent,
    errorComponent: options.errorComponent,
    delay: options.delay ?? 200,
    timeout: options.timeout,
    onError: options.onError,
  })
}

export function createAsyncComponents(
  names: FormComponentName[],
  options: AsyncComponentOptions = {},
): Record<FormComponentName, Component> {
  const components = {} as Record<FormComponentName, Component>

  for (const name of names) {
    components[name] = createAsyncComponent(name, options)
  }

  return components
}

export function getUsedComponentNames(
  schema: { sections: { fields: { component: FormComponentName }[] }[] },
): FormComponentName[] {
  const names = new Set<FormComponentName>()

  for (const section of schema.sections) {
    for (const field of section.fields) {
      names.add(field.component)
    }
  }

  return [...names]
}

export function createSchemaAsyncComponents(
  schema: { sections: { fields: { component: FormComponentName }[] }[] },
  options: AsyncComponentOptions = {},
): Record<FormComponentName, Component> {
  const usedNames = getUsedComponentNames(schema)
  return createAsyncComponents(usedNames, options)
}
