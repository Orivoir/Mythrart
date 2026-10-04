"use client"

import type { Editor } from "@tiptap/react"
import { useCurrentEditor, useEditorState } from "@tiptap/react"
import { useCallback, useSyncExternalStore } from "react"

function getActivePageEditor(editor: Editor): Editor | null {
  const storage = editor.storage as unknown as Record<string, unknown>
  const pages = storage.pages as { activeEditor?: Editor | null } | undefined
  if (!pages || !("activeEditor" in pages)) return null
  return pages.activeEditor ?? null
}

export function useTiptapEditor(providedEditor?: Editor | null): {
  editor: Editor | null
  editorState?: Editor["state"]
  canCommand?: Editor["can"]
} {
  const { editor: coreEditor } = useCurrentEditor()
  const mainEditor = providedEditor ?? coreEditor

  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!mainEditor) return () => {}

      let watched: Editor | null = null
      const watchDestroy = () => {
        const active = getActivePageEditor(mainEditor)
        if (active === watched) return
        watched?.off("destroy", onChange)
        watched = active
        watched?.on("destroy", onChange)
      }
      const updateHandler = () => {
        watchDestroy()
        onChange()
      }

      watchDestroy()
      mainEditor.on("update", updateHandler)
      mainEditor.on("selectionUpdate", updateHandler)

      return () => {
        mainEditor.off("update", updateHandler)
        mainEditor.off("selectionUpdate", updateHandler)
        watched?.off("destroy", onChange)
      }
    },
    [mainEditor]
  )

  const getSnapshot = useCallback(() => {
    if (!mainEditor) return null
    const active = getActivePageEditor(mainEditor)
    return active && !active.isDestroyed ? active : null
  }, [mainEditor])

  const storageEditor = useSyncExternalStore(subscribe, getSnapshot, () => null)

  const editorState = useEditorState({
    editor: storageEditor ?? mainEditor,
    selector(context) {
      if (!context.editor) {
        return { editor: null, editorState: undefined, canCommand: undefined }
      }

      return {
        editor: context.editor,
        editorState: context.editor.state,
        canCommand: context.editor.can,
      }
    },
  })

  return editorState ?? { editor: null }
}
