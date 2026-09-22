"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import { extensions } from "@mythrart/editor-extensions"

export function Editor() {
  const editor = useEditor({
    extensions,
    content: "",
  })

  if (!editor) {
    return null
  }

  return (
    <div className="flex h-full w-full justify-center overflow-y-auto">
      <div className="w-full max-w-4xl px-8 py-12">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}