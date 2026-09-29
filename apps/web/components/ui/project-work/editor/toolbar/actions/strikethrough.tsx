import {ButtonWithIcon} from "@/components/ui/button-with-icon"
import {useCurrentEditor} from "@tiptap/react"
import {Strikethrough} from "lucide-react"
import {useState} from "react"
import {useTranslations} from "next-intl"

export default function StrikethroughAction() {
  const {editor} = useCurrentEditor()
  const t = useTranslations("Editor.Toolbar.Strikethrough")
  const computeIsActive = () => editor?.isActive("strike") ?? false

  const [isActive, setIsActive] = useState(() => computeIsActive())

  const onClick = () => {
    editor?.chain().focus().toggleStrike().run()
    setIsActive(computeIsActive())
  }

  return (
    <ButtonWithIcon
      type="button"
      variant={isActive ? "accent-outline": "ghost"}
      size="default"
      icon={Strikethrough}
      iconSize="lg"
      aria-label={t("AriaLabel")}
      title={t("Title")}
      onClick={onClick}
    />
  )
}