import { PasteRule, PasteRuleFinder, Node } from '@tiptap/core'
import { DOMParser, Fragment, Slice, Schema } from 'prosemirror-model'
import { Plugin, Selection } from 'prosemirror-state'

const emoteRx = /\<\:\w*\:(\d*)\>/g

const pasteEmote = () => {
  return new Plugin({
    props: {
      handlePaste(view, event, slice) {
        const items = Array.from(event.clipboardData?.items || [])
        const { schema }: {schema: Schema} = view.state

        items.forEach((item) => {
          item.getAsString((str) => {
            const matches = emoteRx.exec(str)
            if (matches && matches[1]) {
              event.preventDefault()
              const match = matches[1]

              // Create image
              const node = schema.nodes.image.create({
                src: `https://cdn.discordapp.com/emojis/${match}?size=32`,
                title: str,
              })

              // Insert image into document
              const node2 = schema.nodes.span.create({})

              const transact = view.state.tr.insert(view.state.selection.head, node)
              view.dispatch(transact)

              // Basically a bunch of stuff to force the cursor to the right side
              // of the image and add a space, as it is impossible to move it there manually
              let selection = Selection.atEnd(view.state.doc)
              let tr = view.state.tr.setSelection(selection)
              let state = view.state.apply(tr)
              view.updateState(state)

              view.dispatch(view.state.tr.insert(selection.head, node2))

              selection = Selection.atEnd(view.state.doc)
              tr = view.state.tr.setSelection(selection)
              state = view.state.apply(tr)
              view.updateState(state)

              view.dispatch(tr.insertText(' '))
            }
          })
        })

        return true
      },
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
  addProseMirrorPlugins() {
    return [
      pasteEmote(),
    ]
  },
})

export default DiscordEmotes
