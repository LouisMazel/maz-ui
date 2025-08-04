import type { HttpContext } from '@adonisjs/core/http'
import DocumentationService from '#services/documentation_service'

export default class DocumentationController {
  private documentationService = new DocumentationService()

  // ========== OVERVIEW ==========

  /**
   * Get library overview
   * GET /api/overview
   */
  async getOverview({ response }: HttpContext) {
    try {
      const overview = await this.documentationService.getOverview()

      if (!overview) {
        return response.notFound({
          error: 'Overview documentation not found',
        })
      }

      return response.ok({
        type: 'overview',
        content: overview,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: 'Failed to retrieve overview',
        message: error.message,
      })
    }
  }

  // ========== COMPONENTS ==========

  /**
   * List all components
   * GET /api/components
   */
  async listComponents({ response }: HttpContext) {
    try {
      const components = await this.documentationService.getAllComponents()

      return response.ok({
        type: 'components',
        count: components.length,
        items: components,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: 'Failed to list components',
        message: error.message,
      })
    }
  }

  /**
   * Get specific component documentation
   * GET /api/component/:name
   */
  async getComponent({ params, response }: HttpContext) {
    try {
      const { name } = params
      const documentation = await this.documentationService.getComponentDocumentation(name)

      if (!documentation) {
        return response.notFound({
          error: `Component '${name}' not found`,
        })
      }

      return response.ok({
        type: 'component',
        name,
        content: documentation,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: `Failed to retrieve component '${params.name}'`,
        message: error.message,
      })
    }
  }

  // ========== GUIDES ==========

  /**
   * List all guides
   * GET /api/guides
   */
  async listGuides({ response }: HttpContext) {
    try {
      const guides = await this.documentationService.getAllGuides()

      return response.ok({
        type: 'guides',
        count: guides.length,
        items: guides,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: 'Failed to list guides',
        message: error.message,
      })
    }
  }

  /**
   * Get specific guide documentation
   * GET /api/guide/:name
   */
  async getGuide({ params, response }: HttpContext) {
    try {
      const { name } = params
      const documentation = await this.documentationService.getGuideDocumentation(name)

      if (!documentation) {
        return response.notFound({
          error: `Guide '${name}' not found`,
        })
      }

      return response.ok({
        type: 'guide',
        name,
        content: documentation,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: `Failed to retrieve guide '${params.name}'`,
        message: error.message,
      })
    }
  }

  // ========== COMPOSABLES ==========

  /**
   * List all composables
   * GET /api/composables
   */
  async listComposables({ response }: HttpContext) {
    try {
      const composables = await this.documentationService.getAllComposables()

      return response.ok({
        type: 'composables',
        count: composables.length,
        items: composables,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: 'Failed to list composables',
        message: error.message,
      })
    }
  }

  /**
   * Get specific composable documentation
   * GET /api/composable/:name
   */
  async getComposable({ params, response }: HttpContext) {
    try {
      const { name } = params
      const documentation = await this.documentationService.getComposableDocumentation(name)

      if (!documentation) {
        return response.notFound({
          error: `Composable '${name}' not found`,
        })
      }

      return response.ok({
        type: 'composable',
        name,
        content: documentation,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: `Failed to retrieve composable '${params.name}'`,
        message: error.message,
      })
    }
  }

  // ========== DIRECTIVES ==========

  /**
   * List all directives
   * GET /api/directives
   */
  async listDirectives({ response }: HttpContext) {
    try {
      const directives = await this.documentationService.getAllDirectives()

      return response.ok({
        type: 'directives',
        count: directives.length,
        items: directives,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: 'Failed to list directives',
        message: error.message,
      })
    }
  }

  /**
   * Get specific directive documentation
   * GET /api/directive/:name
   */
  async getDirective({ params, response }: HttpContext) {
    try {
      const { name } = params
      const documentation = await this.documentationService.getDirectiveDocumentation(name)

      if (!documentation) {
        return response.notFound({
          error: `Directive '${name}' not found`,
        })
      }

      return response.ok({
        type: 'directive',
        name,
        content: documentation,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: `Failed to retrieve directive '${params.name}'`,
        message: error.message,
      })
    }
  }

  // ========== PLUGINS ==========

  /**
   * List all plugins
   * GET /api/plugins
   */
  async listPlugins({ response }: HttpContext) {
    try {
      const plugins = await this.documentationService.getAllPlugins()

      return response.ok({
        type: 'plugins',
        count: plugins.length,
        items: plugins,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: 'Failed to list plugins',
        message: error.message,
      })
    }
  }

  /**
   * Get specific plugin documentation
   * GET /api/plugin/:name
   */
  async getPlugin({ params, response }: HttpContext) {
    try {
      const { name } = params
      const documentation = await this.documentationService.getPluginDocumentation(name)

      if (!documentation) {
        return response.notFound({
          error: `Plugin '${name}' not found`,
        })
      }

      return response.ok({
        type: 'plugin',
        name,
        content: documentation,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: `Failed to retrieve plugin '${params.name}'`,
        message: error.message,
      })
    }
  }

  // ========== HELPERS ==========

  /**
   * List all helpers
   * GET /api/helpers
   */
  async listHelpers({ response }: HttpContext) {
    try {
      const helpers = await this.documentationService.getAllHelpers()

      return response.ok({
        type: 'helpers',
        count: helpers.length,
        items: helpers,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: 'Failed to list helpers',
        message: error.message,
      })
    }
  }

  /**
   * Get specific helper documentation
   * GET /api/helper/:name
   */
  async getHelper({ params, response }: HttpContext) {
    try {
      const { name } = params
      const documentation = await this.documentationService.getHelperDocumentation(name)

      if (!documentation) {
        return response.notFound({
          error: `Helper '${name}' not found`,
        })
      }

      return response.ok({
        type: 'helper',
        name,
        content: documentation,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: `Failed to retrieve helper '${params.name}'`,
        message: error.message,
      })
    }
  }

  // ========== SEARCH ==========

  /**
   * Search documentation
   * GET /api/search/:query
   */
  async search({ params, response }: HttpContext) {
    try {
      const { query } = params

      if (!query || query.trim().length < 2) {
        return response.badRequest({
          error: 'Search query must be at least 2 characters long',
        })
      }

      const results = await this.documentationService.searchDocumentation(query)

      return response.ok({
        type: 'search',
        query,
        count: results.length,
        results,
      })
    }
    catch (error) {
      return response.internalServerError({
        error: `Failed to search for '${params.query}'`,
        message: error.message,
      })
    }
  }
}
