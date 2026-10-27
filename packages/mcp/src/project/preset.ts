import type { CallExpression, Expression, Node, ObjectExpression } from '@babel/types'

import { parse } from '@babel/parser'

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

  return node.key.type === 'StringLiteral' || node.key.type === 'NumericLiteral' ? String(node.key.value) : undefined
}

function unwrap(node: Expression): Expression {
  return node.type === 'TSAsExpression' || node.type === 'TSSatisfiesExpression' || node.type === 'TSNonNullExpression' || node.type === 'ParenthesizedExpression'
    ? unwrap(node.expression)
    : node
}

/** Evaluates the literal parts of an expression */
export function literalValue(node: Expression, source: string): PresetValue {
  const expression = unwrap(node)

  switch (expression.type) {
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
      return expression.value
    case 'NullLiteral':
      return null
    case 'TemplateLiteral':
      return expression.expressions.length === 0
        ? expression.quasis.map(quasi => quasi.value.cooked ?? quasi.value.raw).join('')
        : `<expr: ${sourceOf(expression, source)}>`
    case 'ArrayExpression':
      return expression.elements.map(element => (element && element.type !== 'SpreadElement' ? literalValue(element, source) : null))
    case 'ObjectExpression':
      return Object.fromEntries(expression.properties.flatMap((property) => {
        const key = keyOf(property)

        return key && property.type === 'ObjectProperty' ? [[key, literalValue(property.value as Expression, source)]] : []
      }))
    default:
      return `<expr: ${sourceOf(expression, source)}>`
  }
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

  const variableName = node.type === 'VariableDeclarator' && node.id.type === 'Identifier' ? node.id.name : name

  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc' || key === 'leadingComments' || key === 'trailingComments' || key === 'innerComments')
      continue

    for (const child of Array.isArray(value) ? value : [value]) {
      if (child && typeof child === 'object' && typeof (child as Node).type === 'string')
        findPresetCalls(child as Node, found, variableName)
    }
  }
}

/** Reads the `definePreset({ base, overrides })` calls of a source file */
export function readPresets(file: string, source: string): ProjectPreset[] {
  let program: Node

  try {
    program = parse(source, { sourceType: 'module', plugins: ['typescript'], errorRecovery: true }).program
  }
  catch {
    return []
  }

  const calls: Array<{ call: CallExpression, name?: string }> = []
  findPresetCalls(program, calls)

  return calls.flatMap(({ call, name }) => {
    const [argument] = call.arguments

    if (!argument || argument.type !== 'ObjectExpression')
      return []

    const options = literalValue(argument, source) as { [key: string]: PresetValue }
    const base = options.base
    const overrides = options.overrides

    return [{
      file,
      exportName: name,
      base: typeof base === 'string' ? base.replace(/^<expr: (.*)>$/, '$1') : undefined,
      overrides: overrides && typeof overrides === 'object' && !Array.isArray(overrides) ? overrides : {},
    }]
  })
}
