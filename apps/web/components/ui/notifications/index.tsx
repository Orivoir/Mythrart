import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Badge,
  type BadgePosition,
  type BadgeVariant,
} from "@/components/ui/badge"

export type NotificationProps = {
  count?: number
  variant?: BadgeVariant
  position?: BadgePosition
  onClick?: () => void
}

export function Notification({
  count = 0,
  variant = "full",
  position = {
    x: "end",
    y: "start",
  },
  onClick,
}: NotificationProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label="Notifications"
      className="relative"
    >
      <Bell
        className="size-5"
        strokeWidth={1.8}
        aria-hidden="true"
      />

      <Badge
        count={count}
        variant={variant}
        position={position}
      />
    </Button>
  )
}
