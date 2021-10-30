<script lang="ts" setup>
import { useAxios } from '@vueuse/integrations/useAxios'
import Swal from 'sweetalert2'
import VSwatches from 'vue3-swatches'

// Import the styles too, typically in App.vue or main.js
import '~/styles/swatches.css'
import { DiscordEmbed } from '~/types/DiscordEmbed'

defineProps<{ modelValue: DiscordEmbed | undefined }>()
const emit = defineEmits(['update:modelValue'])

const loading = ref(false)

// Fields
const title = ref('')
const webhook = ref('')
const image = ref<string | undefined>()
const reacts = ref<any[]>([{}])
const color = ref('#00ffff')

const convertColor = () => {
  const newCol = color.value.replace('#', '')
  const dec = parseInt(newCol, 16)

  return dec
}

const getEmbed = (og?: DiscordEmbed, ogR?: string[]) => {
  let desc = ''
  const reactions = ogR ?? reacts.value
  for (let i = 0; i < reactions.length; i++) {
    const obj = reactions[i] as any
    desc += `${getRealFromJson(obj)}\n`
  }

  const hook: DiscordEmbed = {
    title: og?.title ?? title.value,
    description: og?.description ?? desc,
    image: {
      url: og?.image?.url ?? image.value,
    },
    color: og?.color ?? convertColor(),
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
watch(reacts, (n) => { getEmbed({}, n) }, { deep: true })
watch(color, (n) => { getEmbed({ color: convertColor() }) })

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

const getRealFromJson = (src: any) => {
  const list = src.content
  if (!list || list instanceof String || typeof list === 'string') return list

  let output = ''
  for (let i = 0; i < list.length; i++) {
    const obj = list[i]
    if (obj.type === 'image') {
      output += obj.attrs?.title
    }
    else if (obj.type === 'span') {
      if (obj.content) {
        obj.content.forEach((el: any) => {
          if (el.type === 'text')
            output += el.text
        })
      }
    }
  }

  return output.trimStart()
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
    <div class="mb-4 flex mx-auto flex-row w-full items-center">
      <v-swatches
        v-model="color"
        show-fallback
        fallback-input-type="color"
        popover-x="left"
        swatches="text-advanced"
      ></v-swatches>
      <span class="ml-2 text-xl -mt-2 text-gray-300">Colour</span>
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
        <!--<input
          v-model="reacts[index]"
          class="mt-2 pr-8 bg-emb-dark-800 border-emb-dark-900 focus:border-blurple shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="React"
        />-->
        <ReactField v-model="reacts[index]" class="mt-2 bg-emb-dark-800 border-emb-dark-900 focus:border-blurple shadow appearance-none border rounded w-full text-gray-300 leading-tight focus:outline-none focus:shadow-outline" />
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

<style>
.vue-swatches__trigger__wrapper {
  @apply w-full;
}
</style>
