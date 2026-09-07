"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        "px-6 pt-6",
        className,
      )}
      {...props}
    />
  )
}