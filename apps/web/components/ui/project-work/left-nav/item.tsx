import Link from "next/link"
import type { LucideIcon } from "lucide-react"
export type ProjectNavItemProps = {
  label: string
  icon: LucideIcon
  href?: string
}

export default function NavItem({label, icon: Icon, href = "#"}: ProjectNavItemProps) {

  return (
    <Link
      key={label}
      href={href}
      aria-label={label}
      title={label}
      className="
        flex size-10 items-center justify-center rounded-lg
        text-foreground/70 transition-colors
        hover:bg-primary/10 hover:text-primary
      "
    >
      <Icon className="size-5" />
    </Link>
  )

}