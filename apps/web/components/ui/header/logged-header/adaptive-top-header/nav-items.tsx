import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  BookOpen,
  Compass,
  Folder,
  House,
} from "lucide-react"

export type TopNavItem = {
  icon: LucideIcon
  label: string
  href: string
  // Kept visible when the header is reduced to its essentials (quick workspace).
  quickWorkspace?: boolean
}

export const TOP_NAV_ITEMS: TopNavItem[] = [
  {
    icon: House,
    label: "Accueil",
    href: "/dashboard",
    quickWorkspace: true,
  },
  {
    icon: Folder,
    label: "Projets",
    href: "/dashboard/projects",
    quickWorkspace: true,
  },
  {
    icon: Compass,
    label: "Explorer",
    href: "/dashboard/explore",
    quickWorkspace: true,
  },
  {
    icon: BookOpen,
    label: "Bibliothèque",
    href: "/dashboard/library",
    quickWorkspace: true,
  },
  {
    icon: BarChart3,
    label: "Statistiques",
    href: "/dashboard/stats",
  },
]
