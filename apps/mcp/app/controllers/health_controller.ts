import type { HttpContext } from '@adonisjs/core/http'
import DocumentationService from '#services/documentation_service'

export default class HealthController {
  /**
   * Health check endpoint with detailed diagnostics
   */
  async handle({ response }: HttpContext) {
    const documentationService = new DocumentationService()

    try {
      const diagnostics = await documentationService.getDiagnostics()

      return response.ok({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'maz-ui-mcp',
        version: '1.0.0',
        diagnostics: {
          summary: {
            totalComponents: diagnostics.components.total,
            totalGuides: diagnostics.guides.total,
            totalComposables: diagnostics.composables.total,
            totalDirectives: diagnostics.directives.total,
            totalPlugins: diagnostics.plugins.total,
            totalHelpers: diagnostics.helpers.total,
            totalDocumentationItems: diagnostics.components.total
              + diagnostics.guides.total
              + diagnostics.composables.total
              + diagnostics.directives.total
              + diagnostics.plugins.total
              + diagnostics.helpers.total,
          },
          components: {
            total: diagnostics.components.total,
            withManualDoc: diagnostics.components.withManualDoc,
            withGeneratedDoc: diagnostics.components.withGeneratedDoc,
            withBothDocs: diagnostics.components.withBothDocs,
            coverage: diagnostics.components.total > 0
              ? Math.round((diagnostics.components.withBothDocs / diagnostics.components.total) * 100)
              : 0,
          },
          guides: {
            count: diagnostics.guides.total,
            available: diagnostics.guides.list,
          },
          composables: {
            count: diagnostics.composables.total,
            available: diagnostics.composables.list,
          },
          directives: {
            count: diagnostics.directives.total,
            available: diagnostics.directives.list,
          },
          plugins: {
            count: diagnostics.plugins.total,
            available: diagnostics.plugins.list,
          },
          helpers: {
            count: diagnostics.helpers.total,
            available: diagnostics.helpers.list,
          },
          paths: diagnostics.paths,
        },
        mcp: {
          protocolVersion: '1.0.0',
          supportedFeatures: {
            resources: true,
            tools: true,
            prompts: false,
            samples: false,
          },
          availableResources: [
            'maz-ui://overview',
            'maz-ui://component/{ComponentName}',
            'maz-ui://guide/{guideName}',
            'maz-ui://composable/{composableName}',
            'maz-ui://directive/{directiveName}',
            'maz-ui://plugin/{pluginName}',
            'maz-ui://helper/{helperName}',
          ],
          availableTools: [
            'search_components',
            'search_documentation',
            'list_all_components',
            'list_guides',
            'list_composables',
            'list_directives',
            'list_plugins',
            'list_helpers',
            'get_getting_started',
            'get_component_usage',
          ],
        },
      })
    }
    catch (error) {
      return response.internalServerError({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'maz-ui-mcp',
        error: {
          message: error.message,
          code: 'DOCUMENTATION_SERVICE_ERROR',
        },
      })
    }
  }
}
