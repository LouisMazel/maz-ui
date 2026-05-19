import type { DocumentMetadata } from './MetadataExtractor'

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MetadataExtractor } from './MetadataExtractor'

const _dirname = dirname(fileURLToPath(import.meta.url))

export type DocumentType = 'component' | 'guide' | 'composable' | 'directive' | 'plugin' | 'util' | 'node'

export interface Document {
  name: string
  type: DocumentType
  content: string
  metadata: DocumentMetadata
}

export interface DocumentationDiagnostics {
  components: {
    total: number
    withManualDoc: number
    withGeneratedDoc: number
    withBothDocs: number
  }
  guides: {
    total: number
    list: string[]
  }
  composables: {
    total: number
    list: string[]
  }
  directives: {
    total: number
    list: string[]
  }
  plugins: {
    total: number
    list: string[]
  }
  utils: {
    total: number
    list: string[]
  }
  node: {
    total: number
    list: string[]
  }
  paths: {
    docsRoot: string
    componentsDir: string
    generatedDocsDir: string
    guidesDir: string
    composablesDir: string
    directivesDir: string
    pluginsDir: string
    ecosystemDir: string
    utilsDir: string
    nodeDir: string
    iconsDir: string
  }
}

export class DocumentationService {
  private readonly docsRoot: string
  private readonly componentsDir: string
  private readonly generatedDocsDir: string
  private readonly guidesDir: string
  private readonly composablesDir: string
  private readonly directivesDir: string
  private readonly pluginsDir: string
  private readonly ecosystemDir: string
  private readonly utilsDir: string
  private readonly utilsTypesDir: string
  private readonly nodeDir: string
  private readonly iconsDir: string
  private readonly metadataExtractor = new MetadataExtractor()

  constructor() {
    const localDocsRoot = resolve(_dirname, '../docs/src')
    const localGeneratedDocsDir = resolve(_dirname, '../docs/generated-docs')

    this.docsRoot = localDocsRoot
    this.generatedDocsDir = localGeneratedDocsDir

    this.componentsDir = join(this.docsRoot, 'components')
    this.guidesDir = join(this.docsRoot, 'guide')
    this.composablesDir = join(this.docsRoot, 'composables')
    this.directivesDir = join(this.docsRoot, 'directives')
    this.pluginsDir = join(this.docsRoot, 'plugins')
    this.ecosystemDir = join(this.docsRoot, 'ecosystem')
    this.utilsDir = join(this.ecosystemDir, 'utils')
    this.utilsTypesDir = join(this.utilsDir, 'types')
    this.nodeDir = join(this.ecosystemDir, 'node')
    this.iconsDir = join(this.ecosystemDir, 'icons')
  }

  private pascalToKebabCase(pascalName: string): string {
    return pascalName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
  }

  private readMarkdownFile(filePath: string): string {
    try {
      if (!existsSync(filePath)) {
        return ''
      }
      return readFileSync(filePath, 'utf-8')
    }
    catch {
      return ''
    }
  }

  private listMarkdownFiles(dirPath: string, options: { keepIndex?: boolean } = {}): string[] {
    try {
      if (!existsSync(dirPath)) {
        return []
      }
      const entries = readdirSync(dirPath)
      return entries
        .filter((entry) => {
          if (!entry.endsWith('.md'))
            return false
          if (!options.keepIndex && entry === 'index.md')
            return false
          const fullPath = join(dirPath, entry)
          return statSync(fullPath).isFile()
        })
        .map(file => file.replace('.md', ''))
        .sort()
    }
    catch {
      return []
    }
  }

  // ========== COMPONENTS ==========

  getComponentDocumentation(componentName: string): string {
    const kebabName = componentName.startsWith('Maz')
      ? this.pascalToKebabCase(componentName)
      : componentName

    const manualDocPath = join(this.componentsDir, `${kebabName}.md`)
    const generatedDocPath = join(this.generatedDocsDir, `${kebabName}.doc.md`)

    const [manualDoc, generatedDoc] = [
      this.readMarkdownFile(manualDocPath),
      this.readMarkdownFile(generatedDocPath),
    ]

    if (!manualDoc && !generatedDoc) {
      return ''
    }

    let combinedDoc = ''

    if (manualDoc) {
      combinedDoc += `${manualDoc}\n\n`
    }

    if (generatedDoc) {
      combinedDoc += `---\n\n# API Reference\n\n${generatedDoc}`
    }

    return combinedDoc.trim()
  }

  getAllComponents(): string[] {
    const [manualFiles, generatedFiles] = [
      this.listMarkdownFiles(this.componentsDir),
      this.listMarkdownFiles(this.generatedDocsDir).map(file => file.replace('.doc', '')),
    ]

    const allComponents = new Set([...manualFiles, ...generatedFiles])
    return Array.from(allComponents).sort()
  }

  // ========== GUIDES ==========
  // Aggregates: guide/*.md + ecosystem/*.md (standalone) + ecosystem/icons/*.md (index.md → 'icons')

  getGuideDocumentation(guideName: string): string {
    const candidates = [
      join(this.guidesDir, `${guideName}.md`),
      join(this.ecosystemDir, `${guideName}.md`),
      join(this.iconsDir, `${guideName}.md`),
    ]

    if (guideName === 'icons') {
      candidates.push(join(this.iconsDir, 'index.md'))
    }

    for (const path of candidates) {
      const content = this.readMarkdownFile(path)
      if (content)
        return content
    }

    return ''
  }

  getAllGuides(): string[] {
    const guides = new Set<string>()

    for (const name of this.listMarkdownFiles(this.guidesDir)) {
      guides.add(name)
    }

    for (const name of this.listMarkdownFiles(this.ecosystemDir)) {
      guides.add(name)
    }

    for (const name of this.listMarkdownFiles(this.iconsDir)) {
      guides.add(name)
    }

    if (existsSync(join(this.iconsDir, 'index.md'))) {
      guides.add('icons')
    }

    return Array.from(guides).sort()
  }

  // ========== COMPOSABLES ==========

  getComposableDocumentation(composableName: string): string {
    const composablePath = join(this.composablesDir, `${composableName}.md`)
    return this.readMarkdownFile(composablePath)
  }

  getAllComposables(): string[] {
    return this.listMarkdownFiles(this.composablesDir)
  }

  // ========== DIRECTIVES ==========

  getDirectiveDocumentation(directiveName: string): string {
    const directivePath = join(this.directivesDir, `${directiveName}.md`)
    return this.readMarkdownFile(directivePath)
  }

  getAllDirectives(): string[] {
    return this.listMarkdownFiles(this.directivesDir)
  }

  // ========== PLUGINS ==========

  getPluginDocumentation(pluginName: string): string {
    const pluginPath = join(this.pluginsDir, `${pluginName}.md`)
    return this.readMarkdownFile(pluginPath)
  }

  getAllPlugins(): string[] {
    return this.listMarkdownFiles(this.pluginsDir)
  }

  // ========== UTILS ==========
  // Aggregates: ecosystem/utils/*.md + ecosystem/utils/types/*.md

  getUtilDocumentation(utilName: string): string {
    const candidates = [
      join(this.utilsDir, `${utilName}.md`),
      join(this.utilsTypesDir, `${utilName}.md`),
    ]

    for (const path of candidates) {
      const content = this.readMarkdownFile(path)
      if (content)
        return content
    }

    return ''
  }

  getAllUtils(): string[] {
    const utils = new Set<string>([
      ...this.listMarkdownFiles(this.utilsDir),
      ...this.listMarkdownFiles(this.utilsTypesDir),
    ])
    return Array.from(utils).sort()
  }

  // ========== NODE ==========

  getNodeDocumentation(nodeName: string): string {
    const nodePath = join(this.nodeDir, `${nodeName}.md`)
    return this.readMarkdownFile(nodePath)
  }

  getAllNode(): string[] {
    return this.listMarkdownFiles(this.nodeDir)
  }

  // ========== UNIFIED LOADING ==========

  getAllDocuments(): Document[] {
    const documents: Document[] = []

    for (const name of this.getAllComponents()) {
      const content = this.getComponentDocumentation(name)
      if (content) {
        documents.push(this.buildDocument(name, 'component', content))
      }
    }

    const categories: Array<{ type: DocumentType, names: string[], getContent: (name: string) => string }> = [
      { type: 'guide', names: this.getAllGuides(), getContent: name => this.getGuideDocumentation(name) },
      { type: 'composable', names: this.getAllComposables(), getContent: name => this.getComposableDocumentation(name) },
      { type: 'directive', names: this.getAllDirectives(), getContent: name => this.getDirectiveDocumentation(name) },
      { type: 'plugin', names: this.getAllPlugins(), getContent: name => this.getPluginDocumentation(name) },
      { type: 'util', names: this.getAllUtils(), getContent: name => this.getUtilDocumentation(name) },
      { type: 'node', names: this.getAllNode(), getContent: name => this.getNodeDocumentation(name) },
    ]

    for (const category of categories) {
      for (const name of category.names) {
        const content = category.getContent(name)
        if (content) {
          documents.push(this.buildDocument(name, category.type, content))
        }
      }
    }

    return documents
  }

  private buildDocument(name: string, type: DocumentType, content: string): Document {
    return {
      name,
      type,
      content,
      metadata: this.metadataExtractor.extract(name, type, content),
    }
  }

  // ========== UTILITAIRES ==========

  getOverview(): string {
    const overviewPath = join(this.docsRoot, 'index.md')
    return this.readMarkdownFile(overviewPath)
  }

  searchDocumentation(query: string): string[] {
    const searchTerm = query.toLowerCase()
    const results: string[] = []

    const buckets: Array<{ type: DocumentType, names: string[] }> = [
      { type: 'component', names: this.getAllComponents() },
      { type: 'guide', names: this.getAllGuides() },
      { type: 'composable', names: this.getAllComposables() },
      { type: 'directive', names: this.getAllDirectives() },
      { type: 'plugin', names: this.getAllPlugins() },
      { type: 'util', names: this.getAllUtils() },
      { type: 'node', names: this.getAllNode() },
    ]

    for (const { type, names } of buckets) {
      for (const name of names) {
        if (name.toLowerCase().includes(searchTerm)) {
          results.push(`${type}:${name}`)
        }
      }
    }

    return results
  }

  getDiagnostics(): DocumentationDiagnostics {
    const [components, guides, composables, directives, plugins, utils, nodeItems] = [
      this.getAllComponents(),
      this.getAllGuides(),
      this.getAllComposables(),
      this.getAllDirectives(),
      this.getAllPlugins(),
      this.getAllUtils(),
      this.getAllNode(),
    ]

    let withManualDoc = 0
    let withGeneratedDoc = 0
    let withBothDocs = 0

    for (const component of components) {
      const manualExists = existsSync(join(this.componentsDir, `${component}.md`))
      const generatedExists = existsSync(join(this.generatedDocsDir, `${component}.doc.md`))

      if (manualExists)
        withManualDoc++
      if (generatedExists)
        withGeneratedDoc++
      if (manualExists && generatedExists)
        withBothDocs++
    }

    return {
      components: {
        total: components.length,
        withManualDoc,
        withGeneratedDoc,
        withBothDocs,
      },
      guides: {
        total: guides.length,
        list: guides,
      },
      composables: {
        total: composables.length,
        list: composables,
      },
      directives: {
        total: directives.length,
        list: directives,
      },
      plugins: {
        total: plugins.length,
        list: plugins,
      },
      utils: {
        total: utils.length,
        list: utils,
      },
      node: {
        total: nodeItems.length,
        list: nodeItems,
      },
      paths: {
        docsRoot: this.docsRoot,
        componentsDir: this.componentsDir,
        generatedDocsDir: this.generatedDocsDir,
        guidesDir: this.guidesDir,
        composablesDir: this.composablesDir,
        directivesDir: this.directivesDir,
        pluginsDir: this.pluginsDir,
        ecosystemDir: this.ecosystemDir,
        utilsDir: this.utilsDir,
        nodeDir: this.nodeDir,
        iconsDir: this.iconsDir,
      },
    }
  }
}
