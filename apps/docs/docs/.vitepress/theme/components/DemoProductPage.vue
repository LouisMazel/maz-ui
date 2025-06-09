<script lang="ts" setup>
import { ref } from 'vue'

const selectedColor = ref('black')
const quantity = ref(1)
const selectedTasks = ref([])
const price = ref(100)
</script>

<template>
  <div class="vp-raw maz-mx-auto maz-max-w-7xl maz-p-4">
    <div class="maz-grid maz-grid-cols-1 maz-gap-8 md:maz-grid-cols-2">
      <div>
        <MazGallery
          :images="[
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
            'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
            'https://images.unsplash.com/photo-1607294846590-fd005d7973e8?w=800',
          ]"
          :height="false"
          :displayed-count="2"
          class="maz-mb-6 maz-h-64"
        />

        <div class="maz-mb-6">
          <h2 class="maz-mb-2 maz-text-xl maz-font-semibold">
            Description
          </h2>
          <p class="maz-text-muted">
            Experience premium sound quality with our wireless headphones. Featuring advanced noise cancellation,
            long battery life and premium materials for ultimate comfort.
          </p>
        </div>

        <MazCard block :elevation="false" bordered>
          <template #title>
            <h3 class="maz-text-lg maz-font-semibold">
              Technical Specs
            </h3>
          </template>
          <div class="maz-space-y-2">
            <div class="maz-flex maz-justify-between">
              <span>Driver Size</span>
              <span>40mm</span>
            </div>
            <div class="maz-flex maz-justify-between">
              <span>Frequency Response</span>
              <span>20Hz - 20kHz</span>
            </div>
            <div class="maz-flex maz-justify-between">
              <span>Impedance</span>
              <span>32 Ohm</span>
            </div>
          </div>
        </MazCard>
      </div>
      <div class="maz-space-y-6">
        <h1 class="maz-text-3xl maz-font-bold">
          Premium Headphones
        </h1>

        <div class="maz-text-3xl maz-font-bold">
          169,99€
        </div>

        <hr class="maz-my-4 maz-border-t maz-border-divider">

        <div>
          <h2 class="maz-mb-2 maz-text-xl maz-font-semibold">
            Color
          </h2>
          <MazSelect
            v-model="selectedColor"
            :options="[
              { label: 'Black', value: 'black' },
              { label: 'White', value: 'white' },
              { label: 'Rose Gold', value: 'rose-gold' },
            ]"
            label="Color"
            class="maz-flex-1"
            block
          />
        </div>

        <div>
          <h2 class="maz-mb-2 maz-text-xl maz-font-semibold">
            Choose options
          </h2>

          <MazChecklist
            v-model="selectedTasks"
            :search="false"
            :items="[
              { label: 'Active Noise Cancellation', value: 'anc' },
              { label: '40h Battery Life', value: 'battery' },
              { label: 'Premium Audio Drivers', value: 'audio' },
              { label: 'Bluetooth 5.0', value: 'bluetooth' },
            ]"
            readonly
          />
        </div>

        <div class="maz-flex maz-flex-col maz-gap-4 lap-s:maz-flex-row">
          <MazInputPrice
            v-model="price"
            label="Price"
            :min="1"
            :step="1"
            :text-center="false"
            class="maz-flex-1"
          />

          <MazBtn color="contrast" outline class="maz-flex-1" right-icon="shopping-cart">
            Make an offer
          </MazBtn>
        </div>
        <div class="maz-flex maz-flex-col maz-gap-4 lap-s:maz-flex-row">
          <MazInputNumber
            v-model="quantity"
            label="Quantity"
            :min="1"
            :step="1"
            :text-center="false"
            class="maz-flex-1"
          />

          <MazBtn color="contrast" class="maz-flex-1" right-icon="shopping-cart">
            Add to Cart
          </MazBtn>
        </div>
      </div>
    </div>
  </div>
</template>
