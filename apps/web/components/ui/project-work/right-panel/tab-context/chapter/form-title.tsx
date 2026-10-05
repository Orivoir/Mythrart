import { Input } from "@/components/ui/input"
import type { SyntheticEvent } from "react"
import { useRef, useEffect } from "react"

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

    if(
      value.length > 0 &&
      value !== title &&
      value.length <= 100
    ) {
      // should allow update position here
      console.log(`Updating chapter title from "${title}" to "${value}"`)
    }
  }

  return (
  <div className="mb-4 flex flex-col gap-1">
    <label htmlFor="chapter-title">
        Titre
    </label>
    <Input
      ref={inputRef}
      name="chapter-title"
      spellCheck={false}
      compact
      onBlur={onBlur}
      defaultValue={title}
    />
  </div>
  )
}