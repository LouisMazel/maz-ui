export type LoaderId = unknown

export const DEFAULT_LOADER: LoaderId = ''

export const uniq = (array: LoaderId[]) => {
  return array.filter((el, index, arr) => index === arr.indexOf(el))
}

export const contains =
  (array: Array<LoaderId>) =>
  (predicate: LoaderId | VoidFunction = DEFAULT_LOADER) => {
    return typeof predicate === 'function'
      ? array.findIndex((...args) => predicate(...args)) > -1
      : array.includes(predicate)
  }

export const hasItems = (array: LoaderId[]) => array.length > 0

export const push =
  (array: LoaderId[]) =>
  (item: LoaderId = DEFAULT_LOADER) =>
    uniq([...array, item])

export const pop =
  (array: LoaderId[]) =>
  (item: LoaderId = DEFAULT_LOADER) =>
    array.filter((_item) => _item !== item)
