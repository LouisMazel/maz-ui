import { useInstanceUniqId } from '@modules/composables/use-instance-uniq-id'

describe('useInstanceUniqId', () => {
  it('should return providedId even if componentName is not provided', () => {
    const providedId = 'provided-id'

    const id = useInstanceUniqId({ providedId })

    expect(id.value).toBe(providedId)
  })
})
