import type { Document } from '../DocumentationService'

import { UnifiedSearchService } from '../UnifiedSearchService'

function createDocument(overrides: Partial<Document> = {}): Document {
  return {
    name: 'maz-btn',
    type: 'component',
    content: 'MazBtn is a button component for Vue.js applications with multiple variants and sizes.',
    metadata: {
      name: 'maz-btn',
      displayName: 'MazBtn',
      type: 'component',
      description: 'A versatile button component',
      tags: ['maz-btn', 'mazbtn', 'button', 'btn', 'prop:color', 'prop:size', 'prop:disabled'],
      props: ['color', 'size', 'disabled'],
      sections: [],
    },
    ...overrides,
  }
}

const testDocuments: Document[] = [
  createDocument(),
  createDocument({
    name: 'maz-input',
    type: 'component',
    content: 'MazInput is a text input component with validation support and model-value binding.',
    metadata: {
      name: 'maz-input',
      displayName: 'MazInput',
      type: 'component',
      description: 'An input field with validation',
      tags: ['maz-input', 'mazinput', 'input', 'field', 'form', 'prop:model-value', 'prop:placeholder'],
      props: ['model-value', 'placeholder'],
      sections: [],
    },
  }),
  createDocument({
    name: 'maz-dialog',
    type: 'component',
    content: 'MazDialog is a modal dialog overlay component for confirmations and forms.',
    metadata: {
      name: 'maz-dialog',
      displayName: 'MazDialog',
      type: 'component',
      description: 'A modal dialog component',
      tags: ['maz-dialog', 'mazdialog', 'dialog', 'modal', 'popup'],
      sections: [],
    },
  }),
  createDocument({
    name: 'getting-started',
    type: 'guide',
    content: 'Getting started with Maz-UI. Install with npm install maz-ui. Configure your Vue application.',
    metadata: {
      name: 'getting-started',
      displayName: 'Getting Started',
      type: 'guide',
      description: 'Installation and setup guide for Maz-UI',
      tags: ['getting-started', 'gettingstarted', 'install', 'setup'],
      sections: [],
    },
  }),
  createDocument({
    name: 'use-toast',
    type: 'composable',
    content: 'useToast composable provides toast notification functionality for Vue 3 applications.',
    metadata: {
      name: 'use-toast',
      displayName: 'useToast',
      type: 'composable',
      description: 'Toast notification composable',
      tags: ['use-toast', 'usetoast', 'toast', 'notification'],
      sections: [],
    },
  }),
]

describe('Given a UnifiedSearchService initialized with documents', () => {
  let service: UnifiedSearchService

  beforeEach(() => {
    service = new UnifiedSearchService()
    service.initialize(testDocuments)
  })

  describe('When searching by exact component name', () => {
    it('Then returns the matching document with highest score', () => {
      const results = service.search('maz-btn')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].name).toBe('maz-btn')
      expect(results[0].displayName).toBe('MazBtn')
      expect(results[0].type).toBe('component')
      expect(results[0].score).toBeGreaterThan(0)
      expect(results[0].snippet).toBeTruthy()
    })
  })

  describe('When searching by functional description', () => {
    it('Then returns relevant documents matching the description', () => {
      const results = service.search('modal dialog')

      expect(results.length).toBeGreaterThan(0)

      const dialogResult = results.find(r => r.name === 'maz-dialog')
      expect(dialogResult).toBeDefined()
    })
  })

  describe('When searching by prop name', () => {
    it('Then returns documents containing that prop', () => {
      const results = service.search('model-value')

      expect(results.length).toBeGreaterThan(0)

      const inputResult = results.find(r => r.name === 'maz-input')
      expect(inputResult).toBeDefined()
    })
  })

  describe('When searching with a category filter', () => {
    it('Then returns only documents of the specified category', () => {
      const results = service.search('maz', { category: 'guide' })

      for (const result of results) {
        expect(result.type).toBe('guide')
      }
    })
  })

  describe('When searching with a category filter for composables', () => {
    it('Then excludes components from results', () => {
      const results = service.search('toast', { category: 'composable' })

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].name).toBe('use-toast')

      for (const result of results) {
        expect(result.type).toBe('composable')
      }
    })
  })

  describe('When searching with no matching results', () => {
    it('Then returns an empty array', () => {
      const results = service.search('xyznonexistentquery')

      expect(results).toEqual([])
    })
  })

  describe('When searching with an empty query', () => {
    it('Then returns an empty array', () => {
      const results = service.search('')

      expect(results).toEqual([])
    })
  })

  describe('When searching with maxResults limit', () => {
    it('Then returns at most maxResults items', () => {
      const results = service.search('maz', { maxResults: 2 })

      expect(results.length).toBeLessThanOrEqual(2)
    })
  })

  describe('When searching by tag alias', () => {
    it('Then boosts documents matching the tag', () => {
      const results = service.search('button')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].name).toBe('maz-btn')
    })
  })

  describe('When searching by display name', () => {
    it('Then matches on the display name', () => {
      const results = service.search('MazDialog')

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].name).toBe('maz-dialog')
    })
  })

  describe('When result includes description and score', () => {
    it('Then each result has all required fields', () => {
      const results = service.search('button')

      for (const result of results) {
        expect(result).toHaveProperty('name')
        expect(result).toHaveProperty('displayName')
        expect(result).toHaveProperty('type')
        expect(result).toHaveProperty('description')
        expect(result).toHaveProperty('score')
        expect(result).toHaveProperty('snippet')
        expect(typeof result.score).toBe('number')
        expect(result.score).toBeGreaterThan(0)
      }
    })
  })

  describe('When name exact match is found', () => {
    it('Then name match boosts score above content-only matches', () => {
      const results = service.search('maz-btn')

      const btnResult = results.find(r => r.name === 'maz-btn')
      const otherResults = results.filter(r => r.name !== 'maz-btn')

      expect(btnResult).toBeDefined()
      for (const other of otherResults) {
        expect(btnResult!.score).toBeGreaterThan(other.score)
      }
    })
  })
})
