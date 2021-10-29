<script lang="ts" setup>
import {
  DiscordInteraction,
  DiscordMarkdown,
  DiscordMention,
  DiscordMessage,
  DiscordMessages,
  DiscordReaction,
  DiscordReactions,
  DiscordEmbed,
} from '@discord-message-components/vue'
import { DiscordEmbed as Embed } from '~/types/DiscordEmbed'

const props = defineProps<{embed: Embed}>()

const extractRGB = (i: number) => {
  return {
    r: (i >> 16) & 0xFF,
    g: (i >> 8) & 0xFF,
    b: i & 0xFF,
  }
}
const compColor = computed(() => {
  if (!props.embed.color) return 'rgba(0,0,0,0)'

  const c = extractRGB(props.embed.color)
  return `rgba(${c.r},${c.g},${c.b},1)`
})

const args = {
  embedTitle: props.embed.title,
  timestamp: props.embed.timestamp,
  image: props.embed.image?.url,
  borderColor: compColor.value,
}
</script>

<template>
  <div v-if="props.embed" class="text-left">
    <DiscordMessages>
      <DiscordMessage>
        <template #embeds>
          <DiscordEmbed
            :embed-title="props.embed.title"
            :timestamp="props.embed.timestamp"
            :image="props.embed.image?.url"
            :border-color="compColor"
          >
            {{ props.embed.description }}
          </DiscordEmbed>
        </template>
      </DiscordMessage>
    </DiscordMessages>
  </div>
</template>
