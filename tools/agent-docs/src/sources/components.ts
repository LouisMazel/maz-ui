import type { ComponentMeta, EventMeta, ExposeMeta, PropertyMeta, SlotMeta } from 'vue-component-meta'
import type { ComponentDoc } from 'vue-docgen-api'
import type { ComponentApi, EventApi, PropApi, SlotApi } from '../types'

import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createChecker } from 'vue-component-meta'
import { parseMulti } from 'vue-docgen-api'
import { normalizeDashes } from '../markdown/clean'
import { pascalToKebab } from '../utils/strings'

const MAX_TYPE_LENGTH = 240

function oneLine(value: string): string {
  return normalizeDashes(value.replaceAll(/\s+/g, ' ').trim())
}

function tag(tags: Array<{ name: string, text?: string }>, name: string): string | undefined {
  const text = tags.find(entry => entry.name === name)?.text?.trim()

  return text || undefined
}

/** Removes `undefined` from optional types: `string | undefined` -> `string` */
export function cleanType(type: string): string {
  const cleaned = unionMembers(oneLine(type))
    .filter(member => member !== 'undefined')
    .join(' | ')

  return cleaned.length > MAX_TYPE_LENGTH ? `${cleaned.slice(0, MAX_TYPE_LENGTH - 3)}...` : cleaned
}

/** Splits a union type on its top level `|` */
export function unionMembers(type: string): string[] {
  const members: string[] = []
  let depth = 0
  let quote = ''
  let current = ''

  for (const [index, char] of [...type].entries()) {
    if (quote) {
      if (char === quote)
        quote = ''
    }
    else if (char === '"' || char === '\'') {
      quote = char
    }
    else if ('{(<['.includes(char)) {
      depth++
    }
    else if ('})>]'.includes(char) && !(char === '>' && type[index - 1] === '=')) {
      depth--
    }
    else if (char === '|' && depth === 0) {
      members.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  members.push(current.trim())

  return members.filter(Boolean)
}

/**
 * Accepted values of a prop. They are strict when the TypeScript type is a
 * union of string literals only; a `@values` tag documents the values of
 * open types (`MazSize | MazSizeUnit`).
 */
export function propValues(type: string, valuesTag: string | undefined): { values?: string[], strict: boolean } {
  const members = unionMembers(type).filter(member => member !== 'undefined' && member !== 'null')
  const literals = members.filter(member => /^"[^"]*"$/.test(member)).map(member => member.slice(1, -1))

  if (literals.length > 1 && literals.length === members.length)
    return { values: literals, strict: true }

  const fromTag = valuesTag
    ? [...valuesTag.matchAll(/['"`]?([\w.-]+)['"`]?/g)].map(match => match[1]).filter(value => !/^(?:or|a|an|any|like|unit|css|and)$/i.test(value))
    : []
  const values = [...new Set([...literals, ...fromTag])]

  return values.length > 0 ? { values, strict: false } : { strict: false }
}

function normalizeDefault(value: string | undefined): string | undefined {
  if (value === undefined)
    return undefined

  const cleaned = oneLine(value)

  return cleaned === 'undefined' ? undefined : cleaned
}

export function toPropApi(prop: PropertyMeta, models: Set<string>): PropApi {
  const type = cleanType(prop.type)
  const { values, strict } = propValues(type, tag(prop.tags, 'values'))
  const description = [prop.description || tag(prop.tags, 'model'), tag(prop.tags, 'description')].filter(Boolean).map(text => oneLine(text as string)).join(' - ')
  const defaultValue = normalizeDefault(prop.default) ?? normalizeDefault(tag(prop.tags, 'default'))

  return {
    name: prop.name,
    type,
    ...(description ? { description } : {}),
    required: prop.required,
    ...(defaultValue === undefined ? {} : { default: defaultValue }),
    ...(values ? { values } : {}),
    strictValues: strict,
    ...(models.has(prop.name) ? { model: prop.name } : {}),
  }
}

export function toEventApi(event: EventMeta): EventApi {
  const payload = cleanType(event.type).replace(/^\[|\]$/g, '')
  const description = (event as EventMeta & { description?: string }).description

  return {
    name: event.name,
    ...(description ? { description: oneLine(description) } : {}),
    ...(payload ? { payload } : {}),
  }
}

/** Splits the bindings of a slot type `{ close: () => void; isOpen: boolean; }` */
export function slotBindings(type: string): Array<{ name: string, type: string }> {
  const body = /^\{([\s\S]*)\}$/.exec(oneLine(type))?.[1]

  if (!body?.trim())
    return []

  const bindings: Array<{ name: string, type: string }> = []
  let depth = 0
  let current = ''

  const source = `${body};`

  for (const [index, char] of [...source].entries()) {
    if ('{(<['.includes(char))
      depth++
    else if ('})>]'.includes(char) && !(char === '>' && source[index - 1] === '='))
      depth--

    if (char === ';' && depth === 0) {
      const match = /^\s*([\w$-]+)\??\s*:\s*([\s\S]+)$/.exec(current)

      if (match)
        bindings.push({ name: match[1], type: cleanType(match[2]) })
      current = ''
      continue
    }

    current += char
  }

  return bindings
}

export function toSlotApi(slot: SlotMeta): SlotApi {
  return {
    name: slot.name,
    ...(slot.description ? { description: oneLine(slot.description) } : {}),
    bindings: slotBindings(slot.type),
  }
}

function toExposeApi(exposed: ExposeMeta): { name: string, description?: string } {
  return {
    name: exposed.name,
    ...(exposed.description ? { description: oneLine(exposed.description) } : {}),
  }
}

export function toComponentApi(meta: ComponentMeta, name: string): ComponentApi {
  const models = new Set(
    meta.events
      .map(event => /^update:(.+)$/.exec(event.name)?.[1])
      .filter((model): model is string => !!model)
      .map(model => model.replaceAll(/-([a-z\d])/g, (_, char: string) => char.toUpperCase())),
  )
  const props = meta.props.filter(prop => !prop.global)
  const propNames = new Set(props.map(prop => prop.name))

  return {
    name,
    docId: `components/${pascalToKebab(name)}`,
    import: `import ${name} from 'maz-ui/components/${name}'`,
    props: props.map(prop => toPropApi(prop, new Set([...models].filter(model => propNames.has(model))))),
    events: meta.events.map(toEventApi),
    slots: meta.slots.map(toSlotApi),
    expose: meta.exposed.filter(exposed => !exposed.name.startsWith('$') && !propNames.has(exposed.name)).map(toExposeApi),
  }
}

/** Descriptions found by vue-docgen-api in the JSDoc of emits, slots and expose, which vue-component-meta does not read */
export interface DocgenDescriptions {
  props: Map<string, string>
  events: Map<string, string>
  slots: Map<string, { description?: string, bindings: Map<string, string> }>
  expose: Map<string, string>
}

export function docgenDescriptions(doc: ComponentDoc | undefined): DocgenDescriptions {
  const text = (value: unknown): string | undefined => (typeof value === 'string' && value.trim() ? oneLine(value) : undefined)

  return {
    props: new Map((doc?.props ?? []).flatMap(prop => (text(prop.description) ? [[prop.name, text(prop.description) as string]] : []))),
    events: new Map((doc?.events ?? []).flatMap(event => (text(event.description) ? [[event.name, text(event.description) as string]] : []))),
    slots: new Map((doc?.slots ?? []).map(slot => [slot.name, {
      description: text(slot.description),
      bindings: new Map((slot.bindings ?? []).flatMap(binding => (binding.name && text(binding.description) ? [[binding.name, text(binding.description) as string]] : []))),
    }])),
    expose: new Map((doc?.expose ?? []).flatMap(exposed => (text(exposed.description) ? [[exposed.name, text(exposed.description) as string]] : []))),
  }
}

/** Fills the descriptions missing from vue-component-meta with the ones of vue-docgen-api */
export function mergeDescriptions(api: ComponentApi, descriptions: DocgenDescriptions): ComponentApi {
  const camel = (name: string): string => name.replaceAll(/-([a-z\d])/g, (_, char: string) => char.toUpperCase())

  return {
    ...api,
    props: api.props.map(prop => (prop.description || !descriptions.props.get(prop.name) ? prop : { ...prop, description: descriptions.props.get(prop.name) })),
    events: api.events.map(event => (event.description || !descriptions.events.get(event.name) ? event : { ...event, description: descriptions.events.get(event.name) })),
    slots: api.slots.map((slot) => {
      const docgen = descriptions.slots.get(slot.name)

      return {
        ...slot,
        ...(slot.description || !docgen?.description ? {} : { description: docgen.description }),
        bindings: slot.bindings.map((binding) => {
          const description = binding.description ?? docgen?.bindings.get(binding.name) ?? docgen?.bindings.get(binding.name.replaceAll(/[A-Z]/g, char => `-${char.toLowerCase()}`)) ?? [...(docgen?.bindings.entries() ?? [])].find(([name]) => camel(name) === binding.name)?.[1]

          return description ? { ...binding, description } : binding
        }),
      }
    }),
    expose: api.expose.map(exposed => (exposed.description || !descriptions.expose.get(exposed.name) ? exposed : { ...exposed, description: descriptions.expose.get(exposed.name) })),
  }
}

/** vue-docgen-api only completes the descriptions: a component it cannot parse keeps the vue-component-meta data */
export async function parseDocgen(path: string): Promise<ComponentDoc | undefined> {
  try {
    const [doc] = await parseMulti(path)

    return doc
  }
  catch {
    return undefined
  }
}

export function collectComponentApis(componentsDir: string, tsconfig: string): Promise<ComponentApi[]> {
  const checker = createChecker(tsconfig, { schema: false, printer: { newLine: 1 } })
  const files = readdirSync(componentsDir)
    .filter(file => /^[A-Z]\w*\.vue$/.test(file))
    .sort()

  return Promise.all(files.map(async (file) => {
    const path = join(componentsDir, file)
    const doc = await parseDocgen(path)
    const api = toComponentApi(checker.getComponentMeta(path), file.replace(/\.vue$/, ''))

    return mergeDescriptions(api, docgenDescriptions(doc))
  }))
}
