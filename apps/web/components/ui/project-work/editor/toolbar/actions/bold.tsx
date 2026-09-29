"use client"
import {useTranslations} from "next-intl"
import {ButtonWithIcon} from "@/components/ui/button-with-icon"
import {useCurrentEditor} from "@tiptap/react"
import {Bold} from "lucide-react"
import {useState} from "react"

export default function BoldAction() {

  const {editor} = useCurrentEditor()

  const t = useTranslations("Editor.Toolbar.Bold")
  const computeIsActive = () => editor?.isActive("bold") ?? false

  const [isActive, setIsActive] = useState(() => computeIsActive())

  const onClick = () => {
    editor?.chain().focus().toggleBold().run()
    setIsActive(computeIsActive())
  }

  return (
    <ButtonWithIcon
      type="button"
      variant={isActive ? "accent-outline": "ghost"}
      size="default"
      icon={Bold}
      iconSize="lg"
      aria-label={t("AriaLabel")}
      title={t("Title")}
      onClick={onClick}
    />
  )
}