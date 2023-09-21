import { useInstanceUniqId } from '@modules/composables'

describe('useInstanceUniqId', () => {
  it('should return the provided id if it exists', () => {
    const instanceId = useInstanceUniqId({
      componentName: 'test-component',
      providedId: 'test-id',
    })
    expect(instanceId.value).toBe('test-id')
  })

  it('should return the uid of the component if no id is provided', () => {
    const component = {
      name: 'test-component',
      uid: 1,
    }
    const instanceId = useInstanceUniqId({
      componentName: 'test-component',
      // @ts-ignore
      instance: component,
    })
    expect(instanceId.value).toBe('test-component-1')
  })
})
