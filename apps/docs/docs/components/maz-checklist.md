---
title: MazChecklist
description: MazChecklist is a standalone component that allows creating a checklist with integrated search functionality. It provides a flexible and customizable user interface for selecting multiple items from a list of options. The component supports real-time search, color customization, and displays messages when no results are found.
lastUpdated: false
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/translated-component.md-->

## Basic usage

<ComponentDemo expanded>

  Selected languages: {{ languages || 'none' }}

  query value: {{ query || 'none' }}

  <br />

  <MazChecklist
    v-model="languages"
    v-model:query="query"
    title="Select your languages"
    :search="{
      enabled: true,
      placeholder: 'Search a language',
      debounce: 300,
      autoFocus: false,
      size: 'sm'
    }"
    :items="languagesOptions"
    class="maz-max-h-80"
  >
    <template #item="{ item }">
      <div class="maz-flex maz-w-full maz-items-center maz-justify-between maz-gap-2">
        <span class="maz-capitalize">{{ item.label }}</span>
        <MazBadge color="theme" outlined>
          {{ item.value }}
        </MazBadge>
      </div>
    </template>
  </MazChecklist>

  <template #code>

  ```vue
  <template>
    Selected languages: {{ languages || 'none' }}

    <br />

    <MazChecklist
      v-model="languages"
      v-model:query="query"
      title="Select your languages"
      :search="{
        enabled: true,
        placeholder: 'Search a language',
        debounce: 300,
        autoFocus: false,
        size: 'sm'
      }"
      :items="languagesOptions"
      class="maz-h-80"
    >
      <template #item="{ item }">
        <div class="maz-flex maz-w-full maz-items-center maz-justify-between maz-gap-2">
          <span class="maz-capitalize">{{ item.label }}</span>
          <MazBadge color="theme" outlined>
            {{ item.value }}
          </MazBadge>
        </div>
      </template>
    </MazChecklist>
  </template>

  <script lang="ts" setup>
    import { ref } from 'vue'
    import MazChecklist from 'maz-ui/components/MazChecklist'
    import { useDisplayNames } from 'maz-ui/composables/useDisplayNames'

    const query = ref<string>()
    const languages = ref<string[]>()
    const languagesOptions = useDisplayNames('en-US').getAllDisplayNames({ type: 'language' }).value.map(({ code, name }) => ({
      label: name,
      value: code,
    }))
  </script>
  ```

  </template>
</ComponentDemo>

## Custom search function

You can replace the default search function by providing a custom search function. Useful when you need to search by multiple fields, if you want to use a different search algorithm or if you want search into your database by fetching data from an API.

<ComponentDemo>

  Selected employees: {{ selectedEmployees || 'none' }}

  <br />

  <MazChecklist
    v-model="selectedEmployees"
    v-model:query="employeeQuery"
    title="Select team members"
    :search="{
      placeholder: 'Search by name, email, or department...',
      debounce: 200,
    }"
    :items="employees"
    :search-function="customEmployeeSearch"
    color="success"
    elevation
    class="maz-max-h-96"
  >
    <template #item="{ item }">
      <div class="maz-flex maz-w-full maz-items-center maz-gap-4">
        <div class="maz-flex maz-h-10 maz-w-10 maz-flex-none maz-items-center maz-justify-center maz-rounded-full maz-bg-gradient-to-br maz-from-primary-500 maz-to-secondary-500 maz-text-white maz-font-semibold maz-text-lg">
          {{ item.initials }}
        </div>
        <div class="maz-flex maz-flex-1 maz-flex-col maz-gap-1">
          <div class="maz-flex maz-items-center maz-gap-2">
            <span class="maz-font-semibold maz-text-normal">{{ item.label }}</span>
            <MazBadge :color="item.departmentColor" size="0.7em">
              {{ item.department }}
            </MazBadge>
          </div>
          <span class="maz-text-muted maz-text-sm">{{ item.email }}</span>
        </div>
        <div class="maz-flex maz-flex-none maz-items-center maz-gap-1">
          <MazIcon name="star" class="maz-text-warning-500" size="1rem" />
          <span class="maz-text-sm maz-font-medium">{{ item.rating }}</span>
        </div>
      </div>
    </template>
  </MazChecklist>

  <template #code>

  ```vue
  <template>
    Selected employees: {{ selectedEmployees || 'none' }}

    <br />

    <MazChecklist
      v-model="selectedEmployees"
      v-model:query="employeeQuery"
      title="Select team members"
      :search="{
        placeholder: 'Search by name, email, or department...',
        debounce: 200,
        block: true,
      }"
      :items="employees"
      :search-function="customEmployeeSearch"
      color="success"
      elevation
      class="max-h-96"
    >
      <template #item="{ item }">
        <div class="flex w-full items-center gap-4">
          <div class="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-semibold text-lg">
            {{ item.initials }}
          </div>
          <div class="flex flex-1 flex-col gap-1">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-normal">{{ item.label }}</span>
              <MazBadge :color="item.departmentColor" size="xs">
                {{ item.department }}
              </MazBadge>
            </div>
            <span class="text-muted text-sm">{{ item.email }}</span>
          </div>
          <div class="flex flex-none items-center gap-1">
            <MazIcon name="star" class="text-warning-500" size="1rem" />
            <span class="text-sm font-medium">{{ item.rating }}</span>
          </div>
        </div>
      </template>
    </MazChecklist>
  </template>

  <script lang="ts" setup>
    import { ref } from 'vue'
    import { MazChecklist } from 'maz-ui/components'

    const employeeQuery = ref<string>()
    const selectedEmployees = ref<string[]>()

    const employees = [
      {
        label: 'Sarah Johnson',
        value: 'sarah.johnson',
        email: 'sarah.johnson@company.com',
        department: 'Engineering',
        departmentColor: 'info',
        initials: 'SJ',
        rating: 4.9
      },
      {
        label: 'Michael Chen',
        value: 'michael.chen',
        email: 'michael.chen@company.com',
        department: 'Design',
        departmentColor: 'warning',
        initials: 'MC',
        rating: 4.7
      },
      {
        label: 'Emma Rodriguez',
        value: 'emma.rodriguez',
        email: 'emma.rodriguez@company.com',
        department: 'Marketing',
        departmentColor: 'success',
        initials: 'ER',
        rating: 4.8
      },
      {
        label: 'David Kim',
        value: 'david.kim',
        email: 'david.kim@company.com',
        department: 'Engineering',
        departmentColor: 'info',
        initials: 'DK',
        rating: 4.6
      },
      {
        label: 'Lisa Thompson',
        value: 'lisa.thompson',
        email: 'lisa.thompson@company.com',
        department: 'Product',
        departmentColor: 'contrast',
        initials: 'LT',
        rating: 4.9
      },
      {
        label: 'John Doe',
        value: 'john.doe',
        email: 'john.doe@company.com',
        department: 'Marketing',
        departmentColor: 'success',
        initials: 'JD',
        rating: 4.9
      },
      {
        label: 'Jane Smith',
        value: 'jane.smith',
        email: 'jane.smith@company.com',
        department: 'Engineering',
        departmentColor: 'info',
        initials: 'JS',
        rating: 4.9
      },
      {
        label: 'Jim Beam',
        value: 'jim.beam',
        email: 'jim.beam@company.com',
        department: 'Sales',
        departmentColor: 'destructive',
        initials: 'JB',
        rating: 4.9
      },
      {
        label: 'Jill Johnson',
        value: 'jill.johnson',
        email: 'jill.johnson@company.com',
        department: 'Marketing',
        departmentColor: 'success',
        initials: 'JJ',
        rating: 4.9
      },
    ]

    function customEmployeeSearch(query: string, items: typeof employees) {
      const searchTerm = query.toLowerCase().trim()

      if (!searchTerm) return items

      return items.filter(employee =>
        employee.label.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm) ||
        employee.department.toLowerCase().includes(searchTerm) ||
        employee.value.toLowerCase().includes(searchTerm)
      )
    }
  </script>
  ```

  </template>
</ComponentDemo>

<!--@include: ./../.vitepress/generated-docs/maz-checklist.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useDisplayNames } from 'maz-ui/src/composables/useDisplayNames'

  // First demo variables
  const query = ref()
  const languages = ref<string[]>()
  const languagesOptions = useDisplayNames('en-US').getAllDisplayNames({ type: 'language' }).value.map(({ code, name }) => ({
    label: name,
    value: code,
  }))

  // Second demo variables
  const employeeQuery = ref<string>()
  const selectedEmployees = ref<string[]>()

  const employees = [
    {
      label: 'Sarah Johnson',
      value: 'sarah.johnson',
      email: 'sarah.johnson@company.com',
      department: 'Engineering',
      departmentColor: 'info',
      initials: 'SJ',
      rating: 4.9
    },
    {
      label: 'Michael Chen',
      value: 'michael.chen',
      email: 'michael.chen@company.com',
      department: 'Design',
      departmentColor: 'warning',
      initials: 'MC',
      rating: 4.7
    },
    {
      label: 'Emma Rodriguez',
      value: 'emma.rodriguez',
      email: 'emma.rodriguez@company.com',
      department: 'Marketing',
      departmentColor: 'success',
      initials: 'ER',
      rating: 4.8
    },
    {
      label: 'David Kim',
      value: 'david.kim',
      email: 'david.kim@company.com',
      department: 'Engineering',
      departmentColor: 'info',
      initials: 'DK',
      rating: 4.6
    },
    {
      label: 'Lisa Thompson',
      value: 'lisa.thompson',
      email: 'lisa.thompson@company.com',
      department: 'Product',
      departmentColor: 'contrast',
      initials: 'LT',
      rating: 4.9
    },
    {
      label: 'John Doe',
      value: 'john.doe',
      email: 'john.doe@company.com',
      department: 'Marketing',
      departmentColor: 'success',
      initials: 'JD',
      rating: 4.9
    },
    {
      label: 'Jane Smith',
      value: 'jane.smith',
      email: 'jane.smith@company.com',
      department: 'Engineering',
      departmentColor: 'info',
      initials: 'JS',
      rating: 4.9
    },
    {
      label: 'Jim Beam',
      value: 'jim.beam',
      email: 'jim.beam@company.com',
      department: 'Sales',
      departmentColor: 'destructive',
      initials: 'JB',
      rating: 4.9
    },
    {
      label: 'Jill Johnson',
      value: 'jill.johnson',
      email: 'jill.johnson@company.com',
      department: 'Marketing',
      departmentColor: 'success',
      initials: 'JJ',
      rating: 4.9
    },
  ]

  function customEmployeeSearch(query: string, items: typeof employees) {
    const searchTerm = query.toLowerCase().trim()

    if (!searchTerm) return items

    return items.filter(employee =>
      employee.label.toLowerCase().includes(searchTerm) ||
      employee.email.toLowerCase().includes(searchTerm) ||
      employee.department.toLowerCase().includes(searchTerm) ||
      employee.value.toLowerCase().includes(searchTerm)
    )
  }
</script>
