<script lang="ts" setup>
import dataLabels from 'chartjs-plugin-datalabels'
import { ref } from 'vue'

const { delay = 100 } = defineProps<{
  delay?: number
}>()

const selectedPeriod = ref('last_7_days')
const selectedCategories = ref(['sales', 'customers', 'orders'])
const dateRange = ref({
  start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  end: new Date().toISOString(),
})
const salesTarget = ref(75)

// Chart data
const salesData = {
  type: 'line',
  plugins: [dataLabels],
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales',
        data: [3100, 4200, 2900, 5600, 4900, 6100, 5900],
        borderColor: 'rgb(28 209 161)',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Orders',
        data: [410, 520, 340, 690, 590, 780, 710],
        borderColor: '#1e90ff',
        tension: 0.4,
        fill: false,
      },
    ],
  },
  options: {
    plugins: {
      datalabels: {
        display: false,
      },
    },
  },
}

// Table data
const orders = ref([
  { id: 1, customer: 'John Doe', product: 'Premium Headphones', amount: 169.99, status: 'completed', date: '2024-03-18' },
  { id: 2, customer: 'Jane Smith', product: 'Wireless Speaker', amount: 89.99, status: 'pending', date: '2024-03-18' },
  { id: 3, customer: 'Mike Johnson', product: 'Smart Watch', amount: 299.99, status: 'processing', date: '2024-03-17' },
  { id: 4, customer: 'Sarah Wilson', product: 'Laptop Stand', amount: 49.99, status: 'completed', date: '2024-03-17' },
  { id: 5, customer: 'Tom Brown', product: 'USB-C Hub', amount: 79.99, status: 'completed', date: '2024-03-16' },
])

const tableHeaders = [
  { label: 'Order ID', key: 'id', sortable: true },
  { label: 'Customer', key: 'customer', sortable: true },
  { label: 'Product', key: 'product', sortable: true },
  { label: 'Amount', key: 'amount', sortable: true },
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Date', key: 'date', sortable: true },
]
</script>

<template>
  <div class="vp-raw maz-p-4">
    <!-- Filters Section -->
    <div class="maz-mb-4 maz-flex maz-flex-wrap maz-gap-4">
      <MazSelect
        v-model="selectedPeriod"
        :options="[
          { label: 'Last 7 Days', value: 'last_7_days' },
          { label: 'Last 30 Days', value: 'last_30_days' },
          { label: 'Last 90 Days', value: 'last_90_days' },
          { label: 'Custom Range', value: 'custom' },
        ]"
        label="Time Period"
        class="maz-w-48"
      />

      <MazSelect
        v-model="selectedCategories"
        :options="[
          { label: 'Sales', value: 'sales' },
          { label: 'Customers', value: 'customers' },
          { label: 'Orders', value: 'orders' },
          { label: 'Products', value: 'products' },
        ]"
        label="Categories"
        multiple
        class="maz-w-64"
      />

      <MazPicker
        v-model="dateRange"
        range
        label="Date Range"
        class="maz-w-64"
        locale="en-US"
        picker-position="bottom right"
        :input-date-style="{
          dateStyle: 'medium',
        }"
        double
      />
    </div>

    <!-- Stats Cards -->
    <div class="maz-mb-4 maz-grid maz-grid-cols-1 maz-gap-4 sm:maz-grid-cols-2 lg:maz-grid-cols-4">
      <MazCard bordered :elevation="false" block>
        <div class="maz-flex maz-items-center maz-gap-4">
          <MazCircularProgressBar
            :percentage="85"
            color="success"
            size="3rem"
            :delay
            :once="false"
          />
          <div class="maz-truncate">
            <div class="maz-text-xl maz-font-bold">
              <MazAnimatedCounter
                :delay
                :count="28945"
                prefix="$"
                separator=","
                :once="false"
              />
            </div>
            <div class="maz-truncate maz-text-sm maz-text-muted">
              Total Revenue
            </div>
          </div>
        </div>
      </MazCard>

      <MazCard bordered :elevation="false" block>
        <div class="maz-flex maz-items-center maz-gap-4">
          <MazCircularProgressBar
            :percentage="65"
            color="info"
            size="3rem"
            :delay
            :once="false"
          />
          <div class="maz-truncate">
            <div class="maz-text-xl maz-font-bold">
              <MazAnimatedCounter
                :delay
                :count="384"
                separator=","
                :once="false"
              />
            </div>
            <div class="maz-truncate maz-text-sm maz-text-muted">
              New Orders
            </div>
          </div>
        </div>
      </MazCard>

      <MazCard bordered :elevation="false" block>
        <div class="maz-flex maz-items-center maz-gap-4">
          <MazCircularProgressBar
            :percentage="92"
            color="warning"
            size="3rem"
            :delay
            :once="false"
          />
          <div class="maz-truncate">
            <div class="maz-text-xl maz-font-bold">
              <MazAnimatedCounter
                :delay
                :count="1482"
                separator=","
                :once="false"
              />
            </div>
            <div class="maz-truncate maz-text-sm maz-text-muted">
              Active Customers
            </div>
          </div>
        </div>
      </MazCard>

      <MazCard bordered :elevation="false" block>
        <div class="maz-flex maz-items-center maz-gap-4">
          <MazCircularProgressBar
            :percentage="78"
            color="danger"
            size="3rem"
            :delay
            :once="false"
          />
          <div class="maz-truncate">
            <div class="maz-text-xl maz-font-bold">
              <MazAnimatedCounter
                :delay
                :count="94"
                suffix="%"
                :once="false"
              />
            </div>
            <div class="maz-truncate maz-text-sm maz-text-muted">
              Customer Satisfaction
            </div>
          </div>
        </div>
      </MazCard>
    </div>

    <!-- Orders Table -->
    <MazTable
      :headers="tableHeaders"
      :rows="orders"
      search
      title="Recent Orders"
      sortable
      hoverable
      input-size="sm"
      pagination
      selectable
    >
      <template #cell-amount="{ value }">
        <span class="maz-font-semibold">
          ${{ value }}
        </span>
      </template>
      <template #cell-status="{ value }">
        <MazBadge
          :color="value === 'completed' ? 'success' : value === 'processing' ? 'warning' : 'info'"
        >
          {{ value }}
        </MazBadge>
      </template>
    </MazTable>

    <!-- Charts Section -->
    <div class="maz-mt-4 maz-grid maz-grid-cols-1 maz-gap-4 lg:maz-grid-cols-2">
      <MazCard bordered :elevation="false" block>
        <template #header>
          <h3 class="maz-text-lg maz-font-semibold">
            Sales Overview
          </h3>
        </template>
        <MazChart v-bind="salesData" height="125" />
      </MazCard>

      <MazCard bordered :elevation="false" block>
        <template #header>
          <div class="maz-flex maz-w-full maz-items-center maz-justify-between">
            <h3 class="maz-text-lg maz-font-semibold">
              Sales Target
            </h3>
            <span class="maz-text-xl maz-font-bold maz-text-success">
              {{ salesTarget }}%
            </span>
          </div>
        </template>
        <div class="maz-flex maz-h-full maz-flex-col maz-justify-between maz-gap-4">
          <div>
            <MazSlider
              v-model="salesTarget"
              :min="0"
              :max="100"
              color="success"
            />
            <div class="maz-mt-4 maz-text-center maz-text-sm maz-text-muted">
              Drag the slider to adjust sales target
            </div>
          </div>

          <div class="maz-mt-4 maz-flex maz-items-center maz-justify-between">
            <div>
              <p class="maz-font-medium">
                Monthly Target
              </p>
              <p class="maz-text-sm maz-text-muted">
                ${{ (1000 * salesTarget).toLocaleString() }}
              </p>
            </div>
            <div>
              <p class="maz-font-medium">
                Achieved
              </p>
              <p class="maz-text-sm maz-text-success">
                $50,000
              </p>
            </div>
          </div>
        </div>
      </MazCard>
    </div>
  </div>
</template>
