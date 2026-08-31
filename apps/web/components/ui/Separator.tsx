"use client"

import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

interface SeparatorProps {
  decorative?: boolean
  orientation?: "horizontal" | "vertical"
  className?: string
}

export function Separator({
  decorative = true,
  orientation = "horizontal",
  className,
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal"
          ? "h-px flex-1"
          : "w-px self-stretch",
        className
      )}
    />
  )
}