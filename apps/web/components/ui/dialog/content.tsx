"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DialogOverlay } from "./overlay"

export const DialogPortal = DialogPrimitive.Portal

export interface DialogContentProps
  extends React.ComponentPropsWithRef<typeof DialogPrimitive.Content> {
  showClose?: boolean
}

export function DialogContent({
  className,
  children,
  showClose = true,
  ref,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50",
          "w-[calc(100%-2rem)] max-w-lg",
          "-translate-x-1/2 -translate-y-1/2",
          "overflow-hidden",
          "rounded-xl",
          "border",
          "bg-background",
          "shadow-xl",
          "outline-none",
          "data-[state=open]:animate-in",
          "data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0",
          "data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95",
          "data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      >
        {children}

        {showClose && (
          <DialogPrimitive.Close asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Fermer"
              className="
                absolute
                right-3
                top-3
                size-8
                text-muted-foreground
              "
            >
              <X
                className="size-4"
                aria-hidden="true"
              />
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}
