import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { Ellipsis } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MoreOptionsBtn() {

  const onMoreOptions = () => {}

  return (
    <ButtonWithIcon
      type="button"
      icon={Ellipsis}
      aria-label="Plus d'options"
      onClick={onMoreOptions}
      className={cn(
        "absolute right-2 top-2 z-10",
        "size-7 p-0",
        "rounded-md",
        "bg-background/90",
        "text-foreground/70",
        "shadow-sm",
        "hover:bg-background hover:text-foreground",
      )}
    />
  )
}