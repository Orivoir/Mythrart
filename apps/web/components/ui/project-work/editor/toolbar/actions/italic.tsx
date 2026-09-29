import {useTranslations} from "next-intl"
import {ButtonWithIcon} from "@/components/ui/button-with-icon"
import {useCurrentEditor} from "@tiptap/react"
import {Italic} from "lucide-react"
import {useState} from "react"

export default function ItalicAction() {

  const {editor} = useCurrentEditor()
  const t = useTranslations("Editor.Toolbar.Italic")
  const computeIsActive = () => editor?.isActive("italic") ?? false

  const [isActive, setIsActive] = useState(() => computeIsActive())

  const onClick = () => {
    editor?.chain().focus().toggleItalic().run()
    setIsActive(computeIsActive())
  }

  return (
    <ButtonWithIcon
      type="button"
      variant={isActive ? "accent-outline": "ghost"}
      size="default"
      icon={Italic}
      iconSize="lg"
      aria-label={t("AriaLabel")}
      title={t("Title")}
      onClick={onClick}
    />
  )
}