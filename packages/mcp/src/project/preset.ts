import type { CallExpression, Expression, Node, ObjectExpression, Program, TemplateLiteral } from '@babel/types'

import type { PresetUsage } from './preset-usage.ts'

import { parse } from '@babel/parser'
import { emptyPresetUsage } from './preset-usage.ts'

/** Literal value of a preset; expressions that are not literals keep their source (`<expr: brandColors.primary>`) */
export type PresetValue = string | number | boolean | null | PresetValue[] | { [key: string]: PresetValue }

export interface ProjectPreset {
  /** Path relative to the project root */
  file: string
  /** Exported name of the preset (`brandPreset`) */
  exportName?: string
  /** `base` of `definePreset`: a preset identifier (`mazUi`) or name (`'ocean'`) */
  base?: string
  overrides: { [key: string]: PresetValue }
}

function sourceOf(node: Node, source: string): string {
  return source.slice(node.start ?? 0, node.end ?? 0).replaceAll(/\s+/g, ' ')
}

function keyOf(node: ObjectExpression['properties'][number]): string | undefined {
  if (node.type !== 'ObjectProperty' || node.computed)
    return undefined

  if (node.key.type === 'Identifier')
    return node.key.name

  return node.key.type === 'StringLiteral' || node.key.type === 'NumericLiteral'
    ? String(node.key.value)
    : undefined
}

function unwrap(node: Expression): Expression {
  return node.type === 'TSAsExpression' || node.type === 'TSSatisfiesExpression' || node.type === 'TSNonNullExpression' || node.type === 'ParenthesizedExpression'
    ? unwrap(node.expression)
    : node
}

/** Top-level `const` initializers of a file, to resolve the constants a preset uses */
export type Constants = Map<string, Expression>

function topLevelConstants(program: Program): Constants {
  const constants: Constants = new Map()

  for (const statement of program.body) {
    const declaration = statement.type === 'ExportNamedDeclaration'
      ? statement.declaration
      : statement

    if (declaration?.type !== 'VariableDeclaration' || declaration.kind !== 'const')
      continue

    for (const declarator of declaration.declarations) {
      if (declarator.id.type === 'Identifier' && declarator.init)
        constants.set(declarator.id.name, declarator.init)
    }
  }

  return constants
}

function isResolved(value: PresetValue): boolean {
  return typeof value !== 'string' || !value.startsWith('<expr: ')
}

function resolveMember(node: Expression, source: string, constants: Constants, seen: Set<string>): PresetValue | undefined {
  if (node.type !== 'MemberExpression')
    return undefined

  const key = node.computed
    ? (node.property.type === 'StringLiteral' || node.property.type === 'NumericLiteral'
        ? String(node.property.value)
        : undefined)
    : (node.property.type === 'Identifier'
        ? node.property.name
        : undefined)

  if (key === undefined || node.object.type === 'Super')
    return undefined

  const target = literalValue(node.object, source, constants, seen)

  if (target && typeof target === 'object' && !Array.isArray(target) && Object.hasOwn(target, key))
    return target[key]

  return undefined
}

function objectValue(node: ObjectExpression, source: string, constants: Constants, seen: Set<string>): PresetValue {
  const entries: Array<[string, PresetValue]> = []

  for (const property of node.properties) {
    if (property.type === 'SpreadElement') {
      const spread = literalValue(property.argument, source, constants, seen)

      if (spread && typeof spread === 'object' && !Array.isArray(spread))
        entries.push(...Object.entries(spread))

      continue
    }

    const key = keyOf(property)

    if (key && property.type === 'ObjectProperty')
      entries.push([key, literalValue(property.value as Expression, source, constants, seen)])
  }

  return Object.fromEntries(entries)
}

function templateValue(node: TemplateLiteral, source: string, constants: Constants, seen: Set<string>): string | undefined {
  const parts = node.expressions.map(part => literalValue(part as Expression, source, constants, seen))

  if (!parts.every(part => isResolved(part) && (typeof part === 'string' || typeof part === 'number')))
    return undefined

  return node.quasis
    .map((quasi, index) => `${quasi.value.cooked ?? quasi.value.raw}${index < parts.length ? String(parts[index]) : ''}`)
    .join('')
}

/** Evaluates the literal parts of an expression, and the constants of the file it references */
export function literalValue(node: Expression, source: string, constants: Constants = new Map(), seen: Set<string> = new Set()): PresetValue {
  const expression = unwrap(node)
  const unresolved = `<expr: ${sourceOf(expression, source)}>`

  switch (expression.type) {
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
      return expression.value
    case 'NullLiteral':
      return null
    case 'Identifier': {
      const initializer = constants.get(expression.name)

      if (!initializer || seen.has(expression.name))
        return unresolved

      return literalValue(initializer, source, constants, new Set(seen).add(expression.name))
    }
    case 'MemberExpression':
      return resolveMember(expression, source, constants, seen) ?? unresolved
    case 'TemplateLiteral':
      return templateValue(expression, source, constants, seen) ?? unresolved
    case 'ArrayExpression':
      return expression.elements.map(element => (element && element.type !== 'SpreadElement'
        ? literalValue(element, source, constants, seen)
        : null))
    case 'ObjectExpression':
      return objectValue(expression, source, constants, seen)
    default:
      return unresolved
  }
}

function childNodes(node: Node): Node[] {
  return Object.entries(node).flatMap(([key, value]) => {
    if (key === 'loc' || key === 'leadingComments' || key === 'trailingComments' || key === 'innerComments')
      return []

    return (Array.isArray(value)
      ? value
      : [value]).filter((child): child is Node => !!child && typeof child === 'object' && typeof (child as Node).type === 'string')
  })
}

function isDefinePreset(node: Node): node is CallExpression {
  return node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'definePreset'
}

/** Depth-first walk that keeps the name of the variable a call is assigned to */
function findPresetCalls(node: Node, found: Array<{ call: CallExpression, name?: string }>, name?: string): void {
  if (isDefinePreset(node)) {
    found.push({ call: node, name })
    return
  }

  const variableName = node.type === 'VariableDeclarator' && node.id.type === 'Identifier'
    ? node.id.name
    : name

  for (const child of childNodes(node))
    findPresetCalls(child, found, variableName)
}

/** Reads the `definePreset({ base, overrides })` calls of a source file */
export function readPresets(file: string, source: string): ProjectPreset[] {
  let program: Node

  try {
    program = parse(source, {
      sourceType: 'module',
      plugins: ['typescript'],
      errorRecovery: true,
    }).program
  }
  catch {
    return []
  }

  const calls: Array<{ call: CallExpression, name?: string }> = []
  findPresetCalls(program, calls)
  const constants = topLevelConstants(program as Program)

  return calls.flatMap(({ call, name }) => {
    const [argument] = call.arguments

    if (!argument || argument.type !== 'ObjectExpression')
      return []

    const options = literalValue(argument, source, constants) as { [key: string]: PresetValue }
    const base = options.base
    const overrides = options.overrides

    return [
      {
        file,
        exportName: name,
        base: typeof base === 'string'
          ? base.replace(/^<expr: (.*)>$/, '$1')
          : undefined,
        overrides: overrides && typeof overrides === 'object' && !Array.isArray(overrides)
          ? overrides
          : {},
      },
    ]
  })
}

const WIRING_HINT = /\bpreset\b|updateTheme|setPreset/
const PRESET_SETTERS = new Set(['updateTheme', 'setPreset'])
const MAX_DEPTH = 6

function importedNames(program: Program): Map<string, string> {
  const names = new Map<string, string>()

  for (const statement of program.body) {
    if (statement.type !== 'ImportDeclaration')
      continue

    const base = statement.source.value.split('/').pop()?.replace(/\.[cm]?[jt]s$/, '') ?? ''

    for (const specifier of statement.specifiers) {
      if (specifier.type === 'ImportSpecifier') {
        names.set(specifier.local.name, specifier.imported.type === 'Identifier'
          ? specifier.imported.name
          : specifier.imported.value)
      }
      else if (specifier.type === 'ImportDefaultSpecifier') {
        names.set(specifier.local.name, `default:${base}`)
      }
    }
  }

  return names
}

function isPresetExpression(node: Expression | undefined): boolean {
  return !!node && unwrap(node).type === 'CallExpression' && isDefinePreset(unwrap(node))
}

function functionBody(node: Expression | undefined): Node | undefined {
  if (!node)
    return undefined

  const expression = unwrap(node)

  return expression.type === 'ArrowFunctionExpression' || expression.type === 'FunctionExpression'
    ? expression.body
    : undefined
}

interface UsageContext {
  constants: Constants
  functions: Map<string, Node>
  imports: Map<string, string>
  usage: PresetUsage
  visited: Set<string>
}

function collectReturned(node: Node, context: UsageContext, depth: number): void {
  if (node.type === 'ReturnStatement') {
    if (node.argument)
      collectPreset(node.argument, context, depth + 1)

    return
  }

  if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression')
    return

  for (const child of childNodes(node))
    collectReturned(child, context, depth)
}

function collectTable(node: Expression | Node, context: UsageContext, depth: number): void {
  const object = node.type === 'Identifier'
    ? context.constants.get(node.name)
    : undefined
  const table = object && unwrap(object)

  if (table?.type !== 'ObjectExpression')
    return

  for (const property of table.properties) {
    if (property.type === 'ObjectProperty')
      collectPreset(property.value as Expression, context, depth + 1)
  }
}

function collectCall(call: CallExpression, context: UsageContext, depth: number): void {
  const name = call.callee.type === 'Identifier'
    ? call.callee.name
    : undefined

  if (name === 'definePreset') {
    context.usage.inlineFiles.push('')
    return
  }

  context.usage.dynamic = true

  const body = name
    ? context.functions.get(name)
    : undefined

  if (!name || !body || context.visited.has(`call:${name}`))
    return

  context.visited.add(`call:${name}`)

  if (body.type === 'BlockStatement')
    collectReturned(body, context, depth)
  else
    collectPreset(body as Expression, context, depth + 1)
}

function collectPreset(node: Expression, context: UsageContext, depth = 0): void {
  const expression = unwrap(node)
  const { usage } = context

  if (depth > MAX_DEPTH) {
    usage.dynamic = true
    return
  }

  switch (expression.type) {
    case 'StringLiteral':
      usage.used.push(expression.value)
      break
    case 'Identifier': {
      const initializer = context.constants.get(expression.name)

      if (initializer && !isPresetExpression(initializer) && !context.visited.has(expression.name) && ['Identifier', 'ConditionalExpression', 'LogicalExpression', 'CallExpression', 'MemberExpression', 'StringLiteral', 'TSAsExpression', 'TSSatisfiesExpression'].includes(initializer.type)) {
        context.visited.add(expression.name)
        collectPreset(initializer, context, depth + 1)
      }
      else {
        usage.used.push(context.imports.get(expression.name) ?? expression.name)
      }
      break
    }
    case 'ConditionalExpression':
      usage.dynamic = true
      collectPreset(expression.consequent, context, depth + 1)
      collectPreset(expression.alternate, context, depth + 1)
      break
    case 'LogicalExpression':
      usage.dynamic = true
      collectPreset(expression.left, context, depth + 1)
      collectPreset(expression.right, context, depth + 1)
      break
    case 'MemberExpression':
      usage.dynamic = true
      collectTable(expression.object, context, depth)
      break
    case 'CallExpression':
      collectCall(expression, context, depth)
      break
    default:
      usage.dynamic = true
  }
}

function findWiring(node: Node, context: UsageContext): void {
  if (node.type === 'ObjectProperty' && !node.computed) {
    const name = node.key.type === 'Identifier'
      ? node.key.name
      : (node.key.type === 'StringLiteral' ? node.key.value : undefined)

    if (name === 'preset') {
      context.usage.wired = true
      collectPreset(node.value as Expression, context)
    }
  }
  else if (node.type === 'CallExpression') {
    const callee = node.callee
    const name = callee.type === 'Identifier'
      ? callee.name
      : (callee.type === 'MemberExpression' && !callee.computed && callee.property.type === 'Identifier' ? callee.property.name : undefined)
    const [argument] = node.arguments

    if (name && PRESET_SETTERS.has(name) && argument && argument.type !== 'SpreadElement' && argument.type !== 'ArgumentPlaceholder') {
      context.usage.wired = true
      collectPreset(argument as Expression, context)
    }
  }

  for (const child of childNodes(node))
    findWiring(child, context)
}

function topLevelFunctions(program: Program): Map<string, Node> {
  const functions = new Map<string, Node>()

  for (const statement of program.body) {
    const declaration = statement.type === 'ExportNamedDeclaration' || statement.type === 'ExportDefaultDeclaration'
      ? statement.declaration
      : statement

    if (declaration?.type === 'FunctionDeclaration' && declaration.id) {
      functions.set(declaration.id.name, declaration.body)
    }
    else if (declaration?.type === 'VariableDeclaration') {
      for (const declarator of declaration.declarations) {
        const body = declarator.id.type === 'Identifier'
          ? functionBody(declarator.init ?? undefined)
          : undefined

        if (declarator.id.type === 'Identifier' && body)
          functions.set(declarator.id.name, body)
      }
    }
  }

  return functions
}

/** Finds the presets a source file passes to the theme (`preset: x`, `updateTheme(x)`) */
export function readPresetUsage(file: string, source: string): PresetUsage {
  const usage = emptyPresetUsage()

  if (!WIRING_HINT.test(source))
    return usage

  let program: Program

  try {
    program = parse(source, {
      sourceType: 'module',
      plugins: ['typescript'],
      errorRecovery: true,
    }).program
  }
  catch {
    return usage
  }

  findWiring(program, {
    constants: topLevelConstants(program),
    functions: topLevelFunctions(program),
    imports: importedNames(program),
    usage,
    visited: new Set(),
  })

  usage.used = [...new Set(usage.used)]
  usage.inlineFiles = usage.inlineFiles.map(() => file)

  return usage
}
