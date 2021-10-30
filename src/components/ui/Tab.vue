<script setup lang="ts">
import { inject, defineProps, onBeforeMount } from 'vue'
import type { Ref } from 'vue'
const props = defineProps<{ name: string; active?: boolean }>()
const activeTab = inject<any>('activeTab')
const tabs = inject<Ref<string[]>>('tabs')
if (tabs && tabs.value)
  tabs.value = [...tabs.value, props.name]
onBeforeMount(() => {
  if (props.active)
    activeTab.value = props.name
})
</script>

<template>
  <div :class="{'hidden': activeTab !== name}">
    <slot />
  </div>
</template>
