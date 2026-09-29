"use client"

import {Undo} from "lucide-react"
import {useCurrentEditor} from "@tiptap/react"
import {useTranslations} from "next-intl"
import {ButtonWithIcon} from "@/components/ui/button-with-icon"
import { useUndoRedo } from "@/components/tiptap-ui/undo-redo-button"
export default function UndoAction() {

  const t = useTranslations("Editor.Toolbar.Undo")

  const {editor} = useCurrentEditor()

  const {canExecute, handleAction} = useUndoRedo({
    editor,
    action: "undo"
  })

  const disabled = !canExecute


  return (
    <ButtonWithIcon
      type="button"
      variant="ghost"
      size="default"
      icon={Undo}
      iconSize="lg"
      aria-label={t("AriaLabel")}
      title={t("Title")}
      onClick={handleAction}
      disabled={disabled}
    />
  )
}
