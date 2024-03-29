import { useInstanceUniqId } from '@modules/composables/use-instance-uniq-id'

let instance: ReturnType<typeof useInstanceUniqId>

beforeEach(() => {
  instance = useInstanceUniqId({
    componentName: 'MazInput',
    providedId: undefined,
  })
})

afterAll(() => {
  instance = undefined
})

test('helpers/useInstanceUniqId', () => {
  expect(instance.value).toBeDefined()
  expect(instance.value).toBe('MazInput-2')
})
