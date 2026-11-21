import { parseOptions, pool } from '../options.ts'
import { TASKS } from '../tasks.ts'

describe('given parseOptions', () => {
  describe('when no option is passed', () => {
    it('then every task runs once in every condition', () => {
      expect(parseOptions([])).toEqual({
        conditions: ['baseline', 'init', 'plugin'],
        tasks: TASKS,
        runs: 1,
        concurrency: 3,
        model: undefined,
        maxBudgetUsd: undefined,
        out: undefined,
        keep: false,
        dryRun: false,
        list: false,
        help: false,
      })
    })
  })

  describe('when every option is passed', () => {
    it('then they are parsed', () => {
      expect(parseOptions(['--conditions', 'plugin', '--tasks', 'price,copy-link', '--runs', '3', '--concurrency', '2', '--model', 'opus', '--max-budget-usd', '1.5', '--out', 'out', '--keep', '--dry-run', '--list', '-h'])).toEqual({
        conditions: ['plugin'],
        tasks: TASKS.filter(task => ['copy-link', 'price'].includes(task.id)),
        runs: 3,
        concurrency: 2,
        model: 'opus',
        maxBudgetUsd: 1.5,
        out: 'out',
        keep: true,
        dryRun: true,
        list: true,
        help: true,
      })
    })
  })

  describe('when a task is unknown', () => {
    it('then it throws', () => {
      expect(() => parseOptions(['--tasks', 'carousel'])).toThrow('Unknown task(s): carousel.')
    })
  })

  describe('when a number is not positive', () => {
    it.each([['--runs', '0'], ['--concurrency', 'many'], ['--max-budget-usd', '0.0']])('then %s %s throws', (option, value) => {
      expect(() => parseOptions([option, value])).toThrow(`${option} needs a positive number, got "${value}".`)
    })
  })
})

describe('given pool', () => {
  describe('when more items than lanes run', () => {
    it('then the results keep the order of the items and no more than the lanes run at once', async () => {
      let running = 0
      let peak = 0

      const results = await pool([30, 10, 20, 5], 2, async (delay) => {
        running++
        peak = Math.max(peak, running)
        await new Promise(resolve => setTimeout(resolve, delay))
        running--

        return delay * 2
      })

      expect(results).toEqual([60, 20, 40, 10])
      expect(peak).toBe(2)
    })
  })

  describe('when there are no items', () => {
    it('then it resolves with none', async () => {
      expect(await pool([], 3, item => Promise.resolve(item))).toEqual([])
    })
  })
})
