import type { ComponentApi, PropApi } from '../types'

import { pascalToKebab } from '../utils/strings'

/** Props declared only to type the root element attributes */
const HTML_ATTRIBUTE_PROPS = new Set(['class', 'style'])

function code(value: string): string {
  return value.includes('`') ? `\`\` ${value} \`\`` : `\`${value}\``
}

export function modelDirective(model: string): string {
  return model === 'modelValue' ? 'v-model' : `v-model:${pascalToKebab(model)}`
}

export function renderProp(prop: PropApi): string {
  const details = [code(prop.type)]

  if (prop.required)
    details.push('required')
  if (prop.default !== undefined)
    details.push(`default: ${code(prop.default)}`)
  if (prop.model)
    details.push(code(modelDirective(prop.model)))

  const valuesInType = prop.values?.every(value => prop.type.includes(`'${value}'`) || prop.type.includes(`"${value}"`))
  const values = prop.values?.length && !valuesInType
    ? ` Values: ${prop.values.map(value => code(`'${value}'`)).join(', ')}${prop.strictValues ? '' : ' (non exhaustive)'}.`
    : ''
  const description = prop.description ? ` ${prop.description}${/[.!?]$/.test(prop.description) ? '' : '.'}` : ''

  return `- ${code(pascalToKebab(prop.name))} (${details.join(', ')}):${description}${values}`.replace(/:$/, '')
}

function renderEvents(api: ComponentApi, heading: string): string[] {
  if (api.events.length === 0)
    return []

  return [
    `${heading} Events`,
    '',
    ...api.events.map(event => `- ${code(`@${event.name}`)}${event.payload ? ` (payload: ${code(event.payload)})` : ''}${event.description ? `: ${event.description}` : ''}`),
    '',
  ]
}

function renderBinding(binding: ComponentApi['slots'][number]['bindings'][number]): string {
  return `${code(`${binding.name}${binding.type ? `: ${binding.type}` : ''}`)}${binding.description ? ` (${binding.description})` : ''}`
}

function renderSlots(api: ComponentApi, heading: string): string[] {
  if (api.slots.length === 0)
    return []

  return [
    `${heading} Slots`,
    '',
    ...api.slots.map((slot) => {
      const bindings = slot.bindings.length > 0 ? ` Bindings: ${slot.bindings.map(renderBinding).join(', ')}.` : ''

      return `- ${code(`#${slot.name}`)}${slot.description ? `: ${slot.description}` : ''}${bindings}`
    }),
    '',
  ]
}

function renderExpose(api: ComponentApi, heading: string): string[] {
  if (api.expose.length === 0)
    return []

  return [
    `${heading} Exposed (template ref)`,
    '',
    ...api.expose.map(exposed => `- ${code(exposed.name)}${exposed.description ? `: ${exposed.description}` : ''}`),
    '',
  ]
}

export function renderComponentApi(api: ComponentApi, headingLevel = 2): string {
  const heading = '#'.repeat(headingLevel)
  const sub = '#'.repeat(headingLevel + 1)
  const props = api.props.filter(prop => !HTML_ATTRIBUTE_PROPS.has(prop.name))

  return [
    `${heading} ${api.name} API`,
    '',
    code(api.import),
    '',
    ...(api.description ? [api.description, ''] : []),
    `${sub} Props`,
    '',
    ...(props.length > 0 ? props.map(renderProp) : ['No props.']),
    '',
    ...renderEvents(api, sub),
    ...renderSlots(api, sub),
    ...renderExpose(api, sub),
  ].join('\n').trimEnd()
}
