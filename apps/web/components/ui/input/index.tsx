import * as React from "react"

import { cn } from "@/lib/utils"

export function Input({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        `
          w-full
          rounded-md
          border-2
          border-muted
          bg-background
          px-4
          py-2
          outline-none
          transition-colors
          focus:border-accent/40
        `,
        className,
      )}
      {...props}
    />
  )
}