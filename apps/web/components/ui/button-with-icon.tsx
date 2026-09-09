import * as React from "react"
import { Slottable } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import type { LucideIcon } from "lucide-react"

type IconPosition = "left" | "right"

interface ButtonWithIconProps
  extends React.ComponentProps<typeof Button> {
  icon: LucideIcon
  iconSize?: "sm" | "md" | "lg"
  iconPosition?: IconPosition
  iconClassName?: string
}

export function ButtonWithIcon({
  icon: Icon,
  iconSize = "md",
  iconPosition = "left",
  iconClassName,
  children,
  ...props
}: ButtonWithIconProps) {
  const icon = (
    <Icon
      className={cn(
        iconSize === "sm" && "size-3.5",
        iconSize === "md" && "size-4",
        iconSize === "lg" && "size-5",
        "shrink-0",
        "mx-2",
        iconClassName,
      )}
      aria-hidden="true"
    />
  )

  return (
    <Button {...props}>
      {iconPosition === "left" && icon}

      <Slottable>
        {children}
      </Slottable>

      {iconPosition === "right" && icon}
    </Button>
  )
}