import type { Document } from '../DocumentationService'
import { DocumentationService } from '../DocumentationService'

describe('Given DocumentationService instance', () => {
  let service: DocumentationService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new DocumentationService()
  })

  describe('When getting component documentation', () => {
    it('Then converts PascalCase to kebab-case', () => {
      const result = service.getComponentDocumentation('MazBtn')

      expect(result).toContain('title: MazBtn')
    })

    it('Then it fallbacks to generated documentation', () => {
      const result = service.getComponentDocumentation('MazBtn')

      expect(result).toContain('## Props')
    })

    it('Then it returns empty string when no documentation exists', () => {
      const result = service.getComponentDocumentation('NonExistent')

      expect(result).toBe('')
    })
  })

  describe('When getting all components', () => {
    it('Then it combines manual and generated components', () => {
      const result = service.getAllComponents()

      expect(result).toEqual(expect.arrayContaining(['maz-btn', 'maz-input', 'maz-select']))
    })
  })

  describe('When getting guide documentation', () => {
    it('Then it reads guide files correctly', () => {
      const result = service.getGuideDocumentation('getting-started')

      expect(result).toContain('title: Getting Started')
    })

    it('Then it handles missing guides', () => {
      const result = service.getGuideDocumentation('non-existent')

      expect(result).toBe('')
    })
  })

  describe('When getting all guides', () => {
    it('Then it lists all guide files', () => {
      const result = service.getAllGuides()

      expect(result).toEqual([
        'cli',
        'getting-started',
        'icon-set',
        'icons',
        'maz-ui-provider',
        'mcp',
        'migration-v4',
        'nuxt',
        'resolvers',
        'themes',
        'translations',
        'vue',
      ])
    })
  })

  describe('When getting composable documentation', () => {
    it('Then it handles composable files', () => {
      const result = service.getComposableDocumentation('use-toast')

      expect(result).toContain('title: useToast')
    })
  })

  describe('When getting all composables', () => {
    it('Then it lists all composable files', () => {
      const result = service.getAllComposables()

      expect(result).toEqual([
        'use-aos',
        'use-breakpoints',
        'use-dialog',
        'use-display-names',
        'use-form-validator',
        'use-idle-timeout',
        'use-reading-time',
        'use-string-matching',
        'use-swipe',
        'use-timer',
        'use-toast',
        'use-user-visibility',
        'use-wait',
        'use-window-size',
      ])
    })
  })

  describe('When getting directive documentation', () => {
    it('Then it handles directive files', () => {
      const result = service.getDirectiveDocumentation('tooltip')

      expect(result).toContain('title: vTooltip')
    })
  })

  describe('When getting all directives', () => {
    it('Then it lists all directive files', () => {
      const result = service.getAllDirectives()

      expect(result).toEqual(['click-outside', 'fullscreen-img', 'lazy-img', 'tooltip', 'zoom-img'])
    })
  })

  describe('When getting plugin documentation', () => {
    it('Then it handles plugin files', () => {
      const result = service.getPluginDocumentation('toast')

      expect(result).toContain('title: Toast')
    })
  })

  describe('When getting all plugins', () => {
    it('Then it lists all plugin files', () => {
      const result = service.getAllPlugins()

      expect(result).toEqual(['aos', 'dialog', 'toast', 'wait'])
    })
  })

  describe('When getting helper documentation', () => {
    it('Then it handles helper files', () => {
      const result = service.getHelperDocumentation('currency')

      expect(result).toContain('title: formatCurrency')
    })
  })

  describe('When getting all helpers', () => {
    it('Then it lists all helper files', () => {
      const result = service.getAllHelpers()

      expect(result).toEqual(expect.arrayContaining(['camel-case', 'capitalize', 'check-availability', 'country-code-to-unicode-flag', 'currency', 'date', 'debounce', 'debounce-callback', 'debounce-id', 'get-country-flag-url', 'is-client', 'is-equal', 'is-standalone-mode', 'normalize-string', 'number', 'pascal-case', 'script-loader', 'sleep', 'throttle', 'throttle-id', 'kebab-case', 'snake-case']))
    })
  })

  describe('When getting overview', () => {
    it('Then it reads overview file', () => {
      const result = service.getOverview()

      expect(result).toContain('title: Maz UI - Standalone Components and Tools Library for Vue & Nuxt')
    })
  })

  describe('When searching documentation', () => {
    it('Then it searchs across all documentation types', () => {
      const result = service.searchDocumentation('toast')

      expect(result).toContain('composable:use-toast')
      expect(result).toContain('plugin:toast')
    })

    it('Then it handles case insensitive search', () => {
      const result = service.searchDocumentation('TOAST')

      expect(result).toContain('composable:use-toast')
      expect(result).toContain('plugin:toast')
    })
  })

  describe('When getting diagnostics', () => {
    it('Then it provides comprehensive statistics', () => {
      const result = service.getDiagnostics()

      expect(result).toHaveProperty('components')
      expect(result).toHaveProperty('guides')
      expect(result).toHaveProperty('composables')
      expect(result).toHaveProperty('directives')
      expect(result).toHaveProperty('plugins')
      expect(result).toHaveProperty('helpers')
      expect(result).toHaveProperty('paths')

      expect(result.components.total).toBeGreaterThanOrEqual(56)
      expect(result.guides.total).toBe(12)
      expect(result.composables.total).toBe(14)
      expect(result.directives.total).toBe(5)
      expect(result.plugins.total).toBe(4)
      expect(result.helpers.total).toBe(22)
    })
  })

  describe('When getting all documents', () => {
    let documents: Document[]

    beforeEach(() => {
      documents = service.getAllDocuments()
    })

    it('Then it returns documents from all categories', () => {
      const types = new Set(documents.map(doc => doc.type))

      expect(types).toContain('component')
      expect(types).toContain('guide')
      expect(types).toContain('composable')
      expect(types).toContain('directive')
      expect(types).toContain('plugin')
      expect(types).toContain('helper')
    })

    it('Then each document has the correct structure', () => {
      for (const doc of documents) {
        expect(doc).toHaveProperty('name')
        expect(doc).toHaveProperty('type')
        expect(doc).toHaveProperty('content')
        expect(doc).toHaveProperty('metadata')
        expect(typeof doc.name).toBe('string')
        expect(typeof doc.content).toBe('string')
        expect(doc.content.length).toBeGreaterThan(0)
      }
    })

    it('Then it includes enriched metadata from MetadataExtractor', () => {
      const btnDoc = documents.find(doc => doc.name === 'maz-btn')

      expect(btnDoc).toBeDefined()
      expect(btnDoc!.metadata).toHaveProperty('name', 'maz-btn')
      expect(btnDoc!.metadata).toHaveProperty('displayName')
      expect(btnDoc!.metadata).toHaveProperty('type', 'component')
      expect(btnDoc!.metadata).toHaveProperty('description')
      expect(btnDoc!.metadata).toHaveProperty('tags')
      expect(btnDoc!.metadata).toHaveProperty('sections')
      expect(btnDoc!.metadata.tags.length).toBeGreaterThan(0)
    })

    it('Then component documents combine manual and generated content', () => {
      const btnDoc = documents.find(doc => doc.name === 'maz-btn')

      expect(btnDoc).toBeDefined()
      expect(btnDoc!.content).toContain('title: MazBtn')
      expect(btnDoc!.content).toContain('## Props')
    })

    it('Then the total count matches the sum of all categories', () => {
      const diagnostics = service.getDiagnostics()
      const expectedMin = diagnostics.guides.total
        + diagnostics.composables.total
        + diagnostics.directives.total
        + diagnostics.plugins.total
        + diagnostics.helpers.total

      expect(documents.length).toBeGreaterThanOrEqual(expectedMin)
    })

    it('Then guide documents have metadata with correct type', () => {
      const guideDoc = documents.find(doc => doc.type === 'guide')

      expect(guideDoc).toBeDefined()
      expect(guideDoc!.metadata.type).toBe('guide')
      expect(guideDoc!.metadata.description.length).toBeGreaterThan(0)
    })
  })
})
