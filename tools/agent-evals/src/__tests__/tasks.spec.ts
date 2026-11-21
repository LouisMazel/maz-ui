import { TASKS } from '../tasks.ts'

describe('given the tasks', () => {
  describe('when their ids are listed', () => {
    it('then each one is unique', () => {
      expect(new Set(TASKS.map(task => task.id)).size).toBe(TASKS.length)
    })
  })

  describe('when a prompt is read', () => {
    it.each(TASKS.map(task => [task.id, task]))('then %s never names the ecosystem and expects a tool', (_, task) => {
      expect(task.prompt).not.toMatch(/maz/i)
      expect(task.expects.length).toBeGreaterThan(0)
      expect(task.forbids.length).toBeGreaterThan(0)
    })
  })
})
