import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import ts from 'typescript'

export interface NuxtAutoImports {
  /** Components auto-imported by default */
  components: string[]
  /** Composables auto-imported by default */
  composables: string[]
  /** Composables auto-imported when the matching `mazUi.<name>` option is enabled */
  pluginComposables: Record<string, string>
}

function objectKeys(source: string, constName: string): string[] {
  const match = new RegExp(`const ${constName}[^=]*=\\s*\\{([\\s\\S]*?)\\n\\}`).exec(source)

  return match
    ? [
        ...match[1].matchAll(/(\w+)\s*:\s*true/g),
      ].map(entry => entry[1])
    : []
}

function setValues(source: string, constName: string): string[] {
  const match = new RegExp(`const ${constName}[^=]*=\\s*new Set\\(\\[([\\s\\S]*?)\\]\\)`).exec(source)

  return match
    ? [
        ...match[1].matchAll(/'(\w+)'/g),
      ].map(entry => entry[1])
    : []
}

function resolveModule(fromFile: string, specifier: string): string | undefined {
  const base = resolve(dirname(fromFile), specifier)

  return [
    base,
    `${base}.ts`,
    join(base, 'index.ts'),
  ].find(file => existsSync(file) && statSync(file).isFile())
}

function hasExportModifier(statement: ts.Statement): boolean {
  return ts.canHaveModifiers(statement) && (ts.getModifiers(statement) ?? []).some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)
}

function declaredNames(statement: ts.Statement): string[] {
  if (!hasExportModifier(statement))
    return []

  if (ts.isVariableStatement(statement)) {
    return statement.declarationList.declarations.flatMap(declaration => ts.isIdentifier(declaration.name)
      ? [declaration.name.text]
      : [])
  }

  if ((ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement) || ts.isEnumDeclaration(statement)) && statement.name)
    return [statement.name.text]

  return []
}

function reExportedNames(file: string, statement: ts.ExportDeclaration): string[] {
  if (statement.isTypeOnly)
    return []

  if (statement.exportClause) {
    return ts.isNamedExports(statement.exportClause)
      ? statement.exportClause.elements.filter(element => !element.isTypeOnly).map(element => element.name.text)
      : []
  }

  const target = statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)
    ? resolveModule(file, statement.moduleSpecifier.text)
    : undefined

  return target
    ? valueExports(target)
    : []
}

/** The names of the values exported by a barrel (what `chunk.exports` lists in `maz-ui/exports.json`), types excluded */
function valueExports(file: string): string[] {
  if (!existsSync(file))
    return []

  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest)

  return source.statements.flatMap(statement => ts.isExportDeclaration(statement)
    ? reExportedNames(file, statement)
    : declaredNames(statement))
}

/**
 * The Nuxt module auto-imports the components and composables listed in `maz-ui/exports.json` (written by the build):
 * they are read here from the barrels of the sources, so the docs do not need the build of maz-ui.
 */
export function collectNuxtAutoImports(moduleFile: string, libSrc: string): NuxtAutoImports {
  const source = readFileSync(moduleFile, 'utf8')
  const notAutoImported = new Set(setValues(source, 'NOT_AUTO_IMPORTED_COMPOSABLES'))

  return {
    components: [
      ...new Set(valueExports(join(libSrc, 'components/index.ts')).filter(name => /^Maz[A-Z]/.test(name))),
    ].sort(),
    composables: [
      ...new Set(valueExports(join(libSrc, 'composables/index.ts')).filter(name => !notAutoImported.has(name))),
      ...objectKeys(source, 'pluginComposables'),
    ],
    pluginComposables: {
      useAos: 'aos',
    },
  }
}
