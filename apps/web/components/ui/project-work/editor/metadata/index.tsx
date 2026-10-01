import {useCurrentEditor} from "@tiptap/react"
import {useEffect, useState} from "react"

export default function ProjectWorkEditorMetadata() {

  const {editor} = useCurrentEditor()

  const [characters, setCharacters] = useState(0)
  const [words, setWords] = useState(0)

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
    <div className="my-6 mx-3">
      <p>Characters: {characters}</p>
      <p>Words: {words}</p>
    </div>
  )
}