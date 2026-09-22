import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProjectLeftPanelItemIcon({isActive}: {isActive: boolean}) {

  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md",
        isActive
          ? "bg-soft-blue text-accent"
          : "text-muted-foreground",
      )}
    >
      <FileText className="size-4" />
    </span>
  )
}