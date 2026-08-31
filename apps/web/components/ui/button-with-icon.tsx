import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import type { LucideIcon } from "lucide-react"

type IconPosition = "left" | "right"

interface ButtonWithIconProps
  extends React.ComponentProps<typeof Button> {
  icon: LucideIcon,
  iconSize?: "sm" | "md" | "lg"
  iconPosition?: IconPosition
  iconClassName?: string
}


export function ButtonWithIcon({
  icon: Icon,
  iconPosition = "left",
  iconSize = "md",
  iconClassName,
  children,
  className,
  ...props
}: ButtonWithIconProps) {

  const iconSizeClass = {
    "sm": "size-4",
    "md": "size-5",
    "lg": "size-6"
  }[iconSize]

  const iconRenderer = <Icon className={cn(iconSizeClass, "shrink-0", iconClassName)} aria-hidden="true" />

  return (
    <Button
      className={cn(
        "gap-2",
        className
      )}
      {...props}
    >
      {iconPosition === "left" && iconRenderer}

      {children}

      {iconPosition === "right" && iconRenderer}
    </Button>
  )
}