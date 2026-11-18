<script lang="ts" setup>
import { MazArrowRight } from '@maz-ui/icons/raw/MazArrowRight'
import { MazBell } from '@maz-ui/icons/raw/MazBell'
import { MazHeart } from '@maz-ui/icons/raw/MazHeart'
import { MazPlus } from '@maz-ui/icons/raw/MazPlus'
import { ref } from 'vue'

const COLORS = [
  'primary',
  'secondary',
  'accent',
  'contrast',
  'surface',
  'container',
] as const
const STATUS = [
  'info',
  'success',
  'warning',
  'destructive',
] as const

const email = ref('ada@lovelace.dev')
const plan = ref('pro')
const country = ref('fr')
const notifications = ref(true)
const terms = ref(true)
const volume = ref(60)
const page = ref(2)
const tab = ref('overview')
</script>

<template>
  <div class="maz:grid maz:gap-4 maz:p-[clamp(1rem,3vw,2rem)] maz:tab-l:grid-cols-2">
    <MazCard bordered radius block class="maz:min-w-0">
      <template #content-title>
        Actions
      </template>
      <template #content-subtitle>
        One primary action per view, the others quieter.
      </template>
      <div class="maz:mt-4 maz:flex maz:flex-col maz:gap-4">
        <div class="maz:flex maz:flex-wrap maz:gap-2">
          <MazBtn v-for="color in COLORS" :key="color" :color size="sm">
            {{ color }}
          </MazBtn>
        </div>
        <div class="maz:flex maz:flex-wrap maz:gap-2">
          <MazBtn size="sm" :end-icon="MazArrowRight">
            Continue
          </MazBtn>
          <MazBtn size="sm" color="surface" outlined>
            Cancel
          </MazBtn>
          <MazBtn size="sm" pastel :start-icon="MazPlus">
            Add item
          </MazBtn>
          <MazBtn size="sm" color="destructive" outlined>
            Delete
          </MazBtn>
          <MazBtn size="sm" color="transparent" :icon="MazHeart" aria-label="Like" />
          <MazBtn size="sm" loading>
            Saving
          </MazBtn>
        </div>
      </div>
    </MazCard>

    <MazCard bordered radius block class="maz:min-w-0">
      <template #content-title>
        Feedback
      </template>
      <div class="maz:mt-4 maz:flex maz:flex-col maz:gap-3">
        <MazAlert color="info" title="New version">
          Maz-UI 5 brings presets and live theming.
        </MazAlert>
        <MazAlert color="success" title="Payment received" />
        <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-2">
          <MazBadge v-for="color in STATUS" :key="color" :color size="sm">
            {{ color }}
          </MazBadge>
          <MazBadge color="primary" size="sm" pastel>
            pastel
          </MazBadge>
          <MazBadge color="surface" size="sm" outlined>
            outlined
          </MazBadge>
          <MazBadge color="container" size="sm">
            container
          </MazBadge>
        </div>
      </div>
    </MazCard>

    <MazCard bordered radius block class="maz:min-w-0">
      <template #content-title>
        Form
      </template>
      <form class="maz:mt-4 maz:flex maz:flex-col maz:gap-4" @submit.prevent>
        <MazInput v-model="email" label="Email" type="email" block hint="We never share it" />
        <div class="maz:grid maz:gap-4 maz:mob-l:grid-cols-2">
          <MazSelect
            v-model="country"
            label="Country"
            block
            :options="[{ label: 'France', value: 'fr' }, { label: 'Japan', value: 'jp' }, { label: 'Brazil', value: 'br' }]"
          />
          <MazInput label="Promo code" block error assistive-text="This code has expired" model-value="SPRING" />
        </div>
        <MazRadioButtons
          v-model="plan"
          :options="[{ label: 'Starter', value: 'starter' }, { label: 'Pro', value: 'pro' }, { label: 'Team', value: 'team' }]"
          size="sm"
        />
        <div class="maz:flex maz:flex-wrap maz:gap-x-6 maz:gap-y-3">
          <MazCheckbox v-model="terms" label="I accept the terms" />
          <MazSwitch v-model="notifications" label="Notifications" />
        </div>
        <MazSlider v-model="volume" :divider="false" aria-label="Volume" />
      </form>
    </MazCard>

    <MazCard bordered radius block class="maz:min-w-0">
      <template #content-title>
        Navigation and data
      </template>
      <div class="maz:mt-4 maz:flex maz:flex-col maz:gap-5">
        <MazTabsBar
          v-model="tab"
          :items="[{ label: 'Overview', value: 'overview' }, { label: 'Activity', value: 'activity', badge: { content: 3, color: 'primary' } }, { label: 'Settings', value: 'settings' }]"
          standalone
          size="sm"
        />
        <div class="maz:flex maz:items-center maz:gap-3">
          <MazAvatar caption="Ada Lovelace" size="2.5rem" color="auto" />
          <div class="maz:min-w-0 maz:flex-1">
            <p class="maz:m-0 maz:text-label">
              Ada Lovelace
            </p>
            <p class="maz:m-0 maz:text-caption">
              Updated the pricing page, 2 min ago
            </p>
          </div>
          <MazBtn size="xs" color="transparent" :icon="MazBell" aria-label="Notifications" />
        </div>
        <div class="maz:flex maz:items-center maz:gap-4">
          <MazCircularProgressBar :percentage="72" size="3.5rem" color="primary" />
          <div>
            <p class="maz:m-0 maz:text-title-4">
              Storage
            </p>
            <p class="maz:m-0 maz:text-body-sm maz:text-muted">
              7.2 GB of 10 GB used. <MazLink href="#" @click.prevent>
                Upgrade
              </MazLink>
            </p>
          </div>
        </div>
        <div class="maz:overflow-x-auto">
          <MazPagination v-model="page" :total-pages="8" size="sm" />
        </div>
      </div>
    </MazCard>
  </div>
</template>
