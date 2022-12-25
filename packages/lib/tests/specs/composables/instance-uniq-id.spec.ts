import { useInstanceUniqId } from '@package/composables/instance-uniq-id.composable'

describe('useInstanceUniqId', () => {
  it('should return the provided id if it exists', () => {
    const { instanceId } = useInstanceUniqId({
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
    // @ts-ignore
    const { instanceId } = useInstanceUniqId({
      componentName: 'test-component',
      instance: component,
    })
    expect(instanceId.value).toBe('test-component-1')
  })
})
