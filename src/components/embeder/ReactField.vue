<script lang="ts" setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import Text from '@tiptap/extension-text'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import OneLiner from '~/extensions/TipTapOneLiner'
import DiscordEmotes from '~/extensions/TipTapEmotes'

const props = defineProps<{modelValue: String}>()
const emit = defineEmits(['update:modelValue'])

const editor = ref<Editor | undefined>()

onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue as any,
    onUpdate: () => {
      emit('update:modelValue', editor.value?.getText())
    },
    extensions: [
      Document,
      Text,
      OneLiner,
      Paragraph,
      DiscordEmotes,
    ],
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

watch(props, (n) => {
  if (editor.value?.getText() === n.modelValue) return

  editor.value?.commands.setContent(n.modelValue as any, false)
})
</script>

<template>
  <div>
    <EditorContent :editor="editor" />
  </div>
</template>
