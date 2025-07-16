import { useInstanceUniqId } from '@composables/useInstanceUniqId'

describe('useInstanceUniqId', () => {
  it('should return providedId even if componentName is not provided', () => {
    const providedId = 'provided-id'

    const id = useInstanceUniqId({ componentName: 'MazInput', providedId })

    expect(id.value).toBe(providedId)
  })

  it('should return id with no colon', () => {
    const id = useInstanceUniqId({ componentName: 'MazInput' })

    expect(id.value).not.toContain(':')
  })
})
