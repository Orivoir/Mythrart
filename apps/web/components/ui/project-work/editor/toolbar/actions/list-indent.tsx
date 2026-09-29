"use client"

import { ListIndentIncrease } from "lucide-react"
import { useCurrentEditor, useEditorState } from "@tiptap/react"
import { useTranslations } from "next-intl"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"

export default function ListIndentAction() {
  const t = useTranslations("Editor.Toolbar.ListIndent")

  const { editor } = useCurrentEditor()

  const canIndent = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return false
      }

      return editor.can().sinkListItem("listItem")
    },
  })

  const onClick = () => {
    editor
      ?.chain()
      .focus()
      .sinkListItem("listItem")
      .run()
  }

  return (
    <ButtonWithIcon
      type="button"
      variant="ghost"
      size="default"
      icon={ListIndentIncrease}
      iconSize="lg"
      aria-label={t("AriaLabel")}
      title={t("Title")}
      onClick={onClick}
      disabled={!canIndent}
    />
  )
}