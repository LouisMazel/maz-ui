# MazFormGenerator

## Table of Contents

- [MazFormGenerator](#mazformgenerator)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Useful Types](#useful-types)
  - [MazFormGenerator Component](#mazformgenerator-component)
    - [Props](#props)
    - [Emitted Events](#emitted-events)
    - [Slots](#slots)
    - [Provide/Inject](#provideinject)
      - [Injectable Data](#injectable-data)
  - [Usage Example](#usage-example)
  - [Form Payload Management](#form-payload-management)
  - [Schema Options](#schema-options)
  - [Using Custom Components](#using-custom-components)
    - [Just display custom content between sections](#just-display-custom-content-between-sections)
    - [Using Form Field Into Your Custom Component](#using-form-field-into-your-custom-component)

## Overview

The MazFormGenerator component is a versatile tool designed to dynamically generate forms based on a provided schema of data. It seamlessly integrates pre-defined components from this library (`maz-ui/components/*`) and allows for the inclusion of custom components.

## Useful Types

The component relies on several types to define form fields and sections:

- `FormSection`: Defines a section of the form, which may contain multiple fields or a custom component.
- `FormFieldBase`: Base interface for defining form fields (useful for custom components).
- `FormFieldInput`: Defines an input form field.
- `FormFieldSelect`: Defines a select form field.
- `FormFieldCheckbox`: Defines a checkbox form field.
- `FormFieldValue`: Represents the possible values of a form field.

## MazFormGenerator Component

The MazFormGenerator component itself encapsulates the logic for rendering the dynamic form based on the provided schema.

### Props

- `sections`: An array of `FormSection` objects defining the structure of the form.
- `submit-button` (optional): Configuration for the submit button. By default, the CTA has a primary variation and has the text "Submit".
- `content-class` (optional): CSS class for styling each section of the form content.
- `content-style` (optional): Inline style object for styling each section of the form content.
- `validation-options` (optional): Configuration for form validation used by `useFormValidation` composable, [see here](./../../../../../composables/useFormValidator/README.md#options)
  - `mode`: Mode de validation: `'eager', 'lazy', 'aggressive', 'blur'` (@default `lazy`)
  - `throttledFields`: Champs à valider avec throttling
  - `debouncedFields`: Champs à valider avec debouncing
  - `scrollToErrorSelector`: Sélecteur CSS pour le défilement vers les erreurs `@default '.has-input-error'`

### Emitted Events

- `update:model-value`: Emitted when the form is submitted with valid data. You can listen to this event in the parent component to handle form submission logic.
- `submit`: Emitted when the form is submitted with valid data.

### Slots

The MazFormGenerator component provides the following slots for customization:

- **submit-button**: Allows customization of the submit button. You can define your own button component or customize the existing one.
- **submit-button-text**: Allows customization of the submit button text.
- **append-section**: Allows appending custom content to the end of the form. You can include additional information or CTAs here.

### Provide/Inject

The MazFormGenerator component follows the Provide/Inject pattern to manage form data across its components. It provides the following injected data:

#### Injectable Data

- `values`: A reactive reference to the form data.
- `isValid`: A computed property that checks if the form is valid.

## Usage Example

Below is an example of how to use the `<MazFormGenerator />` component:

```vue
<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { FormSection } from 'maz-ui'

const sections: FormSection[] = [
  {
    id: 'section1',
    wrapper: true,
    fields: [
      {
        id: 'field1',
        name: 'field1',
        componentName: 'AdsInput',
      },
      {
        id: 'field2',
        name: 'field2',
        componentName: 'AdsSelect',
        props: {
          options: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
          ],
        },
      },
    ],
  },
  {
    id: 'section2',
    wrapper: true,
    fields: [
      {
        id: 'field3',
        name: 'field3',
        componentName: 'AdsInput',
      },
      {
        id: 'field4',
        name: 'field4',
        componentName: 'AdsCheckbox',
        props: {
          selectedValue: 'selected',
          label: 'Checkbox',
        },
      },
    ],
  },
]

const formPayload = ref<Record<string, string>>()
</script>

<template>
  <FormGenerator v-model="formPayload" :sections="sections" />
</template>
```

## Form Payload Management

The `formPayload` serves as the central data store for the form. It reflects the current state of the form and is automatically updated as users interact with it. The `v-model` directive binds this payload to the MazFormGenerator component, ensuring synchronization between the form and its parent component.

## Schema Options

The schema defines the structure and behavior of the form. Each section consists of one or more fields, which can be either pre-defined or custom components. Here are the available options for defining form fields:

- **Input Field**: Accepts text input from users.
- **Select Field**: Presents a dropdown menu for selecting options.
- **Checkbox Field**: Allows users to select one or more options from a list.
- **Custom Component**: Integrates custom Vue components seamlessly into the form.
- More fields in coming...

## Using Custom Components

The FormGenerator component supports the integration of custom components to enhance form functionality or just display custom content between sections.

By defining custom components and registering them into the schema, you can seamlessly include them in your forms.

### Just display custom content between sections

Suppose you want to display custom content between sections without any form fields. In that case, you can directly include the custom component in the schema as shown below:

Directory structure:

```bash
components/
  CustomComponent.vue
```

1. Create a custom component file (e.g., `CustomComponent.vue`)

```vue
<template>
  <div>
    <h2>Custom Content</h2>
    <p>This is a custom content.</p>
  </div>
</template>
```

2. Register the custom component in the schema (e.g., `CustomComponent.vue`)

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import type { FormSection } from 'maz-ui/types'
import MazFormGenerator from 'maz-ui/components/MazFormGenerator'
import CustomComponent from '@/components/CustomComponent.vue'

const sections: FormSection[] = [
  {
    id: 'section1',
    fields: [
      {
        id: 'field1',
        name: 'field1',
        componentName: 'AdsInput',
      },
    ],
  },
  {
    id: 'section2',
    component: CustomComponent, // Include your custom component
  },
  {
    id: 'section3',
    fields: [
      {
        id: 'field2',
        name: 'field2',
        componentName: 'AdsSelect',
        props: {
          options: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
          ],
        },
      },
    ],
  },
]
</script>

<template>
  <div>
    <h1>
      My Form
    </h1>
    <MazFormGenerator :sections="sections" />
  </div>
</template>
```

### Using Form Field Into Your Custom Component

To use a form field in your custom component, you can inject the form data and update the field value as needed. Here's an example of how to integrate a custom component with the form data:

```vue
<script lang="ts" setup>
import { useFormField } from 'maz-ui'

const { value } = useFormField('customField')
</script>

<template>
  <div>
    <MazInput v-model="value" />
  </div>
</template>
```
