"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

export interface TooltipProps {
  children: React.ReactElement
  content: React.ReactNode
  side?: TooltipPrimitive.TooltipContentProps["side"]
  align?: TooltipPrimitive.TooltipContentProps["align"]
  sideOffset?: number
  delayDuration?: number
  className?: string
}

export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 6,
  delayDuration = 300,
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            className={cn(
              "z-50",
              "max-w-xs",
              "rounded-sm",
              "border border-border",
              "bg-foreground",
              "px-3 py-2",
              "text-xs text-background",
              "shadow-sm",
              "animate-in fade-in-0 zoom-in-95",
              "data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0",
              "data-[state=closed]:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-1",
              "data-[side=left]:slide-in-from-right-1",
              "data-[side=right]:slide-in-from-left-1",
              "data-[side=top]:slide-in-from-bottom-1",
              className,
            )}
          >
            {content}

            <TooltipPrimitive.Arrow
              className="fill-foreground"
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}