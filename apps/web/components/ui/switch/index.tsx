"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

export interface SwitchProps
  extends React.ComponentPropsWithRef<
    typeof SwitchPrimitive.Root
  > {}

export function Switch({
  className,
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex shrink-0",
        "h-6 w-11",
        "cursor-pointer",
        "items-center",
        "rounded-full",
        "border border-transparent",
        "bg-disabled",
        "transition-colors duration-150",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring/30",
        "data-[state=checked]:bg-accent",
        "data-[state=unchecked]:bg-disabled",
        "disabled:pointer-events-none",
        "disabled:cursor-not-allowed",
        "disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block",
          "size-5",
          "rounded-full",
          "bg-background",
          "shadow-sm",
          "transition-transform duration-150",
          "translate-x-0.5",
          "data-[state=checked]:translate-x-[22px]",
        )}
      />
    </SwitchPrimitive.Root>
  )
}