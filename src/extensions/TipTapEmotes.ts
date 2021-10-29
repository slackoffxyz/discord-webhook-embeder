import { PasteRule, PasteRuleFinder, Node } from '@tiptap/core'
import { DOMParser, Fragment, Slice } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'

const emoteRx = /\<\:\w*\:(\d*)\>/g

function nodePasteRule(regexp, type, getAttrs) {
  const handler = (fragment) => {
    const nodes = []

    fragment.forEach((child) => {
      if (child.isText) {
        const { text } = child
        let pos = 0
        let match

        // eslint-disable-next-line
          while ((match = regexp.exec(text)) !== null) {
          if (match[0]) {
            const start = match.index
            const end = start + match[0].length
            const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs

            // adding text before markdown to nodes
            if (start > 0)
              nodes.push(child.cut(pos, start))

            // create the node
            nodes.push(type.create(attrs))

            pos = end
          }
        }

        // adding rest of text to nodes
        if (pos < text.length)
          nodes.push(child.cut(pos))
      }
      else {
        nodes.push(child.copy(handler(child.content)))
      }
    })

    return Fragment.fromArray(nodes)
  }

  return new Plugin({
    props: {
      transformPasted: slice => new Slice(handler(slice.content), slice.openStart, slice.openEnd),
    },
  })
}

function emotePasteRule(config: {
  find: PasteRuleFinder
  replace: string
}) {
  return new PasteRule({
    find: config.find,
    handler: ({ state, range, match }) => {
      const { selection } = state
      let insert = config.replace
      const start = range.from
      const end = range.to

      // Regex group
      const newText = emoteRx.exec(match[0])
      if (newText) {
        insert = `https://cdn.discordapp.com/emojis/${newText[1]}`
        const img = document.createElement('img')
        img.src = insert
        img.width = 64
        img.height = 64

        const slice = DOMParser.fromSchema(state.schema).parseSlice(img)
        // state.tr.replace(start, end, slice)
        state.tr.insert(selection.head, slice.content)
      }

      // state.tr.replace(start, end, ) //.insertText(insert, start, end)
    },
  })
}

const DiscordEmotes = Node.create({
  name: 'discordEmotes',
  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: any }) {
    return ['img', HTMLAttributes, 0]
  },
  parseHTML() {
    return [
      { tag: 'img[src]' },
    ]
  },
  addPasteRules() {
    return [
      nodePasteRule(emoteRx, this.type, match => {
        src: `https://cdn.discordapp.com/emojis/${match[1]}`,
      })
    ]
  },
})

/* const DiscordEmotes = Mark.create({
  name: 'discordEmotes',
  renderHTML({ HTMLAttributes }: { HTMLAttributes: any }) {
    return ['img', HTMLAttributes, 0]
  },
  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: { default: '16px' },
      height: { default: '16px' },
      style: { default: 'display: inline' },
    }
  },
  parseHTML() {
    return [
      { tag: 'img[src]' },
    ]
  },
  addPasteRules() {
    return [
      markPasteRule({
        find: emoteRx,
        type: this.type,
        getAttributes: match => ({
          src: `https://cdn.discordapp.com/emojis/${match[1]}`,
        }),
      }),
    ]
  },
})
*/

export default DiscordEmotes

/* emotePasteRule({
        find: emoteRx,
        replace: 'k',
      }), */
