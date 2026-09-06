import type { LucideIcon } from "lucide-react"
import {
  Folder,
  Globe,
  Settings,
  Trash2,
  Users,
} from "lucide-react"

export type DrawerMenuActionKey =
  | "collaborations"
  | "assets"
  | "settings"
  | "trash"
  | "publications"

export type DrawerMenuAction = {
  key: DrawerMenuActionKey
  icon: LucideIcon
  label: string
  description?: string
}

export const DRAWER_MENU_ACTIONS: DrawerMenuAction[] = [
  {
    key: "collaborations",
    icon: Users,
    label: "Collaborations",
  },
  {
    key: "assets",
    icon: Folder,
    label: "Assets",
    description: "Mes fichiers",
  },
  {
    key: "settings",
    icon: Settings,
    label: "Settings",
    description: "Préférences et compte",
  },
  {
    key: "trash",
    icon: Trash2,
    label: "Corbeil",
  },
  {
    key: "publications",
    icon: Globe,
    label: "Publications",
    description: "Mes projets publiés",
  },
]
