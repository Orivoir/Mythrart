"use client"

import { useEffect, useState } from "react"
import { useCurrentEditor, useEditorState } from "@tiptap/react"
import { Link as LinkIcon } from "lucide-react"
import { useAdaptiveSurface } from "@/components/hooks/useAdaptiveSurface"

import LinkContent from "./content"
import TriggerButton from "./trigger"

export default function LinkAction() {

  const { editor } = useCurrentEditor()
  const { Surface } = useAdaptiveSurface()
  const [urlError, setUrlError] = useState<boolean>(false)

  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")

  const isActive = useEditorState({
    editor,
    selector: ({ editor }) => {
      return editor?.isActive("link") ?? false
    },
  })

  useEffect(() => {
    if (!open || !editor) {
      return
    }

    setUrl(editor.getAttributes("link").href ?? "")
  }, [open, editor])

  const onSubmit = () => {
    if (!editor) return

    const value = url.trim()

    if (!value) return

    let normalizedUrl = value

    // Ajoute HTTPS si aucun protocole n'est fourni
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    try {
      const parsedUrl = new URL(normalizedUrl)

      // On exige un hostname réel
      if (!parsedUrl.hostname.includes(".")) {
        setUrlError(true)
        return;
      }

      editor
        .chain()
        .focus()
        .setLink({ href: parsedUrl.toString() })
        .run()

      setUrl(parsedUrl.toString())
      setOpen(false)
      setUrlError(false)
    } catch {
      // URL invalide
      setUrlError(true)
      return;
    }
  }

  const onUnsetLink = () => {
    editor
      ?.chain()
      .focus()
      .unsetLink()
      .run()

    setOpen(false)
  }

  return (
    <Surface
      trigger={
        <TriggerButton icon={LinkIcon} isActive={!!isActive} />
      }
      open={open}
      onOpenChange={setOpen}
    >
      <LinkContent
        url={url}
        isActive={!!isActive}
        onUrlChange={setUrl}
        onSubmit={onSubmit}
        onUnsetLink={onUnsetLink}
        onCancel={() => setOpen(false)}
      />
    </Surface>
  )
}