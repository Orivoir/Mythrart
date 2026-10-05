import { useRef, useEffect } from "react"

export default function FormDescribe({objective}: {objective: string}) {

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = objective
    }
  }, [objective])

  return (
    <div className="mb-4 flex flex-col gap-1">
      <label htmlFor="scene-objective">
        Objectif
      </label>
      <textarea
        id="scene-objective"
        name="scene-objective"
        spellCheck={false}
        ref={textareaRef}
        className="resize-none border rounded p-2"
        defaultValue={objective}
      />
    </div>
  )
}