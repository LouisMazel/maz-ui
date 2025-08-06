import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

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
  helpers: {
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
    helpersDir: string
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
  private readonly helpersDir: string

  constructor() {
    const localDocsRoot = resolve(__dirname, '../docs/src')
    const localGeneratedDocsDir = resolve(__dirname, '../docs/generated-docs')

    this.docsRoot = localDocsRoot
    this.generatedDocsDir = localGeneratedDocsDir

    this.componentsDir = join(this.docsRoot, 'components')
    this.guidesDir = join(this.docsRoot, 'guide')
    this.composablesDir = join(this.docsRoot, 'composables')
    this.directivesDir = join(this.docsRoot, 'directives')
    this.pluginsDir = join(this.docsRoot, 'plugins')
    this.helpersDir = join(this.docsRoot, 'helpers')
  }

  /**
   * Convert un nom de composant PascalCase vers kebab-case
   * MazBtn -> maz-btn
   */
  private pascalToKebabCase(pascalName: string): string {
    return pascalName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
  }

  /**
   * Lit un fichier markdown et retourne son contenu ou une chaîne vide
   */
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

  /**
   * Liste les fichiers markdown dans un répertoire
   */
  private listMarkdownFiles(dirPath: string): string[] {
    try {
      if (!existsSync(dirPath)) {
        return []
      }
      const files = readdirSync(dirPath)
      return files
        .filter(file => file.endsWith('.md') && file !== 'index.md')
        .map(file => file.replace('.md', ''))
        .sort()
    }
    catch {
      return []
    }
  }

  // ========== COMPOSANTS ==========

  /**
   * Récupère la documentation complète d'un composant (manuelle + générée)
   */
  getComponentDocumentation(componentName: string): string {
    // Accepte MazBtn ou maz-btn, normalise en kebab-case
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

  /**
   * Liste tous les composants disponibles
   */
  getAllComponents(): string[] {
    const [manualFiles, generatedFiles] = [
      this.listMarkdownFiles(this.componentsDir),
      this.listMarkdownFiles(this.generatedDocsDir).map(file => file.replace('.doc', '')),
    ]

    // Combine et déduplique
    const allComponents = new Set([...manualFiles, ...generatedFiles])
    return Array.from(allComponents).sort()
  }

  // ========== GUIDES ==========

  /**
   * Récupère la documentation d'un guide
   */
  getGuideDocumentation(guideName: string): string {
    const guidePath = join(this.guidesDir, `${guideName}.md`)
    return this.readMarkdownFile(guidePath)
  }

  /**
   * Liste tous les guides disponibles
   */
  getAllGuides(): string[] {
    return this.listMarkdownFiles(this.guidesDir)
  }

  // ========== COMPOSABLES ==========

  /**
   * Récupère la documentation d'un composable
   */
  getComposableDocumentation(composableName: string): string {
    const composablePath = join(this.composablesDir, `${composableName}.md`)
    return this.readMarkdownFile(composablePath)
  }

  /**
   * Liste tous les composables disponibles
   */
  getAllComposables(): string[] {
    return this.listMarkdownFiles(this.composablesDir)
  }

  // ========== DIRECTIVES ==========

  /**
   * Récupère la documentation d'une directive
   */
  getDirectiveDocumentation(directiveName: string): string {
    const directivePath = join(this.directivesDir, `${directiveName}.md`)
    return this.readMarkdownFile(directivePath)
  }

  /**
   * Liste toutes les directives disponibles
   */
  getAllDirectives(): string[] {
    return this.listMarkdownFiles(this.directivesDir)
  }

  // ========== PLUGINS ==========

  /**
   * Récupère la documentation d'un plugin
   */
  getPluginDocumentation(pluginName: string): string {
    const pluginPath = join(this.pluginsDir, `${pluginName}.md`)
    return this.readMarkdownFile(pluginPath)
  }

  /**
   * Liste tous les plugins disponibles
   */
  getAllPlugins(): string[] {
    return this.listMarkdownFiles(this.pluginsDir)
  }

  // ========== HELPERS ==========

  /**
   * Récupère la documentation d'un helper
   */
  getHelperDocumentation(helperName: string): string {
    const helperPath = join(this.helpersDir, `${helperName}.md`)
    return this.readMarkdownFile(helperPath)
  }

  /**
   * Liste tous les helpers disponibles
   */
  getAllHelpers(): string[] {
    return this.listMarkdownFiles(this.helpersDir)
  }

  // ========== UTILITAIRES ==========

  /**
   * Récupère la vue d'ensemble de la librairie
   */
  getOverview(): string {
    const overviewPath = join(this.docsRoot, 'index.md')
    return this.readMarkdownFile(overviewPath)
  }

  /**
   * Recherche dans toute la documentation
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  searchDocumentation(query: string): string[] {
    const searchTerm = query.toLowerCase()
    const results: string[] = []

    // Chercher dans les composants
    const components = this.getAllComponents()
    for (const component of components) {
      if (component.toLowerCase().includes(searchTerm)) {
        results.push(`component:${component}`)
      }
    }

    // Chercher dans les guides
    const guides = this.getAllGuides()
    for (const guide of guides) {
      if (guide.toLowerCase().includes(searchTerm)) {
        results.push(`guide:${guide}`)
      }
    }

    // Chercher dans les composables
    const composables = this.getAllComposables()
    for (const composable of composables) {
      if (composable.toLowerCase().includes(searchTerm)) {
        results.push(`composable:${composable}`)
      }
    }

    // Chercher dans les directives
    const directives = this.getAllDirectives()
    for (const directive of directives) {
      if (directive.toLowerCase().includes(searchTerm)) {
        results.push(`directive:${directive}`)
      }
    }

    // Chercher dans les plugins
    const plugins = this.getAllPlugins()
    for (const plugin of plugins) {
      if (plugin.toLowerCase().includes(searchTerm)) {
        results.push(`plugin:${plugin}`)
      }
    }

    // Chercher dans les helpers
    const helpers = this.getAllHelpers()
    for (const helper of helpers) {
      if (helper.toLowerCase().includes(searchTerm)) {
        results.push(`helper:${helper}`)
      }
    }

    return results
  }

  /**
   * Récupère les diagnostics détaillés pour debugging
   */
  getDiagnostics(): DocumentationDiagnostics {
    const [components, guides, composables, directives, plugins, helpers] = [
      this.getAllComponents(),
      this.getAllGuides(),
      this.getAllComposables(),
      this.getAllDirectives(),
      this.getAllPlugins(),
      this.getAllHelpers(),
    ]

    // Diagnostics pour les composants
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
      helpers: {
        total: helpers.length,
        list: helpers,
      },
      paths: {
        docsRoot: this.docsRoot,
        componentsDir: this.componentsDir,
        generatedDocsDir: this.generatedDocsDir,
        guidesDir: this.guidesDir,
        composablesDir: this.composablesDir,
        directivesDir: this.directivesDir,
        pluginsDir: this.pluginsDir,
        helpersDir: this.helpersDir,
      },
    }
  }
}
