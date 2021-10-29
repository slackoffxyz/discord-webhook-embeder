<script lang="ts" setup>
import MarkdownIt from 'markdown-it'
import Moment from 'moment'
import { DiscordEmbed } from '~/types/DiscordEmbed'

const markdown = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: true,
})

const props = defineProps<{embed: DiscordEmbed}>()

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

const parseMarkdown = (text: string) => {
  if (!text) return ''
  markdown.render(text as string)
}

const footerText = (text: string, timestamp: Date | undefined) => {
  let time: any = Moment(timestamp !== undefined ? timestamp : null)
  time = time.isValid() ? time.format('ddd MMM Do, YYYY [at] h:mm A') : null

  return [text, time].filter(Boolean).join(' | ')
}
</script>

<template>
  <div class="accessory">
    <div class="embed-wrapper">
      <div class="embed-color-pill" :style="{'background-color': compColor}" />
      <div class="embed embed-rich">
        <div class="embed-content">
          <div class="embed-content-inner">
            <div class="embed-author">
              <img v-if="props.embed.author?.icon_url" :src="props.embed.author.icon_url" role="presentation" class="embed-author-icon" />
              <span v-if="props.embed.author?.name" class="embed-author-name">{{ props.embed.author?.name }}</span>
            </div>
            <div v-if="props.embed.title" class="embed-title">
              {{ parseMarkdown(props.embed.title) }}
            </div>
            <div v-if="props.embed.description" class="embed-description markup">
              {{ parseMarkdown(props.embed.description) }}
            </div>
            <!-- fields -->
            <div v-if="props.embed.fields" class="embed-fields">
              <div v-for="(field, index) in props.embed.fields" :key="index">
                <div class="embed-field">
                  <div class="embed-field-name">
                    {{ parseMarkdown(field.name) }}
                  </div>
                  <div class="embed-field-value markup">
                    {{ parseMarkdown(field.value) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img
            v-if="props.embed.thumbnail?.url"
            :src="props.embed.thumbnail.url"
            role="presentation"
            class="embed-rich-thumb"
            style="max-width: 80px;max-height: 80px;"
          />
        </div>
        <a v-if="props.embed.image?.url" class="embed-thumbnail embed-thumbnail-rich">
          <img class="image" role="presentation" :src="props.embed.image?.url" />
        </a>
        <div v-if="props.embed.footer">
          <img
            v-if="props.embed.footer?.icon_url"
            :src="props.embed.footer?.icon_url"
            class="embed-footer-icon"
            role="presentation"
            width="20"
            height="20"
          />
          <span v-if="props.embed.footer?.text" class="embed-footer">
            {{ footerText(props.embed.footer?.text, props.embed.timestamp) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
