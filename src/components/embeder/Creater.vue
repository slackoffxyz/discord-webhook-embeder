<script lang="ts" setup>
import { useAxios } from '@vueuse/integrations/useAxios'
import Swal from 'sweetalert2'
import { DiscordEmbed } from '~/types/DiscordEmbed'

defineProps<{ modelValue: DiscordEmbed | undefined }>()
const emit = defineEmits(['update:modelValue'])

const loading = ref(false)

// Fields
const title = ref('')
const webhook = ref('')
const image = ref<string | undefined>()
const reacts = ref<string[]>(['<:lemonbizz:763564057537282049> I\'m a Kappa'])
const color = ref<number | undefined>()

const getEmbed = (og?: DiscordEmbed, ogR?: string[]) => {
  let desc = ''
  const reactions = ogR ?? reacts.value
  for (let i = 0; i < reactions.length; i++)
    desc += `${reactions[i]}\n`

  const hook: DiscordEmbed = {
    title: og?.title ?? title.value,
    description: og?.description ?? desc,
    image: {
      url: og?.image?.url ?? image.value,
    },
    color: og?.color ?? color.value,
  }

  emit('update:modelValue', hook)

  return hook
}

const addReact = () => {
  reacts.value.push('')
}
const remReact = () => {
  reacts.value.pop()
}

// Watchers
watch(title, (n) => { getEmbed({ title: n }) })
watch(image, (n) => { getEmbed({ image: { url: n } }) })
watch(reacts, (n) => { getEmbed({}, n) })

const submit = async() => {
  loading.value = true
  const embed = getEmbed()

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

  loading.value = false

  // const resp = data.value
  await Swal.fire({
    title: 'Success!',
    text: 'Webhook triggered.',
    icon: 'success',
  })
}

const emoteUrl = (id) => {
  return `https://cdn.discordapp.com/emojis/${id}`
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
      <button v-if="!loading" class="bg-blue-500 hover:bg-blue-600 p-2 font-bold mt-5 rounded-sm" @click="submit">
        Send
      </button>
      <div v-else class="mt-2 flex flex-row items-center justify-center">
        <Spinner />
      </div>
    </div>
  </div>
</template>
