/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// Health check endpoint
router.get('/', '#controllers/health_controller.handle')

// API Documentation routes
const DocumentationController = () => import('#controllers/documentation_controller')

// Overview
router.get('/api/overview', [DocumentationController, 'getOverview'])

// Components
router.get('/api/components', [DocumentationController, 'listComponents'])
router.get('/api/component/:name', [DocumentationController, 'getComponent'])

// Guides
router.get('/api/guides', [DocumentationController, 'listGuides'])
router.get('/api/guide/:name', [DocumentationController, 'getGuide'])

// Composables
router.get('/api/composables', [DocumentationController, 'listComposables'])
router.get('/api/composable/:name', [DocumentationController, 'getComposable'])

// Directives
router.get('/api/directives', [DocumentationController, 'listDirectives'])
router.get('/api/directive/:name', [DocumentationController, 'getDirective'])

// Plugins
router.get('/api/plugins', [DocumentationController, 'listPlugins'])
router.get('/api/plugin/:name', [DocumentationController, 'getPlugin'])

// Helpers
router.get('/api/helpers', [DocumentationController, 'listHelpers'])
router.get('/api/helper/:name', [DocumentationController, 'getHelper'])

// Search
router.get('/api/search/:query', [DocumentationController, 'search'])

// ========== MCP STREAMABLE HTTP ROUTES ==========

const SimpleMcpController = () => import('#controllers/mcp_controller')

// MCP Streamable HTTP endpoint (2025 specification)
router.get('/mcp', [SimpleMcpController, 'handle'])
router.post('/mcp', [SimpleMcpController, 'handle'])
