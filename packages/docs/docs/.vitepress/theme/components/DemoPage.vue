<script lang="ts" setup>
import { ref } from 'vue'

const selectedPeriod = ref('today')
const selectedTasks = ref([])
const tasks = ref([
  { label: 'Task 1', value: 'task1' },
  { label: 'Task 2', value: 'task2' },
])
</script>

<template>
  <div class="maz-rounded-lg maz-bg-color maz-p-4 maz-shadow-lg dark:maz-bg-color-dark">
    <!-- Header Section -->
    <div class="maz-mb-6 maz-flex maz-flex-wrap maz-items-center maz-justify-between maz-gap-4">
      <div>
        <h1 class="maz-text-2xl maz-font-bold">
          Dashboard Demo
        </h1>
        <p class="maz-text-muted">
          Welcome to Maz-UI Components Showcase
        </p>
      </div>

      <div class="maz-flex maz-gap-2">
        <MazBtn color="primary" left-icon="bell">
          Notifications
        </MazBtn>

        <MazAvatar clickable color="primary" src="https://github.com/LouisMazel.png">
          <template #icon>
            <MazIcon name="user" class="maz-text-white" />
          </template>
        </MazAvatar>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="maz-mb-6 maz-grid maz-grid-cols-1 maz-gap-4 mob-l:maz-grid-cols-2 tab-m:maz-grid-cols-4">
      <MazCard color="primary" class="maz-text-center">
        <h3 class="maz-text-xl maz-font-bold">
          1,234
        </h3>
        <p class="maz-text-sm">
          Active Users
        </p>
      </MazCard>

      <MazCard color="success" class="maz-text-center">
        <h3 class="maz-text-xl maz-font-bold">
          89%
        </h3>
        <p class="maz-text-sm">
          Satisfaction Rate
        </p>
      </MazCard>

      <MazCard color="warning" class="maz-text-center">
        <h3 class="maz-text-xl maz-font-bold">
          432
        </h3>
        <p class="maz-text-sm">
          Pending Tasks
        </p>
      </MazCard>

      <MazCard color="info" class="maz-text-center">
        <h3 class="maz-text-xl maz-font-bold">
          $12.4k
        </h3>
        <p class="maz-text-sm">
          Revenue
        </p>
      </MazCard>
    </div>

    <!-- Main Content -->
    <div class="maz-grid maz-grid-cols-1 maz-gap-6 tab-m:maz-grid-cols-3">
      <!-- Left Column -->
      <div class="maz-col-span-2">
        <MazCard class="maz-mb-6">
          <template #header>
            <div class="maz-flex maz-items-center maz-justify-between">
              <h3 class="maz-font-bold">
                Recent Activity
              </h3>
              <MazSelect
                v-model="selectedPeriod"
                :options="[
                  { label: 'Today', value: 'today' },
                  { label: 'This Week', value: 'week' },
                  { label: 'This Month', value: 'month' },
                ]"
                class="maz-w-32"
              />
            </div>
          </template>

          <MazList>
            <MazListItem v-for="i in 4" :key="i">
              <div class="maz-flex maz-items-center maz-gap-4">
                <MazAvatar :size="40" color="primary">
                  JD
                </MazAvatar>
                <div>
                  <p class="maz-font-medium">
                    New user registered
                  </p>
                  <p class="maz-text-sm maz-text-muted">
                    2 hours ago
                  </p>
                </div>
              </div>
            </MazListItem>
          </MazList>
        </MazCard>

        <MazCard>
          <template #header>
            <h3 class="maz-font-bold">
              Tasks Overview
            </h3>
          </template>

          <MazChecklist
            v-model="selectedTasks"
            :options="tasks"
            class="maz-mb-4"
          />

          <div class="maz-flex maz-justify-end">
            <MazBtn color="primary" size="sm">
              View All Tasks
            </MazBtn>
          </div>
        </MazCard>
      </div>

      <!-- Right Column -->
      <div>
        <MazCard class="maz-mb-6">
          <template #header>
            <h3 class="maz-font-bold">
              Team Members
            </h3>
          </template>

          <div class="maz-space-y-4">
            <div v-for="i in 3" :key="i" class="maz-flex maz-items-center maz-gap-3">
              <MazAvatar :size="40" color="secondary">
                TM
              </MazAvatar>
              <div class="maz-flex-1">
                <p class="maz-font-medium">
                  Team Member {{ i }}
                </p>
                <p class="maz-text-sm maz-text-muted">
                  Developer
                </p>
              </div>
              <MazBadge color="success">
                Online
              </MazBadge>
            </div>
          </div>
        </MazCard>

        <MazCardSpotlight>
          <template #header>
            <h3 class="maz-font-bold">
              Quick Actions
            </h3>
          </template>

          <div class="maz-space-y-2">
            <MazBtn block color="primary" left-icon="plus">
              New Project
            </MazBtn>
            <MazBtn block color="secondary" left-icon="message">
              Send Message
            </MazBtn>
            <MazBtn block color="info" left-icon="calendar">
              Schedule Meeting
            </MazBtn>
          </div>
        </MazCardSpotlight>
      </div>
    </div>
  </div>
</template>
