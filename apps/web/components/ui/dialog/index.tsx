"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

export { DialogOverlay } from "./overlay"
export { DialogContent } from "./content"
export { DialogHeader } from "./header"
export { DialogFooter } from "./footer"
export { DialogTitle } from "./title"
export { DialogDescription } from "./describe"