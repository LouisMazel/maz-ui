<script lang="ts" setup>
import type { MazTimelineProps } from 'maz-ui/components'
import type { MazGalleryImage } from 'maz-ui/components/MazGallery'
import { MazCog } from '@maz-ui/icons/lazy/MazCog'
import { MazHome } from '@maz-ui/icons/lazy/MazHome'
import { MazUser } from '@maz-ui/icons/lazy/MazUser'
import { ref } from 'vue'

const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive', 'contrast'] as const
const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const roundedSizes = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const

const switchValue = ref(true)
const switchOff = ref(false)
const checkboxValue = ref(true)
const checkboxOff = ref(false)
const radioValue = ref('option1')
const sliderValue = ref(50)
const inputValue = ref('Hello World')
const textareaValue = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
const numberValue = ref(42)
const priceValue = ref(99.99)
const tagsValue = ref(['Vue', 'TypeScript', 'Maz UI'])
const selectValue = ref('option1')
const codeValue = ref('1234')
const tabValue = ref(1)
const stepperValue = ref(2)
const paginationValue = ref(3)
const phoneValue = ref('+33612345678')
const accordionValue = ref(1)
const dateValue = ref('2026-03-20')
const expandOpen = ref(true)
const btnGroupValue = ref('center')
const radioBtnValue = ref('b')
const checklistValue = ref(['vue'])
const dialogOpen = ref(false)
const bottomSheetOpen = ref(false)
const drawerOpen = ref(false)

const selectOptions = [
  { label: 'Vue.js', value: 'option1' },
  { label: 'React', value: 'option2' },
  { label: 'Angular', value: 'option3' },
  { label: 'Svelte', value: 'option4' },
]

const radioOptions = [
  { label: 'Small', value: 'a' },
  { label: 'Medium', value: 'b' },
  { label: 'Large', value: 'c' },
]

const btnGroupItems = [
  { text: 'Left', value: 'left' },
  { text: 'Center', value: 'center', active: true },
  { text: 'Right', value: 'right' },
]

const tableHeaders = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Role', key: 'role' },
  { label: 'Status', key: 'status' },
]
const tableRows = [
  { name: 'Alice Martin', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { name: 'David Lee', email: 'david@example.com', role: 'Admin', status: 'Active' },
]

const timelineSteps: MazTimelineProps['steps'] = [
  { title: 'Order placed', subtitle: 'March 15, 2026 at 10:30 AM', state: 'completed' },
  { title: 'Payment confirmed', subtitle: 'March 15, 2026 at 10:32 AM', state: 'completed' },
  { title: 'Shipped', subtitle: 'March 16, 2026 at 2:15 PM', state: 'active' },
  { title: 'Out for delivery', subtitle: 'Expected March 18', state: 'pending' },
  { title: 'Delivered', subtitle: 'Awaiting delivery', state: 'pending' },
]

const timelineStepsStates: MazTimelineProps['steps'] = [
  { title: 'Completed', subtitle: 'All good', state: 'completed' },
  { title: 'Active', subtitle: 'In progress', state: 'active' },
  { title: 'Error', subtitle: 'Something went wrong', state: 'error' },
  { title: 'Warning', subtitle: 'Needs attention', state: 'warning' },
  { title: 'Pending', subtitle: 'Not started yet', state: 'pending' },
]

const stepperSteps = [
  { title: 'Account', subtitle: 'Create your account', titleInfo: 'Step 1 of 3' },
  { title: 'Profile', subtitle: 'Set up your profile', titleInfo: 'Step 2 of 3' },
  { title: 'Confirm', subtitle: 'Review and confirm', titleInfo: 'Step 3 of 3' },
]

function makePlaceholder(color: string, label: string): string {
  // eslint-disable-next-line sonarjs/no-nested-template-literals
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect fill="${color}" width="800" height="600"/><text x="400" y="300" text-anchor="middle" dominant-baseline="central" font-family="system-ui" font-size="32" fill="white">${label}</text></svg>`)}`
}

const galleryImages = [
  { src: makePlaceholder('#6366f1', 'Image 1'), alt: 'Placeholder 1' },
  { src: makePlaceholder('#8b5cf6', 'Image 2'), alt: 'Placeholder 2' },
  { src: makePlaceholder('#0ea5e9', 'Image 3'), alt: 'Placeholder 3' },
  { src: makePlaceholder('#10b981', 'Image 4'), alt: 'Placeholder 4' },
  { src: makePlaceholder('#f59e0b', 'Image 5'), alt: 'Placeholder 5' },
] satisfies MazGalleryImage[]

const avatarPlaceholder = makePlaceholder('#6366f1', 'JD')

const checklistItems = [
  { label: 'Vue.js', value: 'vue' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'TailwindCSS', value: 'tw' },
  { label: 'Vite', value: 'vite' },
  { label: 'Vitest', value: 'vitest' },
]
</script>

<template>
  <div class="maz:flex maz:flex-col maz:gap-16">
    <!-- ==================== MazBtn ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazBtn
      </h2>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Colors
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mb-4">
        <MazBtn v-for="c in colors" :key="c" :color="c">
          {{ c }}
        </MazBtn>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Sizes
      </h3>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-2 maz:mb-4">
        <MazBtn v-for="s in sizes" :key="s" :size="s">
          {{ s }}
        </MazBtn>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Outlined
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mb-4">
        <MazBtn v-for="c in colors" :key="c" :color="c" outlined>
          {{ c }}
        </MazBtn>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Pastel
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mb-4">
        <MazBtn v-for="c in colors" :key="c" :color="c" pastel>
          {{ c }}
        </MazBtn>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Fab
      </h3>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-2 maz:mb-4">
        <MazBtn v-for="s in sizes" :key="s" :size="s" fab>
          +
        </MazBtn>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Rounded sizes
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mb-4">
        <MazBtn v-for="r in roundedSizes" :key="r" :rounded-size="r">
          {{ r }}
        </MazBtn>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        States
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mb-4">
        <MazBtn loading>
          Loading
        </MazBtn>
        <MazBtn disabled>
          Disabled
        </MazBtn>
        <MazBtn block>
          Block (full width)
        </MazBtn>
      </div>
    </section>

    <!-- ==================== MazBtnGroup ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazBtnGroup
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-3 maz:mb-4">
        <MazBtnGroup v-model="btnGroupValue" :items="btnGroupItems" />
        <MazBtnGroup v-model="btnGroupValue" :items="btnGroupItems" orientation="col" />
        <MazBtnGroup v-model="btnGroupValue" :items="btnGroupItems" outlined />
        <MazBtnGroup v-model="btnGroupValue" :items="btnGroupItems" pastel />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Colors
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-2 maz:mb-4">
        <MazBtnGroup v-for="c in colors" :key="c" v-model="btnGroupValue" :items="btnGroupItems" :color="c" />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Sizes
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-2 maz:mb-4">
        <MazBtnGroup v-for="s in sizes" :key="s" v-model="btnGroupValue" :items="btnGroupItems" :size="s" />
      </div>
    </section>

    <!-- ==================== MazInput ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazInput
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4 maz:mb-4">
        <MazInput v-model="inputValue" label="Default input" />
        <MazInput v-model="inputValue" label="With placeholder" placeholder="Enter text..." />
        <MazInput v-model="inputValue" label="Default" top-label="Top label" />
        <MazInput v-model="inputValue" label="Assistive text" assistive-text="This is a helper message" />
        <MazInput v-model="inputValue" label="Error state" error assistive-text="This field is required" />
        <MazInput v-model="inputValue" label="Success state" success />
        <MazInput v-model="inputValue" label="Warning state" warning />
        <MazInput v-model="inputValue" label="Disabled" disabled />
        <MazInput v-model="inputValue" label="Loading" loading />
        <MazInput v-model="inputValue" label="Block (full width)" block />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Colors with top-label
      </h3>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4 maz:mb-4">
        <MazInput v-for="c in colors" :key="c" v-model="inputValue" :top-label="c" :color="c" />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Sizes
      </h3>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4 maz:mb-4">
        <MazInput v-for="s in sizes" :key="s" v-model="inputValue" :label="s" :size="s" />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Rounded sizes
      </h3>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4 maz:mb-4">
        <MazInput v-for="r in roundedSizes" :key="r" v-model="inputValue" :label="r" :rounded-size="r" />
      </div>
    </section>

    <!-- ==================== MazTextarea ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazTextarea
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazTextarea v-model="textareaValue" label="Default textarea" />
        <MazTextarea v-model="textareaValue" label="Error" error />
        <MazTextarea v-model="textareaValue" label="Success" success />
        <MazTextarea v-model="textareaValue" label="Disabled" disabled />
      </div>
    </section>

    <!-- ==================== MazInputNumber ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazInputNumber
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazInputNumber v-model="numberValue" label="Default" />
        <MazInputNumber v-model="numberValue" label="Min/Max" :min="0" :max="100" />
        <MazInputNumber v-model="numberValue" label="Step 5" :step="5" />
        <MazInputNumber v-model="numberValue" label="Disabled" disabled />
      </div>
    </section>

    <!-- ==================== MazInputPrice ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazInputPrice
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazInputPrice v-model="priceValue" label="Price (EUR)" currency="EUR" locale="fr-FR" />
        <MazInputPrice v-model="priceValue" label="Price (USD)" currency="USD" locale="en-US" />
        <MazInputPrice v-model="priceValue" label="Price (GBP)" currency="GBP" locale="en-GB" />
      </div>
    </section>

    <!-- ==================== MazInputTags ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazInputTags
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazInputTags v-model="tagsValue" label="Tags" />
        <MazInputTags v-model="tagsValue" label="Error" error />
        <MazInputTags v-model="tagsValue" label="Success" success />
        <MazInputTags v-model="tagsValue" label="Disabled" disabled />
      </div>
    </section>

    <!-- ==================== MazInputCode ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazInputCode
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-4">
        <MazInputCode v-model="codeValue" :code-length="4" size="sm" />
        <MazInputCode v-model="codeValue" :code-length="6" />
      </div>
    </section>

    <!-- ==================== MazInputPhoneNumber ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazInputPhoneNumber
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazInputPhoneNumber label="Phone number" />
        <MazInputPhoneNumber v-model="phoneValue" label="Phone number" />
        <MazInputPhoneNumber v-model="phoneValue" label="Error" error />
      </div>
    </section>

    <!-- ==================== MazSelect ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSelect
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4 maz:mb-4">
        <MazSelect v-model="selectValue" :options="selectOptions" label="Default" />
        <MazSelect v-model="selectValue" :options="selectOptions" label="Search" search />
        <MazSelect v-model="selectValue" :options="selectOptions" label="Error" error />
        <MazSelect v-model="selectValue" :options="selectOptions" label="Success" success />
        <MazSelect v-model="selectValue" :options="selectOptions" label="Disabled" disabled />
        <MazSelect v-model="selectValue" :options="selectOptions" label="Block" block :open="true" />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Colors
      </h3>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4">
        <MazSelect v-for="c in colors" :key="c" v-model="selectValue" :options="selectOptions" :label="c" :color="c" />
      </div>
    </section>

    <!-- ==================== MazSelectCountry ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSelectCountry
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazSelectCountry label="Select country" />
        <MazSelectCountry label="With search" search :open="true" />
      </div>
    </section>

    <!-- ==================== MazDatePicker ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4 maz:mt-20">
        MazDatePicker
      </h2>
      <MazDatePicker v-model="dateValue" label="Date picker" :open="true" picker-position="top" />

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2 maz:mt-4">
        Inline
      </h3>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazDatePicker v-model="dateValue" label="Inline" inline />
      </div>
    </section>

    <!-- ==================== MazSwitch ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSwitch
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-6 maz:mb-4">
        <MazSwitch v-model="switchValue">
          Active
        </MazSwitch>
        <MazSwitch v-model="switchOff">
          Inactive
        </MazSwitch>
        <MazSwitch v-model="switchValue" disabled>
          Disabled
        </MazSwitch>
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Colors
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-6 maz:mb-4">
        <MazSwitch v-for="c in colors" :key="c" v-model="switchValue" :color="c">
          {{ c }}
        </MazSwitch>
      </div>
    </section>

    <!-- ==================== MazCheckbox ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazCheckbox
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-6 maz:mb-4">
        <MazCheckbox v-model="checkboxValue">
          Checked
        </MazCheckbox>
        <MazCheckbox v-model="checkboxOff">
          Unchecked
        </MazCheckbox>
        <MazCheckbox v-model="checkboxValue" disabled>
          Disabled
        </MazCheckbox>
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Colors
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-6 maz:mb-4">
        <MazCheckbox v-for="c in colors" :key="c" v-model="checkboxValue" :color="c">
          {{ c }}
        </MazCheckbox>
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Sizes
      </h3>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
        <MazCheckbox v-for="s in sizes" :key="s" v-model="checkboxValue" :size="s">
          {{ s }}
        </MazCheckbox>
      </div>
    </section>

    <!-- ==================== MazRadio ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazRadio
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-6 maz:mb-4">
        <MazRadio v-model="radioValue" value="option1" name="radio-demo">
          Option 1
        </MazRadio>
        <MazRadio v-model="radioValue" value="option2" name="radio-demo">
          Option 2
        </MazRadio>
        <MazRadio v-model="radioValue" value="option3" name="radio-demo">
          Option 3
        </MazRadio>
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Colors
      </h3>
      <div class="maz:flex maz:flex-wrap maz:gap-6">
        <MazRadio v-for="c in colors" :key="c" v-model="radioValue" :value="`option-${c}`" :name="`radio-${c}`" :color="c">
          {{ c }}
        </MazRadio>
      </div>
    </section>

    <!-- ==================== MazRadioButtons ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazRadioButtons
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-4 maz:mb-4">
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" />
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" orientation="col" />
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" selector />
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" equal-size block />
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" elevation />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Colors
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-2 maz:mb-4">
        <MazRadioButtons v-for="c in colors" :key="c" v-model="radioBtnValue" :options="radioOptions" :color="c" />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Sizes
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-2 maz:mb-4">
        <MazRadioButtons v-for="s in sizes" :key="s" v-model="radioBtnValue" :options="radioOptions" :size="s" />
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        States
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-2">
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" error hint="Error hint" />
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" success hint="Success hint" />
        <MazRadioButtons v-model="radioBtnValue" :options="radioOptions" warning hint="Warning hint" />
      </div>
    </section>

    <!-- ==================== MazSlider ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSlider
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-4">
        <MazSlider v-model="sliderValue" />
        <MazSlider v-model="sliderValue" color="secondary" />
        <MazSlider v-model="sliderValue" color="success" />
        <MazSlider v-model="sliderValue" disabled />
      </div>
    </section>

    <!-- ==================== MazDropzone ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazDropzone
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-4">
        <MazDropzone />
        <MazDropzone color="secondary" />
      </div>
    </section>

    <!-- ==================== MazChecklist ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazChecklist
      </h2>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4">
        <MazChecklist v-model="checklistValue" :items="checklistItems" title="Technologies" />
        <MazChecklist v-model="checklistValue" :items="checklistItems" title="With search" search />
        <MazChecklist v-model="checklistValue" :items="checklistItems" title="Elevation" elevation />
        <MazChecklist v-model="checklistValue" :items="checklistItems" title="Secondary" color="secondary" />
      </div>
    </section>

    <!-- ==================== MazCard ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazCard
      </h2>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Basic variants
      </h3>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4 maz:mb-6">
        <MazCard>
          <template #content-title>
            Simple Card
          </template>
          <template #content-body>
            <p>This is a simple card with basic content and default styling.</p>
          </template>
        </MazCard>
        <MazCard elevation>
          <template #content-title>
            Elevated Card
          </template>
          <template #content-body>
            <p>Card with elevation shadow for depth effect.</p>
          </template>
        </MazCard>
        <MazCard bordered>
          <template #content-title>
            Bordered Card
          </template>
          <template #content-body>
            <p>Card with visible border styling.</p>
          </template>
        </MazCard>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        With gallery, actions, footer
      </h3>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4 maz:mb-6 maz:items-start">
        <MazCard :gallery="{ images: galleryImages, height: 200 }">
          <template #content-title>
            Gallery Card
          </template>
          <template #content-subtitle>
            With image gallery
          </template>
          <template #content-body>
            <p>This card features a photo gallery header with multiple images.</p>
          </template>
          <template #actions>
            <MazBtn size="sm">
              View details
            </MazBtn>
            <MazBtn size="sm" color="info">
              Share
            </MazBtn>
          </template>
          <template #footer>
            <span class="maz:text-sm maz:text-muted">Published 2 hours ago</span>
          </template>
        </MazCard>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Orientations
      </h3>
      <div class="maz:flex maz:gap-4 maz:mb-6">
        <MazCard :gallery="{ images: galleryImages, height: 200, width: 250 }" orientation="row">
          <template #content-title>
            Row Orientation
          </template>
          <template #content-subtitle>
            Horizontal layout
          </template>
          <template #content-body>
            <p>Card with row orientation places the gallery on the side.</p>
          </template>
          <template #actions>
            <MazBtn size="sm" color="secondary">
              Action
            </MazBtn>
          </template>
        </MazCard>

        <MazCard :gallery="{ images: galleryImages.slice(0, 2), height: 200, width: 250 }" orientation="row-reverse">
          <template #content-title>
            Row Reverse
          </template>
          <template #content-body>
            <p>Gallery on the right side with row-reverse orientation.</p>
          </template>
        </MazCard>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Collapsible & Linked
      </h3>
      <div class="maz:grid maz:grid-cols-2 maz:gap-4 maz:mb-6" title="Card Title">
        <MazCard collapsible collapse-open>
          <template #content-title>
            Collapsible Card
          </template>
          <template #content-body>
            <p>This card can be collapsed by clicking the header. Try it!</p>
          </template>
        </MazCard>
        <MazCard href="https://maz-ui.com" href-target="_blank">
          <template #content-title>
            Linked Card
          </template>
          <template #content-body>
            <p>Click this card to navigate to the Maz UI website.</p>
          </template>
        </MazCard>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Footer alignment
      </h3>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4">
        <MazCard footer-align="start">
          <template #content-title>
            Left footer
          </template>
          <template #footer>
            <MazBtn size="sm">
              Action
            </MazBtn>
          </template>
        </MazCard>
        <MazCard>
          <template #content-title>
            Default footer
          </template>
          <template #footer>
            <MazBtn size="sm">
              Action
            </MazBtn>
          </template>
        </MazCard>
        <MazCard footer-align="end">
          <template #content-title>
            Right footer
          </template>
          <template #footer>
            <MazBtn size="sm">
              Action
            </MazBtn>
          </template>
        </MazCard>
      </div>
    </section>

    <!-- ==================== MazCardSpotlight ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazCardSpotlight
      </h2>
      <div class="maz:grid maz:grid-cols-3 maz:gap-4">
        <MazCardSpotlight v-for="c in colors.slice(0, 6)" :key="c" :color="c">
          <h3 class="maz:text-lg maz:font-bold maz:mb-2">
            {{ c }}
          </h3>
          <p class="maz:text-sm maz:text-muted">
            Spotlight card with hover glow effect in {{ c }} color.
          </p>
        </MazCardSpotlight>
      </div>
    </section>

    <!-- ==================== MazAvatar ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazAvatar
      </h2>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4 maz:mb-4">
        <MazAvatar v-for="s in sizes" :key="s" :src="avatarPlaceholder" :size="s" />
      </div>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4 maz:mb-4">
        <MazAvatar v-for="r in roundedSizes" :key="r" :src="avatarPlaceholder" :rounded-size="r" />
      </div>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
        <MazAvatar :src="avatarPlaceholder" bordered />
        <MazAvatar :src="avatarPlaceholder" elevation />
        <MazAvatar :src="avatarPlaceholder" clickable />
        <MazAvatar caption="John Doe" />
      </div>
    </section>

    <!-- ==================== MazBadge ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazBadge
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-3 maz:mb-4">
        <MazBadge v-for="c in colors" :key="c" :color="c">
          {{ c }}
        </MazBadge>
      </div>
      <div class="maz:flex maz:flex-wrap maz:gap-3 maz:mb-4">
        <MazBadge v-for="c in colors" :key="c" :color="c" pastel>
          {{ c }} pastel
        </MazBadge>
      </div>
      <div class="maz:flex maz:flex-wrap maz:gap-3 maz:mb-4">
        <MazBadge v-for="c in colors" :key="c" :color="c" outlined>
          {{ c }} outlined
        </MazBadge>
      </div>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
        <MazBadge v-for="s in sizes" :key="s" :size="s">
          {{ s }}
        </MazBadge>
      </div>
      <div class="maz:flex maz:flex-wrap maz:gap-3 maz:mt-4">
        <MazBadge v-for="r in roundedSizes" :key="r" :rounded-size="r">
          {{ r }}
        </MazBadge>
      </div>
    </section>

    <!-- ==================== MazAlert ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazAlert
      </h2>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Soft variant (default)
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-3 maz:mb-4">
        <MazAlert v-for="c in colors" :key="c" :color="c" :title="`${c} alert`">
          This is a {{ c }} alert with the soft variant. It conveys important information.
        </MazAlert>
      </div>
      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Solid variant
      </h3>
      <div class="maz:flex maz:flex-col maz:gap-3">
        <MazAlert v-for="c in colors" :key="c" :color="c" variant="solid" :title="`${c} solid`">
          This is a {{ c }} alert with the solid variant. More prominent styling.
        </MazAlert>
      </div>
    </section>

    <!-- ==================== MazTabs ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazTabs
      </h2>
      <MazTabs v-model="tabValue">
        <MazTabsBar v-model="tabValue" :items="[{ label: 'Overview' }, { label: 'Features' }, { label: 'Pricing' }]" />

        <MazTabsContent>
          <MazTabsContentItem :tab="1" class="maz-py-4">
            <h3 class="maz:text-lg maz:font-bold maz:mb-2">
              Overview
            </h3>
            <p>Welcome to the overview tab. This section provides a general introduction to the product and its key benefits.</p>
          </MazTabsContentItem>
          <MazTabsContentItem :tab="2" class="maz-py-4">
            <h3 class="maz:text-lg maz:font-bold maz:mb-2">
              Features
            </h3>
            <p>Discover our powerful features: real-time collaboration, advanced analytics, and seamless integrations.</p>
          </MazTabsContentItem>
          <MazTabsContentItem :tab="3" class="maz-py-4">
            <h3 class="maz:text-lg maz:font-bold maz:mb-2">
              Pricing
            </h3>
            <p>Flexible plans starting at $9/month. Free tier available for small teams.</p>
          </MazTabsContentItem>
        </MazTabsContent>
      </MazTabs>
    </section>

    <!-- ==================== MazAccordion ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazAccordion
      </h2>
      <MazAccordion v-model="accordionValue">
        <template #title-1>
          What is Maz UI?
        </template>
        <template #content-1>
          <p>Maz UI is a comprehensive Vue 3 component library featuring 50+ UI components, composables, directives, and utilities. It's designed for building modern, accessible web applications.</p>
        </template>
        <template #title-2>
          How to install?
        </template>
        <template #content-2>
          <p>Install via npm or pnpm: <code>pnpm add maz-ui</code>. Maz UI supports both Vue 3 standalone and Nuxt 3 via the @maz-ui/nuxt module.</p>
        </template>
        <template #title-3>
          Is it customizable?
        </template>
        <template #content-3>
          <p>Yes! Maz UI supports theming via CSS custom properties, TailwindCSS integration, and a CLI tool for generating custom themes. Every component is tree-shakeable.</p>
        </template>
      </MazAccordion>
    </section>

    <!-- ==================== MazExpandAnimation ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazExpandAnimation
      </h2>
      <MazBtn class="maz:mb-4" @click="expandOpen = !expandOpen">
        Toggle expand
      </MazBtn>
      <MazExpandAnimation v-model="expandOpen">
        <div class="maz:rounded-md maz:border maz:border-divider maz:p-4">
          <p>This content is animated when toggled. The expand animation smoothly reveals and hides content with configurable duration and timing.</p>
          <p class="maz:mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </MazExpandAnimation>
    </section>

    <!-- ==================== MazStepper ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazStepper
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-8">
        <MazStepper v-model="stepperValue" :steps="stepperSteps" auto-validate-steps>
          <template #content-1="{ nextStep }">
            <div class="maz:flex maz:flex-col maz:gap-4">
              <MazInput label="Email" placeholder="you@example.com" />
              <MazInput label="Password" type="password" placeholder="••••••••" />
              <MazBtn @click="nextStep">
                Next
              </MazBtn>
            </div>
          </template>
          <template #content-2="{ nextStep, previousStep }">
            <div class="maz:flex maz:flex-col maz:gap-4">
              <MazInput label="Full name" placeholder="John Doe" />
              <MazInput label="Company" placeholder="Acme Inc." />
              <div class="maz:flex maz:gap-2">
                <MazBtn outlined @click="previousStep">
                  Back
                </MazBtn>
                <MazBtn @click="nextStep">
                  Next
                </MazBtn>
              </div>
            </div>
          </template>
          <template #content-3="{ previousStep }">
            <div class="maz:flex maz:flex-col maz:gap-4">
              <p>Please review your information before confirming your account.</p>
              <div class="maz:flex maz:gap-2">
                <MazBtn outlined @click="previousStep">
                  Back
                </MazBtn>
                <MazBtn color="success">
                  Confirm
                </MazBtn>
              </div>
            </div>
          </template>
        </MazStepper>

        <h3 class="maz:text-lg maz:font-semibold">
          Stepper with states
        </h3>
        <MazStepper
          :model-value="2"
          :steps="[
            { title: 'Completed', subtitle: 'Done', success: true },
            { title: 'Current', subtitle: 'In progress' },
            { title: 'Warning', subtitle: 'Needs attention', warning: true },
            { title: 'Error', subtitle: 'Failed', error: true },
          ]"
        >
          <template #content-1>
            <p>Step 1 content</p>
          </template>
          <template #content-2>
            <p>Step 2 content</p>
          </template>
          <template #content-3>
            <p>Step 3 content</p>
          </template>
          <template #content-4>
            <p>Step 4 content</p>
          </template>
        </MazStepper>

        <h3 class="maz:text-lg maz:font-semibold">
          Colors
        </h3>
        <div class="maz:flex maz:flex-col maz:gap-4">
          <MazStepper v-for="c in colors.slice(0, 4)" :key="c" :model-value="2" :steps="stepperSteps" :color="c">
            <template #content-1>
              <p>Content for {{ c }}</p>
            </template>
            <template #content-2>
              <p>Content for {{ c }}</p>
            </template>
            <template #content-3>
              <p>Content for {{ c }}</p>
            </template>
          </MazStepper>
        </div>
      </div>
    </section>

    <!-- ==================== MazTimeline ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazTimeline
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-8">
        <h3 class="maz:text-lg maz:font-semibold">
          Vertical (default)
        </h3>
        <MazTimeline :steps="timelineSteps" />

        <h3 class="maz:text-lg maz:font-semibold">
          All states
        </h3>
        <MazTimeline :steps="timelineStepsStates" />

        <h3 class="maz:text-lg maz:font-semibold">
          Horizontal
        </h3>
        <MazTimeline :steps="timelineSteps" direction="horizontal" />

        <h3 class="maz:text-lg maz:font-semibold">
          Colors
        </h3>
        <div class="maz:flex maz:flex-col maz:gap-4">
          <MazTimeline v-for="c in colors.slice(0, 4)" :key="c" :steps="timelineStepsStates.slice(0, 3)" :color="c" />
        </div>

        <h3 class="maz:text-lg maz:font-semibold">
          Sizes
        </h3>
        <div class="maz:flex maz:flex-col maz:gap-4">
          <MazTimeline v-for="s in (['sm', 'md', 'lg'] as const)" :key="s" :steps="timelineStepsStates.slice(0, 3)" :size="s" />
        </div>
      </div>
    </section>

    <!-- ==================== MazDialog ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazDialog
      </h2>
      <MazBtn @click="dialogOpen = true">
        Open Dialog
      </MazBtn>
      <MazDialog v-model="dialogOpen" title="Dialog Title">
        <p>This is a dialog with some content. Dialogs are great for confirmations, forms, and detailed views.</p>
        <template #footer>
          <MazBtn outlined @click="dialogOpen = false">
            Cancel
          </MazBtn>
          <MazBtn @click="dialogOpen = false">
            Confirm
          </MazBtn>
        </template>
      </MazDialog>
    </section>

    <!-- ==================== MazBottomSheet ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazBottomSheet
      </h2>
      <MazBtn @click="bottomSheetOpen = true">
        Open Bottom Sheet
      </MazBtn>
      <MazBottomSheet v-model="bottomSheetOpen">
        <div class="maz:p-6">
          <h3 class="maz:text-xl maz:font-bold maz:mb-4">
            Bottom Sheet Content
          </h3>
          <p>This slides up from the bottom. Perfect for mobile-friendly actions and menus.</p>
        </div>
      </MazBottomSheet>
    </section>

    <!-- ==================== MazDrawer ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazDrawer
      </h2>
      <MazBtn @click="drawerOpen = true">
        Open Drawer
      </MazBtn>
      <MazDrawer v-model="drawerOpen" title="Drawer Panel">
        <div class="maz:p-4">
          <p>Side panel content. Great for navigation, filters, or detail views.</p>
        </div>
      </MazDrawer>
    </section>

    <!-- ==================== MazPopover ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazPopover
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-4">
        <MazPopover trigger="click" position="top">
          <template #trigger>
            <MazBtn>Click (top)</MazBtn>
          </template>
          <div class="maz:p-3">
            <p class="maz:font-semibold">
              Click popover
            </p>
            <p class="maz:text-sm maz:text-muted">
              Displayed on click, positioned on top.
            </p>
          </div>
        </MazPopover>
        <MazPopover trigger="hover" position="bottom">
          <template #trigger>
            <MazBtn outlined>
              Hover (bottom)
            </MazBtn>
          </template>
          <div class="maz:p-3">
            <p class="maz:font-semibold">
              Hover popover
            </p>
            <p class="maz:text-sm maz:text-muted">
              Displayed on hover, positioned on bottom.
            </p>
          </div>
        </MazPopover>
        <MazPopover trigger="click" position="left">
          <template #trigger>
            <MazBtn color="secondary">
              Click (left)
            </MazBtn>
          </template>
          <div class="maz:p-3">
            <p class="maz:font-semibold">
              Left popover
            </p>
            <p class="maz:text-sm maz:text-muted">
              Content on the left side.
            </p>
          </div>
        </MazPopover>
        <MazPopover trigger="click" position="right" persistent>
          <template #trigger>
            <MazBtn color="accent">
              Persistent (right)
            </MazBtn>
          </template>
          <div class="maz:p-3">
            <p class="maz:font-semibold">
              Persistent popover
            </p>
            <p class="maz:text-sm maz:text-muted">
              Won't close on outside click.
            </p>
          </div>
        </MazPopover>
      </div>
    </section>

    <!-- ==================== MazDropdown ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazDropdown
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-4">
        <MazDropdown :items="[{ label: 'Edit', action: () => {} }, { label: 'Delete', action: () => {} }, { label: 'Archive', action: () => {} }]">
          Actions
        </MazDropdown>
        <MazDropdown :items="[{ label: 'Profile' }, { label: 'Settings' }, { label: 'Logout' }]" color="secondary">
          Account
        </MazDropdown>
      </div>
    </section>

    <!-- ==================== MazTable ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazTable
      </h2>
      <MazTable sortable search background-even pagination :headers="tableHeaders" :rows="tableRows" title="Team Members" />
    </section>

    <!-- ==================== MazPagination ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazPagination
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-4">
        <MazPagination v-model="paginationValue" :total-pages="10" active-color="primary" />
        <MazPagination v-model="paginationValue" :total-pages="10" active-color="info" />
      </div>
    </section>

    <!-- ==================== MazGallery ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazGallery
      </h2>
      <MazGallery :images="galleryImages" :height="250" />
    </section>

    <!-- ==================== MazCarousel ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazCarousel
      </h2>
      <MazCarousel>
        <template #title>
          Featured Items
        </template>
        <MazCard v-for="i in 5" :key="i" :gallery="{ images: [galleryImages.at(i - 1) as MazGalleryImage], height: 150 }" style="min-width: 280px;">
          <template #content-title>
            Card {{ i }}
          </template>
          <template #content-body>
            <p>Carousel item {{ i }} description.</p>
          </template>
        </MazCard>
      </MazCarousel>
    </section>

    <!-- ==================== MazLazyImg ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazLazyImg
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-4">
        <MazLazyImg v-for="(img, i) in galleryImages.slice(0, 3)" :key="i" :src="typeof img === 'string' ? img : img.src" style="width: 200px; height: 150px;" />
      </div>
    </section>

    <!-- ==================== MazSpinner ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSpinner
      </h2>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4 maz:mb-4">
        <MazSpinner v-for="s in sizes" :key="s" />
      </div>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
        <MazSpinner v-for="c in colors" :key="c" :color="c" />
      </div>
    </section>

    <!-- ==================== MazFullscreenLoader ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazFullscreenLoader
      </h2>
      <p class="maz:text-muted">
        (Activated programmatically - not shown inline)
      </p>
    </section>

    <!-- ==================== MazLoadingBar ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazLoadingBar
      </h2>
      <MazLoadingBar />
    </section>

    <!-- ==================== MazSkeleton ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazSkeleton
      </h2>
      <div class="maz:flex maz:flex-col maz:gap-3">
        <MazSkeleton />
        <MazSkeleton width="75%" />
        <MazSkeleton width="50%" />
        <div class="maz:flex maz:gap-3 maz:mt-2">
          <MazSkeleton width="40px" height="40px" rounded />
          <div class="maz:flex maz:flex-col maz:gap-2 maz:flex-1">
            <MazSkeleton width="60%" />
            <MazSkeleton width="40%" />
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== MazIcon ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazIcon
      </h2>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
        <MazIcon :icon="MazUser" />
        <MazIcon :icon="MazHome" size="2rem" />
        <MazIcon :icon="MazCog" size="3rem" />
      </div>
    </section>

    <!-- ==================== MazLink ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazLink
      </h2>
      <div class="maz:flex maz:flex-wrap maz:gap-4">
        <MazLink href="#">
          Default link
        </MazLink>
        <MazLink v-for="c in [...colors, 'inherit' as const]" :key="c" href="#" :color="c">
          {{ c }} link
        </MazLink>
      </div>
    </section>

    <!-- ==================== MazReadMore ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazReadMore
      </h2>
      <MazReadMore>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.
        </p>
      </MazReadMore>
    </section>

    <!-- ==================== MazCircularProgressBar ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazCircularProgressBar
      </h2>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
        <MazCircularProgressBar :percentage="25" />
        <MazCircularProgressBar :percentage="50" color="info" />
        <MazCircularProgressBar :percentage="75" color="warning" />
        <MazCircularProgressBar :percentage="100" color="success" />
      </div>
    </section>

    <!-- ==================== MazReadingProgressBar ==================== -->
    <!-- <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazReadingProgressBar
      </h2>
      <p class="maz:text-muted">
        (Tracks page scroll progress - visible at the top of the viewport)
      </p>
      <MazReadingProgressBar />
    </section> -->

    <!-- ==================== MazAnimatedCounter ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazAnimatedCounter
      </h2>
      <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-8">
        <div class="maz:text-center">
          <MazAnimatedCounter :count="1234" suffix="+" class="maz:text-4xl" />
          <p class="maz:text-sm maz:text-muted">
            Users
          </p>
        </div>
        <div class="maz:text-center">
          <MazAnimatedCounter :count="99" suffix="%" prefix="~" class="maz:text-4xl" />
          <p class="maz:text-sm maz:text-muted">
            Uptime
          </p>
        </div>
        <div class="maz:text-center">
          <MazAnimatedCounter :count="50" suffix="+" class="maz:text-4xl" />
          <p class="maz:text-sm maz:text-muted">
            Components
          </p>
        </div>
      </div>
    </section>

    <!-- ==================== MazAnimatedText ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazAnimatedText
      </h2>
      <MazAnimatedText text="Build beautiful interfaces" last-word="with Maz UI" class="maz:text-3xl maz:font-bold" />
    </section>

    <!-- ==================== MazAnimatedElement ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazAnimatedElement
      </h2>
      <div class="maz:grid maz:grid-cols-4 maz:gap-4">
        <MazAnimatedElement direction="up" :once="false">
          <MazCard bordered>
            <template #content-title>
              Up
            </template>
          </MazCard>
        </MazAnimatedElement>
        <MazAnimatedElement direction="down" :once="false">
          <MazCard bordered>
            <template #content-title>
              Down
            </template>
          </MazCard>
        </MazAnimatedElement>
        <MazAnimatedElement direction="left" :once="false">
          <MazCard bordered>
            <template #content-title>
              Left
            </template>
          </MazCard>
        </MazAnimatedElement>
        <MazAnimatedElement direction="right" :once="false">
          <MazCard bordered>
            <template #content-title>
              Right
            </template>
          </MazCard>
        </MazAnimatedElement>
      </div>
    </section>

    <!-- ==================== MazTicker ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazTicker
      </h2>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Horizontal
      </h3>
      <MazTicker class="maz:mb-4">
        <span class="maz:px-4">Item 1</span>
        <span class="maz:px-4">Item 2</span>
        <span class="maz:px-4">Item 3</span>
        <span class="maz:px-4">Item 4</span>
      </MazTicker>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Reverse
      </h3>
      <MazTicker reverse class="maz:mb-4">
        <span class="maz:px-4">Item 1</span>
        <span class="maz:px-4">Item 2</span>
        <span class="maz:px-4">Item 3</span>
        <span class="maz:px-4">Item 4</span>
      </MazTicker>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Vertical with images
      </h3>
      <div class="maz:flex maz:gap-4 maz:overflow-hidden" style="height: 300px">
        <MazTicker orientation="vertical" :overlay="false" :duration="30" pause-on-hover>
          <img
            v-for="i in 4" :key="i" :src="`https://picsum.photos/seed/maz-ticker-${i}/400/225`"
            :alt="`Screenshot ${i}`" class="maz:rounded-lg maz:border maz:border-gray-200 maz:object-cover maz:dark:border-gray-700"
            style="width: 400px; height: 225px"
          >
        </MazTicker>
        <MazTicker orientation="vertical" :overlay="false" :duration="30" reverse pause-on-hover>
          <img
            v-for="i in 4" :key="i" :src="`https://picsum.photos/seed/maz-ticker-${i + 4}/400/225`"
            :alt="`Screenshot ${i + 4}`" class="maz:rounded-lg maz:border maz:border-gray-200 maz:object-cover maz:dark:border-gray-700"
            style="width: 400px; height: 225px"
          >
        </MazTicker>
        <MazTicker class="maz:hidden maz:md:flex" orientation="vertical" :overlay="false" :duration="30" pause-on-hover>
          <img
            v-for="i in 4" :key="i" :src="`https://picsum.photos/seed/maz-ticker-${i + 8}/400/225`"
            :alt="`Screenshot ${i + 8}`" class="maz:rounded-lg maz:border maz:border-gray-200 maz:object-cover maz:dark:border-gray-700"
            style="width: 400px; height: 225px"
          >
        </MazTicker>
      </div>

      <h3 class="maz:text-lg maz:font-semibold maz:mb-2">
        Inclined with images
      </h3>

      <div class="maz:overflow-hidden maz:rounded-lg maz:bg-gray-100 maz:dark:bg-gray-800" style="height: 400px; perspective: 1500px">
        <div class="maz:flex maz:gap-4" style="height: 1200px; margin-top: -520px; margin-left: -200px; transform: rotateX(55deg) rotateZ(30deg); transform-origin: center center">
          <MazTicker reverse orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
            <img
              v-for="i in 4"
              :key="i"
              :src="`https://picsum.photos/seed/maz-3d-${i}/460/258`"
              :alt="`Screenshot ${i}`"
              width="460"
              height="258"
              loading="lazy"
              class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
              style="width: 300px; height: 168px"
            >
          </MazTicker>
          <MazTicker orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
            <img
              v-for="i in 4"
              :key="i"
              :src="`https://picsum.photos/seed/maz-3d-${i + 4}/460/258`"
              :alt="`Screenshot ${i + 4}`"
              width="460"
              height="258"
              loading="lazy"
              class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
              style="width: 300px; height: 168px"
            >
          </MazTicker>
          <MazTicker reverse orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
            <img
              v-for="i in 4"
              :key="i"
              :src="`https://picsum.photos/seed/maz-3d-${i + 8}/460/258`"
              :alt="`Screenshot ${i + 8}`"
              width="460"
              height="258"
              loading="lazy"
              class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
              style="width: 300px; height: 168px"
            >
          </MazTicker>
          <MazTicker orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
            <img
              v-for="i in 4"
              :key="i"
              :src="`https://picsum.photos/seed/maz-3d-${i + 8}/460/258`"
              :alt="`Screenshot ${i + 8}`"
              width="460"
              height="258"
              loading="lazy"
              class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
              style="width: 300px; height: 168px"
            >
          </MazTicker>
          <MazTicker reverse orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
            <img
              v-for="i in 4"
              :key="i"
              :src="`https://picsum.photos/seed/maz-3d-${i + 8}/460/258`"
              :alt="`Screenshot ${i + 8}`"
              width="460"
              height="258"
              loading="lazy"
              class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
              style="width: 300px; height: 168px"
            >
          </MazTicker>
          <MazTicker orientation="vertical" :overlay="false" :duration="40" style="width: 300px; flex-shrink: 0">
            <img
              v-for="i in 4"
              :key="i"
              :src="`https://picsum.photos/seed/maz-3d-${i + 8}/460/258`"
              :alt="`Screenshot ${i + 8}`"
              width="460"
              height="258"
              loading="lazy"
              class="maz:rounded-lg maz:border maz:border-gray-200 maz:bg-white maz:object-cover maz:dark:border-gray-700"
              style="width: 300px; height: 168px"
            >
          </MazTicker>
        </div>
      </div>
    </section>

    <!-- ==================== MazContainer ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazContainer
      </h2>
      <MazContainer>
        <p>Content inside a MazContainer with max-width constraints.</p>
      </MazContainer>
    </section>

    <!-- ==================== MazBackdrop ==================== -->
    <!-- <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazBackdrop
      </h2>
      <p class="maz:text-muted">
        (Used internally by Dialog, BottomSheet, Drawer)
      </p>
    </section> -->

    <!-- ==================== MazChart ==================== -->
    <section>
      <h2 class="maz:text-2xl maz:font-bold maz:mb-4">
        MazChart
      </h2>
      <div style="height: 300px;">
        <MazChart
          type="bar"
          :data="{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Revenue',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
            }],
          }"
        />
      </div>
    </section>
  </div>
</template>
