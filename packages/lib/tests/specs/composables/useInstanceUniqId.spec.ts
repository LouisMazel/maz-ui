import { useInstanceUniqId } from '@composables/useInstanceUniqId'
import { withSetup } from '@tests/helpers/withSetup'

describe('useInstanceUniqId', () => {
  it('should return providedId even if componentName is not provided', () => {
    const providedId = 'provided-id'

    const [id, app] = withSetup(() => useInstanceUniqId({ componentName: 'MazInput', providedId }))

    expect(id.value).toBe(providedId)
    app.unmount()
  })

  it('should return id with no colon', () => {
    const [id, app] = withSetup(() => useInstanceUniqId({ componentName: 'MazInput' }))

    expect(id.value).not.toContain(':')
    app.unmount()
  })
})
