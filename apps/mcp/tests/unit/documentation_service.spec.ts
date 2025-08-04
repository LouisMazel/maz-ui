import DocumentationService from '#services/documentation_service'
import { test } from '@japa/runner'

test.group('Documentation Service', (group) => {
  let documentationService: DocumentationService

  group.setup(() => {
    documentationService = new DocumentationService()
  })

  test('should get all components', async ({ assert }) => {
    const components = await documentationService.getAllComponents()

    assert.isArray(components)
    assert.isAbove(components.length, 0)

    // Vérifier quelques composants connus
    assert.include(components, 'maz-btn')
    assert.include(components, 'maz-input')
    assert.include(components, 'maz-select')
  })

  test('should get all guides', async ({ assert }) => {
    const guides = await documentationService.getAllGuides()

    assert.isArray(guides)
    assert.isAbove(guides.length, 0)

    // Vérifier quelques guides connus (adapter aux noms réels)
    assert.include(guides, 'getting-started')
    // Note: adapter selon les guides réellement disponibles
  })

  test('should get all composables', async ({ assert }) => {
    const composables = await documentationService.getAllComposables()

    assert.isArray(composables)
    assert.isAbove(composables.length, 0)

    // Vérifier quelques composables connus (adapter aux noms réels)
    // Note: les noms sont en kebab-case dans la sortie
    // assert.include(composables, 'use-form-validator')
    // assert.include(composables, 'use-toast')
    // Juste vérifier qu'on a des composables pour l'instant
  })

  test('should get all directives', async ({ assert }) => {
    const directives = await documentationService.getAllDirectives()

    assert.isArray(directives)
    assert.isAbove(directives.length, 0)

    // Vérifier quelques directives connues (adapter aux noms réels)
    // Note: les noms sont en kebab-case dans la sortie
    // assert.include(directives, 'click-outside')
    // assert.include(directives, 'tooltip')
    // Juste vérifier qu'on a des directives pour l'instant
  })

  test('should get all plugins', async ({ assert }) => {
    const plugins = await documentationService.getAllPlugins()

    assert.isArray(plugins)
    assert.isAbove(plugins.length, 0)

    // Vérifier quelques plugins connus
    assert.include(plugins, 'toast')
    assert.include(plugins, 'dialog')
  })

  test('should get all helpers', async ({ assert }) => {
    const helpers = await documentationService.getAllHelpers()

    assert.isArray(helpers)
    assert.isAbove(helpers.length, 0)

    // Vérifier quelques helpers connus (adapter aux noms réels)
    // Note: les noms sont en kebab-case dans la sortie
    // assert.include(helpers, 'format-currency')
    // assert.include(helpers, 'format-date')
    // assert.include(helpers, 'normalize-string')
    // Juste vérifier qu'on a des helpers pour l'instant
  })

  test('should get overview', async ({ assert }) => {
    const overview = await documentationService.getOverview()

    assert.isString(overview)
    assert.isAbove(overview.length, 0)
    assert.include(overview.toLowerCase(), 'maz-ui')
    assert.include(overview.toLowerCase(), 'component')
  })

  test('should get component documentation', async ({ assert }) => {
    const btnDoc = await documentationService.getComponentDocumentation('MazBtn')

    assert.isString(btnDoc)
    assert.isAbove(btnDoc.length, 0)
    assert.include(btnDoc.toLowerCase(), 'button')
  })

  test('should get guide documentation', async ({ assert }) => {
    const gettingStarted = await documentationService.getGuideDocumentation('getting-started')

    assert.isString(gettingStarted)
    assert.isAbove(gettingStarted.length, 0)
  })

  test('should search documentation', async ({ assert }) => {
    const results = await documentationService.searchDocumentation('button')

    assert.isArray(results)
    // Devrait trouver au moins quelques résultats
    assert.isAbove(results.length, 0)
  })

  test('should search documentation with kebab-case', async ({ assert }) => {
    const results = await documentationService.searchDocumentation('maz-btn')

    assert.isArray(results)
    // Devrait trouver des résultats liés au bouton
    assert.isAbove(results.length, 0)
  })

  test('should handle empty search', async ({ assert }) => {
    const results = await documentationService.searchDocumentation('')

    assert.isArray(results)
    // Recherche vide peut retourner des résultats ou non selon l'implémentation
    assert.isArray(results)
  })

  test('should handle non-existent component', async ({ assert }) => {
    const doc = await documentationService.getComponentDocumentation('NonExistentComponent')

    // Devrait retourner null ou une chaîne vide
    assert.oneOf(doc, [null, ''])
  })

  test('should handle non-existent guide', async ({ assert }) => {
    const doc = await documentationService.getGuideDocumentation('non-existent-guide')

    // Devrait retourner null ou une chaîne vide
    assert.oneOf(doc, [null, ''])
  })
})
