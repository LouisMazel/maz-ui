import type { AttributeNode, DirectiveNode, ElementNode, RootNode, TemplateChildNode } from '@vue/compiler-dom'
import type { ComponentApi, PropApi } from '../knowledge/schema'
import type { Background } from './classes'
import type { ReviewContext } from './types'

import { NodeTypes } from '@vue/compiler-dom'
import { closest, toKebab } from '../knowledge/resolve'
import { backgroundOf, checkClassList, checkClassStrings } from './classes'
import { isPassthroughAttribute, NATIVE_EVENTS, nativeReplacement } from './html'
import { checkStyleDeclarations } from './style'

export function toCamel(value: string): string {
  return value.replaceAll(/-([a-z\d])/g, (_, char: string) => char.toUpperCase())
}

function toPascal(tag: string): string {
  const camel = toCamel(tag)

  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

function isElement(node: TemplateChildNode | RootNode): node is ElementNode {
  return node.type === NodeTypes.ELEMENT
}

function staticAttribute(element: ElementNode, name: string): AttributeNode | undefined {
  return element.props.find((prop): prop is AttributeNode => prop.type === NodeTypes.ATTRIBUTE && prop.name === name)
}

function directiveArg(directive: DirectiveNode): string | undefined {
  return directive.arg?.type === NodeTypes.SIMPLE_EXPRESSION && directive.arg.isStatic ? directive.arg.content : undefined
}

function directiveExpression(directive: DirectiveNode): { content: string, offset: number } | undefined {
  return directive.exp?.type === NodeTypes.SIMPLE_EXPRESSION
    ? { content: directive.exp.content, offset: directive.exp.loc.start.offset }
    : undefined
}

/** Offset of the first character of an attribute value (after the quote) */
function valueOffset(attribute: AttributeNode, source: string): number {
  const start = attribute.value?.loc.start.offset ?? attribute.loc.start.offset

  return /["']/.test(source[start] ?? '') ? start + 1 : start
}

function findProp(component: ComponentApi, name: string): PropApi | undefined {
  const camel = toCamel(name)

  return component.props.find(prop => prop.name === camel)
}

/** Resolves a template tag to a maz-ui component name (`maz-btn`, `LazyMazBtn` -> `MazBtn`) */
export function mazTagName(tag: string): string | undefined {
  const pascal = toPascal(tag).replace(/^Lazy(?=Maz)/, '')

  return /^Maz[A-Z\d]/.test(pascal) ? pascal : undefined
}

function checkPropValue(prop: PropApi, value: string, offset: number, component: ComponentApi, context: ReviewContext): void {
  if (prop.type === 'boolean' && (value === 'false' || value === 'true')) {
    context.report({
      rule: 'boolean-prop-string',
      severity: value === 'false' ? 'error' : 'info',
      message: `\`${toKebab(prop.name)}="${value}"\` on ${component.name} passes the string "${value}"${value === 'false' ? ', which is truthy' : ''}.`,
      suggestion: value === 'false' ? `Remove the attribute or bind it: \`:${toKebab(prop.name)}="false"\`.` : `Write \`${toKebab(prop.name)}\` alone.`,
    }, offset)
    return
  }

  if (prop.strictValues && prop.values && !prop.values.includes(value)) {
    const near = closest(value, prop.values, { max: 2, limit: 1 })

    context.report({
      rule: 'invalid-prop-value',
      severity: 'error',
      message: `"${value}" is not a valid \`${toKebab(prop.name)}\` for ${component.name}.`,
      suggestion: `Accepted values: ${prop.values.map(entry => `"${entry}"`).join(', ')}.${near[0] ? ` Did you mean "${near[0]}"?` : ''}`,
    }, offset)
  }
}

/** Prop names agents bring from other libraries, mapped to the maz-ui props */
const PROP_SYNONYMS: Record<string, string[]> = {
  items: ['options'],
  choices: ['options'],
  list: ['options'],
  data: ['options', 'rows'],
  columns: ['headers'],
  value: ['modelValue'],
  checked: ['modelValue'],
  selected: ['modelValue'],
  open: ['modelValue'],
  isOpen: ['modelValue'],
  show: ['modelValue'],
  visible: ['modelValue'],
  active: ['modelValue'],
  text: ['label', 'title', 'content'],
  helperText: ['hint'],
  helper: ['hint'],
  message: ['hint'],
  errorMessage: ['hint', 'error'],
  variant: ['color', 'fill', 'outlined'],
  image: ['src'],
  leftIcon: ['startIcon'],
  rightIcon: ['endIcon'],
  prependIcon: ['startIcon'],
  appendIcon: ['endIcon'],
}

function nameWords(name: string): string[] {
  return toKebab(name).split('-').filter(Boolean)
}

/** Props close to an unknown name: synonyms, props containing its words (not for HTML attributes), typos */
export function propSuggestions(name: string, component: ComponentApi, { containing = true } = {}): string[] {
  const camel = toCamel(name)
  const props = component.props.map(prop => prop.name)
  const synonyms = (PROP_SYNONYMS[camel] ?? []).filter(prop => props.includes(prop))
  const words = nameWords(camel.replace(/^(?:is|has)(?=[A-Z])/, ''))
  const withWords = containing
    ? props.filter(prop => words.every(word => nameWords(prop).includes(word))).sort((a, b) => a.length - b.length)
    : []
  const near = closest(camel, props, { max: camel.length <= 3 ? 1 : 2, limit: 2 })

  return [...new Set([...synonyms, ...withWords, ...near])].slice(0, 3)
}

function reportUnknownProp(name: string, offset: number, component: ComponentApi, context: ReviewContext): void {
  const passthrough = isPassthroughAttribute(name)
  const near = propSuggestions(name, component, { containing: !passthrough })

  if (passthrough && near.length === 0)
    return

  const names = near.map(entry => (entry === 'modelValue' ? '`v-model`' : `\`${toKebab(entry)}\``)).join(' or ')

  context.report({
    rule: 'unknown-prop',
    severity: 'warning',
    message: passthrough
      ? `\`${name}\` is not a prop of ${component.name}: it is only forwarded as an HTML attribute (the component may not use it).`
      : `${component.name} has no prop \`${name}\`: it will only be forwarded as an HTML attribute.`,
    suggestion: near.length > 0
      ? `Did you mean ${names}? Check \`get_component_api({ names: ["${component.name}"] })\`.`
      : `Check the real API with \`get_component_api({ names: ["${component.name}"] })\`.`,
  }, offset)
}

function checkModel(directive: DirectiveNode, component: ComponentApi, context: ReviewContext): void {
  const arg = directiveArg(directive) ?? 'modelValue'
  const prop = findProp(component, arg)

  if (!prop) {
    const models = component.props.filter(entry => entry.model).map(entry => (entry.name === 'modelValue' ? 'v-model' : `v-model:${toKebab(entry.name)}`))

    context.report({
      rule: 'unknown-model',
      severity: 'error',
      message: `${component.name} has no \`${arg === 'modelValue' ? 'v-model' : `v-model:${arg}`}\`.`,
      suggestion: models.length > 0 ? `Available: ${models.map(entry => `\`${entry}\``).join(', ')}.` : `${component.name} has no v-model.`,
    }, directive.loc.start.offset)
  }
}

function checkEvent(directive: DirectiveNode, component: ComponentApi, context: ReviewContext): void {
  const name = directiveArg(directive)

  if (!name)
    return

  const kebab = toKebab(name)
  const events = component.events.map(event => event.name)

  if (events.includes(kebab) || events.includes(name) || NATIVE_EVENTS.has(kebab.split('.')[0]))
    return

  const updateMatch = /^update:(.+)$/.exec(kebab)

  if (updateMatch) {
    if (!findProp(component, updateMatch[1])) {
      context.report({
        rule: 'unknown-event',
        severity: 'error',
        message: `${component.name} never emits \`${name}\`: it has no \`${toCamel(updateMatch[1])}\` prop.`,
        suggestion: `Events: ${events.map(event => `\`@${event}\``).join(', ') || 'none'}.`,
      }, directive.loc.start.offset)
    }
    return
  }

  const near = closest(kebab, [...events, ...NATIVE_EVENTS], { max: 2, limit: 1 })

  context.report({
    rule: 'unknown-event',
    severity: near.length > 0 ? 'error' : 'warning',
    message: `${component.name} does not emit \`${name}\` and it is not a DOM event.`,
    suggestion: near.length > 0
      ? `Did you mean \`@${near[0]}\`?`
      : `Events: ${events.map(event => `\`@${event}\``).join(', ') || 'none (DOM events like @click still work)'}.`,
  }, directive.loc.start.offset)
}

function isStaticSlot(prop: ElementNode['props'][number]): prop is DirectiveNode {
  return prop.type === NodeTypes.DIRECTIVE
    && prop.name === 'slot'
    && (!prop.arg || prop.arg.type !== NodeTypes.SIMPLE_EXPRESSION || prop.arg.isStatic)
}

/** Slots used on a component: `v-slot` on the component itself and on its `<template>` children */
function usedSlots(element: ElementNode): Array<{ name: string, offset: number }> {
  const templates = element.children.filter((child): child is ElementNode => isElement(child) && child.tag === 'template')

  return [element, ...templates]
    .flatMap(node => node.props.filter(isStaticSlot))
    .map(prop => ({ name: directiveArg(prop) ?? 'default', offset: prop.loc.start.offset }))
}

/** Matches a slot name, dynamic slots included (`cell-{key}` matches `cell-name`) */
function slotMatches(slot: string, name: string): boolean {
  if (!slot.includes('{'))
    return slot === name

  const [prefix, suffix] = slot.split(/\{[^}]*\}/)

  return name.length > prefix.length + suffix.length && name.startsWith(prefix) && name.endsWith(suffix)
}

function checkSlots(element: ElementNode, component: ComponentApi, context: ReviewContext): void {
  const slots = component.slots.map(slot => slot.name)

  for (const { name, offset } of usedSlots(element)) {
    if (slots.some(slot => slotMatches(slot, name)) || (name === 'default' && slots.length === 0))
      continue

    const near = closest(name, slots, { max: 3, limit: 2 })

    context.report({
      rule: 'unknown-slot',
      severity: 'error',
      message: `${component.name} has no \`#${name}\` slot: its content will not be rendered.`,
      suggestion: near.length > 0 ? `Did you mean ${near.map(entry => `\`#${entry}\``).join(' or ')}?` : `Slots: ${slots.map(slot => `\`#${slot}\``).join(', ') || 'none'}.`,
    }, offset)
  }
}

const STYLE_BINDINGS = new Set(['class', 'style', 'key'])

function checkStaticAttribute(attribute: AttributeNode, component: ComponentApi, source: string, context: ReviewContext): void {
  if (STYLE_BINDINGS.has(attribute.name))
    return

  const definition = findProp(component, attribute.name)

  if (!definition)
    reportUnknownProp(attribute.name, attribute.loc.start.offset, component, context)
  else if (attribute.value)
    checkPropValue(definition, attribute.value.content, valueOffset(attribute, source), component, context)
}

function checkBoundProp(directive: DirectiveNode, component: ComponentApi, context: ReviewContext): void {
  const name = directiveArg(directive)

  if (!name || STYLE_BINDINGS.has(name))
    return

  const definition = findProp(component, name)

  if (!definition) {
    reportUnknownProp(name, directive.loc.start.offset, component, context)
    return
  }

  const expression = directiveExpression(directive)
  const literal = expression?.content.trim()

  if (expression && literal && /^'[^']*'$|^"[^"]*"$/.test(literal) && definition.type !== 'boolean')
    checkPropValue(definition, literal.slice(1, -1), expression.offset, component, context)
}

function checkMazComponent(element: ElementNode, component: ComponentApi, source: string, context: ReviewContext): void {
  for (const prop of element.props) {
    if (prop.type === NodeTypes.ATTRIBUTE)
      checkStaticAttribute(prop, component, source, context)
    else if (prop.name === 'bind')
      checkBoundProp(prop, component, context)
    else if (prop.name === 'model')
      checkModel(prop, component, context)
    else if (prop.name === 'on')
      checkEvent(prop, component, context)
  }

  checkSlots(element, component, context)
}

const SVG_SHAPES = new Set(['path', 'circle', 'rect', 'polyline', 'polygon', 'line', 'ellipse'])
const ICON_MAX_VIEWBOX = 32

function svgDescendants(element: ElementNode): ElementNode[] {
  return element.children.filter(isElement).flatMap(child => [child, ...svgDescendants(child)])
}

function isAnimated(element: ElementNode): boolean {
  const classes = staticAttribute(element, 'class')?.value?.content ?? ''

  return element.tag.startsWith('animate')
    || /\banimate-|\[animation/.test(classes)
    || element.props.some(prop => prop.name.startsWith('stroke-dash'))
}

/**
 * An inline SVG that an icon of @maz-ui/icons could replace: static shapes in an icon-sized viewBox.
 * Drawings (bigger viewBox), animated or data-driven SVGs (directives on their shapes) are left alone.
 */
export function isIconLikeSvg(svg: ElementNode): boolean {
  const descendants = svgDescendants(svg)

  if (!descendants.some(child => SVG_SHAPES.has(child.tag)))
    return false

  const viewBox = staticAttribute(svg, 'viewBox')?.value?.content.trim().split(/[\s,]+/).map(Number)

  if (viewBox?.length === 4 && (viewBox[2] > ICON_MAX_VIEWBOX || viewBox[3] > ICON_MAX_VIEWBOX))
    return false

  return ![svg, ...descendants].some(node => isAnimated(node) || (node !== svg && node.props.some(prop => prop.type === NodeTypes.DIRECTIVE)))
}

function checkNativeElement(element: ElementNode, context: ReviewContext): void {
  if (element.tag === 'svg' && isIconLikeSvg(element)) {
    context.report({
      rule: 'inline-svg',
      severity: 'warning',
      message: 'Inline SVG icon.',
      suggestion: 'Use an icon from @maz-ui/icons: `find_icons({ query: "..." })`.',
    }, element.loc.start.offset)
    return
  }

  const replacement = nativeReplacement(element.tag, staticAttribute(element, 'type')?.value?.content)

  if (replacement) {
    context.report({
      rule: 'prefer-maz-component',
      severity: replacement.severity,
      message: `Native \`<${element.tag}>\`${element.tag === 'input' ? ` (type "${staticAttribute(element, 'type')?.value?.content ?? 'text'}")` : ''}.`,
      suggestion: `Use ${replacement.component}: themed, accessible and consistent with the rest of the UI. Add \`<!-- maz-ui-review-ignore -->\` above it if the native element is intended.`,
    }, element.loc.start.offset)
  }
}

function checkClassBindings(element: ElementNode, source: string, context: ReviewContext, inherited?: Background): void {
  for (const prop of element.props) {
    if (prop.type === NodeTypes.ATTRIBUTE && prop.name === 'class' && prop.value) {
      checkClassList(prop.value.content, valueOffset(prop, source), context, inherited)
    }
    else if (prop.type === NodeTypes.ATTRIBUTE && prop.name === 'style' && prop.value) {
      checkStyleDeclarations(prop.value.content, valueOffset(prop, source), context)
    }
    else if (prop.type === NodeTypes.DIRECTIVE && prop.name === 'bind' && directiveArg(prop) === 'class') {
      const expression = directiveExpression(prop)

      if (expression)
        checkClassStrings(expression.content, expression.offset, context)
    }
  }
}

function checkMazTag(element: ElementNode, mazName: string, source: string, context: ReviewContext): void {
  const component = context.knowledge.componentsByName.get(mazName)

  if (component) {
    checkMazComponent(element, component, source, context)
    return
  }

  if (context.knowledge.iconNames.has(mazName))
    return

  const near = closest(mazName, [...context.knowledge.componentsByName.keys(), ...context.knowledge.iconNames], { max: 3, limit: 3 })

  context.report({
    rule: 'unknown-component',
    severity: 'error',
    message: `\`<${element.tag}>\` is neither a maz-ui component nor a @maz-ui/icons icon.`,
    suggestion: near.length > 0 ? `Did you mean ${near.map(entry => `\`${entry}\``).join(' or ')}?` : 'Use `search_docs` or `find_icons` to find the right name.',
  }, element.loc.start.offset)
}

/** Walks the template; `background` is the closest background set by a parent (for `text-white` on `bg-overlay`) */
function walk(node: ElementNode | RootNode, source: string, context: ReviewContext, background?: Background): void {
  for (const child of node.children) {
    if (!isElement(child))
      continue

    const pascal = /[A-Z-]/.test(child.tag) ? toPascal(child.tag) : undefined
    const mazName = pascal && context.localComponents?.has(pascal)
      ? mazTagName(context.localComponents.get(pascal) ?? '')
      : mazTagName(child.tag)

    if (mazName)
      checkMazTag(child, mazName, source, context)
    else
      checkNativeElement(child, context)

    checkClassBindings(child, source, context, background)
    walk(child, source, context, backgroundOf(staticAttribute(child, 'class')?.value?.content ?? '') ?? background)
  }
}

export function reviewTemplate(root: ElementNode | RootNode, source: string, context: ReviewContext): void {
  walk(root, source, context)
}
