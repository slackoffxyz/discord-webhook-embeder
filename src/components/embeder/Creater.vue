<script lang="ts" setup>
import axios from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'
import { DiscordEmbed } from '~/types/DiscordEmbed'

const props = defineProps<{ modelValue: DiscordEmbed | undefined }>()
const emit = defineEmits(['update:modelValue'])

// Fields
const title = ref('')
const webhook = ref('')
const image = ref<string | undefined>()
const reacts = ref<string[]>(['<:lemonbizz:763564057537282049>'])
const color = ref<number | undefined>()

const getEmbed = () => {
  let desc = ''
  for (let i = 0; i < reacts.value.length; i++)
    desc += `${reacts.value[i]}\n`

  const hook: DiscordEmbed = {
    title: title.value,
    description: desc,
    image: {
      url: image.value,
    },
    color: color.value,
  }

  emit('update:modelValue', hook)

  return hook
}
// https://discord.com/api/webhooks/903157332052160524/oySclo2EagTcXA3k9WRNGOmp6n4mKEWP0NDUdda6-JFaYUjutlwY8wgh3Ti8DtQKiaXI
const addReact = () => {
  reacts.value.push('<:lemonbizz:763564057537282049> A Kappa')
}
const remReact = () => {
  reacts.value.pop()
}

// Watchers
watch(title, (n) => { getEmbed() })
watch(image, (n) => { getEmbed() })
watch(reacts, (n) => { getEmbed() })

const submit = async() => {
  const embed = getEmbed()

  /* const { data, isFinished } = useAxios('https://memeapi.bizzy.live/api/embeder/create', {
    data: {
      webhookUrl: webhook.value,
      embed,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }) */

  const { data, isFinished } = useAxios(webhook.value, {
    data: {
      embeds: [embed],
    },
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  await until(isFinished).toBe(true)

  const resp = data.value
  if (resp?.length > 0)
    alert('oof')
}
</script>

<template>
  <div>
    <div class="mb-1 flex mx-auto flex-col w-full">
      <input
        v-model="webhook"
        class="mt-2 pr-8 bg-emb-dark-800 border-emb-dark-900 focus:border-blurple shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Webhook URL"
      >
    </div>
    <div class="mb-1 flex mx-auto flex-col w-full">
      <input
        v-model="title"
        class="mt-2 pr-8 bg-emb-dark-800 border-emb-dark-900 focus:border-blurple shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Title"
      >
    </div>
    <div class="mb-4 flex mx-auto flex-col w-full">
      <input
        v-model="image"
        class="mt-2 pr-8 bg-emb-dark-800 border-emb-dark-900 focus:border-blurple shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Image URL"
      >
    </div>
    <div class="mb-4 flex mx-auto flex-col w-full">
      <input
        v-model="color"
        class="mt-2 pr-8 bg-emb-dark-800 border-emb-dark-900 focus:border-blurple shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
        type="number"
        placeholder="Color"
      >
    </div>
    <div class="mb-4 flex mx-auto flex-col w-full">
      <div class="flex flex-row justify-center items-center">
        <label class="text-gray-300 text-md font-bold mr-2" for="username">
          Reactions
        </label>
        <carbon-add-filled class="hover:text-green-600 cursor-pointer mr-1" @click="addReact" />
        <clarity-remove-solid class="hover:text-red-600 cursor-pointer" @click="remReact" />
      </div>
      <div v-for="(itm, index) in reacts" :key="index">
        <input
          v-model="reacts[index]"
          class="mt-2 pr-8 bg-emb-dark-800 border-emb-dark-900 focus:border-blurple shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="React"
        />
      </div>
      <button class="bg-blue-500 hover:bg-blue-600 p-2 font-bold mt-5" @click="submit">
        Send
      </button>
    </div>
  </div>
</template>
