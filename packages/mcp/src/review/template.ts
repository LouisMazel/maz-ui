import type { AttributeNode, DirectiveNode, ElementNode, RootNode, TemplateChildNode } from '@vue/compiler-dom'
import type { ComponentApi, PropApi } from '../knowledge/schema.ts'
import type { Background } from './classes.ts'
import type { ReviewContext } from './types.ts'

import { NodeTypes } from '@vue/compiler-dom'
import { closest, toKebab } from '../knowledge/resolve.ts'
import { backgroundOf, checkClassList, checkClassStrings } from './classes.ts'
import { isPassthroughAttribute, NATIVE_EVENTS, nativeReplacement } from './html.ts'
import { checkStyleDeclarations } from './style.ts'

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
  return directive.arg?.type === NodeTypes.SIMPLE_EXPRESSION && directive.arg.isStatic
    ? directive.arg.content
    : undefined
}

function directiveExpression(directive: DirectiveNode): { content: string, offset: number } | undefined {
  return directive.exp?.type === NodeTypes.SIMPLE_EXPRESSION
    ? { content: directive.exp.content, offset: directive.exp.loc.start.offset }
    : undefined
}

/** Offset of the first character of an attribute value (after the quote) */
function valueOffset(attribute: AttributeNode, source: string): number {
  const start = attribute.value?.loc.start.offset ?? attribute.loc.start.offset

  return /["']/.test(source[start] ?? '')
    ? start + 1
    : start
}

/** The component and the ones receiving its attributes (`MazDropdown` -> `MazBtn`): their props and events work too */
function withForwarded(component: ComponentApi, context: ReviewContext): ComponentApi[] {
  const chain = [component]
  let target = component.forwardsAttrs && context.knowledge.componentsByName.get(component.forwardsAttrs)

  while (target && !chain.includes(target)) {
    chain.push(target)
    target = target.forwardsAttrs && context.knowledge.componentsByName.get(target.forwardsAttrs)
  }

  return chain
}

function findProp(component: ComponentApi, name: string, context: ReviewContext): PropApi | undefined {
  const camel = toCamel(name)

  for (const candidate of withForwarded(component, context)) {
    const prop = candidate.props.find(entry => entry.name === camel)

    if (prop)
      return prop
  }

  return undefined
}

/** Resolves a template tag to a maz-ui component name (`maz-btn`, `LazyMazBtn` -> `MazBtn`) */
export function mazTagName(tag: string): string | undefined {
  const pascal = toPascal(tag).replace(/^Lazy(?=Maz)/, '')

  return /^Maz[A-Z\d]/.test(pascal)
    ? pascal
    : undefined
}

const ICON_PROP_TYPE = /\bMazIcon(?:Like|Value|String)\b|\bIconComponent\b/
const ICON_NAME_PATTERN = /^[a-z\d]+(?:-[a-z\d]+)*(?::[a-z\d]+(?:-[a-z\d]+)*)?$/i

/** An icon name (`icon="x-mark"`, `icon="app:hero"`) of maz-ui or of the project, not checked with an unknown prefix */
function checkIconName(value: string, offset: number, component: ComponentApi, context: ReviewContext): void {
  const names = context.iconNames ?? new Set()
  const prefix = value.includes(':')
    ? `${value.split(':')[0]}:`
    : undefined

  if (!ICON_NAME_PATTERN.test(value) || names.size === 0 || (prefix && ![...names].some(name => name.startsWith(prefix))))
    return

  if (context.icons && !context.icons.registered && !context.reportedUnregisteredIcons) {
    context.reportedUnregisteredIcons = true
    context.report({
      rule: 'unregistered-icon-names',
      severity: 'info',
      message: `"${value}" is an icon name: the names only render when \`MazUi()\` of @maz-ui/vite-plugin or @maz-ui/nuxt registers them, the project has neither.`,
      suggestion: 'Add `MazUi()` to the plugins of vite.config (or the module @maz-ui/nuxt), or pass the icon: `:icon="MazTrash"` with `import { MazTrash } from \'@maz-ui/icons/raw/MazTrash\'`.',
    }, offset)
  }

  if (names.has(value))
    return

  const near = closest(value, names, { max: 2, limit: 3 })

  context.report({
    rule: 'unknown-icon',
    severity: 'error',
    message: `"${value}" is neither an icon of @maz-ui/icons nor of the project: ${component.name} renders the fallback icon.`,
    suggestion: near.length > 0
      ? `Did you mean ${near.map(name => `"${name}"`).join(' or ')}? Search with \`find_icons\`.`
      : 'Search with `find_icons({ query: "..." })`, or add the SVG to the icons folder of the project (`src/icons`).',
  }, offset)
}

function checkPropValue(prop: PropApi, value: string, offset: number, component: ComponentApi, context: ReviewContext): void {
  if (ICON_PROP_TYPE.test(prop.type)) {
    checkIconName(value, offset, component, context)
    return
  }

  if (prop.type === 'boolean' && (value === 'false' || value === 'true')) {
    context.report({
      rule: 'boolean-prop-string',
      severity: value === 'false'
        ? 'error'
        : 'info',
      message: `\`${toKebab(prop.name)}="${value}"\` on ${component.name} passes the string "${value}"${value === 'false'
        ? ', which is truthy'
        : ''}.`,
      suggestion: value === 'false'
        ? `Remove the attribute or bind it: \`:${toKebab(prop.name)}="false"\`.`
        : `Write \`${toKebab(prop.name)}\` alone.`,
    }, offset)
    return
  }

  if (prop.strictValues && prop.values && !prop.values.includes(value)) {
    const near = closest(value, prop.values, { max: 2, limit: 1 })

    context.report({
      rule: 'invalid-prop-value',
      severity: 'error',
      message: `"${value}" is not a valid \`${toKebab(prop.name)}\` for ${component.name}.`,
      suggestion: `Accepted values: ${prop.values.map(entry => `"${entry}"`).join(', ')}.${near[0]
        ? ` Did you mean "${near[0]}"?`
        : ''}`,
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
  const near = closest(camel, props, {
    max: camel.length <= 3
      ? 1
      : 2,
    limit: 2,
  })

  return [
    ...new Set([
      ...synonyms,
      ...withWords,
      ...near,
    ]),
  ].slice(0, 3)
}

function reportUnknownProp(name: string, offset: number, component: ComponentApi, context: ReviewContext): void {
  const passthrough = isPassthroughAttribute(name)
  const near = propSuggestions(name, component, { containing: !passthrough })

  if (passthrough && near.length === 0)
    return

  const names = near.map(entry => (entry === 'modelValue'
    ? '`v-model`'
    : `\`${toKebab(entry)}\``)).join(' or ')

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
  const prop = findProp(component, arg, context)

  if (!prop) {
    const models = component.props.filter(entry => entry.model).map(entry => (entry.name === 'modelValue'
      ? 'v-model'
      : `v-model:${toKebab(entry.name)}`))

    context.report({
      rule: 'unknown-model',
      severity: 'error',
      message: `${component.name} has no \`${arg === 'modelValue'
        ? 'v-model'
        : `v-model:${arg}`}\`.`,
      suggestion: models.length > 0
        ? `Available: ${models.map(entry => `\`${entry}\``).join(', ')}.`
        : `${component.name} has no v-model.`,
    }, directive.loc.start.offset)
  }
}

function checkEvent(directive: DirectiveNode, component: ComponentApi, context: ReviewContext): void {
  const name = directiveArg(directive)

  if (!name)
    return

  const kebab = toKebab(name)
  const events = withForwarded(component, context).flatMap(entry => entry.events.map(event => event.name))

  if (events.includes(kebab) || events.includes(name) || NATIVE_EVENTS.has(kebab.split('.')[0]))
    return

  const updateMatch = /^update:(.+)$/.exec(kebab)

  if (updateMatch) {
    if (!findProp(component, updateMatch[1], context)) {
      context.report({
        rule: 'unknown-event',
        severity: 'error',
        message: `${component.name} never emits \`${name}\`: it has no \`${toCamel(updateMatch[1])}\` prop.`,
        suggestion: `Events: ${events.map(event => `\`@${event}\``).join(', ') || 'none'}.`,
      }, directive.loc.start.offset)
    }
    return
  }

  const near = closest(kebab, [
    ...events,
    ...NATIVE_EVENTS,
  ], { max: 2, limit: 1 })

  context.report({
    rule: 'unknown-event',
    severity: near.length > 0
      ? 'error'
      : 'warning',
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
function usedSlots(element: ElementNode): Array<{ name: string, offset: number, directive: DirectiveNode }> {
  const templates = element.children.filter((child): child is ElementNode => isElement(child) && child.tag === 'template')

  return [element, ...templates]
    .flatMap(node => node.props.filter(isStaticSlot))
    .map(prop => ({ name: directiveArg(prop) ?? 'default', offset: prop.loc.start.offset, directive: prop }))
}

/** Names destructured from the slot props: `#item="{ item, index: i, active = false, ...rest }"` -> `item`, `index`, `active` */
export function destructuredNames(expression: string): string[] {
  const body = /^\s*\{([\s\S]*)\}\s*$/.exec(expression)?.[1]

  if (!body)
    return []

  const names: string[] = []
  let depth = 0
  let current = ''

  for (const char of `${body},`) {
    if ('{[('.includes(char))
      depth++
    else if ('}])'.includes(char))
      depth--

    if (char === ',' && depth === 0) {
      const name = /^\s*([\w$-]+|'[^']+'|"[^"]+")/.exec(current)?.[1]

      if (name && !current.trim().startsWith('...'))
        names.push(name.replaceAll(/['"]/g, ''))
      current = ''
      continue
    }

    current += char
  }

  return names
}

/** Destructured slot props the slot does not provide: they are `undefined` */
function checkSlotBindings(directive: DirectiveNode, slot: ComponentApi['slots'][number], component: ComponentApi, context: ReviewContext): void {
  const expression = directiveExpression(directive)

  if (!expression || slot.bindings.length === 0)
    return

  const bindings = slot.bindings.map(binding => toCamel(binding.name))

  for (const name of destructuredNames(expression.content)) {
    if (bindings.includes(toCamel(name)))
      continue

    const near = closest(toCamel(name), bindings, { max: 3, limit: 2 })

    context.report({
      rule: 'unknown-slot-binding',
      severity: 'error',
      message: `The \`#${slot.name}\` slot of ${component.name} has no \`${name}\` prop: it is \`undefined\`.`,
      suggestion: `${near.length > 0
        ? `Did you mean ${near.map(entry => `\`${entry}\``).join(' or ')}? `
        : ''}Slot props: ${bindings.map(entry => `\`${entry}\``).join(', ')}.`,
    }, expression.offset)
  }
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

  for (const { name, offset, directive } of usedSlots(element)) {
    const slot = component.slots.find(entry => slotMatches(entry.name, name))

    if (slot) {
      checkSlotBindings(directive, slot, component, context)
      continue
    }

    if (name === 'default' && slots.length === 0)
      continue

    const near = closest(name, slots, { max: 3, limit: 2 })

    context.report({
      rule: 'unknown-slot',
      severity: 'error',
      message: `${component.name} has no \`#${name}\` slot: its content will not be rendered.`,
      suggestion: near.length > 0
        ? `Did you mean ${near.map(entry => `\`#${entry}\``).join(' or ')}?`
        : `Slots: ${slots.map(slot => `\`#${slot}\``).join(', ') || 'none'}.`,
    }, offset)
  }
}

const STYLE_BINDINGS = new Set(['class', 'style', 'key'])

function checkStaticAttribute(attribute: AttributeNode, component: ComponentApi, source: string, context: ReviewContext): void {
  if (STYLE_BINDINGS.has(attribute.name))
    return

  const definition = findProp(component, attribute.name, context)

  if (!definition)
    reportUnknownProp(attribute.name, attribute.loc.start.offset, component, context)
  else if (attribute.value)
    checkPropValue(definition, attribute.value.content, valueOffset(attribute, source), component, context)
}

function checkBoundProp(directive: DirectiveNode, component: ComponentApi, context: ReviewContext): void {
  const name = directiveArg(directive)

  if (!name || STYLE_BINDINGS.has(name))
    return

  const definition = findProp(component, name, context)

  if (!definition) {
    reportUnknownProp(name, directive.loc.start.offset, component, context)
    return
  }

  const expression = directiveExpression(directive)
  const literal = expression?.content.trim()

  if (expression && literal && /^'[^']*'$|^"[^"]*"$/.test(literal) && definition.type !== 'boolean')
    checkPropValue(definition, literal.slice(1, -1), expression.offset, component, context)
}

/** Names given to a component: its props (camelCase) and its models, `undefined` for `v-bind="object"` */
function givenProps(element: ElementNode): Array<string | undefined> {
  return element.props.flatMap((prop) => {
    if (prop.type === NodeTypes.ATTRIBUTE) {
      return [
        toCamel(prop.name),
      ]
    }
    if (prop.name === 'model') {
      return [
        toCamel(directiveArg(prop) ?? 'modelValue'),
      ]
    }
    if (prop.name === 'bind')
      return [directiveArg(prop) && toCamel(directiveArg(prop)!)]

    return []
  })
}

/** A required prop left out: the component renders without its data (`MazSelect` without `options`) */
function checkRequiredProps(element: ElementNode, component: ComponentApi, context: ReviewContext): void {
  const given = givenProps(element)

  if (given.includes(undefined))
    return

  const missing = component.props.filter(prop => prop.required && !given.includes(prop.name))

  if (missing.length === 0)
    return

  const names = missing.map(prop => (prop.model
    ? `\`${prop.model === 'modelValue'
      ? 'v-model'
      : `v-model:${toKebab(prop.model)}`}\``
    : `\`${toKebab(prop.name)}\``))

  context.report({
    rule: 'missing-required-prop',
    severity: 'warning',
    message: `${component.name} requires ${names.join(', ')}.`,
    suggestion: `Pass ${names.join(' and ')}: \`get_component_api({ names: ["${component.name}"] })\` documents ${missing.length > 1
      ? 'them'
      : 'it'}.`,
  }, element.loc.start.offset)
}

const FORM_FIELDS = new Set([
  'MazInput',
  'MazInputNumber',
  'MazInputTags',
  'MazInputAutocomplete',
  'MazTextarea',
  'MazSelect',
  'MazSelectCountry',
  'MazDatePicker',
])
const LABEL_SLOTS = new Set(['label', 'top-label', 'trigger'])
const FIELD_LABELS = new Set([
  'label',
  'topLabel',
  'placeholder',
  'ariaLabel',
  'ariaLabelledby',
  'id',
])

/** A form field without a label, a placeholder nor an `aria-label` has no accessible name */
function checkFieldLabel(element: ElementNode, component: ComponentApi, inLabel: boolean, context: ReviewContext): void {
  const given = givenProps(element)

  if (!FORM_FIELDS.has(component.name) || inLabel || given.includes(undefined) || given.some(name => name && FIELD_LABELS.has(name)))
    return

  // a label slot names the field, a trigger slot or `inline` replaces it
  if (given.includes('inline') || usedSlots(element).some(slot => LABEL_SLOTS.has(slot.name)))
    return

  context.report({
    rule: 'input-label',
    severity: 'warning',
    message: `${component.name} without \`label\`, \`top-label\` nor \`aria-label\`: screen readers announce an unnamed field.`,
    suggestion: 'Add a `label="..."` (or `top-label`), or an `aria-label` when the context already shows the label.',
  }, element.loc.start.offset)
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
  checkRequiredProps(element, component, context)
}

const SVG_SHAPES = new Set([
  'path',
  'circle',
  'rect',
  'polyline',
  'polygon',
  'line',
  'ellipse',
])
const ICON_MAX_VIEWBOX = 32

function descendantsOf(element: ElementNode): ElementNode[] {
  return element.children.filter(isElement).flatMap(child => [
    child,
    ...descendantsOf(child),
  ])
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
  const descendants = descendantsOf(svg)

  if (!descendants.some(child => SVG_SHAPES.has(child.tag)))
    return false

  const viewBox = staticAttribute(svg, 'viewBox')?.value?.content.trim().split(/[\s,]+/).map(Number)

  if (viewBox?.length === 4 && (viewBox[2] > ICON_MAX_VIEWBOX || viewBox[3] > ICON_MAX_VIEWBOX))
    return false

  return ![svg, ...descendants].some(node => isAnimated(node) || (node !== svg && node.props.some(prop => prop.type === NodeTypes.DIRECTIVE)))
}

const LAYOUT_TAGS = new Set([
  'div',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'dl',
  'img',
  'picture',
  'video',
  'canvas',
  'section',
  'article',
  'header',
  'footer',
  'figure',
  'table',
])
const NEUTRAL_COMPONENTS = new Set([
  'Transition',
  'TransitionGroup',
  'KeepAlive',
  'Teleport',
  'Suspense',
  'ClientOnly',
  'NuxtLink',
  'RouterLink',
])

/** Children that render something: no comment, no whitespace-only text */
function contentOf(element: ElementNode): TemplateChildNode[] {
  return element.children.filter(child => child.type !== NodeTypes.COMMENT && !(child.type === NodeTypes.TEXT && child.content.trim() === ''))
}

/** An icon or a decoration next to a label: an icon of @maz-ui/icons, an `*Icon` component, an SVG, a dynamic `<component>`, an empty `<i>` or `<span>` (a dot, a swatch) */
function isIconOrDecoration(element: ElementNode, context: ReviewContext): boolean {
  const pascal = toPascal(element.tag).replace(/^Lazy/, '')

  return element.tag === 'svg'
    || element.tag === 'component'
    || context.knowledge.iconNames.has(pascal)
    || pascal.endsWith('Icon')
    || (['i', 'span'].includes(element.tag) && contentOf(element).length === 0)
}

function isComponentTag(element: ElementNode): boolean {
  return /^[A-Z]/.test(element.tag) || element.tag.includes('-')
}

/**
 * A clickable card rather than a button: its content is a layout that MazBtn does not model (a block,
 * a component such as an avatar or a badge, or several stacked labels: title + subtitle). A text, or an icon
 * and a text, stays a button.
 */
export function isCompositeButton(button: ElementNode, context: ReviewContext): boolean {
  const descendants = descendantsOf(button)

  if (descendants.some(node => LAYOUT_TAGS.has(node.tag)))
    return true

  if (descendants.some(node => isComponentTag(node) && !NEUTRAL_COMPONENTS.has(toPascal(node.tag)) && !isIconOrDecoration(node, context)))
    return true

  return hasStackedLabels(button, context)
}

/** Two labels or more side by side, at any depth (title + subtitle), unless they are formatting inside a sentence (`Score <b>12</b>`) */
function hasStackedLabels(element: ElementNode, context: ReviewContext): boolean {
  const content = contentOf(element)
  const labels = content.filter((child): child is ElementNode => isElement(child) && !isIconOrDecoration(child, context))
  const isSentence = content.some(child => !isElement(child))

  return (labels.length >= 2 && !isSentence) || labels.some(label => hasStackedLabels(label, context))
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

  // An empty button is a hit area or a swatch, a composite one a clickable card: MazBtn fits neither
  if (element.tag === 'button' && (contentOf(element).length === 0 || isCompositeButton(element, context)))
    return

  const replacement = nativeReplacement(element.tag, staticAttribute(element, 'type')?.value?.content)

  if (replacement) {
    context.report({
      rule: 'prefer-maz-component',
      severity: replacement.severity,
      message: `Native \`<${element.tag}>\`${element.tag === 'input'
        ? ` (type "${staticAttribute(element, 'type')?.value?.content ?? 'text'}")`
        : ''}.`,
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

const ICON_PROPS = new Set([
  'icon',
  'start-icon',
  'startIcon',
  'end-icon',
  'endIcon',
])
const LABEL_PROPS = new Set([
  'text',
  'aria-label',
  'ariaLabel',
  'aria-labelledby',
  'ariaLabelledby',
])

/** Name of a static attribute or of a bound prop, `undefined` for `v-bind="object"` */
function propName(prop: ElementNode['props'][number]): string | undefined {
  if (prop.type === NodeTypes.ATTRIBUTE)
    return prop.name

  return prop.name === 'bind'
    ? directiveArg(prop)
    : prop.name
}

/** A MazBtn that only shows an icon has no accessible name without a `text` or an `aria-label` */
function checkIconButtonLabel(element: ElementNode, context: ReviewContext): void {
  const names = element.props.map(propName)

  // `v-bind="attrs"` may pass the label
  if (names.includes(undefined) || !names.some(name => name && ICON_PROPS.has(name)) || names.some(name => name && LABEL_PROPS.has(name)) || contentOf(element).length > 0)
    return

  context.report({
    rule: 'icon-button-label',
    severity: 'warning',
    message: 'Button with only an icon and no accessible name.',
    suggestion: 'Add an `aria-label` describing the action (`aria-label="Delete"`), screen readers announce it.',
  }, element.loc.start.offset)
}

function checkMazTag(element: ElementNode, mazName: string, source: string, context: ReviewContext, ancestry: Ancestry): void {
  const component = context.knowledge.componentsByName.get(mazName)

  if (component) {
    checkMazComponent(element, component, source, context)
    checkFieldLabel(element, component, !!ancestry.label, context)

    if (mazName === 'MazBtn') {
      checkIconButtonLabel(element, context)
      checkButtonNavigation(element, ancestry.link, context)
    }
    return
  }

  if (context.knowledge.iconNames.has(mazName))
    return

  const near = closest(mazName, [
    ...context.knowledge.componentsByName.keys(),
    ...context.knowledge.iconNames,
  ], { max: 3, limit: 3 })

  context.report({
    rule: 'unknown-component',
    severity: 'error',
    message: `\`<${element.tag}>\` is neither a maz-ui component nor a @maz-ui/icons icon.`,
    suggestion: near.length > 0
      ? `Did you mean ${near.map(entry => `\`${entry}\``).join(' or ')}?`
      : 'Use `search_docs` or `find_icons` to find the right name.',
  }, element.loc.start.offset)
}

function hasProp(element: ElementNode, name: string): boolean {
  return element.props.some(prop => prop.type === NodeTypes.ATTRIBUTE
    ? toCamel(prop.name) === name
    : prop.name === 'bind' && directiveArg(prop) !== undefined && toCamel(directiveArg(prop)!) === name)
}

/** A `MazBtn` with the solid primary look: the default color (or `primary`), not outlined nor pastel */
function isSolidPrimaryButton(element: ElementNode): boolean {
  const color = staticAttribute(element, 'color')?.value?.content

  return (color === undefined || color === 'primary')
    && ![
      'color',
      'outlined',
      'pastel',
      'fab',
    ].some(name => (name === 'color'
      ? element.props.some(prop => prop.type === NodeTypes.DIRECTIVE && prop.name === 'bind' && directiveArg(prop) === 'color')
      : hasProp(element, name)))
}

/** A button shown next to its siblings: not the `v-else` of another one, not on its own line (`block`), not `disabled` */
function isSideBySide(element: ElementNode): boolean {
  return !element.props.some(prop => prop.type === NodeTypes.DIRECTIVE && (prop.name === 'else' || prop.name === 'else-if'))
    && !['block', 'disabled'].some(name => staticAttribute(element, name))
}

/** Several solid primary buttons side by side: one main action per group */
function checkActionHierarchy(buttons: ElementNode[], context: ReviewContext): void {
  const solid = buttons.filter(button => isSolidPrimaryButton(button) && isSideBySide(button))

  if (solid.length < 2)
    return

  context.report({
    rule: 'multiple-primary-actions',
    severity: 'info',
    message: `${solid.length} solid primary \`MazBtn\` side by side: the main action does not stand out.`,
    suggestion: 'Keep one solid `color="primary"` button for the main action; make the others `outlined`, `pastel` or `color="contrast" outlined`, and use a `MazLink` for cancel or back.',
  }, solid[1].loc.start.offset)
}

/** A raw icon is an SVG string: used as a tag it renders nothing */
function checkRawIconTag(element: ElementNode, name: string, context: ReviewContext): void {
  context.report({
    rule: 'raw-icon-tag',
    severity: 'error',
    message: `\`${name}\` is imported from \`@maz-ui/icons/raw\` (an SVG string, for \`icon\` props): used as a tag it renders nothing.`,
    suggestion: `In a template, import the component from \`@maz-ui/icons/static/${name}\`, or keep the raw import and pass it to a prop: \`<MazBtn :icon="${name}" />\`.`,
  }, element.loc.start.offset)
}

/** What the parents of an element set: the closest background (for `text-white` on `bg-overlay`), an enclosing link or `<label>` */
interface Ancestry {
  background?: Background
  link?: string
  label?: boolean
}

const LINK_TAGS = new Set([
  'a',
  'RouterLink',
  'NuxtLink',
  'MazLink',
])
const NAVIGATION_CALL = /\b(?:\$?router\.(?:push|replace)|navigateTo)\(|\b(?:window\.)?location(?:\.href)?\s*=[^=]|\bwindow\.open\(/

/** A MazBtn inside a link (nested interactive elements), or navigating from `@click`: `to` and `href` render a real link */
function checkButtonNavigation(element: ElementNode, link: string | undefined, context: ReviewContext): void {
  if (link) {
    context.report({
      rule: 'button-navigation',
      severity: 'warning',
      message: `MazBtn inside \`<${link}>\`: a button in a link is invalid HTML, keyboards and screen readers get two controls.`,
      suggestion: 'Remove the link and give its target to the button: `<MazBtn to="/path">` (RouterLink or NuxtLink) or `<MazBtn href="https://..." target="_blank">`.',
    }, element.loc.start.offset)
    return
  }

  const click = element.props.find((prop): prop is DirectiveNode => prop.type === NodeTypes.DIRECTIVE && prop.name === 'on' && directiveArg(prop) === 'click')
  const handler = click && directiveExpression(click)

  if (handler && NAVIGATION_CALL.test(handler.content)) {
    context.report({
      rule: 'button-navigation',
      severity: 'warning',
      message: 'MazBtn navigating from `@click`: no link to open in a new tab, to copy nor for crawlers.',
      suggestion: 'Use `to` (`<MazBtn to="/path">`, a RouterLink or NuxtLink) or `href` (`<MazBtn href="https://..." target="_blank">`) instead of the click handler.',
    }, handler.offset)
  }
}

function childAncestry(element: ElementNode, name: string, ancestry: Ancestry): Ancestry {
  return {
    background: backgroundOf(staticAttribute(element, 'class')?.value?.content ?? '') ?? ancestry.background,
    link: LINK_TAGS.has(name)
      ? name
      : ancestry.link,
    label: ancestry.label || element.tag === 'label',
  }
}

/** Walks the template with what the parents of the node set */
function walk(node: ElementNode | RootNode, source: string, context: ReviewContext, ancestry: Ancestry = {}): void {
  const buttons: ElementNode[] = []

  for (const child of node.children) {
    if (!isElement(child))
      continue

    const pascal = /[A-Z-]/.test(child.tag)
      ? toPascal(child.tag)
      : undefined
    const mazName = pascal && context.localComponents?.has(pascal)
      ? mazTagName(context.localComponents.get(pascal) ?? '')
      : mazTagName(child.tag)

    if (pascal && context.rawIcons?.has(pascal))
      checkRawIconTag(child, pascal, context)
    else if (mazName)
      checkMazTag(child, mazName, source, context, ancestry)
    else
      checkNativeElement(child, context)

    if (mazName === 'MazBtn')
      buttons.push(child)

    checkClassBindings(child, source, context, ancestry.background)
    walk(child, source, context, childAncestry(child, mazName ?? pascal ?? child.tag, ancestry))
  }

  checkActionHierarchy(buttons, context)
}

export function reviewTemplate(root: ElementNode | RootNode, source: string, context: ReviewContext): void {
  walk(root, source, context)
}
