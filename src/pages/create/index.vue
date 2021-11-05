<script lang="ts" setup>import { DiscordEmbed } from '~/types/DiscordEmbed'

const embed = ref<DiscordEmbed>()

</script>

<template>
  <div class="flex flex-col items-center w-full">
    <Tabs class="w-md">
      <Tab name="Create" active>
        <div class="mb-4 flex mx-auto flex-col w-md p-2 mt-10">
          <Creater v-model="embed" />
        </div>
      </Tab>
      <Tab name="Preview">
        <div class="mb-4 flex mx-auto flex-col w-md mt-10">
          <Previewer v-if="embed" :embed="embed" />
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
