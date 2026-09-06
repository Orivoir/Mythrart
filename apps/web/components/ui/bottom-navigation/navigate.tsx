import type { BottomNavigationItemProps } from "./item"
import { AppLink } from "@/components/ui/app-link"

export interface NavigateProps extends Omit<BottomNavigationItemProps, "icon" | "label" | "onClick"> {
  content: React.ReactNode
}

export default function Navigate({
  content,
  active,
  href
}: NavigateProps) {

  return (
    <AppLink
      href={href ?? "#"}
      aria-current={active ? "page" : undefined}
      className="
        relative
        flex
        min-w-0
        flex-1
        flex-col
        items-center
        justify-center
        gap-1
        px-2
        py-2
        text-center
        transition-colors
        duration-150
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary/30
      "
    >
      {content}
    </AppLink>
  )
}