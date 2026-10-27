import type { ComponentApi, OutputFile } from '../types'

import { pascalToKebab } from '../utils/strings'
import { modelDirective } from './api'

const HTML_ATTRIBUTE_PROPS = new Set(['class', 'style'])

function cell(value: string | undefined): string {
  return (value ?? '').replaceAll('|', String.raw`\|`).replaceAll(/\s*\n\s*/g, ' ').trim()
}

function code(value: string): string {
  return `\`${cell(value)}\``
}

function table(headers: string[], rows: string[][]): string {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.join(' | ')} |`),
  ].join('\n')
}

/**
 * API tables included at the bottom of the component pages of maz-ui.com
 * (`.vitepress/generated-docs/<component>.doc.md`).
 */
export function renderVitepressApi(api: ComponentApi): string {
  const sections: string[] = []
  const props = api.props.filter(prop => !HTML_ATTRIBUTE_PROPS.has(prop.name))

  if (props.length > 0) {
    sections.push(`## Props\n\n${table(
      ['Name', 'Description', 'Type', 'Required', 'Default', 'Possible values'],
      props.map(prop => [
        `**${pascalToKebab(prop.name)}**`,
        cell(`${prop.model ? `\`${modelDirective(prop.model)}\` ` : ''}${prop.description ?? ''}`),
        code(prop.type),
        prop.required ? 'Yes' : 'No',
        prop.default === undefined ? '-' : code(prop.default),
        prop.values?.length ? code(prop.values.map(value => `'${value}'`).join(' | ')) : '-',
      ]),
    )}`)
  }

  if (api.events.length > 0) {
    sections.push(`## Events\n\n${table(
      ['Event name', 'Payload', 'Description'],
      api.events.map(event => [cell(event.name), event.payload ? code(event.payload) : '-', cell(event.description)]),
    )}`)
  }

  if (api.slots.length > 0) {
    sections.push(`## Slots\n\n${table(
      ['Name', 'Description', 'Bindings'],
      api.slots.map(slot => [
        cell(slot.name),
        cell(slot.description),
        slot.bindings.map(binding => `**${cell(binding.name)}** ${code(binding.type ?? 'unknown')}${binding.description ? ` - ${cell(binding.description)}` : ''}`).join('<br/>') || '-',
      ]),
    )}`)
  }

  if (api.expose.length > 0) {
    sections.push(`## Expose\n\n${api.expose.map(exposed => `### ${exposed.name}\n\n${exposed.description ? `> ${cell(exposed.description)}` : ''}`.trim()).join('\n\n')}`)
  }

  return `${sections.join('\n\n')}\n`
}

export function renderVitepressApis(components: ComponentApi[]): OutputFile[] {
  return components.map(api => ({
    path: `${pascalToKebab(api.name)}.doc.md`,
    content: renderVitepressApi(api),
  }))
}
