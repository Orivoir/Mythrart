import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"


interface AppLinkProps
  extends React.ComponentProps<typeof Link> {
  mutedOnHover?: boolean
}


export function AppLink({
  className,
  mutedOnHover = true,
  children,
  ...props
}: AppLinkProps) {
  return (
    <Link
      className={cn(
        "text-foreground",
        "transition-colors duration-150",
        mutedOnHover && [
          "hover:text-muted-foreground",
        ],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}