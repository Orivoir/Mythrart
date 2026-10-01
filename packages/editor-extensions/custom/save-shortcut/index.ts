import { Extension } from "@tiptap/core"
import type { JSONContent } from "@tiptap/core"

export interface SaveShortcutOptions {
  onSave: (content: JSONContent) => void
}

export const SaveShortcut = Extension.create<SaveShortcutOptions>({
  name: "saveShortcut",

  addOptions() {
    return {
      onSave: () => {},
    }
  },

  addKeyboardShortcuts() {
    return {
      "Mod-s": () => {
        this.options.onSave(this.editor.getJSON())
        return true
      },
    }
  },
})