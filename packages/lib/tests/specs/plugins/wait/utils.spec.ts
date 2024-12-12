import { contains, DEFAULT_LOADER, hasItems, pop, push, uniq } from '@plugins/wait/utils'

describe('uniq', () => {
  it('should return an array with unique elements', () => {
    const array = [1, 2, 3, 3, 2, 1]
    const result = uniq(array)
    expect(result).toEqual([1, 2, 3])
  })

  it('should return an empty array if the input array is empty', () => {
    const array = []
    const result = uniq(array)
    expect(result).toEqual([])
  })
})

describe('contains', () => {
  it('should return true if the array contains the predicate', () => {
    const array = [1, 2, 3]
    const predicate = 2
    const result = contains(array)(predicate)
    expect(result).toBe(true)
  })

  it('should return false if the array does not contain the predicate', () => {
    const array = [1, 2, 3]
    const predicate = 4
    const result = contains(array)(predicate)
    expect(result).toBe(false)
  })

  it('should return false if the input array is empty', () => {
    const array = []
    const predicate = 4
    const result = contains(array)(predicate)
    expect(result).toBe(false)
  })

  it('should return true if the array contains an element that satisfies the predicate function', () => {
    const array = [1, 2, 3]
    const result = contains(array)((x: number) => x > 1)
    expect(result).toBe(true)
  })

  it('should return false if the array does not contain an element that satisfies the predicate function', () => {
    const array = [1, 2, 3]
    const result = contains(array)((x: number) => x > 3)
    expect(result).toBe(false)
  })

  it('should return false if the predicate is not a function and the array is empty', () => {
    const array: number[] = []
    const result = contains(array)(DEFAULT_LOADER)
    expect(result).toBe(false)
  })
})

describe('hasItems', () => {
  it('should return true if the array has at least one element', () => {
    const array = [1]
    const result = hasItems(array)
    expect(result).toBe(true)
  })

  it('should return false if the array is empty', () => {
    const array: number[] = []
    const result = hasItems(array)
    expect(result).toBe(false)
  })
})

describe('push', () => {
  it('should add the item to the end of the array', () => {
    const array = [1, 2, 3]
    const item = 4
    const result = push(array)(item)

    expect(result).toEqual([1, 2, 3, 4])
  })

  it('should return a new array with the item added to the end', () => {
    const array = [1, 2, 3]
    const item = 4
    const result = push(array)(item)
    expect(result).not.toBe(array)
  })

  it('should add the item to an empty array', () => {
    const array: number[] = []
    const item = 4
    const result = push(array)(item)
    expect(result).toEqual([4])
  })

  it('should not add the item if it is already in the array', () => {
    const array = [1, 2, 3]
    const item = 2
    const result = push(array)(item)
    expect(result).toEqual([1, 2, 3])
  })

  it('should add the item if it is not already in the array', () => {
    const array = [1, 2, 3]
    const item = 4
    const result = push(array)(item)
    expect(result).toEqual([1, 2, 3, 4])
  })
})

describe('pop', () => {
  it('should remove the item from the array', () => {
    const array = [1, 2, 3]
    const item = 2
    const result = pop(array)(item)
    expect(result).toEqual([1, 3])
  })

  it('should return a new array with the item removed', () => {
    const array = [1, 2, 3]
    const item = 2
    const result = pop(array)(item)
    expect(result).not.toBe(array)
  })

  it('should return the same array if the item is not present', () => {
    const array = [1, 2, 3]
    const item = 4
    const result = pop(array)(item)
    expect(result).toStrictEqual(array)
  })

  it('should return an empty array if the input array is empty', () => {
    const array: number[] = []
    const item = 4
    const result = pop(array)(item)
    expect(result).toEqual([])
  })
})
