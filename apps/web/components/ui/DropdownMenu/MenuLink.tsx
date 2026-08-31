import * as React from "react"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"

interface DropdownMenuLinkProps {
  children: React.ReactNode
  className?: string
}


export function DropdownMenuLink({
  children,
  className,
}: DropdownMenuLinkProps) {
  return (
    <DropdownMenuItem
      className={cn(
        "flex",
        "cursor-pointer",
        "rounded-md",
        "p-2",
        "text-xs",

        "outline-none",

        "transition-colors",
        "duration-150",

        "hover:bg-accent/7",
        "hover:text-accent",

        className
      )}
      asChild
    >
      {children}
    </DropdownMenuItem>
  )
}