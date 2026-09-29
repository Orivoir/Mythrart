import Mention from "@tiptap/extension-mention"

const EntityMention = Mention.extend({
  name: "mention",
}).configure({
  suggestion: {
    char: "@"
  }
})

export { EntityMention }
