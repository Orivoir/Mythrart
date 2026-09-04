
import { useState } from "react"

export default function EntryText({refInput}: {refInput: React.RefObject<HTMLInputElement | null>}) {

  const [value, setValue] = useState("")

  return (
  <>
    <input
        type="text" 
        ref={refInput}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Rechercher..."
        className="
          h-10
          w-full
          rounded-lg
          border
          border-border
          bg-background
          pl-11
          pr-12
          text-sm
          text-foreground
          outline-none
          placeholder:text-muted-foreground
          transition-colors
          focus:border-primary
          focus:ring-2
          focus:ring-primary/10
        "
      />
  </>
  )
}