import {useTranslations} from "next-intl"
import {ButtonWithIcon} from "@/components/ui/button-with-icon"
import {useCurrentEditor} from "@tiptap/react"
import {Underline} from "lucide-react"
import {useState} from "react"

export default function UnderlineAction() {

  const {editor} = useCurrentEditor()
  const t = useTranslations("Editor.Toolbar.Underline")
  const computeIsActive = () => editor?.isActive("underline") ?? false

  const [isActive, setIsActive] = useState(() => computeIsActive())

  const onClick = () => {
    editor?.chain().focus().toggleUnderline().run()
    setIsActive(computeIsActive())
  }

  return (
    <ButtonWithIcon
      type="button"
      variant={isActive ? "accent-outline": "ghost"}
      size="default"
      icon={Underline}
      iconSize="lg"
      aria-label={t("AriaLabel")}
      title={t("Title")}
      onClick={onClick}
    />
  )
}