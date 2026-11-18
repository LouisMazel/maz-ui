import { MazUi } from '../maz-ui'

describe('given the MazUi plugin', () => {
  describe('when it has no option', () => {
    it('then it registers the icons and purges the CSS', () => {
      expect(MazUi().map(plugin => plugin.name)).toEqual(['maz-ui:icons', 'maz-ui:purge-css'])
    })
  })

  describe('when the icons and the purge have options', () => {
    it('then both are added', () => {
      expect(MazUi({
        icons: { prefix: 'app' },
        purge: { report: false },
      }).map(plugin => plugin.name)).toEqual(['maz-ui:icons', 'maz-ui:purge-css'])
    })
  })

  describe('when the icons or the purge are disabled', () => {
    it('then they are not added', () => {
      expect(MazUi({ icons: false }).map(plugin => plugin.name)).toEqual(['maz-ui:purge-css'])
      expect(MazUi({ purge: false }).map(plugin => plugin.name)).toEqual(['maz-ui:icons'])
    })
  })
})
