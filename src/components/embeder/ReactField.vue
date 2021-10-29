<script lang="ts" setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import Text from '@tiptap/extension-text'
import Document from '@tiptap/extension-document'
import Image from '@tiptap/extension-image'
import { Span } from '~/extensions/TipTapSpan'
import OneLiner from '~/extensions/TipTapOneLiner'
import DiscordEmotes from '~/extensions/TipTapEmotes'

const props = defineProps<{modelValue: String}>()
const emit = defineEmits(['update:modelValue', 'realValue'])

const editor = ref<Editor | undefined>()

onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue as any,
    onUpdate: () => {
      emit('update:modelValue', editor.value?.getJSON())
    },
    extensions: [
      Document,
      Text,
      OneLiner,
      Span,
      Image,
      DiscordEmotes,
    ],
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

watch(props, (n) => {
  if (editor.value?.getJSON() === n.modelValue) return

  editor.value?.commands.setContent(n.modelValue as any, false)
})
</script>

<template>
  <div>
    <EditorContent :editor="editor" />
  </div>
</template>

<style>
p {
  display: inline
}
.ProseMirror {
  @apply flex flex-row items-center pr-8 bg-emb-dark-800 border-emb-dark-900 focus:border-blurple shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none;
}
img {
  width: 16px;
  height: auto;
}
</style>
