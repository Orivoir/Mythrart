import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

export function DialogDescription({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(
        "text-sm",
        "text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}