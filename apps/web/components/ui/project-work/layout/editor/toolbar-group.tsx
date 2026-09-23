import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EditorToolbarGroupProps {
  children: ReactNode
  className?: string
}

export function EditorToolbarGroup({
  children,
  className,
}: EditorToolbarGroupProps) {
    return (
      <div
        className={cn(
          "flex items-center gap-0.5",
          className,
        )}
      >
        {children}
      </div>
    )
}
