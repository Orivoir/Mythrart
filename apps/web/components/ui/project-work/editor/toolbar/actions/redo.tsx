import {Redo} from "lucide-react"
import {useCurrentEditor} from "@tiptap/react"
import {useTranslations} from "next-intl"
import {ButtonWithIcon} from "@/components/ui/button-with-icon"
import { useUndoRedo } from "@/components/tiptap-ui/undo-redo-button"

export default function RedoAction() {

  const t = useTranslations("Editor.Toolbar.Redo")

  const {editor} = useCurrentEditor()

  const {canExecute, handleAction} = useUndoRedo({
    editor,
    action: "redo"
  })

  const disabled = !canExecute

  return (
    <ButtonWithIcon
      type="button"
      variant="ghost"
      size="default"
      icon={Redo}
      iconSize="lg"
      aria-label={t("AriaLabel")}
      title={t("Title")}
      onClick={handleAction}
      disabled={disabled}
    />
  )
}