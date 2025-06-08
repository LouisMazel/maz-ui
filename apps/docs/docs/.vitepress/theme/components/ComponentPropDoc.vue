<script lang="ts" setup>
/* eslint-disable sonarjs/no-nested-conditional */
import { onBeforeMount, ref, watch } from 'vue'

const { component, componentInstance, methods } = defineProps<{
  component: string
  componentInstance?: object
  methods?: string[]
}>()

const camelToSnakeCase = (str: string): string => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

const options = ref()
const events = ref()
const componentMethods = ref()

function getValidatorValues(validator: string) {
  const firstPart = String(validator)?.split('[')[1]
  const secondePart = firstPart?.split(']')[0]

  const array = secondePart ? secondePart.replaceAll('"', '').split(',') : secondePart

  return array ?? '-'
}

const getComponent = async () => (await import(`maz-ui/src/components/${component}.vue`))

async function getEvents() {
  const component = await getComponent()

  if (component?.emits) {
    events.value = component.emits
  }
}

async function getOptions() {
  const component = await getComponent()

  const componentProps = component?.props as Record<string, Record<string, any>> | undefined

  if (componentProps) {
    options.value = Object.entries(componentProps).map((prop) => {
      return {
        name: camelToSnakeCase(prop[0]),
        type: Array.isArray(prop[1].type) ? prop[1].type.map(type => type.name).join('|') : prop[1].type?.name ?? '-',
        defaultValue: (typeof prop[1].default === 'boolean'
          ? prop[1].default
          : typeof prop[1].default === 'function'
            ? prop[1].default()
            : prop[1].default?.name ?? prop[1].default) ?? '-',
        required: prop[1].required ? 'true' : 'false',
        values: getValidatorValues(prop[1].validator),
      }
    })
  }
}

function setMethods() {
  componentMethods.value = methods?.length
    ? methods
    : componentInstance
      ? Object.values(componentInstance).filter(value => typeof value === 'function')
      : undefined
}

watch(
  () => componentInstance,
  () => setMethods(),
  { immediate: true },
)

onBeforeMount(async () => {
  await getOptions()
  await getEvents()
})
</script>

<template>
  <table v-if="options" class="component-prop-doc" style="display: table;">
    <thead>
      <tr>
        <th>
          Prop
        </th>
        <th>
          Type
        </th>
        <th>
          Required
        </th>
        <th>
          Default
        </th>
        <th>
          Possible Value
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="({ name, type, defaultValue, required, values }, i) in options" :key="i">
        <td style="white-space: nowrap;">
          {{ name }}
        </td>
        <td>
          <code>
            {{ type }}
          </code>
        </td>
        <td>
          <code>
            {{ required }}
          </code>
        </td>
        <td>
          <code>
            {{ defaultValue }}
          </code>
        </td>
        <td>
          <div v-if="Array.isArray(values)" class="flex gap-05 flex-wrap">
            <code v-for="value in values" :key="value">
              {{ value }}
            </code>
          </div>
          <span v-else>
            -
          </span>
        </td>
      </tr>
    </tbody>
  </table>
  <span v-else>
    <br>
    No props for this component
  </span>
  <div class="flex items-start" style="gap: 2rem;">
    <table v-if="events" class="component-prop-doc" style="display: table;">
      <thead>
        <tr>
          <th>
            Events
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(event, i) in events" :key="i">
          <td style="white-space: nowrap;">
            {{ event }}
          </td>
        </tr>
      </tbody>
    </table>
    <table v-if="componentMethods" class="component-prop-doc" style="display: table;">
      <thead>
        <tr>
          <th>
            Methods
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(method, i) in componentMethods" :key="i">
          <td style="white-space: nowrap;">
            {{ method.name }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
