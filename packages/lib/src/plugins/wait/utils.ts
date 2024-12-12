// eslint-disable-next-line sonarjs/redundant-type-aliases
export type LoaderId = unknown

export const DEFAULT_LOADER: LoaderId = ''

export function uniq(array: LoaderId[]) {
  return array.filter((el, index, arr) => index === arr.indexOf(el))
}

export function contains(array: Array<LoaderId>) {
  return (predicate: LoaderId | VoidFunction = DEFAULT_LOADER) => {
    return typeof predicate === 'function'
      ? array.findIndex((...args) => predicate(...args)) > -1
      : array.includes(predicate)
  }
}

export const hasItems = (array: LoaderId[]) => array.length > 0

export function push(array: LoaderId[]) {
  return (item: LoaderId = DEFAULT_LOADER) =>
    uniq([...array, item])
}

export function pop(array: LoaderId[]) {
  return (item: LoaderId = DEFAULT_LOADER) =>
    array.filter(_item => _item !== item)
}
