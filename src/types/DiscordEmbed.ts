/** Embed footer */
export interface DiscordEmbedFooter {
  icon_url: string
  text: string
}

/** Image URL for embed images and thumbnails */
export interface DiscordEmbedImage {
  url: string | undefined
}

/** Describes custom author information for an embed */
export interface DiscordEmbedAuthor {
  name: string
  url: string
  icon_url: string
}

/** Describes a field attached to a Discord embed */
export interface DiscordEmbedField {
  name: string
  value: string
}

/** Describes a valid Discord embed */
export interface DiscordEmbed {
  /** Embed Title */
  title?: string | undefined
  /** Embed Description */
  description?: string | undefined
  /** Title Link */
  url?: string | undefined
  /** Color of the side border */
  color?: number
  /** Custom datetime to show in embed footer */
  timestamp?: Date | undefined
  /** Embed footer */
  footer?: DiscordEmbedFooter | undefined
  /** Right side embed thumbnail */
  thumbnail?: DiscordEmbedImage | undefined
  /** Main embed image(or gif) */
  image?: DiscordEmbedImage | undefined
  /** Embed author information */
  author?: DiscordEmbedAuthor | undefined
  /** Embed fields */
  fields?: DiscordEmbedField[] | undefined
}
