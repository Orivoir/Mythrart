import type { LucideIcon } from "lucide-react"
import Navigate from "./navigate"
import Action from "./action"
import Content from "./content"

export interface BottomNavigationItemProps {
  icon: LucideIcon
  label: string
  active?: boolean
  href?: string
  onClick?: () => void
}

export function BottomNavigationItem({
  icon: Icon,
  label,
  active = false,
  href,
  onClick,
}: BottomNavigationItemProps) {
  
  const content = (
    <Content active={active} label={label} icon={Icon} />
  )

  if (href) {
    return <Navigate content={content} active={active} href={href} /> 
  }

  return (
    <Action content={content} onClick={onClick} />
  )
}