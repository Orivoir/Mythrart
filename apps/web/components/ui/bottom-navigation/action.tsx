import type { BottomNavigationItemProps } from "./item"
import { Button } from "@/components/ui/button"

export interface ActionProps extends Omit<BottomNavigationItemProps, "icon" | "label" | "href" | "active"> {
  content: React.ReactNode
}

export default function Action({
  content,
  onClick
}: ActionProps) {

  return (
    <Button
      type="button"
      variant="ghost"
      size="default"
      onClick={onClick}
      className="
        relative
        min-w-0
        flex-1
        flex-col
        gap-1
        rounded-none
        px-2
        py-2
        h-auto
        text-center
      "
    >
      {content}
    </Button>
  )
}