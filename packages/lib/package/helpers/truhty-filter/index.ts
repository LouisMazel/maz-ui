export type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T
export function truthyFilter<T>(value: T): value is Truthy<T> {
  return !!value
}
