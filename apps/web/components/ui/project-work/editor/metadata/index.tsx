import {useCurrentEditor} from "@tiptap/react"
import {useEffect, useState} from "react"
import {HelperText} from "@/components/ui/Typography"
import {useTranslations} from "next-intl"

export default function ProjectWorkEditorMetadata() {

  const {editor} = useCurrentEditor()

  const [characters, setCharacters] = useState(0)
  const [words, setWords] = useState(0)
  const t = useTranslations("Editor.Metadata")

  const onUpdate = () => {

    if (!editor) return

    setCharacters(editor.storage.characterCount.characters())
    setWords(editor.storage.characterCount.words())
  }

  useEffect(() => {

    if (!editor) return

    onUpdate()

    editor.on("update", onUpdate)

    return () => {
      editor.off("update", onUpdate)
    }
  }, [editor])

  return (
    <div className="my-6 ml-6">
      <div className="flex flex-row gap-6">
        <HelperText>{characters} {t("Characters")}</HelperText>
        <HelperText>{words} {t("Words")}</HelperText>
      </div>


    </div>
  )
}