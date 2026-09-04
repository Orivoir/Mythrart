import { X } from "lucide-react"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { useEffect, useState } from "react"

export interface RemoveButtonProps {
  refInput: React.RefObject<HTMLInputElement | null>
}

export default function RemoveButton({refInput}: RemoveButtonProps) {

  const [isFocused, setIsFocused] = useState<boolean>(false)

  const onFocus = () => setIsFocused(true)
  const onBlur = () => setIsFocused(false)
  const onRemove = () => refInput.current!.value = ""

  useEffect(() => {

    if(!refInput.current) return

    refInput.current?.addEventListener("focus", onFocus);
    refInput.current?.addEventListener("blur", onBlur);

    return () => {
      refInput.current?.removeEventListener("focus", onFocus);
      refInput.current?.removeEventListener("blur", onBlur);
    }


  }, [refInput])

  return (
    <>
    {isFocused && (
      <ButtonWithIcon
        icon={X}
        iconSize="sm"
        variant="outline"
        size="icon"
        aria-label="Fermer la recherche"
        className="
          absolute
          right-2
          top-1/2
          size-6
          -translate-y-1/2
          rounded-full
        "
        onMouseDown={(event) => event.preventDefault()}
        onClick={onRemove}
      />
    )}
    </>
  )
}