import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  compact?: boolean
  withFit?: boolean
}

export function Input({
  className,
  compact = false,
  withFit = false,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        `
          rounded-md
          border-1
          border-muted/40
          bg-background
          outline-none
          transition-colors
          focus:border-accent/40
        `,
        withFit
          ? "w-auto [field-sizing:content]"
          : "w-full",
        compact
          ? "px-2 py-0.5 text-sm"
          : "px-4 py-2",
        className,
      )}
      {...props}
    />
  )
}