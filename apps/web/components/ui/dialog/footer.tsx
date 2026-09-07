import * as React from "react"
import { cn } from "@/lib/utils"

export function DialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3",
        "border-t",
        "px-6 py-4",
        className,
      )}
      {...props}
    />
  )
}