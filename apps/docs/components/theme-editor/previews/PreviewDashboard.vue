<script lang="ts" setup>
import { MazArrowDownTray } from '@maz-ui/icons/raw/MazArrowDownTray'
import { MazArrowTrendingDown } from '@maz-ui/icons/raw/MazArrowTrendingDown'
import { MazArrowTrendingUp } from '@maz-ui/icons/raw/MazArrowTrendingUp'
import { MazPlus } from '@maz-ui/icons/raw/MazPlus'
import { ref } from 'vue'

const period = ref('7d')

const KPIS = [
  {
    label: 'Revenue',
    value: 48_210,
    prefix: '$',
    delta: 12.4,
  },
  { label: 'Orders', value: 1_284, delta: 8.1 },
  {
    label: 'Conversion',
    value: 3.6,
    suffix: '%',
    delta: -0.4,
  },
  { label: 'Active users', value: 9_420, delta: 21.7 },
] as const

const WEEK = [
  { day: 'Mon', current: 52, previous: 40 },
  { day: 'Tue', current: 68, previous: 55 },
  { day: 'Wed', current: 45, previous: 50 },
  { day: 'Thu', current: 80, previous: 62 },
  { day: 'Fri', current: 74, previous: 70 },
  { day: 'Sat', current: 92, previous: 66 },
  { day: 'Sun', current: 86, previous: 72 },
] as const

const CHANNELS = [
  { label: 'Organic search', share: 46, className: 'maz:bg-primary' },
  { label: 'Social', share: 27, className: 'maz:bg-secondary' },
  { label: 'Email', share: 17, className: 'maz:bg-accent' },
  { label: 'Referral', share: 10, className: 'maz:bg-info' },
] as const

const ORDERS = [
  {
    id: '#3021',
    customer: 'Ada Lovelace',
    product: 'Studio headphones',
    amount: '$249.00',
    status: 'paid',
  },
  {
    id: '#3020',
    customer: 'Alan Turing',
    product: 'Mechanical keyboard',
    amount: '$129.00',
    status: 'pending',
  },
  {
    id: '#3019',
    customer: 'Grace Hopper',
    product: 'USB-C dock',
    amount: '$89.00',
    status: 'paid',
  },
  {
    id: '#3018',
    customer: 'Linus Torvalds',
    product: 'Standing desk',
    amount: '$540.00',
    status: 'refunded',
  },
] as const

const STATUS_COLOR = { paid: 'success', pending: 'warning', refunded: 'destructive' } as const
</script>

<template>
  <div class="maz:flex maz:flex-col maz:gap-6 maz:p-[clamp(1rem,3vw,2rem)]">
    <header class="maz:flex maz:flex-wrap maz:items-end maz:gap-4">
      <div class="maz:min-w-[min(100%,16rem)] maz:flex-1">
        <p class="maz:m-0 maz:text-overline maz:text-muted maz:uppercase">
          Store analytics
        </p>
        <h1 class="maz:m-0 maz:mt-1 maz:text-title-1">
          Good morning, Ada
        </h1>
        <p class="maz:m-0 maz:mt-1 maz:text-body-sm maz:text-muted">
          Here is what happened in your store this week.
        </p>
      </div>
      <MazTabsBar
        v-model="period"
        :items="[{ label: '24h', value: '24h' }, { label: '7 days', value: '7d' }, { label: '30 days', value: '30d' }]"
        standalone
        size="xs"
      />
      <div class="maz:flex maz:gap-2">
        <MazBtn size="sm" color="surface" outlined :start-icon="MazArrowDownTray">
          Export
        </MazBtn>
        <MazBtn size="sm" :start-icon="MazPlus">
          New product
        </MazBtn>
      </div>
    </header>

    <div class="maz:grid maz:grid-cols-2 maz:gap-4 maz:lap-s:grid-cols-4">
      <MazCard v-for="kpi in KPIS" :key="kpi.label" bordered radius block>
        <p class="maz:m-0 maz:text-label maz:text-muted">
          {{ kpi.label }}
        </p>
        <p class="maz:m-0 maz:mt-2 maz:text-title-2 maz:tabular-nums">
          <MazAnimatedCounter :count="kpi.value" :prefix="'prefix' in kpi ? kpi.prefix : undefined" :suffix="'suffix' in kpi ? kpi.suffix : undefined" :delay="0" />
        </p>
        <p class="maz:m-0 maz:mt-2 maz:flex maz:items-center maz:gap-1 maz:text-caption" :class="kpi.delta >= 0 ? 'maz:text-success-700 maz:dark:text-success-400' : 'maz:text-destructive'">
          <MazIcon :icon="kpi.delta >= 0 ? MazArrowTrendingUp : MazArrowTrendingDown" size="1rem" />
          {{ kpi.delta > 0 ? '+' : '' }}{{ kpi.delta }}% vs last week
        </p>
      </MazCard>
    </div>

    <div class="maz:grid maz:gap-4 maz:lap-s:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <MazCard bordered radius block>
        <template #content-title>
          Sales this week
        </template>
        <template #content-subtitle>
          Compared with the previous week
        </template>
        <div class="maz:mt-6 maz:flex maz:h-48 maz:items-end maz:gap-[3%]" role="img" aria-label="Sales by day, this week and the previous week">
          <div v-for="item in WEEK" :key="item.day" class="maz:flex maz:h-full maz:flex-1 maz:flex-col maz:items-center maz:gap-2">
            <div class="maz:flex maz:w-full maz:flex-1 maz:items-end maz:justify-center maz:gap-1">
              <span class="maz:w-full maz:max-w-4 maz:rounded-t-sm maz:bg-primary-200 maz:dark:bg-primary-800" :style="{ height: `${item.previous}%` }" />
              <span class="maz:w-full maz:max-w-4 maz:rounded-t-sm maz:bg-primary" :style="{ height: `${item.current}%` }" />
            </div>
            <span class="maz:text-caption">{{ item.day }}</span>
          </div>
        </div>
      </MazCard>

      <MazCard bordered radius block>
        <template #content-title>
          Traffic sources
        </template>
        <div class="maz:mt-4 maz:flex maz:h-3 maz:overflow-hidden maz:rounded-full" aria-hidden="true">
          <span v-for="channel in CHANNELS" :key="channel.label" :class="channel.className" :style="{ width: `${channel.share}%` }" />
        </div>
        <ul class="maz:m-0 maz:mt-4 maz:flex maz:list-none maz:flex-col maz:gap-3 maz:p-0">
          <li v-for="channel in CHANNELS" :key="channel.label" class="maz:flex maz:items-center maz:gap-2 maz:text-body-sm">
            <span class="maz:size-2.5 maz:rounded-full" :class="channel.className" />
            {{ channel.label }}
            <span class="maz:ms-auto maz:font-medium maz:tabular-nums">{{ channel.share }}%</span>
          </li>
        </ul>
      </MazCard>
    </div>

    <MazCard bordered radius block :padding="false">
      <div class="maz:flex maz:items-center maz:gap-2 maz:p-4">
        <h2 class="maz:m-0 maz:flex-1 maz:text-title-3">
          Recent orders
        </h2>
        <MazLink href="#" @click.prevent>
          View all
        </MazLink>
      </div>
      <div class="maz:overflow-x-auto">
        <table class="maz:w-full maz:border-collapse maz:text-body-sm">
          <thead>
            <tr class="maz:border-y maz:border-divider maz:text-start">
              <th v-for="title in ['Order', 'Customer', 'Product', 'Amount', 'Status']" :key="title" class="maz:px-4 maz:py-2 maz:text-start maz:text-label maz:text-muted">
                {{ title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in ORDERS" :key="order.id" class="maz:border-b maz:border-divider maz:last:border-b-0">
              <td class="maz:px-4 maz:py-3 maz:font-mono maz:text-xs maz:text-muted">
                {{ order.id }}
              </td>
              <td class="maz:px-4 maz:py-3">
                <span class="maz:flex maz:items-center maz:gap-2">
                  <MazAvatar :caption="order.customer" size="1.75rem" color="auto" />
                  {{ order.customer }}
                </span>
              </td>
              <td class="maz:px-4 maz:py-3 maz:text-muted">
                {{ order.product }}
              </td>
              <td class="maz:px-4 maz:py-3 maz:font-medium maz:tabular-nums">
                {{ order.amount }}
              </td>
              <td class="maz:px-4 maz:py-3">
                <MazBadge :color="STATUS_COLOR[order.status]" size="sm" pastel>
                  {{ order.status }}
                </MazBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </MazCard>
  </div>
</template>
