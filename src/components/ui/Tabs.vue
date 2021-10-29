<script setup lang="ts">
import { provide, ref } from 'vue'
const tabs = ref([])
const activeTab = ref('')
provide('tabs', tabs)
provide('activeTab', activeTab)
</script>

<template>
  <div class="flex flex-col">
    <div class="grid z-10 px-4 w-full h-0 place-content-center">
      <div class="grid h-12 grid-flow-col p-2 text-sm max-w-screen overflow-auto font-semibold transform rounded-lg shadow-md bg-emb-dark-800 emb-dark-900">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="{ 'bg-green-400 text-green-900': activeTab === tab }"
          class="px-4 rounded focus:outline-none font-bold"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>
    </div>
    <div class="bg-emb-dark-700 rounded-lg shadow-xl">
      <slot />
    </div>
  </div>
</template>
