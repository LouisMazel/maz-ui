import type { DefineComponent } from 'vue'

/**
 * This type solves a problem with generic Vue 3 components.
 *
 * When a component is not generic, we can simply use InstanceType<typeof Component>
 * to get the correct typing. However, with generic components, this approach doesn't work
 * and we can't get the correct component typing. This helper type addresses that limitation.
 *
 * @see https://github.com/vuejs/language-tools/issues/3206
 */

export type GenericInstanceType<T> = T extends new (...args: any[]) => infer R
  ? R
  : T extends (...args: any[]) => infer R
    ? R extends { __ctx?: infer K }
      ? Exclude<K, void> extends { expose: (...args: infer Y) => void }
        ? Y[0] & InstanceType<DefineComponent>
        : any
      : any
    : any
