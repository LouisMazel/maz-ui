import type { Ref } from 'vue'

export type InferMaybeRef<T> = T extends Ref<infer U> ? U : T
