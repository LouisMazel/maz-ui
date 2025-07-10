---
title: MazBottomSheet
description: MazBottomSheet is a standalone component like a simple dialog but at the bottom of screen. Useful for mobile UX.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

::: tip
This component uses the `<Teleport to="body">` with [MazBackdrop](./maz-backdrop.md), so you can implement this component anywhere and it inherits all its props
:::

## Interactive Demo

<ComponentDemo expanded>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <!-- Product Selection Demo -->
    <MazCard>
      <template #title>
        <div class="maz-flex maz-items-center maz-gap-3">
          <MazAvatar src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100" size="lg" />
          <div>
            <h3 class="maz-text-lg maz-font-semibold">Nike Air Max</h3>
            <p class="maz-text-muted maz-text-sm">Premium Running Shoes</p>
          </div>
        </div>
      </template>
      <div class="maz-space-y-4">
        <div class="maz-flex maz-items-center maz-justify-between">
          <span class="maz-font-medium">Price:</span>
          <span class="maz-text-xl maz-font-bold maz-text-primary">$129.99</span>
        </div>
        <div class="maz-flex maz-gap-2">
          <MazBtn color="primary" @click="openProductOptions">
            <MazIcon name="cog" class="maz-mr-2" />
            Customize Options
          </MazBtn>
          <MazBtn color="secondary" @click="openUserSettings">
            <MazIcon name="user" class="maz-mr-2" />
            Profile Settings
          </MazBtn>
        </div>
      </div>
    </MazCard>
    <MazCard v-if="selectedOptions.size || selectedOptions.color" class="maz-bg-secondary/10">
      <template #title>Selected Options</template>
      <div class="maz-flex maz-gap-4">
        <MazBadge v-if="selectedOptions.size" color="info">
          Size: {{ selectedOptions.size }}
        </MazBadge>
        <MazBadge v-if="selectedOptions.color" color="success">
          Color: {{ selectedOptions.color }}
        </MazBadge>
        <MazBadge v-if="quantity > 1" color="warning">
          Qty: {{ quantity }}
        </MazBadge>
      </div>
    </MazCard>
  </div>
  <MazBottomSheet v-model="isProductOpen" title="Customize Your Shoes">
    <div class="maz-space-y-6 maz-p-6">
      <!-- Size Selection -->
      <div>
        <h4 class="maz-text-lg maz-font-semibold maz-mb-3">Select Size</h4>
        <div class="maz-grid maz-grid-cols-4 maz-gap-2">
          <MazBtn
            v-for="size in sizes"
            :key="size"
            :color="selectedOptions.size === size ? 'primary' : 'secondary'"
            size="sm"
            @click="selectedOptions.size = size"
          >
            {{ size }}
          </MazBtn>
        </div>
      </div>
      <div>
        <h4 class="maz-text-lg maz-font-semibold maz-mb-3">Select Color</h4>
        <div class="maz-grid maz-grid-cols-3 maz-gap-3">
          <div
            v-for="color in colors"
            :key="color.name"
            class="maz-flex maz-flex-col maz-items-center maz-cursor-pointer maz-p-3 maz-rounded-lg maz-border-2 maz-transition-all"
            :class="selectedOptions.color === color.name ? 'maz-border-primary maz-bg-primary/10' : 'maz-border-border hover:maz-border-primary/50'"
            @click="selectedOptions.color = color.name"
          >
            <div
              class="maz-w-8 maz-h-8 maz-rounded-full maz-mb-2"
              :style="{ backgroundColor: color.value }"
            />
            <span class="maz-text-sm maz-font-medium">{{ color.name }}</span>
          </div>
        </div>
      </div>
      <div>
        <MazInputNumber
          v-model="quantity"
          label="Quantity"
          :min="1"
          :max="10"
        />
      </div>
      <div class="maz-flex maz-gap-3 maz-pt-4">
        <MazBtn color="primary" class="maz-flex-1" @click="addToCart">
          <MazIcon name="shopping-cart" class="maz-mr-2" />
          Add to Cart (${{ (129.99 * quantity).toFixed(2) }})
        </MazBtn>
        <MazBtn color="secondary" @click="isProductOpen = false">
          Cancel
        </MazBtn>
      </div>
    </div>
  </MazBottomSheet>

  <MazBottomSheet v-model="isUserOpen" title="Profile Settings">
    <div class="maz-space-y-6 maz-p-6">
      <div class="maz-flex maz-items-center maz-gap-4 maz-p-4 maz-bg-secondary/10 maz-rounded-lg">
        <MazAvatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" size="xl" />
        <div>
          <h4 class="maz-font-semibold">John Doe</h4>
          <p class="maz-text-muted maz-text-sm">john.doe@example.com</p>
          <MazBadge color="success" size="xs">Premium Member</MazBadge>
        </div>
      </div>
      <div class="maz-flex maz-gap-4 maz-items-start">
        <MazInput
          v-model="userForm.name"
          label="Full Name"
          placeholder="Enter your name"
        />
        <MazInput
          v-model="userForm.email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />
        <MazSelect
          v-model="userForm.country"
          label="Country"
          :options="countries"
          placeholder="Select your country"
        />
      </div>
      <div class="maz-flex maz-gap-4">
        <div class="maz-flex maz-items-center maz-justify-between maz-p-4 maz-border maz-border-border maz-rounded-lg">
          <div>
            <p class="maz-font-medium">Email Notifications</p>
            <p class="maz-text-sm maz-text-muted">Receive updates about your orders</p>
          </div>
          <MazSwitch v-model="userForm.notifications" />
        </div>
        <div class="maz-flex maz-items-center maz-justify-between maz-p-4 maz-border maz-border-border maz-rounded-lg">
          <div>
            <p class="maz-font-medium">Dark Mode</p>
            <p class="maz-text-sm maz-text-muted">Switch to dark theme</p>
          </div>
          <MazSwitch v-model="userForm.darkMode" />
        </div>
      </div>
      <div class="maz-flex maz-gap-3 maz-pt-4">
        <MazBtn color="primary" class="maz-flex-1" @click="saveSettings">
          <MazIcon name="check" class="maz-mr-2" />
          Save Changes
        </MazBtn>
        <MazBtn color="secondary" @click="isUserOpen = false">
          Cancel
        </MazBtn>
      </div>
    </div>
  </MazBottomSheet>

<template #code>

```vue
<template>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <!-- Product Card -->
    <MazCard>
      <template #title>
        <div class="maz-flex maz-items-center maz-gap-3">
          <MazAvatar src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100" size="lg" />
          <div>
            <h3 class="maz-text-lg maz-font-semibold">
              Nike Air Max
            </h3>
            <p class="maz-text-sm maz-text-muted">
              Premium Running Shoes
            </p>
          </div>
        </div>
      </template>

      <div class="maz-space-y-4">
        <div class="maz-flex maz-items-center maz-justify-between">
          <span class="maz-font-medium">Price:</span>
          <span class="maz-text-xl maz-font-bold maz-text-primary">$129.99</span>
        </div>

        <div class="maz-flex maz-gap-2">
          <MazBtn color="primary" @click="openProductOptions">
            Customize Options
          </MazBtn>
          <MazBtn color="secondary" @click="openUserSettings">
            Profile Settings
          </MazBtn>
        </div>
      </div>
    </MazCard>
  </div>

  <!-- Product Options Bottom Sheet -->
  <MazBottomSheet v-model="isProductOpen" title="Customize Your Shoes">
    <div class="maz-space-y-6 maz-p-6">
      <!-- Size Selection -->
      <div>
        <h4 class="maz-mb-3 maz-text-lg maz-font-semibold">
          Select Size
        </h4>
        <div class="maz-grid maz-grid-cols-4 maz-gap-2">
          <MazBtn
            v-for="size in sizes"
            :key="size"
            :color="selectedOptions.size === size ? 'primary' : 'secondary'"
            size="sm"
            @click="selectedOptions.size = size"
          >
            {{ size }}
          </MazBtn>
        </div>
      </div>

      <!-- Color Selection with Visual Swatches -->
      <div>
        <h4 class="maz-mb-3 maz-text-lg maz-font-semibold">
          Select Color
        </h4>
        <div class="maz-grid maz-grid-cols-3 maz-gap-3">
          <div
            v-for="color in colors"
            :key="color.name"
            class="maz-flex maz-cursor-pointer maz-flex-col maz-items-center maz-rounded-lg maz-border-2 maz-p-3"
            :class="selectedOptions.color === color.name ? 'maz-border-primary' : 'maz-border-border'"
            @click="selectedOptions.color = color.name"
          >
            <div
              class="maz-mb-2 maz-size-8 maz-rounded-full"
              :style="{ backgroundColor: color.value }"
            />
            <span class="maz-text-sm">{{ color.name }}</span>
          </div>
        </div>
      </div>

      <!-- Quantity Input -->
      <MazInputNumber
        v-model="quantity"
        label="Quantity"
        :min="1"
        :max="10"
      />

      <!-- Actions -->
      <div class="maz-flex maz-gap-3 maz-pt-4">
        <MazBtn color="primary" class="maz-flex-1" @click="addToCart">
          Add to Cart (${{ (129.99 * quantity).toFixed(2) }})
        </MazBtn>
        <MazBtn color="secondary" @click="isProductOpen = false">
          Cancel
        </MazBtn>
      </div>
    </div>
  </MazBottomSheet>

  <MazBottomSheet v-model="isUserOpen" title="Profile Settings">
    <div class="maz-space-y-6 maz-p-6">
      <div class="maz-flex maz-items-center maz-gap-4 maz-p-4 maz-bg-secondary/10 maz-rounded-lg">
        <MazAvatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" size="xl" />
        <div>
          <h4 class="maz-font-semibold">John Doe</h4>
          <p class="maz-text-muted maz-text-sm">john.doe@example.com</p>
          <MazBadge color="success" size="xs">Premium Member</MazBadge>
        </div>
      </div>
      <div class="maz-space-y-4">
        <MazInput
          v-model="userForm.name"
          label="Full Name"
          placeholder="Enter your name"
        />
        <MazInput
          v-model="userForm.email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />
        <MazSelect
          v-model="userForm.country"
          label="Country"
          :options="countries"
          placeholder="Select your country"
        />
        <div class="maz-flex maz-items-center maz-justify-between maz-p-4 maz-border maz-border-border maz-rounded-lg">
          <div>
            <p class="maz-font-medium">Email Notifications</p>
            <p class="maz-text-sm maz-text-muted">Receive updates about your orders</p>
          </div>
          <MazSwitch v-model="userForm.notifications" />
        </div>
        <div class="maz-flex maz-items-center maz-justify-between maz-p-4 maz-border maz-border-border maz-rounded-lg">
          <div>
            <p class="maz-font-medium">Dark Mode</p>
            <p class="maz-text-sm maz-text-muted">Switch to dark theme</p>
          </div>
          <MazSwitch v-model="userForm.darkMode" />
        </div>
      </div>
      <div class="maz-flex maz-gap-3 maz-pt-4">
        <MazBtn color="primary" class="maz-flex-1" @click="saveSettings">
          <MazIcon name="check" class="maz-mr-2" />
          Save Changes
        </MazBtn>
        <MazBtn color="secondary" @click="isUserOpen = false">
          Cancel
        </MazBtn>
      </div>
    </div>
  </MazBottomSheet>
</template>
```

  </template>
</ComponentDemo>

<!--@include: ./../.vitepress/generated-docs/maz-bottom-sheet.doc.md-->

<script setup>
  import { ref, reactive } from 'vue'

  const isProductOpen = ref(false)
  const isUserOpen = ref(false)
  const quantity = ref(1)

  const selectedOptions = reactive({
    size: '',
    color: ''
  })

  const userForm = reactive({
    name: 'John Doe',
    email: 'john.doe@example.com',
    country: 'US',
    notifications: true,
    darkMode: false
  })

  const sizes = ['7', '8', '9', '10', '11', '12']
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' }
  ]

  const countries = [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'France', value: 'FR' },
    { label: 'Germany', value: 'DE' }
  ]

  function openProductOptions() {
    isProductOpen.value = true
  }

  function openUserSettings() {
    isUserOpen.value = true
  }

  function addToCart() {
    if (!selectedOptions.size || !selectedOptions.color) {
      alert('Please select size and color first!')
      return
    }
    alert(`Added ${quantity.value} ${selectedOptions.color} shoes (size ${selectedOptions.size}) to cart!`)
    isProductOpen.value = false
  }

  function saveSettings() {
    alert('Settings saved successfully!')
    isUserOpen.value = false
  }
</script>
