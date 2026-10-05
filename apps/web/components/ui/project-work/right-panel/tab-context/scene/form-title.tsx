import { Input } from "@/components/ui/input"
import type { SyntheticEvent } from "react"
import { useEffect, useRef } from "react"

interface FormTitleProps {
  title: string
}

export default function FormTitle({ title }: FormTitleProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = title
    }
  }, [title])

  const onBlur = (event: SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value.trim()

    if (
      value.length > 0 &&
      value !== title &&
      value.length <= 100
    ) {
      console.log(
        `Updating chapter title from "${title}" to "${value}"`,
      )
    }
  }

  return (
    <div className="mb-4 flex flex-col gap-1">
      <label htmlFor="scene-title">
        Titre
      </label>

      <Input
        ref={inputRef}
        name="scene-title"
        spellCheck={false}
        compact
        onBlur={onBlur}
        defaultValue={title}
      />
    </div>
  )
}